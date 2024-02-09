import Player from './player.js'
import InputHandler from './input.js'
import { drawStatusText } from './utils.js'

// wait for page to fully load
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    canvas.width = 475 //* this.devicePixelRatio
    canvas.height = 270 //*

    const player = new Player(canvas.width, canvas.height)
    const input = new InputHandler()

    let lastTime = 0



    // game loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        player.update(input.lastKey)
        player.draw(ctx, deltaTime)
        drawStatusText(ctx, input)

        requestAnimationFrame(animate)
    }
    animate(0)

})

