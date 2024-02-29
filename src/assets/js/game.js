// Import modules
import Player from "./player.js"
import InputHandler from "./input.js"
import Collectible from "./collectible.js"
import { drawStatusText } from "./utils.js"
import UI from "./ui.js"

// wait for page to fully load
window.addEventListener("load", function () {

    // Initialize canvas 🎨 //
    const canvas = document.getElementById("game-screen__canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 475
    canvas.height = 270
    ctx.imageSmoothingEnabled = false // keeps sprites pixelated

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
    const player = new Player(canvas.width, canvas.height)
    const input = new InputHandler()
    const ui = new UI(canvas)

    // Collectibles 
    const wienerImageSmall = document.getElementById("wiener-sprite--16px-spin")
    const wienerSpriteSmall = new Collectible(wienerImageSmall, 250, 0, 16, 16, 50)

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
            const deltaTime = timeStamp - lastTime
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            player.update(input.lastKey)
            player.draw(ctx, deltaTime)
            wienerSpriteSmall.update()

            wienerSpriteSmall.draw(ctx, deltaTime)
            if (detectCollision(player, wienerSpriteSmall)) {
                updateScore(wienerSpriteSmall)
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
    function detectCollision(object1, object2) {
        // console.log(object2.y + object2.height)
        // console.log(object2.y)
        // console.log((object1.x + object1.width))
        // console.log(object2.x)
        return (

            // (object2.y + object2.height) >= object1.y
            //     &&
            ((object1.y + object1.height) <= object2.y) &&

            ((object1.x + object1.width) >= object2.x)

            //         // object1 Right Side collides with object1 Left side 
            //         (object2.x + object2.width) >= object1.x)
            // 
        )

    }


    // Score-keeping
    function initScore() {
        scoreDisplay.innerHTML = String(currentScore).padStart(4, "0")
    }

    function updateScore(object) {
        if (object) {
            if (!object.isScored) {
                currentScore += object.pointValue
                scoreDisplay.innerHTML = String(currentScore).padStart(4, "0")
                object.isScored = true
            }
        }
    }



    // Uncomment to bypass title screen
    // startGame()





})

