export function drawStatusText(context, input, x, y) {
    context.font = "8px Verdana"
    context.fillText(input, x, y)
}


export function typeWriter(elementId, text, typingDelay) {
    let index = 0
    const element = document.getElementById(elementId)

    // Clear existing text
    element.innerHTML = ''

    // Function to add characters one by one
    function addCharacter() {
        // Handle HTML tags (like <strong>)
        if (text[index] === '<') {
            let tag = ''
            do {
                tag += text[index]
                index++
            } while (text[index] !== '>' && index < text.length)
            tag += '>'
            index++
            element.innerHTML += tag
        } else {
            // Add text character
            element.innerHTML += text[index++]
        }

        // Continue the effect if there are more characters
        if (index < text.length) {
            setTimeout(addCharacter, typingDelay)
        }
    }

    // Start the typewriter effect
    addCharacter()
}

export function wait(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function toCamelCase(str) {
    return str.replace(/[-_]+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : ''
    })
}

export function toKebabCase(str) {
    return str
        // Remove all non-word characters (like punctuation) and replace with a hyphen
        .replace(/[^a-zA-Z0-9]+/g, '-')
        // Insert a hyphen before each uppercase letter (except at the start of the string)
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // Replace multiple hyphens with a single hyphen
        .replace(/-+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-+|-+$/g, '')
        // Convert the whole string to lowercase
        .toLowerCase()
}

export async function fetchJsonFile(url) {
    try {
        // Step 1: Initiating the fetch request and awaiting the response
        const response = await fetch(url)

        // Checking if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Step 2: Awaiting the parsing of the JSON body
        const data = await response.json()

        // Now 'data' contains the parsed JSON file content
        return data
    } catch (error) {
        console.error('There was a problem fetching the JSON file:', error)
    }
}



// Function to preload a single asset (image or audio)
export function preloadAsset(src) {
    return new Promise((resolve, reject) => {
        // Determine the type of asset based on file extension
        const extension = src.split('.').pop().toLowerCase()
        let element

        if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
            // If it's an image
            element = new Image()
        } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
            // If it's an audio file
            element = new Audio()
        } else {
            // Unsupported asset type
            return reject(new Error('Unsupported asset type'))
        }

        // Set up event listeners for load and error events
        element.onload = () => resolve(element)
        element.onerror = reject

        // Start loading the asset
        element.src = src
    })
}

// Function to preload all assets from the layers and music arrays
export function preloadGameAssets(assets) {
    const promises = []

    // Preload images from the layers array
    for (const layer of assets.layers) {
        promises.push(preloadAsset(layer.src))
    }

    // Preload audio files from the music array
    for (const track of assets.music) {
        promises.push(preloadAsset(track.src))
    }

    // Wait for all assets to finish preloading
    return Promise.all(promises)
}





// let blurValue = 0
// const maxBlur = 4
// const step = 0.2

export function animateBlur(currentScene, context, blurValue, maxBlur, step) {
    blurValue += step

    if (currentScene.layers !== undefined && currentScene.layers.length > 0) {
        currentScene.layers[0].filter = `blur(${blurValue}px)`
        // console.log(currentScene.layers[0].filter)
        currentScene.draw(context)

        if (blurValue < maxBlur) {
            requestAnimationFrame(() => animateBlur(currentScene, context, blurValue, maxBlur, step))
        }
    }
}




// Extract the text content from the div without child elements like <strong>

// Start the typewriter effect


// blurBackground()

