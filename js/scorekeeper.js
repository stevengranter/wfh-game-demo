
import Observable from "./observable.js"

export default class ScoreKeeper extends Observable {
    #finalScore
    #currentScore
    #sceneScores
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
    }

    get finalScore() {
        return this.#finalScore
    }

    set finalScore(score) {
        this.#finalScore = score
        this.storeSceneScore(this.#finalScore)
    }

    storeSceneScore(score) {
        this.#sceneScores.puhs(score)
    }


}