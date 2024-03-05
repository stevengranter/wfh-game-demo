// Import modules
import Player from "./player.js"
import InputHandler from "./input.js"
// import { ObjectPool, Pickup } from "./objectpool.js"
import { SpriteFrame, SpriteAnimation, Sprite } from "./sprite.js"
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

    // Initialize game variables
    let currentScore = 0
    let lastTime = 0
    let isPaused = false
    let deltaTime = 0




    // DOM UI elements //
    const ui = new UI(canvas)
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

    // Player Object

    const playerImage = new Image()
    playerImage.src = "./assets/images/nan-sprite-walk.png"
    const playerSpriteImage = new SpriteFrame(playerImage, 0, 0, 48, 48)
    const playerSpriteSheet = new SpriteAnimation(playerSpriteImage, 0, 0, 0)
    const player = new Player(playerSpriteSheet, 48, 48, canvas.width, canvas.height)

    // Sprites

    // Seagull 🐦

    const seagullImage = new Image()
    seagullImage.src = "./assets/images/seagull-flying-sprite-01.png"
    const seagullSpriteImage = new SpriteFrame(seagullImage, 0, 0, 44, 51)
    const makeSeagull = () => new Sprite(
        new SpriteAnimation(seagullSpriteImage, 0, 0, 7), // spritesheet
        getRandomInt(465, 500), // dx
        getRandomInt(10, 50), //dy
        44, // dWidth
        51, // dHeight
        getRandomInt(-4, -2), // velocityX
        Math.random() < 0.5 ? -0.2 : 0.2, // velocityY 
        30,  // fps
        0 // pointValue
    )

    const seagullResetFunc = (seagull) => {
        seagull.isScored = false
        seagull.isVisible = true
        seagull.dx = getRandomInt(465, 500)
        seagull.dy = getRandomInt(10, 50)
        seagull.velocityX = getRandomInt(-4, -2)
        seagull.velocityY = Math.random() < 0.5 ? -0.3 : 0.2
    }

    const seagullPool = new ObjectPool(makeSeagull, seagullResetFunc, 10)
    const seagullSpawner = new Spawner(2, seagullPool)

    // Wiener 🌭

    const wienerImage = new Image()
    wienerImage.src = "./assets/images/wiener-32-spin-01.png"
    const wienerSpriteImage = new SpriteFrame(wienerImage, 0, 0, 32, 32)
    const makeWiener = () => new Sprite(
        new SpriteAnimation(wienerSpriteImage, 0, 0, 28),
        getRandomInt(20, 460), // dx
        -40, // dy
        32, // dWidth
        32, // dHeight
        getRandomInt(-1, 1), // velocityX
        getRandomInt(1, 3), // velocityY
        getRandomInt(5, 60), // fps
        100 // pointValue
    )

    const wienerResetFunc = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        wiener.dx = getRandomInt(20, 460)
        wiener.dy = -40
        wiener.velocityX = getRandomInt(-1, 1)
        wiener.velocityY = getRandomInt(1, 3)
    }

    const wienerPool = new ObjectPool(makeWiener, wienerResetFunc, 10)
    const wienerSpawner = new Spawner(1, wienerPool)



    // Input Handler
    const input = new InputHandler()

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


            let statusBottomY = 260
            drawStatusText(ctx, "🐦 free:" + seagullSpawner.getFreeObjects(), 10, statusBottomY - 60)
            drawStatusText(ctx, "     active:" + seagullSpawner.getActiveObjects(), 10, statusBottomY - 50)
            drawStatusText(ctx, "     timer: " + Math.floor(seagullSpawner.timeSinceSpawn) + " / " + seagullSpawner.spawnInterval, 10, statusBottomY - 40)

            drawStatusText(ctx, "🌭 free:" + wienerSpawner.getFreeObjects(), 10, statusBottomY - 20)
            drawStatusText(ctx, "     active:" + wienerSpawner.getActiveObjects(), 10, statusBottomY - 10)
            drawStatusText(ctx, "     timer:" + Math.floor(wienerSpawner.timeSinceSpawn) + " / " + wienerSpawner.spawnInterval, 10, statusBottomY)



            seagullSpawner.update(deltaTime)
            wienerSpawner.update(deltaTime)

            player.update(input.lastKey)




            seagullSpawner.draw(ctx, deltaTime)
            wienerSpawner.draw(ctx, deltaTime)
            player.draw(ctx, deltaTime)






            // detect collisions
            for (let i = 0; i < wienerSpawner.objectPool.poolArray.length; i++) {
                if (detectBoxCollision(player, wienerSpawner.objectPool.poolArray[i].data)) {
                    updateScore(wienerSpawner.objectPool.poolArray[i].data)
                    wienerSpawner.objectPool.poolArray[i].data.isVisible = false
                    console.log(wienerSpawner.objectPool.poolArray[i].data)
                    wienerSpawner.objectPool.releaseElement(wienerSpawner.objectPool.poolArray[i])
                }
            }

            // for (let i = 0; i < jumboSpawner.objectPool.poolArray.length; i++) {
            //     if (detectBoxCollision(player, jumboSpawner.objectPool.poolArray[i].data)) {
            //         jumboSpawner.objectPool.poolArray[i].data.isVisible = false
            //         updateScore(jumboSpawner.objectPool.poolArray[i].data)
            //         jumboSpawner.objectPool.releaseElement(jumboSpawner.objectPool.poolArray[i])

            //     }
            // }

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
    startGame()





})

