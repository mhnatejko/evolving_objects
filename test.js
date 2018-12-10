data = [[
    {id: '0', a:1},
    {id: '0-0', a:2},
    {id: '0-0-0', a:3},
    {id: '0-1-0', a:4},
    {id: '0-0-1', a:5},
    {id: '0-0-0-0', a:6},
    {id: '0-1', a:7},
    {id: '0-1-1', a:8},
    {id: '0-2-0-0-1', a:9},
    {id: '0-2', a:10}
],
[
    {id: '0', a:1},
    {id: '0-0', a:2},
    {id: '0-0-0', a:3},
    {id: '0-1-0', a:4},
    {id: '0-0-1', a:5},    
],
[
    {id: '0', a:1},
    {id: '0-3', a:2},
    {id: '0-3-0', a:3},
    {id: '0-3-0', a:4},
    {id: '0-3-1', a:5},
    {id: '0-3-0-0', a:6},
    {id: '0-3', a:7},
    {id: '0-3-1', a:8},
    {id: '0-3-0-0-1', a:9},
    {id: '0-3', a:10}
],
]

dataSynth = []
tree = {};

dataFlat = data.map(cycle => cycle.map(popul => popul))

console.log(dataFlat);

// var makeTree2 = (data, parentId) => {
//     let node = {}
//     data
//         .filter(el => el.parentId === parentId)
//         .forEach(el => node[el.id] =
//             makeTree2(data, el.id))
//     return node
// }

// console.log(
//     JSON.stringify(
//         makeTree2(data, null)
//         , null, 2
//     )
// )























// population = []

// function Obj(id){
//     this.id = id;
//     this.childNumber = 0;
//     this.age = 0;
// }

// Obj.prototype.dead = function(){
//     population = population.filter(el => el.id !== this.id)
// };

// Obj.prototype.multiplication = function(){
//     population.push(new Obj(this.id+this.childNumber));
//     this.childNumber += 1;
// };

// population.push(new Obj('0'));
// var cl = () => console.log(JSON.stringify(population, 4));
// var m = () => population[0].multiplication();
// var cm = () => {cl(); m()}


////////////////////////////////////////////////////////
// def = {x: 0, y: 0}
// function a(val){
//     console.log({...def, ...val})
// }

// a()
// a({x:1, y:1})
// a({y:1})