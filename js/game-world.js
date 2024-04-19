"use strict"

// Import required classes and utility functions
import CollisionDetector from "./collision-detector.js"
import Observable from "./observable.js"
import { playerStates } from "./player-state.js"
import { GameScene } from "./game-scene.js"
import { typeWriter, animateBlur, getRandomInt } from "./utils.js"
import { Enemy } from "./enemy.js"


export const gameStateKeys = {
    TITLE: "title",
    START: "start",
    INTRO: "intro",
    PLAY: "play",
    PAUSED_BY_PLAYER: "paused-by-player",
    SCENE_END: "scene-end",
    GAMEOVER: "game-over",
    END: "game-end",
    CREDITS: "credits",
}

export const musicStateKeys = {
    PAUSED: "paused",
    PLAYING: "playing",
    STOPPED: "stopped",
    READY: "ready"
}

export class GameWorld extends Observable {
    #gameState
    #scenes
    #currentScene
    #timeRemaining

    // set #deltaTime to 1 to avoid a NaN error when starting the game loop
    static #deltaTime = 1

    constructor(player, ui, input) {
        super()

        this.#currentScene = {
            intervalId: null
        }
        this.#gameState = gameStateKeys.TITLE
        this.#scenes = []


        this.isReady = false
        this.player = player
        this.ui = ui
        this.input = input

        if (this.player && this.ui && this.input) {
            this.isReady = true
        }


        this.canvas = document.getElementById("game-screen__canvas")
        this.ctx = this.canvas.getContext("2d")

