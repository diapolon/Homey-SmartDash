/*28/12/2024*/
'use strict';
const WidgetDummy = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget dummy',
		template: 'widget_dummy'	
	}),
	edit: function(data, widget, panel) {								
		let items = [];		
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));			
		items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name }));		
		
		let icons = [];
		for (const icon in json_data.icons) {			
			if (json_data.icons[icon].includes(data.type)) icons.push(icon);
		}
		for (const icon in json_data.allicons) icons.push(json_data.allicons[icon]);
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));						
		items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.icon +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));											
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: LANG.forms.options.formats.p.y, labels: LANG.forms.options.formats.p.y }, css: ['fl', 'x2'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: LANG.forms.options.formats.l.y, labels: LANG.forms.options.formats.l.y }, css: ['fl', 'x2'] }));				
				
		return items;
	},
	save: AbstractWidget.save			
}