export class Sprite {


    constructor(
        // spriteImageObj,
        spriteSheetObj,
        // destination (canvas) x,y, width and height
        dx = 0,
        dy = 0,
        dWidth = 16,
        dHeight = 16,
        velocityX = 0,
        velocityY = 0,
        fps = 15,
        pointValue = 0
    ) {
        this.spriteSheetObj = spriteSheetObj,

            this.spriteImageObj = spriteSheetObj.spriteImageObj,


            this.dx = dx,
            this.dy = dy,
            this.dWidth = dWidth,
            this.dHeight = dHeight,

            this.velocityX = velocityX,
            this.velocityY = velocityY,

            this.fps = fps,
            this.frameTimer = 0,
            this.frameInterval = 1000 / this.fps,

            this.pointValue = pointValue,

            this.isVisible = true,

            this.isScored = false

        // console.log(this)

    }



    draw(context, deltaTime) {

        // console.log(spriteSheet)
        // draw sprite to canvas
        if (this.isVisible) {
            context.drawImage(

                this.spriteImageObj.image,
                this.spriteImageObj.sWidth * this.spriteSheetObj.frameX,
                this.spriteImageObj.sHeight * this.spriteSheetObj.frameY, //this.spriteImageObj.sHeight, // * 0,
                this.spriteImageObj.sWidth,
                this.spriteImageObj.sHeight,
                this.dx,
                this.dy,
                this.dWidth,
                this.dHeight
            )
        }
        // console.log('sprite drawn')
    }

    update() {
        // animate cels in spritesheet
        if (this.frameTimer > this.frameInterval) {
            if (this.spriteSheetObj.frameX < this.spriteSheetObj.endFrame) {

                this.spriteSheetObj.frameX += 1
                this.frameTimer = 0
            } else {
                this.spriteSheetObj.frameX = 0
                this.frameTimer = 0
            }
        } else {
            this.frameTimer += 16

        }

        this.dx += this.velocityX
        this.dy += this.velocityY
    }

}

export class SpriteImage {
    constructor(image, sx, sy, sWidth, sHeight) {
        this.image = image,
            this.sx = sx,
            this.sy = sy,
            this.sWidth = sWidth,
            this.sHeight = sHeight

    }
}

export class SpriteSheet {
    constructor(spriteImageObj = SpriteImage, frameX, frameY, endFrame) {
        this.spriteImageObj = spriteImageObj,
            this.frameX = frameX,
            this.frameY = frameY,
            this.endFrame = endFrame
    }
    animate() {
        let frameTimer = 0
        const frameInterval = 62.5
        const fps = 15
        if (frameTimer > frameInterval) {
            if (this.spriteSheetObj.frameX < this.spriteSheetObj.endFrame) {
                this.spriteSheetObj.frameX += 1
                frameTimer = 0
            } else {
                this.spriteSheetObj.frameX = 0
                frameTimer = 0
            }
        } else {
            frameTimer += 16
        }
    }
}



