/*10/05/2024*/
'use strict';
const WidgetUnknown = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget unknown',
		template: 'widget_unknown',	
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}
