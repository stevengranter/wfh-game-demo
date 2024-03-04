export function drawStatusText(context, input, x, y) {
    context.font = "10px Verdana"
    context.fillText(input, x, y)
}

export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}