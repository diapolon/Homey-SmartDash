/*10/05/2024*/
'use strict';
const WidgetTest = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget test',
		template: 'widget_test',
		timer: undefined,
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},			
		___touchEnd: function(event, childElement) {					
			alert('test');
		}
	}),
	edit: AbstractWidget.edit,			
	save: AbstractWidget.save			
}