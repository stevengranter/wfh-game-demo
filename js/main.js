"use strict"

// Import modules

// new modules
import Spawner from "./spawner.js"
import Sprite from "./sprite.js"

// OG modules
import { GameScene } from "./game-scene.js"
import { GameWorld, gameStateKeys } from "./game-world.js"
import UI from "./ui.js"
import Layer from "./layer.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { PauseMenu } from "./pause-menu.js"

import { spriteTags } from "./sprite.js"
// import CollisionDetector from "./collision-detector.js"
// import { drawStatusText, getRandomInt, wait, typeWriter } from "./utils.js"
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
    // console.log(game)

    // Event listeners
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.loop(0)
    }.bind(game))


    const pauseMenu = new PauseMenu(ui)

    // Wiener 🌭




    // console.dir(myLayer)

    const getGullConfig = () => {
        return {
            spriteSrc: "./images/seagull-flying-sprite-01-sheet.png",
            animationFrame: { x: 0, y: 0, width: 44, height: 51 },
            animations: {
                Spinning: {
                    frameX: 0,
                    frameY: 0,
                    endFrame: 7
                },
            },
            location: {
                dx: {
                    random:
                    {
                        lowerBound: CANVAS_WIDTH,
                        upperBound: CANVAS_WIDTH + 100
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
                        lowerBound: -300,
                        upperBound: -100
                    },
                },
                velocityY: {
                    random:
                    {
                        lowerBound: 10,
                        upperBound: 20
                    },
                },
            },
            healthValue: 0,
            spriteTag: spriteTags.GULL,
            timeLimit: 10
        }
    }







    const getGullBlessingConfig = () => {
        return {
            spriteSrc: "./images/seagull-poo-sprite-02.png",
            animationFrame: { x: 0, y: 0, width: 16, height: 16 },
            animations: {
                Spinning: {
                    frameX: 0,
                    frameY: 0,
                    endFrame: 0
                },
            },
            location: {
                dx: {
                    random:
                    {
                        lowerBound: -20,
                        upperBound: CANVAS_WIDTH + 20
                    }
                },
                dy: {
                    random:
                    {
                        lowerBound: -50,
                        upperBound: 0
                    },
                },
            },
            direction: {
                velocityX: {
                    random:
                    {
                        lowerBound: -10,
                        upperBound: +10
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
            healthValue: -25,
            pointValue: 0,
            spriteTag: spriteTags.POO,
            timeLimit: 4,
            parentSpriteTag: spriteTags.GULL
        }
    }




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
                        lowerBound: -20,
                        upperBound: CANVAS_WIDTH + 20
                    }
                },
                dy: {
                    random:
                    {
                        lowerBound: -50,
                        upperBound: 0
                    },
                },
            },
            direction: {
                velocityX: {
                    random:
                    {
                        lowerBound: -10,
                        upperBound: +10
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
            pointValue: 100,
            spriteTag: spriteTags.WIENER,
            timeLimit: 4
        }
    }

    // Create spawner and register object pools for each object with spawner

    const spawner = new Spawner()
    game.spawner = spawner

    spawner.registerObjectPool("gull", getGullConfig)
    spawner.registerObjectPool("blessing", getGullBlessingConfig)
    spawner.registerObjectPool("wiener", getWienerConfig)

    // spawner.startSpawningObjects("wiener", "wiener-", 15, 10, 15)
    // spawner.startSpawningObjects("gull", "gull-", 15, 10, 55)

    console.log(spawner)

    const backgroundLayerConfig = () => {
        return {
            spriteSrc: "./images/garden-06.png",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            timeline: {},
            player: player,
            playerScrollFactor: 0,
            isPlayerLayer: false
        }
    }

    const scene00spriteLayerConfig = () => {
        return {
            // spriteSrc: "./images/garden-06.png",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            spawners: [spawner],
            eventTimeline: [

                {
                    startTime: 1000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 5,
                    totalSpawnCount: 500,
                    spawningDuration: 55,
                    resetConfig: {
                        velocityX: -50,
                        customReset: true,
                    }
                },
                {
                    startTime: 2000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 5,
                    totalSpawnCount: 500,
                    spawningDuration: 55,
                    resetConfig: {
                        dy: 280,
                        velocityX: 50,
                        customReset: true,

                    },
                },
                {
                    startTime: 10000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 5,
                    totalSpawnCount: 500,
                    spawningDuration: 55,
                }


            ],
            player: player,
            playerScrollFactor: 0,
            isPlayerLayer: true
        }
    }

    const scene01spriteLayerConfig = () => {
        return {
            // spriteSrc: "./images/garden-06.png",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            spawners: [spawner],
            eventTimeline: [

                {
                    startTime: 1000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 10,
                    totalSpawnCount: 25,
                    spawningDuration: 5,


                },
                {
                    startTime: 5000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 10,
                    totalSpawnCount: 100,
                    spawningDuration: 5
                },
                {
                    startTime: 10000,
                    type: "spawner",
                    objectType: "wiener",
                    objectId: "wiener-",
                    spawnDrawTime: 10,
                    totalSpawnCount: 10000,
                    spawningDuration: 10,

                }

            ],
            player: player,
            playerScrollFactor: 0,
            isPlayerLayer: true
        }
    }

    const foregroundLayerConfig = () => {
        return {
            spriteSrc: "./images/garden-06-foreground.webp",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            // spawners: [wienerSpawner, gullSpawner],
            timeline: {},
            player: player,
            playerScrollFactor: 0,
            isPlayerLayer: false
        }
    }

    const backgroundLayer = new Layer({ ...backgroundLayerConfig() })
    const scene00spriteLayer = new Layer({ ...scene00spriteLayerConfig() })
    const foregroundLayer = new Layer({ ...foregroundLayerConfig() })

    const scene00_config = {
        index: 0,
        name: "Garden",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: [backgroundLayer, scene00spriteLayer, foregroundLayer],
        spriteLayerIndex: 1,
        music: ["../audio/music/alouette_55s.mp3"],
        sfx: [],
        goals: {
            gold: {
                type: "score",
                value: 10000
            },
            silver: {
                type: "score",
                value: 5000
            },
            bronze: {
                type: "score",
                value: 2500
            }
        }

    }

    const scene00 = new GameScene(scene00_config)


    game.addScene(scene00)



    const scene01BackgroundLayerConfig = () => {
        return {
            spriteSrc: "./images/bg-beach-huts-01.webp",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            player: player,
            playerScrollFactor: 0,
            isPlayerLayer: false
        }
    }

    const scene01BackgroundLayer = new Layer({ ...scene01BackgroundLayerConfig() })
    const scene01spriteLayer = new Layer({ ...scene01spriteLayerConfig() })

    const scene01_config = {
        index: 0,
        name: "Cavendish",
        playerBounds: {
            topLeft: [0, 0],
            topRight: [CANVAS_WIDTH, 0],
            bottomRight: [CANVAS_WIDTH, CANVAS_HEIGHT],
            bottomLeft: [0, CANVAS_HEIGHT]
        },
        layers: [scene01BackgroundLayer, scene01spriteLayer],
        spriteLayerIndex: 1,
        music: ["../audio/music/i_equals_da_by.mp3"],
        sfx: [],
        events: [],
        goals: {
            gold: {
                type: "score",
                value: 8000
            },
            silver: {
                type: "score",
                value: 4000
            },
            bronze: {
                type: "score",
                value: 2000
            }
        }

    }

    const scene01 = new GameScene(scene01_config)

    console.log(scene01)

    game.addScene(scene01)

    console.log(game)

    function initObservers() {
        /* 
        Subscribe player's Stats instance (game.player.stats) to GameWorld instance (game) because
        GameWorld instance detects collisions which effect a player's stats (like health and points)
        */
        game.subscribe(game.player.stats)

        /*
        Subscribe player Sprite instance to game.player.stats so sprite affects can 
        apply when certain stats are reached
        */
        game.player.stats.subscribe(game.player)

        game.subscribe(game.ui.bindings.scene.timeRemaining)
        game.subscribe(game.ui.bindings.scene.timeRemainingStyle)

        /* 
        Subscribe all the UI bindings to the game.player.stats so the UI elements update as a player's
        stats change
        */

        Object.values(game.ui.bindings.player).forEach((binding) => {
            game.player.stats.subscribe(binding)
        })


    }

    initObservers()

    ui.toggleUI("cutscene")
    ui.hide(ui.elements.banner)
    console.dir(ui)
    game.runIntro()















}) // end: window.addEventListener("load")
