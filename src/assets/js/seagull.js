import { Sprite } from "./sprite.js"
import { SpriteAnimation, SpriteFrame } from "./sprite.js"
import Projectile from "./projectile.js"

export default class Seagull extends Sprite {
    constructor(context,
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
        collidesWith) {

        super(context, dx, dy, dWidth, dHeight, spriteSheetObj, velocityX, velocityY, fps, pointValue, healthValue, spriteType, spriteTag, collidesWith)

        this.projectile = this.createProjectile()

    }

    shoot() {
        x = this.dx / 2
        y = this.dy / 2
    }

    createProjectile() {
        const gullPooImageFile = new Image()
        gullPooImageFile.src = "./assets/images/seagull-poo-sprite-01.png"
        const gullPooSpriteFrame = new SpriteFrame(
            gullPooImageFile,
            0,
            0,
            16,
            16
        )
        const gullPooSprite = new Projectile(
            this.context,
            8,
            8,
            16,
            16,
            new SpriteAnimation(gullPooSpriteFrame, 0, 0, 0),
            0,
            1,
            15,
            0,
            -10,
            this
        )
        return gullPooSprite
    }

    readyProjectile() {
        this.projectile.dx = this.dx + (this.dWidth / 2)
        this.projectile.dy = this.dy + (this.dHeight / 2)
        this.projectile.velocityX = 0
        this.projectile.velocityY = 4
    }

}