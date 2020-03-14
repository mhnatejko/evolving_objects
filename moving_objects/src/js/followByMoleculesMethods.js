/*jshint esversion:6 */

const moleculesSum = (xStart, xEnd, yStart, yEnd, matrix, molecules, key) => {
	let sum = 0;
	for(let x = xStart; x < xEnd; x++){
		for(let y = yStart; y < yEnd; y++){			
			const mols = matrix[x][y].molecules.filter(el => el.includes(key));
			if(mols.length > 0){
				mols.forEach(mol => {
					try{
						sum += (molecules[mol].cyclesProp.max - molecules[mol].cyclesProp.current );
					}catch(err){
						// console.error('::    ::',molecules[mol], mol, x, y, err)
					}
				});
			}
		};
	};

	return sum;
};

const detectSurrounding = (obj, matrix, molecules, key) => {
	const { x, y, w, h } = obj;
	const xDir = {
		start: (x - 1) < 0 ? (x) : (x - 1),
		middle: (x + Math.floor(0.5 * w)),
		end: (x + w + 1) > (matrix.length - 1) ? (x + w) : (x + w + 1)
	};
	const yDir = {
		start: (y - 1) < 0 ? (y) : (y - 1),
		middle: (y + Math.floor(0.5 * h)),
		end: (y + h + 1) > (matrix[0].length - 1) ? (y + h) : (y + h + 1)
	};

	const objAreas = {
		x0y0: {
			id: 'x0y0',
			density: moleculesSum(xDir.start, xDir.middle, yDir.start, yDir.middle, matrix, molecules, key),
			direction: {
				x: -1,
				y: -1
			},
			nearest: ['x1y0', 'x0y1'],
		},
		x1y0: {
			id: 'x1y0',
			density: moleculesSum(xDir.middle, xDir.end, yDir.start, yDir.middle, matrix, molecules, key),
			direction: {
				x: 1,
				y: -1
			},
			nearest: ['x0y0', 'x1y1'],
		},
		x0y1: {
			id: 'x0y1',
			density: moleculesSum(xDir.start, xDir.middle, yDir.middle, yDir.end, matrix, molecules, key),
			direction: {
				x: -1,
				y: 1
			},
			nearest: ['x0y0', 'x1y1'],
		},
		x1y1: {
			id: 'x1y1',
			density: moleculesSum(xDir.middle, xDir.end, yDir.middle, yDir.end, matrix, molecules, key),
			direction: {
				x: 1,
				y: 1
			},
			nearest: ['x1y0', 'x0y1'],
		}
	};

	return objAreas;
};

const determineDirection = (obj) => {

	// finding most stimulated section
	let heighesStimulated = null;
	let secondStimulated = null;

	for(let key in obj){
		if(!heighesStimulated){
			heighesStimulated = obj[key];
		}else{
			if(heighesStimulated.density < obj[key].density) heighesStimulated = obj[key];
		}
	};

	// finding nearest second most stimulated section
	secondStimulated = (heighesStimulated.nearest[0].density > heighesStimulated.nearest[1].density) ?
		obj[heighesStimulated.nearest[0]] :
        obj[heighesStimulated.nearest[1]];
        
    return {
        heighesStimulated,
        secondStimulated // odfilt
    };
};



const countDir = (stimulatedOrgSide) => {

    const mainDir = stimulatedOrgSide.heighesStimulated; 
    const addDir = stimulatedOrgSide.secondStimulated;

	const sum = mainDir.density + addDir.density;
	const toMain = (mainDir.density * 1) / sum;
	const toAdd = 1 - toMain;

	// console.log(mainDir, addDir);
	const newDir = {
		x: null,
		y: null,
		newXSpeedDir: null,
		newYSpeedDir: null
	};

	if(mainDir.direction.x === addDir.direction.x){ // move up/down
		// newDir.x = toMain * mainDir.direction.x;
		// newDir.y = toAdd * mainDir.direction.y;		
		newDir.newXSpeedDir = toMain;
		
		// if(mainDir.id == 'x0y0' || mainDir.id == 'x1y0'){
		// 	console.log('UP');
		// }else{
		// 	console.log('DOWN');
		// }
	};
	
	if(mainDir.direction.y === addDir.direction.y){ // move left/right
		// newDir.y = toMain * mainDir.direction.y;
		// newDir.x = toAdd * mainDir.direction.x;
		newDir.newYSpeedDir = toMain;	
		
		// if(mainDir.id == 'x0y0' || mainDir.id == 'x0y1'){
		// 	console.log('LEFT');
		// }else{
		// 	console.log('RIGHT');
		// }
	};
	

	return newDir;
};

const followByMolecules = (obj, matrix, molecules, key) => {
	const surrounding = detectSurrounding(obj, matrix, molecules, key);
    const stimulatedOrgSide = determineDirection(surrounding);
	// console.log(stimulatedOrgSide);
    const newDir = countDir(stimulatedOrgSide);
	// console.log(newDir);

    return newDir;
};

module.exports = followByMolecules;