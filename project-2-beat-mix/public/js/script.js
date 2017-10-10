// Drum Arrays
let kicks = [];
let snares = [];
let hiHats = [];
let rideCymbals = [];

for(i=0;i<16;i++){
	kicks[i] = false;
	snares[i] = false;
	hiHats[i] = false;
	rideCymbals[i] = false;
}

const toggleDrum = (type, index) => {
	if (!type || !index || index >= type.length || index < 0 ){
		return;
	}

	if (type[index]) {
		type[index] = false;
	} else {
		type[index] = true;
	}
};
