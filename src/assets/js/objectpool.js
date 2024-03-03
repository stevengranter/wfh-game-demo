

export default class ObjectPool {

    // initialize 
    poolArray
    // resetFunction = () => { }
    // constructorFunction = () => { }

    constructor(
        constructorFunction,
        resetFunction = (obj) => obj,
        initialSize = 10
    ) {
        this.constructorFunction = constructorFunction
        this.resetFunction = resetFunction
        this.poolArray = new Array(initialSize)
            .fill('blerg', 0, initialSize)
            .map(() => this.createElement())

        this.poolArray.forEach((e) => console.log(e))

    }



    createElement() {
        const data = this.constructorFunction()
        return new ObjectPoolMember(data)
    }

    getElement() {
        for (let i = 0; i < this.poolArray.length; i++) {
            if (this.poolArray[i].free) {
                this.poolArray[i].free = false
                return this.poolArray[i]
            }
        }
    }
    releaseElement(element) {
        element.free = true
        this.resetFunction(element.data)
    }
}
export class ObjectPoolMember {
    constructor(data) {
        this.free = true
        this.data = data
    }
}



