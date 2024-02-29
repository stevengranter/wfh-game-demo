export default class Collectible {

    constructor(
        image = document.getElementById("broken-sprite"), /* REQUIRED */
        sx = 0,
        sy = 0,
        sWidth,
        sHeight,
        pointValue = 0,
        isScored = false,
        speedX = 1,
        speedY = 1
    ) {


        this.image = image
        this.x = sx
        this.y = sy
        this.speedX = speedX
        this.speedY = speedY

        this.pointValue = pointValue
        this.isScored = isScored

        this.width = sWidth
        this.height = sHeight

        this.frameX = 0
        this.frameY = 0

        this.maxFrame = 28

        this.speedX = 0
        this.maxSpeedX = 1

        this.speedY = 1
        this.maxSpeedY = 1


        this.fps = 60
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

    }

    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++
            } else {
                this.frameX = 0
            }
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }

        context.drawImage(this.image,
            this.width * this.frameX, this.height * this.frameY, this.width, this.height,
            this.x,
            this.y + 1, // add 1 pixel (due to sprite sheet offset) *YUCK*
            this.width,
            this.height)
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY
    }

}
