/*10/05/2024*/
'use strict';
const WidgetTHSensor = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget thsensor',
		template: 'widget_thsensor',
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save		
}