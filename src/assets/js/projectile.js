
import { Sprite, SpriteFrame, SpriteAnimation } from "./sprite.js"


export default class Projectile extends Sprite {
    constructor( // 
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
        parentSprite,
        interval
    ) {

        super(context, dx, dy, dWidth, dHeight, spriteSheetObj, velocityX, velocityY, fps, pointValue, healthValue, parentSprite)

        this.spriteSheetObj = spriteSheetObj

        this.spriteImageObj = this.spriteSheetObj.spriteImageObj
        this.parentSprite = parentSprite
        this.interval = interval

        this.velocityX = velocityX
        this.velocityY = velocityY
        this.projectileTimer = 0
        this.dx = dx
        this.dy = dy




    }

    setParent(parentSprite) {

    }

    draw(context) {
        // console.log("draw projectile")
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

    setInitialPosition() {
        this.dx = this.parentSprite.dx + this.parentSprite.dWidth / 2// + this.velocityX
        this.dy = this.parentSprite.dy + this.parentSprite.dHeight / 2// + this.velocityY
    }

    setInitialVelocity() {

    }

    update(deltaTime) {
        this.dx += this.velocityX * deltaTime
        this.dy += this.velocityY * deltaTime
    }




}