/*jshint esversion:6 */
const Molecule = require('./Molecule');
const { randomNum } = require('./methods');
const followByMolecules = require('./followByMoleculesMethods');

const defaultArrows = {
    up: 119,
    down: 115,
    left: 97,
    right: 100
};  

const defaultPos = {
    x: 1,
    y: 1
};

class Org{
    constructor(id, params, canvas, pos = defaultPos, arrows = defaultArrows){
        this.id = id;
        this.pos = pos;
        this.size = {
            height: params.height,
            width: params.width
        };
        this.maxPos = {
            x: canvas.width - this.size.width,
            y: canvas.height - this.size.height
        };
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        this.speed = params.speed;
        this.speedDir = {
            x: Math.round(this.speed / 2),
            y: Math.round(this.speed / 2)
        };
        this.directionIndex = {
            x: 1,
            y: 1
        };
        this.color = params.color;
        this.arrows = arrows;

        this.moveTo();
    };

    collision(){
        // console.log('colission !');
        const dirX = randomNum(this.speed);
        this.speedDir.x = dirX; 
        this.speedDir.y = (this.speed - dirX);
    };

    detectMolecule(){
        const em = this.canvas.ecosystemMatrix;
        const xStart = this.pos.x - 1;
        const xEnd = this.pos.x + this.size.width + 1;
        const yStart = this.pos.y - 1;
        const yEnd = this.pos.y + this.size.height + 1;

        let detectedOrgKey = null;

        for(let x = xStart; x < xEnd; x++){
            for(let y = yStart; y < yEnd; y++){
                if(
                    em[x] &&
                    em[x][y] &&
                    em[x+1] &&
                    em[x][y+1] &&
                    em[x-1] &&
                    em[x][y-1]
                ){
                    const mols = em[x][y].molecules
                        .filter(id => !id.includes(this.id));
                    if(mols.length > 0){
                        detectedOrgKey = mols[0]
                            .split('_')
                            .filter(part => part.includes('org'))[0];
                        // console.log(detectedOrgKey);
                        const newDir = followByMolecules(
                            { 
                                x: this.pos.x, 
                                y: this.pos.y, 
                                w: this.size.width, 
                                h: this.size.height
                            },
                            this.canvas.ecosystemMatrix,
                            this.canvas.molecules,
                            detectedOrgKey
                        );
                        if(newDir.newXSpeedDir){                           
                            this.speedDir.x = Math.floor(this.speed * newDir.newXSpeedDir);
                            this.speedDir.y = this.speed - this.speedDir.x;
                        };
                        if(newDir.newYSpeedDir){
                            this.speedDir.y = Math.floor(this.speed * newDir.newYSpeedDir);
                            this.speedDir.x = this.speed - this.speedDir.y;
                        }
                        break;
                    }
                }
            };
        };

        


        // try{
        //     if(
        //         em[ix  ][iy-1].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix-1][iy-1].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix+1][iy-1].molecules.some(id => !id.includes(this.id)) ||
    
        //         em[ix  ][iy  ].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix-1][iy  ].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix+1][iy  ].molecules.some(id => !id.includes(this.id)) ||
    
        //         em[ix  ][iy+1].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix-1][iy+1].molecules.some(id => !id.includes(this.id)) ||
        //         em[ix+1][iy+1].molecules.some(id => !id.includes(this.id))
        //     ){
                
        //         console.log('MOLECULE!');
        //     };
        // }catch(err){
        //     console.log('out of field');
        // }
    };

