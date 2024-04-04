import Layer from "./layer.js"
import Player from "./player.js"


export class GameWorld {
    constructor(canvas, width, height, player, currentScene) {
        this.canvas = canvas
        this.canvas.width = width
        this.canvas.height = height
        this.context = canvas.getContext("2d")

        // this.lastTime2 = 1
        this.deltaTime = 1
        this.comboCounter = 0


        this.isPaused = false

        this.init()

    }

    init() {
        this.context.imageSmoothingEnabled = false
    }

    gameLoop(scene, timeStamp) {
        console.log(timeStamp)
        // this.deltaTime = (timeStamp - this.lastTime2) / 1000
        // this.lastTime2 = timeStamp
        console.log(scene)
        // scene.update(this.deltaTime)
        scene.draw(this.context)
        requestAnimationFrame(this.gameLoop(scene, timeStamp))

    }
}

export class GameScene {
    constructor(sceneIndex, sceneName, playerObject, layerArray, spriteArray, spawnerArray, musicFile, sfxArray) {
        this.index = sceneIndex
        this.name = sceneName

        this.player = playerObject
        this.layers = layerArray
        this.sprites = spriteArray
        this.spawners = spawnerArray

        this.soundTrack = musicFile

        this.music = this.loadMusic(musicFile)
        // console.log(this.music)
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
                this.sceneTime = Math.floor(duration)
                console.log(this.sceneTime)
            })
            return music
        } else {
            throw new Error("No music file specified")
        }




    }

}
