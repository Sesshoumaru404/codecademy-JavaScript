// Drum Arrays

const createEmptyDrumArray = () => new Array(16).fill(false);

let kicks = createEmptyDrumArray();
let snares = createEmptyDrumArray();
let hiHats = createEmptyDrumArray();
let rideCymbals = createEmptyDrumArray();



const toggleDrum = (name, index) => {
	const arrayDrum = validArray(name);

	if (!validIndex(index)) {return;}

	arrayDrum[index] = !arrayDrum[index];
	
};

const clear = (name) => {
	const arrayDrum = validArray(name);
	if (arrayDrum) {arrayDrum.fill(false)};
}

const invert = (name) => {
	const arrayDrum = validArray(name);
	if (!arrayDrum) {return};
	for (let i = 0; i < arrayDrum.length; i++){
		arrayDrum[i] = !arrayDrum[i];
	}
}

const validIndex = (index) => {
	if (
	    index < 16	&&
	    index >= 0	
	) {return true;}
	return false;

}

const validArray = (array) => {
	if (array === 'kicks' ) {return kicks;}
	if (array === 'snares' ) {return snares;}
	if (array === 'hiHats' ) {return hiHats;}
	if (array === 'rideCymbals') {return rideCymbals;}
	return false;

}


const getNeighborPads = (x, y, size) => {
	const neighborPads = [];
		if (x >= size || y >= size || x < 0 || y < 0 || size < 1) {
			return neighborPads;
		}
		neighborPads.push([x - 1, y]);
		neighborPads.push([x, y - 1]);
		neighborPads.push([x + 1, y]);
		neighborPads.push([x, y + 1]);
		return neighborPads.filter((neighbor) => {
		    return neighbor.every((val) => {
				return val >= 0 && val < size;
			});
		});
};
