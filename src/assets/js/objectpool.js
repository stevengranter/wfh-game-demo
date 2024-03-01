

class Pickup {

    constructor(
        context,
        image,
        width = 32,
        height = 32,
        x = (Math.random() * 450),    // TODO: calculate using canvas.width
        y = 0,  // TODO: calculate using canvas.height
        velocityX = 0,
        velocityY = 0
    ) {

        this.image = image
        this.width = width
        this.height = height

        this.x = x
        this.y = y
        this.velocityX = velocityX
        this.velocityY = velocityY

        // console.log((Math.random() * 476))
        // console.log(y)



    }

    draw(context, deltaTime) {
        context.drawImage(
            this.image,
            this.x,
            this.y)
    }

    update() {
        this.x += this.velocityX
        this.y += this.velocityY
    }


}

class ObjectPoolMember {
    constructor(data) {
        this.free = true
        this.data = data
    }
}

class ObjectPool {
    #poolArray
    resetFunction = () => { }
    constructorFunction = () => { }

    constructor(
        constructorFunction,
        resetFunction = (obj) => obj,
        initialSize = 10
    ) {
        this.resetFunction = resetFunction
        this.constructorFunction = constructorFunction
        this.#poolArray = new Array(initialSize)
            .fill(0)
            .map(() => this.createElement())

        // this.#poolArray.forEach((e) => console.log(e))

    }



    createElement() {
        const data = this.constructorFunction()
        return new ObjectPoolMember(data)
    }

    getElement() {
        for (let i = 0; i < this.#poolArray.length; i++) {
            if (this.#poolArray[i].free) {
                this.#poolArray[i].free = false
                return this.#poolArray[i]
            }
        }
    }
    releaseElement(element) {
        element.free = true
        this.resetFunction(element.data)
    }
}

canvas = 'myCanvas'
wienerImage = '🌭'
const creatorFunc = () => new Pickup(canvas, wienerImage, 32, 32, Math.random() * 450, Math.random() * 274, Math.random() * 10, Math.random() * 10)
const resetFunc = (coolThing) => {
    coolThing.x = 0
    coolThing.y = 0
    coolThing.velocityX = 0
    coolThing.velocityY = 0
}

const myPool = new ObjectPool(creatorFunc, resetFunc, 5)
const objectThatIsReadyToUse = myPool.getElement()
console.log("🚀 ~ objectThatIsReadyToUse:", objectThatIsReadyToUse)

// ... doing stuff with objectThatIsReadyToUse.data
myPool.releaseElement(objectThatIsReadyToUse)
console.log("🚀 ~ objectThatIsReadyToUse:", objectThatIsReadyToUse)
console.log(myPool)

class Spawner {

    constructor(spawnInterval = 30, objectPool) {
        this.spawnInterval = spawnInterval
        this.objectPool = objectPool
        this.timeSinceSpawn = 0
    }

    update() {
        this.timeSinceSpawn += deltaTime
        if (this.timeSinceSpawn >= this.spawnInterval) {
            newWiener = this.objectPool.getElement()
            console.log(newWiener)
        }
    }
}

const spawner = new Spawner(10, myPool)
console.log(myPool)
spawner.update()
// wiener = spawner.spawnObject()
// console.log("🚀 ~ spawnObject:", wiener)



