export default class Sprite {
    constructor(image,

        sx = 0,
        sy = 0,

        sWidth = 32,
        sHeight = 32,

        dx = getRandomInt(0, 450),    // TODO: calculate using canvas.width
        dy = getRandomInt(0, 275),  // TODO: calculate using canvas.height

        dWidth = width,
        dHeight = height,) {
        this.image = image

        this.sx = sx
        this.sy = sy

        this.sWidth = sWidth
        this.sHeight = sHeight

        this.dx = dx
        this.dy = dy

        this.dWidth = dWidth
        this.dHeight = dHeight

        this.frameX = 0
        this.frameY = 0

        this.maxFrame = 28
        this.maxSpeedX = 1
        this.maxSpeedY = 1


        this.fps = 60
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps
    }
}