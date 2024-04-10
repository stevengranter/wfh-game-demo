import Observable from "./Observable.js"

export default class Stats extends Observable {
    #lives
    #progress
    #health
    #healthMax
    #score



    constructor() {

        super()


        this.#progress

        this.#health
        this.#healthMax = 100
        this.#lives

        this.#score


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