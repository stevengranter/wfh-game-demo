

export default class Spawner {

    constructor(spawnInterval = 5, objectPool) {
        this.spawnInterval = spawnInterval * 1000 // multiply to get milliseconds
        this.objectPool = objectPool
        this.timeSinceSpawn = 0
    }

    update(deltaTime) {
        this.timeSinceSpawn += deltaTime
        // console.log(this.timeSinceSpawn)
        if (this.timeSinceSpawn >= this.spawnInterval) {
            let e = this.objectPool.getElement()
            // console.log(`Just got: ${e.data}`)
            this.timeSinceSpawn = 0
        }

        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            this.objectPool.poolArray[e].data.update()
        }
    }

    draw(context, deltaTime) {
        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            if (this.objectPool.poolArray[e].free == false) {
                if (this.objectPool.poolArray[e].data.dy < 275 && this.objectPool.poolArray[e].data.dx < 475 && this.objectPool.poolArray[e].data.dx > 0) {
                    this.objectPool.poolArray[e].data.draw(context, deltaTime)
                }
                else {
                    this.objectPool.releaseElement(this.objectPool.poolArray[e])
                    // console.log('Just released:')
                    // console.log(this.objectPool.poolArray[e])
                }
            }
        }
    }

    getFreeObjects() {
        let numFreeObjects = 0
        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            if (this.objectPool.poolArray[e].free == true) {
                numFreeObjects = numFreeObjects + 1

            }

        }
        return numFreeObjects
    }
}