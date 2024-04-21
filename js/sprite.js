"use strict"

import { fetchJsonFile, getRandomInt } from "./utils.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS, CTX } from "./constants.js"

// Define a constant named spriteTypes and freeze the object to make it immutable
export const spriteTypes = Object.freeze({
    // Define different types of sprites with corresponding string values
    PLAYER: 'player', // 👵🏼
    ENEMY: 'enemy', // 🐦
    PROP: 'prop', // 🌭
    ENVIRONMENT: 'environment' // 🪨
})

// Define a constant named spriteTags and freeze the object to make it immutable
export const spriteTags = Object.freeze({
    // Define different tags for sprites with corresponding string values
    WIENER: 'wiener', // 🌭
    GULL: 'gull',// 🐦
    POO: 'poo', // 💩
})


export default class Sprite {

    constructor(spriteConfigObject) {

        // Check if spriteConfigObject is an object and has 'spriteSrc' property 
        if (typeof spriteConfigObject === "object" && "spriteSrc" in spriteConfigObject) {
            // store the config properties in case sprite reset required
            this.configObject = spriteConfigObject

            // call setProperties() method to set up sprite properties
            this.setProperties(this.configObject)

            // call loadSprite() method to create new Image object and set its source to spriteSrc
            this.loadSprite()

        } else {
            console.error("spriteConfigObject is not in the correct format or missing 'spriteSrc'")
        }



        // Set default width and height values if not provided
        this.dWidth = this.dWidth || this.animationFrame.width
        this.dHeight = this.dHeight || this.animationFrame.height

        // Initialize frame X and Y positions
        this.frameX = 0
        this.frameY = 0

        // Set frames per second and calculate frame interval
        this.fps = 16
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

        // Initialize states, current state, visibility, animation status, and scoring status
        this.states = Object.keys(this.animations)
        this.currentState = this.states[0]
        this.isVisible = true
        this.isAnimating = true
        this.isScored = false

    }

    // Method to create a sprite from the given configuration object
    setProperties(spriteConfigObject) {

        // method to assign random or fixed value depending on config values,
        // using arrow function to keep 'this' scoped to Sprite instance
        const assignRandomOrFixed = (config, propName, defaultValue) => {
            if (config && config.random) {
                this[propName] = getRandomInt(
                    config.random.lowerBound,
                    config.random.upperBound
                )
            } else {
                // if no default value provided, set value to 0
                this[propName] = defaultValue !== undefined ? defaultValue : 0
            }
        }

        for (const [key, value] of Object.entries(spriteConfigObject)) {
            switch (key) {
                case "location":
                    assignRandomOrFixed(value.dx, 'dx', value.dx)
                    assignRandomOrFixed(value.dy, 'dy', value.dy)
                    break
                case "direction":
                    assignRandomOrFixed(value.velocityX, 'velocityX', value.velocityX)
                    assignRandomOrFixed(value.velocityY, 'velocityY', value.velocityY)
                    break
                default:
                    this[key] = value
            }
        }
    }

    // Method to reset sprite from the config stores in configObject property
    resetSprite(configObject = this.configObject) {
        if (configObject) {
            this.setProperties(configObject)
        }
    }

    // Method to load sprite image data from file (will use altAppearance if flag is set)
    loadSprite() {
        const imageObject = new Image()
        if (!this.altAppearance) {
            imageObject.src = this.spriteSrc
        } else {
            imageObject.src = this.altSprite.spriteSrc
        }
        this.imageObject = imageObject
    }


    // Method to detect player within a certain distance
    detectPlayer({ dx, dy }, detectionDistance = 100) {
        // 📐 Calculate the distance between the enemy and the player using the Pythagorean theorem 
        const distance = Math.sqrt(Math.pow(this.dx - dx, 2) + Math.pow(this.dy - dy, 2))

        // Check if the distance is less than the detectionDistance provided as argument (defaults to 100px)
        if (distance < detectionDistance) {
            // console.log(distance) // Log the distance
            // console.log("Enemy detected player")
            return true
        }
    }

