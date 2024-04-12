
import { fetchJsonFile } from "./utils.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"

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

export default class Sprite {


    constructor(spriteConfigObject) {


        if (typeof spriteConfigObject === "object" && ("spriteSrc" in spriteConfigObject)) {
            // console.log("all good")
            this.makeSpriteFromConfigObj(spriteConfigObject)
        } else {
            // TODO: create makeSpriteFromNothing when argument is not a spriteConfigObject
            console.error("spriteConfigObject is not an object or in the wrong format")
        }



        const imageObject = new Image()
        imageObject.src = this.spriteSrc
        this.imageObject = imageObject

        // this.spriteJSON = this.fetchSpriteJSON("./sprites/nan-02.json")
        // console.log("🚀 ~ Sprite ~ constructor ~ this.spriteJSON:", this.spriteJSON)



        if (this.dWidth === undefined) {
            this.dWidth = this.animationFrame.width
        }

        if (this.dHeight === undefined) {
            this.dHeight = this.animationFrame.height
        }




        if (!this.dx) { this.dx = (CANVAS_WIDTH / 2) - this.animationFrame.width }
        if (!this.dy) { this.dy = (CANVAS_HEIGHT / 2) - this.animationFrame.height }

        if (!this.velocityY) this.velocityY = 0
        if (!this.velocityX) this.velocityX = 0

        this.frameX = 0
        this.frameY = 0

        this.fps = 16
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

        // this.pointValue = 0
        // this.healthValue = 0


        this.states = []
        Object.entries(this.animations).forEach(([value]) => {
            this.states.push(value)
        })

        this.currentState = this.states[0]







        this.isVisible = true
        this.isAnimating = true

        this.isScored = false

        // console.dir(this)


    }

    makeSpriteFromConfigObj(spriteConfigObject) {
        Object.entries(spriteConfigObject).forEach(([key, value]) => {
            // console.log(key + ":" + value)
            this[key] = value

        })
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

    isOutOfBounds() {
        // console.log(this.dx)
        if (this.dx < (0 - this.dWidth) || this.dx > (475 + this.dWidth) || this.dy < (0 - this.dHeight) || this.dy > (270 + this.dHeight)) {
            return true
        } else {
            return false
        }
    }

    draw(context) {
        if ((!this.isVisible) || (this.isOutOfBounds())) return
        context.drawImage(

            this.imageObject,
            this.dWidth * this.frameX,
            this.dHeight * this.frameY,
            this.dWidth,
            this.dHeight,
            Math.floor(this.dx),
            Math.floor(this.dy),
            this.dWidth,
            this.dHeight,
        )
    }



    update(deltaTime, playerSpeedX = 0, playerSpeedY = 0) {
        // animate cels in spritesheet
        // console.log("update:" + this.spriteAnimations)
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
            // console.log("frameX is" + this.frameX)


            let endFrame = this.animations[this.currentState].endFrame
            const persistFrame = this.animations[this.currentState].persistFrame

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
            this.velocityY = 0 // Stop the vertical motion
            this.velocityX = playerSpeedX // stop horizontal motion
            this.isAnimating = false
        }
        this.dx += (this.velocityX) * deltaTime
        this.dy += (this.velocityY) * deltaTime


    }

    getParentPosition(parentSprite) {
        // console.log(this.parentSprite.data.dx)
        if (!parentSprite) parentSprite = this.parentSprite
        if (this.parentSprite) {
            this.dx = this.parentSprite.data.dx + this.parentSprite.data.dWidth / 2// + this.velocityX
            this.dy = this.parentSprite.data.dy + this.parentSprite.data.dHeight / 2// + this.velocityY
        }
        // console.log(this.dx)
    }

    getParentVelocity() {
        if (this.parentSprite) {
            this.velocityX = this.parentSprite.velocityX
            this.velocityY = this.parentSprite.velocityY
        }
    }

}

export class AnimationFrame {
    constructor(sx, sy, sWidth, sHeight) {
        this.sx = sx
        this.sy = sy
        this.sWidth = sWidth
        this.sHeight = sHeight
    }
}

export class SpriteAnimation {
    constructor(animationFrame, frameX, frameY, endFrame) {
        this.animationFrame = animationFrame,
            this.frameX = frameX,
            this.frameY = frameY,
            this.endFrame = endFrame
    }
}