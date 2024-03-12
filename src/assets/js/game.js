// Import modules
import GameObject from "./gameobject.js"
import Player from "./player.js"
import InputHandler from "./input.js"
// import { ObjectPool, Pickup } from "./objectpool.js"
import { SpriteFrame, SpriteAnimation, Sprite } from "./sprite.js"
import Pickup from "./pickup.js"
import ObjectPool from "./objectpool.js"
import Spawner from './spawner.js'
import Projectile from "./projectile.js"
import { drawStatusText, getRandomInt } from "./utils.js"
import UI from "./ui.js"

import { DebugMode } from "./debug.js"

// wait for page to fully load
window.addEventListener("load", function () {

    const debugPanel = document.getElementById("debug-panel")
    const debug = new DebugMode(true, debugPanel)
    // console.log("Debug mode is " + debug.isOn)
    // Initialize canvas 🎨 //
    const canvas = document.getElementById("game-screen__canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 475
    canvas.height = 270
    ctx.imageSmoothingEnabled = false // keeps sprites pixelated

    // Initialize game variables
    let lastTime = 0
    let deltaTime = 1
    let isPaused = false

    let comboCounter = 0




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
    const scoreCounterHUD = document.getElementById("hud-score")
    const healthMeterHUD = document.querySelector("#hud-health-meter span")
    const livesCounterHUD = document.querySelector("#hud-lives-remaining div")
    const comboCounterHUD = document.querySelector("#hud-combo")
    // console.log(healthMeter)

    // Virtual control button elements
    // const virtualButtons = document.querySelectorAll(".touchable")

    // for (let i = 0; i < virtualButtons.length; i++) {
    //     virtualButtons[i].addEventListener("touchstart", handleTouch())
    // }


    const controllerStartButton = document.getElementById("virtual-controller--button-start")
    const controllerSelectButton = document.getElementById("virtual-controller--button-select")
    const controllerDpad = document.getElementById("virtual-controller--button-dpad")
    const controllerPrimaryButton = document.getElementById("virtual-controller--button-primary")



    // }
    // Player Object

    const playerImage = new Image()
    playerImage.src = "./assets/images/nan-sprite-walk.png"
    const playerSpriteImage = new SpriteFrame(playerImage, 0, 0, 48, 48)

    const playerStandingLeftAnimation = new SpriteAnimation(
        playerSpriteImage,
        0, // frameX
        1, // frameY
        0 // endFrame
    )
    const playerWalkingLeftAnimation = new SpriteAnimation(
        playerSpriteImage,
        0, // frameX
        1, // frameY
        4 // endFrame
    )
    const playerStandingRightAnimation = new SpriteAnimation(
        playerSpriteImage,
        0, // frameX
        0, // frameY
        0 // endFrame
    )
    const playerWalkingRightAnimation = new SpriteAnimation(
        playerSpriteImage,
        0, // frameX
        0, // frameY
        4 // endFrame
    )

    const playerAnimations = {
        "StandingRight": {
            animation: playerStandingRightAnimation,
        },
        "WalkingRight": {
            animation: playerWalkingLeftAnimation,
        },
        "StandingLeft": {
            animation: playerStandingLeftAnimation,
        },
        "WalkingLeft": {
            animation: playerWalkingLeftAnimation
        }

    }

    const player = new Player(
        ctx,
        225,
        200,
        48,
        48,
        playerStandingLeftAnimation,
        canvas.width,
        canvas.height)

    let playerLives = player.currentLives
    let playerHealth = player.currentHealth
    let playerScore = player.currentScore
    // Sprites

    // Wiener 🌭

    const wienerImage = new Image()
    wienerImage.src = "./assets/images/wiener-32-spin-01.png"
    const wienerSpriteImage = new SpriteFrame(wienerImage, 0, 0, 32, 32)
    const makeWiener = () => new Sprite(
        ctx,
        getRandomInt(20, 460), // dx
        -50, // dy
        32, // dWidth
        32, // dHeight
        new SpriteAnimation(wienerSpriteImage, 0, 0, 28),
        getRandomInt(-75, 75), //getRandomInt(-1, 1), // velocityX
        getRandomInt(50, 200), //getRandomInt(1, 3), // velocityY
        getRandomInt(15, 120), // fps
        100, // pointValue
        5 // healthValue
    )

    const wienerResetFunc = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        wiener.dx = getRandomInt(20, 460)
        wiener.dy = -50
        wiener.velocityX = getRandomInt(-75, 75)
        wiener.velocityY = getRandomInt(50, 200)
    }

    const wienerPool = new ObjectPool(makeWiener, wienerResetFunc, 10)
    const wienerSpawner = new Spawner(1, wienerPool)
    // console.log(wienerPool)

    // Seagull 🐦

    const seagullImage = new Image()
    seagullImage.src = "./assets/images/seagull-flying-sprite-01.png"
    const seagullSpriteImage = new SpriteFrame(seagullImage, 0, 0, 44, 51)
    const makeSeagull = () => new Sprite(
        ctx, // spritesheet
        getRandomInt(465, 500), // dx
        getRandomInt(10, 50), //dy
        44, // dWidth
        51, // dHeight
        new SpriteAnimation(seagullSpriteImage, 0, 0, 7),
        getRandomInt(-300, -75), // velocityX
        Math.random() < 0.5 ? -10 : 10, // velocityY 
        30,  // fps
        0 // pointValue
    )

    const seagullResetFunc = (seagull) => {
        seagull.isScored = false
        seagull.isVisible = true
        seagull.dx = getRandomInt(465, 500)
        seagull.dy = getRandomInt(10, 50)
        seagull.velocityX = getRandomInt(-300, -75)
        seagull.velocityY = Math.random() < 0.5 ? -10 : 10
    }

    const seagullPool = new ObjectPool(makeSeagull, seagullResetFunc, 10)
    // console.log(seagullPool)
    const seagullSpawner = new Spawner(2, seagullPool)

    // Seagull poop 

    const gullPoopImage = new Image()
    gullPoopImage.src = "./assets/images/seagull-poop-sprite-01.png"
    const gullPoopSpriteImage = new SpriteFrame(gullPoopImage, 0, 0, 16, 16)
    const gullPoopSpriteAnimation = new SpriteAnimation(gullPoopSpriteImage, 0, 0, 0)


    const makeGullPoop = () => new Sprite(
        ctx,

        getRandomInt(20, 460),
        getRandomInt(-10, -40),
        16, // dWidth
        16, // dHeight
        new SpriteAnimation(gullPoopSpriteImage, 0, 0, 0),
        0, // velocityX
        getRandomInt(50, 150), // velocityY 
        30,  // fps
        0, // pointValue
        -10, // healthValue
    )






    // seagullPool.poolArray.forEach(seagull => {
    //     seagull.data.projectile = new Projectile(
    const gullPoopResetFunc = (poop) => {
        poop.isScored = false
        poop.isVisible = true
        poop.dx = getRandomInt(20, 460)
        poop.dy = getRandomInt(-10, -40)
        poop.velocityX = 0
        poop.velocityY = getRandomInt(50, 150)
    }



    const gullPoopPool = new ObjectPool(makeGullPoop, gullPoopResetFunc, 10)

    const gullPoopSpawner = new Spawner(2, gullPoopPool)

    // seagullPool.poolArray.forEach(seagull => {
    //     seagull.data.projectile = new Projectile(

    //         new SpriteAnimation(
    //             gullPoopSpriteImage, 0, 0, 0),
    //         0,
    //         0,
    //         16, // dWidth
    //         16, // dHeight
    //         0, // velocityX
    //         6, // velocityY 
    //         30,  // fps
    //         -100, // pointValue
    //         -25, // healthValue
    //         seagull.data, // parentSprite
    //         250
    //     )
    // })

    //         new SpriteAnimation(
    //             gullPoopSpriteImage, 0, 0, 0),
    //         0,
    //         0,
    //         16, // dWidth
    //         16, // dHeight
    //         0, // velocityX
    //         6, // velocityY 
    //         30,  // fps
    //         -100, // pointValue
    //         -25, // healthValue
    //         seagull.data, // parentSprite
    //         250
    //     )
    // })










    // Input Handler
    // console.log(this.document)
    const input = new InputHandler(this.document)


    // Event listeners
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Escape":
                isPaused = !isPaused
                // console.log("pause toggled")
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

    controllerStartButton.addEventListener("click", (e) => {
        isPaused = !isPaused
        pauseGame()
        console.log('Start Button')
    })

    controllerStartButton.addEventListener("touchstart", (e) => {
        e.preventDefault()
        isPaused = !isPaused
        pauseGame()
        console.log('Start Button')
    })

    // controllerSelectButton.addEventListener("click", (e) => {
    //     if (!isPaused) {
    //         isPaused = !isPaused
    //         pauseGame()
    //     } else {
    //         console.log('Select Button')
    //     }
    // })

    // controllerSelectButton.addEventListener("touchstart", (e) => {
    //     e.preventDefault()
    //     if (!isPaused) {
    //         isPaused = !isPaused
    //         pauseGame()
    //     } else {
    //         console.log('Select Button')
    //     }
    // })

    // controllerDpad.addEventListener("click", (e) => {

    //     this.player.setState(this.states.WalkingLeft)
    // })

    // controllerDpad.addEventListener("touchstart", (e) => {
    //     player.setState(states.WalkingLeft)
    // })


    // controllerPrimaryButton.addEventListener("click", (e) => {
    //     if (!isPaused) {
    //         isPaused = !isPaused
    //         pauseGame()
    //     } else {
    //         console.log('Primary Button')
    //     }
    // })

    // controllerPrimaryButton.addEventListener("touchstart", (e) => {
    //     e.preventDefault()
    //     if (!isPaused) {
    //         isPaused = !isPaused
    //         pauseGame()
    //     } else {
    //         console.log('Primary Button')
    //     }
    // })


    // this.document.addEventListener("touchstart", (e) => {
    //     e.preventDefault()
    //     console.log("touchstart")
    // })
    // this.document.addEventListener("touchmove", (e) => {
    //     e.preventDefault()
    //     console.log("touchmove")
    // })
    // this.document.addEventListener("touchend", (e) => {
    //     e.preventDefault()
    //     console.log("touchend")
    // })

    let projectileTimer = 0
    const projectileInterval = 250





    // Game loop
    function animate(timeStamp) {
        if (!isPaused) {
            deltaTime = (timeStamp - lastTime) / 1000
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)


            let statusBottomY = 260

            drawStatusText(ctx, "💩 free:" + gullPoopSpawner.getFreeObjects(), 10, statusBottomY - 100)
            drawStatusText(ctx, "     active:" + gullPoopSpawner.getActiveObjects(), 10, statusBottomY - 90)
            drawStatusText(ctx, "     timer:" + Math.floor(gullPoopSpawner.timeSinceSpawn) + " / " + gullPoopSpawner.spawnInterval, 10, statusBottomY - 80)


            drawStatusText(ctx, "💩 free:" + gullPoopSpawner.getFreeObjects(), 10, statusBottomY - 100)
            drawStatusText(ctx, "     active:" + gullPoopSpawner.getActiveObjects(), 10, statusBottomY - 90)
            drawStatusText(ctx, "     timer:" + Math.floor(gullPoopSpawner.timeSinceSpawn) + " / " + gullPoopSpawner.spawnInterval, 10, statusBottomY - 80)

            drawStatusText(ctx, "🐦 free:" + seagullSpawner.getFreeObjects(), 10, statusBottomY - 60)
            drawStatusText(ctx, "     active:" + seagullSpawner.getActiveObjects(), 10, statusBottomY - 50)
            drawStatusText(ctx, "     timer: " + Math.floor(seagullSpawner.timeSinceSpawn) + " / " + seagullSpawner.spawnInterval, 10, statusBottomY - 40)

            drawStatusText(ctx, "🌭 free:" + wienerSpawner.getFreeObjects(), 10, statusBottomY - 20)
            drawStatusText(ctx, "     active:" + wienerSpawner.getActiveObjects(), 10, statusBottomY - 10)
            drawStatusText(ctx, "     timer:" + Math.floor(wienerSpawner.timeSinceSpawn) + " / " + wienerSpawner.spawnInterval, 10, statusBottomY)


            gullPoopSpawner.update(deltaTime)
            gullPoopSpawner.update(deltaTime)
            seagullSpawner.update(deltaTime)
            wienerSpawner.update(deltaTime)
            player.update(input.lastKey)


            gullPoopSpawner.draw(ctx)
            gullPoopSpawner.draw(ctx)
            seagullSpawner.draw(ctx)
            wienerSpawner.draw(ctx)
            player.draw(ctx)






            // detect collisions
            for (let i = 0; i < wienerSpawner.objectPool.poolArray.length; i++) {
                let collider = wienerSpawner.objectPool.poolArray[i]

                if (detectBoxCollision(player, collider.data)) {


                    playerHealth = player.updateHealth(collider.data)
                    healthMeterHUD.style.width = player.updateHealth(collider.data) + "%"
                    livesCounterHUD.innerText = playerLives

                    playerScore = player.updateScore(collider.data)
                    console.log(playerScore)
                    scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")



                    collider.data.isVisible = false
                    // if (player.currentScore >= 500 && player.currentScore < 1000) {
                    //     player.maxSpeedX = 2
                    // } else if (player.currentScore >= 1000) {
                    //     player.maxSpeedX = 3
                    // } else {
                    //     player.maxSpeedX = 1
                    // }
                    comboCounter++
                    if (comboCounter > 0 && comboCounter <= 5) {
                        for (let i = 1; i <= comboCounter; i++) {
                            let nthChildSelector = `:nth-child(${i})`
                            let nthChildSelectorString = nthChildSelector.toString()
                            // console.log(nthChildSelectorString)
                            let letter = comboCounterHUD.querySelector(nthChildSelectorString)
                            console.dir(letter)
                            letter.style.color = "var(--clr-purple)"
                            letter.style.opacity = "100%"
                        }
                    } else if (comboCounter > 5 && comboCounter <= 10) {
                        for (let i = 6; i <= comboCounter; i++) {
                            let nthChildSelectorIndex = i - 5
                            let nthChildSelector = `:nth-child(${nthChildSelectorIndex})`
                            let nthChildSelectorString = nthChildSelector.toString()
                            // console.log(nthChildSelectorString)
                            let letter = comboCounterHUD.querySelector(nthChildSelectorString)
                            console.dir(letter)
                            letter.style.color = "var(--clr-gold)"
                            letter.style.opacity = "100%"
                        }
                    }
                    if (comboCounter < 5) {
                        player.maxSpeedX = 1
                    } else if (comboCounter >= 5 && comboCounter < 10) {
                        player.maxSpeedX = 2
                    } else if (comboCounter >= 10) {
                        player.maxSpeedX = 4
                    }


                    if (comboCounter === 10) {
                        console.log("COMBO!!!")
                    }

                    // console.log(wienerSpawner.collider.data)
                    wienerSpawner.objectPool.releaseElement(collider)
                }
            }

            for (let i = 0; i < gullPoopSpawner.objectPool.poolArray.length; i++) {
                let collider = gullPoopSpawner.objectPool.poolArray[i]
                if (detectBoxCollision(player, collider.data)) {
                    playerHealth = player.updateHealth(collider.data)
                    healthMeterHUD.style.width = player.updateHealth(collider.data) + "%"
                    livesCounterHUD.innerText = playerLives

                    playerScore = player.updateScore(collider.data)
                    console.log(playerScore)
                    scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")


                    collider.data.isVisible = false


                    let letters = comboCounterHUD.querySelectorAll("span")
                    letters.forEach((letter) => {
                        letter.style.color = ""
                        letter.style.opacity = "50%"
                    })

                    comboCounter = 0
                    player.maxSpeedX = 1

                    // console.log(collider.data)
                    gullPoopSpawner.objectPool.releaseElement(collider)
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
        scoreCounterHUD.innerHTML = String(0).padStart(4, "0")
        scoreCounterHUD.innerHTML = String(0).padStart(4, "0")
        ui.show(gameplayHUD)
        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
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







    // Uncomment to bypass title screen
    startGame()





})

