/*10/05/2024*/
'use strict';
const WidgetSolarPanel = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget solarpanel',
		template: 'widget_solarpanel'			
	}),	
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}