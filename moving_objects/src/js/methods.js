/*jshint esversion:6 */

const randomNum = max => Math.floor(Math.random() * max);

// const arrGen = (len, content) => new Array(len).fill(content);
const arrGen = (len, content) => {
    const arr = [];
    for(let i = 0; i < len; i++){
        arr.push(content);
    };
    return arr;
} 

module.exports = {
    randomNum,
    arrGen
};