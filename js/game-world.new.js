"use strict"

// Import required classes and utility functions
import CollisionDetector from "./collision-detector.js"
import Observable from "./observable.js"
import { playerStates } from "./player-state.js"
import { GameScene } from "./game-scene.js"
import { typeWriter, animateBlur, wait, getRandomInt } from "./utils.js"
import { Enemy } from "./enemy.js"
import { scene00Config } from "./cfg/scene00.cfg.js"
import { scene01Config } from "./cfg/scene01.cfg.js"
import Player from "./player.js"
import { playerConfig, playerAltConfig } from "./cfg/player.cfg.js"
import UI from "./ui.js"
import InputHandler from "./input-handler.js"
import Spawner from "./spawner.js"

// Import required constants
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    gameStateKeys,
    musicStateKeys
} from "./constants.js"



// 🎬 START of GameWorld class
// GameWorld class is a singleton, as there should only be one instance
export default class GameWorld extends Observable {
    // Declare a static private variable to hold the instance
    static #instance
    static #deltaTime
    #isReady

    // Declare private properties (descriptions provided in constructor comments)
    #player
    #ui
    #input
    #currentScene
    #currentRanking
    #gameState
    #scenes
    #isNextSceneReady



    constructor(canvasId, player, ui, input) {
        if (GameWorld.#instance) {
            throw new Error("You can only create one instance of GameWorld!")
        }

        // Call super method to inherit Observable class props and methods
        super()

        // set #isReady flag if player, ui, and input are valid arguments
        this.#isReady = this.#validateArguments(player, ui, input)



        // #gameState is initialized to "title" for the title screen
        this.#gameState = gameStateKeys.TITLE

        // I GameWorldlize an empty array to score the game's scenes
        this.#scenes = []

        // Initialize the #currentScene.intervalId to null
        this.#currentScene = {
            intervalId: null
        }

        // #currentRanking stores the current rank the player has acheived in the scene
        // (one of: ⭐️ || ⭐️⭐️ || ⭐️⭐️⭐️)
        this.#currentRanking = 0

        // call initializeCanvas method to set canvas and context
        this.initializeCanvas(canvasId)

        // create instance of spawner, store in spawner property
        this.spawner = new Spawner()

