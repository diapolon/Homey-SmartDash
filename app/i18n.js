/*28/12/2024*/
function languages(lang) {
	let obj = {};
	switch(lang) {
		case 'it-IT':
			obj = _it();
			break;		
		case 'nl-NL':
			obj = _nl();
			break;		
		case 'fr-FR':
			obj = _fr();
			break;
		default:
			obj = _en();
	}
	return obj;
}