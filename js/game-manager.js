
export default class GameManager extends Observable {
    constructor(game) {
        super()
        this.game = game
    }

    // Method to start the game (called when pressing the Start button)
    startGame() {
        console.log("in startGame() method")
        this.currentState = this.gameStateKeys["Start"]

        // this.ui.toggleUI("Start")
        if (!this.#isNextSceneReady) runLoadingScreen()

        const currentSceneIndex = 0
        this.currentScene = this.#scenes[currentSceneIndex]
        this.currentScene = this.#scenes[0]

        console.log(this.currentScene)

        this.initializeEventListeners()
        console.log(this.scenes)
        this.fadeInScene()
        this.runIntro()
    }


    // Method to fade in the scene

    fadeInScene() {
        this.currentScene.draw(this.ctx)
        setTimeout(() => { animateBlur(this.currentScene, this.ctx, 0.5, 2, 0.2) }, 1000)
    }


    runShop() {

        this.ui.toggleUI("cutscene")
        this.ui.hide(this.ui.elements.titleScreen)
        this.ui.show(this.ui.elements.shopScreen)
        this.ui.hide(this.ui.elements.introScreen)
        this.ui.hide(this.ui.elements.popupScreen)
        // console.log(this.ui)
        let dialogText = document.querySelector('#shop-dialog div').textContent
        typeWriter('shop-dialog', dialogText, 25)

        this.loadScene(scene01Config)

        document.getElementById("item-rainbonnet").querySelector(".buy-button").addEventListener("pointerdown", () => {
            let dialogText = "You don't have enough points for that. I can't just be giving stuff away now can I?"
            typeWriter('shop-dialog', dialogText, 25)
            setTimeout(() => {
                typeWriter('shop-dialog', "Sorry, come back once you get some more points.", 25)
            }, 5000) // Delay the second message by 5 seconds
            setTimeout(() => {
                this.isSceneOver = false
                this.startScene()
            }, 2000)
        }, { once: true })
    }

    // Method to run the intro sequence 
    // (after Start button is pressed, before scene starts)
    runIntro() {
        console.log("in runIntro() method")
        this.currentState = this.gameStateKeys["Intro"]
        // this.ui.toggleUI(this.gameState)

        console.log(this.ui)
        setTimeout(() => { this.ui.elements.introDialog.style.transform = "translateY(0)" }, 500)
        setTimeout(() => { this.ui.elements.popupNan.style.transform = "translateY(0)" }, 700)

    }

    runLoadingScreen() {
        while (!this.isNextSceneReady) {
            console.log("Please wait - loading...")
        }
        console.log("in runLoadingScreen() method")
    }

    pauseGame(gameState = this.gameState) {

        if (this.isPaused) {
            console.log(gameState)
            this.pauseMusic()

            if (gameState) {
                console.log("switching UI states..")
                this.ui.toggleUI(gameState)
            }
            // switch (this.#gameState) {
            //     case gameStateKeys.PAUSED_BY_PLAYER:
            //         this.ui.toggleUI(this.game)
            //         document.getElementById("touch-controller-overlay").style = "display: none" // TODO: should use gamestate to hide and show
            //         break
            //     case gameStateKeys.SCENE_END:
            //         this.ui.toggleUI("scene-end")
            //         document.getElementById("touch-controller-overlay").style = "display: none" // TODO: should use gamestate to hide and show
            //         break
            //     case gameStateKeys.POPUP:
            //         this.ui.toggleUI("popup")
            //         // document.getElementById("touch-controller-overlay").style = "display: none" // TODO: should use gamestate to hide and show
            //         break
            //     default:
            //         console.warn("No UI defined for gamestate: " + this.#gameState)
            // }
        }
        else {
            console.log(this.gameState)
            this.#gameState = gameStateKeys.PLAY
            this.ui.toggleUI("play")
            document.getElementById("touch-controller-overlay").style = "display: flex" // TODO: should use gamestate to hide and show
            // this.music.currentTime = this.musicPausedTimes
            this.playMusic()
            console.log(this.lastTime)
            this.isPaused = false
            this.loop(this.lastTime)

        }
    }

    playMusic() {
        this.music.play()
        this.musicState = musicStateKeys.PLAYING
    }

    pauseMusic() {
        this.music.pause()
        this.musicState = musicStateKeys.PAUSED
    }

    stopMusic() {
        this.music.stop()
        this.musicState = musicStateKeys.PAUSED
    }

    // setTimeout(() => { this.ui.elements.shopDialog.style.transform = "translateY(-600px)" }, 100)




} // end of GameManager class




