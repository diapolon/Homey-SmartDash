/*30/12/2024*/
'use strict';
const FormSettings = AbstractForm.extend({
	id: 'form_settings',
	className: 'slide forms edit',
	template: 'form_edit',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.type = options.type;					
		if (options.slide != undefined) this.slide = options.slide;
	},
	__render: function() {			
		this.params.hide = false;
		if ((this.type == 'screensaver' && DATABASE.screensaver.enabled == 0) || (this.type == 'screensaver_slide' && DATABASE.screensaver.slides[this.slide].enabled == 0) || (this.type == 'pin' && DATABASE.pin.enabled == 0)) this.params.hide = true;		
	},
	_touchEnd: function(event, childElement) {	
		let valid = false;
		switch(childElement.id) {
			case 'button_save':	
				switch(this.type) {
					case 'homey':							
						let server = document.getElementById('settings_server');
						let token = document.getElementById('settings_token');
						let server_token = document.getElementById('settings_server_token');						
						if (server.value == '' || (token.value == '' && server_token.value == '')) System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
						else {					
							if (isValidUrl(server.value) && (server_token.value == '' || isValidUrl(server_token.value))) {												
								valid = true;								
								DATABASE.settings.token = token.value;							
								DATABASE.settings.server = server.value;															
								DATABASE.settings.server_token = server_token.value;															
								DATABASE.settings.cloud_id = document.getElementById('settings_cloud_id').value;															
								if (DATABASE.settings.server.slice(-1) != '/') DATABASE.settings.server += '/';										
								Database.save();				
								System.notify_confirm(LANG.notify.msg.need_reload, function(button) {
									if (button == 2) System.navigate('', 'fade');
								}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);														
								return false;
							} else System.notify_alert(LANG.notify.msg.error_url, LANG.notify.title.alert, LANG.buttons.ok);						
						} 
						break;
					case 'screensaver':
						DATABASE.screensaver.time = parseInt(document.getElementById('settings_idletime').value);
						DATABASE.screensaver.from = parseInt(document.getElementById('settings_from').value);
						DATABASE.screensaver.to = parseInt(document.getElementById('settings_to').value);
						DATABASE.screensaver.opacity = parseInt(document.getElementById('settings_opacity').value);
						DATABASE.screensaver.brightness = parseFloat(document.getElementById('settings_brightness').value);
						DATABASE.screensaver.lastUpdated = 0;						
						Database.save();							
						valid = true;					
						break;
					case 'screensaver_slide':						
						let type = document.getElementById('settings_type');
						let device = document.getElementById('settings_type_device');						
						let url = document.getElementById('settings_type_data_url');						
						let refresh = document.getElementById('settings_type_data_refresh');						
						if ((type.value == 'weather' && device.value == '') || (type.value == 'iframe' && url.value == '')) System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
						else {
							DATABASE.screensaver.slides[this.slide].type = type.value;
							DATABASE.screensaver.slides[this.slide].device = device.value;
							DATABASE.screensaver.slides[this.slide].data.url = url.value;
							DATABASE.screensaver.slides[this.slide].data.refresh = parseInt(refresh.value);
							Database.save();							
							System.navigate('sections/settings/screensaver', 'fade');					
							return;
						}
						break;
					case 'screensaver_css':
						let value = '';
						let css = document.getElementById('screensaver_css');				
						if (css.value != '') {
							let tmp = [];
							const lines = css.value.split('\n');
							for (let i = 0; i < lines.length; i++) {				
								const v = lines[i];
								if (v != '' && v.includes('.screensaver')) tmp.push(v.trim());								
							}
							if (tmp.length > 0) value = tmp.join('\n');
						}	
						DATABASE.screensaver.css = value;
						Database.save();				
						System.navigate('sections/settings/screensaver', 'fade');
						break;
					case 'pin':						
						let p1 = document.getElementById('settings_pin_code_1').value;
						let p2 = document.getElementById('settings_pin_code_2').value;
						let p3 = document.getElementById('settings_pin_code_3').value;
						let p4 = document.getElementById('settings_pin_code_4').value;
						let p5 = document.getElementById('settings_pin_code_5').value;
						DATABASE.pin.code = p1 + p2 + p3 + p4 + p5;
						Database.save();						
						valid = true;				
						break;
					case 'system':
						//DATABASE.settings.grid = document.getElementById('settings_grid').value;	
						DATABASE.settings.fontsize = parseInt(document.getElementById('settings_fontsize').value);	
						DATABASE.settings.access_mode = parseInt(document.getElementById('settings_access_mode').value);	
						DATABASE.settings.feedback = parseInt(document.getElementById('settings_feedback').value);	
						DATABASE.settings.keepawake = parseInt(document.getElementById('settings_keepawake').value);	
						DATABASE.settings.unsecure = parseInt(document.getElementById('settings_unsecure').value);	
						DATABASE.settings.debug = parseInt(document.getElementById('settings_debug').value);	
						DATABASE.settings.custom = parseInt(document.getElementById('settings_custom').value);	
						DATABASE.settings.sync = parseInt(document.getElementById('settings_sync').value);	
						DATABASE.settings.lang = document.getElementById('settings_language').value;						
						Database.save();									
						LANG = languages(DATABASE.settings.lang);			
						valid = true;
						System.notify_confirm(LANG.notify.msg.need_reload, function(button) {
							if (button == 2) System.navigate('', 'fade');
						}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);																
						return false;
						break;
				}	
				if (valid) System.navigate('sections/settings', 'fade');					
				break;
		}
		return false;
	}
});