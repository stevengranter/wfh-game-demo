
export default class GameWorld {
    constructor(canvas, width, height, player, currentScene) {
        this.canvas = canvas
        this.canvas.width = width
        this.canvas.height = height
        this.context = canvas.getContext("2d")

        // this.lastTime2 = 1
        this.deltaTime = 1
        this.comboCounter = 0


        this.isPaused = false

        this.init()

    }

    init() {
        this.context.imageSmoothingEnabled = false
    }

    gameLoop(scene, timeStamp) {
        console.log(timeStamp)
        // this.deltaTime = (timeStamp - this.lastTime2) / 1000
        // this.lastTime2 = timeStamp
        console.log(scene)
        // scene.update(this.deltaTime)
        scene.draw(this.context)
        requestAnimationFrame(this.gameLoop(scene, timeStamp))

    }
}