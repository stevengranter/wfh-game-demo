// Importing constants for canvas dimensions 
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"
// Importing the Observable parent class 
import Observable from "./observable.js"

// GameScene class extends Observable to inherit event handling capabilities
export class GameScene extends Observable {
    // playerBounds // Private field to store player bounds

    constructor({ index, name, playerBounds, layers, spriteLayerIndex, music, sfx, goals }) {
        super() // Calls the constructor of Observable
        this.index = index || 0 // Scene index defaulting to 0 if not provided
        this.name = name || "NoName" // Scene name defaulting to "NoName" if not provided



        this.layers = layers || null // Layers of the scene, default null
        this.spriteLayerIndex = spriteLayerIndex // Index of the sprite layer within the layers array
        this.spriteLayer = this.layers[spriteLayerIndex] // Reference to the sprite layer
        // this.spawners = spawners || null // Spawner objects for the scene, default is null

        this.sfx = sfx // Sound effects for the scene
        this.goals = goals // Goals or objectives of the scene
        this.isMusicLoaded = false // Flag to check if music is loaded
        this.sceneTime = 0 // Time duration of the scene

        // Attempt to load the music and set the flag accordingly
        try {
            this.music = this.loadMusic(music)
            console.log("Music is loaded") // Log success message
            this.isMusicLoaded = true
        } catch (error) {
            console.warn("Music could not be loaded") // Warn if music cannot be loaded
        }

        // this.playerBounds = this.spriteLayer.playerBounds
        // console.log(this.playerBounds)


    }

    // Getter for playerBounds 
    get playerBounds() {
        // console.dir(this.#playerBounds)
        console.dir(this.spriteLayer.playerBounds)
        return this.spriteLayer.playerBounds
    }

    // Setter for playerBounds that updates the private field and logs the update
    set playerBounds(boundingCoordinatesObj) {
        this.spriteLayer = boundingCoordinatesObj
        console.log("sent playerBounds")
    }

    // Update method to update each layer based on deltaTime and optional player input/velocity
    update(deltaTime, input = null, playerVelocityX = 0, playerVelocityY = 0) {
        this.layers.forEach((layer) => {
            layer.update(deltaTime, input, playerVelocityX, playerVelocityY)
        })
    }

    // Draw method to render each layer onto the given canvas context
    draw(context, background, spawners, player) {
        this.layers.forEach((layer) => {
            layer.draw(context, background, spawners, player)
        })
    }

    // Method to load music, set this.sceneTime variable, and handle loading state
    loadMusic(musicFile) {
        if (musicFile) {
            const music = new Audio()
            this.isMusicLoaded = false
            music.src = musicFile
            music.loop = false // Set the music to play through once

            // Event listener to update scene time and loading status when music can play
            music.addEventListener("canplay", () => {
                let duration = music.duration
                this.isMusicLoaded = true
                this.sceneTime = Math.floor(duration)
                console.log(this.sceneTime) // Log the scene time
            })

            return music // Return the created Audio instance
        } else {
            throw new Error("No music file specified") // Throw error if no music file is provided
        }
    }

}
