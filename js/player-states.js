export const playerStates = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    WALKING_LEFT: 2,
    WALKING_RIGHT: 3,
    JUMPING_LEFT: 4,
    JUMPING_RIGHT: 5,
    DEAD: 6
}

class PlayerState {
    constructor(state) {
        this.state = state
    }
}


export class StandingLeft extends PlayerState {
    constructor(player) {
        super("STANDING LEFT")
        this.player = player
        this.animation = this.player.animations.StandingLeft
    }
    enter() {
        // console.log("StandingLeft")
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
        super("STANDING RIGHT")
        this.player = player
        this.animation = this.player.animations.StandingRight
    }
    enter() {
        // console.log("StandingRight")
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
        super("WALKING LEFT")
        this.player = player
        this.animation = this.player.animations.WalkingLeft


    }
    enter() {
        // console.log("WalkingLeft")
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = this.player.maxSpeedX + this.player.speedBonus
        this.player.velocityX = -100
    }

    handleInput(input) {
        if (input.right) this.player.setState(playerStates.WALKING_RIGHT)
        else if (!input.left) this.player.setState(playerStates.STANDING_LEFT)
        else if (input.up) this.player.setState(playerStates.JUMPING_LEFT)
        // if (input === "PRESS Escape") this.player.setState(playerStates.PAUSE)

    }
}

export class WalkingRight extends PlayerState {
    constructor(player) {
        super("WALKING RIGHT")
        this.player = player
        this.animation = this.player.animations.WalkingRight


    }
    enter() {
        // console.log("WalkingRight")
        this.player.endFrame = this.animation.endFrame
        this.player.sWidth = this.player.animationFrame.width
        this.player.sHeight = this.player.animationFrame.height
        this.player.frameY = this.animation.frameY
        this.player.speedX = this.player.maxSpeedX + this.player.speedBonus
        this.player.velocityX = 100
    }

    handleInput(input) {
        if (input.left) this.player.setState(playerStates.WALKING_LEFT)
        else if (!input.right) this.player.setState(playerStates.STANDING_RIGHT)
        else if (input.up) this.player.setState(playerStates.JUMPING_RIGHT)
        // if (input === "PRESS Escape") this.player.setState(playerStates.PAUSE)
    }
}

export class JumpingLeft extends PlayerState {
    constructor(player) {
        super("JUMPING LEFT")
        this.player = player
    }
    enter() {
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
        super("JUMPING RIGHT")
        this.player = player
    }
    enter() {
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
    }
    enter() {
        this.player.isAlive = false
        this.player.spriteSheetObj.endFrame = 0
        this.player.spriteSheetObj.frameY = 0
        this.player.velocityY = 500
        this.player.speedX = 0

    }

    handleInput(input) {
        // console.log(input)
    }
}