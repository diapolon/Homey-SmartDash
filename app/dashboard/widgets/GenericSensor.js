/*27/12/2024*/
'use strict';
const WidgetGenericSensor = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget genericsensor sensor',
		template: 'widget_genericsensor',	
		capabilities: ['presence', 'alarm_contact', 'alarm_motion', 'alarm_motion_presence', 'alarm_tamper'],
		domRefresh: function() {				
			for (const capability of this.capabilities) {
				this.checkCapabilityStatus(capability, 'alarm');    		
			}
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}