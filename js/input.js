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

        const gameScreen = this.ui.elements.gameScreen

        // console.log(this)

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
        // console.log("initTouches")
        // console.dir(this.ui.elements)

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
                                this.listenForPointer(e, element)
                                console.log("pointerdown")
                            })
                            break
                        case "pointerup":
                            element.addEventListener("pointerup", (e) => {
                                // e.preventDefault()
                                this.listenForPointer(e, element)
                                console.log("pointerup")
                            })
                            break

                        default:
                            console.log("No event listener added.")

                    }
                })

            }
        })
        // for (let i = 0; i < this.ui.elements.length; i++) {
        //     let currentElement = this.ui.elements[i]
        //     console.dir("helloTHERE!!")
        //     if (currentElement.dataset.events === "touches") {
        //         console.log("touches")
        //     }
        // }
    }

    listenForKeys(e) {
        let isKeyPressed = (e.type == "keydown") ? true : false

        // const previousKeyPressed = isKeyPressed

        switch (e.key) {
            case "ArrowRight":
            case "d":
            case "D":
                this.right = isKeyPressed
                console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.right:", this.right)
                break
            case "ArrowLeft":
            case "a":
            case "A":
                this.left = isKeyPressed
                console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.left:", this.left)
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ left:", this.left)
                break
            case "ArrowUp":
            case "w":
            case "W":
            case " ":
                this.up = isKeyPressed
                console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                break
            case "ArrowDown":
            case "s":
            case "S":
                this.down = isKeyPressed
                console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                break
            case "Escape":
                this.escape = isKeyPressed
                break
            default:
                break
        }
    }

    listenForPointer(e, element) {
        if (element === "gameScreen") {
            e.preventDefault()
            // console.dir(e)

            let isButtonPressed = (e.type == "pointerdown") ? true : false
            // console.log(isButtonPressed)

            switch (e.button) {
                case 0:
                    this.left = isButtonPressed
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.left:", this.left)
                    break
                case 1:
                    this.up = isButtonPressed
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.up:", this.up)
                    break
                case 2:
                    this.right = isButtonPressed
                    // console.log("🚀 ~ InputHandler ~ listenForMouse ~ this.right:", this.right)
                    break
                default:
                    break
            }
        } else {
            // console.dir(element)
            // console.dir(e)

            console.log(e.srcElement.dataset.inputType)

            let isButtonPressed = (e.type == "pointerdown") ? true : false

            switch (e.srcElement.dataset.inputType) {
                case "right":
                    this.right = isButtonPressed
                    break
                case "left":
                    this.left = isButtonPressed
                    break
                case "up":
                    this.up = isButtonPressed
                    break
                // case "escape":
                //     this.escape = isButtonPressed
                //     break
                default:
                    break
            }
        }
    }

}