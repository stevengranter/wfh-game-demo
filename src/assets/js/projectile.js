
import { Sprite, SpriteFrame, SpriteAnimation } from "./sprite.js"


export default class Projectile extends Sprite {
    constructor( // 
        spriteSheetObj,
        dx = 0,
        dy = 0,
        dWidth = 16,
        dHeight = 16,
        velocityX = 0,
        velocityY = 0,
        fps = 15,
        pointValue = 0,
        healthValue = 0,
        parentSprite,
        interval) {
        super(
            spriteSheetObj,
            dx,
            dy,
            dWidth,
            dHeight,
            velocityX,
            velocityY,
            fps,
            pointValue,
            healthValue,
        )

        this.parentSprite = parentSprite
        this.interval = interval
        this.projectileTimer = 0
        this.dx = this.parentSprite.dx
        this.dy = this.parentSprite.dy




    }

    setParent(parentSprite) {

    }
    draw(context, deltaTime) {

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



        this.dx = this.parentSprite.dx
        this.dy += this.velocityY

    }



    shoot(context, deltaTime) {

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