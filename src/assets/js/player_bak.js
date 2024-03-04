import { StandingLeft, StandingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight } from "./state.js"


export default class Player {

    // pass width and height of canvas area
    constructor(gameWidth, gameHeight) {

        // store width and height as class properties
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight


        this.states = [new StandingLeft(this), new StandingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this)]
        this.stateHistory = []
        // currentState is at index 0 of states array
        this.currentState = this.states[0]


        this.image = document.getElementById("player-sprite")

        this.dWidth = 48
        this.dHeight = 48

        this.dx = Math.floor((this.gameWidth - this.dWidth) / 2)
        this.dy = Math.floor(this.gameHeight - this.height)

        this.vy = 0 /* velocityY */
        this.weight = 0.8

        this.frameX = 0
        this.frameY = 0

        this.maxFrame = 0

        this.speedX = 0
        this.maxSpeedX = 1

        this.speedY = 0
        this.maxSpeedY = 1

        this.hasSpeedBonus = true
        this.speedBonus = 0

        this.fps = 16
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps


    }

    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++
            } else {
                this.frameX = 0
            }
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }

        context.drawImage(this.image,
            this.dWidth * this.frameX, this.dHeight * this.frameY, this.dWidth, this.dHeight,
            this.dx,
            this.dy + 1, // add 1 pixel (due to sprite sheet offset) *YUCK*
            this.dWidth,
            this.dHeight)
    }

    update(input) {

        this.currentState.handleInput(input)

        //horizontal movement
        this.dx += this.speedX

        //
        if (this.dx <= 0) this.dx = 0
        else if (this.dx >= this.gameWidth - this.dWidth) this.dx = this.gameWidth - this.dWidth

        // vertical movement
        this.dy += this.vy
        if (!this.onGround()) {
            this.vy += this.weight
        } else {
            this.vy = 0
        }
        // Prevent player from falling through floor
        if (this.dy > this.gameHeight - this.dHeight) this.dy = this.gameHeight = this.dHeight
    }

    setState(state) {
        this.currentState = this.states[state]
        // // Add currentState to stateHistory array
        // this.stateHistory.unshift(this.currentState)
        // console.log(this.stateHistory)
        this.currentState.enter()
    }

    // Utility classes

    onGround() {
        return this.dy >= this.gameHeight - this.dHeight
    }

}