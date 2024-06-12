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
        this.escape = false;

        // Prevent context menu from appearing on pointerdown
        // on either touchOverlay or virtual controller
        this.disableContextMenu();

        // Initialize event listeners
        this.addKeyboardListener();

        // Event listeners for pointerdown and pointerup events
        this.addPointerListener();

    }

    disableContextMenu() {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
        document.addEventListener("contextmenu", (event) => {
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

        console.log(e.key);
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
                this.escape = isKeyPressed;
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
        let targetElement = event.target;

        if (targetElement.id === "touchcontroller_right" ||
            targetElement.id === "touchcontroller_left" ||
            targetElement.id === "virtual-controller--button-dpad-left" ||
            targetElement.id === "virtual-controller--button-dpad-right" ||
            targetElement.id === "virtual-controller--button-primary" ||
            targetElement.id === "virtual-controller--button-select" ||
            targetElement.id === "virtual-controller--button-start") {

            let isButtonPressed = event.type === "pointerdown" ? true : false;

            switch (targetElement.id) {
                case "touchcontroller_left":
                case "virtual-controller--button-dpad-left":
                    // console.log
                    this.left = isButtonPressed;
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.left:", this.left)
                    break;
                case "touchcontroller_right":
                case "virtual-controller--button-dpad-right":
                    this.right = isButtonPressed;
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.right:", this.right)
                    break;
                case "virtual-controller--button-primary":
                    this.up = isButtonPressed;
                    break;
                case "virtual-controller--button-select":
                    this.escape = isButtonPressed;
                    break;
                case "virtual-controller--button-start":
                    this.escape = isButtonPressed;
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