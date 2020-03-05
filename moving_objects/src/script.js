/*jshint esversion:6 */
const CanvasArea = require('./js/CanvasArea');
const Org = require('./js/Org.js');
const { randomNum } = require('./js/methods');

window.addEventListener('DOMContentLoaded', function(){
    const ecosystem = new CanvasArea({
        height: 500,
        width: 500,
        cycleTime: 100
    });    
    
    const randomOrg = () => {
        const r = randomNum(255);
        const g = randomNum(255);
        const b = randomNum(255);
        const id = `org${(new Date()).getTime()}`;
        const height = 10;
        const width = 10;
        const x = randomNum(ecosystem.width - width);
        const y = randomNum(ecosystem.height - height);

        return new Org(
            id,
            {
                height,
                width,
                speed: randomNum(30),
                color: `rgb(${r}, ${g}, ${b})`,
            }, 
            ecosystem,
            {
                x,
                y
            }
        );
    };

    for(let i = 0; i < 2; i++){
        ecosystem.fillEcosystem(randomOrg());
    };    

    ecosystem.runCycles();

    window.addEventListener('keypress', function(e){
        const keyCode = e.keyCode;
        org.moveTo(keyCode);
    });
});