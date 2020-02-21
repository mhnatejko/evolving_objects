/*jshint esversion:6 */
const { randomNum } = require('./methods');

const defaultParams = {
    height: 1,
    width: 1,
    color: 'black'
};

const defaultCyclesProp = {
    max: 5,
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
        this.color = params.color;     
        this.cyclesProp = {
            max: cyclesProp.max,
            current: cyclesProp.current
        };
    };

    drawMolecule(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
            ( this.pos.x - (Math.floor(this.size.width / 2)) ), 
            ( this.pos.y - (Math.floor(this.size.height / 2)) ), 
            this.size.width, 
            this.size.height
        );
    };

    destroyMolecule(){
        if(this.canvas.molecules[this.id]){
            delete this.canvas.molecules[this.id];
        };
    };

    spread(){
        const spreadDirections = [
            {
                x: this.pos.x,
                y: this.pos.y - this.size.height
            }, 
            {
                x: this.pos.x + this.size.width,
                y: this.pos.y - this.size.height
            }, 
            {
                x: this.pos.x + this.size.width,
                y: this.pos.y
            }, 
            {
                x: this.pos.x + this.size.width,
                y: this.pos.y + this.size.height
            }, 
            {
                x: this.pos.x,
                y: this.pos.y + this.size.height
            }, 
            {
                x: this.pos.x - this.size.width,
                y: this.pos.y + this.size.height
            }, 
            {
                x: this.pos.x - this.size.width,
                y: this.pos.y
            }, 
            {
                x: this.pos.x - this.size.width,
                y: this.pos.y - this.size.height
            }
        ];
        const dirLens = spreadDirections.length;
        const randomDir = randomNum(dirLens);

        const molecule = new Molecule(
            `mol${randomNum(1000000)}`,
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
        if(this.cyclesProp.current >= this.cyclesProp.max) this.destroyMolecule();
    };

    colorBrightening(){        
        const rgb = this.color
            .replace('rgb', '')
            .replace('(', '')
            .replace(')', '')
            .split(',')
            .map(el => el.trim())
            .map(el => parseInt(el) + 5)
            .join(',');

        this.color = `rgb(${rgb})`;
    };

    cycle(){
        this.updateCycle();
        this.colorBrightening();
        this.spread();
        this.drawMolecule();        
    };
};

module.exports = Molecule;