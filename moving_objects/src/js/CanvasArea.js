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

        this.cycleTime = params.cycleTime;
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
                    molecules: [],
                    orgs: []
                });
            };
        };
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
        for(let key in this.molecules){
            const molecule = this.molecules[key];

            const xStart = molecule.pos.x;
            const xEnd = molecule.pos.x + molecule.size.width;
            const yStart = molecule.pos.y;
            const yEnd = molecule.pos.y + molecule.size.height;   
            
            for(let ix = xStart; ix < xEnd; ix++){
                for(let iy = yStart; iy < yEnd; iy++){
                    try{
                        this.ecosystemMatrix[ix][iy].molecules.push(molecule.id);
                    }catch(err){
                        // console.log(ix, iy);
                    }
                };
            };
        };
    };

    resetCanvas(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    runCycles(){
        // const orgsID = this.orgs.reduce((arr, org) => [ ...arr, org.id ], []);
        // console.log(orgsID);
        setInterval(() => {
            this.resetCanvas();
            this.matrixGen();
            this.fillMatrix();
// check if all malecules numbers are same
            // const moleculesKeys = Object.keys(this.molecules);
            // const moleculesGroups = orgsID
            //     .map(id => moleculesKeys.filter(key => key.includes(id)))
            //     .map(arr => arr.length)
            //     .every((el, i, arr) => el === arr[0]);
            // console.log( moleculesGroups );
                       
            for(let key in this.molecules){
                this.molecules[key].cycle();
            };
            this.orgs.forEach(org => org.cycle());

        }, this.cycleTime);
    };
    
};

module.exports = CanvasArea;
