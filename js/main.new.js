"use strict"

// Import modules

// new modules
import Spawner from "./spawner.new.js"
import Sprite from "./sprite.js"

// OG modules
import { GameScene } from "./game-scene.js"
import { GameWorld, gameStateKeys } from "./game-world.new.js"
import GameObject from "./game-object.js"
import UI from "./ui.js"
import Layer from "./layer.new.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { PauseMenu } from "./pause-menu.js"
import { DebugMenu } from "./debug-menu.js"

import { spriteTags } from "./sprite.js"
import ObjectPool from "./object-pool.js"

// import Projectile from "./projectile.js"
import CollisionDetector from "./collision-detector.new.js"
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



    const newGull = (() => new Sprite(getGullConfig()))()

    // console.log("🚀 ~ newGull:", newGull)




    const gullSpawner = new Spawner()

    gullSpawner.registerObjectPool("gull", getGullConfig)

    // console.log(gullSpawner)

    setTimeout(() => {
        gullSpawner.spawnObject("gull", "objectID-", 5, 10, 10)
    }, 1000)

    // setTimeout(() => {
    //     gullSpawner.spawnObject("gull", "objectID-", 5, 50, 5)
    // }, 15000)


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


    const gullBlessingSpawner = new Spawner()


    gullBlessingSpawner.registerObjectPool("blessing", getGullBlessingConfig)
    // console.log(gullBlessingSpawner)

    setTimeout(() => {
        gullBlessingSpawner.spawnObject("blessing", "objectID-", 4, 10, 10)
    }, 3000)



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


    const wienerSpawner = new Spawner()


    wienerSpawner.registerObjectPool("wiener", getWienerConfig)
    // console.log(wienerSpawner)

    // wienerSpawner.startSpawningObjects("wiener", 1, 500, 10, 100, 1000)

    setTimeout(() => {
        wienerSpawner.spawnObject("wiener", "objectID-", 4, 10, 10)
    }, 1000)

    setTimeout(() => {
        wienerSpawner.spawnObject("wiener", "objectID-", 4, 25, 5)
    }, 5000)

    setTimeout(() => {
        wienerSpawner.spawnObject("wiener", "objectID-", 4, 100, 10)
    }, 10000)

    setTimeout(() => {
        wienerSpawner.spawnObject("wiener", "objectID-", 4, 200, 10)
    }, 12000)

    // setTimeout(() => {
    //     wienerSpawner.spawnObject("wiener", "objectID-", 4, 400, 10)
    // }, 15000)


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

    const spriteLayerConfig = () => {
        return {
            // spriteSrc: "./images/garden-06.png",
            animationFrame: {},
            animations: {},
            location: { dx: 0, dy: 0 },
            direction: {
                velocityX: 0,
                velocityY: 0,
            },
            spawners: [wienerSpawner, gullBlessingSpawner, gullSpawner],
            timeline: {},
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
    const spriteLayer = new Layer({ ...spriteLayerConfig() })
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
        layers: [backgroundLayer, spriteLayer, foregroundLayer],
        spriteLayerIndex: 1,
        music: ["../audio/music/alouette_55s.mp3"],
        sfx: [],
        goals: {
            gold: {
                type: "score",
                value: 5000
            },
            silver: {
                type: "score",
                value: 4000
            },
            bronze: {
                type: "score",
                value: 2500
            }
        }

    }

    const scene00 = new GameScene(scene00_config)


    console.log(scene00)

    game.addScene(scene00)

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
        // game.player.stats.subscribe(game)

        game.subscribe(game.ui.bindings.scene.timeRemaining)
        game.subscribe(game.ui.bindings.scene.timeRemainingStyle)

        /* 
        Subscribe all the UI bindings to the game.player.stats so they UI elements update as a player's
        stats change
        */

        Object.values(game.ui.bindings.player).forEach((binding) => {
            game.player.stats.subscribe(binding)
        })

        // console.log(game.ui.bindings)
        // game.subscribe(game.ui.bindings.timeRemaining)
        // game.subscribe(game.player)
        // game.subscribe(game.ui)
        // game.subscribe(game.player.stats)


    }

    initObservers()

    ui.toggleUI("cutscene")
    console.dir(ui)
    game.runIntro()

    // Assuming game.notifyTimeRemaining is already defined and is a method of game

    // Call the function every 1000 milliseconds (1 second)
    const intervalId = setInterval(game.notifyTimeRemaining.bind(game), 1000)

    // If you need to stop repeating the call, you can clear the interval with:
    // clearInterval(intervalId);














}) // end: window.addEventListener("load")
