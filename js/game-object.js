export default class GameObject {
    // #config
    constructor(config) {
        this.config = {}
        Object.entries(config).forEach(([key, value]) => {
            console.log(key + ":" + value)
            this.config[key] = value
        })
        // }
    }
}
