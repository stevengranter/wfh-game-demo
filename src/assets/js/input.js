export default class InputHandler {




    constructor(document) {
        this.lastKey = ""
        // const virtualButtons = document.querySelectorAll(".touchable")
        // const buttonsArray = Array.from(virtualButtons)
        // buttonsArray[0].addEventListener("touchstart", (e) => {
        //     console.log("touchstart")
        // })




        //Touch controls
        const dPadLeft = document.getElementById("virtual-controller--button-dpad-left")
        const dPadRight = document.getElementById("virtual-controller--button-dpad-right")


        dPadLeft.addEventListener("touchstart", (e) => {
            e.preventDefault()
            this.lastKey = "PRESS left"
            // this.handleTouches(e)
        })

        dPadLeft.addEventListener("touchend", (e) => {
            e.preventDefault()
            this.lastKey = "RELEASE left"

        })


        dPadRight.addEventListener("touchstart", (e) => {
            e.preventDefault()
            this.lastKey = "PRESS right"
            // this.handleTouches(e)
        })
        dPadRight.addEventListener("touchend", (e) => {
            e.preventDefault()
            this.lastKey = "RELEASE right"

        })

        // Mouse controls

        dPadLeft.addEventListener("mousedown", (e) => {
            e.preventDefault()
            this.lastKey = "PRESS left"

        })
        dPadLeft.addEventListener("mouseup", (e) => {
            e.preventDefault()
            this.lastKey = "RELEASE left"

        })

        dPadRight.addEventListener("mousedown", (e) => {
            e.preventDefault()
            this.lastKey = "PRESS right"

        })
        dPadRight.addEventListener("mouseup", (e) => {
            e.preventDefault()
            this.lastKey = "RELEASE right"

        })


        // Keyboard controls
        window.addEventListener("keydown", (e) => {
            // console.log(e.key)
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "PRESS left"
                    break
                case "ArrowRight":
                    this.lastKey = "PRESS right"
                    break
                case "ArrowUp":
                    this.lastKey = "PRESS up"
                    break
                case " ":
                    this.lastKey = "PRESS up"
                    break
                case "ArrowDown":
                    this.lastKey = "PRESS down"
                    break
                case "Shift":
                    this.lastKey = "PRESS shift"
                    break
                case "Escape":
                    this.lastKey = "PRESS Escape"
                    break
                default:
                    break
            }

        })

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "RELEASE left"
                    break
                case "ArrowRight":
                    this.lastKey = "RELEASE right"
                    break
                case "ArrowUp":
                    this.lastKey = "RELEASE up"
                    break
                case " ":
                    this.lastKey = "RELEASE up"
                    break
                case "ArrowDown":
                    this.lastKey = "RELEASE down"
                    break
                case "Shift":
                    this.lastKey = "RELEASE shift"
                    break
                default:
                    break

                // case "Escape":
                //     this.lastKey = "RELEASE Escape"
                //     break
            }
        })





        // handleTouches(button) {
        //     if (button.touches) {
        //         console.log(button.touches)
        //     }

        // }

    }

    handleTouches(event) {
        console.log(event)
    }
}