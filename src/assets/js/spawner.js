

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
            console.log(`Just got: ${e.data}`)
            this.timeSinceSpawn = 0
        }
    }

    draw(context, deltaTime) {
        for (let e = 0; e < this.objectPool.poolArray.length; e++) {
            if (this.objectPool.poolArray[e].free == false) {
                if (this.objectPool.poolArray[e].data.dy < 275) {
                    this.objectPool.poolArray[e].data.update()
                    this.objectPool.poolArray[e].data.draw(context, deltaTime)
                }
                else if (this.objectPool.poolArray[e].data.dy >= 275) {
                    this.objectPool.releaseElement(this.objectPool.poolArray[e])
                    console.log(`Just released: ${this.objectPool.poolArray[e].data}`)
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