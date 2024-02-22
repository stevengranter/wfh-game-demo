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

    let paused = false

    let lastTime = 0

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "Escape":
                paused = !paused
                ui.toggleOverlay()
                break
        }
    })

    // game loop
    function animate(timeStamp) {
        if (!paused) {
            const deltaTime = timeStamp - lastTime
            lastTime = timeStamp
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            player.update(input.lastKey)
            player.draw(ctx, deltaTime)
            drawStatusText(ctx, input)
            requestAnimationFrame(animate)
        }
    }

    function startGame() {
        animate(0)
    }

    // startGame()


})

