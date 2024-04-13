class ObjectPool {
    constructor(objectType) {
        this.objectType = objectType
        this.pool = []
    }

    borrowObject() {
        if (this.pool.length === 0) {
            console.log(`Creating a new ${this.objectType}`)
            return { type: this.objectType }
        } else {
            console.log(`Reusing a ${this.objectType} from the pool`)
            return this.pool.pop()
        }
    }

    returnObject(obj) {
        this.pool.push(obj)
    }
}

export default class Spawner {
    constructor() {
        this.spawnedObjects = []
        this.objectPools = {}
    }

    registerObjectPool(objectType) {
        this.objectPools[objectType] = new ObjectPool(objectType)
    }

    spawnObject(objectType, objectId, spawnInterval, totalSpawnCount) {
        let spawnCount = 0
        const intervalId = setInterval(() => {
            if (spawnCount < totalSpawnCount) {
                const object = this.objectPools[objectType].borrowObject()
                object.id = objectId + spawnCount
                object.spawned = true
                object.location = generateRandomLocation()

                setTimeout(() => {
                    object.spawned = false
                    object.location = null
                    this.objectPools[objectType].returnObject(object)
                    this.spawnedObjects = this.spawnedObjects.filter(obj => obj !== object)
                }, spawnInterval) // Set timeout to despawn object after specified interval

                this.spawnedObjects.push(object) // Add object to spawnedObjects array
                spawnCount++
            } else {
                clearInterval(intervalId) // Stop spawning objects after reaching totalSpawnCount
            }
        }, spawnInterval) // Spawn objects at specified interval
    }

    startSpawningObjects(objectType, objectId, spawnInterval, totalSpawnCount) {
        if (!this.objectPools[objectType]) {
            this.registerObjectPool(objectType)
        }
        this.spawnObject(objectType, objectId, spawnInterval, totalSpawnCount)
    }

    getAllSpawnedObjects() {
        return this.spawnedObjects
    }
}
