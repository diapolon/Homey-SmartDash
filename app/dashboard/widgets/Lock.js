/*21/05/2024*/
'use strict';
const WidgetLock = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget lock',
		template: 'widget_lock',
		events: {
			'touchstart': 'touchStart',
			'touchcancel': 'touchCancel',
			'touchmove': 'touchMove',
			'touchend': 'touchEnd'
		},			
		domRefresh: function() {				
			this.checkCapabilityStatus('locked', 'on');
		},
		___touchEnd: function(event, childElement) {					
			const device = this.model.get('widget').device;		
			if (this.model.get('data')['locked'].setable) this.updateCapability(device, 'locked', !this.model.get('data')['locked'].value);						
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}