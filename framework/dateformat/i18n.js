function dateformat_i18n(lang) {
	switch(lang) {
		case 'it':
			dateFormat.i18n = {
				yesterday: 'Ieri',
				dayShortNames: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
				dayNames: ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'],
				monthShortNames: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
				monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
			};
			break;
		case 'fr':
			dateFormat.i18n = {
				yesterday: 'Hier',
				dayShortNames: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],	
				dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
				monthShortNames: ['jan', 'fev', 'mar', 'avr', 'mai', 'jui', 'jui', 'aou', 'sep', 'oct', 'nov', 'dec'],
				monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre']
			};
			break;
		case 'nl':
			dateFormat.i18n = {
				yesterday: 'Gisteren',
				dayShortNames: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
				dayNames: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
				monthShortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
				monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
			};
			break;
		default:
			dateFormat.i18n = {
				yesterday: 'Yday',
				dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				monthShortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			};
		}
}