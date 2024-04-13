"use strict"

// Import modules

// new modules
import Spawner from "./spawner.new.js"
import Sprite from "./sprite.js"

// OG modules
import { GameScene } from "./game-scene.js"
import { GameWorld, gameStateKeys } from "./game-world.js"
import GameObject from "./game-object.js"
import UI from "./ui.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { PauseMenu } from "./pause-menu.js"
import { DebugMenu } from "./debug-menu.js"

import { spriteTags } from "./sprite.js"
import ObjectPool from "./object-pool.js"

// import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.js"
import { drawStatusText, getRandomInt, wait, typeWriter } from "./utils.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js"

window.addEventListener("load", function () {

    let lastTime = 0
    let deltaTime = 1
    let comboCounter = 0
    let isPaused = false
    let musicPausedTime = 0



    const canvas = document.getElementById("game-screen__canvas")
    canvas.width = 475
    canvas.height = 270
    const ctx = canvas.getContext("2d")

    // Initialize player
    let playerConfig = {
        spriteSrc: "./images/nan-sprite-walk.png",
        animationFrame: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        },
        animations: {
            StandingLeft: {
                frameX: 0,
                frameY: 1,
                endFrame: 0
            },
            StandingRight: {
                frameX: 0,
                frameY: 0,
                endFrame: 0
            },
            WalkingLeft: {
                frameX: 0,
                frameY: 1,
                endFrame: 4
            },
            WalkingRight: {
                frameX: 0,
                frameY: 0,
                endFrame: 4
            },
        }
    }
    const player = new Player(playerConfig)
    // console.log(player)

    // Initialize UI elements //
    const ui = new UI("[data-ui]", player)



    // Initialize Input handler

    // Input Handler
    // console.log(this.document)
    const input = new InputHandler(ui)



    // Initialize Game World

    const game = new GameWorld(player, ui, input)
    console.log(game)

    // Event listeners
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.loop(0)
    }.bind(game))


    const pauseMenu = new PauseMenu(ui)

    // Wiener 🌭

    const getWienerConfig = () => {
        return {
            spriteSrc: "./images/wiener-32px-spin-01.png",
            animationFrame: { x: 0, y: 0, width: 32, height: 32 },
            animations: {
                Spinning: {
                    frameX: 0,
                    frameY: 0,
                    endFrame: 28
                },
            },
            location: {
                dx: {
                    random:
                    {
                        lowerBound: 0,
                        upperBound: CANVAS_WIDTH
                    }
                },
                dy: {
                    random:
                    {
                        lowerBound: 0,
                        upperBound: -40
                    },
                },
            },
            direction: {
                velocityX: {
                    random:
                    {
                        lowerBound: -100,
                        upperBound: 300
                    },
                },
                velocityY: {
                    random:
                    {
                        lowerBound: 50,
                        upperBound: 300
                    },
                },
            },
            healthValue: 5,
            spriteTag: spriteTags.WIENER
        }
    }

    const newWiener = (() => new Sprite(getWienerConfig()))()

    console.log("🚀 ~ newWiener:", newWiener)


    const mySpawner = new Spawner()
    console.log(mySpawner)

    mySpawner.registerObjectPool("wiener", getWienerConfig)

    // mySpawner.startSpawningObjects("wiener", 1, 500, 10, 10000, 1000)

    setTimeout(() => {
        mySpawner.spawnObject("wiener", "objectID-", 4, 10, 10)
    }, 1000)

    setTimeout(() => {
        mySpawner.spawnObject("wiener", "objectID-", 4, 25, 5)
    }, 5000)

    setTimeout(() => {
        mySpawner.spawnObject("wiener", "objectID-", 4, 100, 10)
    }, 10000)

    setTimeout(() => {
        mySpawner.spawnObject("wiener", "objectID-", 4, 200, 10)
    }, 15000)




    const scene00_config = {
        index: 0,
        name: "Garden",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: [],
        sprites: [],
        spawners: [mySpawner],
        music: [],
        sfx: [],

    }

    const scene00 = new GameScene(scene00_config)

    game.scenes = []
    game.scenes.push(scene00)

    ui.toggleUI("play")
    game.startScene()

    console.dir(mySpawner)

    // game.loop2(0, mySpawner)




    // setTimeout(() => {
    //     console.log("spawned Objects: ")
    //     console.dir(spawner.getAllSpawnedObjects())
    //     spawner.draw(ctx)
    // }, 2000)

    // setTimeout(() => {
    //     console.log("spawned Objects: ")
    //     console.dir(spawner.getAllSpawnedObjects())
    //     spawner.draw(ctx)
    // }, 12000)
















}) // end: window.addEventListener("load")
