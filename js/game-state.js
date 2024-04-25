
import { snakeToPascal, typeWriter, animateBlur } from "./utils.js"
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

    enter() {
        console.log(`entered ${this.constructor.name} state`)
    }


    run() {

    }


}

export class Title extends GameState {
    constructor(game) {
        super(gameStateIDs.TITLE)
        this.game = game
    }

    enter() {
        super.enter()
        // While on title screen, we'll preload the first scene
        this.game.loadScene(scene00Config)
        this.run()

    }

    run() {
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
        this.game.currentState = this.game.gameStateKeys["Intro"]
    }

}

export class Start extends GameState {
    constructor(game) {
        super(gameStateIDs.START)
        this.game = game
    }

    enter() {
        super.enter()

    }

    run() {
        super.run()


    }

    exit() {
        super.enter()
    }
}

export class Intro extends GameState {
    constructor(game) {
        super(gameStateIDs.INTRO)
        this.game = game

    }
    enter() {
        super.enter()
        setTimeout(() => { this.game.ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { this.game.ui.elements.popupNan.style.transform = "translateY(0)" }, 700)
        const currentSceneIndex = this.game.player.stats.progress
        this.game.currentScene = this.game.scenes[currentSceneIndex]
        this.game.currentScene = this.game.scenes[0]

        const animateBlurEntry = animateBlur(this.game.currentScene, this.game.ctx, 0.5, 2, 0.2)

        this.game.currentScene.draw(this.ctx, false, true, true)
        setTimeout(animateBlurEntry, 1000)


        const dialogText = document.querySelector('#intro-dialog div').textContent
        typeWriter('intro-dialog', dialogText, 25)

        this.game.currentScene.draw(this.game.ctx, false, true, true)


        this.run()
    }

    run() {
        // Retrieve the element only once to avoid multiple DOM queries.
        const element = document.getElementById(this.elementID)
        if (!element) {
            console.error(`Element with ID '${this.elementID}' not found.`)
            return
        }

        console.log(this.elementID)

        // Define keydownHandler as a method to avoid creating it every time run is called.
        const keydownHandler = () => {
            console.log("in keyDownHandler")

            // Use a single setTimeout to manage the sequence of animations.
            setTimeout(() => {
                this.game.ui.elements.introDialog.style.transform = "translateY(400px)"
                setTimeout(() => {
                    this.game.ui.elements.popupNan.style.transform = "translateY(475px)"
                    setTimeout(() => {
                        const animateBlurExit = animateBlur(this.game.currentScene, this.game.ctx, 0.5, 2, 0.2)
                        animateBlurExit()
                    }, 300) // Delay by additional 300ms (total of 1000ms after first timeout).
                }, 200) // Delay by additional 200ms (total of 700ms after first timeout).
            }, 500)

            // Remove the event listener to prevent the callback from executing multiple times
            document.removeEventListener("keydown", keydownHandler)
        }

        // Add the event listener directly with the handler reference.
        document.addEventListener("keydown", keydownHandler)
    }

    exit() {
        super.enter()
    }
}

export class Popup extends GameState {
    constructor(game) {
        super(gameStateIDs.POPUP)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}


export class Play extends GameState {
    constructor(game) {
        super(gameStateIDs.PLAY)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}


export class Paused extends GameState {
    constructor(game) {
        super(gameStateIDs.PAUSED_BY_PLAYER)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}


export class EndScene extends GameState {
    constructor(game) {
        super(gameStateIDs.END_SCENE)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}


export class StartScene extends GameState {
    constructor(game) {
        super(gameStateIDs.START_SCENE)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}


export class GameOver extends GameState {
    constructor(game) {
        super(gameStateIDs.GAMEOVER)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}

export class End extends GameState {
    constructor(game) {
        super(gameStateIDs.END)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}

export class Credits extends GameState {
    constructor(game) {
        super(gameStateIDs.CREDITS)
        this.game = game

    }

    enter() {
        super.enter()
    }

    run() {
        super.run()
    }

    exit() {
        super.enter()
    }
}