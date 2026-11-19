/*10/05/2024*/
'use strict';
const WidgetSMSensor = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget smsensor',
		template: 'widget_smsensor'	
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}