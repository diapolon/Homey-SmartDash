/*19/12/2024*/
'use strict';
const System = {
	on_deviceready: function() {				
		CONFIG.online = System.is_connected();
		document.addEventListener('backbutton', function () { System.handle_backButton(); }, false);		
		document.addEventListener('resume', function () { System.handle_resume(); }, false);		
		//document.addEventListener('offline', function () { System.handle_offline() }, false);
		//document.addEventListener('online', function () { System.handle_online() }, false);						
		const callback_success = function() {
			try {
		    	APP = new App();
		    } catch(err) {
		    	System.notify_alert(err);	        
		    }
		};		
		Database.initialize(callback_success);						
	},
	initialize: function() {				
		this.body = document.getElementById('body');				
		CONFIG.uuid = (CONFIG.emulated ? 'RG9lIiwiaWF0' : window.device.uuid);		
		if (screen.width - screen.height == 0) CONFIG.screen = 'square';
		if (screen.width > screen.height) CONFIG.screen = 'landscape';									
		CONFIG.ios = this.platform_check();
		if (CONFIG.ios) this.body.classList.add('ios');		
		CONFIG.font_size = Math.min(25, Math.round((screen.width > screen.height ?  screen.height : screen.width) / 27));
		//this.language_init();
		//this.screen_init();
		this.orientations_init(); 										
	},		
	platform_check: function() {				
		if (CONFIG.emulated) return /iPad|iPhone|iPod/.test(navigator.userAgent);
		else return /iOS/.test(device.platform);
	},		
	screen_init: function() {				
		this.body.classList.remove('square', 'portrait', 'landscape');
		this.body.classList.add(CONFIG.screen);				
		document.getElementById('css').innerHTML = '<style type="text/css">#body { font-size: '+ (!DATABASE.settings.fontsize || DATABASE.settings.fontsize == 0 ? CONFIG.font_size : DATABASE.settings.fontsize) +'px }</style>';		
	},			
	orientations_init: function() {				
		let self = this;
		window.screen.orientation.addEventListener('change', function() {
			if (screen.orientation.type.indexOf('landscape') == -1) CONFIG.screen = 'portrait';
			else CONFIG.screen = 'landscape';			
    		self.screen_init();
		});
	},			
	language_init: function() {
		if (DATABASE.settings.lang == '') DATABASE.settings.lang = navigator.language;
		LANG = languages(DATABASE.settings.lang);	
		dateformat_i18n(LANG.language);		
	},	
	homey_init: function() {			
		//this.body.classList.remove('grid_1', 'grid_2');		
		//this.body.classList.add('grid_'+ DATABASE.settings.grid);				
	},
	is_apk: function() { 
		return (['px30_evb', 'LenovoCD-24502F'].includes(window.device.model));
	},	
	is_connected: function() { 
		return (navigator.connection.type != Connection.NONE); 
	},	
	spinner_show: function(txt) {
		if (txt == undefined) txt = '';
		document.getElementById('mask').classList.remove('hide');
		document.getElementById('spinner').classList.remove('hide');
		document.getElementById('spinner_msg').innerHTML = txt;		
	},	
	spinner_hide: function() {
		document.getElementById('mask').classList.add('hide');
		document.getElementById('spinner').classList.add('hide');	
		document.getElementById('spinner_msg').innerHTML = '';
	},	
	notify_alert: function(msg, msg_title, msg_button) {
		if (CONFIG.emulated) alert(msg);
		else navigator.notification.alert(msg, null, msg_title, msg_button);						
	},
	notify_prompt: function(msg, callback, title, buttons) {
		if (callback && typeof callback === 'function') {
			if (CONFIG.emulated) {			
				let r = window.confirm(msg);			
				if (r == true) callback(2);
				else callback(1);			
			} else {
				navigator.notification.prompt(msg, callback, title, buttons);
			}		
		} else {
			alert('callback');
		}	
	},
	notify_confirm: function(msg, callback, title, buttons) {
		if (callback && typeof callback === 'function') {
			if (CONFIG.emulated) {			
				let r = window.confirm(msg);			
				if (r == true) callback(2);
				else callback(1);			
			} else {
				navigator.notification.confirm(msg, callback, title, buttons);
			}		
		} else {
			alert('callback');
		}	
	},
	notify_beep: function() {
		if (!CONFIG.emulated) {						
			if (DATABASE.settings.feedback == 2) navigator.vibrate(100);
			if (DATABASE.settings.feedback == 1) navigator.notification.beep(1);	
		}		
	},		
	handle_openLink: function(event, url) {
		if (CONFIG.emulated) alert(url);
		else cordova.InAppBrowser.open(encodeURI(url), '_system', 'location=yes');			
		return false;
	},
	handle_openNavigator: function(event, lat, lng) {
		if (CONFIG.emulated) alert(lat + lng);
		else launchnavigator.navigate([lat, lng]);
		return false;
	},
	handle_openShare: function(data) {
		if (CONFIG.emulated) this.body.innerHTML = data;
		else {			
			window.plugins.socialsharing.share(null, 'smartdash_data', 'data:text/csv;base64,' + window.btoa(unescape(encodeURIComponent(data))), null, function () {  				
			}, function () {
					System.notify_alert(LANG.notify.msg.error, LANG.notify.title.error);
			});			
		}
		return false;
	},	
	handle_backButton: function() {
		if (window.location.hash == '#dashboard') this.close_app();
		else {
			let state = CONFIG.state_history[CONFIG.state_history.length - 2];
			if (state != undefined) this.navigate(state.slice(1), 'slide', 'right');
		}
	},
	handle_resume: function() {
		window.setTimeout(function() {
        	Data.trigger('updateTime');
        }, 0);		
	},
	handle_offline: function() {
		//let index = ['', '#login'].indexOf(window.location.hash);
		//if (index == -1) this.alert_show('Connessione assente');		
		//CONFIG.online = false; 
	},
	handle_online: function() {
		//let index = ['', '#login'].indexOf(window.location.hash);
		//if (index == -1) this.alert_hide();		
		//CONFIG.online = true; 		
	},		
	navigate: function(url, type, direction, callback) {			
		let state = '#'+ url;	
		if (state == window.location.hash) return;			
		if (callback && typeof callback === 'function') callback();
		Backbone.history.navigate(url, { trigger: true });			
	},
	navigate_resetHistory: function(history) {
		if (!history) history = ['#dashboard'];
		CONFIG.state_history = history;
	},
	close_app: function() {
		if (!CONFIG.ios) {
			this.notify_confirm(LANG.notify.msg.app.exit, function(button) { 
				if (button == 2) { 
					if (CONFIG.emulated) alert('Close app');
					else navigator.app.exitApp();
				}
			}, LANG.notify.title.close, [LANG.buttons.cancel, LANG.buttons.yes]);
		}
	}
};