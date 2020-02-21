/*jshint esversion:6 */
const Molecule = require('./Molecule');
const { randomNum } = require('./methods');

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

    edgeSense(){
        const em = this.canvas.ecosystemMatrix;
        const xStart = this.pos.x;
        const xEnd = this.pos.x + this.size.width;
        const yStart = this.pos.y;
        const yEnd = this.pos.y + this.size.height;   

        // console.log('>', em[xStart][yStart]);

        for(let ix = xStart; ix < xEnd; ix++){
            for(let iy = yStart; iy < yEnd; iy++){
                try{
                    if(
                        em[ix  ][iy-1].orgs.some(id => id != this.id) ||
                        em[ix-1][iy-1].orgs.some(id => id != this.id) ||
                        em[ix+1][iy-1].orgs.some(id => id != this.id) 
                    ){
                        this.directionIndex.y *= -1;
                        this.collision();
                        console.log('edge event! up');
                        // console.log(this.id, em[ix][iy-1], em[ix-1][iy-1], em[ix+1][iy-1]);
                        return;
                    };
    
                    if(
                        em[ix  ][iy].orgs.some(id => id != this.id) ||
                        em[ix-1][iy].orgs.some(id => id != this.id) ||
                        em[ix+1][iy].orgs.some(id => id != this.id)
                    ){
                        this.directionIndex.x *= -1;
                        this.collision();
                        console.log('edge event! rest');
                        return;
                    };
    
                    if( 
                        em[ix  ][iy+1].orgs.some(id => id != this.id) ||
                        em[ix-1][iy+1].orgs.some(id => id != this.id) ||
                        em[ix+1][iy+1].orgs.some(id => id != this.id)
                    ){
                        this.directionIndex.y *= -1;
                        this.collision();
                        console.log('edge event! down');
                        return;
                    };
                }catch(err){

                };
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
            `mol${randomNum(1000000)}`,
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
        this.edgeSense();
        this.autoMove();
    };
};

module.exports = Org;