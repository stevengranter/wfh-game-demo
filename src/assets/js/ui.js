export default class UI {

    constructor(canvas) {
        this.canvas = canvas
        this.overlay = document.getElementById('overlay')
        console.log(overlay)
    }


    toggleOverlay() {
        if (this.overlay.classList.contains("hidden")) {
            this.overlay.classList.remove("hidden")
            console.log('toggleOverlay(on)')
        } else {
            this.overlay.classList.add("hidden")
            console.log('toggleOverlay(off)')
        }

    }

    show(element) {
        element.classList.remove("hidden")
    }

    hide(element) {
        element.classList.add("hidden")
    }


}