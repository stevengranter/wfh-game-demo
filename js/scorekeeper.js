export default class ScoreKeeper {
    #finalScore
    #currentScore
    #sceneScores
    constructor(initialScore) {
        this.#currentScore = initialScore || 0
        this.#sceneScores = []
    }

    get currentScore() {
        return this.#currentScore
    }

    set currentScore(value) {
        this.#currentScore = value
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