
export default class Observable {
    #observers
    constructor() {
        this.#observers = []
    }

    subscribe(observer) {
        this.#observers.push(observer)
    }

    unsubscribe(observer) {
        const index = this.#observers.indexOf(observer)
        if (index > -1) {
            this.#observers.splice(index, 1)
        }
    }

    notify(data) {
        // console.dir("#observers:" + this.#observers)
        this.#observers.forEach(observer => {
            // console.dir(observer)
            observer.message(data)
        })
    }
}