        // Freeze the instance to prevent further modification
        GameWorld.#instance = Object.freeze(this)
    }

    // Method sets the #instance static property if it hasn't been defined,
    // otherwise we return the instance
    static getInstance(player, ui, input) {
        if (!GameWorld.#instance) {
            new GameWorld(player, ui, input)
        }
        return GameWorld.#instance
    }

    // Method validates the arguments passed to the GameWorld constructor in
    // getInstance() method
    #validateArguments(player, ui, input) {
        if (!(player instanceof Player)) {
            throw new Error("The provided 'player' is not an instance of Player class")
        } else {
            this.#player = player
        }
        if (!(ui instanceof UI)) {
            throw new Error("The provided 'ui' is not an instance of UI class")
        } else {
            this.#ui = ui
        }
        if (!(input instanceof InputHandler)) {
            throw new Error("The provided 'input' is not an instance of Input class")
        } else {
            this.#input = input
        }
    }

    // Method to initialize canvas and context(ctx) properties,
    // throws an error if canvasId passed isn't valid
    initializeCanvas(canvasId) {
        try {
            this.canvas = document.getElementById(canvasId)
            this.ctx = this.canvas.getContext("2d")
            console.log(this)
            return true
        } catch {
            throw new Error("The provided canvasId is not a canvas element")
        }

    }

    // Getter for private deltaTime property,
    // as this should be the only deltaTime in the game, 
    // it is set as a private class property
    static get deltaTime() {
        return GameWorld.#deltaTime
    }

    // Getter/setter for private #gameState property
    get gameState() {
        return this.#gameState
    }

    set gameState(gameState) {
        this.#gameState = gameState
        this.notify({ gameState: this.#gameState })
    }

    // Getter for player property
    // (No setter as it shouldn't be modified from the outside)

    get player() {
        return this.#player
    }
    // Getter for ui property
    // (No setter as it shouldn't be modified from the outside)

    get ui() {
        return this.#ui
    }
    // Getter for input property
    // (No setter as it shouldn't be modified from the outside)

    get input() {
        return this.#input
    }

    // Getter/setter for private #currentScene property
    get currentScene() {
        return this.#currentScene
    }
    set currentScene(scene = null) {
        const sceneIndex = this.player.stats.progress
        this.#currentScene = this.#scenes[sceneIndex]
        // this.#currentScene = scene
        this.notify({ currentScene: this.#currentScene })
    }

    // Getter for private #scenes property
    // Modifying this property is provided through the addScene() method
    get scenes() {
        return this.#scenes
    }

    // Privcate method to add scene to game instance
    #addScene(gameScene) {
        if (gameScene instanceof GameScene) {
            this.#scenes.push(gameScene)
            console.log(`✔️ ${gameScene.constructor.name} added to scenes array (${gameScene.name})`)
            // console.dir(gameScene)
        } else {
            console.warn("Invalid scene type. Expected GameScene.")
        }
    }

    // Getter/setter for private #currentRanking property
    get currentRanking() {
        return this.#currentRanking
    }
    set currentRanking(value) {
        this.#currentRanking = value
        this.notify({ 'current-ranking': this.#currentRanking })
    }

    // Method to load scene and add to scenes array property of GameWorld instance
    loadScene(sceneConfig) {
        try {
            // Pass the sceneConfig and player to the GameScene constructor
            const scene = new GameScene(sceneConfig, this.player)

            // Add scene to game instance
            this.#addScene(scene)

            // Ensure spriteLayer exists before adding spawner
            if (scene.spriteLayer) {
                scene.spriteLayer.spawner = this.spawner
            } else {
                console.error("spriteLayer does not exist on the scene object")
            }

            // set nextSceneReady flag to true, log to console
            this.#isNextSceneReady = true
            console.log(`✅ %cScene is loaded and ready: ${scene.name}`, `color: green;`)
        } catch (error) {
            console.error("Could not load next scene", error)
        }
    }

    initializeEventListeners() {
        wait(200).then(() => {
            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    game.isPaused = !game.isPaused
                    game.gameState = gameStateKeys.PAUSED_BY_PLAYER
                    game.pauseGame()
                }
            })
        })
    }


    // Method to start the game (called when pressing the Start button)
    startGame() {
        console.log("in startGame() method")
        this.gameState = gameStateKeys.START
        this.ui.toggleUI(this.gameState)
        if (!this.#isNextSceneReady) runLoadingScreen()

        const currentSceneIndex = 0
        this.currentScene = this.#scenes[currentSceneIndex]
        this.currentScene = this.#scenes[0]

        console.log(this.currentScene)

        this.initializeEventListeners()
        console.log(this.scenes)
        this.fadeInScene()
        this.runIntro()
    }


    // Method to fade in the scene

    fadeInScene() {
        this.currentScene.draw(this.ctx)
        setTimeout(() => { animateBlur(this.currentScene, this.ctx, 0.5, 2, 0.2) }, 1000)
    }

    // Method to pause the game
    pauseGame() {
        console.log("in pauseGame() method")
    }

    // Method to run the intro sequence 
    // (after Start button is pressed, before scene starts)
    runIntro() {
        console.log("in runIntro() method")
        this.gameState = gameStateKeys.INTRO
        this.ui.toggleUI(this.gameState)

        console.log(this.ui)
        setTimeout(() => { this.ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { this.ui.elements.popupNan.style.transform = "translateY(0)" }, 700)

    }

    runLoadingScreen() {
        while (!this.isNextSceneReady) {
            console.log("Please wait - loading...")
        }
        console.log("in runLoadingScreen() method")
    }

    // Method to start a game scene
    startScene() {
        console.log("in startScene() method")
    }

    // Method to end a game scene
    endScene() {
        console.log("in endScene() method")
    }

    // Method to end the game
    endGame() {
        console.log("in endGame() method")
    }


    // ♾️ START: THE MAIN GAME LOOP
    loop(timeStamp, scene = this.currentScene) {
        console.log(this.#player)
    }

    // ♾️ END: THE MAIN GAME LOO


}  // 🏁 END of GameScene class declaration