    fetchSpriteJSON(filePath) {
        fetchJsonFile(filePath)
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Fetching JSON failed:', error)
            })
    }

    // Method to check if the sprite is out of bounds based on its current position and dimensions
    isOutOfBounds() {
        // Check if the sprite's position is outside the canvas boundaries
        if ((this.dx < 0 - CANVAS_WIDTH || this.dx > 2 * CANVAS_WIDTH) || (this.dy < 0 - CANVAS_HEIGHT || this.dy > 2 * CANVAS_HEIGHT)) {
            return true // Return true if the sprite is out of bounds
        } else {
            return false // Return false if the sprite is within the bounds
        }
    }


    // Method to draw the sprite on the canvas context
    draw(context) {
        // Check if the sprite is not visible or out of bounds, then return without drawing
        if ((!this.isVisible) || (this.isOutOfBounds())) return
        // console.log("drawing: dx", this.dx, "dy", this.dy)
        // if (this.projectile && this.projectile.isVisible) this.projectile.draw(context)
        if (this.canvasFilter) {
            context.filter = this.canvasFilter
        }
        // Draw the sprite on the canvas context
        context.drawImage(
            this.imageObject,       // Image to draw
            this.dWidth * this.frameX,  // X coordinate within the image to start clipping from
            this.dHeight * this.frameY, // Y coordinate within the image to start clipping from
            this.dWidth,             // Width of the clipped image
            this.dHeight,            // Height of the clipped image
            Math.floor(this.dx),     // X coordinate on the canvas where to place the image
            Math.floor(this.dy),     // Y coordinate on the canvas where to place the image
            this.dWidth,             // Width of the image to draw
            this.dHeight             // Height of the image to draw
        )

        if ((this.childSprite)) {
            // console.log(this.childSprite)
            this.childSprite.draw(context)
        }
    }

    // Method to update Sprite position on canvas
    update(deltaTime, playerSpeedX = 0, playerSpeedY = 0) {
        // animate cels in spritesheet
        if (this.isAnimating) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.animations[this.currentState].endFrame) {
                    this.frameX += 1
                    this.frameTimer = 0
                } else {
                    this.frameX = 0
                    this.frameTimer = 0
                }
            } else {
                this.frameTimer += deltaTime * 1000
            }
        } else if (this.frameX > 0 && this.frameX < this.animations[this.currentState].endFrame) {


            let endFrame = this.animations[this.currentState].endFrame
            const persistFrame = this.animations[this.currentState].persistFrame

            // Decrease frameX until it reaches 0
            if (this.frameX < (persistFrame / 2)) {
                endFrame = 0
                if (this.frameX > endFrame) {
                    this.frameX -= 1
                    this.frameTimer = 0
                } else {
                    this.frameX = endFrame
                    this.frameTimer = 0
                }
            }

            // Increase frameX until it reaches persistFrame
            if (this.frameX < endFrame - persistFrame / 2) {
                endFrame = persistFrame
                if (this.frameX > endFrame) {
                    this.frameX -= 1
                    this.frameTimer = 0
                } else {
                    this.frameX = endFrame
                    this.frameTimer = 0
                }
            }
        }


        if (this.persist == "bottom" && this.dy + this.dHeight + 20 > 270) {
            this.dy = 270 - this.dHeight - 20 // Adjust position to canvas bottom
            this.velocityY = 0 // Stop vertical motion
            this.velocityX = 0 // Stop horizontal motion
            this.isAnimating = false
        }

        this.dx += (this.velocityX) * deltaTime
        this.dy += (this.velocityY) * deltaTime

    }

    // Method to set child sprite location based on this sprite's location
    setChildSpriteLocation() {
        this.childSprite.dx = this.dx
        this.childSprite.dy = this.dy

    }


}

// Class to store animation frame properties
export class AnimationFrame {

    constructor(sx, sy, sWidth, sHeight) {
        // Initialize the upper-left x-coordinate of the frame
        this.sx = sx
        // Initialize the upper-left y-coordinate of the frame
        this.sy = sy
        // Initialize the width of the frame
        this.sWidth = sWidth
        // Initialize the height of the frame
        this.sHeight = sHeight
    }
}


// Class to store animations for the sprite
export class SpriteAnimation {

    constructor(animationFrame, frameX, frameY, endFrame) {
        // Initialize the animation frame object for the sprite animation
        this.animationFrame = animationFrame
        // Initialize the frame row of the current frame
        this.frameX = frameX
        // Initialize the frame column of the current frame
        this.frameY = frameY
        // Initialize the ending frame number for the animation
        this.endFrame = endFrame
    }
}
