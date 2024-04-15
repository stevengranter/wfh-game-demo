import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"
import Observable from "./observable.js"


// let gameSceneTestObj = {
//     index: 0,
//     name: "",
//     playerBounds: {
//         topLeft: [0, 0],
//         topRight: [CANVAS_WIDTH, 0],
//         bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
//         bottomLeft: [0, CANVAS_HEIGHT]
//     },
//     layers: [],
//     sprites: [],
//     spawners: [],
//     music: [],
//     sfx: [],
// }




export class GameScene extends Observable {
    #playerBounds

    constructor({ index, name, playerBounds, layers, spriteLayerIndex, spawners, music, sfx }) {
        super()
        this.index = index || 0
        this.name = name || "NoName"
        this.playerBounds = playerBounds || {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        }
        this.layers = layers || []
        this.spriteLayerIndex = spriteLayerIndex
        this.spriteLayer = this.layers[spriteLayerIndex]
        this.spawners = spawners || []

        try {
            this.music = this.loadMusic(music)
        } catch (error) {
            console.warn("Music could not be loaded")
        }

        this.sfx = sfx
        this.isMusicLoaded = false
        this.sceneTime = 0

        window.music = this.music // Temporary solution for PauseMenu access
        console.log(this)

    }

    get playerBounds() {
        console.dir(this.#playerBounds) // Corrected property name
        return this.#playerBounds
    }

    set playerBounds(boundingCoordinatesObj) {
        this.#playerBounds = boundingCoordinatesObj
        console.log("sent playerBounds")
        // this.notify("some data")

    }



    update(deltaTime, input = null, playerVelocityX = 0, playerVelocityY = 0) {
        this.layers.forEach((layer) => {
            layer.update(deltaTime, input, playerVelocityX, playerVelocityY)
        })

    }

    draw(context, background, spawners, player) {
        // console.log(player)
        this.layers.forEach((layer) => {
            layer.draw(context, background, spawners, player)
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



// export class GameScene {
//     constructor(index, name, layers, sprites, spawners, musicFile, sfx) {

//         this.index = sceneIndex
//         this.name = name

//         this.player 
//         this.levelBounds = [] // top{ x, y }, right{ x, y }, bottom { x, y }, left{ x, y }
//         this.layers = layers
//         this.sprites = sprites
//         this.spawners = spawners

//         this.soundTrack = musicFile

//         this.music = this.loadMusic(musicFile)
//         // console.log(this.music)
//         this.sfx = sfx

//         this.isMusicLoaded = false



//         this.sceneTime = 0

//         // TODO: fix - doing for now so PauseMenu can access music object
//         window.music = this.music

//     }

//     update(deltaTime) {
//         this.layers.forEach((layer) => {
//             layer.update(deltaTime)
//         })
//         this.spawners.forEach((spawner) => {
//             spawner.update(deltaTime)
//         })
//     }

//     draw(context) {
//         this.layers.forEach((layer) => {
//             layer.draw(context)
//         })
//         this.spawners.forEach((spawner) => {
//             spawner.draw(context)
//         })
//     }

//     loadMusic(musicFile) {
//         if (musicFile) {
//             const music = new Audio()
//             this.isMusicLoaded = false
//             music.src = musicFile
//             music.loop = true

//             music.addEventListener("canplay", () => {
//                 let duration = music.duration
//                 this.isMusicLoaded = true
//                 this.sceneTime = Math.floor(duration)
//                 console.log(this.sceneTime)
//             })
//             return music
//         } else {
//             throw new Error("No music file specified")
//         }




//     }

// }
