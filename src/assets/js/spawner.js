

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
            let element = this.objectPool.getElement()
            //element.data.update()
            this.timeSinceSpawn = 0
        }

        for (let i = 0; i < this.objectPool.poolArray.length; i++) {
            if (!this.objectPool.poolArray[i].free) {
                // if (this.objectPool.poolArray[i].free == false) {
                this.objectPool.poolArray[i].data.update()
            }
            // }
        }
    }

    draw(context, deltaTime) {

        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            if (this.objectPool.poolArray[e].free == false) {
                if (this.objectPool.poolArray[e].data.dx < 500 && this.objectPool.poolArray[e].data.dx > -50 && this.objectPool.poolArray[e].data.dy > -50 && this.objectPool.poolArray[e].data.dy < 275) {
                    this.objectPool.poolArray[e].data.draw(context, deltaTime)
                    //console.log(this.objectPool.poolArray[e].data)
                }
                else {
                    this.objectPool.releaseElement(this.objectPool.poolArray[e])
                    // console.log('Just released:')
                    // console.log(this.objectPool.poolArray[e])
                }
            }
        }
    }

    getActiveObjects() {
        let numActiveObjects = 0
        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            if (this.objectPool.poolArray[e].free == false) {
                numActiveObjects = numActiveObjects + 1
            }

        }
        return numActiveObjects
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