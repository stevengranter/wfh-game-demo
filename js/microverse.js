

// In Microverse, there is only Microverse. And in Microverse, there is only NOW. 
// Microverse class handles the environment, the player and everything in the game world
// (the game is running on a electronic (sub-atomic) level, so it literally *is* a Microverse) 🤯
export default class Microverse {

    // Set deltaTime to a private static variable, because it's a secret! 🤫
    // There is only one #deltaTime, and no mere mortal can change it!
    // Initialize it to 1, because otherwise we're going to get a NaN(👵🏼) from attempting
    // to divide this.lastTime by undefined.
    static #deltaTime = 1

    constructor() {
        // We could init(), or we could makeABigBang() it. 
        // Let's go with makeABigBang 💥
        this.makeABigBang()
    }

    //🎆 Making something from nothing, shall we? 🪐
    makeABigBang() {

        /* Just gonna assume there's only one canvas element, 
           that has the ID of "cosmic-mcrowave-background"..
           I mean, "game-canvas"
        */
        this.canvas = document.getElementById("game-canvas")

        // FYI dear reader - nobody says "cosmic microwave background" anymore. 🤓
        // It's either CMB this or CMB that, I mean this.CMB, er, this.ctx
        // We're gonna use the abbreviation "ctx" for the canvas' context
        // cuz all the cool kids do. 😎 
        this.ctx = this.canvas.getContext("2d")

        // Initialize the currentWorld to 0 (the first one, that's not a one, but a zero)
        this.currentWorld = 0

    }

    // If another class needs to know what deltaTime is, they can get it through this get method
    static get deltaTime() {
        return GameWorld.#deltaTime
    }


    // Like sands through the hourglass,
    // so is the game loop. ⏳
    // It's the main event, it will continue forever!
    // Or, until the player/user quits
    runTime(timeStamp) {

        // Timekeeping, setting deltaTime with each frame
        TheUniverse.#deltaTime = (timeStamp - this.lastTime) / 1000
        this.lastTime = timeStamp

        this.updateMultiverse()

        this.drawMultiverse()


    }

    // updateMultiverse simulates what the game is going to look like in the very next time slice
    updateMultiverse(deltaTime, scene = this.currentScene) {

        // If the scene has a layers property (and is an array), call each layer's draw instance        
        if (Array.isArray(scene.layers)) {
            layers.foreach((layer) => {
                layer.update(deltaTime)
            }
            )
        }
    }

    drawMultiverse(context, scene = this.currentScene) {

        // If the scene has a layers property (and is an array), call each layer's draw instance        
        if (Array.isArray(scene.layers)) {
            layers.foreach((layer) => {
                layer.update(deltaTime)
            }
            )
        }
    }

}