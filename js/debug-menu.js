export class DebugMenu {
    constructor() {
        this.isVisible = false
        this.watchVariables = {}
        this.menuElement = document.getElementById('debug-menu--container')
    }

    toggleVisibility() {
        this.isVisible = !this.isVisible
        this.menuElement.style.display = this.isVisible ? 'block' : 'none'
    }

    watch(variableName, getVariableValueFunc) {
        this.watchVariables[variableName] = getVariableValueFunc
    }

    update() {
        // Clear current content
        this.menuElement.innerHTML = ''

        // Add updated values to the debug menu
        for (const [name, getter] of Object.entries(this.watchVariables)) {
            const valueElement = document.createElement('div')
            valueElement.textContent = `${name}: ${getter()}`
            this.menuElement.appendChild(valueElement)
        }
    }
}


