"use strict"

// Import modules

import { GameScene } from "./game-scene.js"
import { GameWorld, gameStateKeys } from "./game-world.js"
import GameObject from "./game-object.js"
import UI from "./ui.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { PauseMenu } from "./pause-menu.js"
import { DebugMenu } from "./debug-menu.js"
import Sprite from "./sprite.js"
import { spriteTags } from "./sprite.js"
import ObjectPool from "./object-pool.js"
import Spawner from './spawner.js'
// import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.js"
import { drawStatusText, getRandomInt, wait, typeWriter } from "./utils.js"
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
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.runIntro()
    }.bind(game))

    const pauseMenu = new PauseMenu(ui)




    // const backgroundLayer01Img = new Image()
    // backgroundLayer01Img.src = "./images/background-01-main.png"
    // const backgroundLayer01 = new Layer(player, false, backgroundLayer01Img, 0, 0, 0, 0, 6650, 270, 0, 0, 6650, 270)
    // backgroundLayer01.velocityX = 0

    // const backgroundLayer02Img = new Image()
    // backgroundLayer02Img.src = "./images/bg01-houses-ocean.png"
    // const backgroundLayer02 = new Layer(player, false, backgroundLayer02Img, 0, 0, 0, 0, 944, 512, 0, 0, 480, 270)
    // backgroundLayer02.velocityX = 0



    // SCENE 00
    // Initialize background layers //



    const scene00_backgroundLayerImg = new Image()
    scene00_backgroundLayerImg.src = "./images/garden-06.png"
    const scene00_backgroundLayer = new Layer(player, false, scene00_backgroundLayerImg, 0, 0, 0, 0, 1024, 585, 0, 0, 480, 270)
    scene00_backgroundLayer.velocityX = 0

    const scene00_layers = [scene00_backgroundLayer]

    const scene01_backgroundLayerImg = new Image()
    scene01_backgroundLayerImg.src = "./images/bg-beach-huts-01.webp"
    const scene01_backgroundLayer = new Layer(player, false, scene01_backgroundLayerImg, 0, 0, 0, 0, 768, 512, 0, -30, 475, 300)
    const scene01_layers = [scene01_backgroundLayer]

    const shopScene_backgroundLayerImg = new Image()
    shopScene_backgroundLayerImg.src = "./images/bg-shop-01.webp"
    const shopScene_backgroundLayer = new Layer(player, false, shopScene_backgroundLayerImg, 0, 0, 0, 0, 1024, 585, 0, 0, 480, 270)
    shopScene_backgroundLayer.velocityX = 0
    const shopScene_layers = [shopScene_backgroundLayer]


    // Sprite configuratio


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

    const wienerPool00 = new ObjectPool(makeWiener, wienerResetFunc, WIENER_POOL_SIZE)
    const wienerSpawner00 = new Spawner(SPAWNER_RATE, wienerPool00)

    function initializeWienerProperties01(wiener) {
        wiener.fps = getRandomInt(15, 120)
        wiener.dx = 460
        wiener.dy = getRandomInt(-100, 270)
        wiener.velocityX = getRandomInt(-300, -400)
        wiener.velocityY = getRandomInt(50, 100)
    }

    const makeWiener01 = () => {
        let wiener = new Sprite(WIENER_CONFIG)
        initializeWienerProperties01(wiener)
        return wiener
    }

    const wienerResetFunc01 = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        initializeWienerProperties01(wiener)
    }

    const wienerPool01 = new ObjectPool(makeWiener01, wienerResetFunc01, 100)
    const wienerSpawner01 = new Spawner(0.05, wienerPool01, 0)


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



    const GULL_POOL_SIZE_01 = 50
    const GULL_SPAWNER_RATE_01 = 0.50

    function initializeGullProperties01(gull) {
        gull.fps = getRandomInt(15, 30)
        gull.dx = getRandomInt(465, 500)
        gull.dy = getRandomInt(10, 50)
        gull.velocityX = getRandomInt(-300, -75)
        gull.velocityY = Math.random() < 0.5 ? -10 : 10
    }

    const makeGull01 = () => {
        let gull = new Sprite(GULL_CONFIG)
        initializeGullProperties01(gull)
        return gull
    }

    const gullResetFunc01 = (gull) => {
        gull.isScored = false
        gull.isVisible = true
        initializeGullProperties01(gull)
    }

    const gullPool01 = new ObjectPool(makeGull01, gullResetFunc01, GULL_POOL_SIZE_01)
    const gullSpawner01 = new Spawner(GULL_SPAWNER_RATE_01, gullPool, 0)



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

    // console.log("🚀 ~ gullPooGameObject:", new GameObject(GULLPOO_CONFIG))


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
    // console.log("🚀 ~ gullPooPool:", gullPooPool)

    // Link gullpoo to gull
    for (let i = 0; i < gullPooPool.poolArray.length; i++) {
        let gullPoo = gullPooPool.poolArray[i]
        let gullParent = gullPool.poolArray[i]
        gullPoo.data.parentSprite = gullParent
    }

    const gullPooSpawner = new Spawner(GULLPOO_SPAWNER_RATE, gullPooPool)
    // console.log("🚀 ~ gullPooSpawner:", gullPooSpawner)





    // let gullPooGameObject = GameWorld.createGameObject({ this: "value" })

    // console.log("🚀 ~ gullPooGameObject:", new GameObject(GULLPOO_CONFIG))


    const GULLPOO_POOL_SIZE_01 = 30
    const GULLPOO_SPAWNER_RATE_01 = 0.25

    function initializeGullPooProperties01(poo) {
        poo.dx = getRandomInt(-10, 465)
        poo.dy = -50
        poo.velocityX = getRandomInt(0, 100)
        poo.velocityY = getRandomInt(100, 200)
    }

    const makeGullPoo01 = () => {
        let gullPoo = new Sprite(GULLPOO_CONFIG)
        initializeGullPooProperties01(gullPoo)
        return gullPoo
    }

    const gullPooResetFunc01 = (gullPoo) => {
        gullPoo.isScored = false
        gullPoo.isVisible = true
        gullPoo.velocityX = getRandomInt(0, 10)
        gullPoo.velocityY = getRandomInt(100, 200)
        initializeGullPooProperties01(gullPoo)
    }

    const gullPooPool01 = new ObjectPool(makeGullPoo01, gullPooResetFunc01, GULLPOO_POOL_SIZE_01)
    // console.log("🚀 ~ gullPooPool:", gullPooPool)

    // Link gullpoo to gull
    // for (let i = 0; i < gullPooPool01.poolArray.length; i++) {
    //     let gullPoo = gullPooPool01.poolArray[i]
    //     let gullParent = gullPool01.poolArray[i]
    //     gullPoo.data.parentSprite = gullParent
    // }
    console.log("gullPooPool01:")
    console.dir(gullPooPool01)

    const gullPooSpawner01 = new Spawner(GULLPOO_SPAWNER_RATE_01, gullPooPool01)
    // console.log("🚀 ~ gullPooSpawner:", gullPooSpawner)


    const JUMBO_CONFIG = {
        spriteSrc: "./images/wiener-64px-spinCW-01.png",
        animationFrame: { x: 0, y: 0, width: 64, height: 64 },
        animations: {
            Spinning: {
                frameX: 0,
                frameY: 0,
                endFrame: 28
            }
        },
        pointValue: 100,
        healthValue: 5,
        persist: "bottom"
    }

    const INITIAL_JUMBO_DY = -50
    const JUMBO_POOL_SIZE = 10
    const JUMBO_SPAWNER_RATE = 10

    function initializeJumboProperties(jumbo) {
        jumbo.fps = getRandomInt(30, 90)
        jumbo.dx = getRandomInt(20, 460)
        jumbo.dy = INITIAL_JUMBO_DY
        jumbo.velocityX = getRandomInt(-50, 50)
        jumbo.velocityY = getRandomInt(100, 1000)
    }

    const makeJumbo = () => {
        let jumbo = new Sprite(JUMBO_CONFIG)
        initializeJumboProperties(jumbo)
        return jumbo
    }

    const jumboResetFunc = (jumbo) => {
        jumbo.isScored = false
        jumbo.isVisible = true
        initializeJumboProperties(jumbo)
    }

    const jumboPool = new ObjectPool(makeJumbo, jumboResetFunc, JUMBO_POOL_SIZE)
    // console.log("🚀 ~ jumboPool:", jumboPool)

    const jumboSpawner = new Spawner(JUMBO_SPAWNER_RATE, jumboPool)
    // console.log("🚀 ~ jumboSpawner:", jumboSpawner)



    const scene00_spawners = [wienerSpawner00, gullSpawner, gullPooSpawner]


    const scene00_music = "./audio/music/alouette_55s.mp3"

    const scene00_config = {
        index: 0,
        name: "Garden",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: scene00_layers,
        sprites: [],
        spawners: scene00_spawners,
        music: scene00_music,
        sfx: [],

    }




    const scene01_spawners = [wienerSpawner01, gullSpawner01, gullPooSpawner01, jumboSpawner]


    const scene01_music = "./audio/music/i_equals_da_by.mp3"

    const scene01_config = {
        index: 0,
        name: "RoundTheCircle",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: scene01_layers,
        sprites: [],
        spawners: scene01_spawners,
        music: scene01_music,
        sfx: [],

    }



    //const scene01_music = "./audio/music/i_equals_da_by.mp3"

    const shopScene_config = {
        index: 0,
        name: "RoundTheCircle",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: shopScene_layers,
        sprites: [],
        spawners: scene01_spawners,
        music: scene01_music,
        sfx: [],

    }


    const scene00 = new GameScene(scene00_config)
    const scene01 = new GameScene(scene01_config)
    const shopScene = new GameScene(shopScene_config)




    game.scenes.push(scene00)
    // game.scenes.push(shopScene)
    console.log(scene01.spawners)
    game.scenes.push(scene01)

    console.dir(game.scenes)



    // Init player





    //Scene Objects
    // const scene01 = new GameScene(0, "Garden", player, [backgroundLayer03], [], scene01Spawners, "./audio/music/alouette_55s.mp3", [])
    // const scene02 = new GameScene(1, "AllAroundTheCircle", player, [backgroundLayer02], [], scene01Spawners, "./audio/music/i_equals_da_by.mp3", [])

    // game.addScene(scene01)
    // game.addScene(scene02)
    // console.log(game.scenes)

    // let currentScene = game.scenes[0]

    // ui.music = scene01.music

    // const gameSceneTestObj = {
    //     index: 0,
    //     name: "",
    //     playerBounds: {
    //         topLeft: [0, 0],
    //         topRight: [CANVAS_WIDTH, 0],
    //         bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
    //         bottomLeft: [0, CANVAS_HEIGHT]
    //     },
    //     layers: [],
    //     sprites: [],
    //     spawners: [],
    //     music: [],
    //     sfx: [],
    // }

    // let scene01 = new GameScene(gameSceneTestObj)

    // game.addScene(scene01)









    // ui.toggleUI("cutscene")







    let blurValue = 0
    const maxBlur = 4
    const step = 0.2

    function animateBlur() {



        blurValue += step

        if (currentScene.layers !== undefined && currentScene.layers.length > 0) {
            currentScene.layers[0].filter = `blur(${blurValue}px)`
            currentScene.draw(ctx)
            if (blurValue < maxBlur) {
                requestAnimationFrame(animateBlur)
            }
        }



    }



    // Extract the text content from the div without child elements like <strong>
    const dialogText = document.querySelector('#intro-dialog div').textContent

    // Start the typewriter effect


    // blurBackground()

    // Game state functions

    // function startGame() {

    //     // console.log(player.stats)
    //     ui.toggleUI("play")
    //     // scene001.layers[0].filter = "none"

    //     initPlayer()
    //     const currentScene = game.scenes[0]

    //     const superNantendo = document.getElementById("ui--super-nantendo")
    //     superNantendo.classList.add("teal-bg")
    //     // canvas.classList.remove("hidden")


    //     if (currentScene.isMusicLoaded) {
    //         console.log("music is loaded")
    //         // runIntro()
    //         game.toggleMusic()
    //         game.loop(0, scene001)


    //         //}

    //     }
    // }





    console.log(game.ui)
    console.log(game.gameState)
    game.gameState = gameStateKeys.TITLE
    // game.ui.toggleUI("title")


    function initObservers() {
        console.log(game.player.stats)
        game.player.stats.subscribe(game.player)
        game.player.stats.subscribe(game.ui.bindings.lives)
        game.player.stats.subscribe(game.ui.bindings.score)
        game.player.stats.subscribe(game.ui.bindings.healthBarWidth)
        game.player.stats.subscribe(game.ui.bindings.healthBarColor)
        game.player.stats.subscribe(game.ui.bindings.scoreRemaining)
        game.player.stats.subscribe(game.ui.bindings.wienersCollected)


        game.scenes.forEach((scene) => {
            console.log(scene)
            scene.subscribe(game.player)
        })

        console.log(game.ui.bindings)
        game.subscribe(game.ui.bindings.timeRemaining)
        game.subscribe(game.player)
        game.subscribe(game.ui)



        // game.player.stats.subscribe(game) // TODO: will double notifications for player


    }

    initObservers()




})

