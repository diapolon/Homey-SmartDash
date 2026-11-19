/*28/12/2024*/
'use strict';
const WidgetVirtualCamera = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget virtualcamera',
		template: 'widget_virtualcamera',
		daemon: undefined,
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},	
		___render: function() {		
			this.hideupdate = (this.model.get('widget').hideupdatetime == 1);
			this.separator = (this.model.get('widget')['url'].includes('?') ? '&' : '?');			
		},
		_domReady: function() {		
			this.img = this.el.getElementsByClassName('img')[0];	    	
			if (!this.hideupdate) this.update = this.el.getElementsByClassName('update')[0];	    	
			
			if (this.model.get('widget')['refresh'] != undefined && this.model.get('widget')['refresh'] > 0) {			
				let self = this;				
				this.daemon = new Daemon(function() { self._refreshImage(); }, this.model.get('widget')['refresh']);
				this.daemon.start();
			}	
			this._refreshImage();
		},		
		_onClose: function() { 
			if (this.daemon) {
				this.daemon.stop();			
				this.daemon = undefined;
			}
		},
		refresh: function() {										
		},
		_refreshImage: function() {		
			const now = Date.now();					
			this.img.src = this.model.get('widget')['url'] +this.separator +'sdash='+ now;
			if (!this.hideupdate) this.update.innerHTML = getTime(now, '?');
		},
		___touchEnd: function(event, childElement) {								
			this._refreshImage();
		}
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));			
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));		
		items.push(new Models.ListItem({ id: 'dashboard_url', type: 'TextBox', name: '<h4 class="title">'+ LANG.fields.url +'</h4>', value: data.url }));		
		items.push(new Models.ListItem({ id: 'dashboard_image_fit', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.image_fit +'</h4>', value: data.image.fit, options: LANG.forms.options.image.fit, css: ['x2'] }));										
		items.push(new Models.ListItem({ id: 'dashboard_refresh', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.refresh +'</h4>', value: data.refresh, options: LANG.forms.options.refresh, css: ['x2'] }));					
		
		let icons = [];
		for (const icon in json_data.icons) {			
			if (json_data.icons[icon].includes(data.type)) icons.push(icon);
		}
		if (icons.length > 1) {							
			items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.placeholder +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));											
		}
		
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