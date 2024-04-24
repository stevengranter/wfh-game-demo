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
import GameWorld from "./game-world.new.js"
// import { GameWorld, gameStateKeys } from "./game-world.new.js"
import UI from "./ui.js"
import Player from "./player.js"
import InputHandler from "./input-handler.js"
import { gameStateKeys } from "./constants.js"


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
    const ui = new UI(['data-ui'], player)


    // 🕹️ Initialize Input handler
    const input = new InputHandler(ui)

    // 🌎 Initialize Game World, add references to game canvas element, player, ui and input
    const game = new GameWorld("game-screen__canvas", player, ui, input)

    // Set the game state to "title" to show/hide relavent UI elements
    console.log(game.gameState)
    game.ui.toggleUI(game.gameState)


    // TODO: Remove, only for DEBUG
    function checkGameState() {
        console.log(`%cgamestate is ${game.gameState}`, `color: orange`)
        setTimeout(checkGameState, 1000)
    }
    checkGameState()
    // end TODO

    // --- SPAWNER and OBJECT POOLS --- //

    // Verify if game.spawner exists, then register object pools to spawner
    if (game.spawner instanceof Spawner) {

        // 🌭 Create wieners object pool (config imported from cfg/spawners.cfg.js)
        game.spawner.registerObjectPool("wiener", getWienerConfig)

        // 🐦 Create gull object pool (config imported from cfg/spawners.cfg.js)
        game.spawner.registerObjectPool("gull", getGullConfig, getGullBlessingConfig)

    } else {
        throw new Error("game.spawner is not configured")

    }

    // Preload the first scene before the user presses the Start button
    try {
        game.loadScene(scene00Config)
    } catch {
        throw new Error("Problem preloading scene")
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


    // Add event listener to start button which calls the startgame() method
    const startButton = ui.uiElements.startButton
    startButton.addEventListener("pointerdown", function (e) {
        console.log("START button clicked")
        game.startGame()
    }.bind(game))


    // ui.toggleUI("cutscene")
    // // ui.hide(ui.elements.banner)

    // function showEnemies() {
    //     console.log(game.spawner)
    //     console.dir(`Enemies: ${game.spawner.objectPools['gull'].enemies}`)
    // }

    // console.dir(game)

    // // game.runIntro()

    // game.loop()

    // function checkGameState() {
    //     console.log(`%cgamestate is ${game.gameState}`, `color: orange`)
    //     setTimeout(checkGameState, 1000)
    // }
    // checkGameState()

    // setTimeout(showEnemies, 10000)

}) // end: window.addEventListener("load")
