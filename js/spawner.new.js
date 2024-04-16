import Sprite from "./sprite.js"
import { CANVAS, CTX } from "./constants.js"

class ObjectPool {
    constructor(objectType) {
        this.objectType = objectType
        this.pool = []
        this.configGenerator = null
    }

    borrowObject() {
        if (this.pool.length === 0) {
            console.log(`Creating a new ${this.objectType}`)
            const newObj = { type: this.objectType }
            if (typeof this.configGenerator === 'function') {
                Object.assign(newObj, this.configGenerator())
            }
            return newObj
        } else {
            console.log(`Reusing a ${this.objectType} from the pool`)
            const obj = this.pool.pop()
            if (obj && obj.hasOwnProperty("configObject")) {
                console.log("borrowObject: object has configObject")
            }
            return obj
        }
    }

    returnObject(obj) {
        if (obj && obj.hasOwnProperty("configObject")) {
            // console.log("returnObject: object has configObject")
        }
        this.pool.push(obj)
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


    spawnObject(objectType, objectId, spawnDrawTime, totalSpawnCount, spawningDuration) {
        let spawnCount = 0
        const timeBetweenSpawns = spawningDuration / totalSpawnCount // Calculate time between spawns

        const intervalId = setInterval(() => {
            if (spawnCount < totalSpawnCount) {
                if (this.objectPools[objectType] && typeof this.objectPools[objectType].configGenerator === 'function') {
                    const objectConfig = this.objectPools[objectType].configGenerator()
                    const object = new Sprite(objectConfig)
                    if (object.parentSpriteTag) {
                        console.log("parent is:" + object.parentSpriteTag)
                    }

                    object.id = objectId + spawnCount
                    object.spawned = true
                    object.objectType = objectType

                    setTimeout(() => {
                        object.spawned = false
                        object.location = null
                        this.objectPools[objectType].returnObject(object)

                        const index = this.spawnedObjects.indexOf(object)
                        if (index !== -1) {
                            this.spawnedObjects.splice(index, 1)
                        }
                    }, spawnDrawTime * 1000) // Convert seconds to milliseconds for setTimeout

                    this.spawnedObjects.push(object)
                    spawnCount++
                }
            } else {
                clearInterval(intervalId)
            }
        }, timeBetweenSpawns * 1000) // Convert seconds to milliseconds for setInterval
    }

    startSpawningObjects(objectType, objectId, spawnDrawTime, totalSpawnCount, spawningDuration) {
        if (!this.objectPools[objectType]) {
            console.error(`Object pool for ${objectType} not registered.`)
            return
        }
        this.spawnObject(objectType, objectId, spawnDrawTime, totalSpawnCount, spawningDuration)
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
            const objectType = object.objectType
            if (object instanceof Sprite && object.spawned) {
                object.update(deltaTime)
                // console.log(object)
                // Decrease the remaining time for the spawned object
                object.timeLimit -= deltaTime
                // console.log("🚀 ~ Spawner ~ update ~ object.timeLimit:", object.timeLimit)


                // Return the object to the pool if the time limit is reached
                if (object.timeLimit <= 0) {
                    object.spawned = false
                    object.location = null
                    this.objectPools[objectType].returnObject(object)// TODO: not being returned, fix
                    this.spawnedObjects = this.spawnedObjects.filter(obj => obj !== object)
                }
            }
        })

        this.timeSinceSpawn += deltaTime * 1000
        if (this.timeSinceSpawn >= this.spawnDrawTime) {
            // const objectType = this.objectPools.objec
            const objectPool = this.objectPools[objectType]
            const element = objectPool.borrowObject()
            element.timeLimit = spawnDrawTime
            // Call the update method on the borrowed object's data
            element.update()

            objectPool.returnObject(element)

            this.timeSinceSpawn = 0
        }
    }


}