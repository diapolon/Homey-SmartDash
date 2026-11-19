/*26/04/2024*/
'use strict';
const Info = Form.extend({
	id: 'info',	
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__domReady: function() {				
		const callback_error = function(json) { };
		const callback_success = function(json_s, json_c) { 
			let model = document.getElementById('model');				
			let version = document.getElementById('version');							
			let cloud = document.getElementById('cloud');				
			model.innerHTML = json_s.homeyModelName;
			version.innerHTML = json_s.homeyVersion;			 
			if (json_c.connection == 'connected') {
				cloud.classList.add('color_green');
				cloud.innerHTML = LANG.labels.cloud.ok;
			} else {
				cloud.classList.add('color_red');
				cloud.innerHTML = LANG.labels.cloud.ko;
			}						
		};
		Homey.getInfo(callback_success, callback_error);		
				
		const callback2_success = function(json) { 					
			const version = (DATABASE.settings.debug == 1 ? 'test': 'version');
			
			const current = parseInt(CONFIG.version.replace(/\./g, ''));
			const remote = parseInt(json[version].name.replace(/\./g, ''));									
			let app = document.getElementById('app');				
			if (remote > current) {
				app.innerHTML = '<p><strong>'+ LANG.fields.upgrade_available +'</strong>: '+ json[version].name +'</p>';
				app.classList.add('blink');
			}
			if (System.is_apk()) {
				const remoteVersion = parseInt(json[version].code.replace(/d/g, ''));				
				ApkUpdater.getInstalledVersion(function(app) {
					const installedVersion = app.version.code;	
					if (remoteVersion > installedVersion) {				
						System.notify_confirm(LANG.notify.msg.confirm_update, function(button) {
							if (button == 2) ApkUpdater.download(HOMEY.update.url + json[version].code +'.apk', {}, function () { ApkUpdater.install(); }, function (error) { System.notify_alert(error, LANG.notify.title.error, LANG.buttons.ok); });
						}, LANG.notify.title.info, [LANG.buttons.no, LANG.buttons.yes]);						
			        } else System.notify_alert(LANG.notify.msg.no_update, LANG.notify.title.info, LANG.buttons.ok);							
				}, function (error) { System.notify_alert(error, LANG.notify.title.error, LANG.buttons.ok); });											
			}
		};

		Homey.checkUpgrade(callback2_success);					
		//Homey.get('system/ping');		
	}
});