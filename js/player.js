"use strict"

import Sprite from "./sprite.js"
import Stats from "./stats.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"
import {
    Dead,
    StandingLeft,
    StandingRight,
    WalkingLeft,
    WalkingRight,
    JumpingLeft,
    JumpingRight,
    playerStates
} from "./player-state.js"

import { GameWorld } from "./game-world.js"


export default class Player extends Sprite {
    #isAlive
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

        // this.floorHeight = 60 // TODO: This should not be here 🤮

        this.velocityX = 0
        this.velocityY = 0
        this.weight = 20

        this.speedX = 0
        this.speedY = 0
        this.dx = (CANVAS_WIDTH - this.dWidth) / 2
        // this.dy = (CANVAS_HEIGHT / 2) - this.dHeight
        this.dy = 0 - this.dHeight

        const initialmaxSpeedX = 0
        this.maxSpeedX = initialmaxSpeedX
        this.speedMultiplier = 1

        this.stats = new Stats()
        // console.log(this.stats)

        // this.scoreManager = new ScoreManager()





        this.#isAlive = false


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



    get position() {
        return { x: this.dx, y: this.dy }
    }


    setBounds(boundingObject) {
        this.bounds = boundingObject
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

    startNewLevel() {
        this.isAlive = true

    }

    receiveUpdate(data) {
        console.log("player received:", data)

        // if (typeof data === 'object' && data.hasOwnProperty("gameState")) {
        //     // console.log("data has gamestate:", data.gameState)
        // }
    }

    // callSaintPeter() {
    //     console.log("You is dead 💀")

    //     this.setState(playerStates.DEAD)

    // }



    update(input, deltaTime) {
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

            if (this.stats.isAlive) {
                // console.log("listening for input")
                this.currentState.handleInput(input)
            }

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
            // console.log(this.bounds)

            // Set player boundaries
            if (this.dx <= this.bounds.topLeft.x) {
                this.dx = this.bounds.topLeft.x
            }
            if (this.dx >= this.bounds.topRight.x - this.dWidth) {
                this.dx = this.bounds.topRight.x - this.dWidth
            }
            if (this.dy >= this.bounds.bottomRight.y - this.dHeight) this.dy = Math.floor(this.bounds.bottomRight.y - this.dHeight)


        }

    }



    onGround() {
        // console.log(this.dy + this.dHeight)
        // console.log(this.bounds.bottomLeft.y)
        // console.log(this.dy >= this.bounds.bottomLeft.y)
        return (this.dy + this.dHeight >= this.bounds.bottomLeft.y)

    }


}













