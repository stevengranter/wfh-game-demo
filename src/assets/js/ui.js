export default class UI {

    constructor(canvas) {
        this.canvas = canvas
        this.overlay = document.getElementById('game-screen__ui')
    }

    toggleOverlay() {
        if (this.overlay.style.display === 'block') {
            this.overlay.style.display = 'none'
        } else {
            this.overlay.style.display = 'block'
        }
    }
}