/*jshint esversion:6 */
const { randomNum } = require('./methods');

const defaultParams = {
    height: 1,
    width: 1,
    color: 'black'
};

const defaultCyclesProp = {
    max: 12,
    current: 0
};

class Molecule{
    constructor(id, canvas, params = defaultParams, position, cyclesProp = defaultCyclesProp){
        this.id = id;
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        this.pos = position;
        // this.params = { ...defaultParams, ...params };
        this.params = params;
        this.size = {
            height: params.height,
            width: params.width
        };
        this.maxPos = {
            x: canvas.width - this.size.width,
            y: canvas.height - this.size.height
        };
        this.color = params.color;     
        this.cyclesProp = {
            max: cyclesProp.max,
            current: cyclesProp.current
        };
        this.spreadCount = 0;
    };

    drawMolecule(){
        this.ctx.fillStyle = this.color;
        let xPos = this.pos.x - (Math.floor(this.size.width / 2));
        let yPos = this.pos.y - (Math.floor(this.size.height / 2));

        if(xPos > this.maxPos.x){
            this.pos.x = this.maxPos.x;
            xPos = this.maxPos.x;
        };
        
        if(xPos < 0){
            this.pos.x = 0;
            xPos = 0;
        };

        if(yPos > this.maxPos.y){
            this.pos.y = this.maxPos.y;
            yPos = this.maxPos.y;
        };

        if(yPos < 0){
            this.pos.y = 0;
            yPos = 0;
        };

        this.ctx.fillRect(
            xPos, 
            yPos, 
            this.size.width, 
            this.size.height
        );
    };

    destroyMolecule(){
        if(this.canvas.molecules[this.id]) delete this.canvas.molecules[this.id];
    };

    spread(){
        this.spreadCount++;
        const height = this.size.height * randomNum(3);
        const width = this.size.width * randomNum(3);

        const spreadDirections = [
            {
                x: this.pos.x,
                y: this.pos.y - height
            }, 
            {
                x: this.pos.x + width,
                y: this.pos.y - height
            }, 
            {
                x: this.pos.x + width,
                y: this.pos.y
            }, 
            {
                x: this.pos.x + width,
                y: this.pos.y + height
            }, 
            {
                x: this.pos.x,
                y: this.pos.y + height
            }, 
            {
                x: this.pos.x - width,
                y: this.pos.y + height
            }, 
            {
                x: this.pos.x - width,
                y: this.pos.y
            }, 
            {
                x: this.pos.x - width,
                y: this.pos.y - height
            }
        ];
        const dirLens = spreadDirections.length;
        const randomDir = randomNum(dirLens);

        const molecule = new Molecule(
            `${this.id}_${(new Date()).getTime()}`,
            this.canvas, 
            { 
                height: this.size.height,
                width: this.size.width,
                color: this.color 
            },
            spreadDirections[randomDir],
            {
                current: this.cyclesProp.current,
                max: this.cyclesProp.max,
            }
        );
        this.canvas.fillMolecules(molecule);
        
        
        // spreadDirections.forEach(dir => {
        //     const molecule = new Molecule(
        //         `mol${randomNum(1000000)}`,
        //         this.canvas, 
        //         { 
        //             height: this.size.height,
        //             width: this.size.width,
        //             color: this.color 
        //         },
        //         dir,
        //         {
        //             current: this.cyclesProp.current,
        //             max: this.cyclesProp.max,
        //         }
        //     );
        //     this.canvas.fillMolecules(molecule);
        // });
    };

    updateCycle(){
        this.cyclesProp.current += 1;        
    };

    colorBrightening(){        
        const rgb = this.color
            .replace('rgb', '')
            .replace('(', '')
            .replace(')', '')
            .split(',')
            .map(el => el.trim())
            .map(el => parseInt(el) + 30)
            .join(',');

        this.color = `rgb(${rgb})`;
    };

    cycle(){
        this.updateCycle();
        if(this.cyclesProp.current >= this.cyclesProp.max){
            this.destroyMolecule();
        }else{
            if(this.spreadCount <= 4 ) this.spread();
            this.drawMolecule();                
            this.colorBrightening();
        };
    };
};

module.exports = Molecule;