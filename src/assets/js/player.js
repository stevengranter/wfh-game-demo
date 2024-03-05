import { StandingLeft, StandingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight } from "./state.js"
import { Sprite } from "./sprite.js"
import { SpriteAnimation } from "./sprite.js"

export default class Player extends Sprite {
    constructor(spriteSheetObj, dWidth, dHeight, canvasWidth, canvasHeight) {



        super(spriteSheetObj, Math.floor((canvasWidth - dWidth) / 2), Math.floor(canvasHeight - dHeight), 48, 48)



        this.states = [new StandingLeft(this), new StandingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this)]
        this.stateHistory = []

        // currentState is at index 0 of states array
        this.currentState = this.states[0]

        this.image = spriteSheetObj.spriteImageObj.image

        this.fps = 16,
            this.frameTimer = 0,
            this.frameInterval = 1000 / this.fps,

            this.gameWidth = canvasWidth
        this.gameHeight = canvasHeight

        this.velocityX = 0
        this.velocityY = 0
        this.weight = 0.8

        this.speedX = 0
        this.speedY = 0

        this.maxSpeedX = 1
        this.speedBonus = 0



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
        if (this.dy > this.gameHeight - this.dHeight) this.dy = this.gameHeight = this.dHeight
    }

    // Utility classes

    onGround() {
        return this.dy >= this.gameHeight - this.dHeight
    }
}



