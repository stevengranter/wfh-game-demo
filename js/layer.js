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
        if ((this.filter !== "none") && (this.filter !== undefined)) {
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
            this.dHeight
        )


        // context.filter = "none"
    }


    update(deltaTime, playerVelocityX = 0, playerVelocityY = 0) {
        // console.log(playerVelocityX)

        if (!this.playerScrollFactor) {

            this.dx += playerVelocityX * deltaTime
            this.dy += playerVelocityY * deltaTime
        } else {
            // negative so the background scrolls in the opposite direction of player
            this.dx += -(this.velocityX + (this.playerScrollFactor * this.player.velocityX)) * deltaTime

        }
    }
}

