"use strict"

import { toCamelCase } from "./utils.js"
export default class UI {
    constructor(dataAttributes, player) {
        this.init(dataAttributes)
        this.elements = this.uiElements // FIX: for older code that references elements property

    }

    init(dataAttributes) {
        dataAttributes.forEach((attribute) => {
            // console.log(attribute)

            let uiDOMElements = document.querySelectorAll(`[${attribute}="true"]`)

            let elements = new Object()
            for (let i = 0; i < uiDOMElements.length; i++) {
                let currentElement = uiDOMElements[i]
                let elementKey = currentElement.id
                let camelCaseKey = toCamelCase(elementKey)
                elements[camelCaseKey] = currentElement

            }

            // console.log(elements)
            // console.log(typeof elements)
            let propertyName = this.convertDataAttribute(attribute)
            this[propertyName] = elements
            // console.log(this)
            return elements

        })

    }


    receiveUpdate(data, sender) {

        console.log(sender + " sent data: ")
        console.log(data)
        // Checking for undefined here instead of falsey values, as we want to 
        // still update if the value is equal to 0
        if (data.comboCounter !== undefined) {
            // console.log(data)
            this.updateComboDisplay(data)
        } else
            this.processUpdate(data)
    }

    processUpdate(data, sender) {

        Object.entries(data).forEach(([key, value]) => { // Destructure the [key, value] pair
            // console.log(key, value)
            this.updateUI(key, value)
        })
    }

    updateUI(key, value) {
        let elementId = key
        try {
            const element = document.getElementById(elementId)
        } catch {
            console.warn("No DOM element with ID: " + elementId)
        }
        // helper functions to convert values to colors, width, etc.
        const numberToColorVar = (number) => {
            if (number <= 100 && number >= 50) {
                return "var(--clr-green)"
            }
            else if (number < 50 && number >= 25) {
                return "var(--clr-orange)"
            } else {
                return "var(--clr-red)"
            }
        }

        try {
            const element = document.getElementById(elementId)
            // console.log(element)
            if (element) {
                let styleAttributes = element.getAttribute('data-style-attributes')
                let elementAttribute = element.getAttribute('data-element-attribute')
                if (styleAttributes) {
                    // Split the string into an array by commas
                    let attributesArray = styleAttributes.split(',').map(attribute => attribute.trim())
                    // console.log(attributesArray)
                    attributesArray.forEach((attribute) => {
                        if (attribute.includes("olor")) { // using 'olor' to include "Color" or "color" in the attribute
                            // console.log("attribute includes color")
                            element.style[attribute] = numberToColorVar(value)

                        }
                        if (attribute.includes("idth")) { // using 'idth' to include "width" or "Width" in the attribute
                            // console.log("attribute includes width")
                            element.style[attribute] = value + "%"
                        }
                    })
                }
                if (elementAttribute) {
                    element[elementAttribute] = value
                    // console.dir(element)
                }
            }
            else {
                // If no element was found, issue warning
                console.warn("No element with id: ", elementId)
            }
        } catch (error) {
            // Log the error message
            console.error("Error updating the UI for element id:", elementId, error)
        }
    }



    updateComboDisplay(data) {
        if (data.comboCounter > 0 && data.comboCounter <= 5) {
            for (let i = 1; i <= data.comboCounter; i++) {
                let nthChildSelector = `:nth-child(${i})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = this.elements.hudCombo.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-sky-blue)"
                letter.style.opacity = "100%"
            }
        } else if (data.comboCounter > 5 && data.comboCounter <= 10) {
            for (let i = 6; i <= data.comboCounter; i++) {
                let nthChildSelectorIndex = i - 5
                let nthChildSelector = `:nth-child(${nthChildSelectorIndex})`
                let nthChildSelectorString = nthChildSelector.toString()
                // console.log(nthChildSelectorString)
                let letter = this.elements.hudCombo.querySelector(nthChildSelectorString)
                // console.dir(letter)
                letter.style.color = "var(--clr-purple)"
                letter.style.opacity = "100%"
            }
        } else if (data.comboCounter <= 0) {
            // console.log("combo counter UI should reset")
            let letters = this.elements.hudCombo.querySelectorAll("span")
            letters.forEach((letter) => {
                letter.style.color = ""
                letter.style.opacity = "50%"
            })
        }
    }




    convertDataAttribute(attribute) {
        // Remove 'data-' prefix and split the remaining string by '-'
        let parts = attribute.replace('data-', '').split('-')

        // Capitalize the first letter of each part after the first one
        for (let i = 1; i < parts.length; i++) {
            parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1)
        }

        // Join all parts together and append '-elements' at the end
        return parts.join('') + 'Elements'
    }

    show(element) {
        element.classList.remove("hidden")
        element.classList.add("block")
    }

    hide(element) {
        element.classList.add("hidden")
        element.classList.remove("block")
    }

    toggleUI(gameState, isActive = true) {
        for (let key in this.elements) {
            // console.log("in elements loop")
            // console.log(typeof this.elements[key])
            let element = this.elements[key]
            if (element.dataset !== undefined) {
                // console.log("element has dataset")
                // console.log(element.dataset)
                if (element.dataset.gamestate !== undefined) {
                    // console.log(element + "has gameState of " + element.dataset.gamestate)
                    if (element.dataset.gamestate === gameState && isActive === true) {
                        this.show(element)
                        // element.style.display = "block"

                    } else {
                        this.hide(element)
                        // element.style.display = "none"
                    }
                }
            }
        }
    }




}

