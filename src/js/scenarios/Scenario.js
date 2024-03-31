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

        const rectWidth = this.canvas.width / 6;
        const gap = this.params.gap; 
    
        const numRects = Math.floor(this.canvas.width / (rectWidth + gap));
    
        this.buildingHeights = [];
        for (let i = 0; i < numRects; i++) {
            if (i === Math.floor(numRects / 2)) {
                this.buildingHeights[i] = this.canvas.height;
            } else {
                // immeubles plus petits en hauteur par rapport a la taille du canvas
                this.buildingHeights[i] = this.canvas.height * (0.7 + Math.random() * 0.3); 
            }
        }
    
        this.drawBuildings();

        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.3;

        this.drawClock = this.drawClock.bind(this)

        this.canvas = document.getElementById(id);
        this.updateCanvasDimensions();
    
        window.addEventListener('resize', () => {
            this.updateCanvasDimensions();
            this.drawBuildings();
            this.drawClock();
        });
    }

    // quand la fenetre du navigateur est changée pour le responsive
    updateCanvasDimensions() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 * 0.3;
        this.ctx.translate(this.canvas.width / 2, this.radius);
    }

    update() {
        if (this.params['is-update']) {
            this.drawBuildings();
            this.drawClock();
        }
    }

    //Horloge

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



    //les immeubles 
    drawRectangle(xPos, rectWidth, rectHeight, rectColor) {
        this.ctx.fillStyle = rectColor;
        this.ctx.fillRect(xPos, this.canvas.height - rectHeight, rectWidth, rectHeight);
    }
    
    //les toits
    drawTriangle(xPos, rectWidth, rectHeight, triangleHeight) {
        this.ctx.beginPath();
        this.ctx.moveTo(xPos + rectWidth / 2, this.canvas.height - rectHeight - triangleHeight);
        this.ctx.lineTo(xPos, this.canvas.height - rectHeight);
        this.ctx.lineTo(xPos + rectWidth, this.canvas.height - rectHeight);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    //les fenetres des immeubles
    drawWindow(xPos, yPos, windowSize, windowColor) {
        this.ctx.fillStyle = windowColor;
        this.ctx.fillRect(xPos, yPos, windowSize, windowSize);
    }


    //assemblages des functions pour faire les immeubles
    drawBuildings() {
        this.ctx.save(); 
    
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
        const rectWidth = this.canvas.width / 6;
        const rectColor = this.params.rectColor; 
        const gap = this.params.gap; 
    
        const numRects = Math.floor(this.canvas.width / (rectWidth + gap));
        const totalGap = this.canvas.width - numRects * rectWidth;
        const actualGap = totalGap / (numRects - 1);
    
        const triangleHeight = this.canvas.height / 10; 

        //parametres des fenetres
        const windowSize = rectWidth / 4;
        const windowColor = '#edce6f'; 
    
        for (let i = 0; i < numRects; i++) {
            const xPos = i * (rectWidth + actualGap);
        
            // les hauteurs rangé dans l array du début
            const rectHeight = this.buildingHeights[i];
        
            this.drawRectangle(xPos, rectWidth, rectHeight, rectColor);
            this.drawTriangle(xPos, rectWidth, rectHeight, triangleHeight);
        

           // fenetres
            if (i !== Math.floor(numRects / 2)) {
                for (let y = this.canvas.height - rectHeight + windowSize; y < this.canvas.height - triangleHeight; y += windowSize * 2) {
                    const x1 = xPos + rectWidth / 4 - windowSize / 2;
                    const x2 = xPos + 3 * rectWidth / 4 - windowSize / 2;

                    this.drawWindow(x1, y, windowSize, windowColor);
                    this.drawWindow(x2, y, windowSize, windowColor);
                }
            }
        }
    
        this.ctx.restore(); 
    }
}