    bounceOff(em, ix, iy){
        try{
            if(
                em[ix  ][iy-1].orgs.some(id => id != this.id) ||
                em[ix-1][iy-1].orgs.some(id => id != this.id) ||
                em[ix+1][iy-1].orgs.some(id => id != this.id) 
            ){
                this.directionIndex.y *= -1;
                this.collision();
                // console.log('edge event! up');
                // console.log(this.id, em[ix][iy-1], em[ix-1][iy-1], em[ix+1][iy-1]);
                return;
            };

            if(
                em[ix  ][iy  ].orgs.some(id => id != this.id) ||
                em[ix-1][iy  ].orgs.some(id => id != this.id) ||
                em[ix+1][iy  ].orgs.some(id => id != this.id)
            ){
                this.directionIndex.x *= -1;
                this.collision();
                // console.log('edge event! rest');
                return;
            };

            if( 
                em[ix  ][iy+1].orgs.some(id => id != this.id) ||
                em[ix-1][iy+1].orgs.some(id => id != this.id) ||
                em[ix+1][iy+1].orgs.some(id => id != this.id)
            ){
                this.directionIndex.y *= -1;
                this.collision();
                // console.log('edge event! down');
                return;
            };
        }catch(err){

        };
    }

    edgeSense(){
        const em = this.canvas.ecosystemMatrix;
        const xStart = this.pos.x;
        const xEnd = this.pos.x + this.size.width;
        const yStart = this.pos.y;
        const yEnd = this.pos.y + this.size.height;   

        // console.log('>', em[xStart][yStart]);

        for(let ix = xStart; ix < xEnd; ix++){
            for(let iy = yStart; iy < yEnd; iy++){
                // this.detectMolecule(em, ix, iy);
                this.bounceOff(em, ix, iy);
            };
        };
    };

    checkCollision(cbX, cbY){
        if(this.pos.x <= 0){
            this.pos.x = 0;
            cbX();
            this.collision();
        };
        if(this.pos.x >= this.maxPos.x){
            this.pos.x = this.maxPos.x;
            cbX();
            this.collision();
        };
        if(this.pos.y <= 0){
            this.pos.y = 0;
            cbY();
            this.collision();
        };
        if(this.pos.y >= this.maxPos.y){
            this.pos.y = this.maxPos.y;
            cbY();
            this.collision();
        };       
    };

    setPos(keyCode){
        switch(keyCode){
            case this.arrows.up:
                this.pos.y -= this.speed;
                if(this.pos.y <= 0){
                    this.pos.y = 0;
                    this.collision();
                };
                break;
            case this.arrows.down:
                this.pos.y += this.speed;
                if(this.pos.y >= this.maxPos.y){
                    this.pos.y = this.maxPos.y;
                    this.collision();
                };
                break;
            case this.arrows.left:
                this.pos.x -= this.speed;
                if(this.pos.x <= 0){
                    this.pos.x = 0;
                    this.collision();
                };
                break;
            case this.arrows.right:
                this.pos.x += this.speed;
                if(this.pos.x >= this.maxPos.x){
                    this.pos.x = this.maxPos.x;
                    this.collision();
                };
                break;
            default:
                break;
        }
    };

    manualMove(){

    };

    autoMove(){       
        this.pos.x += (this.directionIndex.x * this.speedDir.x);
        this.pos.y += (this.directionIndex.y * this.speedDir.y);
        this.checkCollision(
            () => this.directionIndex.x *= -1,
            () => this.directionIndex.y *= -1,
        );
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    };

    moveTo(keyCode){
        this.setPos(keyCode)
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    };

    randomMove(){
        const arrowKeys = Object.keys(this.arrows);
        const i = randomNum(arrowKeys.length);
        const keyCode = arrowKeys[i];
        this.moveTo(this.arrows[keyCode]);
    };

    leaveMolecule(){
        const molecule = new Molecule(
            `mol${(new Date()).getTime()}_${this.id}`,
            this.canvas, 
            { 
                height: 2,
                width: 2,
                color: this.color 
            },
            { 
                x: this.pos.x + (Math.floor(this.size.width / 2)),
                y: this.pos.y + (Math.floor(this.size.height / 2))
            }
        );
        this.canvas.fillMolecules(molecule);
    };

    cycle(){
        this.leaveMolecule();
        // if(randomNum(10) == 5) this.leaveMolecule();
        this.detectMolecule();
        this.edgeSense();
        this.autoMove();
    };
};

module.exports = Org;