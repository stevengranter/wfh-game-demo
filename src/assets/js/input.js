export default class InputHandler {
    constructor() {
        this.lastKey = ""

        //  Mouse controls
        window.addEventListener('contextmenu', event => {
            event.preventDefault()
        })
        window.addEventListener("mousedown", (e) => {
            let log = document.querySelector("#log")
            switch (e.button) {
                case 0:
                    this.lastKey = "PRESS left"
                    break
                case 1:
                    this.lastKey = "PRESS up"
                    break
                case 2:
                    this.lastKey = "PRESS right"
                    break
                default:
                    log.textContent = `Unknown button code: ${e.button}`
            }
        })

        window.addEventListener("mouseup", (e) => {
            let log = document.querySelector("#log")
            switch (e.button) {
                case 0:
                    this.lastKey = "RELEASE left"
                    break
                case 1:
                    this.lastKey = "RELEASE up"
                    break
                case 2:
                    this.lastKey = "RELEASE right"
                    break
                default:
                    log.textContent = `Unknown button code: ${e.button}`
            }
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


    }
}