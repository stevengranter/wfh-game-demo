export class DebugMode {
    isOn = false
    constructor(boolean, domElement) {
        this.isOn = boolean
        this.debugPanel = domElement

    }
}