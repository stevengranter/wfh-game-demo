"use strict"

export default class InputHandler {

    constructor(ui) {

        this.ui = ui
        this.right = false
        this.left = false
        this.up = false
        this.down = false

        this.escape = false



        addEventListener("keydown", (e) => {
            e.preventDefault()
            this.listenForKeys(e)
        })
        addEventListener("keyup", (e) => this.listenForKeys(e))


        const touchOverlay = document.getElementById("touch-controller-overlay")
        const virtualController = document.getElementById("ui--virtual-controller")

        // prevent context menu from appearing on pointerdown
        // on either touchOverlay or virtual controller
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault()
        })

        document.addEventListener("contextmenu", (event) => {
            event.preventDefault()
        })

        // add event listerners for pointerdown and pointerup
        document.addEventListener('pointerdown', (event) => {
            event.preventDefault()
            this.handlePointerEvent(event)
        },)
        document.addEventListener('pointerup', (event) => {
            event.preventDefault()
            this.handlePointerEvent(event)
        })


    }

    processGamepadInput(gamepad) {
        // Button example (A button)
        if (gamepad.buttons[0].pressed) {
            console.log("A button is pressed")
        }
        if (gamepad.buttons[1].pressed) {
            console.log("B button is pressed")
        }
        if (gamepad.buttons[2].pressed) {
            console.log("X button is pressed")
        }
        if (gamepad.buttons[3].pressed) {
            console.log("Y button is pressed")
        }

        // Left stick - horizontal movement
        let leftStickX = gamepad.axes[0]
        if (leftStickX < -0.5) {
            console.log("Left is pressed")
        } else if (leftStickX > 0.5) {
            console.log("Right is pressed")
        }



        // More buttons and axes processing...
    }

    initTouches() {


        let uiElements = Object.values(this.ui.elements)

        uiElements.forEach((element) => {
            // console.dir(element)
            if (element.dataset.events) {
                // console.log("hasevents")
                let eventsList = element.dataset.events.split(" ")
                // console.dir(eventsList)
                // console.dir(element)
                eventsList.forEach((eventType) => {
                    // console.dir(element)
                    // console.log(eventType)
                    switch (eventType) {
                        case "touchstart":
                            element.addEventListener("touchstart", (e) => {
                                this.listenForTouches(e)
                                console.log("touchstart")
                            })
                            break
                        case "touchend":
                            element.addEventListener("touchend", (e) => {
                                this.listenForTouches(e)
                                console.log("touchend")
                            })
                            break
                        case "pointerdown":
                            element.addEventListener("pointerdown", (e) => {
                                // e.preventDefault()
                                this.handlePointerEvent(e, element)
                                console.log("pointerdown")
                            })
                            break
                        case "pointerup":
                            element.addEventListener("pointerup", (e) => {
                                // e.preventDefault()
                                this.handlePointerEvent(e, element)
                                console.log("pointerup")
                            })
                            break

                        default:
                            console.log("No event listener added.")

                    }
                })

            }
        })

    }

    listenForKeys(e) {
        let isKeyPressed = e.type == "keydown" ? true : false


        // const previousKeyPressed = isKeyPressed

        switch (e.key) {
            case "ArrowRight":
            case "d":
            case "D":
                this.right = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.right:", this.right)
                break
            case "ArrowLeft":
            case "a":
            case "A":
                this.left = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.left:", this.left)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ left:", this.left)
                break
            case "ArrowUp":
            case "w":
            case "W":
            case " ":
                this.up = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                break
            case "ArrowDown":
            case "s":
            case "S":
                this.down = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                // // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                break
            case "Escape":
                this.escape = isKeyPressed
                break
            default:
                break
        }
    }

    handlePointerEvent(event) {
        let targetElement = event.target

        if (targetElement.id === "touchcontroller_right" ||
            targetElement.id === "touchcontroller_left" ||
            targetElement.id === "virtual-controller--button-dpad-left" ||
            targetElement.id === "virtual-controller--button-dpad-right" ||
            targetElement.id === "virtual-controller--button-primary" ||
            targetElement.id === "virtual-controller--button-select" ||
            targetElement.id === "virtual-controller--button-start") {

            // console.log(targetElement)
            let isButtonPressed = event.type === "pointerdown" ? true : false
            // console.log(isButtonPressed)

            // console.log(isButtonPressed)

            switch (targetElement.id) {
                case "touchcontroller_left":
                case "virtual-controller--button-dpad-left":
                    // console.log
                    this.left = isButtonPressed
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.left:", this.left)
                    break
                case "touchcontroller_right":
                case "virtual-controller--button-dpad-right":
                    this.right = isButtonPressed
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.right:", this.right)
                    break
                case "virtual-controller--button-primary":
                    this.up = isButtonPressed
                    break
                case "virtual-controller--button-select":
                    this.escape = isButtonPressed
                    break
                case "virtual-controller--button-start":
                    this.escape = isButtonPressed
                    break
                default:
                    break

            }

        }
        return false


    }

}