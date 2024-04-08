export default class Layer {
    constructor(
        player,
        playerScrollFactor = false,
        backgroundImageObject,
        velocityX = 0,
        velocityY = 0,
        sx = 0,
        sy = 0,
        sWidth = 0,
        sHeight = 0,
        dx = 0,
        dy = 0,
        dWidth = 0,
        dHeight = 0,
        filter = "none"

    ) {

        this.player = player
        this.playerScrollFactor = playerScrollFactor
        this.backgroundImageObject = backgroundImageObject
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.sx = sx
        this.sy = sy
        this.sWidth = sWidth
        this.sHeight = sHeight
        this.dx = dx
        this.dy = dy
        this.dHeight = dHeight
        this.dWidth = dWidth

        this.filter = filter

        // console.log(this)



    }

    draw(context) {

        if ((this.filter !== "none") || (this.filter !== undefined)) {
            // console.log(this.filter)
            context.filter = this.filter
        }
        context.drawImage(
            this.backgroundImageObject,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            Math.floor(this.dx),
            Math.floor(this.dy),
            this.dWidth,
            this.dHeight,)
        context.filter = "none"
    }

    update(deltaTime) {

        if (!this.playerScrollFactor) {
            this.dx += this.velocityX * deltaTime
            this.dy += this.velocityY * deltaTime
        } else {
            // console.log(this.player.speedX)
            this.dx += ((-(this.player.velocityX * this.player.speedX * this.playerScrollFactor / 100) + this.velocityX) * deltaTime)
            // this.dy += ((( /*this.player.velocityY */ -2 * deltaTime) * this.playerScrollFactor + this.velocityY) * deltaTime)
            this.dy += ((-(this.player.velocityY * this.player.speedY * this.playerScrollFactor / 100) + this.velocityY) * deltaTime)

        }
    }
}

