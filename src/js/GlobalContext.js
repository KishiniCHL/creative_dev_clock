import Debug from "./utils/Debug"
import Size from "./utils/Size"
import Time from "./utils/Time"

let instance = null

export default class GlobalContext {
    constructor() {
        if (!!instance) return instance
        instance = this

        // Debug
        this.debug = new Debug()

        // Time
        this.time = new Time()
        this.time.on('update', () => { this.update() })

        // Size
        this.windowSize = new Size()
        this.windowSize.on('resize', () => { this.resize() })

        // Scenes
        this.scenes = []

        // Gap
        this.gap = 1; // Default gap

        // Height
        this.height = 1; // Default height

    }

    setGap(gap, isChecked) {
        if (isChecked) {
            this.gap = 0; 
        } else {
            this.gap = gap;
        }
    }

    pushScene(scene) {
        this.scenes.push(scene)
    }

    update() {
        this.scenes.forEach(s => {
            s.update()
        })
    }

    resize() {
        this.scenes.forEach(s => {
            s.resize()
        })
    }

    destroy() {
        this.time.off('update')

        this.scenes.forEach(s => {
            s.destroy()
        })

        if(this.debug.active) this.debug.ui.destroy()
    }
}