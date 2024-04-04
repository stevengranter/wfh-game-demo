export function drawStatusText(context, input, x, y) {
    context.font = "8px Verdana"
    context.fillText(input, x, y)
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

