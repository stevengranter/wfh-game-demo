// Import modules
import Player from "./player.js"
import InputHandler from "./input.js"
// import { ObjectPool, Pickup } from "./objectpool.js"
import { SpriteImage, SpriteSheet, Sprite } from "./sprite.js"
import Pickup from "./pickup.js"
import ObjectPool from "./objectpool.js"
import Spawner from './spawner.js'
import { drawStatusText, getRandomInt } from "./utils.js"
import UI from "./ui.js"

import { DebugMode } from "./debug.js"

// wait for page to fully load
window.addEventListener("load", function () {

    const debugPanel = document.getElementById("debug-panel")
    const debug = new DebugMode(true, debugPanel)
    console.log("Debug mode is " + debug.isOn)
    // Initialize canvas 🎨 //
    const canvas = document.getElementById("game-screen__canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 475
    canvas.height = 270
    ctx.imageSmoothingEnabled = false // keeps sprites pixelated

    let deltaTime = 0

    // DOM UI elements //
    const body = document.getElementsByTagName("body")[0]
    const titleScreen = document.getElementById("title-screen")

    // Menu DOM elements
    const menuScreen = document.getElementById("menu-screen")
    const startButton = document.getElementById("start-button")
    const pauseButton = document.getElementById("pause-button")
    const resumeButton = document.getElementById("resume-button")
    const stopButton = document.getElementById("stop-button")

    // In-game DOM elements
    const gameplayHUD = document.getElementById("gameplay-hud")
    const scoreDisplay = document.getElementById("hud-score")

    // Game objects
    //const player = new Player(canvas.width, canvas.height)
    //const playerImage = document.getElementById("player-sprite")
    const playerSpriteImage = new SpriteImage(document.getElementById("player-sprite"), 0, 0, 48, 48)
    const playerSpriteSheet = new SpriteSheet(playerSpriteImage, 0, 0, 0)
    const player = new Player(playerSpriteSheet, 48, 48, canvas.width, canvas.height)
    console.log(player)

    const input = new InputHandler()
    const ui = new UI(canvas)

    // Sprites
    // const wienerImageRegular = document.getElementById("wiener-sprite--16px-spin")
    // const wienerSpriteRegular = new Sprite(wienerImageRegular, 0, 0, 16, 16, 0, 0, 16, 16, 0, 0, 28, 60)

    // const jumboImage = document.getElementById("jumbo-sprite--32px-spin")
    // const jumboSprite = new Collectible(jumboImage, 100, 0, 32, 32, 250, undefined, 2, 4)

    // const bolognaImage = document.getElementById("bologna-sprite--64px-spin")
    // const bolognaSprite = new Collectible(bolognaImage, 150, 0, 64, 64, 1000, undefined, 2, 2)

    // const jumboGlowImage = document.getElementById("jumbo-sprite--40px-spin-glow")
    // const jumboGlowSprite = new Collectible(jumboGlowImage, 125, 0, 40, 40, 250, undefined, 4, 2)

    const wienerImageRegular = document.getElementById("wiener-sprite--16px-spin")
    const wienerSpriteSource = new SpriteImage(wienerImageRegular, 0, 0, 16, 16)

    const makeWiener = () => new Sprite(new SpriteSheet(wienerSpriteSource, 0, 0, 28), getRandomInt(0, 450), getRandomInt(-500, -100), 16, 16, 0, 2, getRandomInt(5, 60), 50)

    const resetFunc = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        wiener.dx = getRandomInt(0, 450)
        wiener.dy = getRandomInt(-10, -100)
        wiener.velocityX = 0
        wiener.velocityY = 2
    }
    const wienerPool = new ObjectPool(makeWiener, resetFunc, 50)

    const wienerSpawner = new Spawner(0.005, wienerPool)

    const jumboImage = document.getElementById("jumbo-sprite--32px-spin")
    const jumboSpriteSource = new SpriteImage(jumboImage, 0, 0, 32, 32)
    const makeJumbo = () => new Sprite(new SpriteSheet(jumboSpriteSource, 0, 0, 28), getRandomInt(0, 450), getRandomInt(-500, -100), 32, 32, getRandomInt(-2, +2), getRandomInt(0, +4), getRandomInt(5, 60), 500)

    const jumboResetFunc = (jumbo) => {
        jumbo.isScored = false
        jumbo.isVisible = true
        jumbo.dx = getRandomInt(0, 450)
        jumbo.dy = getRandomInt(-25, -100)
        jumbo.velocityX = getRandomInt(-1, +1)
        jumbo.velocityY = getRandomInt(2, 4)
    }

    const jumboPool = new ObjectPool(makeJumbo, jumboResetFunc, 15)
    const jumboSpawner = new Spawner(0.5, jumboPool)

    let numFreeObjects = 0

    // Initialize game variables
    let currentScore = 0
    let lastTime = 0
    let isPaused = false


    // Event listeners
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Escape":
                isPaused = !isPaused
                console.log("pause toggled")
                pauseGame()
                break
        }
    })

    startButton.addEventListener("click", startGame)

    stopButton.addEventListener("click", stopGame)

    pauseButton.addEventListener("click", (e) => {
        isPaused = !isPaused
        pauseGame()
    })

    resumeButton.addEventListener("click", (e) => {
        isPaused = !isPaused
        pauseGame()
    })


    // Game loop
    function animate(timeStamp) {
        if (!isPaused) {
            deltaTime = timeStamp - lastTime
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // console.log(deltaTime)
            numFreeObjects = wienerSpawner.getFreeObjects()
            // drawStatusText(ctx, currentScore, 10, 60)
            // drawStatusText(ctx, "frameTimer:" + wienerSpriteSheet.frameTimer, 10, 90)

            // drawStatusText(ctx, "frameInterval:" + wienerSpriteSheet.frameInterval, 10, 110)
            player.update(input.lastKey)
            wienerSpawner.update(deltaTime)
            jumboSpawner.update(deltaTime)




            wienerSpawner.draw(ctx, deltaTime)
            player.draw(ctx, deltaTime)
            jumboSpawner.draw(ctx, deltaTime)


            // detect collisions
            // for (let i = 0; i < wienerSpawner.objectPool.poolArray.length; i++) {
            //     if (detectBoxCollision(player, wienerSpawner.objectPool.poolArray[i].data)) {
            //         updateScore(wienerSpawner.objectPool.poolArray[i].data)
            //         wienerSpawner.objectPool.poolArray[i].data.isVisible = false
            //         console.log(wienerSpawner.objectPool.poolArray[i].data)
            //         wienerSpawner.objectPool.releaseElement(wienerSpawner.objectPool.poolArray[i])
            //     }
            // }

            for (let i = 0; i < jumboSpawner.objectPool.poolArray.length; i++) {
                if (detectBoxCollision(player, jumboSpawner.objectPool.poolArray[i].data)) {
                    jumboSpawner.objectPool.poolArray[i].data.isVisible = false
                    updateScore(jumboSpawner.objectPool.poolArray[i].data)
                    jumboSpawner.objectPool.releaseElement(jumboSpawner.objectPool.poolArray[i])

                }
            }

            requestAnimationFrame(animate)
        } else {
            pauseGame()
        }
    }


    // Game state functions
    function startGame() {
        ui.hide(titleScreen)
        ui.hide(menuScreen)
        initScore()
        ui.show(gameplayHUD)
        body.classList.add("green-bg")
        canvas.classList.remove("hidden")
        animate(0)
    }

    function stopGame() {
        isPaused = false
        lastTime = 0
        location.reload() // TODO: Find better way of resetting game
    }

    function pauseGame() {
        if (isPaused) {
            ui.show(menuScreen)
            ui.hide(gameplayHUD)
        }
        else {
            ui.hide(menuScreen)
            ui.show(gameplayHUD)
            animate(lastTime)
            isPaused = false
        }
    }



    // Collision detection
    function detectBoxCollision(object1, object2) {
        if (
            object1.dx + object1.dWidth >= object2.dx &&
            object1.dx <= object2.dx + object2.dWidth &&
            object1.dy + object1.dHeight >= object2.dy &&
            object1.dy <= object2.dy + object2.dHeight
        ) {
            // console.log("COLLISION!")
            return true

        }


    }


    // Score-keeping
    function initScore() {
        scoreDisplay.innerHTML = String(currentScore).padStart(4, "0")
    }

    function updateScore(object) {
        if (object) {
            if (!object.isScored) {
                // console.log("SCORE")
                currentScore += object.pointValue
                scoreDisplay.innerHTML = String(currentScore).padStart(4, "0")
                object.isScored = true
            }
        }
    }



    // Uncomment to bypass title screen
    // startGame()





})

