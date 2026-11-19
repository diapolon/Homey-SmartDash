/*20/12/2024*/
'use strict';
const Database = {
	initialize: function(callback_success) {	
		let self = this;					
		const onload_success = function() { callback_success(); };
		const onload_error = function(e) {
			if (e.code == 2 || CONFIG.emulated) {
				DATABASE.settings.version = CONFIG.version;															
				const data_migrated = self.migrate_db();					
				const oncreate_success = function() { 
					System.notify_alert('Database created'); 
					if (data_migrated) { 
						window.localStorage.clear();			
						System.notify_alert('Data migrate successfully');											
					}
					callback_success();
				};
				self.save(oncreate_success);				
			}
		};
		this.load(onload_success, onload_error);		
	},
	migrate_db: function() {				
		if (!CONFIG.emulated && window.localStorage.getItem('settings')) {						
			const settings = this._migrate_get('settings');
			const panels = this._migrate_get('panels');
			const screensaver = this._migrate_get('screensaver');
			const autoplay = this._migrate_get('autoplay');
			const pin = this._migrate_get('pin');
			DATABASE.settings = { ...DATABASE.settings,  ...settings };					
			DATABASE.panels = { ...DATABASE.panels,  ...panels };			
			DATABASE.screensaver = { ...DATABASE.screensaver,  ...screensaver };								
			DATABASE.autoplay = { ...DATABASE.autoplay,  ...autoplay };				
			DATABASE.settings.lang = window.localStorage.getItem('language');
			//need migrate engine
			return true;			
		}
		return false;
	},
	_migrate_get: function(item) {
		if (window.localStorage.getItem(item)) return JSON.parse(window.localStorage.getItem(item));					
		return false;
	},	
	upgrade_check: function() {
		if (!DATABASE.settings.version) DATABASE.settings.version = '0';
		const old = parseInt(DATABASE.settings.version.replace(/\./g, ''));
		const current = parseInt(CONFIG.version.replace(/\./g, ''));
		
		if (old < 2404011) this._2404011();		
		if (old < 2404012) this._2404012();		
		if (old < 2404122) this._2404122();		
		if (old < 2404171) this._2404171();		
		if (old < 2404232) this._2404232();		
		if (old < 2404261) this._2404261();		
		if (old < 2404304) this._2404304();		
		if (old < 2405022) this._2405022();		
		if (old < 2405064) this._2405064();		
		if (old < 2405161) this._2405161();		
		if (old < 2406044) this._2406044();		
		if (old < 2406051) this._2406051();		
		if (old < 2406054) this._2406054();		
		if (old < 2406125) this._2406125();		
		if (old < 2406126) this._2406126();		
		if (old < 2406131) this._2406131();		
		if (old < 2412161) this._2412161();		
		if (old < 2412202) this._2412202();		
		if (old < current) {
			DATABASE.settings.version = CONFIG.version;
			this.save();				
		}		
	},			
	load: function(callback_success, callback_error) {
		if (CONFIG.emulated) {
			if (window.localStorage.getItem('database')) {		
				let database = JSON.parse(window.localStorage.getItem('database'));							
				callback_success(database);
			} else callback_error({ error: 'no database' });
		} else {
			NativeStorage.getItem('database', callback_success, callback_error);
		}
	},
	save: function(callback_success) {				
		if (CONFIG.emulated) {
			window.localStorage.setItem('database', JSON.stringify(DATABASE));	
			if (callback_success) callback_success();			
		} else {
			const callback_error = function(e) { System.notify_alert('Error save database: '+ JSON.stringify(e)); };		
			if (!callback_success) callback_success = function() { };
			NativeStorage.setItem('database', DATABASE, callback_success, callback_error);
		}
	},	
	_2412202: function() {		
		System.notify_alert('Added ability to set auto login');				
		if (!DATABASE.settings.access_mode) DATABASE.settings.access_mode = 0;
	},		
	_2412161: function() {		
		System.notify_alert('Added screensaver BRIGHTNESS field');		
		if (!DATABASE.screensaver.brightness) DATABASE.screensaver.brightness = -1;
	},		
	_2406131: function() {		
		System.notify_alert('Added missing hide updatetime field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].hideupdatetime) break;
				else DATABASE.panels[p].widgets[position].hideupdatetime = 0;
			}			
		}
	},		
	_2406126: function() {		
		System.notify_alert('Added missing params field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].params) break;
				else DATABASE.panels[p].widgets[position].params = {};
			}			
		}
	},		
	_2406125: function() {		
		System.notify_alert('Added missing color field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].textcolor) break;
				else DATABASE.panels[p].widgets[position].textcolor = 'black';												
			}
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].textcolor == '') {
					switch(DATABASE.panels[p].widgets[position].color) {
						case 'white':						
						case 'transparent':
						case 'orange':
						case 'yellow':
							if (DATABASE.panels[p].widgets[position].type == 'Separator') DATABASE.panels[p].widgets[position].textcolor = 'white';
							else DATABASE.panels[p].widgets[position].textcolor = 'black';
							break;
						default:	
							DATABASE.panels[p].widgets[position].textcolor = 'white';
					}
				}
				 
			}
		}
	},		
	_2406054: function() {		
		System.notify_alert('Added ability to change fontsize');				
		if (!DATABASE.settings.fontsize) DATABASE.settings.fontsize = 0;
	},		
	_2406051: function() {	
		if (!DATABASE.settings.keepawake) DATABASE.settings.keepawake = 0;			
	},		
	_2406044: function() {		
		System.notify_alert('Breaking change: changing a CSS panel without replacing all .dashboard to .panel will remove all .dashboard lines');						
	},		
	_2405161: function() {		
		System.notify_alert('Added missing theme field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].theme) break;
				else DATABASE.panels[p].widgets[position].theme = 'default';								
			}
		}
	},		
	_2405064: function() {		
		System.notify_alert('Resetting Pin Code to 00000');				
		DATABASE.pin = { enabled: 0, code: '00000' };
	},		
	_2405022: function() {		
		System.notify_alert('Added missing image field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].image && !DATABASE.panels[p].widgets[position].image.fit) DATABASE.panels[p].widgets[position].image.fit = 'contain';				
				if (DATABASE.panels[p].widgets[position].image && !DATABASE.panels[p].widgets[position].image.mode) DATABASE.panels[p].widgets[position].image.mode = 'latest';				
			}
		}
	},		
	_2404304: function() {		
		System.notify_alert('Added missing image field. Make a backup after');				
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].image) break;
				else DATABASE.panels[p].widgets[position].image = { id: '', owner: '', mode: 'latest', fit: 'contain' };
			}
		}
	},		
	_2404261: function() {		
		System.notify_alert('Added panel timeout field');				
		if (!DATABASE.autoplay.timeout) DATABASE.autoplay.timeout = 0;
	},		
	_2404232: function() {		
		System.notify_alert('Added screensaver CSS field');		
		if (!DATABASE.screensaver.css) DATABASE.screensaver.css = '';
		if (!DATABASE.autoplay.logic) DATABASE.autoplay.logic = '';
	},		
	_2404171: function() {		
		System.notify_alert('Added iframe refresh screensaver field');		
		let data_0 = DATABASE.screensaver.slides[0].data;
		let data_1 = DATABASE.screensaver.slides[1].data;
		let data_2 = DATABASE.screensaver.slides[2].data;
		let data_3 = DATABASE.screensaver.slides[3].data;
		let data_4 = DATABASE.screensaver.slides[4].data;
		let data_5 = DATABASE.screensaver.slides[5].data;
		DATABASE.screensaver.slides[0].data = { url: data_0, refresh: 0 };
		DATABASE.screensaver.slides[1].data = { url: data_1, refresh: 0 };
		DATABASE.screensaver.slides[2].data = { url: data_2, refresh: 0 };
		DATABASE.screensaver.slides[3].data = { url: data_3, refresh: 0 };
		DATABASE.screensaver.slides[4].data = { url: data_4, refresh: 0 };
		DATABASE.screensaver.slides[5].data = { url: data_5, refresh: 0 };
	},	
	_2404122: function() {		
		System.notify_alert('Added iframe screensaver field');		
		DATABASE.screensaver.slides[0].data = { url: '', refresh: 0 };
		DATABASE.screensaver.slides[1].data = { url: '', refresh: 0 };
		DATABASE.screensaver.slides[2].data = { url: '', refresh: 0 };
		DATABASE.screensaver.slides[3].data = { url: '', refresh: 0 };
		DATABASE.screensaver.slides[4].data = { url: '', refresh: 0 };
		DATABASE.screensaver.slides[5].data = { url: '', refresh: 0 };
	},	
	_2404011: function() {		
		System.notify_alert('Added missing field');		
		if (!DATABASE.lang) DATABASE.lang = '';
		if (!DATABASE.server_token) DATABASE.server_token = '';
		DATABASE.settings.toolbar = '1';
		DATABASE.settings.grid = '1';
	},	
	_2404012: function() {				
		let dimensions_old = ['0x0', '1x0', '2x0', '3x0', '1x1', '2x1', '3x1', '1x2', '2x2', '3x2', '1x3', '2x3', '3x3', '1x4', '2x4', '3x4'];				
		let dimensions_new = ['2x1', '3x1', '6x1', '9x1', '3x2', '6x2', '9x2', '3x4', '6x4', '9x4', '3x6', '6x6', '9x6', '3x9', '6x9', '9x9'];
		let dimensions_s_old = ['1x1', '2x1', '3x1', '4x1', '5x1', '6x1'];				
		let dimensions_s_new = ['3x1', '6x1', '9x1', '9x1', '9x1', '9x1'];
		for (const p in DATABASE.panels) {			    				
			for (const position in DATABASE.panels[p].widgets) {	
				if (DATABASE.panels[p].widgets[position].type == 'Separator') {
					for (const d1 in dimensions_s_old) {
						if (DATABASE.panels[p].widgets[position].dimension.p == dimensions_s_old[d1]) {
							DATABASE.panels[p].widgets[position].dimension.p = dimensions_s_new[d1];
							break;
						}
					}					
					for (const d2 in dimensions_s_old) {
						if (DATABASE.panels[p].widgets[position].dimension.l == dimensions_s_old[d2]) {
							DATABASE.panels[p].widgets[position].dimension.l = dimensions_s_new[d2];
							break;
						}
					}
				} else {
					for (const d3 in dimensions_old) {
						if (DATABASE.panels[p].widgets[position].dimension.p == dimensions_old[d3]) {
							DATABASE.panels[p].widgets[position].dimension.p = dimensions_new[d3];
							break;
						}
					}					
					for (const d4 in dimensions_old) {
						if (DATABASE.panels[p].widgets[position].dimension.l == dimensions_old[d4]) {
							DATABASE.panels[p].widgets[position].dimension.l = dimensions_new[d4];
							break;
						}
					}
				}
			}
		}
		System.notify_alert('Migrating grid system');		
	}
};