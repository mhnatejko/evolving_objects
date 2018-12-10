import populationHistory from './script';

(function(){
    var r, g, b;
    r = 20;
    g = 20;
    b = 20;

    var container = document.getElementsByClassName('container')[0];

    populationHistory.forEach(population => {
        var box = document.createElement('div');
        boc.classList.add('population');
        population.forEach(unit => {
            span = document.createElement('span');
            span.innerText = 'o';
            span.classList.add('org');
            span.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            box.appendChild(span)
        })
        container.appendChild(box)
    }
    )

    // function adder(){
    //     span = document.createElement('span');
    //     //span.innerText = 'o';
    //     span.classList.add('org');
    //     span.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    //     container.appendChild(span);
    //     r+= 5;
    //     g+= 2;
    //     b+= 1;
    // }
    // var interval = setInterval(adder, 50);
    // var timeout = setTimeout(() => clearInterval(interval), 60000);
})()

//based on history obj
//history.map(population => <div> 
//  population.map(unit => <span></span>)
//</div>)