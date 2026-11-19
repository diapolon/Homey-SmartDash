/*28/12/2024*/
'use strict';
const WidgetSeparator = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget title',
		template: 'widget_separator'	
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
		items.push(new Models.ListItem({ id: 'dashboard_icon', type: 'IconPicker', name: '<h4 class="title">'+ LANG.fields.icon +'</h4>', placeholder: LANG.fields.icon_default, name_custom: LANG.fields.icon_custom, value: data.icon, options: icons }));											
				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>' }));			
		items.push(new Models.ListItem({ id: 'dashboard_font_size', type: 'SelectList', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', value: data.font.size, options: LANG.forms.options.font_sizes, css: ['x3'] }));					
		items.push(new Models.ListItem({ id: 'dashboard_dimension_portrait', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_portrait +'</h4>', values: data.dimension.p.split('x'), options: { values: LANG.forms.options.formats.p.x, labels: LANG.forms.options.formats.p.x }, options_y: { values: [1], labels: [1] }, css: ['fl', 'x3'] }));				
		items.push(new Models.ListItem({ id: 'dashboard_dimension_landscape', type: 'Size', name: '<h4 class="title">'+ LANG.fields.dimension_landscape +'</h4>', values: data.dimension.l.split('x'), options: { values: LANG.forms.options.formats.l.x, labels: LANG.forms.options.formats.l.x }, options_y: { values: [1], labels: [1] }, css: ['fl', 'x3'] }));				

		let colors = [];
		for (let c in LANG.forms.options.colors) colors.push({ icon: LANG.forms.options.colors[c], value: LANG.forms.options.colors[c] });								
		colors.push({ icon: 'transparent', value: 'transparent' });		
		items.push(new Models.ListItem({ id: 'dashboard_textcolor', type: 'ColorPicker', name: '<h4 class="title">'+ LANG.fields.textcolor + '</h4>', value: data.textcolor, options: colors }));						
				
		return items;
	},
	save: AbstractWidget.save			
}