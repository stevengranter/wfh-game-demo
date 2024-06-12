"use strict";

export default class InputHandler {

    constructor(ui) {

        // Hold a reference to UI instance passed to constructor
        this.ui = ui;

        // List of action verbs that are available to the player,
        // all input handlers convert all valid input to one of these 
        // action verbs
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;

        this.pause = false;

        // Prevent context menu from appearing on pointerdown
        // on either touchOverlay or virtual controller
        this.disableContextMenu();

        // WARNING: This is very bad for accessibility, but without it the browser window will zoom in if 
        // screen is touched twice in short succession. 
        this.disableDoubleTapZoom();

        // Initialize event listeners
        this.addKeyboardListener();

        // Event listeners for pointerdown and pointerup events
        this.addPointerListener();

        // global gamepad object
        let gamepadIndex;
        window.addEventListener('gamepadconnected', (event) => {


            gamepadIndex = event.gamepad.index;
            if (gamepadIndex !== undefined) {
                // a gamepad is connected and has an index
                const myGamepad = navigator.getGamepads()[gamepadIndex];
                console.log(myGamepad);
                this.processGamepadInput(myGamepad);
            }
        });

        // now print the axes on the connected gamepad, for example: 
        setInterval(() => {
            if (gamepadIndex !== undefined) {
                // a gamepad is connected and has an index
                const myGamepad = navigator.getGamepads()[gamepadIndex];
                this.processGamepadInput(myGamepad);
            }
        }, 100);

    }

    disableDoubleTapZoom() {
        let last_touch_end = 0;
        document.addEventListener("touchend", function (e) {
            const now = (new Date()).getTime();
            if (now - last_touch_end <= 300) {
                e.preventDefault();
            }
            last_touch_end = now;
        }, false);
    }

    disableContextMenu() {
        const virtualController = document.getElementById('ui--virtual-controller');
        const touchControllerOverlay = document.getElementById('touch-controller-overlay');
        const gameScreenBorder = document.getElementById("game-screen-border");
        const gameScreenCutsceneOverlay = document.getElementById("game-screen__cutscene-overlay");

        virtualController.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
        touchControllerOverlay.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
        gameScreenBorder.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
        gameScreenCutsceneOverlay.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }



    // Add event listeners for keyboard input
    addKeyboardListener() {
        // Event listener for keyboard input
        addEventListener("keydown", (e) => {
            e.preventDefault();
            this.keyHandler(e);
        });
        addEventListener("keyup", (e) => this.keyHandler(e));
    }


    // Key handler to convert keyboard input into input handler action verbs
    keyHandler(e) {
        let isKeyPressed = e.type == "keydown" ? true : false;

        // console.log(e.key);
        // const previousKeyPressed = isKeyPressed

        switch (e.key) {
            case "ArrowRight":
            case "d":
            case "D":
                this.right = isKeyPressed;
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.right:", this.right)
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.left = isKeyPressed;
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.left:", this.left)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ left:", this.left)
                break;
            case "ArrowUp":
            case "w":
            case "W":
            case " ":
                this.up = isKeyPressed;
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.down = isKeyPressed;
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                break;
            case "Escape":
                this.pause = isKeyPressed;
                // console.log("Escape key pressed");
                break;
            default:
                break;
        }
    }

    addPointerListener() {
        document.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            this.pointerHandler(event);
        });
        document.addEventListener('pointerup', (event) => {
            event.preventDefault();
            this.pointerHandler(event);
        });
    }

    // Pointer handler to convert pointer events to input handler action
    pointerHandler(event) {

        let validPointerTargets = [
            "touchcontroller_right",
            "touchcontroller_left",
            "virtual-controller--button-dpad-left",
            "virtual-controller--button-dpad-right",
            "virtual-controller--button-primary",
            "virtual-controller--button-select",
            "virtual-controller--button-start"];

        let targetElement = event.target;

        if (validPointerTargets.includes(targetElement.id)) {

            let isButtonPressed = event.type === "pointerdown" ? true : false;

            switch (targetElement.id) {
                case "touchcontroller_left":
                case "virtual-controller--button-dpad-left":
                    this.left = isButtonPressed;
                    break;
                case "touchcontroller_right":
                case "virtual-controller--button-dpad-right":
                    this.right = isButtonPressed;
                    break;
                case "virtual-controller--button-primary":
                    this.up = isButtonPressed;
                    break;
                case "virtual-controller--button-select":
                    this.pause = isButtonPressed;
                    // console.log("SELECT button pressed");
                    break;
                case "virtual-controller--button-start":
                    this.pause = isButtonPressed;
                    // console.log("START button pressed");
                    break;
                default:
                    break;

            }

        }
        return false;


    }

    // TODO: Fix this
    processGamepadInput(gamepad) {
        // Button example (A button)
        if (gamepad.buttons[0].pressed) {
            console.log("A button is pressed");
        }
        if (gamepad.buttons[1].pressed) {
            console.log("B button is pressed");
        }
        if (gamepad.buttons[2].pressed) {
            console.log("X button is pressed");
        }
        if (gamepad.buttons[3].pressed) {
            console.log("Y button is pressed");
        }

        // Left stick - horizontal movement
        let leftStickX = gamepad.axes[0];
        if (leftStickX < -0.5) {
            console.log("Left is pressed");
        } else if (leftStickX > 0.5) {
            console.log("Right is pressed");
        }
    }

}