import Layer from "./layer.js"
import Player from "./player.js"

export default class GameScene {
    constructor(sceneIndex, sceneName, playerObject, layerArray, spriteArray, spawnerArray, musicFile, sfxArray) {
        this.index = sceneIndex
        this.name = sceneName

        this.player = playerObject
        this.layers = layerArray
        this.sprites = spriteArray
        this.spawners = spawnerArray

        this.soundTrack = musicFile

        this.music = this.loadMusic(this.soundTrack)
        this.sfx = sfxArray

        this.isMusicLoaded = false


        this.sceneTime = 0

    }

    update(deltaTime) {
        this.layers.forEach((layer) => {
            layer.update(deltaTime)
        })
        this.spawners.forEach((spawner) => {
            spawner.update(deltaTime)
        })
    }

    draw(context) {
        this.layers.forEach((layer) => {
            layer.draw(context)
        })
        this.spawners.forEach((spawner) => {
            spawner.draw(context)
        })
    }

    loadMusic(musicFile) {
        if (musicFile) {
            const music = new Audio()
            this.isMusicLoaded = false
            music.src = musicFile
            music.loop = true

            music.addEventListener("canplay", () => {
                let duration = music.duration
                this.isMusicLoaded = true
                // music.play()
                console.log("music file: " + musicFile + " is loaded")
                this.sceneTime = Math.floor(duration)
                console.log(this.sceneTime)
            })
            return music
        } else {
            throw new Error("No music file specified")
        }




    }

}