        this.lastTime = 0
        this.comboCounter = 0
    }


    // Getter/setter for private #gameState variable
    get gameState() {
        return this.#gameState
    }

    set gameState(gameState) {
        this.#gameState = gameState
        this.notify({ gameState: this.#gameState })
    }

    // Getter/setter for private #currentScene variable
    get currentScene() {
        return this.#currentScene
    }

    set currentScene(scene) {
        this.#currentScene = scene
        this.notify({ currentScene: this.#currentScene })
    }

    // Getter for private static #deltaTime variable 
    // (No setter defined, as #deltaTime should only be set by the GameWorld class in the game loop)
    static get deltaTime() {
        return GameWorld.#deltaTime
    }



    addScene(gameScene) {
        if (gameScene instanceof GameScene) {
            this.#scenes.push(gameScene)
            console.log("Game scene added")
        } else {
            console.warn("Invalid scene type. Expected GameScene.")
        }
    }


    loop(timeStamp) {
        // console.log(this.#gameState)
        // console.log("in game loop")
        if (!this.isReady) {
            console.error("Player, input and/or ui not defined for GameWorld")
            return
        }
        if (this.currentScene === undefined) {
            console.error("No currentScene defined for Gameworld loop")
            return
        }
        if (this.#gameState !== gameStateKeys.PLAY) {
            console.warn("Game state isn't in play state")
            return
        }
        if (this.isPaused === false && this.isSceneOver != false) {
            GameWorld.#deltaTime = (timeStamp - this.lastTime) / 1000
            this.lastTime = timeStamp

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            // console.log(this.player.velocityX)
            this.currentScene.update(GameWorld.#deltaTime, this.input)
            // this.player.update(this.input, GameWorld.#deltaTime)
            // this.spawner.update(GameWorld.#deltaTime)


            if (this.currentScene.music.currentTime >= 0) {
                // Only detect collisions when player is alive
                if (this.player.isAlive === true) {

                    // console.log(this.currentScene.spriteLayer.spawners)

                    // this.spawner.forEach((spawner) => {
                    // console.log(spawner)
                    let colliders = this.spawner.getAllSpawnedObjects()
                    // console.log(colliders)

                    // console.log("colliders: ", colliders.length)
                    if (colliders.length !== 0 || colliders !== undefined) {
                        colliders.forEach((collider) => {
                            const playerInRange = collider.detectPlayer({ 'dx': this.player.dx, 'dy': this.player.dy })
                            if (playerInRange) {
                                if (collider instanceof Enemy) {
                                    collider.launchProjectile({ velocityX: 0, velocityY: getRandomInt(50, 300) })
                                    // console.dir(collider.projectile)
                                    let collisionProjectileObject = CollisionDetector.detectBoxCollision(this.player, collider.projectile)
                                    console.dir(collisionProjectileObject)
                                    if (collisionProjectileObject) {
                                        this.notify(collisionProjectileObject)
                                    }
                                }
                                let collisionObject = CollisionDetector.detectBoxCollision(this.player, collider)
                                if (collisionObject) {
                                    // console.log(collisionObject)
                                    this.notify(collisionObject)
                                }
                            }
                        })


                        // let collisionObject = CollisionDetector.detectBoxCollision(this.player, collider)
                        // if (collisionObject != undefined) {
                        //     // console.log(collisionObject)
                        //     this.notify(collisionObject)


                    }
                } else {
                    // console.log("gameloop: player is dead")
                    this.player.isAlive = false
                    this.player.setState(playerStates.DEAD)

                }

            } else {
                // console.log("showing endScreen")
                this.ui.show(this.ui.endsceneScreen)
            }
            this.currentScene.draw(this.ctx, true, true, true)
            // this.spawner.draw(this.ctx)

            // this.player.draw(this.ctx)


            requestAnimationFrame(this.loop.bind(this))
        } else {
            this.pauseGame()
            console.log("game is paused")
        }

    }



    startGame = () => {

        // console.log(player.stats)
        // console.log(this.ui)

        // scene01.layers[0].filter = "none"


        this.initScene()

        this.gameState = gameStateKeys.PLAY
        this.ui.toggleUI(this.gameState)

        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
        // canvas.classList.remove("hidden")

        this.currentScene = game.scenes[0]

        // console.log(this.currentScene)

    }








    stopGame() {
        console.log("game has stopped")
    }



    endScene() {
        // Pause the game and the music
        this.gameState = gameStateKeys.SCENE_END
        this.isSceneOver = true
        this.isPaused = true
        this.spawner.reset()
        clearInterval(this.#currentScene.intervalId)
        this.pauseMusic()
        // console.log("player progress before set: " + this.player.stats.progress)
        this.player.stats.progress += 1
        console.log("winner winner chicken dinner")
        // console.log("player progress after set: " + this.player.stats.progress)



        this.ui.toggleUI(this.gameState)

        // window and chicken animations
        const sceneEndContainerDIV = this.ui.elements.sceneEndContainer.querySelector("div")
        setTimeout(() => { sceneEndContainerDIV.style.transform = "translateY(0px)" }, 50)
        setTimeout(() => { this.ui.elements.excitedChicken.style.transform = "rotate(-15deg) translate(0px,50px) scale(100%)" }, 50)

        // Display level stats
        document.getElementById("scene-wieners").textContent = this.player.stats.wienersCollected
        document.getElementById("scene-score").textContent = this.player.stats.score
        document.getElementById("scene-blessings").textContent = this.player.stats.seagullBlessingsReceived


        document.getElementById("next-scene-button").addEventListener("click", (e) => {



            this.runShop()

            // console.log("next scene button clicked")
        })


    }

    initSceneGoals() {

        // console.log(this.currentScene.goals.gold)
        this.sceneGoals = {}

        // Check if the goals property exists and is not undefined
        if (this.currentScene.goals && Object.keys(this.currentScene.goals).length > 0) {
            // Iterate over the entries of the goals object
            Object.entries(this.currentScene.goals).forEach(([key, value]) => {
                // console.log(key, value)
                this.sceneGoals[key] = value
                console.log("scene has goals")

            })
        } else {
            // If goals is undefined or has no keys, it's considered empty
            console.log("scene has no goals or goals property is undefined")
        }
        console.log(this.sceneGoals)
    }

    // if (this.currentScene.goals.bronze.type === "score") {
    //     this.scoreGoal = this.currentScene.goals.bronze.value
    //     console.log(this.scoreGoal)
    // }


    initSceneEvents() {
        const spriteLayer = this.currentScene && this.currentScene.spriteLayer
        if (!spriteLayer) {
            console.error('Sprite layer is not defined.')
            return
        }

        const { eventTimeline } = spriteLayer
        if (eventTimeline) {
            eventTimeline.forEach((event) => {
                try {
                    setTimeout(() => {
                        this.spawner.startSpawningObjects(
                            event.objectType,
                            event.objectId,
                            event.totalSpawnCount,
                            event.spawningDuration,
                            event.resetConfig
                        )
                    }, event.startTime)

                } catch (error) {
                    console.error(`Error during event processing: ${error.message}`)
                }
            })
        }
    }





    startScene = () => {

        // TODO: fix

        const sceneIndex = this.player.stats.progress
        this.currentScene = this.#scenes[sceneIndex]
        console.log("currentScene is now", sceneIndex, this.currentScene)
        this.initSceneGoals()
        this.initSceneEvents()
        console.log(this.currentScene)
        this.player.setBounds(this.currentScene.spriteLayer.playerBounds)
        // console.log(this.currentScene.playerBounds)
        // this.player.bounds = this.currentScene.playerBounds

        const playMusic = () => {
            if (this.currentScene.hasOwnProperty("music")) {

                if (this.currentScene.isMusicLoaded) {
                    this.music = this.currentScene.music

                    // Add the ability to adjust volume to the slider
                    const musicVolumeSlider = this.ui.elements.musicRange
                    const musicElement = this.music
                    console.log(this.currentScene.isMusicLoaded)
                    musicVolumeSlider.addEventListener("input", (e) => {
                        const volumeValue = e.target.value
                        musicElement.volume = volumeValue / 100
                    })

                    // Start playing music
                    this.playMusic()



                }
            }
        }

        const placesPlayer = () => {
            this.player.stats.lives = 3
            this.player.stats.score = 0
            this.player.stats.healthMax = 100
            this.player.stats.health = 100
            this.player.stats.wienersCollected = 0
            this.player.isAlive = true

        }

        const curtainUp = () => {
            this.gameState = gameStateKeys.PLAY
            this.ui.toggleUI(this.gameState)
            this.isPaused = false
            this.pauseGame()

            this.loop(0, this.#currentScene)
        }

        const checkGoal = () => {
            // console.log(this.player)
            if (!this.isSceneOver) {
                if (this.player.stats.score >= this.sceneGoals.bronze.value) {
                    console.log("You won! ⭐️")
                    this.endScene()
                }
            }
        }

        const notifyTimeRemaining = () => {
            if (this.music !== undefined) {
                this.#timeRemaining = this.music.duration - this.music.currentTime
                this.notify({ "time-remaining": Math.floor(this.#timeRemaining) })
                if (this.#timeRemaining <= 0) {
                    console.log("Out of Time ⌛️")
                    clearInterval(sceneTimeIntervalId)
                    clearInterval(goalCheckIntervalId)
                    this.gameState = gameStateKeys.SCENE_END
                    this.endScene()
                }

            }
            // console.log(`time remaining: ${Math.floor(this.#timeRemaining)}`)
        }


        // Check for goal every 0.5 seconds
        const goalCheckIntervalId = setInterval(checkGoal, 500)

        // Send observers the time remaining every 1s
        const sceneTimeIntervalId = setInterval(notifyTimeRemaining, 1000)


        console.log("player.progress" + this.player.stats.progress)

        // Call the functions in the desired order

        setTimeout(placesPlayer, 500)
        setTimeout(playMusic, 1000)
        setTimeout(curtainUp, 2000)
    }


    runIntro() {

        // console.log(this.ui)

        // console.log(this.player.stats)

        const currentSceneIndex = this.player.stats.progress
        this.currentScene = this.#scenes[currentSceneIndex]
        // console.dir(this.currentScene)

        this.ui.toggleUI("cutscene")



        this.ui.hide(this.ui.elements.titleScreen)
        this.ui.hide(this.ui.elements.shopScreen)
        this.ui.show(this.ui.elements.introScreen)

        this.ui.show(this.ui.elements.popupNan)
        setTimeout(() => { this.ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { this.ui.elements.popupNan.style.transform = "translateY(0px)" }, 700)
        // function animateBlur(blurValue, maxBlur, step) 

        this.currentScene.draw(this.ctx, false, true, true)
        setTimeout(() => { animateBlur(this.currentScene, this.ctx, 0.5, 2, 0.2) }, 1000)
        const dialogText = document.querySelector('#intro-dialog div').textContent
        typeWriter('intro-dialog', dialogText, 25)
        console.log("player.isAlive: " + this.player.isAlive)

        document.getElementById("intro-dialog").addEventListener("pointerdown", () => {
            setTimeout(() => { this.ui.elements.introDialog.style.transform = "translateY(400px)" }, 500)
            setTimeout(() => { this.ui.elements.popupNan.style.transform = "translateY(475px)" }, 700)
            setTimeout(() => { animateBlur(this.currentScene, this.ctx, 0, 0, 0.1) }, 1000)
            setTimeout(() => this.startScene(), 1300)
        })
    }

    runShop() {

        this.ui.toggleUI("cutscene")
        this.ui.hide(this.ui.elements.titleScreen)
        this.ui.show(this.ui.elements.shopScreen)
        this.ui.hide(this.ui.elements.introScreen)
        console.log(this.ui)
        let dialogText = document.querySelector('#shop-dialog div').textContent
        typeWriter('shop-dialog', dialogText, 25)

        document.getElementById("item-rainbonnet").querySelector(".buy-button").addEventListener("pointerdown", () => {
            let dialogText = "You don't have enough points for that. I can't just be giving stuff away now can I?"
            typeWriter('shop-dialog', dialogText, 25)
            setTimeout(() => {
                typeWriter('shop-dialog', "Sorry, come back once you get some more points.", 25)
            }, 5000) // Delay the second message by 5 seconds
            setTimeout(() => {
                this.startScene()
            }, 2000)
        })



        // setTimeout(() => { this.ui.elements.shopDialog.style.transform = "translateY(-600px)" }, 100)




    }


    receiveUpdate(data) {
        // console.log("gameworld received :", data)
    }

    pauseGame() {
        if (this.isPaused) {
            // console.log(this.gameState)
            this.pauseMusic()
            switch (this.#gameState) {
                case gameStateKeys.PAUSED_BY_PLAYER:
                    this.ui.toggleUI("paused")
                    break
                case gameStateKeys.LEVEL_END:
                    this.ui.toggleUI("level-end")
                    break
                default:
                    console.warn("No UI defined for gamestate: " + this.#gameState)
            }



        }
        else {
            this.#gameState = gameStateKeys.PLAY
            this.ui.toggleUI("play")
            // this.music.currentTime = this.musicPausedTime

            this.playMusic()
            console.log(this.lastTime)
            this.isPaused = false
            this.loop(this.lastTime)

        }
    }

    playMusic() {
        this.music.play()
        this.musicState = musicStateKeys.PLAYING
    }

    pauseMusic() {
        this.music.pause()
        this.musicState = musicStateKeys.PAUSED
    }

    stopMusic() {
        this.music.stop()
        this.musicState = musicStateKeys.PAUSED
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
            // console.log("COMBO!!!")
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

