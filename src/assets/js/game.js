import Player from './player.js'
import InputHandler from './input.js'
import Collectible from './collectible.js'
import { drawStatusText } from './utils.js'
import UI from './ui.js'

// wait for page to fully load
window.addEventListener('load', function () {
    const canvas = document.getElementById('game-screen__canvas')

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    canvas.width = 475 //* this.devicePixelRatio
    canvas.height = 270 //*

    const body = document.getElementsByTagName('body')[0]
    console.log(body)

    const player = new Player(canvas.width, canvas.height)
    const input = new InputHandler()
    const ui = new UI(canvas)

    const scoreDisplay = document.getElementById("hud-score")

    const titleScreen = document.getElementById('title-screen')
    const menuScreen = document.getElementById('menu-screen')
    const gameplayHUD = document.getElementById('gameplay-hud')

    const startButton = document.getElementById('start-button')
    const pauseButton = document.getElementById('pause-button')
    const resumeButton = document.getElementById('resume-button')
    const stopButton = document.getElementById('stop-button')


    // define our collectibles //

    const wienerImage = document.getElementById('wiener-sprite-01')

    const wiener = new Collectible(wienerImage, 0, 0, 48, 48, 50)


    let isPaused = false
    let currentScore = 0
    let lastTime = 0

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "Escape":
                isPaused = !isPaused
                console.log('pause toggled')
                pauseGame()
                break
        }
    })



    // game loop
    function animate(timeStamp) {
        if (!isPaused) {
            const deltaTime = timeStamp - lastTime
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            player.update(input.lastKey)
            player.draw(ctx, deltaTime)
            wiener.update()
            wiener.draw(ctx, deltaTime, 220, -100, 32, 32)
            if (detectCollision(player, wiener)) {
                updateScore(wiener)
            }


            requestAnimationFrame(animate)
        } else {
            pauseGame()
        }
    }

    function startGame() {
        // ui.toggleOverlay()
        console.log('lastTime =' + lastTime)
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
            console.log("PAUSED")
            console.log('in if (isPaused) condition ')
            console.log('lastTime =' + lastTime)
            // canvas.classList.add("hidden")
            // ui.toggleOverlay()
            // pauseButton.innerText = "Resume"
            ui.show(menuScreen)
            ui.hide(gameplayHUD)
            // document.getElementById('overlay').classList.remove("hidden")
        }
        else {
            console.log("RUNNING")
            console.log('in if (!isPaused) condition ')
            canvas.classList.remove("hidden")
            // pauseButton.innerText = "Pause"
            ui.hide(menuScreen)
            ui.show(gameplayHUD)
            animate(lastTime)
            isPaused = false
        }
    }

    startButton.addEventListener('click', startGame)

    stopButton.addEventListener('click', stopGame)

    pauseButton.addEventListener('click', (e) => {
        isPaused = !isPaused
        console.log('pause toggled')
        pauseGame()
    })

    resumeButton.addEventListener('click', (e) => {
        isPaused = !isPaused
        pauseGame()
    })

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


    function updateScore(object) {
        if (object) {
            if (!object.isScored) {
                currentScore += object.pointValue
                scoreDisplay.innerHTML = String(currentScore).padStart(4, '0')
                object.isScored = true
            }
        }
    }

    function initScore() {
        scoreDisplay.innerHTML = String(currentScore).padStart(4, '0')
    }
    // startGame()





})

