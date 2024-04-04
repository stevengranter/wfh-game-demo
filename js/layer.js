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
        dHeight = 0

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

        // console.log(this)



    }
    // init(backgroundImageFile) {
    //     let sWidth
    //     let sHeight
    //     const bgImage = new Image()
    //     bgImage.src = backgroundImageFile.toString()
    //     console.dir(bgImage)
    //     // console.log(bgImage.src)
    //     bgImage.onload = (bgImage) => {
    //         console.log('background loaded')
    //         console.log(bgImage.naturalHeight)
    //         sWidth = this.naturalWidth
    //         sHeight = this.naturalHeight
    //     }
    //     this.sWidth = bgImage.naturalWidth
    //     this.sHeight = sHeight
    //     if (!this.dWidth) this.dWidth = this.sWidth
    //     if (!this.dHeight) this.dHeight = this.sHeight
    //     console.log(this)
    //     return bgImage


    //     // if (this.playerScrollFactor) this.playerScrollFactor = 1 / this.playerScrollFactor
    // }

    draw(context) {
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
    }

    update(deltaTime) {
        // console.log(this.playerScrollFactor)
        if (!this.playerScrollFactor) {
            this.dx += this.velocityX * deltaTime
            this.dy += this.velocityY * deltaTime
        } else {
            this.dx += ((-this.player.speedX * this.playerScrollFactor + this.velocityX) * deltaTime)
            this.dy += ((-this.player.speedY * this.playerScrollFactor + this.velocityY) * deltaTime)
        }
    }
}

