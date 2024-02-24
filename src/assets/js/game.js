import Player from './player.js'
import InputHandler from './input.js'
import { drawStatusText } from './utils.js'
import UI from './ui.js'

// wait for page to fully load
window.addEventListener('load', function () {
    const canvas = document.getElementById('game-screen__canvas')

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    canvas.width = 475 //* this.devicePixelRatio
    canvas.height = 270 //*

    const player = new Player(canvas.width, canvas.height)
    const input = new InputHandler()
    const ui = new UI(canvas)

    const titleScreen = document.getElementById('title-screen')
    const menuScreen = document.getElementById('menu-screen')
    const gameplayHUD = document.getElementById('gameplay-hud')

    const startButton = document.getElementById('start-button')
    const pauseButton = document.getElementById('pause-button')
    const resumeButton = document.getElementById('resume-button')
    const stopButton = document.getElementById('stop-button')

    let isPaused = false

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
            // drawStatusText(ctx, input)
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
        ui.show(gameplayHUD)
        canvas.classList.remove("hidden")
        animate(0)
    }

    function stopGame() {
        isPaused = false
        lastTime = 0
        location.reload() // TODO: Find better way of doing this
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



    //startGame()

    // startGame()


})

