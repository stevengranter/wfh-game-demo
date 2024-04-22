"use strict"

// Import required classes and utility functions
import CollisionDetector from "./collision-detector.js"
import Observable from "./observable.js"
import { playerStates } from "./player-state.js"
import { GameScene } from "./game-scene.js"
import { typeWriter, animateBlur, getRandomInt } from "./utils.js"
import { Enemy } from "./enemy.js"
import { scene00Config } from "./cfg/scene00.cfg.js"
import { scene01Config } from "./cfg/scene01.cfg.js"


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


    // Method to add scene to game instance
    addScene(gameScene) {
        if (gameScene instanceof GameScene) {
            this.#scenes.push(gameScene)
            console.log("Game scene added")
        } else {
            console.warn("Invalid scene type. Expected GameScene.")
        }
    }

    // the main game loop
    loop(timeStamp, scene = this.currentScene) {
        // console.log("this.isSceneOver: ", this.isSceneOver)
        // Guard clauses to exit the loop if any of the conditions are met

        // if there is no reference to player, input, or UI
        if (!this.isReady) {
            console.error("Player, input and/or UI not defined for GameWorld")
            return
        }

        // if currentScene hasn't been declared for some reason
        if (!scene) {
            console.error("No currentScene defined for Gameworld loop")
            return
        }

        // if the game is paused, we don't want to run the loop
        if (this.isPaused) {
            return
        }

        // unless the gameState is "play", we shouldn't run the loop
        if (this.#gameState !== gameStateKeys.PLAY) {
            console.warn("Game state isn't in play state")
            return
        }

        // if the scene has ended, we should exit the loop
        if (this.isSceneOver) {
            this.ui.show(this.ui.endsceneScreen)
            console.log("Game scene has ended")
            return
        }

        // if the music has ended, we should be at the end of the scene, and gameplay should stop
        if (scene.music.currentTime === 0) {
            console.log("Music has ended, scene is over")
            return
        }

        // here we don't exit the loop (through return statement), 
        // but we do want to set the player state to trigger animation 
        // and stats changes
        if (!this.player.stats.isAlive) {
            // this.player.stats.isAlive = false
            this.player.setState(playerStates.DEAD)
            console.log("Player is Dead")
        }


        // Timekeeping, setting deltaTime with each frame
        GameWorld.#deltaTime = (timeStamp - this.lastTime) / 1000
        this.lastTime = timeStamp

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Update the currentScene(includes background layers, player sprite and spawned items)
        scene.update(GameWorld.#deltaTime, this.input)

        // Detect collisions by calling CollisionDetector (using AABB algorithm)
        if (this.player.stats.isAlive) {
            this.detectCollisions()
            this.detectProjectileCollisions()
            this.detectPlayerByEnemies()
        }

        // console.log("player.dy = ", this.player.dy)

        // Draw the scene to the canvas
        scene.draw(this.ctx, true, true, true)

        // requestAnimationFrame to get next frame
        requestAnimationFrame(this.loop.bind(this))


    }

    detectCollisions() {
        let colliders = this.spawner.getAllSpawnedObjects()
        // console.log(colliders)

        // console.log("colliders: ", colliders.length)
        if (colliders.length !== 0 || colliders !== undefined) {
            colliders.forEach((collider) => {
                const playerInRange = collider.detectPlayer({ 'dx': this.player.dx, 'dy': this.player.dy })
                if (playerInRange) {

                    let collisionObject = CollisionDetector.detectBoxCollision(this.player, collider)
                    if (collisionObject) {
                        // console.log(collisionObject)
                        this.notify(collisionObject)
                    }
                }
            })

        }
    }

    detectPlayerByEnemies() {
        let enemies = this.spawner.getAllEnemies()
        if (enemies.length === 0 || !enemies) {
            // console.log("No enemies detected")
        }
        enemies.forEach((enemy) => {
            if (enemy.detectPlayer({ 'dx': this.player.dx, 'dy': this.player.dy }, 150)) {
                enemy.launchProjectile({ velocityX: 10, velocityY: getRandomInt(100, 300) })
            }
        })
    }

    detectProjectileCollisions() {
        let enemies = this.spawner.getAllEnemies()
        // console.log(enemies)
        if (enemies.length !== 0 || enemies !== undefined) {
            enemies.forEach((enemy) => {
                if (enemy instanceof Enemy) {
                    // enemy.launchProjectile({ velocityX: 0, velocityY: getRandomInt(50, 300) })
                    // console.dir(enemy.projectile)
                    let collisionProjectileObject = CollisionDetector.detectBoxCollision(this.player, enemy.projectile)
                    // if (collisionProjectileObject) console.dir(collisionProjectileObject)
                    if (collisionProjectileObject) {
                        this.notify(collisionProjectileObject)
                    }
                }
            })
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
        clearInterval(this.goalCheckIntervalId)
        clearInterval(this.sceneTimeIntervalId)
        clearInterval(this.#currentScene.intervalId)

        this.gameState = gameStateKeys.SCENE_END
        this.isSceneOver = true
        this.isPaused = true
        this.spawner.reset()

        console.log(this.spawner)

        this.pauseMusic()
        // console.log("player progress before set: " + this.player.stats.progress)
        this.player.stats.progress += 1
        console.log("winner winner chicken dinner")
        // console.log("player progress after set: " + this.player.stats.progress)

        this.readyScene(scene01Config)
        const currentSceneIndex = this.player.stats.progress
        this.currentScene = this.#scenes[currentSceneIndex]




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

            this.startScene()


        })

        document.getElementById("goto-shop-button").addEventListener("click", (e) => {

            this.runShop()


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
        // console.log(this.sceneGoals)
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


    // 🌊 Function to load and ready scene and add to GameWorld instance
    readyScene(sceneConfig) {
        // scene01Config imported from cfg/scene01.cfg.js
        const scene = new GameScene(sceneConfig, this.player)

        // Add scene to game instance
        this.addScene(scene)

        // Add spawner to sprite Layer in scene
        scene.spriteLayer.spawner = this.spawner

    }


    startScene = () => {

        // TODO: fix
        this.isSceneOver = false
        const sceneIndex = this.player.stats.progress
        this.currentScene = this.#scenes[sceneIndex]
        console.log("currentScene is now", sceneIndex, this.currentScene)
        this.initSceneGoals()
        this.initSceneEvents()
        // console.log(this.currentScene)
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
                    // console.log(this.currentScene.isMusicLoaded)
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
            //  this.player.stats.lives = 3
            this.player.stats.score = 0
            this.player.stats.healthMax = 100
            this.player.stats.health = 100
            this.player.stats.wienersCollected = 0
            this.player.stats.isAlive = true

        }

        const curtainUp = () => {
            this.gameState = gameStateKeys.PLAY
            this.ui.toggleUI(this.gameState)
            this.isPaused = false
            this.loop(0)
        }

        const checkGoal = () => {
            // console.log("running checkGoal()")
            if (!this.isSceneOver) {
                if (this.player.stats.score >= this.sceneGoals.bronze.value) {
                    console.log("You won! ⭐️")
                    this.endScene()
                }
            }
        }

        const notifyTimeRemaining = () => {
            // console.log("running notifyTimeRemaining")
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
        this.goalCheckIntervalId = setInterval(checkGoal, 500)

        // Send observers the time remaining every 1s
        this.sceneTimeIntervalId = setInterval(notifyTimeRemaining, 1000)


        console.log("player.progress: " + this.player.stats.progress)

        // Call the functions in the desired order

        setTimeout(placesPlayer, 1000)
        setTimeout(playMusic, 500)
        setTimeout(curtainUp, 1000)
    }


    runIntro() {

        // console.log(this.ui)

        // console.log(this.player.stats)



        // console.dir(this.currentScene)

        this.ui.toggleUI("cutscene")



        this.ui.hide(this.ui.elements.titleScreen)
        this.ui.hide(this.ui.elements.shopScreen)
        this.ui.show(this.ui.elements.introScreen)

        this.ui.show(this.ui.elements.popupNan)
        setTimeout(() => { this.ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { this.ui.elements.popupNan.style.transform = "translateY(0px)" }, 700)

        this.readyScene(scene00Config)
        const currentSceneIndex = this.player.stats.progress
        this.currentScene = this.#scenes[currentSceneIndex]

        this.currentScene.draw(this.ctx, false, true, true)
        setTimeout(() => { animateBlur(this.currentScene, this.ctx, 0.5, 2, 0.2) }, 1000)
        const dialogText = document.querySelector('#intro-dialog div').textContent
        typeWriter('intro-dialog', dialogText, 25)
        // console.log("player.stats.isAlive: " + this.player.stats.isAlive)

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
        // console.log(this.ui)
        let dialogText = document.querySelector('#shop-dialog div').textContent
        typeWriter('shop-dialog', dialogText, 25)

        this.readyScene(scene01Config)

        document.getElementById("item-rainbonnet").querySelector(".buy-button").addEventListener("pointerdown", () => {
            let dialogText = "You don't have enough points for that. I can't just be giving stuff away now can I?"
            typeWriter('shop-dialog', dialogText, 25)
            setTimeout(() => {
                typeWriter('shop-dialog', "Sorry, come back once you get some more points.", 25)
            }, 5000) // Delay the second message by 5 seconds
            setTimeout(() => {
                this.isSceneOver = false
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
            console.log(this.gameState)
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
            // this.music.currentTime = this.musicPausedTimes
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

}

