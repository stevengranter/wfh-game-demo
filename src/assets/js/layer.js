export default class Layer {
    constructor(
        player,
        playerScrollFactor = false,
        backgroundImageFile,
        velocityX = 0,
        velocityY = 0,
        sx = 0,
        sy = 0,
        sWidth = 0,
        sHeight = 0,
        dx = sx,
        dy = sy,
        dWidth = sWidth,
        dHeight = sHeight,


    ) {
        this.player = player
        this.playerScrollFactor = playerScrollFactor
        this.backgroundImageFile = backgroundImageFile
        this.sx = sx
        this.sy = sy
        this.sWidth = sWidth
        this.sHeight = sHeight
        this.dx = dx
        this.dy = dy
        this.dWidth = dWidth
        this.dHeight = dHeight
        this.velocityX = velocityX
        this.velocityY = velocityY


        this.init()

    }
    init() {
        const bgImage = new Image()
        bgImage.src = `${this.backgroundImageFile}`
        bgImage.onload = function () {
            console.log('background loaded')
        }
        this.sWidth = bgImage.naturalWidth
        this.sHeight = bgImage.naturalHeight
        if (this.dWidth == false) this.dWidth = this.sWidth
        if (this.dHeight == false) this.dHeight = this.sHeight
        this.backgroundImageObject = bgImage
        // if (this.playerScrollFactor) this.playerScrollFactor = 1 / this.playerScrollFactor
    }

    draw(context) {
        context.drawImage(
            this.backgroundImageObject,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.dx,
            this.dy,
            this.dWidth,
            this.dHeight,)
    }

    update(deltaTime) {
        console.log(this.playerScrollFactor)
        if (!this.playerScrollFactor) {
            this.dx += this.velocityX * deltaTime
            this.dy += this.velocityY * deltaTime
        } else {
            this.dx += ((-this.player.speedX * this.playerScrollFactor + this.velocityX) * deltaTime)
            this.dy += ((-this.player.speedY * this.playerScrollFactor + this.velocityY) * deltaTime)
        }
    }
}

