import GlobalContext from "../GlobalContext"
import DomElement from "../utils/DomElement"

export default class Scene {
    constructor(id = "canvas-scene") {
        this.id = id
        this.globalContext = new GlobalContext()
        this.globalContext.pushScene(this)

        // debug
        this.params = {
            'is-update': true,
            'buildingColor': '#000000',
            'morning': false,
            'afternoon': false,
            'evening': false,
            'night': false,
            'digitsColor' : '#2e1b4a',
            'smallLinesColor': '#346991',
            'bigLinesColor': '#d9669d',
            'smallHandColor': '#5e5bc9',
            'bigHandColor': '#1b1b29',
            'secondHandColor': '#c95b78',
            'roundColor': '#333'
        }
        this.debug = this.globalContext.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(this.id)
            this.debugFolder.add(this.params, 'is-update')
            this.debugFolder.addColor(this.params, 'buildingColor')
            this.debugFolder.add(this.params, 'morning')
            this.debugFolder.add(this.params, 'afternoon')
            this.debugFolder.add(this.params, 'evening')
            this.debugFolder.add(this.params, 'night')
            this.debugFolder.addColor(this.params, 'digitsColor')
            this.debugFolder.addColor(this.params, 'smallLinesColor')
            this.debugFolder.addColor(this.params, 'bigLinesColor')
            this.debugFolder.addColor(this.params, 'smallHandColor')
            this.debugFolder.addColor(this.params, 'bigHandColor')
            this.debugFolder.addColor(this.params, 'secondHandColor')
            this.debugFolder.addColor(this.params, 'roundColor')
        }

        // canvas
        this.domElement = new DomElement(id)
        this.canvas = this.domElement.instance
        this.context = this.canvas.getContext('2d')
        this.resize()
    }

    get width() { return this.domElement.width }
    get height() { return this.domElement.height }
    get postion() { return this.domElement.position }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    update() {
        return this.params['is-update']
    }

    resize() {
        this.domElement.setSize()
        this.canvas.width = this.domElement.width * this.globalContext.windowSize.pixelRatio
        this.canvas.height = this.domElement.height * this.globalContext.windowSize.pixelRatio
        this.context.scale(this.globalContext.windowSize.pixelRatio, this.globalContext.windowSize.pixelRatio)
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6) {
            return 'night';
        } else if (hour < 12) {
            return 'morning';
        } else if (hour < 18) {
            return 'afternoon';
        } else {
            return 'evening';
        }
    }

    destroy() { }
}