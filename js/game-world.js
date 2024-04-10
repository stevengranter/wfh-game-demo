import CollisionDetector from "./collision-detector.js"
import Observable from "./observable.js"
import { playerStates } from "./player-states.js"
import { spriteTags } from "./sprite.js"
import GameObject from "./game-object.js"

export const gameStateKeys = {
    START: "start",
    INTRO: "intro",
    RUNNING: "running",
    PAUSED_BY_PLAYER: "paused-by-player",
    LEVELEND: "level-end",
    GAMEOVER: "game-over",
    END: "game-end",
    CREDITS: "credits",
}

export class GameWorld extends Observable {
    #currentScene
    #gameState
    #timeRemaining
    constructor(player, ui, input) {
        super()
        this.isReady = false
        this.player = player
        this.ui = ui
        this.input = input

        if (this.player && this.ui && this.input) {
            this.isReady = true
        }


        this.canvas = document.getElementById("game-screen__canvas")
        this.ctx = this.canvas.getContext("2d")


        this.isPaused = false
        this.#gameState = gameStateKeys.START
        this.musicStarted = false
        this.musicPaused = false

        this.lastTime = 0
        this.deltaTime = 1

        this.comboCounter = 0

        window.gameWorld = this
        console.log(window)
        console.log(this)



        // console.log(this)
    }

    static createGameObject(config) {
        return new GameObject(config)
    }

    get gameState() {
        return this.#gameState
    }

