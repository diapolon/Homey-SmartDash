/*10/05/2024*/
'use strict';
const WidgetPresenceSensor = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget presencesensor',
		template: 'widget_presencesensor',
		capabilities: ['presence', 'alarm_motion_presence'],
		domRefresh: function() {		
			for (const capability of this.capabilities) {
				this.checkCapabilityStatus(capability, 'active');    		
			}
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}