// utils.js
"use strict"

// function converts snake_case or kebab-case to CamelCase
export function toCamelCase(str) {
    return str.replace(/[-_]+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : ''
    })
}