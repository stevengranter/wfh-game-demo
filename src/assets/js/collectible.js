export default class Collectible {

    constructor(
        image = document.getElementById("broken-sprite"), /* REQUIRED */
        sx = 0,
        sy = 0,
        sWidth,
        sHeight,
        pointValue = 0,
        speedX = 1,
        speedY = 1
    ) {


        this.image = image
        this.x = sx
        this.y = sy
        this.speedX = speedX
        this.speedY = speedY

        this.width = sWidth,
            this.height = sHeight

    }

    draw(context,
        deltaTime,
        x,
        y,
        width = this.width,
        height = this.height
    ) {

        context.drawImage(
            document.getElementById("wiener-sprite-01"),
            x + this.x,
            y + this.y,
            width,
            height,

        )

    }

    update() {
        this.x = this.speedX
        this.y += this.speedY
    }

}
