"use strict"

// Import configuration objects/functions
import { playerConfig } from "./cfg/player.cfg.js"
import { getGullConfig, getWienerConfig, getGullBlessingConfig } from "./cfg/spawners.cfg.js"

import { scene00Config } from "./cfg/scene00.cfg.js"
import { scene01Config } from "./cfg/scene01.cfg.js"


// Import classes
import Spawner from "./spawner.js"
import { GameScene } from "./game-scene.js"
import { GameWorld } from "./game-world.js"
import UI from "./ui.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { PauseMenu } from "./pause-menu.js"

// Event listener to wait for document to load before running scripts
window.addEventListener("load", function () {


    // --- MAIN GAMEWORLD  --- //

    // 👵🏼 Initialize player (config imported from cfg/player.cfg.js)
    const player = new Player(playerConfig)

    // 👁️ Initialize UI elements
    const ui = new UI("[data-ui]", player)

    // ⏸️ Initialize pause menu
    const pauseMenu = new PauseMenu(ui)

    // 🕹️ Initialize Input handler
    const input = new InputHandler(ui)

    // 🌎 Initialize Game World, add references to player, ui and input
    const game = new GameWorld(player, ui, input)


    // --- SPAWNER and OBJECT POOL --- //

    // 🏊🏼‍♂️ Create spawner and register object pools for each object with spawner
    const spawner = new Spawner()
    game.spawner = spawner

    // 🌭 Create wieners object pool (config imported from cfg/spawners.cfg.js)
    spawner.registerObjectPool("wiener", getWienerConfig)

    // 🐦 Create gull object pool (config imported from cfg/spawners.cfg.js)
    spawner.registerObjectPool("gull", getGullConfig)

    // 💩 Create gull blessing object pool (config imported from cfg/spawners.cfg.js)
    spawner.registerObjectPool("blessing", getGullBlessingConfig)


    // --- SCENE  --- // 

    // 🏡 Create scene00 and add to GameWorld instance
    function readyScene00() {
        // scene00Config imported from cfg/scene00.cfg.js
        const scene00 = new GameScene(scene00Config, player)
        game.addScene(scene00)
    }

    // 🌊 Create scene01 and add to GameWorld instance
    function readyScene01() {
        // scene01Config imported from cfg/scene01.cfg.js
        const scene01 = new GameScene(scene01Config, player)
        game.addScene(scene01)
    }


    // --- UI and DATA BINDING --- //

    // 👀 Initialize Observable and Observers
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

    // Add event listener to start button
    const startButton = ui.elements.startButton
    startButton.addEventListener("click", function (e) {
        game.loop(0)
    }.bind(game))

    initObservers()
    readyScene00()

    ui.toggleUI("cutscene")
    ui.hide(ui.elements.banner)

    game.runIntro()



}) // end: window.addEventListener("load")
