
import Sprite from "./sprite.js"
import Stats from "./stats.js"
import {
    StandingLeft,
    StandingRight,
    WalkingLeft,
    WalkingRight,
    JumpingLeft,
    JumpingRight,
    Dead
} from "./player-states.js"


export default class Player extends Sprite {

    constructor(spriteConfigObject) {
        super(spriteConfigObject)


        // this.playerSprite = playerSprite
        // this.animations = playerAnimations
        // // console.log(this.playerAnimations)
        // this.playerStats = playerStats

        this.states = [new StandingLeft(this), new StandingRight(this), new WalkingLeft(this), new WalkingRight(this), new JumpingLeft(this), new JumpingRight(this), new Dead(this)]
        this.stateHistory = []

        // currentState is at index 0 of states array
        // this.setState(this.states[0])
        this.currentState = this.states[0]

        this.floorHeight = 8 // TODO: This should not be here 🤮

        this.velocityX = 1
        this.velocityY = 100
        this.weight = 20

        this.speedX = 0
        this.speedY = 0
        this.dx = 200
        this.dy = 100

        const initialmaxSpeedX = 25
        this.maxSpeedX = initialmaxSpeedX
        this.speedBonus = 0

        this.stats = new Stats()


        // this.scoreManager = new ScoreManager()





        this.isAlive = true


        this.sWidth = 48
        this.sHeight = 48
        this.dWidth = 48
        this.dHeight = 48
        this.frameX = 0
        this.frameY = 0

        this.fps = 15
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps
        document.addEventListener('playerZeroHealth', function (e) {
            console.log(e.detail.message) // "Player has reached zero health!"
            this.isAlive = false
            // Handle the zero health situation (e.g., end game, respawn player)
        })


    }



    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
        // this.notify("player.currentState = " + this.currentState)
    }

    update(input, deltaTime, gameWidth, gameHeight) {
        if (!this.isPaused) {

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.endFrame) {
                    // console.log(this.frameX)
                    this.frameX += 1
                    this.frameTimer = 0
                } else {
                    this.frameX = 0
                    this.frameTimer = 0
                }
            } else {
                // console.log(deltaTime)
                this.frameTimer += deltaTime * 1000


            }

            // Prevent player from moving off-screen
            if (this.dx <= 0) {
                this.dx = 0
            } else if (this.dx >= gameWidth - this.dWidth) {
                this.dx = gameWidth - this.dWidth
            }

            this.currentState.handleInput(input)

            // horizontal Movement
            // this.dx += this.velocityX * deltaTime
            // this.prevX = this.dx
            this.dx += this.velocityX * deltaTime
            // console.log(this.velocityX * deltaTime)
            this.dy += this.velocityY * deltaTime
            // console.log(this.velocityX)



            if (!this.onGround()) {
                this.velocityY += this.weight
            } else {
                this.velocityY = 0
            }
            // Prevent player from falling through floor
            if (this.dy > gameHeight - this.dHeight) this.dy = Math.floor(gameHeight - this.dHeight - this.floorHeight)
        } else {
            // this.dy -= 2

        }
    }



    onGround() {
        return this.dy >= 270 - this.sHeight - this.floorHeight
    }


}













