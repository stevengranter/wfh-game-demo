
export default class Pickup {

    constructor(
        image,

        sx = 0,
        sy = 0,

        sWidth = 32,
        sHeight = 32,

        dx = getRandomInt(0, 450),    // TODO: calculate using canvas.width
        dy = getRandomInt(0, 275),  // TODO: calculate using canvas.height

        dWidth = sWidth,
        dHeight = sHeight,
        velocityX = 0,
        velocityY = 0
    ) {

        this.image = image

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

        // console.log((Math.random() * 476))
        // console.log(y)

    }

    draw(context, deltaTime) {
        context.drawImage(
            this.image,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.dx,
            this.dy,
            this.dWidth,
            this.dHeight,
        )
        // context.drawImage(
        //     this.image,
        //     this.sx,
        //     this.sy,
        //     this.sWidth,
        //     this.sHeight,
        //     this.dx,
        //     this.dy,
        //     this.dWidth,
        //     this.dHeight,
        // )
    }

    update() {
        this.dx += this.velocityX
        this.dy += this.velocityY
    }


}