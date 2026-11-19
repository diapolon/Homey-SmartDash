/*28/12/2024*/
'use strict';
const WidgetVideoPlayer = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget videoplayer',
		template: 'widget_videoplayer',
		timer: undefined,
		play: false,
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},			
		_domReady: function() {			    	
			this.domRefresh();		
		},
		domRefresh: function() {						
			const logic = this.model.get('widget').logic;
			const uri = this.model.get('widget').url;
		    if (logic.variable != '' && HOMEY.data.logics[logic.variable] != undefined && uri != '') {					    					
		    	if (this.play) return;
		    	let self = this;		
		    	Homey.getVariable(logic.variable, function(json) {		    
		    		if (json.value) {		    			
		    			Homey.setVariable(logic.variable, { value: false });
		    			document.getElementById(self.id).click();
		    			self._play(uri);
		    		}
		    	}, function(json) {			
				});			    
			}
		},
		refresh: function() {				
		    this.domRefresh();		
		},
		_play: function(uri) {				
			let self = this;		
			this.play = true;
		 	if (CONFIG.emulated) alert('play');
			else window.plugins.streamingMedia.playVideo(uri, { successCallback: function() { self.play = false; }, errorCallback: function() { self.play = false; }, shouldAutoClose: true, controls: true });							
			const timeout = this.model.get('widget').refresh;
			if (timeout > 0) {
				if (this.timer == undefined) {
					const callbackTimeout = function() { 
						self.play = false
						if (CONFIG.emulated) alert('close');
						else window.plugins.streamingMedia.stopVideo(); 
					};
					this.timer = new Timer(callbackTimeout, timeout);
				}
				this.timer.restart();
			}
		},
		___touchEnd: function(event, childElement) {					
			const uri = this.model.get('widget').url;			
			if (uri != '') this._play(uri);			
		}
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
				
		let icons = [];
		for (const icon in json_data.icons) {			
			if (json_data.icons[icon].includes(data.type)) icons.push(icon);
		}
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));	
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));			
		items.push(new Models.ListItem({ id: 'dashboard_url', type: 'TextBox', name: '<h4 class="title">'+ LANG.fields.url +'</h4>', value: data.url, css: ['x1', 'required'] }));
		items.push(new Models.ListItem({ id: 'dashboard_refresh', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.autoclose +'</h4>', value: data.refresh, options: LANG.forms.options.timeout, css: ['x3'] }));					
		
		
		let logics = { values: ["0"], labels: [LANG.forms.options.none] };
		for (const logic_id in HOMEY.data.logics) {
			if (HOMEY.data.logics[logic_id].type == 'boolean') {
				logics.values.push(logic_id);
				logics.labels.push(HOMEY.data.logics[logic_id].name);					
			}
		}		
		items.push(new Models.ListItem({ id: 'dashboard_logic', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.logic +'</h4>', value: data.logic.variable, options: { values: logics.values, labels: logics.labels } }));					
		items.push(new Models.ListItem({ id: 'dashboard_mode', type: 'Hidden', value: 2 }));
		items.push(new Models.ListItem({ id: 'dashboard_logic_value', type: 'Hidden', value: 0 }));
		items.push(new Models.ListItem({ id: 'dashboard_logic_value2', type: 'Hidden', value: 0 }));
				
		items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.icon +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));											
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_locked', type: 'CheckBox', value: data.locked, name: '<h4 class="title">'+ LANG.fields.locked +'</h4>', css: ['x3'] }));									
		items.push(new Models.ListItem({ id: 'dashboard_opacity', type: 'CheckBox', value: data.opacity, name: '<h4 class="title">'+ LANG.fields.opacity +'</h4>', css: ['x3'] }));												
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));							
		items.push(new Models.ListItem({ id: 'dashboard_font_size', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', value: data.font.size, options: LANG.forms.options.font_sizes, css: ['x3'] }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: LANG.forms.options.formats.p.y, labels: LANG.forms.options.formats.p.y }, css: ['fl', 'x3'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: LANG.forms.options.formats.l.y, labels: LANG.forms.options.formats.l.y }, css: ['fl', 'x3'] }));				

		let colors = [];
		for (let c in LANG.forms.options.colors) colors.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });										
		colors.push({ icon: 'transparent', value: 'transparent' });										
		items.push(new Models.ListItem({ id: 'dashboard_textcolor', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.textcolor + '</h4>', value: data.textcolor, options: colors }));								
		items.push(new Models.ListItem({ id: 'dashboard_color', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.color + '</h4>', value: data.color, options: colors }));						
		
		return items;
	},
	save: AbstractWidget.save			
}