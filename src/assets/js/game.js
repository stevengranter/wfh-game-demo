// Import modules
import GameObject from "./gameobject.js"
import GameWorld from "./gameworld.js"
import GameScene from "./gamescene.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input.js"
import { spriteTypes, spriteTags, SpriteFrame, SpriteAnimation, Sprite } from "./sprite.js"
import ObjectPool from "./objectpool.js"
import Spawner from './spawner.js'
import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.js"
import { drawStatusText, getRandomInt } from "./utils.js"
import UI from "./ui.js"

import { DebugMode } from "./debug.js"
import Seagull from "./seagull.js"



window.addEventListener("load", function () {

    // const debugPanel = document.getElementById("debug-panel")
    // const debug = new DebugMode(true, debugPanel)
    // console.log("Debug mode is " + debug.isOn)
    // Initialize canvas 🎨 //
    // const canvas = document.getElementById("game-screen__canvas")
    // const ctx = canvas.getContext("2d")
    // canvas.width = 475
    // canvas.height = 270
    // ctx.imageSmoothingEnabled = false // keeps sprites pixelated

    // Initialize game variables
    let isDevMode = false
    let lastTime = 0
    let deltaTime = 1
    let comboCounter = 0



    let isPaused = false

    const canvas = document.getElementById("game-screen__canvas")
    canvas.width = 475
    canvas.height = 270
    const ctx = canvas.getContext("2d")

    let musicPausedTime = 0



    // const uiDOMElements = document.querySelectorAll("[data-ui]")
    // console.dir(document.querySelectorAll("[data-ui]"))

    // uiDOMElements.forEach((element) => {
    //     let constName = element.id.toString()
    //     console.log(constName)
    // })

    // DOM UI elements //
    const ui = new UI(this.document)







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
        0,
        48,
        48,
        playerStandingLeftAnimation,
        canvas.width,
        canvas.height)

    let playerLives = player.currentLives
    let playerHealth = player.currentHealth
    let playerScore = player.currentScore
    let playerProgress = player.currentProgress
    let wienersCollected = 0
    let pooCaught = 0

    // const backgroundRocksImage = new Image()
    // backgroundRocksImage.src = "./assets/images/bg02-rocks.png"

    // const backgroundLayer02 = new Layer(backgroundRocksImage, 0, 0, 2760, 270, 0, 0, 2760, 270, 0, 0)


    // Sprites

    // Wiener 🌭

    const wienerImage = new Image()
    wienerImage.src = "./assets/images/wiener-32px-spin-01.png"
    const wienerSpriteImage = new SpriteFrame(wienerImage, 0, 0, 32, 32)
    const makeWiener = () => new Sprite(
        ctx,
        getRandomInt(20, 460), // dx
        -50, // dy
        32, // dWidth
        32, // dHeight
        new SpriteAnimation(wienerSpriteImage, 0, 0, 28),
        getRandomInt(-75, 75), //getRandomInt(-1, 1), // velocityX
        getRandomInt(25, 200), //getRandomInt(1, 3), // velocityY
        getRandomInt(15, 120), // fps
        100, // pointValue
        5, // healthValue
        spriteTypes.PROP, // sprite Type
        spriteTags.WIENER,
        [spriteTypes.PLAYER],
    )

    const wienerResetFunc = (wiener) => {
        wiener.isScored = false
        wiener.isVisible = true
        wiener.dx = getRandomInt(20, 460)
        wiener.dy = -50
        wiener.velocityX = getRandomInt(-75, 75)
        wiener.velocityY = getRandomInt(25, 200)
    }

    const wienerPool = new ObjectPool(makeWiener, wienerResetFunc, 10)
    const wienerSpawner = new Spawner(0.75, wienerPool)
    // console.log(wienerPool)

    // Seagull 🐦

    const seagullImage = new Image()
    seagullImage.src = "./assets/images/seagull-flying-sprite-01.png"

    const seagullSpriteImage = new SpriteFrame(seagullImage, 0, 0, 44, 51)
    const makeSeagull = () => new Seagull(
        ctx, // spritesheet
        getRandomInt(465, 500), // dx
        getRandomInt(10, 50), //dy
        44, // dWidth
        51, // dHeight
        new SpriteAnimation(seagullSpriteImage, 0, 0, 7),
        getRandomInt(-300, -75), // velocityX
        Math.random() < 0.5 ? -10 : 10, // velocityY 
        30,  // fps
        0, // pointValue
        0, // healthValue
        spriteTypes.ENEMY, // spriteType
        spriteTags.GULL, // spriteTag
        [spriteTypes.PLAYER] // collidesWith
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
    console.log(seagullPool)

    const collision = new CollisionDetector()


    //Seagull poop(Random locations)

    const gullPooImage = new Image()
    gullPooImage.src = "./assets/images/seagull-poo-sprite-02.png"
    const gullPooSpriteImage = new SpriteFrame(gullPooImage, 0, 0, 16, 16)
    // const gullPooSpriteAnimation = new SpriteAnimation(gullPooSpriteImage, 0, 0, 0)


    const makeGullPoo = () => new Projectile(
        ctx,
        getRandomInt(20, 460),
        getRandomInt(-10, -40),
        16, // dWidth
        16, // dHeight
        new SpriteAnimation(gullPooSpriteImage, 0, 0, 0),
        25, // velocityX
        200, // velocityY
        30,  // fps
        0, // pointValue
        -20, // healthValue
        spriteTypes.PROP,
        spriteTags.POO,
        [spriteTypes.PLAYER]
    )

    const gullPooResetFunc = (gullPoo) => {
        gullPoo.isScored = false
        gullPoo.isVisible = true
        gullPoo.dx = getRandomInt(20, 460)
        gullPoo.dy = getRandomInt(-10, -40)
        gullPoo.velocityX = 25
        gullPoo.velocityY = 200
    }

    const gullPooPool = new ObjectPool(makeGullPoo, gullPooResetFunc, 10)

    for (let i = 0; i < 10; i++) {
        seagullPool.poolArray[i].data.projectile = gullPooPool.poolArray[i]
        gullPooPool.poolArray[i].data.parentSprite = seagullPool.poolArray[i].data
        gullPooPool.poolArray[i].data.dx = gullPooPool.poolArray[i].data.parentSprite.dx
        gullPooPool.poolArray[i].data.dy = gullPooPool.poolArray[i].data.parentSprite.dy
    }

    const gullPooSpawner = new Spawner(1, gullPooPool)


    const scene01Spawners = [wienerSpawner, seagullSpawner, gullPooSpawner]
    // Scene Objects

    const backgroundLayer01Img = new Image()
    backgroundLayer01Img.src = "./assets/images/bg01-basic.png"
    const backgroundLayer01 = new Layer(player, false, backgroundLayer01Img, 0, 0, 0, 0, 950, 270, 0, 0, 950, 270)

    const backgroundLayer02Img = new Image()
    backgroundLayer02Img.src = "./assets/images/bg-clouds-01.png"
    const backgroundLayer02 = new Layer(player, false, backgroundLayer02Img, 0, 0, 0, 0, 978, 197, 0, 0, 978, 197)
    backgroundLayer01.velocityX = 0

    const scene01 = new GameScene(0, 'Bonavista', player, [backgroundLayer01, backgroundLayer02], [], scene01Spawners, "./assets/audio/music/song-01/song_01-i_equals_da_by.m4a", [])

    // const scene02Spawners = [wienerSpawner]
    // const backgroundLayer02 = new Layer(player, false, "./assets/images/bg02-rocks.png")
    // backgroundLayer02.velocityX = 0

    // const scene02 = new GameScene(0, 'new', player, [backgroundLayer02], [], scene02Spawners, "./assets/audio/music/song_01-i_equals_da_by.ogg", [])

    let currentScene = scene01

    ui.music = currentScene.music


    // console.log(scene01)
    let gameWorld = new GameWorld(canvas, 475, 270, player, currentScene)













    // Seagull poo (delivered by gull)

    // const gullPoopImage = new Image()
    // gullPoopImage.src = "./assets/images/seagull-poop-sprite-01.png"
    // const gullPoopSpriteImage = new SpriteFrame(gullPoopImage, 0, 0, 16, 16)
    // const gullPoopSpriteAnimation = new SpriteAnimation(gullPoopSpriteImage, 0, 0, 0)















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

    ui.startButton.addEventListener("click", startGame)

    ui.stopButton.addEventListener("click", resetGame)

    // pauseButton.addEventListener("click", (e) => {
    //     isPaused = !isPaused
    //     pauseGame()
    // })

    ui.resumeButton.addEventListener("click", (e) => {
        isPaused = !isPaused
        pauseGame()
    })

    ui.controllerStartButton.addEventListener("click", (e) => {
        isPaused = !isPaused
        pauseGame()
        // console.log('Start Button')
    })

    ui.controllerStartButton.addEventListener("touchstart", (e) => {
        e.preventDefault()
        isPaused = !isPaused
        pauseGame()
        // console.log('Start Button')
    })


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



    // // Game loop
    // function animate(timeStamp) {
    //     if (!isPaused) {
    //         deltaTime = (timeStamp - lastTime) / 1000
    //         lastTime = timeStamp
    //         ctx.clearRect(0, 0, canvas.width, canvas.height)
    //         // ctx.drawImage(backgroundImage, 0, 0)
    //         if (music.currentTime === 0) {
    //             console.log("Time's Up!")
    //             return
    //         }
    //         // player.setState(6)
    //         // player.resetPlayer()
    //         let statusBottomY = 260



    //         // drawStatusText(ctx, "💩 free:" + gullPoopSpawner.getFreeObjects(), 10, statusBottomY - 100)
    //         // drawStatusText(ctx, "     active:" + gullPoopSpawner.getActiveObjects(), 10, statusBottomY - 90)
    //         // drawStatusText(ctx, "     timer:" + Math.floor(gullPoopSpawner.timeSinceSpawn) + " / " + gullPoopSpawner.spawnInterval, 10, statusBottomY - 80)


    //         // drawStatusText(ctx, "💩 free:" + gullPoopSpawner.getFreeObjects(), 10, statusBottomY - 100)
    //         // drawStatusText(ctx, "     active:" + gullPoopSpawner.getActiveObjects(), 10, statusBottomY - 90)
    //         // drawStatusText(ctx, "     timer:" + Math.floor(gullPoopSpawner.timeSinceSpawn) + " / " + gullPoopSpawner.spawnInterval, 10, statusBottomY - 80)

    //         // drawStatusText(ctx, "🐦 free:" + seagullSpawner.getFreeObjects(), 10, statusBottomY - 60)
    //         // drawStatusText(ctx, "     active:" + seagullSpawner.getActiveObjects(), 10, statusBottomY - 50)
    //         // drawStatusText(ctx, "     timer: " + Math.floor(seagullSpawner.timeSinceSpawn) + " / " + seagullSpawner.spawnInterval, 10, statusBottomY - 40)

    //         // drawStatusText(ctx, "🌭 free:" + wienerSpawner.getFreeObjects(), 10, statusBottomY - 20)
    //         // drawStatusText(ctx, "     active:" + wienerSpawner.getActiveObjects(), 10, statusBottomY - 10)
    //         // drawStatusText(ctx, "     timer:" + Math.floor(wienerSpawner.timeSinceSpawn) + " / " + wienerSpawner.spawnInterval, 10, statusBottomY)

    //         // backgroundLayer01.velocityX = -Math.round(player.speedX)

    //         scene01.update(deltaTime)

    //         // backgroundLayer02.velocityX = -player.speedX / 2
    //         // backgroundLayer02.update(deltaTime)


    //         gullPoopSpawner.update(deltaTime)
    //         seagullSpawner.update(deltaTime)
    //         wienerSpawner.update(deltaTime)
    //         player.update(input, deltaTime)

    //         // for (let i = 0; i < 10; i++) {
    //         //     if (!seagullPool.poolArray[i].free) {




    //         //         // console.log(seagullPool.poolArray[i].data.projectile.dx)
    //         //         seagullPool.poolArray[i].data.projectile.update()



    //         //     }
    //         // }
    //         // seagullPool.poolArray[i].data.poopSprite.update(deltaTime)
    //         // console.log("seagull" + i + " DX: " + seagullPool.poolArray[i].data.dx)
    //         // console.log("poop " + i + " DX: " + seagullPool.poolArray[i].data.poopSprite.dx)
    //         // console.log("seagull" + i + " DY: " + seagullPool.poolArray[i].data.dx)
    //         // console.log("poop " + i + " DY: " + seagullPool.poolArray[i].data.poopSprite.dx)
    //         //}


    //         scene01.draw(ctx)

    //         // backgroundLayer02.draw(ctx)



    //         gullPoopSpawner.draw(ctx)
    //         seagullSpawner.draw(ctx)
    //         // for (let i = 0; i < 10; i++) {
    //         //     if (!seagullPool.poolArray[i].free) {
    //         //         seagullPool.poolArray[i].data.projectile.draw(ctx)
    //         //     }
    //         // }


    //         wienerSpawner.draw(ctx)
    //         player.draw(ctx)

    //         drawStatusText(ctx, "music.currentTime: " + music.currentTime, 10, statusBottomY - 80)
    //         drawStatusText(ctx, "music time left " + Math.floor(music.duration - music.currentTime), 10, statusBottomY - 70)

    //         drawStatusText(ctx, "player.dx: " + player.dx, 10, statusBottomY - 50)
    //         drawStatusText(ctx, "player.speedX: " + player.speedX, 10, statusBottomY - 40)
    //         drawStatusText(ctx, "player.speedY: " + player.speedY, 10, statusBottomY - 30)
    //         drawStatusText(ctx, "player.velocityX: " + player.velocityX, 10, statusBottomY - 20)
    //         drawStatusText(ctx, "input" + input.left, 10, statusBottomY - 100)

    //         // drawStatusText(ctx, "🌭 free:" + wienerSpawner.getFreeObjects(), 10, statusBottomY - 20)
    //         // drawStatusText(ctx, "     active:" + wienerSpawner.getActiveObjects(), 10, statusBottomY - 10)
    //         // drawStatusText(ctx, "     timer:" + Math.floor(wienerSpawner.timeSinceSpawn) + " / " + wienerSpawner.spawnInterval, 10, statusBottomY)


    //         ui.timerHUD.innerText = Math.floor(music.duration - music.currentTime)

    //         if (player.isAlive) {
    //             // detect collisions
    //             for (let i = 0; i < wienerSpawner.objectPool.poolArray.length; i++) {
    //                 let collider = wienerSpawner.objectPool.poolArray[i]

    //                 if (detectBoxCollision(player, collider.data)) {


    //                     playerHealth = player.updateHealth(collider.data)
    //                     healthMeterHUD.style.width = playerHealth + "%"
    //                     if (playerLives > 1) {
    //                         livesCounterHUD.innerText = "x" + playerLives
    //                     }

    //                     playerScore = player.updateScore(collider.data)
    //                     // console.log(playerScore)
    //                     ui.scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")



    //                     collider.data.isVisible = false
    //                     // if (player.currentScore >= 500 && player.currentScore < 1000) {
    //                     //     player.maxSpeedX = 2
    //                     // } else if (player.currentScore >= 1000) {
    //                     //     player.maxSpeedX = 3
    //                     // } else {
    //                     //     player.maxSpeedX = 1
    //                     // }
    //                     comboCounter++
    //                     if (comboCounter > 0 && comboCounter <= 5) {
    //                         for (let i = 1; i <= comboCounter; i++) {
    //                             let nthChildSelector = `:nth-child(${i})`
    //                             let nthChildSelectorString = nthChildSelector.toString()
    //                             // console.log(nthChildSelectorString)
    //                             let letter = ui.comboCounterHUD.querySelector(nthChildSelectorString)
    //                             // console.dir(letter)
    //                             letter.style.color = "var(--clr-purple)"
    //                             letter.style.opacity = "100%"
    //                         }
    //                     } else if (comboCounter > 5 && comboCounter <= 10) {
    //                         for (let i = 6; i <= comboCounter; i++) {
    //                             let nthChildSelectorIndex = i - 5
    //                             let nthChildSelector = `:nth-child(${nthChildSelectorIndex})`
    //                             let nthChildSelectorString = nthChildSelector.toString()
    //                             // console.log(nthChildSelectorString)
    //                             let letter = comboCounterHUD.querySelector(nthChildSelectorString)
    //                             // console.dir(letter)
    //                             letter.style.color = "var(--clr-gold)"
    //                             letter.style.opacity = "100%"
    //                         }
    //                     }
    //                     if (comboCounter < 5) {
    //                         player.maxSpeedX = 75
    //                     } else if (comboCounter >= 5 && comboCounter < 10) {
    //                         player.maxSpeedX = 150
    //                     } else if (comboCounter >= 10) {
    //                         player.maxSpeedX = 225
    //                     }


    //                     if (comboCounter === 10) {
    //                         console.log("COMBO!!!")
    //                     }


    //                     // console.log(wienerSpawner.collider.data)
    //                     wienerSpawner.objectPool.releaseElement(collider)
    //                 }
    //             }

    //             for (let i = 0; i < gullPoopSpawner.objectPool.poolArray.length; i++) {
    //                 let collider = gullPoopSpawner.objectPool.poolArray[i]
    //                 if (detectBoxCollision(player, collider.data)) {
    //                     playerHealth = player.updateHealth(collider.data)
    //                     healthMeterHUD.style.width = playerHealth + "%"
    //                     playerScore = player.updateScore(collider.data)
    //                     // console.log(playerScore)
    //                     ui.scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")


    //                     collider.data.isVisible = false


    //                     let letters = comboCounterHUD.querySelectorAll("span")
    //                     letters.forEach((letter) => {
    //                         letter.style.color = ""
    //                         letter.style.opacity = "50%"
    //                     })

    //                     comboCounter = 0
    //                     player.maxSpeedX = 75
    //                     if (!player.isAlive) {

    //                         playerLives--

    //                         if (playerLives > 1) {
    //                             livesCounterHUD.innerText = "x" + playerLives

    //                         } else if (playerLives = 1) {
    //                             livesCounterHUD.innerText = ""
    //                         } else if (playerLives = 0) {
    //                             player.isAlive = false
    //                         }
    //                         resetPlayer()
    //                     }
    //                     // console.log(collider.data)
    //                     gullPoopSpawner.objectPool.releaseElement(collider)
    //                 }
    //             }

    //         } // end if (player.isAlive)


    //         // for (let i = 0; i < jumboSpawner.objectPool.poolArray.length; i++) {
    //         //     if (detectBoxCollision(player, jumboSpawner.objectPool.poolArray[i].data)) {
    //         //         jumboSpawner.objectPool.poolArray[i].data.isVisible = false
    //         //         updateScore(jumboSpawner.objectPool.poolArray[i].data)
    //         //         jumboSpawner.objectPool.releaseElement(jumboSpawner.objectPool.poolArray[i])

    //         //     }
    //         // }

    //         requestAnimationFrame(animate)
    //     } else {
    //         pauseGame()
    //     }
    // }

    console.log(currentScene.player)
    currentScene.spawners.forEach((spawner) => {
        console.log(spawner)
    })

    console.log(currentScene)
    function loop(timeStamp) {
        if (!isPaused) {
            deltaTime = (timeStamp - lastTime) / 1000
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ui.timerHUD.innerText = Math.floor(currentScene.music.duration - currentScene.music.currentTime)


            currentScene.update(deltaTime)
            currentScene.player.update(input, deltaTime)

            if (currentScene.music.currentTime >= 0) {
                if (player.isAlive) {
                    currentScene.spawners.forEach((spawner) => {
                        let collider = collision.detectBoxCollision(player, spawner.objectPool.poolArray)
                        // console.log(spawner.objectPool.poolArray)
                        if (collider) {

                            if (collider.spriteTag === spriteTags.WIENER) {
                                console.log("🌭")
                                playerScore = player.updateScore(collider)
                                ui.scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")
                                if (playerScore >= 5000) {
                                    ui.scoreCounterHUD.style.color = "var(--clr-purple)"
                                    ui.scoreStatusHUD.innerText = "Next Level Unlocked!"
                                    playerProgress = 1
                                }
                                calculateCombo()
                            } else if (collider.spriteTag === spriteTags.POO) {
                                console.log("💩")
                                playerHealth = player.updateHealth(collider)
                                ui.healthMeterHUD.style.width = playerHealth + "%"
                                resetCombo()
                            } else if (collider.spriteTag === spriteTags.GULL) {
                                console.log("🐦")
                            }

                            // console.log("collision")
                            // playerScore = player.updateScore(collider)
                            // if (playerScore >= 500) {
                            //     ui.show(ui.menuOverlay)
                            //     ui.show(ui.congratsScreen)
                            //     setTimeout(() => {
                            //         ui.hide(ui.menuOverlay)
                            //         ui.hide(ui.congratsScreen)
                            //     }, 2000)
                            // }







                        }
                    })
                } else {
                    playerLives--

                    if (playerLives > 1) {
                        ui.livesCounterHUD.innerText = "x" + playerLives

                    } else if (playerLives = 1) {
                        ui.livesCounterHUD.innerText = ""
                    } else if (playerLives = 0) {
                        player.isAlive = false
                    }
                    endGame()

                }

            } else {
                ui.show(ui.endsceneScreen)
            }

            currentScene.draw(ctx)
            currentScene.player.draw(ctx)

            ui.devModePanel.querySelector("#debug-player-speedX span").innerText = player.speedX
            // ui.devModePanel.querySelector("#debug-player-dx span").innerText = player.dx


            requestAnimationFrame(loop)
        } else {
            pauseGame()
        }

    }


    // Game state functions
    function startGame() {
        ui.hide(ui.titleScreen)
        ui.hide(ui.menuScreen)
        ui.hide(ui.menuOverlay)

        ui.show(ui.gameplayHUD)
        ui.show(ui.ingameOverlay)

        if (isDevMode) {
            ui.show(ui.devModePanel)

        }


        ui.scoreCounterHUD.innerHTML = String(0).padStart(4, "0")
        if (playerLives > 1) {
            livesCounterHUD.innerText = "x" + playerLives
        }

        // ui.show(gameplayHUD)
        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
        canvas.classList.remove("hidden")




        if (currentScene.isMusicLoaded) {
            console.log("music is loaded")
            currentScene.music.play()
            loop(0)
            // setTimeout(() => {

            // }, "4000")
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

    function pauseGame() {
        if (isPaused) {
            // titleScreen.classList.add("hidden")

            ui.hide(ui.ingameOverlay)
            ui.hide(ui.titleScreen)
            ui.hide(ui.gameOverScreen)
            ui.show(ui.menuScreen)
            ui.show(ui.menuOverlay)
            musicPausedTime = currentScene.music.currentTime
            currentScene.music.pause()
        }
        else {

            ui.show(ui.ingameOverlay)
            ui.hide(ui.menuScreen)
            ui.hide(ui.menuOverlay)
            ui.hide(ui.gameOverScreen)
            ui.show(ui.gameplayHUD)
            currentScene.music.currentTime = musicPausedTime
            currentScene.music.play()
            loop(lastTime)
            isPaused = false
        }
    }

    function resetPlayer() {
        console.log("Reset Player")
    }

    function calculateCombo() {
        comboCounter++
        if (comboCounter > 0 && comboCounter <= 5) {
            for (let i = 1; i <= comboCounter; i++) {
                let nthChildSelector = `:nth-child(${i})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = ui.comboCounterHUD.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-purple)"
                letter.style.opacity = "100%"
            }
        } else if (comboCounter > 5 && comboCounter <= 10) {
            for (let i = 6; i <= comboCounter; i++) {
                let nthChildSelectorIndex = i - 5
                let nthChildSelector = `:nth-child(${nthChildSelectorIndex})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = ui.comboCounterHUD.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-gold)"
                letter.style.opacity = "100%"
            }
        }
        if (comboCounter < 5) {
            player.speedBonus = 0
        } else if (comboCounter >= 5 && comboCounter < 10) {
            player.speedBonus = 25
        } else if (comboCounter >= 10) {
            player.speedBonus = 50
        }


        if (comboCounter === 10) {
            console.log("COMBO!!!")
        }
    }

    function resetCombo() {
        comboCounter = 0
        player.speedBonus = 0
        let letters = ui.comboCounterHUD.querySelectorAll("span")
        letters.forEach((letter) => {
            letter.style.color = ""
            letter.style.opacity = "50%"
        })
    }


    function toggleDevMode() {
        isDevMode = !isDevMode
    }

    toggleDevMode()




    // Uncomment to bypass title screen
    //startGame()





})

