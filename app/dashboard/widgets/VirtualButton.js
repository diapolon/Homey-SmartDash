/*28/12/2024*/
'use strict';
const WidgetVirtualButton = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget virtualbutton',
		template: 'widget_virtualbutton',
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
			let self = this;		
			const logic = this.model.get('widget').logic;
		    if (logic.variable != '' && HOMEY.data.logics[logic.variable] != undefined && HOMEY.data.logics[logic.variable].type == 'boolean' && logic.value == 2) {					    					
		    	Homey.getVariable(logic.variable, function(json) {		    
		    		if (json.value) self.el.classList.add('on');				
		    		else self.el.classList.remove('on');				
		    	}, function(json) {			
				});			    
			}
		},
		refresh: function() {				
		    this.domRefresh();		
		},	
		___touchEnd: function(event, childElement) {								
			const mode = this.model.get('widget').mode;
			let self = this;
			const start = function() {
				System.notify_beep();
				self.el.classList.add('shadow');
			}
			const end_ok = function(response) {			
				window.setTimeout(function () { 			
					Data.update_check();				
					window.setTimeout(function () { 			
						self.el.classList.remove('shadow');			
					}, 500);			
				}, 200);			
			}		
			const end_ko = function(response) { 
				self.el.classList.remove('shadow'); 
			};
			switch(mode) {
				case 1:
					const flow = this.model.get('widget').flow;		
					if (flow != '') {			
						if (HOMEY.data.flows[flow] != undefined) {
							const adv = (HOMEY.data.flows[flow].adv == 0 ? '' : 'advanced');
							start();						
							Homey.executeFlow(flow, adv, end_ok, end_ko);						
						} else System.notify_alert('Flow "'+ flow +'" don\'t exist', LANG.notify.title.error);
						return true;
					}
					break;
				case 2:
					const logic = this.model.get('widget').logic;
					if (logic.variable != '') {									
						if (HOMEY.data.logics[logic.variable] != undefined) {						
							const callback = function(value) {
								start();
								Homey.setVariable(logic.variable, { value: value }, end_ok, end_ko);
							};								
							if (HOMEY.data.logics[logic.variable].type == 'boolean') {
								if (logic.value == 2) {
									if (self.el.classList.contains('on')) callback(false);
									else callback(true);
								} else callback(logic.value == 1);			
							} else callback(logic.value);
						} else System.notify_alert('Variable "'+ logic.variable +'" don\'t exist', LANG.notify.title.error);
						return true;
					}
					break;			
			}
			return false;
		}
	}),
	edit: function(data, widget, panel) {						
		let items = [];		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));	
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
			
		let css_flow = (data.mode == 1 ? ['x1', 'flow'] : ['x1', 'flow', 'hide']);
		let css_logic = (data.mode == 2 ? ['x1', 'logic'] : ['x1', 'logic', 'hide']);
		let css_logic_value = (data.mode == 2 ? ['logic_value', 'logic1', 'required'] : ['logic_value', 'logic1', 'required', 'hide']);
		let css_logic_value2 = (data.mode == 2 ? ['logic_value', 'logic2'] : ['logic_value', 'logic2', 'hide']);
		if (data.logic.variable != '' && HOMEY.data.logics[data.logic.variable] && HOMEY.data.logics[data.logic.variable].type == 'boolean') css_logic_value.push('hide');
		if (data.logic.variable != '' && HOMEY.data.logics[data.logic.variable] && HOMEY.data.logics[data.logic.variable].type != 'boolean') css_logic_value2.push('hide');
		
		const callback_mode = function(rel, value) { 		
			let mode = document.getElementById('dashboard_mode');
			let flows = document.getElementsByClassName('flow');			
			let logics = document.getElementsByClassName('logic');			
			let logics_value = document.getElementsByClassName('logic_value');			
			for (let i = 0; i < logics_value.length; i++) logics_value[i].classList.add('hide');																								
			switch(parseInt(mode.value))	 {	
				case 1:							
					for (let i = 0; i < logics.length; i++) logics[i].classList.add('hide');																															
					for (let i = 0; i < flows.length; i++) flows[i].classList.remove('hide');																	
					break;
				case 2:							
					for (let i = 0; i < flows.length; i++) flows[i].classList.add('hide');																								
					for (let i = 0; i < logics.length; i++) logics[i].classList.remove('hide');																	
					break;
				default:
					for (let i = 0; i < logics.length; i++) logics[i].classList.add('hide');																															
					for (let i = 0; i < flows.length; i++) flows[i].classList.add('hide');																	
			}
		};														
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));	
		items.push(new Models.ListItem({ id: 'dashboard_mode', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.mode +'</h4>', value: data.mode, options: LANG.forms.options.mode, rel: '', callback: callback_mode, css: ['x3'] }));
		
		let flows = { values: [""], labels: [LANG.forms.options.choose] };
		for (const flow_id in HOMEY.data.flows) {
			flows.values.push(flow_id);
			flows.labels.push(HOMEY.data.flows[flow_id].name);					
		}						
		items.push(new Models.ListItem({ id: 'dashboard_flow', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.flow +'</h4>', value: data.flow, options: { values: flows.values, labels: flows.labels }, css: css_flow }));					
	
		const callback_logic = function(rel, value) { 		
			let logic = document.getElementById('dashboard_logic');
			let logic_value = document.getElementsByClassName('logic1');			
			let logic_value2 = document.getElementsByClassName('logic2');								
			if (logic.value != '') {		
				switch(HOMEY.data.logics[logic.value].type)	 {	
					case 'boolean':
						for (let i = 0; i < logic_value.length; i++) logic_value[i].classList.add('hide');																								
						for (let i = 0; i < logic_value2.length; i++) logic_value2[i].classList.remove('hide');																									
						break;
					case 'number':
					case 'string':
						for (let i = 0; i < logic_value.length; i++) logic_value[i].classList.remove('hide');																								
						for (let i = 0; i < logic_value2.length; i++) logic_value2[i].classList.add('hide');																	
					break;						
				}
			}
		};					
		let logics = { values: [""], labels: [LANG.forms.options.choose] };
		for (const logic_id in HOMEY.data.logics) {
			logics.values.push(logic_id);
			logics.labels.push(HOMEY.data.logics[logic_id].name +'('+ HOMEY.data.logics[logic_id].type +')');					
		}		
		items.push(new Models.ListItem({ id: 'dashboard_logic', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.logic +'</h4>', value: data.logic.variable, options: { values: logics.values, labels: logics.labels }, rel: '', callback: callback_logic, css: css_logic }));							
		items.push(new Models.ListItem({ id: 'dashboard_logic_value', type: 'TextBox', name: '<h4 class="title">'+ LANG.fields.logic_value +'</h4>', value: data.logic.value, css: css_logic_value }));							
		items.push(new Models.ListItem({ id: 'dashboard_logic_value2', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.logic_value +'</h4>', value: data.logic.value, options: LANG.forms.options.boolean, css: css_logic_value2 }));					
	
		let icons = [];
		for (const icon in json_data.icons) {			
			if (json_data.icons[icon].includes('VirtualButton')) icons.push(icon);
		}
				
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