
import Sprite from "./sprite.js"
import Stats from "./stats.js"
import {
    Dead,
    StandingLeft,
    StandingRight,
    WalkingLeft,
    WalkingRight,
    JumpingLeft,
    JumpingRight,
    playerStates
} from "./player-states.js"


export default class Player extends Sprite {

    constructor(spriteConfigObject) {
        super(spriteConfigObject)


        // this.playerSprite = playerSprite
        // this.animations = playerAnimations
        // // console.log(this.playerAnimations)
        // this.playerStats = playerStats

        this.states = [new Dead(this), new StandingLeft(this), new StandingRight(this), new WalkingLeft(this), new WalkingRight(this), new JumpingLeft(this), new JumpingRight(this)]
        this.stateHistory = []

        // currentState is at index 1 of states array
        // this.setState(this.states[0])
        this.currentState = this.states[1]

        this.floorHeight = 60 // TODO: This should not be here 🤮

        this.velocityX = 1
        this.velocityY = 100
        this.weight = 20

        this.speedX = 0
        this.speedY = 0
        this.dx = 200
        this.dy = 100

        const initialmaxSpeedX = 25
        this.maxSpeedX = initialmaxSpeedX
        this.speedMultiplier = 1

        this.stats = new Stats()
        console.log(this.stats)

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
        document.addEventListener('playerDeath', () => {
            console.log(`Player is dead!`) // ealth!"
            this.isAlive = false
            this.callSaintPeter()
            // Handle the zero health situation (e.g., end game, respawn player)
        })


    }



    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
        // this.notify("player.currentState = " + this.currentState)
    }



    startNewLife() {
        this.isAlive = true
        console.log(this)
        // console.log(this.stats.healthMax)
        // this.stats.health = this.stats.healthMax
        // this.setState(playerStates.STANDING_LEFT)
    }

    message(data) {
        console.log(this.constructor.name + " received ", data)
        console.log("timestamp:", Date.now())

        // Check if data exists and has the health property before accessing it
        // if (data && data.health && data.health <= 0) {
        //     this.isAlive = false
        //     // Uncomment the following line if callSaintPeter function is defined and needs to be called
        //     // this.callSaintPeter();
        // }
    }

    // callSaintPeter() {
    //     console.log("You is dead 💀")

    //     this.setState(playerStates.DEAD)

    // }



    update(input, deltaTime, gameWidth, gameHeight) {
        // if (this.isOutOfBounds()) {
        //     console.log("Player out of bounds")
        //     this.startNewLife()
        // }
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
            // if (this.dx <= 0) {
            //     this.dx = 0
            // } else if (this.dx >= gameWidth - this.dWidth) {
            //     this.dx = gameWidth - this.dWidth
            // }

            // Create a buffer of 50px on each side
            if (this.dx <= 75) {
                this.dx = 75
            } else if (this.dx >= 350) {
                this.dx = 350
            }

            this.currentState.handleInput(input)

            // horizontal Movement
            // this.dx += this.velocityX * deltaTime
            // this.prevX = this.dx
            // console.log(deltaTime)
            this.dx += this.velocityX * this.speedMultiplier * deltaTime
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













