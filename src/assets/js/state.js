export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    WALKING_LEFT: 2,
    WALKING_RIGHT: 3,
    JUMPING_LEFT: 4,
    JUMPING_RIGHT: 5,
    DEAD: 6
}

class State {
    constructor(state) {
        this.state = state
    }
}


export class StandingLeft extends State {
    constructor(player) {
        super("STANDING LEFT")
        this.player = player
    }
    enter() {
        this.player.spriteSheetObj.endFrame = 0
        this.player.spriteSheetObj.frameY = 1
        this.player.speedX = 0

    }

    handleInput(input) {
        if (input === "PRESS right") this.player.setState(states.WALKING_RIGHT)
        else if (input === "PRESS left") this.player.setState(states.WALKING_LEFT)
        else if (input === "PRESS up") this.player.setState(states.JUMPING_LEFT)

    }
}

export class StandingRight extends State {
    constructor(player) {
        super("STANDING RIGHT")
        this.player = player
    }
    enter() {
        this.player.spriteSheetObj.endFrame = 0
        this.player.spriteSheetObj.frameY = 0
        this.player.speedX = 0
    }

    handleInput(input) {
        if (input === "PRESS left") this.player.setState(states.WALKING_LEFT)
        else if (input === "PRESS right") this.player.setState(states.WALKING_RIGHT)
        else if (input === "PRESS up") this.player.setState(states.JUMPING_RIGHT)
    }
}

export class WalkingLeft extends State {
    constructor(player) {
        super("WALKING LEFT")
        this.player = player


    }
    enter() {
        this.player.spriteSheetObj.endFrame = 4
        this.player.spriteSheetObj.frameY = 1
        this.player.speedX += Math.floor(-(this.player.maxSpeedX + this.player.speedBonus))
    }

    handleInput(input) {
        if (input === "PRESS right") this.player.setState(states.WALKING_RIGHT)
        else if (input === "RELEASE left") this.player.setState(states.STANDING_LEFT)
        else if (input === "PRESS up") this.player.setState(states.JUMPING_LEFT)
        // if (input === "PRESS Escape") this.player.setState(states.PAUSE)

    }
}

export class WalkingRight extends State {
    constructor(player) {
        super("WALKING RIGHT")
        this.player = player


    }
    enter() {
        this.player.spriteSheetObj.endFrame = 4
        this.player.spriteSheetObj.frameY = 0
        this.player.speedX = Math.floor(this.player.maxSpeedX + this.player.speedBonus)
    }

    handleInput(input) {
        if (input === "PRESS left") this.player.setState(states.WALKING_LEFT)
        else if (input === "RELEASE right") this.player.setState(states.STANDING_RIGHT)
        else if (input === "PRESS up") this.player.setState(states.JUMPING_RIGHT)
        // if (input === "PRESS Escape") this.player.setState(states.PAUSE)
    }
}

export class JumpingLeft extends State {
    constructor(player) {
        super("JUMPING LEFT")
        this.player = player
    }
    enter() {
        if (this.player.onGround()) this.player.velocityY -= 5
        this.player.speedX = this.player.maxSpeedX * -2
    }

    handleInput(input) {
        if (input === "PRESS right") this.player.setState(states.JUMPING_RIGHT)
        else if (this.player.onGround()) this.player.setState(states.STANDING_LEFT)
    }
}

export class JumpingRight extends State {
    constructor(player) {
        super("JUMPING RIGHT")
        this.player = player
    }
    enter() {
        if (this.player.onGround()) this.player.velocityY -= 5
        this.player.speedX = this.player.maxSpeedX * 2
    }

    handleInput(input) {
        if (input === "PRESS left") {
            this.player.setState(states.JUMPING_LEFT)
        } else if (this.player.onGround()) {
            this.player.setState(states.STANDING_RIGHT)
        }
    }
}

export class Dead extends State {
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





