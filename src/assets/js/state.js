export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    RUNNING_LEFT: 2,
    RUNNING_RIGHT: 3,
    JUMP: 4,
    PAUSE: 5
}

class State {
    constructor(state) {
        this.state = state
    }
}


export class StandingLeft extends State {
    constructor(player) {
        super('STANDING LEFT')
        this.player = player
    }
    enter() {
        this.player.maxFrame = 0
        this.player.frameY = 1
        this.player.speedX = 0

    }

    handleInput(input) {
        if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT)
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT)
        if (input === 'PRESS up') this.player.setState(states.JUMP)
        if (input === 'PRESS Escape') this.player.setState(states.PAUSE)

    }
}

export class StandingRight extends State {
    constructor(player) {
        super('STANDING RIGHT')
        this.player = player
    }
    enter() {
        this.player.maxFrame = 0
        this.player.frameY = 0
        this.player.speedX = 0
    }

    handleInput(input) {
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT)
        if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT)
        if (input === 'PRESS up') this.player.setState(states.JUMP)
        if (input === 'PRESS Escape') this.player.setState(states.PAUSE)

    }
}

export class RunningLeft extends State {
    constructor(player) {
        super('RUNNING LEFT')
        this.player = player


    }
    enter() {
        this.player.maxFrame = 4
        this.player.frameY = 1
        this.player.speedX = -(this.player.maxSpeedX + this.player.speedBonus)
    }

    handleInput(input) {
        if (input === 'PRESS right') this.player.setState(states.RUNNING_RIGHT)
        if (input === 'RELEASE left') this.player.setState(states.STANDING_LEFT)
        if (input === 'PRESS up') this.player.setState(states.JUMP)
        if (input === 'PRESS Escape') this.player.setState(states.PAUSE)

    }
}

export class RunningRight extends State {
    constructor(player) {
        super('RUNNING RIGHT')
        this.player = player


    }
    enter() {
        this.player.maxFrame = 4
        this.player.frameY = 0
        this.player.speedX = this.player.maxSpeedX + this.player.speedBonus
    }

    handleInput(input) {
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT)
        if (input === 'RELEASE right') this.player.setState(states.STANDING_RIGHT)
        if (input === 'PRESS up') this.player.setState(states.JUMP)
        if (input === 'PRESS Escape') this.player.setState(states.PAUSE)
    }
}

export class Jump extends State {
    constructor(player) {
        super('JUMP')
        this.player = player
    }
    enter() {
        this.player.maxFrame = 4
        this.player.frameY = 0
        this.player.speedY = -this.player.maxSpeedY
    }

    handleInput(input) {
        if (input === 'PRESS left') this.player.setState(states.RUNNING_LEFT)
        if (input === 'RELEASE right') this.player.setState(states.STANDING_RIGHT)
        if (input === 'PRESS Escape') this.player.setState(states.PAUSE)
    }
}

export class Pause extends State {
    constructor(player) {
        super('PAUSE')
        this.player = player
    }
    enter() {
        this.player.maxFrame = 0
        this.player.frameY = 0
        this.player.speedX = 0
        this.player.speedY = 0
        console.log('game is paused')

    }

    handleInput(input) {
        // TODO: if player presses Pause, we restore last state
        if (input === 'Press Escape') this.player.setState(this.player.stateHistory[1])
        console.log('game resumes')

    }
}
