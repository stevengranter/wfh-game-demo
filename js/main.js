// Import modules
import { GameWorld, GameScene } from "./game.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input.js"
import Sprite from "./sprite.js"
import { spriteTags } from "./sprite.js"
import ObjectPool from "./objectpool.js"
import Spawner from './spawner.js'
// import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.js"
import { drawStatusText, getRandomInt } from "./utils.js"
import UI from "./ui.js"



window.addEventListener("load", function () {


    // Initialize game variables
    let isDevMode = false
    let lastTime = 0
    let deltaTime = 1
    let comboCounter = 0
    let isPaused = false
    let musicPausedTime = 0

    const canvas = document.getElementById("game-screen__canvas")
    canvas.width = 475
    canvas.height = 270
    const ctx = canvas.getContext("2d")


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

    let playerLives = player.stats.lives
    let playerHealth = player.stats.health
    let playerScore = player.stats.score

    let playerProgress = player.stats.progress
    let wienersCollected = 0
    let pooCaught = 0

    // Initialize UI elements //
    const ui = new UI("[data-ui]", player)

    // Initialize background layers //

    const backgroundLayer01Img = new Image()
    backgroundLayer01Img.src = "./images/bg01-basic.png"
    const backgroundLayer01 = new Layer(player, false, backgroundLayer01Img, 0, 0, 0, 0, 950, 270, 0, 0, 950, 270)

    const backgroundLayer02Img = new Image()
    backgroundLayer02Img.src = "./images/bg-clouds-01.png"
    const backgroundLayer02 = new Layer(player, false, backgroundLayer02Img, 0, 0, 0, 0, 978, 197, 0, 0, 978, 197)
    backgroundLayer02.velocityX = -15



    // Sprites

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

    console.log(wienerSpawner)

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






    const scene01Spawners = [wienerSpawner, gullSpawner]
    // Scene Objects


    const scene01 = new GameScene(1, "Bonavista", player, [backgroundLayer01, backgroundLayer02], [], scene01Spawners, "./audio/music/song-01/song_01-i_equals_da_by.mp3", [])

    let currentScene = scene01
    ui.music = currentScene.music

    let gameWorld = new GameWorld(canvas, 475, 270, player, currentScene)













    // Seagull poo (delivered by gull)

    // const gullPoopImage = new Image()
    // gullPoopImage.src = "./images/seagull-poop-sprite-01.png"
    // const gullPoopSpriteImage = new AnimationFrame(gullPoopImage, 0, 0, 16, 16)
    // const gullPoopSpriteAnimation = new SpriteAnimation(gullPoopSpriteImage, 0, 0, 0)















    // Input Handler
    // console.log(this.document)
    const input = new InputHandler(ui)

    console.log(player)

    console.log(ui)

    ui.elements.startButton.addEventListener("click", (e) => {
        startGame()
    })
    ui.showUI("cutscene")
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



    console.log(currentScene)
    currentScene.spawners.forEach((spawner) => {
        console.log(spawner)
    })

    console.log(currentScene)
    function loop(timeStamp) {
        // console.log("in loop function")
        if (!isPaused) {
            // console.log(deltaTime)
            deltaTime = (timeStamp - lastTime) / 1000
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // ui.timerHUD.innerText = Math.floor(currentScene.music.duration - currentScene.music.currentTime)


            currentScene.update(deltaTime)
            player.update(input, deltaTime, 475, 270)

            if (currentScene.music.currentTime >= 0) {
                if (player.isAlive) {
                    currentScene.spawners.forEach((spawner) => {
                        // console.log("collision")
                        let collider = CollisionDetector.detectBoxCollision(player, spawner.objectPool.poolArray)
                        // console.log(spawner.objectPool.poolArray)
                        if (collider) {

                            if (collider.spriteTag === spriteTags.WIENER) {
                                console.log("🌭")
                                console.log("healthValue", collider.healthValue)
                                console.log("player.stats.score", player.stats.health)
                                player.stats.health += collider.healthValue

                                player.stats.score += collider.pointValue
                                // ui.scoreCounterHUD.innerHTML = String(playerScore).padStart(4, "0")
                                if (playerScore >= 5000) {
                                    // ui.scoreCounterHUD.style.color = "var(--clr-purple)"
                                    // ui.scoreStatusHUD.innerText = "Next Level Unlocked!"
                                    playerProgress = 1
                                }
                                // calculateCombo()
                            } else if (collider.spriteTag === spriteTags.POO) {
                                console.log("💩")
                                player.stats.health += collider.healthValue
                                // playerHealth = player.updateHealth(collider)
                                // ui.healthMeterHUD.style.width = playerHealth + "%"
                                // resetCombo()
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
                        // ui.livesCounterHUD.innerText = "x" + playerLives

                    } else if (playerLives = 1) {
                        // ui.livesCounterHUD.innerText = ""
                    } else if (playerLives = 0) {
                        player.isAlive = false
                    }
                    endGame()

                }

            } else {
                ui.show(ui.endsceneScreen)
            }

            currentScene.draw(ctx)
            player.draw(ctx)

            // ui.devModePanel.querySelector("#debug-player-speedX span").innerText = player.speedX
            // ui.devModePanel.querySelector("#debug-player-dx span").innerText = player.dx


            requestAnimationFrame(loop)
        } else {
            pauseGame()
            console.log("game is paused")
        }

    }


    function initPlayer() {
        player.stats.subscribe(ui.score)
        player.stats.subscribe(ui.health)
        player.stats.subscribe(ui.lives)
        player.stats.lives = 3
        player.stats.score = 0
        player.stats.progress = 0
        player.stats.healthMax = 100
        player.stats.health = 100

    }
    // Game state functions
    function startGame() {

        console.log(player.stats)

        initPlayer()
        ui.showUI("play")

        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
        // canvas.classList.remove("hidden")

        if (currentScene.isMusicLoaded) {
            console.log("music is loaded")
            currentScene.music.play()
            loop(0)

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

            ui.showUI("paused")
            musicPausedTime = currentScene.music.currentTime
            currentScene.music.pause()
        }
        else {

            ui.showUI("play")
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
    // setTimeout(startGame, 5000)





})

