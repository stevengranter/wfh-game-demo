
import { snakeToPascal } from "./utils.js"
// Keys for the different game states
// The string values correspond to game states listed in the "data-gamestate" data
// attribute on HTML elements in the main HTML file
export const gameStateIDs = {
    TITLE: "title",
    START: "start",
    INTRO: "intro",
    POPUP: "popup",
    PLAY: "play",
    PAUSED_BY_PLAYER: "paused",
    END_SCENE: "endscene",
    START_SCENE: "startscene",
    GAMEOVER: "gameover",
    END: "endgame",
    CREDITS: "credits",
}

// GameState class
// Handles state changes in the game (pause, menu, play, etc)
export default class GameState {
    constructor(key) {
        this.key = key
    }
}

export class Title extends GameState {
    constructor() {
        super("Title")
    }

    enter() {
        console.log(`in enter() in ${this.constructor.name}`)
    }

    handleInput() { }

    exit() { }

}

export class Start extends GameState {
    constructor() {
        super(gameStateIDs.START)
        console.log(gameStateIDs.START)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class Intro extends GameState {
    constructor() {
        super(gameStateIDs.INTRO)
        console.log(gameStateIDs.INTRO)
    }
    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class Popup extends GameState {
    constructor() {
        super(gameStateIDs.POPUP)
        console.log(gameStateIDs.POPUP)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class Play extends GameState {
    constructor() {
        super(gameStateIDs.PLAY)
        console.log(gameStateIDs.PLAY)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class Paused extends GameState {
    constructor() {
        super(gameStateIDs.PAUSED_BY_PLAYER)
        console.log(gameStateIDs.PAUSED_BY_PLAYER)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class EndScene extends GameState {
    constructor() {
        super(gameStateIDs.END_SCENE)
        console.log(gameStateIDs.END_SCENE)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class StartScene extends GameState {
    constructor() {
        super(gameStateIDs.START_SCENE)
        console.log(gameStateIDs.START_SCENE)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class GameOver extends GameState {
    constructor() {
        super(gameStateIDs.GAMEOVER)
        console.log(gameStateIDs.GAMEOVER)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class End extends GameState {
    constructor() {
        super(gameStateIDs.END)
        console.log(gameStateIDs.END)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class Credits extends GameState {
    constructor() {
        super(gameStateIDs.CREDITS)
        console.log(gameStateIDs.CREDITS)
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}