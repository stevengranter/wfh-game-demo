export default class Layer {
    constructor(
        backgroundImageSource,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight,
        velocityX,
        velocityY,
    ) {
        this.backgroundImageSource = backgroundImageSource
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

    }

    draw(context) {
        context.drawImage(
            this.backgroundImageSource,
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
        this.dx += this.velocityX * deltaTime
        this.dy += this.velocityY * deltaTime
    }
}