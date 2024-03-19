export default class Timer {
    constructor(timeToCount) {
        this.timeToCount
        this.timer = setTimeout(function () {
            this.start
        }, 1000)

    }

    start() {
        let count = 0
        if (count < this.timeToCount) {
            count++
            console.log(count)
        }

    }



    pause() {
        clearTimeout(timer)
        counter()

    }

    resume() {
        counter()

    }


    stop() {

    }

}

let myTimer = new Timer(30)

myTimer.start()



