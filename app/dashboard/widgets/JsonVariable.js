/*08/07/2024*/
'use strict';
const WidgetJsonVariable = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget jsonvariable',
		template: 'widget_jsonvariable',	
		___render: function() {
			this.hideupdate = (this.model.get('widget').hideupdatetime == 1);
		},
		_domReady: function() {			
			this.el.classList.add('shadow');
			this.info = this.el.getElementsByClassName('list')[0];	    	
			if (!this.hideupdate) this.update = this.el.getElementsByClassName('update')[0];	    	
			this.domRefresh();		
		},
		domRefresh: function() {						
			const logic = this.model.get('widget').logic;
		    if (logic.variable != '' && HOMEY.data.logics[logic.variable] != undefined) {					    							    	 
		    	let self = this;		
		    	Homey.getVariable(logic.variable, function(json) {		    
		    		const data = JSON.parse(json.value);
					let html = '';
					for (const v in data) {		
						html += '<li><div class="col8 fl">'+v +'</div><div class="col4 fr strong right">'+ data[v] +'</div><div class="clear"></div></li>';
					}					
					self.info.innerHTML = html;
					if (!self.hideupdate) self.update.innerHTML = getTime(new Date(), '?');
					self.el.classList.remove('shadow');
		    	}, function(json) {			
		    		self.el.classList.remove('shadow');
				});			    
			} else {
				this.el.classList.remove('shadow');
				this.info.innerHTML = '<li>Variable "'+ logic.variable +'" don\'t exist</li>';							
			}			
		},
		refresh: function() {				
		    this.domRefresh();		
		}			
	}),
	edit: function(data, widget, panel) {						
		let items = [];		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));	
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		let logics = { values: [""], labels: [LANG.forms.options.choose] };
		for (const logic_id in HOMEY.data.logics) {
			if (HOMEY.data.logics[logic_id].type == 'string') {	
				logics.values.push(logic_id);
				logics.labels.push(HOMEY.data.logics[logic_id].name);					
			}
		}
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));					
		items.push(new Models.ListItem({ id: 'dashboard_logic', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.logic +'</h4>', value: data.logic.variable, options: { values: logics.values, labels: logics.labels }, rel: '' }));					
		items.push(new Models.ListItem({ id: 'dashboard_mode', type: 'Hidden', value: '2' }));					
		items.push(new Models.ListItem({ id: 'dashboard_logic_value', type: 'Hidden', value: '-' }));					
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.aspect +'</h2>' }));					
		items.push(new Models.ListItem({ id: 'dashboard_hidename', type: 'CheckBox', value: data.hidename, name: '<h4 class="title">'+ LANG.fields.hidename +'</h4>', css: ['x3'] }));								
		items.push(new Models.ListItem({ id: 'dashboard_hideupdatetime', type: 'CheckBox', value: data.hideupdatetime, name: '<h4 class="title">'+ LANG.fields.hideupdatetime +'</h4>', css: ['x3'] }));								
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