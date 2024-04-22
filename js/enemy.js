"use strict"

// import Sprite as Enemy class extends Sprite class
import Sprite from "./sprite.js"

// Class declaration for Enemy 👾
// This class extends the Sprite class, by containing methods 
// and logic for managing projectiles

export class Enemy extends Sprite {
    constructor(spriteConfigObject, projectileConfigObject = null) {

        // Call the Sprite parent class constructor method to set up the sprite
        super(spriteConfigObject)

        // If projectileConfigObject is passed as argument, 
        // 1. Set up new Sprite under projectile property,
        // 2. Set projectile to invisible, 
        // 3. Reset position to main sprite position
        this.projectile = new Sprite(projectileConfigObject)
        this.projectile.isVisible = false
        this.resetProjectilePosition()

    }

    // Method to launch projectile
    launchProjectile({ velocityX, velocityY }) {
        // 👎 If there is no projectile, log an error message
        if (!this.projectile) {
            console.error("No projectile property for enemy")
            return
        }

        // ⛔️ Guard clause: 
        // if the projectile is visible, then the projectile has already been
        // launched
        if (this.projectile.isVisible) return

        // Reset the projectile position, make it visible and 
        // set velocity to the values passed as arguments to the method 
        this.resetProjectilePosition()
        this.projectile.isVisible = true
        this.projectile.velocityX = velocityX
        this.projectile.velocityY = velocityY
    }


    // Method to reset the projectile position to the position of the parent sprite
    resetProjectilePosition() {
        this.projectile.dx = this.dx + this.projectile.offset.x
        this.projectile.dy = this.dy + this.projectile.offset.y
        // console.log("projectile position reset")
    }

    // Method to reset the projectile velocity to 0
    resetProjectileVelocity() {
        this.projectile.velocityX = 0
        this.projectile.velocityY = 0
        console.log("projectile velocity reset")
    }

    // Method to draw the enemy sprite (by calling super(context)) and then drawing the projectile
    draw(context) {
        super.draw(context)
        if (this.projectile && this.projectile.isVisible) {
            this.projectile.draw(context)
            // console.log(`Drawing projectile at x: ${this.projectile.dx}, y:${this.projectile.dy}`)
        }
    }

    // Method to update the enemy sprite (by calling super(deltaTime)) and then
    // updating the projectile
    update(deltaTime) {
        super.update(deltaTime)
        // this.dx += this.velocityX
        // this.dy += this.velocityY
        if (this.projectile && this.projectile.isVisible) {

            // Update the projectile's position based on its velocity
            this.projectile.update(deltaTime)

            // If the projectile is out of bounds, we flag isVisibe to false 
            // (which allows it to be launched again), and reset the 
            // projectile's position and velocity
            if (this.projectile.isOutOfBounds()) {
                this.resetProjectile()
            }
        }

    }


    resetProjectile() {
        this.projectile.isVisible = false
        this.projectile.isScored = false
        this.resetProjectilePosition()
        this.resetProjectileVelocity()
    }
} // end of Enemy class