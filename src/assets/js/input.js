export default class InputHandler {

    constructor(document) {

        this.right = false
        this.left = false
        this.up = false
        this.down = false

        this.escape = false

        window.addEventListener("keydown", (e) => this.listenForKeys(e))
        window.addEventListener("keyup", (e) => this.listenForKeys(e))

        const canvas = document.getElementById("game-screen__ingame-overlay")

        canvas.addEventListener('contextmenu', event => {
            event.preventDefault()
        })
        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault()
            this.listenForMouse(e)

        })
        canvas.addEventListener("mouseup", (e) => {
            this.listenForMouse(e)

        })




        //Touch controls
        // const dPadLeft = document.getElementById("virtual-controller--button-dpad-left")
        // const dPadRight = document.getElementById("virtual-controller--button-dpad-right")


        // dPadLeft.addEventListener("touchstart", (e) => {
        //     e.preventDefault()
        //     this.lastKey = "PRESS left"
        //     // this.handleTouches(e)
        // })

        // dPadLeft.addEventListener("touchend", (e) => {
        //     // e.preventDefault()
        //     this.lastKey = "RELEASE left"

        // })


        // dPadRight.addEventListener("touchstart", (e) => {
        //     e.preventDefault()
        //     this.lastKey = "PRESS right"
        //     // this.handleTouches(e)
        // })
        // dPadRight.addEventListener("touchend", (e) => {
        //     // e.preventDefault()
        //     this.lastKey = "RELEASE right"

        // })

        // Mouse controls

        // dPadLeft.addEventListener("mousedown", (e) => {
        //     e.preventDefault()
        //     this.left = "PRESS left"

        // })
        // dPadLeft.addEventListener("mouseup", (e) => {
        //     e.preventDefault()
        //     this.lastKey = "RELEASE left"

        // })

        // dPadRight.addEventListener("mousedown", (e) => {
        //     e.preventDefault()
        //     this.lastKey = "PRESS right"

        // })
        // dPadRight.addEventListener("mouseup", (e) => {
        //     e.preventDefault()
        //     this.lastKey = "RELEASE right"

        // })



        // case "Escape":
        //     this.lastKey = "RELEASE Escape"
        //     break
        //     }
        // })





        // handleTouches(button) {
        //     if (button.touches) {
        //         console.log(button.touches)
        //     }

        // }

    }

    listenForKeys(e) {

        let isKeyPressed = (e.type == "keydown") ? true : false


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
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ left:", this.left)
                break
            case "ArrowUp":
            case "w":
            case "W":
            case " ":
                this.up = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.up:", this.up)
                break
            case "ArrowDown":
            case "s":
            case "S":
                this.down = isKeyPressed
                // console.log("🚀 ~ InputHandler ~ listenForKeys ~ this.down:", this.down)
                break
            case "Escape":
                this.escape = isKeyPressed
                break
            default:
                break
        }
    }

    listenForMouse(e) {

        e.preventDefault()
        // console.dir(e)

        let isButtonPressed = (e.type == "mousedown") ? true : false
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
    }



    handleTouches(event) {
        // console.log(event)
    }
}