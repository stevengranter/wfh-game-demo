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
            this.configObject = spriteConfigObject
            this.setProperties(this.configObject)
        } else {
            console.error("spriteConfigObject is not in the correct format or missing 'spriteSrc'")
        }

        // Create a new Image object and set its source to spriteSrc
        const imageObject = new Image()
        imageObject.src = this.spriteSrc
        this.imageObject = imageObject

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

    // storeConfigObject(configObject) {
    //     this.configObject = spriteConfigObject // Store the sprite configuration object
    // }

    resetSprite() {
        if (this.configObject) {
            // console.log("has configObject")
            this.setProperties(this.configObject)
        }
    }


    // Function to create a sprite from the given configuration object
    setProperties(spriteConfigObject) {
        // Iterate over each key-value pair in the spriteConfigObject
        for (const [key, value] of Object.entries(spriteConfigObject)) {
            switch (key) {
                case "location":
                    // Set random dx and dy values if specified in the configuration
                    this.setRandomLocation(value)
                    break
                case "direction":
                    // Set random velocityX and velocityY values if specified in the configuration
                    this.setRandomDirection(value)
                    break
                default:
                    // Assign any other key-value pairs directly to the sprite object
                    this[key] = value
            }
        }
    }



    setRandomDirection(value) {
        if (value.velocityX && value.velocityX.random) {
            this.velocityX = getRandomInt(value.velocityX.random.lowerBound, value.velocityX.random.upperBound)
        }
        if (value.velocityY && value.velocityY.random) {
            this.velocityY = getRandomInt(value.velocityY.random.lowerBound, value.velocityY.random.upperBound)
        }
    }

    setRandomLocation(value) {
        if (value.dx && value.dx.random) {
            this.dx = getRandomInt(value.dx.random.lowerBound, value.dx.random.upperBound)
        }
        if (value.dy && value.dy.random) {
            this.dy = getRandomInt(value.dy.random.lowerBound, value.dy.random.upperBound)
        }
    }

    // TODO: create method
    // makeSpriteFromNothing() {}

    fetchSpriteJSON(filePath) {
        fetchJsonFile(filePath)
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Fetching JSON failed:', error)
            })
    }

    // Function to check if the sprite is out of bounds based on its current position and dimensions
    isOutOfBounds() {
        // Check if the sprite's position is outside the canvas boundaries
        if (this.dx < (0 - this.dWidth) || this.dx > (CANVAS_WIDTH + this.dWidth) || this.dy < (0 - this.dHeight) || this.dy > (CANVAS_HEIGHT + this.dHeight)) {
            return true // Return true if the sprite is out of bounds
        } else {
            return false // Return false if the sprite is within the bounds
        }
    }


    // Function to draw the sprite on the canvas context
    draw(context) {
        // Check if the sprite is not visible or out of bounds, then return without drawing
        if ((!this.isVisible) || (this.isOutOfBounds())) return

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
    }




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

    getParentPosition(parentSprite) {
        // Set parentSprite to current object's parentSprite if not provided
        if (!parentSprite) parentSprite = this.parentSprite

        // If parentSprite exists, calculate the position based on parentSprite's data
        if (this.parentSprite) {
            // Calculate the x position relative to the parentSprite
            this.dx = this.parentSprite.data.dx + this.parentSprite.data.dWidth / 2// + this.velocityX
            // Calculate the y position relative to the parentSprite
            this.dy = this.parentSprite.data.dy + this.parentSprite.data.dHeight / 2// + this.velocityY
        }
    }


    getParentVelocity() {
        // Check if the current object has a parentSprite
        if (this.parentSprite) {
            // Set the current object's velocityX to its parentSprite's velocityX
            this.velocityX = this.parentSprite.velocityX
            // Set the current object's velocityY to its parentSprite's velocityY
            this.velocityY = this.parentSprite.velocityY
        }
    }


}


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
