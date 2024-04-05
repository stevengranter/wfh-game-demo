// Import modules
import { GameWorld, GameScene } from "./game.js"
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
import { drawStatusText, getRandomInt, wait } from "./utils.js"
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

    // Initialize UI elements //
    const ui = new UI("[data-ui]", player)
    console.dir(ui)
    const pauseMenu = new PauseMenu()
    pauseMenu.init(ui.elements.pauseMenuContainer)




    // Initialize background layers //

    // const backgroundLayer01Img = new Image()
    // backgroundLayer01Img.src = "./images/bg-clouds-01.png"
    // const backgroundLayer01 = new Layer(player, false, backgroundLayer01Img, 0, 0, 0, 0, 950, 270, 0, -75, 950, 270)
    // backgroundLayer01.velocityX = -20

    const backgroundLayer02Img = new Image()
    backgroundLayer02Img.src = "./images/bg01-houses-ocean.png"
    const backgroundLayer02 = new Layer(player, false, backgroundLayer02Img, 0, 0, 0, 0, 944, 512, 0, 0, 480, 270)
    backgroundLayer02.velocityX = 0

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
    const scene01 = new GameScene(1, "Bonavista", player, [backgroundLayer02], [], scene01Spawners, "./audio/music/song-01/song_01-i_equals_da_by.mp3", [])
    let currentScene = scene01
    ui.music = currentScene.music

    let gameWorld = new GameWorld(canvas, 475, 270, player, currentScene)

    // Input Handler
    // console.log(this.document)
    const input = new InputHandler(ui)

    console.log(ui)

    // Event listeners
    ui.elements.startButton.addEventListener("click", (e) => {
        runIntro()
    })

    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Escape":
                isPaused = !isPaused
                // console.log("pause toggled")
                pauseGame()
                break
        }
    })

    ui.showUI("cutscene")




    function loop(timeStamp) {
        // console.log("in loop function")
        if (!isPaused) {
            // console.log(deltaTime)
            deltaTime = (timeStamp - lastTime) / 1000
            lastTime = timeStamp
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            // ui.timerHUD.innerText = Math.floor(currentScene.music.duration - currentScene.music.currentTime)


            currentScene.update(deltaTime)
            player.update(input, deltaTime, CANVAS_WIDTH, CANVAS_HEIGHT)

            if (currentScene.music.currentTime >= 0) {
                if (player.isAlive === true) {
                    currentScene.spawners.forEach((spawner) => {

                        let collider = CollisionDetector.detectBoxCollision(player, spawner.objectPool.poolArray)
                        // console.log(spawner.objectPool.poolArray)
                        if (collider) {
                            console.log("collision")
                            if (collider.spriteTag === spriteTags.WIENER) {

                                player.stats.health += collider.healthValue

                                player.stats.score += collider.pointValue
                                if (player.stats.score >= 5000) {
                                    // ui.scoreCounterHUD.style.color = "var(--clr-purple)"
                                    // ui.scoreStatusHUD.innerText = "Next Level Unlocked!"
                                    player.stats.progress = 1
                                }
                                // calculateCombo()
                            } else if (collider.spriteTag === spriteTags.POO) {
                                console.log("💩")
                                player.stats.health += collider.healthValue

                            } else if (collider.spriteTag === spriteTags.GULL) {
                                console.log("🐦")
                            }



                        }
                    })
                } else {
                    player.stats.lives--
                    player.isAlive = false

                    if (player.stats.lives > 1) {
                        // ui.livesCounterHUD.innerText = "x" + playerLives

                    } else if (player.stats.lives = 1) {
                        // ui.livesCounterHUD.innerText = ""
                    } else if (player.stats.lives <= 0) {
                        endGame()
                    }


                }

            } else {
                ui.show(ui.endsceneScreen)
            }

            currentScene.draw(ctx)
            player.draw(ctx)


            requestAnimationFrame(loop)
        } else {
            pauseGame()
            console.log("game is paused")
        }

    }



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

    function typeWriter(elementId, text, typingDelay) {
        let index = 0
        const element = document.getElementById(elementId)

        // Clear existing text
        element.innerHTML = ''

        // Function to add characters one by one
        function addCharacter() {
            // Handle HTML tags (like <strong>)
            if (text[index] === '<') {
                let tag = ''
                do {
                    tag += text[index]
                    index++
                } while (text[index] !== '>' && index < text.length)
                tag += '>'
                index++
                element.innerHTML += tag
            } else {
                // Add text character
                element.innerHTML += text[index++]
            }

            // Continue the effect if there are more characters
            if (index < text.length) {
                setTimeout(addCharacter, typingDelay)
            }
        }

        // Start the typewriter effect
        addCharacter()
    }

    // Extract the text content from the div without child elements like <strong>
    const dialogText = document.querySelector('#intro-dialog div').textContent

    // Start the typewriter effect


    // blurBackground()
    function initPlayer() {
        player.stats.subscribe(ui.lives)
        player.stats.subscribe(ui.score)
        player.stats.subscribe(ui.healthBarWidth)
        player.stats.subscribe(ui.healthBarColor)

        player.stats.lives = 3
        player.stats.score = 0
        player.stats.progress = 0
        player.stats.healthMax = 100
        Pplayer.stats.health = 100

    }
    // Game state functions

    function runIntro() {
        ui.showUI("cutscene")
        console.log(ui)

        ui.hide(ui.elements.titleScreen)
        ui.show(ui.elements.introScreen)

        ui.show(ui.elements.characterPortrait)
        setTimeout(() => { ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { ui.elements.characterPortrait.style.transform = "translateY(0px)" }, 700)

        currentScene.draw(ctx)
        setTimeout(() => { animateBlur() }, 1000)
        typeWriter('intro-dialog', dialogText, 25)
        document.getElementById("intro-dialog").addEventListener("pointerdown", () => {
            setTimeout(() => { ui.elements.introDialog.style.transform = "translateY(400px)" }, 500)
            setTimeout(() => { ui.elements.characterPortrait.style.transform = "translateY(475px)" }, 700)
            setTimeout(() => { startGame() }, 1300)

        })


    }
    function startGame() {

        console.log(player.stats)
        ui.showUI("play")
        currentScene.layers[0].filter = "none"

        initPlayer()


        const superNantendo = document.getElementById("ui--super-nantendo")
        superNantendo.classList.add("teal-bg")
        // canvas.classList.remove("hidden")

        if (currentScene.isMusicLoaded) {
            console.log("music is loaded")
            // runIntro()
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


    function toggleDebugMode() {
        isDebugMode = !isDebugMode

        function toggleDebugMenu() {
            debugMenu.toggleVisibility()
        }

        setInterval(() => {
            if (debugMenu.isVisible) {
                debugMenu.update()
            }
        }, 100)

        document.addEventListener('keydown', (event) => {
            if (event.key === '`') {
                toggleDebugMenu()
            }
        })

    }

    const debugMenu = new DebugMenu()
    debugMenu.watch("player.isAlive", () => player.isAlive)

    toggleDebugMode()







    // Uncomment to bypass title screen
    // setTimeout(startGame, 5000)





})

