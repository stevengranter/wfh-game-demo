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
            this.updateComboDisplay(data)
        } else if (data.score !== undefined) {
            this.updateTextContent("score", data.score)
        } else if ((data.health !== undefined) && (sender === "Stats")) {
            this.updateStyleAttribute("health", "width", data.health + "%")
            this.updateStyleAttribute("health", "backgroundColor", this.numberToColorVar(data.health))
        } else if (data["time-remaining"]) {
            this.updateTextContent("time-remaining", data['time-remaining'])
        } else if (data.lives !== undefined) {
            this.updateTextContent("lives", data.lives)
        }
    }

    numberToColorVar(number) {
        if (number <= 100 && number >= 50) {
            return "var(--clr-green)"
        }
        else if (number < 50 && number >= 25) {
            return "var(--clr-orange)"
        } else {
            return "var(--clr-red)"
        }
    }

    updateTextContent(elementId, value) {
        console.log(elementId, value)
        document.getElementById(elementId).textContent = value
    }

    updateStyleAttribute(elementId, styleAttribute, value) {
        document.getElementById(elementId).style[styleAttribute] = value
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

