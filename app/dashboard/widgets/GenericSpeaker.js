/*08/07/2024*/
'use strict';
const WidgetGenericSpeaker = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget speaker',
		template: 'widget_genericspeaker',
		current: { cover: '', track: '' },
		events: {
			'touchstart .button': 'touchStart',
			'touchcancel .button': 'touchCancel',
			'touchmove .button': 'touchMove',
			'touchend .button': 'touchEnd',
			'touchstart .volume': 'touchStart',
			'touchcancel .volume': 'touchCancel',
			'touchmove .volume': 'sliderMove',
			'touchend .volume': 'sliderEnd'
		},					
		___render: function() {				
			let buttons = { l: [], c: [], cl: [], cr: [], r: [], v: [] };
			if (this.model.get('data')['speaker_shuffle']) buttons.cl.push({ value: 'speaker_shuffle', icon: 'shuffle', active: this.model.get('data')['speaker_shuffle'].value });
			if (this.model.get('data')['speaker_prev']) buttons.c.push({ value: 'speaker_prev', icon: 'skip-previous', active: true });
			if (this.model.get('data')['speaker_playing']) {
				if (this.model.get('data')['speaker_playing'].value) buttons.c.push({ value: 'speaker_playing', icon: 'pause-circle-outline', active: true });
				else buttons.c.push({ value: 'speaker_playing', icon: 'play-circle-outline', active: false });
			}
			if (this.model.get('data')['speaker_next']) buttons.c.push({ value: 'speaker_next', icon: 'skip-next', active: true });			
			if (this.model.get('data')['speaker_repeat']) {
				switch(this.model.get('data')['speaker_repeat'].value) {
					case 'track':
						buttons.cr.push({ value: 'speaker_repeat', icon: 'repeat-once', active: true });
						break;
					case 'playlist':
						buttons.cr.push({ value: 'speaker_repeat', icon: 'repeat', active: true });
						break;
					default:
						buttons.cr.push({ value: 'speaker_repeat', icon: 'repeat-off', active: false });
						break;
				}			
			}
			if (this.model.get('data')['volume_mute']) {
				if (this.model.get('data')['volume_mute'].value) buttons.l.push({ value: 'volume_mute', icon: 'volume-mute', active: false });
				else buttons.l.push({ value: 'volume_mute', icon: 'volume-high', active: true });
			}			
			if (this.model.get('data')['volume_set']) {
				buttons.v.push({ value: 'down', icon: 'volume-minus', active: true });								
				buttons.v.push({ value: 'up', icon: 'volume-plus', active: true });
			}
			this.model.set('buttons', buttons);	
			if (HOMEY.data.devices[this.model.get('widget').device] != undefined) {
				let covers = HOMEY.data.devices[this.model.get('widget').device].images;					
				if (covers.length > 0) {
					if (this.model.get('data')['speaker_track'] && this.model.get('data')['speaker_track'] != this.current.track) {
						const now = Date.now();					
						this.current.track = this.model.get('data')['speaker_track'];				
						this.current.cover = Homey.imgBaseUrl() + covers[0] + '?sdash='+ now;
					}
				}
			}
			this.model.set('cover', this.current.cover);			
			this.model.set('volume_max', (this.model.get('widget')['params']['limit'] ? this.model.get('widget')['params']['limit'] : 1));			
		},
		domRefresh: function() {						
			this.checkCapabilityStatus('speaker_playing', 'on');		
		},
		sliderMove: function(event, childElement) {			
			this.isTouching = false;
			this.isMoving = true;		
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'set':				
					childElement.setAttribute('data-value', Math.round(childElement.value * 100) + '%');							
					break;			
			}			
		},		
		sliderEnd: function(event, childElement) {				
			const device = this.model.get('widget').device;		
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'set':
					if (this.model.get('data')['volume_set'].setable) this.updateCapability(device, 'volume_set', (childElement.value * 1));	
					break;
			}		
			return true;											
		},
		___touchEnd: function(event, childElement) {		
			const device = this.model.get('widget').device;
			const op = childElement.getAttribute('data-op');		
			let value;
			let capability;
			let target;
			capability = op;
			switch(op)	{
				case 'up':				
					capability = 'volume_set';				
					target = this.model.get('data')[capability];				
					if (target.value + 0.01 <= target.max) value = target.value + 0.01;
					break;
				case 'down':				
					capability = 'volume_set';
					target = this.model.get('data')[capability];
					if (target.value + 0.01 >= target.min) value = target.value - 0.01;				
					break;
				case 'speaker_prev':
				case 'speaker_next':				
					value = true;
					break;
				case 'speaker_repeat':
					target = this.model.get('data')[capability];									
					if (target.value == 'none') value = 'track';
					else if (target.value == 'track') value = 'playlist';
					else value = 'none';
					break;
				case 'speaker_shuffle':				
				case 'speaker_playing':
				case 'volume_mute':
					target = this.model.get('data')[capability];				
					value = !target.value;
					break;			
			}							
			if (this.model.get('data')[capability].setable) this.updateCapability(device, capability, value);
			return false;
		}
	}),
	edit: function(data, widget, panel) {						
		let items = [];		
						
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));	
		
		let _type = json_data.widgets[data.type];		
		if (_type.devices > 0) {			
			let devices = { values: [''], labels: [LANG.forms.options.choose] };
			for (const device_id in HOMEY.data.devices) {			
				const device = HOMEY.data.devices[device_id];    											
				if (data.type == 'GenericSpeaker' && device.type == 'speaker') {					
					devices.values.push(device_id);
					devices.labels.push(device.name +' ('+ HOMEY.data.zones[device.zone].name +')');
				}
			}			
			const callback_device = function(rel, value) { 		
				const device = HOMEY.data.devices[value];    							
				let name = document.getElementById('dashboard_name');
				if (name.value == '') name.value = device.name;														
			};	
			items.push(new Models.ListItem({ id: 'dashboard_device', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.device +'</h4>', value: data.device, options: { values: devices.values, labels: devices.labels }, rel: '', callback: callback_device }));
		}					
				
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_image_mode', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.mode +'</h4>', value: data.image.mode, options: { values: ['thumb', 'fullscreen'], labels: ['Thumb', 'fullscreen'] } }));										
		items.push(new Models.ListItem({ id: 'dashboard_image_fit', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_fit +'</h4>', value: data.image.fit, options: LANG.forms.options.image.fit, css: ['x2'] }));										
		items.push(new Models.ListItem({ id: 'dashboard_params_limit', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.params_volume_max +'</h4>', value: data.params.limit, options: LANG.forms.options.limit }));						
		if (_type.themes) items.push(new Models.ListItem({ id: 'dashboard_theme', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.theme +'</h4>', value: data.theme, options: { values: _type.themes, labels: _type.themes } }));						
		
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
		const device = document.getElementById('dashboard_device');	
		if (device.value == '') return false;			
		data['device'] = device.value;			
		data['image']['fit'] = document.getElementById('dashboard_image_fit').value;			
		data['image']['mode'] = document.getElementById('dashboard_image_mode').value;							
		data['params']['limit'] = document.getElementById('dashboard_params_limit').value;			
		data['theme'] = document.getElementById('dashboard_theme').value;
	
		return data;				
	}

}