"use strict"
// Import modules

import { GameScene } from "./game-scene.js"
import { GameWorld } from "./game-world.js"
import GameObject from "./game-object.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input.js"
import { PauseMenu } from "./pause-menu.js"
import { DebugMenu } from "./debug-menu.js"
import Sprite from "./sprite.js"
import { spriteTags } from "./sprite.js"
import ObjectPool from "./objectpool.js"
import Spawner from './spawner.js'
// import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.js"
import { drawStatusText, getRandomInt, wait, typeWriter } from "./utils.js"
import UI from "./ui.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js"


window.addEventListener("load", function () {


    // Initialize game variables
    let isDebugMode = false
    let lastTime = 0
    let deltaTime = 1
    let comboCounter = 0
    let isPaused = false
    let musicPausedTime = 0



    const canvas = document.getElementById("game-screen__canvas")
    canvas.width = 475
    canvas.height = 270
    const ctx = canvas.getContext("2d")

    // Initialize player
    let playerConfig = {
        spriteSrc: "./images/nan-sprite-walk.png",
        animationFrame: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        },
        animations: {
            StandingLeft: {
                frameX: 0,
                frameY: 1,
                endFrame: 0
            },
            StandingRight: {
                frameX: 0,
                frameY: 0,
                endFrame: 0
            },
            WalkingLeft: {
                frameX: 0,
                frameY: 1,
                endFrame: 4
            },
            WalkingRight: {
                frameX: 0,
                frameY: 0,
                endFrame: 4
            },
        }
    }
    const player = new Player(playerConfig)
    console.log(player)

    // Initialize UI elements //
    const ui = new UI("[data-ui]", player)



    // Initialize Input handler

    // Input Handler
    // console.log(this.document)
    const input = new InputHandler(ui)



    // Initialize Game World

    const game = new GameWorld(player, ui, input)

    // Event listeners
    ui.elements.startButton.addEventListener("click", (e) => {
        runIntro()
    })

    const pauseMenu = new PauseMenu(ui)







    // Initialize background layers //

    const backgroundLayer01Img = new Image()
    backgroundLayer01Img.src = "./images/background-01-main.png"
    const backgroundLayer01 = new Layer(player, 2, backgroundLayer01Img, 0, 0, 0, 0, 6650, 270, 0, 0, 6650, 270)
    backgroundLayer01.velocityX = 0

    const backgroundLayer02Img = new Image()
    backgroundLayer02Img.src = "./images/bg01-houses-ocean.png"
    const backgroundLayer02 = new Layer(player, false, backgroundLayer02Img, 0, 0, 0, 0, 944, 512, 0, 0, 480, 270)
    backgroundLayer02.velocityX = 0

    const backgroundLayer03Img = new Image()
    backgroundLayer03Img.src = "./images/garden-06.png"
    const backgroundLayer03 = new Layer(player, false, backgroundLayer03Img, 0, 0, 0, 0, 1024, 585, 0, 0, 480, 270)
    backgroundLayer03.velocityX = 0

    // Sprite configuration


    // Wiener 🌭

    const WIENER_CONFIG = {
        spriteSrc: "./images/wiener-32px-spin-01.png",
        animationFrame: { x: 0, y: 0, width: 32, height: 32 },
        animations: {
            Spinning: {
                frameX: 0,
                frameY: 0,
                endFrame: 28
            }
        },
        pointValue: 100,
        healthValue: 5,
        spriteTag: spriteTags.WIENER
    }

    const INITIAL_WIENER_DY = -50
    const WIENER_POOL_SIZE = 10
    const SPAWNER_RATE = 0.75

    function initializeWienerProperties(wiener) {
        wiener.fps = getRandomInt(15, 120)
        wiener.dx = getRandomInt(20, 460)
        wiener.dy = INITIAL_WIENER_DY
        wiener.velocityX = getRandomInt(-75, 75)
        wiener.velocityY = getRandomInt(25, 200)
    }

    const makeWiener = () => {
        let wiener = new Sprite(WIENER_CONFIG)
        initializeWienerProperties(wiener)
        return wiener
    }

    const wienerResetFunc = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        initializeWienerProperties(wiener)
    }

    const wienerPool = new ObjectPool(makeWiener, wienerResetFunc, WIENER_POOL_SIZE)
    const wienerSpawner = new Spawner(SPAWNER_RATE, wienerPool, 0)


    // Seagull 🐦

    const GULL_CONFIG = {
        spriteSrc: "./images/seagull-flying-sprite-01-sheet.png",
        animationFrame: { x: 0, y: 0, width: 44, height: 51 },
        animations: {
            FlyingLeft: {
                frameX: 0,
                frameY: 0,
                endFrame: 7
            }
        },
        pointValue: 0,
        healthValue: 0,
        spriteTag: spriteTags.GULL
    }


    const GULL_POOL_SIZE = 10
    const GULL_SPAWNER_RATE = 2

    function initializeGullProperties(gull) {
        gull.fps = getRandomInt(15, 30)
        gull.dx = getRandomInt(465, 500)
        gull.dy = getRandomInt(10, 50)
        gull.velocityX = getRandomInt(-300, -75)
        gull.velocityY = Math.random() < 0.5 ? -10 : 10
    }

    const makeGull = () => {
        let gull = new Sprite(GULL_CONFIG)
        initializeGullProperties(gull)
        return gull
    }

    const gullResetFunc = (gull) => {
        gull.isScored = false
        gull.isVisible = true
        initializeGullProperties(gull)
    }

    const gullPool = new ObjectPool(makeGull, gullResetFunc, GULL_POOL_SIZE)
    const gullSpawner = new Spawner(GULL_SPAWNER_RATE, gullPool, 0)



    //Seagull poo

    const GULLPOO_CONFIG = {
        spriteSrc: "./images/seagull-poo-sprite-02.png",
        animationFrame: { x: 0, y: 0, width: 16, height: 16 },
        animations: {
            Falling: {
                frameX: 0,
                frameY: 0,
                endFrame: 0
            }
        },
        pointValue: 0,
        healthValue: -25,
        spriteTag: spriteTags.POO
    }

    // let gullPooGameObject = GameWorld.createGameObject({ this: "value" })

    console.log("🚀 ~ gullPooGameObject:", new GameObject(GULLPOO_CONFIG))


    const GULLPOO_POOL_SIZE = 10
    const GULLPOO_SPAWNER_RATE = 1

    function initializeGullPooProperties(poo) {
        poo.dx = -50
        poo.dy = -50
        poo.velocityX = getRandomInt(0, 100)
        poo.velocityY = getRandomInt(100, 200)
    }

    const makeGullPoo = () => {
        let gullPoo = new Sprite(GULLPOO_CONFIG)
        initializeGullPooProperties(gullPoo)
        return gullPoo
    }

    const gullPooResetFunc = (gullPoo) => {
        gullPoo.isScored = false
        gullPoo.isVisible = true
        gullPoo.velocityX = getRandomInt(0, 10)
        gullPoo.velocityY = getRandomInt(100, 200)
        initializeGullPooProperties(gullPoo)
    }

    const gullPooPool = new ObjectPool(makeGullPoo, gullPooResetFunc, GULLPOO_POOL_SIZE)

    // Link gullpoo to gull
    for (let i = 0; i < gullPooPool.poolArray.length; i++) {
        let gullPoo = gullPooPool.poolArray[i]
        let gullParent = gullPool.poolArray[i]
        gullPoo.data.parentSprite = gullParent
    }

    const gullPooSpawner = new Spawner(GULLPOO_SPAWNER_RATE, gullPooPool)
    const scene01Spawners = [wienerSpawner, gullSpawner, gullPooSpawner]




    // Scene Objects
    const scene01 = new GameScene(1, "Bonavista", player, [backgroundLayer03], [], scene01Spawners, "./audio/music/alouette_55s.mp3", [])

    let currentScene = scene01
    ui.music = currentScene.music







    ui.showUI("cutscene")







    let blurValue = 0
    const maxBlur = 4
    const step = 0.2

    function animateBlur() {



        blurValue += step


        currentScene.layers[0].filter = `blur(${blurValue}px)`
        currentScene.draw(ctx)
        if (blurValue < maxBlur) {
            requestAnimationFrame(animateBlur)
        }




    }



    // Extract the text content from the div without child elements like <strong>
    const dialogText = document.querySelector('#intro-dialog div').textContent

    // Start the typewriter effect


    // blurBackground()
    function initPlayer() {
        player.stats.lives = 3
        player.stats.score = 0
        player.stats.progress = 0
        player.stats.healthMax = 100
        player.stats.health = 100

        player.isAlive = true

        // player.stats.subscribe(game) // TODO: will double notifications for player
        player.stats.subscribe(player)
        player.stats.subscribe(ui.lives)
        player.stats.subscribe(ui.score)
        player.stats.subscribe(ui.healthBarWidth)
        player.stats.subscribe(ui.healthBarColor)
        player.stats.subscribe(ui.scoreRemaining)
        game.subscribe(ui.timeRemaining)

    }
    // Game state functions

    function runIntro() {
        ui.showUI("cutscene")
        console.log(ui)

        ui.hide(ui.elements.titleScreen)
        ui.show(ui.elements.introScreen)

        ui.show(ui.elements.popupNan)
        setTimeout(() => { ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { ui.elements.popupNan.style.transform = "translateY(0px)" }, 700)

        currentScene.draw(ctx)
        setTimeout(() => { animateBlur() }, 1000)
        typeWriter('intro-dialog', dialogText, 25)
        document.getElementById("intro-dialog").addEventListener("pointerdown", () => {
            setTimeout(() => { ui.elements.introDialog.style.transform = "translateY(400px)" }, 500)
            setTimeout(() => { ui.elements.popupNan.style.transform = "translateY(475px)" }, 700)
            setTimeout(() => { startGame() }, 1300)

        })


    }


    game.currentScene = scene01

    function startGame() {

        // console.log(player.stats)
        ui.showUI("play")
        scene01.layers[0].filter = "none"

        initPlayer()


        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
        // canvas.classList.remove("hidden")


        if (currentScene.isMusicLoaded) {
            console.log("music is loaded")
            // runIntro()
            game.toggleMusic()
            game.loop(0, scene01)


            //}

        }
    }

    function endGame() {
        ui.hide(ui.ingameOverlay)
        ui.show(ui.menuOverlay)
        ui.show(ui.gameOverScreen)
    }

    function endScene() {

    }

    function resetGame() {
        isPaused = false
        lastTime = 0
        location.reload() // TODO: Find better way of resetting game
    }



    function resetPlayer() {
        console.log("Reset Player")
    }




    // function toggleDebugMode() {
    //     isDebugMode = !isDebugMode



    //     setInterval(() => {
    //         if (debugMenu.isVisible) {
    //             debugMenu.update()
    //         }
    //     }, 100)

    //     document.addEventListener('keydown', (event) => {
    //         if (event.key === '`') {
    //             toggleDebugMenu()
    //         }
    //     })

    // }

    // const debugMenu = new DebugMenu()
    // debugMenu.watch("player.isAlive", () => player.isAlive)

    // toggleDebugMode()







    // Uncomment to bypass title screen
    // setTimeout(startGame, 5000)





})