    set gameState(gameState) {
        this.#gameState = gameState
        this.notify({ gameState: this.#gameState })
    }

    get currentScene() {
        return this.#currentScene
    }

    set currentScene(scene) {
        this.#currentScene = scene
        this.notify({ currentScene: this.#currentScene })
    }

    notifyTimeRemaining() {
        this.#timeRemaining = window.music.duration - window.music.currentTime
        this.notify({ timeRemaining: Math.floor(this.#timeRemaining) })
        console.log(Math.floor(this.#timeRemaining))
    }

    countDown(timeToCount) {
        let i = timeToCount
        let timerId
        let paused = false

        function runTimer() {
            if (i > 0 && !paused) {
                console.log(this.musicPaused)
                this.notifyTimeRemaining()
                i--
                timerId = setTimeout(runTimer.bind(this), 1000) // Binding 'this' to maintain context
            }
        }

        this.pauseTimer = function () {
            paused = true
            clearTimeout(timerId)
        }

        this.resumeTimer = function () {
            paused = false
            runTimer.call(this)
        }

        runTimer.call(this) //

    }


    loop(timeStamp) {
        // console.log("in loop function")
        if (!this.isReady) {
            console.error("Player, input and/or ui not defined for GameWorld")
        }
        if (!this.currentScene) {
            console.error("No currentScene defined for Gameworld loop")
            return
        }
        if (this.isPaused === false) {
            this.deltaTime = (timeStamp - this.lastTime) / 1000
            this.lastTime = timeStamp

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.currentScene.update(this.deltaTime)
            this.player.update(this.input, this.deltaTime)

            if (this.currentScene.music.currentTime >= 0) {
                // Only detect collisions when player is alive
                if (this.player.isAlive === true) {
                    // console.log(currentScene.spawners)
                    if (this.currentScene.spawners) {
                        this.currentScene.spawners.forEach((spawner) => {

                            let collider = CollisionDetector.detectBoxCollision(this.player, spawner.objectPool.poolArray)
                            // console.log(spawner.objectPool.poolArray)
                            if (collider) {
                                console.log("collision")
                                if (collider.spriteTag === spriteTags.WIENER) {
                                    // console.log(this.player.stats.health)
                                    this.calculateCombo()
                                    this.player.stats.health += collider.healthValue

                                    this.player.stats.score += collider.pointValue
                                    // this.ui.elements.scoreRemaining.innerText = "\ " + (2500 - this.player.stats.score) + " to progress"
                                    this.ui.elements.scoreRemaining.innerText = `( ${2500 - this.player.stats.score} remaining)` //"\ " + (2500 - this.player.stats.score) + " to progress"

                                    if (this.player.stats.score >= 2500) {
                                        // ui.scoreCounterHUD.style.color = "var(--clr-purple)"
                                        // ui.scoreStatusHUD.innerText = "Next Level Unlocked!"
                                        this.player.stats.progress = 1

                                        this.level0Complete()
                                    }
                                    // calculateCombo()
                                } else if (collider.spriteTag === spriteTags.POO) {
                                    console.log("💩")
                                    this.resetCombo()
                                    this.player.stats.health += collider.healthValue
                                    if (this.player.stats.health <= 0) {
                                        this.player.isAlive = false
                                    }

                                } else if (collider.spriteTag === spriteTags.GULL) {
                                    console.log("🐦")
                                }



                            }
                        })
                    }
                } else {
                    console.log("gameloop: player is dead")
                    this.player.isAlive = false
                    this.player.setState(playerStates.DEAD)

                }

            } else {
                console.log("showing endScreen")
                this.ui.show(this.ui.endsceneScreen)
            }

            this.currentScene.draw(this.ctx)
            this.player.draw(this.ctx)


            requestAnimationFrame(this.loop.bind(this))
        } else {
            // this.pauseGame()
            console.log("game is paused")
        }

    }

    stopGame() {
        console.log("game has stopped")
    }

    level0Complete() {
        this.isPaused = true
        window.music.pause()
        console.log("winner winner chicken dinner")
        this.#gameState = gameStateKeys.LEVELEND
        this.pauseGame()

    }
    message(data) {
        // console.log(this.constructor.name + " received :", data)
    }

    pauseGame() {
        if (this.isPaused) {
            console.log(this.gameState)
            this.toggleMusic()
            switch (this.#gameState) {
                case gameStateKeys.PAUSED_BY_PLAYER:
                    this.ui.showUI("paused")
                    break
                case gameStateKeys.LEVELEND:
                    this.ui.showUI("level-end")
                    break
                default:
                    console.log("default: No UI for gamestate")
            }



        }
        else {
            this.ui.showUI("play")
            // window.music.currentTime = this.musicPausedTime

            this.toggleMusic()
            this.loop(this.lastTime)
            this.isPaused = false
        }
    }

    toggleMusic() {
        if (this.musicStarted === false) {
            window.music.play()
            this.musicPaused = false
            this.musicStarted = true
            this.countDown(window.music.duration)
        }
        else if (this.musicPaused === false) {
            window.music.pause()
            this.musicPaused = true
        } else {
            window.music.play()
            this.musicPaused = false
        }
    }

    calculateCombo() {
        this.comboCounter++
        if (this.comboCounter > 0 && this.comboCounter <= 5) {
            for (let i = 1; i <= this.comboCounter; i++) {
                let nthChildSelector = `:nth-child(${i})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = this.ui.elements.hudCombo.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-sky-blue)"
                letter.style.opacity = "100%"
            }
        } else if (this.comboCounter > 5 && this.comboCounter <= 10) {
            for (let i = 6; i <= this.comboCounter; i++) {
                let nthChildSelectorIndex = i - 5
                let nthChildSelector = `:nth-child(${nthChildSelectorIndex})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = this.ui.elements.hudCombo.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-purple)"
                letter.style.opacity = "100%"
            }
        }
        if (this.comboCounter < 5) {
            this.player.speedMultiplier = 1
        } else if (this.comboCounter >= 5 && this.comboCounter < 10) {
            this.player.speedMultiplier = 1.5
        } else if (this.comboCounter >= 10) {
            this.player.speedMultiplier = 2
        }


        if (this.comboCounter === 10) {
            console.log("COMBO!!!")
        }
    }

    resetCombo() {
        this.comboCounter = 0
        this.player.speedMultiplier = 1
        let letters = this.ui.elements.hudCombo.querySelectorAll("span")
        letters.forEach((letter) => {
            letter.style.color = ""
            letter.style.opacity = "50%"
        })
    }

}

