import GlobalContext from "../GlobalContext"
import Scene from "../canvas/Scene"
// import DomElement from "../utils/DomElement"


export default class Scenario extends Scene {
    constructor(id = 'canvas-scene') {
        super(id)
    
        this.id = id
        this.globalContext = new GlobalContext()
        this.globalContext.pushScene(this)
    
        this.canvas = document.getElementById(id);
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    
        this.ctx = this.canvas.getContext('2d');
        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.4;
        this.ctx.translate(this.canvas.width / 2, this.radius);
    
        this.drawRectangle();

        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.3;

        this.drawClock = this.drawClock.bind(this)

        this.canvas = document.getElementById(id);
        this.updateCanvasDimensions();
    
        window.addEventListener('resize', () => {
            this.updateCanvasDimensions();
            this.drawRectangle();
            this.drawClock();
        });
    }

    updateCanvasDimensions() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.3;
        this.ctx.translate(this.canvas.width / 2, this.radius);
    }

    update() {
        if (this.params['is-update']) {
            this.drawRectangle();
            this.drawClock();
        }
    }

    drawClock() {

        const grad = this.ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "white";
        this.ctx.fill();


        this.ctx.lineWidth = this.radius * 0.04;
        this.ctx.stroke();

        for(let sec = 0 ; sec < 60 ; sec++) {
            let angle = (sec * Math.PI / 30);
            let x = this.radius * Math.cos(angle);
            let y = this.radius * Math.sin(angle);
            let x2, y2;

            if(sec % 5 == 0) {
                x2 = (this.radius * 0.85) * Math.cos(angle);
                y2 = (this.radius * 0.85) * Math.sin(angle);
                this.ctx.lineCap = 'round'; 

                this.ctx.strokeStyle = '#9f72d6';
                this.ctx.lineWidth = this.radius * 0.02;
                
            } else {
                x2 = (this.radius * 0.92) * Math.cos(angle);
                y2 = (this.radius * 0.92) * Math.sin(angle);
                this.ctx.lineCap = 'round'; 

                this.ctx.strokeStyle = '#346991';
                this.ctx.lineWidth = this.radius * 0.02;
            }
            

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
            
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();


    }

    drawRectangle() {
        this.ctx.save(); 
    
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
        const rectWidth = this.canvas.width / 6;
        const rectColor = this.params.rectColor; 
        const gap = this.params.gap; 
    
        const numRects = Math.floor(this.canvas.width / (rectWidth + gap));
        const totalGap = this.canvas.width - numRects * rectWidth;
        const actualGap = totalGap / (numRects - 1);
    
        for (let i = 0; i < numRects; i++) {
            const xPos = i * (rectWidth + actualGap);
    
            let rectHeight;
            if (i === Math.floor(numRects / 2)) {
                rectHeight = this.canvas.height;
            } else {
                rectHeight = ((Math.sin(i) + 1) / 2) * this.canvas.height;
            }
    
            this.ctx.fillStyle = rectColor;
            this.ctx.fillRect(xPos, this.canvas.height - rectHeight, rectWidth, rectHeight);
        }
    
        this.ctx.restore(); 
    }
}