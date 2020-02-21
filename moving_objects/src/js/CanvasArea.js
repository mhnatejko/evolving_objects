/*jshint esversion:6 */
const { arrGen } = require('./methods');

class CanvasArea {
    constructor(params){
        this.canvas = document.getElementById('canvas');
        this.height = params.height;
        this.width = params.width;
        this.canvas.setAttribute('height', this.height.toString());
        this.canvas.setAttribute('width', this.width.toString());
        this.ctx = canvas.getContext('2d');

        this.cycleTime = 200;
        this.ecosystemMatrix = [];
        this.orgs = [];
        this.molecules = {};
        this.matrixGen();
        this.fillMatrix();
    };

    fillEcosystem(obj){
        this.orgs.push(obj);
    };

    fillMolecules(molecule){
        // this.molecules.push(molecule);
        this.molecules[molecule.id] = molecule;
    };

    matrixGen(){
        this.ecosystemMatrix = []
        for(let x = 0; x < this.width; x++){
            this.ecosystemMatrix.push([]);
            for(let y = 0; y < this.height; y++){
                this.ecosystemMatrix[x].push({
                    // cell_id: `${x}/${y}`,
                    orgs: []
                });
            };
        };


        // this.ecosystemMatrix = arrGen(
        //     this.width, 
        //     arrGen(
        //         this.height, 
        //         { orgs: [] }
        //     )
        // );
    };

    fillMatrix(){
        this.orgs.forEach(org => {
            const xStart = org.pos.x;
            const xEnd = org.pos.x + org.size.width;
            const yStart = org.pos.y;
            const yEnd = org.pos.y + org.size.height;   
            
            for(let ix = xStart; ix < xEnd; ix++){
                for(let iy = yStart; iy < yEnd; iy++){
                    // console.log(this.ecosystemMatrix[ix][iy]);
                    // console.log(this.ecosystemMatrix[0][0]);
                    
                    // if(!(this.ecosystemMatrix[ix][iy].orgs instanceof Array)){
                    //     this.ecosystemMatrix[ix][iy].orgs = []; 
                    //     this.ecosystemMatrix[ix][iy].orgs.push(org.id);                      
                    // }else{
                    //     this.ecosystemMatrix[ix][iy].orgs.push(org.id);
                    // };
                    this.ecosystemMatrix[ix][iy].orgs.push(org.id);
                };
            };
        });
        // this.molecules.forEach(el => {

        // })
    };

    resetCanvas(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    runCycles(){
        setInterval(() => {
            this.resetCanvas();
            this.matrixGen();
            this.fillMatrix();
            
            // this.molecules.forEach(molecule => molecule.cycle());
           
            for(let key in this.molecules){
                this.molecules[key].cycle();
            };
            this.orgs.forEach(org => org.cycle());
        }, this.cycleTime);
    };
    
};

module.exports = CanvasArea;
