import GameObject from "./gameobject.js"


export const spriteTypes = Object.freeze({
    PLAYER: 'player',
    ENEMY: 'enemy',
    PROP: 'prop',
    ENVIRONMENT: 'environment'
})

export const spriteTags = Object.freeze({
    WIENER: 'wiener',
    GULL: 'gull',
    POO: 'poo',
})

export class Sprite extends GameObject {


    constructor(
        context,
        dx = 0,
        dy = 0,
        dWidth = 16,
        dHeight = 16,
        spriteSheetObj,
        velocityX = 0,
        velocityY = 0,
        fps = 15,
        pointValue = 0,
        healthValue = 0,
        spriteType,
        spriteTag,
        collidesWith = []
    ) {
        super(context, dx, dy, dWidth, dHeight)

        this.spriteSheetObj = spriteSheetObj

        this.spriteImageObj = this.spriteSheetObj.spriteImageObj

        this.velocityX = velocityX
        this.velocityY = velocityY

        this.fps = fps
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

        this.pointValue = pointValue

        this.healthValue = healthValue



        this.isVisible = true

        this.isScored = false

        this.spriteType = spriteType
        this.spriteTag = spriteTag
        this.collidesWith = collidesWith

        // console.log(this)

    }



    draw(context) {

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

    }

    update(deltaTime, playerSpeedX = 0, playerSpeedY = 0) {
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
            this.frameTimer += deltaTime * 1000

        }
        this.dx += (this.velocityX + playerSpeedX * 1000) * deltaTime
        this.dy += (this.velocityY + playerSpeedY * 1000) * deltaTime
    }

}

export class SpriteFrame {
    constructor(image, sx, sy, sWidth, sHeight) {
        this.image = image
        this.sx = sx
        this.sy = sy
        this.sWidth = sWidth
        this.sHeight = sHeight

    }
}

export class SpriteAnimation {
    constructor(spriteImageObj = SpriteFrame, frameX, frameY, endFrame) {
        this.spriteImageObj = spriteImageObj,
            this.frameX = frameX,
            this.frameY = frameY,
            this.endFrame = endFrame
    }
    animate() {
        let frameTimer = 0
        const frameInterval = this.frameInterval
        const fps = this.fps
        if (frameTimer > frameInterval) {
            if (this.spriteSheetObj.frameX < this.spriteSheetObj.endFrame) {
                this.spriteSheetObj.frameX += 1
                frameTimer = 0
            } else {
                this.spriteSheetObj.frameX = 0
                frameTimer = 0
            }
        } else {
            frameTimer += deltaTime
        }
    }
}



