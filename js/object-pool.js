export default class ObjectPool {
    constructor(constructorFunction, resetFunction = (obj) => obj, initialSize = 10, maxSize = 100) {
        this.constructorFunction = constructorFunction
        this.resetFunction = resetFunction
        this.maxSize = maxSize
        this.poolArray = new Array(initialSize)
            .fill('0', 0, initialSize)
            .map(() => this.createElement())
    }

    createElement() {
        const data = this.constructorFunction()
        return new ObjectPoolMember(data)
    }

    getElement() {
        let element = this.poolArray.find((element) => element.free)
        if (!element && this.poolArray.length < this.maxSize) {
            // Increase pool size if near limit
            const newSize = Math.min(this.maxSize, this.poolArray.length * 2) // Double the size or reach maxSize
            while (this.poolArray.length < newSize) {
                this.poolArray.push(this.createElement())
            }
            element = this.poolArray.find((element) => element.free)
        }
        if (element) {
            element.free = false
        }
        return element
    }

    releaseElement(element) {
        this.resetFunction(element.data)
        element.free = true
    }
}

export class ObjectPoolMember {
    constructor(data) {
        this.free = true
        this.data = data
    }
}
