/*jshint esversion:6 */

// const arrGen = (len, content) => new Array(len).fill(content);
// const a = arrGen(10, arrGen(10, 'o'));


// b = Math.floor(Math.random()*4);

// console.log(b);

// const mx = [
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ],
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ],
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ],
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ],
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ],
//     [ {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []}, {orgs: []} ]
// ];

// const els = [
//     {
//         x1: 1,
//         xn: 2,
//         y1: 3,
//         yn: 5
//     },
//     {
//         x1: 3,
//         xn: 4,
//         y1: 3,
//         yn: 5
//     },
// ]

// els.forEach(el => {
//     const x1 = el.x1;
//     const xn = el.xn;
//     const y1 = el.y1;
//     const yn = el.yn;

//     for(let x = x1; x < xn; x++){
//         for(let y = y1; y < yn; y++){
//             mx[x][y].orgs.push('abc123');
//         };
//     };
// })


// console.log(mx[0][0]);
// console.log(mx[1][3]);
// console.log(mx[3][3]);
// console.log(mx);

const a = 'rgb(100, 200,300)';
const rgb = a
    .replace('rgb', '')
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(el => el.trim())
    .map(el => parseInt(el) + 20)
    .join(',');

const newColor = `rgb(${rgb})`;


console.log(a, newColor);