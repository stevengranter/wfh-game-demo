export default class UI {

    constructor(document) {
        this.body = document.getElementsByTagName("body")[0]
        this.titleScreen = document.getElementById("title-screen")

        // Menu DOM elements
        this.menuOverlay = document.getElementById("game-screen__menu-overlay")
        this.menuScreen = document.getElementById("menu-screen")
        this.gameOverScreen = document.getElementById("gameover-screen")
        this.startButton = document.getElementById("start-button")
        //this.pauseButton = document.getElementById("pause-button")
        this.resumeButton = document.getElementById("resume-button")
        this.stopButton = document.getElementById("stop-button")

        // In-game DOM elements
        this.ingameOverlay = document.getElementById("game-screen__ingame-overlay")
        this.gameplayHUD = document.getElementById("gameplay-hud")
        this.timerHUD = document.getElementById("level-timer")
        this.scoreCounterHUD = document.getElementById("hud-score")
        this.healthMeterHUD = document.querySelector("#hud-health-meter span")
        this.livesCounterHUD = document.querySelector("#hud-lives-remaining div")
        this.comboCounterHUD = document.querySelector("#hud-combo")
        // console.log(healthMeter)

        // Virtual control button elements
        // const virtualButtons = document.querySelectorAll(".touchable")
        this.controllerStartButton = document.getElementById("virtual-controller--button-start")
        this.controllerSelectButton = document.getElementById("virtual-controller--button-select")
        this.controllerDpad = document.getElementById("virtual-controller--button-dpad")
        this.controllerPrimaryButton = document.getElementById("virtual-controller--button-primary")

        // for (let i = 0; i < virtualButtons.length; i++) {
        //     virtualButtons[i].addEventListener("touchstart", handleTouch())
        // }
        this.overlay = document.getElementById("overlay")
        // console.log(overlay)
    }

    update() {
        this.timerHUD.innerText = Math.floor(currentScene.soundTrack.duration - currentScene.soundTrack.currentTime)

    }


    toggleOverlay() {
        if (this.overlay.classList.contains("hidden")) {
            this.overlay.classList.remove("hidden")
            this.overlay.classList.add("block")
            console.log("toggleOverlay(on)")
        } else {
            this.overlay.classList.add("hidden")
            console.log("toggleOverlay(off)")
        }

    }

    show(element) {
        element.classList.remove("hidden")
        element.classList.add("block")
    }

    hide(element) {
        element.classList.add("hidden")
        element.classList.remove("block")
    }



}