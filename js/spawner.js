import Sprite from "./sprite.js"
import { CANVAS, CTX } from "./constants.js"

class ObjectPool {
    constructor(objectType) {
        this.objectType = objectType
        this.pool = []
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
                obj = new Sprite(this.configGenerator())
                // console.log("object created for pool")

                if (resetConfig) {
                    // console.log("custom reset")
                    obj.resetSprite(resetConfig)
                    console.log("custom reset applied")
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
        // console.log("object returned to pool")
    }
}

export default class Spawner {
    constructor() {
        this.spawnedObjects = []
        this.objectPools = {}
    }

    registerObjectPool(objectType, configGenerator) {
        const objectPool = new ObjectPool(objectType)
        objectPool.configGenerator = configGenerator
        this.objectPools[objectType] = objectPool
    }

    spawnObject(objectType, objectId, spawnDrawTime, totalSpawnCount, spawningDuration, resetConfig) {
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
            object.id = `${objectId}-${spawnCount}`
            object.spawned = true
            object.objectType = objectType

            setTimeout(() => {
                object.spawned = false
                object.location = null

                objectPool.returnObject(object, resetConfig)

                this.spawnedObjects = this.spawnedObjects.filter(o => o !== object)
            }, spawnDrawTime * 1000)

            this.spawnedObjects.push(object)
            spawnCount++
        }, timeBetweenSpawns * 1000)
    }

    startSpawningObjects(objectType, objectId = objectType, spawnDrawTime = 5, totalSpawnCount = 10, spawningDuration = 10, resetConfig) {
        if (!this.objectPools[objectType]) {
            console.error(`Object pool for ${objectType} not registered.`)
            return
        }
        this.spawnObject(objectType, objectId, spawnDrawTime, totalSpawnCount, spawningDuration, resetConfig)
    }

    getAllSpawnedObjects() {
        return this.spawnedObjects
    }

    draw(context) {
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

            if (object.timeLimit <= 0) {
                object.spawned = false
                object.location = null
                this.objectPools[object.objectType].returnObject(object)
                this.spawnedObjects = this.spawnedObjects.filter(obj => obj !== object)
            }
        })
    }
}



