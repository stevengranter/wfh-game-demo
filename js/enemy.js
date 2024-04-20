import Sprite from "./sprite.js"

export class Enemy extends Sprite {
    constructor(spriteConfigObject, projectileConfigObject = null) {
        super(spriteConfigObject)
        this.projectile = new Sprite(projectileConfigObject)
        this.projectile.isVisible = false
        this.resetProjectile()
        // this.createProjectile(projectileConfigObject)

    }

    // createProjectile(projectileConfigObject) {
    //     this.projectile = new Sprite(projectileConfigObject)
    //     this.projectile.isVisible = true
    // }

    launchProjectile({ velocityX, velocityY }) {
        if (!this.projectile) {
            console.error("No projectile property for enemy")
            return
        }
        if (this.projectile.isVisible) return
        this.resetProjectile()
        this.projectile.velocityX = velocityX
        this.projectile.velocityY = velocityY
        this.projectile.isVisible = true

    }

    resetProjectile() {
        this.projectile.dx = this.dx + this.projectile.offset.x
        this.projectile.dy = this.dy + this.projectile.offset.y
    }



    draw(context) {
        super.draw(context)
        if (this.projectile && this.projectile.isVisible) {
            this.projectile.draw(context)
            // console.log(`Drawing projectile at x: ${this.projectile.dx}, y:${this.projectile.dy}`)
        }
    }

    update(deltaTime) {
        super.update(deltaTime)
        // this.dx += this.velocityX
        // this.dy += this.velocityY
        if (this.projectile && this.projectile.isVisible) {
            // Update the projectile's position based on its velocity
            this.projectile.update(deltaTime)
            // this.projectile.dx += this.projectile.velocityX * deltaTime
            // this.projectile.dy += this.projectile.velocityY * deltaTime
            // console.log(this.projectile.dx, this.projectile.dy)

            // Add any necessary boundary checks or collision detection for the projectile
        }
        // ... other update logic for the enemy ...
    }




}