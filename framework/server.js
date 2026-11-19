/*28/12/2023*/
'use strict';
const Server = {				
	checkUpdate: function(callback_success, callback_error) {
		// Nessun server di aggiornamento configurato → controllo disattivato.
		if (!HOMEY.update || !HOMEY.update.url) {
			if (callback_error && typeof(callback_error) === 'function') callback_error({ message: 'update check disabled' });
			return;
		}
		const url = HOMEY.update.url + HOMEY.update.version;
		let self = this;
		const on_success = function(result) {			
			if (callback_success && typeof(callback_success) === 'function') callback_success(result);		
		};
		const on_error = function(error, response) {			
			self._sendKo(error, response, callback_error);
		};		
		if (CONFIG.emulated) {
			qwest.get(url, { }, { timeout: 60000, dataType: 'json', cache: false, responseType: 'json', headers: { 'Accept': 'application/json' } }).then(function(xhr, json) {				
				on_success(json);									
			})['catch'](function(e, xhr, response) {				
				on_error(e, response);					
			});
		} else {
			cordova.plugin.http.sendRequest(url, { method: 'get', data: { }, serializer: 'json', timeout: 10, responseType: 'json', headers: { } }, function(response) {
				if (response.status == 200) {
					on_success(response.data);						
				} else on_error(response.error, response.error);
			}, function(response) {
				on_error(response.error, response.error);
			}); 
		}
	},
	_sendKo: function(e, response, callback_error) {			
		if (callback_error && typeof(callback_error) === 'function') callback_error({ message: JSON.stringify(e) + JSON.stringify(response) });
		else System.notify_alert(JSON.stringify(e));	
	}
};
