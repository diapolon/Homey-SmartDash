/*03/01/2025*/
'use strict';
const Homey = {
	url: function() {						
		return (CONFIG.local ? DATABASE.settings.server : 'https://'+ DATABASE.settings.cloud_id +'.'+ (CONFIG.cloud.fallback ? CONFIG.cloud.server_2 : CONFIG.cloud.server_1) +'/');				
	},	
	imgBaseUrl: function() {			
		const url = this.url();						
		return url.slice(0, -1);
	},
	get: function(type, callback_success, callback_error) {						
		this._get(type, callback_success, callback_error);		
	},	
	checkState: function(callback_success, callback_error) {						
		this._get('system/ping', callback_success, callback_error);		
	},	
	getZones: function(callback_success, callback_error) {						
		this._get('zones/zone', callback_success, callback_error);		
	},	
	getDevices: function(callback_success, callback_error) {						
		this._get('devices/device', callback_success, callback_error);		
	},	
	getDevice: function(device, callback_success, callback_error) {						
		this._get('devices/device/'+ device, callback_success, callback_error);		
	},	
	getState: function(type, callback_success, callback_error) {						
		this._get(type +'/state',  callback_success, callback_error);		
	},	
	getFlows: function(callback_success, callback_error) {			
		this._get('flow/flow', callback_success, callback_error);		
	},	
	getAdvancedFlows: function(callback_success, callback_error) {			
		this._get('flow/advancedflow', callback_success, callback_error);		
	},	
	getLogics: function(callback_success, callback_error) {			
		this._get('logic/variable', callback_success, callback_error);		
	},	
	getVariable: function(variable, callback_success, callback_error) {			
		this._get('logic/variable/'+ variable, callback_success, callback_error);		
	},	
	getInsight: function(id, insight, resolution, callback_success, callback_error) {			
		this._get('insights/log/homey:device:'+ id +'/homey:device:'+ id +':'+ insight +'/entry?resolution='+ resolution, callback_success, callback_error);		
	},	
	getTimeline: function(callback_success, callback_error) {			
		this._get('notifications/notification', callback_success, callback_error);		
	},
	getInfo: function(callback_success, callback_error) {			
		let self = this;		
		this._get('system', function(system) {		 			 								
			self.getState('cloud', function(cloud) {		 			 								
				callback_success(system, cloud);
			}, callback_error);								
		}, callback_error);															
	},
	getData: function(callback_success, callback_error) {		
		let self = this;
		this.getDevices(function(devices) {		 							 	
			self.getZones(function(zones) {		 			 								
				self.getLogics(function(logics) {		 			 								
					self.getFlows(function(flows) {		 			 								
						self.getAdvancedFlows(function(aflows) {		 			 																			
							callback_success(devices, flows, aflows, logics, zones);
						}, callback_error);								
					}, callback_error);													
				}, callback_error);								
			}, callback_error);								
		}, callback_error);	
	},	
	
	executeFlow: function(flow, advanced, callback_success, callback_error) {				
		this._post('flow/'+ advanced +'flow/'+ flow +'/trigger', { }, callback_success, callback_error);				
	},		
	setCapability: function(device, capability, data, callback_success, callback_error) {			
		this._put('devices/device/'+ device +'/capability/'+ capability, data, callback_success, callback_error);						
	},		
	setVariable: function(variable, data, callback_success, callback_error) {			
		this._put('logic/variable/'+ variable, data, callback_success, callback_error);						
	},
	reboot: function(callback_success, callback_error) {			
		this._post('system/reboot', { }, callback_success, callback_error);						
	},
	_get: function(api, callback_success, callback_error) {						
		this._api('get', 'api/manager/'+ api, null, 'json', function(response) {			
			callback_success(response);			
		}, function(response) { 		
			callback_error(response); 			
		});		
	},	
	_post: function(api, data, callback_success, callback_error) {				
		this._api('post', 'api/manager/'+ api, data, 'text', function(response) {					
			callback_success(response);			
		}, function(response) { 
			callback_error(response); 			
		});		
	},	
	_put: function(api, data, callback_success, callback_error) {				
		this._api('put', 'api/manager/'+ api, data, 'json', function(response) {			
			callback_success(response);			
		}, function(response) { 
			callback_error(response); 			
		});		
	},			
	_api: function(method, task, data, response_type, callback_success, callback_error) {							
		const url = this.url() + task;				
		if (isValidUrl(url)) {
			let self = this;		
			this.getServerToken(function() {		 							 	
				self.__api(method, url, data, response_type, callback_success, callback_error);		
			}, callback_error);		
		} else callback_error({ message: 'Invalid Homey URL' });	
	},
	__api: function(method, url, data, response_type, callback_success, callback_error) {					
		let self = this;		
		const on_success = function(result) {	callback_success(result); };		
		if (CONFIG.emulated) {				
			qwest[method](url, data, { timeout: 30000, dataType: 'json', cache: false, responseType: response_type, headers: { 'Accept': 'application/json', 'Authorization': 'Bearer '+ DATABASE.settings.token } }).then(function(xhr, json) {											
				on_success(json);														 
			})['catch'](function(e, xhr, response) {																				
				if (response == undefined) callback_error({ message: e });		
				else callback_error({ message: response.error });		
			});
		} else {
			cordova.plugin.http.sendRequest(url, { method: method, data: data, serializer: 'json', timeout: 30, responseType: response_type, headers: { 'Authorization': 'Bearer '+ DATABASE.settings.token } }, function(response) {
				if (response.status == 200) on_success(response.data);						
				else callback_error({ message: response.error });						
			}, function(response) {
				callback_error({ message: response.error });						
			}); 
		}
	},
	getServerToken: function(callback_success, callback_error) {								
		const url = DATABASE.settings.server_token;
		if (isValidUrl(url) && CONFIG.local) {			
    		//if ([0, 10, 20, 30, 40, 50].includes(new Date().getMinutes()) || DATABASE.settings.token == '') {
				const on_success = function(json) {							
					if (json.data.token != DATABASE.settings.token) {
						DATABASE.settings.token = json.data.token;
						Database.save();
					}
					callback_success();
				};								
				if (CONFIG.emulated) {
					qwest.get(url, null, { timeout: 30000, dataType: 'json', cache: false, responseType: 'json', headers: { 'Accept': 'application/json' } }).then(function(xhr, json) {											
						on_success(json);					
					})['catch'](function(e, xhr, response) {									
						if (response == undefined) callback_error({ message: e });		
						else callback_error({ message: response.error_description });								
					});
				} else {
					cordova.plugin.http.sendRequest(url, { method: 'get', data: null, serializer: 'json', timeout: 30, responseType: 'json', headers: { } }, function(response) {
						if (response.status == 200) on_success(response.data);						
						else callback_error({ message: response.error });						
					}, function(response) {
						callback_error({ message: response.error });						
					}); 
				}
			//} else callback_success();
		} else callback_success();		
	},	
	checkUpgrade: function(callback_success) {
		// Aggiornamenti disattivati (nessun URL configurato): salta in silenzio.
		if (!HOMEY.update || !HOMEY.update.url) return;
		System.spinner_show();
		Server.checkUpdate(function(json) {			
			System.spinner_hide();							
			callback_success(json.app);			
		}, function(json) { 
			System.spinner_hide();				
			System.notify_alert(JSON.stringify(json), LANG.notify.title.error, LANG.buttons.ok);			
		});					
	}
};