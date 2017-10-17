// Drum Arrays
const kicks = [];
const snares = [];
const hiHats = [];
const rideCymbals = [];

for(i=0;i<16;i++){
	kicks[i] = false;
	snares[i] = false;
	hiHats[i] = false;
	rideCymbals[i] = false;
}

const toggleDrum = (type, index) => {
	if (!validIndex(index)) {return;}
	if (!validArray(type)) {return;}

	if (type[index] === true) { return type[index] = false;} 

	return type[index] = true;
	
};

const clear = (array) => {
	if (!validArray(array)) {return;}
	for(i=0;i<16;i++){
		array[i] = false;
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
	if (array === kicks ) {return true;}
	if (array === snares ) {return true;}
	if (array === hiHats ) {return true;}
	if (array === rideCymbals) {return true;}
	return false;

}
