import { StandingLeft, StandingRight, WalkingLeft, WalkingRight, JumpingLeft, JumpingRight } from "./state.js"
import { Sprite } from "./sprite.js"
import { SpriteAnimation } from "./sprite.js"

export default class Player extends Sprite {
    constructor(context, dx, dy, dWidth, dHeight, spriteSheetObj, canvasWidth, canvasHeight) {



        super(context, dx, dy, dWidth, dHeight, spriteSheetObj)



        this.states = [new StandingLeft(this), new StandingRight(this), new WalkingLeft(this), new WalkingRight(this), new JumpingLeft(this), new JumpingRight(this)]
        this.stateHistory = []

        // currentState is at index 0 of states array
        this.currentState = this.states[0]

        this.image = spriteSheetObj.spriteImageObj.image

        this.fps = 16
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

        this.gameWidth = canvasWidth
        this.gameHeight = canvasHeight
        this.floorHeight = 15

        this.velocityX = 0
        this.velocityY = 0
        this.weight = 1

        this.speedX = 0
        this.speedY = 0

        this.maxSpeedX = 1
        this.speedBonus = 0

        this.currentHealth = 100
        this.currentScore = 0
        this.currentLives = 3

        this.isAlive = true


    }

    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
    }



    update(input) {

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

        this.currentState.handleInput(input)

        //horizontal movement
        this.dx += this.speedX

        //
        if (this.dx <= 0) this.dx = 0
        else if (this.dx >= this.gameWidth - this.dWidth) this.dx = this.gameWidth - this.dWidth

        // vertical movement
        this.dy += this.velocityY
        if (!this.onGround()) {
            this.velocityY += this.weight
        } else {
            this.velocityY = 0
        }
        // Prevent player from falling through floor
        if (this.dy > this.gameHeight - this.dHeight) this.dy = this.gameHeight - this.dHeight - this.floorHeight
    }

    // Utility classes

    onGround() {
        return this.dy >= this.gameHeight - this.dHeight - this.floorHeight
    }

    // Score-keeping
    initScore(score) {
        scoreDisplay.innerHTML = String(currentScore).padStart(4, "0")
    }

    updateScore(object) {
        if (object) {
            if (!object.isScored) {
                // console.log("SCORE")
                this.currentScore += object.pointValue
                this.currentHealth += object.healthValue
                let currentStats = {
                    currentScore: this.currentScore,
                    currentHealth: this.currentHealth + "%"
                }
                object.isScored = true
                return currentStats


            }
        }
    }

}



