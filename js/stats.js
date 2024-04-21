"use strict"

import Observable from "./observable.js"
import ScoreKeeper from "./scorekeeper.js"

export default class Stats extends Observable {
    #lives = 3
    #progress = 0
    #health = 100
    #healthMax = 100
    #wienersCollected = 0
    #seagullBlessingsReceived = 0
    #isAlive = false
    #score

    constructor() {
        super()

        this.scoreKeeper = new ScoreKeeper()
        this.#score = this.scoreKeeper.currentScore
        // console.log(this.#score)

        this.deathEvent = new CustomEvent('playerDeath', {
            detail: {
                message: 'Player has died! 💀',
            }
        })


    }

    receiveUpdate(data) {
        // console.log("playerstats has received", data)
        if (data.health != undefined) {
            // console.log("health: " + data.health)
            this.health += data.health
        }
        if (data.points != undefined) {
            // console.log("points:" + data.points)
            this.score += data.points
        }
        if (data.tag !== undefined) {
            this.scoreKeeper.calculateCombo(data)
        }
    }


    get isAlive() {
        return this.#isAlive
    }

    set isAlive(booleanValue) {
        this.#isAlive = booleanValue
        this.notify({ 'is-alive': this.#isAlive })
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
        // console.log("#score is", value)
        this.scoreKeeper.currentScore = value
        this.#score = this.scoreKeeper.currentScore
        // console.log(this.#score)
        this.notify({ score: this.scoreKeeper.currentScore })
    }

    get wienersCollected() {
        return this.#wienersCollected
    }

    set wienersCollected(value) {
        this.#wienersCollected = value
        // console.log("wieners-collected:" + this.#wienersCollected)
        this.notify({ 'wieners-collected': this.#wienersCollected })

    }

    get seagullBlessingsReceived() {
        return this.#seagullBlessingsReceived
    }

    set seagullBlessingsReceived(value) {
        this.#seagullBlessingsReceived = value
        // console.log("seagull-blessings-received:" + this.#seagullBlessingsReceived)
        this.notify({ "seagull-blessings-received": this.#seagullBlessingsReceived })

    }

    get health() {
        return this.#health
    }

    set health(value) {
        // Clamp the value to ensure it's not less than 0 and not greater than #healthMax
        this.#health = Math.max(0, Math.min(value, this.#healthMax))
        if (this.#health <= 0) {
            document.dispatchEvent(this.deathEvent)
        }
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