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

import { spriteTags } from "./sprite.old.js"
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

    // Event listeners
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.runIntro()
    }.bind(game))

    const pauseMenu = new PauseMenu(ui)

    // Wiener 🌭

    const WIENER_CONFIG = {
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
                    upperBound: CANVAS_HEIGHT
                },
            },
        },
        direction: {
            velocityX: {
                random:
                {
                    lowerBound: 0,
                    upperBound: CANVAS_HEIGHT
                },
            },
            velocityY: {
                random:
                {
                    lowerBound: 0,
                    upperBound: CANVAS_HEIGHT
                },
            },
        },
        healthValue: 5,
        spriteTag: spriteTags.WIENER
    }


    const newWiener = new Sprite(WIENER_CONFIG)
    console.log("🚀 ~ newWiener:", newWiener)















}) // end: window.addEventListener("load")
