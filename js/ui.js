import { toCamelCase } from "./utils.js"
export default class UI {
    constructor(dataAttribute, player) {
        this.elements = this.init(dataAttribute)
        console.log(dataAttribute)
        this.bindings = {}
        // this.readoutElements = this.initReadouts
        this.score = new DataBinder("score", "textContent")
        this.scoreRemaining = new DataBinder("score-remaining", "textContent", (data) => {
            data = 5000 - this.score
            return data
        })
        this.timeRemaining = new DataBinder("time-remaining", "textContent")

        this.healthBarWidth = new DataBinder("health", "style.width", (data) => {
            data = data + "%"
            return data
        })
        this.healthBarColor = new DataBinder("health", "style.backgroundColor", (data) => {
            if (data <= 30) {
                data = "var(--clr-red)"
            }
            else if ((data > 30) && (data < 70)) {
                console.log("color change")
                data = "var(--clr-orange)"
            } else {
                data = "var(--clr-green)"
            }
            return data
        })

        this.lives = new DataBinder("lives", "textContent")
        // console.log(this)
        // this.hudScore.update("1000")


    }


    init(dataAttribute) {
        let uiDOMElements = document.querySelectorAll(`${dataAttribute}`)

        let elements = new Object()
        for (let i = 0; i < uiDOMElements.length; i++) {
            let currentElement = uiDOMElements[i]
            let elementKey = currentElement.id
            let camelCaseKey = toCamelCase(elementKey)
            elements[camelCaseKey] = currentElement

        }
        // console.log(elements)
        // console.log(typeof elements)
        return elements
    }

    show(element) {
        element.classList.remove("hidden")
        element.classList.add("block")
    }

    hide(element) {
        element.classList.add("hidden")
        element.classList.remove("block")
    }

    showUI(gameState) {
        for (let key in this.elements) {
            // console.log("in elements loop")
            // console.log(typeof this.elements[key])
            let element = this.elements[key]
            if (element.dataset !== undefined) {
                // console.log("element has dataset")
                // console.log(element.dataset)
                if (element.dataset.gamestate !== undefined) {
                    // console.log(element + "has gameState of " + element.dataset.gamestate)
                    if (element.dataset.gamestate === gameState) {
                        this.show(element)
                        element.style.display = "block"

                    } else {
                        this.hide(element)
                        element.style.display = "none"
                    }
                }
            }
        }
    }
    appendTemplate(template, container) {
        container.appendChild(template)
    }

    preloadTemplate(template) {
        return new Promise((resolve, reject) => {
            const images = template.querySelectorAll("img")
            let imagesLoaded = 0
            const totalImages = images.length

            if (totalImages === 0) {
                resolve(template)
                return
            }

            images.forEach(image => {
                const src = image.getAttribute('src')
                const img = new Image()
                img.onload = img.onerror = () => {
                    imagesLoaded++
                    if (imagesLoaded === totalImages) {
                        resolve(template)
                    }
                }
                img.src = src
            })
        })
    }

    fetchExternalTemplate(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.')
                }
                return response.text()
            })
            .then(data => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(data, 'text/html')
                const template = doc.querySelector('template')
                return document.importNode(template.content, true)
            })
            .catch(error => {
                console.error('Error loading the template:', error)
                throw error
            })
    }


}

export class DataBinder {
    constructor(elementId, attribute, formatFunction = null) {
        this.elementId = elementId
        this.attribute = attribute
        this.formatFunction = formatFunction
    }

    message(data) {

        if (data.hasOwnProperty(this.elementId)) {
            const element = document.getElementById(this.elementId)
            let value = this.formatFunction ? this.formatFunction(data[this.elementId]) : data[this.elementId]
            if (this.attribute.startsWith('style.')) {
                const styleAttribute = this.attribute.slice(6)
                element.style[styleAttribute] = value

            } else {
                element[this.attribute] = value
            }
        }
    }
}

