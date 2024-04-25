
import { snakeToPascal } from "./utils.js"
import { scene00Config } from "./cfg/scene00.cfg.js"
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
    constructor(elementID) {
        this.elementID = elementID
    }
}

export class Title extends GameState {
    constructor(game) {
        super(gameStateIDs.TITLE)
        this.game = game
    }

    enter() {
        console.log(`entered ${this.constructor.name} state`)
        // While on title screen, we'll preload the first scene
        this.game.loadScene(scene00Config)
        this.handleInput()

    }

    handleInput(input) {
        const startButton = document.getElementById("start-button")
        if (startButton) {
            this.exitHandler = this.exit.bind(this)
            startButton.addEventListener("pointerdown", this.exitHandler)
        }
    }

    exit() {
        console.log(`exiting ${this.constructor.name} state`)
        const startButton = document.getElementById("start-button")
        if (startButton) {
            try {
                startButton.removeEventListener("pointerdown", this.exitHandler)
                console.log("eventhandler removed")
            } catch {
                console.warn("Could not remove event handler")
            }
        }
        this.game.currentState = this.game.gameStateKeys["Start"]
    }

}

export class Start extends GameState {
    constructor(game) {
        super(gameStateIDs.START)
        this.game = game
    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)

    }

    handleInput() { }

    exit() { }
}

export class Intro extends GameState {
    constructor(game) {
        super(gameStateIDs.INTRO)
        this.game = game

    }
    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class Popup extends GameState {
    constructor(game) {
        super(gameStateIDs.POPUP)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class Play extends GameState {
    constructor(game) {
        super(gameStateIDs.PLAY)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class Paused extends GameState {
    constructor(game) {
        super(gameStateIDs.PAUSED_BY_PLAYER)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class EndScene extends GameState {
    constructor(game) {
        super(gameStateIDs.END_SCENE)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class StartScene extends GameState {
    constructor(game) {
        super(gameStateIDs.START_SCENE)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}


export class GameOver extends GameState {
    constructor(game) {
        super(gameStateIDs.GAMEOVER)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class End extends GameState {
    constructor(game) {
        super(gameStateIDs.END)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}

export class Credits extends GameState {
    constructor(game) {
        super(gameStateIDs.CREDITS)
        this.game = game

    }

    enter() {
        console.log(`in enter() in ${constructor.name}`)
    }

    handleInput() { }

    exit() { }
}