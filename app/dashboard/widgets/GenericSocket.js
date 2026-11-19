/*10/05/2024*/
'use strict';
const WidgetGenericSocket = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget genericsocket',
		template: 'widget_genericsocket',
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},			
		domRefresh: function() {				
			this.checkCapabilityStatus('onoff', 'on');
		},
		___touchEnd: function(event, childElement) {					
			const device = this.model.get('widget').device;		
			if (this.model.get('data')['onoff'].setable) this.updateCapability(device, 'onoff', !this.model.get('data')['onoff'].value);						
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}