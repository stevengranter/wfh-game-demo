"use strict"

// Import configuration objects/functions
import { playerConfig, playerAltConfig } from "./cfg/player.cfg.js"
import { getGullConfig, getWienerConfig, getGullBlessingConfig } from "./cfg/spawners.cfg.js"

import { scene00Config } from "./cfg/scene00.cfg.js"
import { scene01Config } from "./cfg/scene01.cfg.js"

// Import utility functions
import { wait } from "./utils.js"


// Import classes
import Sprite from "./sprite.js"
import Spawner from "./spawner.js"
import { GameScene } from "./game-scene.js"
import GameWorld from "./game-world.js"
import { gameStateKeys } from "./constants.js"
import UI from "./ui.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"


// Event listener to wait for document to load before running scripts
window.addEventListener("load", function () {


    // --- MAIN GAMEWORLD  --- //

    // 👵🏼 Initialize player (config imported from cfg/player.cfg.js)
    const player = new Player(playerConfig)

    const playerAltAppearance = new Sprite(playerAltConfig)
    player.altSprite = playerAltAppearance
    player.altAppearance = false
    player.loadSprite()
    // console.log(player)

    // 🖥️ Initialize UI elements
    const ui = new UI(['data-ui', 'data-binding'], player)

    // 🕹️ Initialize Input handler
    const input = new InputHandler(ui)

    // 🌎 Initialize Game World, add references to player, ui and input
    const game = new GameWorld(player, ui, input)
    // console.log(game)


    // --- SPAWNER and OBJECT POOL --- //

    // 🏊🏼‍♂️ Create spawner and register object pools for each object with spawner
    const spawner = new Spawner()
    game.spawner = spawner
    // console.log("🚀 ~  game.spawner:", game.spawner)


    // 🌭 Create wieners object pool (config imported from cfg/spawners.cfg.js)
    spawner.registerObjectPool("wiener", getWienerConfig)

    // 🐦 Create gull object pool (config imported from cfg/spawners.cfg.js)
    spawner.registerObjectPool("gull", getGullConfig, getGullBlessingConfig)

    // 💩 Create gull blessing object pool (config imported from cfg/spawners.cfg.js)
    // spawner.registerObjectPool("blessing", getGullBlessingConfig)


    // --- SCENE  --- // 

    // 🏡 Function to create scene00 and add to GameWorld instance
    function readyScene00() {
        // scene00Config imported from cfg/scene00.cfg.js
        const scene00 = new GameScene(scene00Config, player)

        // Add scene to game instance
        game.addScene(scene00)

        // Add spawner to sprite Layer in scene
        scene00.spriteLayer.spawner = game.spawner
    }

    // 🌊 Function to create scene01 and add to GameWorld instance
    function readyScene01() {
        // scene01Config imported from cfg/scene01.cfg.js
        const scene01 = new GameScene(scene01Config, player)

        // Add scene to game instance
        game.addScene(scene01)

        // Add spawner to sprite Layer in scene
        scene01.spriteLayer.spawner = game.spawner

    }


    // --- UI and DATA BINDING --- //

    // 👀 Initialize Observable and Observers
    function initObservers() {
        /* 
        Subscribe player's Stats instance (game.player.stats) to GameWorld instance (game) because
        GameWorld instance detects collisions which effect a player's stats (like health and points)
        */
        game.subscribe(game.player.stats)
        game.player.stats.scoreKeeper.subscribe(game.ui)
        game.player.stats.subscribe(game.ui)
        game.subscribe(game.ui)

        /*
        Subscribe player sprite instance to game.player.stats so sprite affects can 
        apply when certain stats are reached
        */
        game.player.stats.subscribe(game.player)
        game.player.stats.scoreKeeper.subscribe(game.player)


    }

    // Add event listener to start button
    // console.log(ui)
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.loop(0)
    }.bind(game))

    wait(200).then(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                game.isPaused = !game.isPaused
                game.gameState = gameStateKeys.PAUSED_BY_PLAYER
                game.pauseGame()
            }
        })
    })




    initObservers()
    // readyScene00()

    // ui.toggleUI("endscene")
    // ui.hide(ui.elements.banner)

    function showEnemies() {
        console.log(game.spawner)
        console.dir(`Enemies: ${game.spawner.objectPools['gull'].enemies}`)
    }

    // console.log(ui)

    game.gameState = "title"
    game.ui.showUI("title")
    // console.log(game.ui)
    // console.log(game.player)
    // game.runIntro()

    document.getElementById("start-button").addEventListener("pointerdown", (event) => {
        event.preventDefault()
        game.gameState = "intro"
        game.startGame()
    })

    // function checkGameState() {
    //     console.log(`%cgamestate is ${game.gameState}`, `color: orange`)
    //     setTimeout(checkGameState, 1000)
    // }
    // checkGameState()

    // setTimeout(showEnemies, 10000)

}) // end: window.addEventListener("load")
