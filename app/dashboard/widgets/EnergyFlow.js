/*08/01/2025*/
'use strict';
const WidgetEnergyFlow = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget energyflow',
		template: 'widget_energyflow'			
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));		
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		let devices = [];						
		devices[0] = { values: [""], labels: [LANG.forms.options.device] };						
		devices[1] = { values: [""], labels: [LANG.forms.options.device] };						
		devices[2] = { values: [""], labels: [LANG.forms.options.device] };						
		devices[3] = { values: [""], labels: [LANG.forms.options.device] };						
		for (const device_id in HOMEY.data.devices) {						
			const device = HOMEY.data.devices[device_id]; 
			if (device.type == 'solarpanel' && device.data['measure_power']) {
				devices[0].values.push(device_id +'-measure_power');
				devices[0].labels.push(device.name +' - '+ device.data['measure_power'].title);
			}
			if (device.data['measure_battery'] != undefined && ['sensor', 'button'].indexOf(device.type) == -1) {
				devices[1].values.push(device_id +'-measure_battery');
				devices[1].labels.push(device.name +' - '+ device.data['measure_battery'].title);
			}
			if (device.data['grid_power'] != undefined) {
				devices[2].values.push(device_id +'-grid_power');
				devices[2].labels.push(device.name +' - '+ device.data['grid_power'].title);
			}
			if (device.data['home_power'] != undefined) {
				devices[3].values.push(device_id +'-home_power');
				devices[3].labels.push(device.name +' - '+ device.data['home_power'].title);
			}
			for (const capability_id in device.data) {
				if (capability_id.includes('measure_power') && ['light', 'button'].indexOf(device.type) == -1) {					
					devices[2].values.push(device_id +'-'+ capability_id);
					devices[2].labels.push(device.name +' - '+ device.data[capability_id].title);
					devices[3].values.push(device_id);
					devices[3].labels.push(device.name +' - '+ device.data[capability_id].title);
				}
			}			
		}		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.devices +'</h2>' }));															
		
		let data_devices = [];		
		for (let i = 0; i < 4; i++) data_devices.push({ 'device': '' });
		
		if (widget != '-1') {
			let energyflow_devices = data.device.split('|');
			for (const i in energyflow_devices) {			
				data_devices[i].device = energyflow_devices[i];
			}	
		}
				
		items.push(new Models.ListItem({ id: 'dashboard_device0', name: '<h4 class="title">'+ LANG.labels.powerwall.solar +'</h4>', type: 'SelectList', value: data_devices[0].device, options: { values: devices[0].values, labels: devices[0].labels } }));
		items.push(new Models.ListItem({ id: 'dashboard_device1', name: '<h4 class="title">'+ LANG.labels.powerwall.battery +'</h4>', type: 'SelectList', value: data_devices[1].device, options: { values: devices[1].values, labels: devices[1].labels } }));		
		items.push(new Models.ListItem({ id: 'dashboard_device2', name: '<h4 class="title">'+ LANG.labels.powerwall.grid +'</h4>', type: 'SelectList', value: data_devices[2].device, options: { values: devices[2].values, labels: devices[2].labels } }));
		items.push(new Models.ListItem({ id: 'dashboard_device3', name: '<h4 class="title">'+ LANG.labels.powerwall.home +'</h4>', type: 'SelectList', value: data_devices[3].device, options: { values: devices[3].values, labels: devices[3].labels } }));
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));									
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
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
		let energyflow_devices = [];
		for (let i = 0 ; i < 4; i++) {
			const device = document.getElementById('dashboard_device'+ i);	
			if (i == 0 && device.value == '') return false;				
			energyflow_devices.push(device.value);			
		}	
				
		data['device'] = energyflow_devices.join('|');
		
		return data;				
	}
}