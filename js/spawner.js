"use strict"

import Sprite from "./sprite.js"
import { Enemy } from "./enemy.js"
import { CANVAS, CTX } from "./constants.js"

class ObjectPool {
    constructor(objectType) {
        this.objectType = objectType
        this.pool = []
        this.enemies = []
        this.configGenerator = null
    }

    borrowObject(resetConfig) {
        let obj
        if (this.pool.length > 0) {
            // console.log(`Reusing a ${this.objectType} from the pool`)
            obj = this.pool.pop()
            // console.log("object borrowed from pool")

        } else {
            // console.log(`Creating a new ${this.objectType}`)
            if (typeof this.configGenerator === 'function') {
                if (this.objectType == "gull") {
                    obj = new Enemy(this.configGenerator(), this.childSpriteConfigGenerator())
                    this.enemies.push(obj)
                } else {
                    obj = new Sprite(this.configGenerator())
                    // console.log("object created for pool")
                }
                if (resetConfig) {
                    // console.log("custom reset")
                    obj.resetSprite(resetConfig)
                    // console.log("custom reset applied")
                }
                // console.log(obj)
            }
        }

        return obj
    }

    returnObject(obj, resetConfig) {
        obj.resetSprite()

        if (resetConfig) {
            // console.log("custom reset")
            obj.resetSprite(resetConfig)
        }
        this.pool.push(obj)
        // console.log(`${obj.objectType} returned to pool.`)
    }
}

export default class Spawner {
    constructor() {
        this.spawnedObjects = []
        this.objectPools = {}
        this.spawnIntervals = []
    }

    registerObjectPool(objectType, configGenerator, childSpriteConfigGenerator = null) {
        const objectPool = new ObjectPool(objectType)
        objectPool.configGenerator = configGenerator
        // console.log(childSpriteConfigGenerator)
        if (childSpriteConfigGenerator) objectPool.childSpriteConfigGenerator = childSpriteConfigGenerator
        this.objectPools[objectType] = objectPool
        // console.log(this.objectPools[objectType])
    }

    reset() {
        // Stop all spawning
        this.spawnIntervals.forEach(clearInterval)
        this.spawnIntervals = [] // Clear the list of intervals


        // Loop through all currently spawned objects and return them to their respective pools
        this.spawnedObjects.forEach(object => {
            const pool = this.objectPools[object.objectType]
            if (pool) {
                pool.returnObject(object)
            }
        })

        // Clear the list of spawned objects
        this.spawnedObjects = []

        // reset pools
        // for (const objectType in this.objectPools) {
        //     this.objectPools[objectType].pool = [];
        // }
    }

    spawnObject(objectType, objectId, totalSpawnCount, spawningDuration, resetConfig) {
        let spawnCount = 0
        const timeBetweenSpawns = spawningDuration / totalSpawnCount

        const intervalId = setInterval(() => {
            if (spawnCount >= totalSpawnCount) {
                clearInterval(intervalId)
                return
            }

            const objectPool = this.objectPools[objectType]
            if (!objectPool) {
                return
            }

            const object = objectPool.borrowObject(resetConfig)
            // 
            object.id = `${objectId}-${spawnCount}`
            object.spawned = true
            object.objectType = objectType
            if (object.isOutOfBounds()) {
                object.spawned = false
                object.location = null

                objectPool.returnObject(object, resetConfig)
                this.spawnedObjects = this.spawnedObjects.filter(o => o !== object)
            }

            this.spawnedObjects.push(object)
            spawnCount++
        }, timeBetweenSpawns * 1000)
        this.spawnIntervals.push(intervalId)
    }

    startSpawningObjects(objectType, objectId = objectType, totalSpawnCount = 10, spawningDuration = 10, resetConfig) {
        if (!this.objectPools[objectType]) {
            console.error(`Object pool for ${objectType} not registered.`)
            return
        }
        this.spawnObject(objectType, objectId, totalSpawnCount, spawningDuration, resetConfig)
    }

    getAllSpawnedObjects() {
        return this.spawnedObjects
    }

    draw(context) {
        // console.log("in spawnedobject draw")
        this.spawnedObjects.forEach(object => {
            if (object instanceof Sprite && object.spawned) {
                object.draw(context)
            }
        })
    }

    update(deltaTime) {
        this.spawnedObjects.forEach(object => {
            if (!(object instanceof Sprite && object.spawned)) {
                return
            }

            object.update(deltaTime)
            object.timeLimit -= deltaTime

            if (object.isOutOfBounds()) {
                object.spawned = false
                object.location = null
                this.objectPools[object.objectType].returnObject(object)
                this.spawnedObjects = this.spawnedObjects.filter(obj => obj !== object)
            }
        })
    }
}



