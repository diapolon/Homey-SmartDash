/*08/07/2024*/
'use strict';
const WidgetIframe = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget iframe',
		template: 'widget_iframe',
		daemon: undefined,
		_domReady: function() {			    	
			this.iframe = this.el.getElementsByClassName('ifr')[0];	    				
			if (this.model.get('widget')['refresh'] != undefined && this.model.get('widget')['refresh'] > 0) {			
				let self = this;				
				this.daemon = new Daemon(function() { self.iframe.src += ''; }, this.model.get('widget')['refresh']);
				this.daemon.start();
			}	
		},		
		_onClose: function() { 
			if (this.daemon) {
				this.daemon.stop();			
				this.daemon = undefined;
			}
		},
		refresh: function() {										
		}		
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));		
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));				
		items.push(new Models.ListItem({ id: 'dashboard_url', type: 'TextBox', name: '<h4 class="title">'+ LANG.fields.url +'</h4>', value: data.url, css: ['x1', 'required'] }));		
		items.push(new Models.ListItem({ id: 'dashboard_refresh', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.refresh +'</h4>', value: data.refresh, options: LANG.forms.options.refresh, css: ['x3'] }));					
		
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
