/* constants that do not, or should not change 
declared instead of passing objects (like canvas) around
just to obtain fixed and unchanging values */

export const CANVAS_WIDTH = 475
export const CANVAS_HEIGHT = 270

export const CANVAS = document.getElementById("game-screen__canvas")
export const CTX = CANVAS.getContext("2d")
