export function drawStatusText(context, input) {
    context.font = "10px Verdana"
    context.fillText("last input: " + input.lastKey, 10, 20)
}