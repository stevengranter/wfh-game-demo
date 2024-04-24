
import { snakeToPascal } from "./utils.js"
// Keys for the different game states
// The string values correspond to game states listed in the "data-gamestate" data
// attribute on HTML elements in the main HTML file
export const gameStateKeys = {
    TITLE: "title",
    START: "start",
    INTRO: "intro",
    POPUP: "popup",
    PLAY: "play",
    PAUSED_BY_PLAYER: "paused",
    SCENE_END: "endscene",
    SCENE_START: "startscene",
    GAMEOVER: "gameover",
    END: "endgame",
    CREDITS: "credits",
}

// GameState class
// Handles state changes in the game (pause, menu, play, etc)
export default class GameState {
    constructor() {


        // Object.entries(gameStateKeys).forEach(([key, value]) => {
        //     // Convert the value to PascalCase for the class name
        //     const className = snakeToPascal(value)
        //     // Dynamically import the class using the transformed name
        //     const StateClass = window[className]
        //     if (!StateClass) {
        //         throw new Error(`No class found for state: ${value} as ${className}`)
        //     }
        //     // Instantiate the class and store it with the key name
        //     this.states[key] = new StateClass(this)
        // });

    }
}

export class Title extends GameState {

}

export class Start extends GameState {

}
export class Intro extends GameState {

}
export class Popup extends GameState {

}

export class Play extends GameState {

}

export class Paused extends GameState {

}

export class EndScene extends GameState {

}

export class StartScene extends GameState {

}

export class GameOver extends GameState {

}
export class End extends GameState {

}
export class Credits extends GameState {

}