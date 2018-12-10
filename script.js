externResource = 100; //available source of food/energy
populationSize = 100; //limit of organism units in population
mutability = 100; //probability of mutation 1: mutability (1:10 = 10%)
mutationUnit = 1;

defaultSetup = {
    id: '0', //id inherit form parent unit (created by add parent own id value and childNumber value) id = parent.id + parent.childNumber
    parentId: null,
    childNumber: 0, //to create unique id of child, raise avery multiplication
    age: 0, //raise every cycle - necessary for canLive() and canMultiplying() testing functions
    mutationCount: 0, //summary of all mutations in ancestry line
    supply: 1, //stored food/energy units
    
    feedUnit: 1,  //mutable --units of food/energy uptake from externResource
    supplyLimit: 5, //mutable --min amount of supplies (for multiplication)
    lifeLimit: 10, //mutable --max age (living) - count in cycles (for multiplication and living)
    multiplicationLifeLimit: 4, //mutable --min age for multiplication
    multiplyCost: 1, //mutable --amount of supply give to child
}

function Organism(setup = defaultSetup){
    this.setup = {...defaultSetup, ...setup};
    this.id = this.setup.id;
    this.parentId = this.setup.parentId,
    this.childNumber = this.setup.childNumber;
    this.age = this.setup.age;
    this.mutationCount = this.setup.mutationCount;
    this.supply = this.setup.supply;
    
    this.feedUnit = this.setup.feedUnit;
    this.supplyLimit = this.setup.supplyLimit;
    this.lifeLimit = this.setup.lifeLimit;
    this.multiplicationLifeLimit = this.setup.multiplicationLifeLimit;
    this.multiplyCost = this.setup.multiplyCost;    
}

Organism.prototype.older = function(){
    this.age += 1
};

//---livin & dying
Organism.prototype.canLive = function(){
    if(this.age >= this.lifeLimit){
        this.dying()
    } else {        
        this.eating();
        this.canMutate();
        this.canMultiply();
    }
}

Organism.prototype.dying = function(){
    externResource += this.supply; //return food/energy to global source
    population = population.filter(el => el.id !== this.id); //removing from population
}

Organism.prototype.eating = function(){
    if(externResource >= this.feedUnit){
        externResource -= this.feedUnit; 
        this.supply += this.feedUnit;
    }
};

//---mutation
mutable = ['feedUnit', 'supplyLimit', 'lifeLimit', 'multiplicationLifeLimit', 'multiplyCost']; //properties possible to mutation

Organism.prototype.canMutate = function(){  
    if(this.age === 1){ //only new organism instantion can get mutation - it means 1x mutation per organism (for easier render heredity tree)
        val = Math.floor(Math.random() * mutability);
        if(val === 0) this.mutation();
    }  
}

Organism.prototype.mutation = function(){
    mutatedProperty = mutable[Math.floor(Math.random() * mutable.length)];
    mutationTrend = Math.floor(Math.random() * 2); //raise or decrese
    if(mutationTrend === 0){
        this[mutatedProperty] -= mutationUnit >= 0 ? this[mutatedProperty] -= mutationUnit : 0;
    }else{
        this[mutatedProperty] += mutationUnit;
    }
    this.mutationCount ++;

    //console.log('--m!--', this.id, this.mutationCount, mutatedProperty, mutationTrend)
}

//---multiplying
Organism.prototype.canMultiply = function(){
    if(this.supply >= this.supplyLimit && this.age >= this.multiplicationLifeLimit) this.multiplying();
};

Organism.prototype.multiplying = function(){
    population.push(new Organism({
        id: `${this.id}-${this.childNumber}`, 
        parentId: this.id,
        supply: this.multiplyCost,
        mutationCount: this.mutationCount,

        feedUnit: this.feedUnit,
        supplyLimit: this.supplyLimit,
        lifeLimit: this.lifeLimit,
        multiplicationLifeLimit: this.multiplicationLifeLimit,
        multiplyCost: this.multiplyCost        
    }));
    this.supply -= this.multiplyCost;
    this.childNumber ++;
}

