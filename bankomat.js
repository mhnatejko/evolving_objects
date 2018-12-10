//exmaple of recursion ////////
categories = [
    {id: 'labrador', 'parent': 'dog'},
    {id: 'persian', 'parent': 'cat'},
    {id: 'simaese', 'parent': 'cat'},
    {id: 'cat', 'parent': 'animal'},
    {id: 'dog', 'parent': 'animal'},
    {id: 'niuniek', 'parent': 'persian'},
    {id: 'animal', 'parent': null}
]

var makeTree2 = (categories, parent) => {
    let node = {}
    categories
        .filter(c => c.parent === parent)
        .forEach(c => node[c.id] =
            makeTree2(categories, c.id))
    return node
}

console.log(
    JSON.stringify(
        makeTree2(categories, null)
        , null, 2
    )
)
/////////////////////////////////////////////
var nutrients = 198; 
var population= [];
movement = function(){population.sort(function(a,b){
    var randomNum = Math.random();
    return a - b*randomNum
})}
killer = function(){population = population.filter(organism => organism.sources > 0)};
metabolicPaths = function(){
    population.forEach(organism => {
    organism.colectNutrients();
    organism.looseEnergy();
    organism.multiplication();
})
}


function OrganismCreator(id){
    this.id = id;
    this.childId = 0;
    this.sources = 2;
    this.colectNutrients = function(){if(nutrients > 0.5){nutrients-=1; this.sources += 1}};
    this.looseEnergy = function(){this.sources -=0.5; nutrients+=0.5};
    this.multiplication = function(){
        if(this.sources >= 6){
            population.push(new OrganismCreator(this.setId())); 
            this.childId+=1; 
            this.sources-=4
        }
    };
    
    this.setId = function(){return this.id + '-' + this.childId}

}
population.push(new OrganismCreator(0));

var numOfCycles = 0;
var cycle = setInterval(function(){
    numOfCycles += 1;
    movement();
    killer(); 
    metabolicPaths(); 
    console.log(numOfCycles, ':', population.length, nutrients)
    if(numOfCycles % 100 === 0){console.log(population)}
} ,100)

// var population = [
//     {
//         id: 0,
//         childId: 0,
//         sources: 2,
//         colectNutrients: function(){nutrient-=1; this.sources += 1},
//         multiplication: function(){if(this.sources > 5){}},
//         setId: function(){return this.id + '-' + this.childId}
//     }]



//--------------------------------------------------------------------------------------------------------------------
function bankomat(request) {
  
    const nominal = [10, 20, 50, 100, 200];
    const resourse = {
        10: 10,
        20: 5,
        50: 2,
        100: 1,
        200: 0
    };

    let input = Math.ceil(request);
    let output= [];
    while (input > 0) {
        let validNom = nominal.filter(nom => input/nom > 1);
        // console.log(input, validNom, output)
        let validMax = Math.max(...validNom);
        input -= validMax;
        resourse[validMax] -= 1;
        output.push(validMax);
        console.log(`rzadanie:${input}, wyplata:${output}, validnom:${validNom}, calidmax:${validMax}`)
    
    }    
    console.log(output)
}

bankomat(60)

var nominal = [10, 20, 50, 100, 200];
var resourse = {
    10: 10,
    20: 5,
    50: 2,
    100: 1,
    200: 0
};
var output= [];

function work(){
    if(input > 0){
    var validNom = nominal.filter(nom => input/nom >= 1);
    // console.log(input, validNom, output)
    var validMax = Math.max(...validNom);
    console.log(`rzadanie:${input}, wyplata:${output}, validnom:${validNom}, validmax:${validMax}`)
    input -= validMax;
    resourse[validMax] -= 1;
    output.push(validMax);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////


bankomat = {
    resourse: {
        10: 10,
        20: 5,
        50: 2,
        100: 1,
        200: 0
    },
    
    availableMoneyKeys: [],
    availableMoneyKeysCreator: function(){
        for (el of resourse){
            if(resourse[el] > 0){
                ava.push(el)
            }
        }
    },

    delivery: function(deliveryObj){
        for(moneyKey in this.resourse){
            for(deliveryMoneyKey in deliveryObj){
                if(moneyKey==deliveryMoneyKey){
                    this.resourse[moneyKey]+=deliveryObj[deliveryMoneyKey]
                }
            }
        }
    },

    giveMoney: function(moneyRequest){
        
        
        var isPaymmentPossible = function(){
                
            var sumOfAvailable = 0;
            for(moneyKey in this.resourse){
                sumOfAvailable += this.resourse[moneyKey]
            }
            if(sumOfAvailable > moneyRequest){return true}
        };
        console.log(isPaymmentPossible());
        var isPossible = isPaymmentPossible();

        if(isPossible){
            console.log('mozna wyplacic')
        }
    },
    


}