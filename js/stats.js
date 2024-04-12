import Observable from "./observable.js"

export default class Stats extends Observable {
    #lives = 3
    #progress = 0
    #health = 100
    #healthMax = 100
    #score = 0
    #wienersCollected = 0
    #seagullBlessingsReceived = 0



    constructor() {

        super()







        this.deathEvent = new CustomEvent('playerDeath', {
            detail: {
                message: 'Player has died! 💀',
            }
        })


    }




    get lives() {
        return this.#lives
    }

    set lives(value) {
        this.#lives = value
        this.notify({ lives: this.#lives })
    }

    get progress() {
        return this.#progress
    }

    set progress(value) {
        this.#progress = value
        this.notify({ progress: this.#progress })
        console.log("progress is now:" + this.#progress)
    }

    get score() {
        return this.#score
    }

    set score(value) {
        this.#score = value
        this.notify({ score: this.#score })
    }

    get wienersCollected() {
        return this.#wienersCollected
    }

    set wienersCollected(value) {
        this.#wienersCollected = value
        console.log("wieners-collected:" + this.#wienersCollected)
        this.notify({ 'wieners-collected': this.#wienersCollected })

    }

    get seagullBlessingsReceived() {
        return this.#seagullBlessingsReceived
    }

    set seagullBlessingsReceived(value) {
        this.#seagullBlessingsReceived = value
        console.log("seagull-blessings-received:" + this.#seagullBlessingsReceived)
        this.notify({ "seagull-blessings-received": this.#seagullBlessingsReceived })

    }

    get health() {
        return this.#health
    }

    set health(value) {
        // Clamp the value to ensure it's not less than 0 and not greater than #healthMax
        this.#health = Math.max(0, Math.min(value, this.#healthMax))
        // Notify about the health change
        this.notify({ health: this.#health })
    }

    get healthMax() {
        return this.#healthMax
    }

    set healthMax(value) {
        this.#healthMax = value
        this.notify({ healthMax: this.#healthMax })
    }


}