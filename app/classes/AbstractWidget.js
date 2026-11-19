/*28/01/2025*/
'use strict';
const AbstractWidget = {
	dashboard: AbstractListItem.extend({
		events: {},
		className: 'widget',	
		_initialize: function(options) {
			this.listenTo(this, 'domRefresh', this.domRefresh);
			this.parent = options.parent;			
			this.selected = options.selected;
		},
		__render: function() {
			if (this.selected) this.el.classList.add('selected');		
			if (this.model.get('data')) { 
				if (this.model.get('data')['measure_power']) this.setPower('measure_power');					
				if (this.model.get('data')['meter_power']) this.setPower('meter_power');										
			}
			this._format();			
			this.___render();	
		},
		___render: function() {
		},
		__touchEnd: function(event, childElement) {			
			if (this.parent.timer) this.parent.timer.restart();			
			return this.___touchEnd(event, childElement);
		},
		___touchEnd: function(event, childElement) {			
			return false;
		},
		domRefresh: function() {		
		},
		_domReady: function() {		
			this.domRefresh();
		},		
		refresh: function() {				
			this.render().trigger('domRefresh');				
		},	
		_format: function() {	
		 	if (this.model.get('widget')) {
				const dim = (CONFIG.screen == 'landscape' ? this.model.get('widget').dimension.l : this.model.get('widget').dimension.p);						
				this.model.set('format', dim);							
			}
		},
		setPower: function(capability) {							
			if (this.model.get('data')[capability].units.includes('h')) return;
			this.model.get('data')[capability].units = (Math.abs(this.model.get('data')[capability].value) >= 1000 ? 'kW' : 'W');					
			this.model.get('data')[capability].value = Capabilities.power(this.model.get('data')[capability].value);			
		},
		checkCapabilityStatus: function(capability, css) {					
			if (this.model.get('data')[capability] != undefined) {			
				if (this.model.get('data')[capability].value) this.el.classList.add(css);				
				else this.el.classList.remove(css);			
			}	
		},	
		updateCapability: function(device, capability, value) {	
			let self = this;
			const start = function() {
				self.el.classList.add('shadow');
				System.notify_beep();				
			}
			const end_ok = function(response) {
				Data.update_single_check(device);				
				window.setTimeout(function () { 			
					self.el.classList.remove('shadow');			
				}, 100);
			}
			const end_ko = function(response) { 
				self.el.classList.remove('shadow'); 
			};
			start();
			Homey.setCapability(device, capability, { value: value }, end_ok, end_ko);
		}
	}),
	edit: function(data, widget, panel) {						
		let items = [];		
						
		let icons = [];
		for (const icon in json_data.icons) {			
			//if (json_data.icons[icon].includes(data.type)) icons.push({ icon: icon, value: icon });
			if (json_data.icons[icon].includes(data.type)) icons.push(icon);
		}
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));	
		
		let _type = json_data.widgets[data.type];		
		if (_type.devices > 0) {			
			let devices = { values: [''], labels: [LANG.forms.options.choose] };
			let add = false;							
			for (const device_id in HOMEY.data.devices) {			
				const device = HOMEY.data.devices[device_id];    							
				add = false;
				if (data.type == 'GenericSocket' && device.data['onoff'] != undefined) add = true;
				else if (data.type == 'GenericCapability') add = true;
				else if (data.type == 'GenericAlert') {
					for (const capability_id in device.data) {			
						if (device.data[capability_id].type == 'string') {
							add = true;
							break;
						}
					}
				} else if (data.type == 'GenericLight' && device.data['onoff'] != undefined) add = true;
				else if (data.type == 'LightRGB' && (device.data['light_mode'] != undefined || device.data['light_hue'] != undefined || device.data['light_temperature'] != undefined || device.data['light_saturation'] != undefined)) add = true;
				else if (data.type == 'GenericFan' && device.type == 'fan' && device.data['onoff'] != undefined) add = true;
				else if (data.type == 'GenericThermostat' && (device.type == 'thermostat' || device.type == 'airconditioning')) add = true;
				else if (data.type == 'GenericSpeaker' && device.type == 'speaker') add = true;
				else if (data.type == 'Lock' && device.type == 'lock') add = true;
				else if (data.type == 'GenericSensor' && device.type == 'sensor' && (device.data['presence'] != undefined || device.data['alarm_contact'] != undefined || device.data['alarm_motion'] != undefined || device.data['alarm_motion_presence'] != undefined || device.data['alarm_tamper'] != undefined)) add = true;					
				else if (data.type == 'PresenceSensor' && (device.data['presence'] != undefined ||  device.data['alarm_motion_presence'] != undefined)) add = true;
				else if (data.type == 'THSensor' && device.data['measure_temperature'] != undefined && device.data['measure_humidity'] != undefined) add = true;
				else if (data.type == 'ComfortSensor' && device.data['measure_temperature'] != undefined && device.data['measure_humidity'] != undefined) add = true;
				else if (data.type == 'SMSensor' && device.data['measure_moisture'] != undefined) add = true;									
				else if (data.type == 'Powerwall' && device.type == 'other' && device.data['solar_power'] != undefined) add = true;
				else if (data.type == 'Weather' && isWeatherDevice(device.data)) add = true;					
				else if (data.type == 'SolarPanel' && device.type == 'solarpanel') add = true;
				else if (data.type == 'BlindCurtain' && (device.data['windowcoverings_set'] != undefined || device.data['windowcoverings_state'] != undefined)) add = true;					
				if (add) {					
					devices.values.push(device_id);
					devices.labels.push(device.name +' ('+ HOMEY.data.zones[device.zone].name +')');
				}
			}			
			const callback_device = function(rel, value) { 		
				const device = HOMEY.data.devices[value];    							
				let name = document.getElementById('dashboard_name');
				if (name.value == '') name.value = device.name;
				if (_type.capabilities > 0) {				
					let capabilities = document.getElementById('dashboard_capability');
					capabilities.innerHTML = '<option value="">'+ LANG.forms.options.choose +'</option>';
					for (const capability_id in device.data) {
						if (data.type != 'GenericAlert' || device.data[capability_id].type == 'string') capabilities.innerHTML += '<option value="'+ capability_id +'">'+ device.data[capability_id].title +'</option>';						
					}
				}										
			};	
			let d_css = (_type.capabilities > 0 ? ['x2'] : []); 
			items.push(new Models.ListItem({ id: 'dashboard_device', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.device +'</h4>', value: data.device, options: { values: devices.values, labels: devices.labels }, rel: '', callback: callback_device, css: d_css }));
			if (_type.capabilities > 0) {
				let capabilities = { values: [''], labels: [LANG.forms.options.choose] };
				if (widget != '-1') {
					const device = HOMEY.data.devices[data.device];    							
					if (device) {
						for (const capability_id in device.data) {
							if (data.type != 'GenericAlert' || device.data[capability_id].type == 'string') {
								capabilities.values.push(capability_id);
								capabilities.labels.push(device.data[capability_id].title);					
							}
						}
					}
				}					
				items.push(new Models.ListItem({ id: 'dashboard_capability', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.capability +'</h4>', value: data.capability, options: { values: capabilities.values, labels: capabilities.labels }, css: ['x2'] }));
			}				
		}					
				
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		

		if (icons.length > 1 || _type.themes) items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));						
		if (icons.length > 1) items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.icon +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));													
		if (_type.themes) items.push(new Models.ListItem({ id: 'dashboard_theme', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.theme +'</h4>', value: data.theme, options: { values: _type.themes, labels: _type.themes } }));						
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
		if (_type.update) items.push(new Models.ListItem({ id: 'dashboard_hideupdatetime', type: 'CheckBox', value: data.hideupdatetime, name: '<h4 class="title">'+ LANG.fields.hideupdatetime +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_locked', type: 'CheckBox', value: data.locked, name: '<h4 class="title">'+ LANG.fields.locked +'</h4>', css: ['x3'] }));												
		items.push(new Models.ListItem({ id: 'dashboard_opacity', type: 'CheckBox', value: data.opacity, name: '<h4 class="title">'+ LANG.fields.opacity +'</h4>', css: ['x3'] }));												
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));									
		items.push(new Models.ListItem({ id: 'dashboard_font_size', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', value: data.font.size, options: LANG.forms.options.font_sizes, css: ['x3'] }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: LANG.forms.options.formats.p.y, labels: LANG.forms.options.formats.p.y }, css: ['fl', 'x3'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: LANG.forms.options.formats.l.y, labels: LANG.forms.options.formats.l.y }, css: ['fl', 'x3'] }));				
				
		let colors = [];
		for (const c in LANG.forms.options.colors) colors.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });								
		colors.push({ icon: 'transparent', value: 'transparent' });			
		items.push(new Models.ListItem({ id: 'dashboard_textcolor', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.textcolor + '</h4>', value: data.textcolor, options: colors }));						
		items.push(new Models.ListItem({ id: 'dashboard_color', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.color + '</h4>', value: data.color, options: colors }));						
										
		return items;	
	},
	save: function(data, widget, panel) {							
		let icons = false;
		for (const icon in json_data.icons) {
			if (json_data.icons[icon].includes(data.type)) {
				icons = true;
				break;
			}
		}
		if (icons) data['icon'] = document.getElementById('dashboard_icon').value;				
		const _type = json_data.widgets[data.type];			
		if (_type.devices > 0) {
			const device = document.getElementById('dashboard_device');	
			if (device.value == '') return false;			
			data['device'] = device.value;					
			if (_type.capabilities > 0) {
				const capability = document.getElementById('dashboard_capability');							 
				if (capability.value == '') return false;
				data['capability'] = capability.value;
			}	
			if (data.type == 'Insight') {
				const insight = document.getElementById('dashboard_insight');							 
				if (insight.value == '') return false;				
				const insight_resolution = document.getElementById('dashboard_insight_resolution');							 
				if (insight_resolution.value == '') return false;								
				data['insight']['value'] = insight.value;
				data['insight']['resolution'] = insight_resolution.value;
				data['insight']['type'] = document.getElementById('dashboard_insight_type').value;
				data['insight']['color'] = document.getElementById('dashboard_insight_color').value;
			}
		}		
		
		if (_type.themes) data['theme'] = document.getElementById('dashboard_theme').value;
		
		const mode = document.getElementById('dashboard_mode');					
		if (mode != null) {				
			if (mode.value == '0') return false;			
			data['mode'] = parseInt(mode.value);			
			if (data['mode'] == 1) {
				const flow = document.getElementById('dashboard_flow');
				if (flow.value == '') return false;				
				data['flow'] = flow.value;
				data['logic']['variable'] = '';
				data['logic']['value'] = '';
			} else {
				const logic = document.getElementById('dashboard_logic');
				if (logic.value == '') return false;				
				let logic_value, value;						
				if (HOMEY.data.logics[logic.value] == undefined) value = 0;
				else {
					if (HOMEY.data.logics[logic.value].type == 'boolean') logic_value = document.getElementById('dashboard_logic_value2');							
					else {
						logic_value = document.getElementById('dashboard_logic_value');
						if (logic_value.value == '') return false;						
					}	
					value = logic_value.value;		
					value = (HOMEY.data.logics[logic.value].type != 'string' ? (isNaN(value) ? 0 : parseInt(value)) : value);
				}
				data['flow'] = '';
				data['logic']['variable'] = logic.value;
				data['logic']['value'] = value;
			}
		}	
		const url = document.getElementById('dashboard_url');							
		if (url != null) {						
			if (url.value == '') return false;			
			data['url'] = url.value;
			const fit = document.getElementById('dashboard_image_fit');						
			if (fit != null) {						
				data['image']['fit'] = fit.value;			
			}
			data['refresh'] = parseInt(document.getElementById('dashboard_refresh').value);			
		}
		const image_id = document.getElementById('dashboard_image_id');											
		if (image_id != null) {						
			const image_owner = document.getElementById('dashboard_image_owner');																
			if (image_id.value == '' && image_owner.value == '') return false;						
			data['url'] = '';			
			data['image']['id'] = image_id.value;			
			data['image']['owner'] = image_owner.value;			
			data['image']['fit'] = document.getElementById('dashboard_image_fit').value;			
			data['image']['mode'] = document.getElementById('dashboard_image_mode').value;			
			data['refresh'] = parseInt(document.getElementById('dashboard_refresh').value);			
		}
		return data;				
	}
}