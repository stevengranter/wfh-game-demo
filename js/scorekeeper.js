
import Observable from "./observable.js"

export default class ScoreKeeper extends Observable {
    #finalScore
    #currentScore
    #sceneScores
    #comboCounter = 0
    constructor(initialScore) {
        super()
        this.#currentScore = initialScore || 0
        this.#sceneScores = []
    }



    get currentScore() {
        return this.#currentScore
    }

    set currentScore(value) {
        this.#currentScore = value
        // console.log(this.#currentScore)
        this.notify({ score: this.#currentScore })
    }

    get finalScore() {
        return this.#finalScore
    }

    set finalScore(score) {
        this.#finalScore = score
        this.storeSceneScore(this.#finalScore)
    }

    get comboCounter() {
        return this.#comboCounter
    }

    calculateCombo(data) {
        // console.log(data)
        if (data.tag === "wiener") {
            this.comboCounter = 1
        } else {
            this.comboCounter = 0
        }
    }

    set comboCounter(value) {
        switch (value) {
            case 1:
                this.#comboCounter++
                // console.log("combo incremented: ", this.#comboCounter)
                break
            case -1:
                this.#comboCounter--
                // console.log("combo decremented:", this.#comboCounter)
                break
            case 0:
                this.#comboCounter = 0
                // console.log("combo reset:", this.#comboCounter)
                break
            default:
                break
        }
        this.notify({ comboCounter: this.#comboCounter })
    }

    storeSceneScore(score) {
        this.#sceneScores.puhs(score)
    }


}