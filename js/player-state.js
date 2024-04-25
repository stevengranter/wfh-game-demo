"use strict"

import { wait } from "./utils.js"
import { GameWorld } from "./game-world.old"

export const playerStates = {
    DEAD: 0,
    STANDING_LEFT: 1,
    STANDING_RIGHT: 2,
    WALKING_LEFT: 3,
    WALKING_RIGHT: 4,
    JUMPING_LEFT: 5,
    JUMPING_RIGHT: 6,

}

class PlayerState {
    constructor(state) {
        this.state = state
    }
}


export class StandingLeft extends PlayerState {
    constructor(player) {
        super("STANDING_LEFT")
        this.player = player
        this.animation = this.player.animations.StandingLeft
    }
    enter() {
        // console.log("StandingLeft")
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = 0
        this.player.velocityX = 0


    }

    handleInput(input) {
        if (input.right) this.player.setState(playerStates.WALKING_RIGHT)
        else if (input.left) this.player.setState(playerStates.WALKING_LEFT)
        else if (input.up) this.player.setState(playerStates.JUMPING_LEFT)

    }
}

export class StandingRight extends PlayerState {
    constructor(player) {
        super("STANDING_RIGHT")
        this.player = player
        this.animation = this.player.animations.StandingRight
    }
    enter() {
        // console.log("StandingRight")
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = 0
        this.player.velocityX = 0

    }

    handleInput(input) {
        if (input.left) this.player.setState(playerStates.WALKING_LEFT)
        else if (input.right) this.player.setState(playerStates.WALKING_RIGHT)
        else if (input.up) this.player.setState(playerStates.JUMPING_RIGHT)
    }
}

export class WalkingLeft extends PlayerState {
    constructor(player) {
        super("WALKING_LEFT")
        this.player = player
        this.animation = this.player.animations.WalkingLeft


    }
    enter() {
        // console.log("WalkingLeft")
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = this.player.maxSpeedX + this.player.speedBonus
        // console.log("🚀 ~ WalkingLeft ~ enter ~ this.player.speedX:", this.player.speedX)
        this.player.velocityX = -100
        // console.log("🚀 ~ WalkingLeft ~ enter ~ this.player.velocityX:", this.player.velocityX)

    }

    handleInput(input) {
        // if (input.right) this.player.setState(playerStates.WALKING_RIGHT)
        if (!input.left) this.player.setState(playerStates.STANDING_LEFT)
        else if (input.up) this.player.setState(playerStates.JUMPING_LEFT)
        // if (input === "PRESS Escape") this.player.setState(playerStates.PAUSE)

    }
}

export class WalkingRight extends PlayerState {
    constructor(player) {
        super("WALKING_RIGHT")
        this.player = player
        this.animation = this.player.animations.WalkingRight


    }
    enter() {
        // console.log("WalkingRight")
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = this.player.maxSpeedX + this.player.speedBonus
        this.player.velocityX = 100
    }

    handleInput(input) {
        if (!input.right) this.player.setState(playerStates.STANDING_RIGHT)
        else if (input.up) this.player.setState(playerStates.JUMPING_RIGHT)
        // if (input === "PRESS Escape") this.player.setState(playerStates.PAUSE)
    }
}

export class JumpingLeft extends PlayerState {
    constructor(player) {
        super("JUMPING_LEFT")
        this.player = player
    }
    enter() {
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }
        if (this.player.onGround()) this.player.velocityY -= 300
        // this.player.speedX = this.player.maxSpeedX * -2
    }

    handleInput(input) {
        if (input.right) {
            this.player.setState(playerStates.JUMPING_RIGHT)
        }
        else if (this.player.onGround()) this.player.setState(playerStates.STANDING_LEFT)
    }
}

export class JumpingRight extends PlayerState {
    constructor(player) {
        super("JUMPING_RIGHT")
        this.player = player
    }
    enter() {
        if (this.player.isAlive === false) {
            this.player.setState(playerStates.DEAD)
            return
        }

        if (this.player.onGround()) this.player.velocityY -= 300
        // this.player.speedX = this.player.maxSpeedX * 2
    }

    handleInput(input) {
        if (input.left) {
            this.player.setState(playerStates.JUMPING_LEFT)
        } else if (this.player.onGround()) {
            this.player.setState(playerStates.STANDING_RIGHT)
        }
    }
}

export class Dead extends PlayerState {
    constructor(player) {
        super("DEAD")
        this.player = player
        this.animation = this.player.animations.StandingRight

    }
    enter() {

        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.weight = 0
        this.player.velocityX = 0
        this.player.velocityY = -150
    }

    exit() {
        this.player.startNewLife()
    }
    handleInput() {
        // if (this.player.isOutOfBounds() === true) {
        //     console.log("player is out of bounds")
        // }
        // 
        // console.log('handleInput')
        // if (this.player.isAlive) {
        //     this.player.setState(playerStates.STANDING_LEFT)
        // }
    }
}