//---livin la vida loca
Organism.prototype.livingProcess = function(){
    this.older();
    this.canLive();    
}

const populationHistory = [];
let population = [];

population.push(new Organism());
populationHistory.push(population);

function cycle(){
    population.forEach(el => el.livingProcess());
    population = population.sort((a, b) => a - Math.floor(Math.random * 10)); //optional ? couse native dying fn exist
    if(population.length > populationSize) population.length = populationSize; //optional ? couse native dying fn exist
    populationHistory.push(population);
}

//---------------------------------
function createAllOrganismsBase(historyArr){
    const allOrganismsBase = [];
    historyArr.forEach(el => el.forEach(unit => allOrganismsBase.push({...unit})));
    return allOrganismsBase;
}

function removeDuplicates(array){
    let tempoArr = array.map(el => JSON.stringify(el));
    tempoArr = [...new Set(tempoArr)];
    tempoArr = tempoArr.map(el => JSON.parse(el));
    return tempoArr;
}

var makeTree2 = (data, parentId) => {  
    let node = {};  
    data
        .filter(el => el.parentId === parentId)
        .forEach(el => node[el.id] =
            makeTree2(data, el.id));
    return node
}

//RUN ALL MECHANISM
for(let i = 0; i < 1000; i ++){
    cycle();
}


inputData = removeDuplicates(createAllOrganismsBase(populationHistory));

const tree = makeTree2(inputData, null);
//console.log(tree)
console.log(
    JSON.stringify(tree, null, 2)
)

//----------------------------------rendering------------------------------------

var r, g, b;
    r = 20;
    g = 20;
    b = 20;

    var container = document.getElementsByClassName('container')[0];

    populationHistory.map((population, i) => {
        var box = document.createElement('div');
        box.classList.add('population');

        var p = document.createElement('p');
        p.classList.add('cycleInfo');
        p.innerText = `cyc: ${i}/${populationHistory.length/1000}k / n=${population.length}`;
        box.appendChild(p);

        population.forEach(unit => {
            var mutationLevel = 30 * unit.mutationCount;

            span = document.createElement('span');
            span.classList.add('org');
            span.style.backgroundColor = `
            rgb(${r}, 
                ${g + mutationLevel}, 
                ${b + mutationLevel})
            `;
            var pInfo = document.createElement('div');            
            pInfo.classList.add('info');

            pInfo.innerHTML = `
            <p class=${unit.feedUnit > defaultSetup.feedUnit ? 'plus' :unit.feedUnit < defaultSetup.feedUnit ? 'minus': null }>feedUnit: ${unit.feedUnit}</p>, 
            <p class=${unit.supplyLimit > defaultSetup.supplyLimit? 'plus' : unit.supplyLimit < defaultSetup.supplyLimit ?'minus': null }>supplyLimit: ${unit.supplyLimit}</p>, 
            <p class=${unit.lifeLimit > defaultSetup.lifeLimit? 'plus' : unit.lifeLimit < defaultSetup.lifeLimit ?'minus': null }>lifeLimit: ${unit.lifeLimit}</p>, 
            <p class=${unit.multiplicationLifeLimit > defaultSetup.multiplicationLifeLimit? 'plus' : unit.multiplicationLifeLimit < defaultSetup.multiplicationLifeLimit ?'minus': null }>multiplicationLifeLimit: ${unit.multiplicationLifeLimit}</p>, 
            <p class=${unit.multiplyCost > defaultSetup.multiplyCost? 'plus' : unit.multiplyCost < defaultSetup.multiplyCost ?'minus': null }>multiplyCost: ${unit.multiplyCost}</p> 
            `
            span.appendChild(pInfo);
            box.appendChild(span);
        })
        container.appendChild(box);
    }
    )