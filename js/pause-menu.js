import { wait, toKebabCase } from "./utils.js"
import Observable from "./observable.js"

export class PauseMenu extends Observable {
  constructor(onComplete) {
    super()
    onComplete()
  }


  init(container) {
    this.createElement()
    container.appendChild(this.element)
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add(toKebabCase(this.constructor.name))
    this.element.innerHTML = `<header><h2>Options</h2></header>
            <ul>
              <!-- <li>
                <label for="master-volume">
                  <img
                    class="ui-icon"
                    src="./images/ui--volume-icon.svg"
                    alt="Music Volume"
                  />
                </label>
                <div class="range-container">
                  <input
                    title="master-volume"
                    type="range"
                    min="1"
                    max="100"
                    value="100"
                    class="slider"
                    id="volume-range"
                  />
                </div>
              </li> -->
              <li>
                <label for="music-volume">
                  <img
                    class="ui-icon"
                    src="./images/ui--music-icon.svg"
                    alt="Music Volume"
                  />
                </label>
                <div class="range-container">
                  <input
                    title="music-volume"
                    type="range"
                    min="1"
                    max="100"
                    value="80"
                    class="slider"
                    id="music-range"
                  />
                </div>
              </li>
              <li>
                <label for="sfx-volume">
                  <img
                    class="ui-icon"
                    src="./images/ui--sfx-icon.svg"
                    alt="Sound Effects Volume"
                /></label>
                <div class="range-container">
                  <input
                    title="sfx-volume"
                    type="range"
                    min="1"
                    max="100"
                    value="80"
                    class="slider"
                    id="sfx-range"
                  />
                </div>
              </li>
            </ul>
            <button id="resume-button" data-ui="true">Resume</button>

            <div id="stop-button">
              <div class="border">
                <button>Stop</button>
              </div>
            </div>`
    wait(200).then(() => {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") console.log("Escape Pressed")
      })
      const musicVolumeSlider = this.element.querySelector("#music-range")
      const musicElement = window.music

      musicVolumeSlider.addEventListener("input", (e) => {
        const volumeValue = e.target.value
        musicElement.volume = volumeValue / 100 // Assuming the slider range is from 0 to 100
      })
    })

  }

  close() {

  }

}