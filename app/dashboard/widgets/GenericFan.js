/*10/05/2024*/
'use strict';
const WidgetGenericFan = {
	dashboard: WidgetGenericLight.dashboard.extend({
		className: 'widget genericlight genericfan',
		template: 'widget_genericfan',
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}