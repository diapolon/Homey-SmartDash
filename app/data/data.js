/*02/01/2025*/
'use strict';
const Data = {	
	/*data*/
	data_update_check: function() {		
		const callback_error = function(json) { 
			System.spinner_hide();				
			System.notify_alert(json.message, LANG.notify.title.alert, LANG.buttons.ok);			
			System.navigate('login', 'fade');							
		};
		let self = this;
		System.spinner_show();						 		
	 	Homey.getData(function(devices, flows, aflows, logics, zones) {	 		
	 	 	let lastUpdated = 0;
	 	 	for (const logic of sort_object(logics)) HOMEY.data.logics[logic.id] = { name: logic.name, type: logic.type };						
			for (const zone of sort_object(zones)) HOMEY.data.zones[zone.id] = { name: zone.name };
	 	 	for (const device of sort_object(devices)) {									 	
		 		let d = { id: device.id, name: device.name, type: device.class, icon: '', data: {}, lastUpdated: 0, images: [], insights: 0, zone: device.zone };  	
		 		if (device.iconObj.url != undefined) d.icon = device.iconObj.url;		 		
		 		if (device.images != undefined && device.images.length > 0) {
		 			for (const img of Object.values(device.images)) d.images.push(img.imageObj.url);		 			
		 		}
 		 		if (device.insights != undefined && device.insights.length > 0) {		 			
		 			for (const insight of Object.values(device.insights)) {		 									
						if (insight.type != 'boolean' && insight.uri.replace('homey:device:', '') == device.id) {
							if (HOMEY.data.insights[device.id] == undefined) HOMEY.data.insights[device.id] = {};
							const ins_id = insight.id.replace(insight.uri +':', '');								
							if (HOMEY.data.insights[device.id][ins_id] == undefined) {								
								HOMEY.data.insights[device.id][ins_id] = { name: insight.title, type: insight.type, units: insight.units };	
								d.insights = 1;				 		
							}
						}
					}	    		
				}	
				let d_lastUpdated = 0;  
				if (device.capabilitiesObj) {					
					for (const capability of Object.values(device.capabilitiesObj)) {						
						const c_lastUpdated = (capability.lastUpdated ? new Date(capability.lastUpdated).getTime() : 0);
						if (d_lastUpdated < c_lastUpdated) d_lastUpdated = c_lastUpdated;  	
				    	const c_id = (capability.id).replace('.', '_').toLowerCase();    
				    	let c = capability;			    	
				    	delete c.getable; delete c.insights; delete c.insightsTitleTrue; delete c.insightsTitleFalse; delete c.iconObj; delete c.desc; delete c.lastUpdated;			    	
				    	d.data[c_id] = c;			    	
				  	}			  	
				  	d.lastUpdated = d_lastUpdated;    
				  	if (lastUpdated < d_lastUpdated) lastUpdated = d_lastUpdated;		
				}
			  	HOMEY.data.devices[device.id] = d;			  	
			}			
			HOMEY.data.lastUpdated = lastUpdated;		
			
			for (const flow of sort_object(flows)) {							
				if (!flow.broken && flow.enabled && flow.triggerable) HOMEY.data.flows[flow.id] = { name: flow.name, adv: 0 };					
			}								
			for (const flow of sort_object(aflows)) {
				if (!flow.broken && flow.enabled && flow.triggerable) HOMEY.data.flows[flow.id] = { name: flow.name, adv: 1 };
			}
			window.setTimeout(function() {	
				System.spinner_hide();						 		
				self.trigger('dataReady');
			});																		
		}, callback_error);				
	},	
	/*values*/
	update_check: function() {
		let self = this;
	 	Homey.getDevices(function(devices) {			
			self.update_ready(devices);			
		}, function(json) { 
			self.update_error(json); 			
		});				
	},
	update_ready: function(devices) {		
		let lastUpdated = 0;  		
		for (const device of Object.values(devices)) {													  				
			if (HOMEY.data.devices[device.id] != undefined) {
				let d_lastUpdated = 0;  
				if (device.capabilitiesObj) {
				  	for (const capability of Object.values(device.capabilitiesObj)) {        
				  		if (!capability.lastUpdated) continue;
						const c_lastUpdated = new Date(capability.lastUpdated).getTime();
						if (d_lastUpdated < c_lastUpdated) d_lastUpdated = c_lastUpdated;  					  		
				    	const c_id = (capability.id).replace('.', '_').toLowerCase();			    	
				    	HOMEY.data.devices[device.id].data[c_id].value = capability.value;					
				  	}
				}
			  	HOMEY.data.devices[device.id].lastUpdated = d_lastUpdated;    
			  	if (lastUpdated < d_lastUpdated) lastUpdated = d_lastUpdated;		
			}				
		}
		HOMEY.data.lastUpdated = lastUpdated;		
		HOMEY.status.errors = 0;					
		this.trigger('updateReady');		
	},
	update_error: function(json) {				
		HOMEY.status.errors++;
		HOMEY.status.msg = json.message;			
		this.trigger('updateError');		
	},
	/*values*/
	update_single_check: function(device) {
		let self = this;
	 	Homey.getDevice(device, function(device) {			
	 	//alert(JSON.stringify(device));
			self.update_ready([device]);			
		}, function(json) { 
			self.update_error(json); 			
		});				
	},
};
_.extend(Data, Backbone.Events);