/*10/05/2024*/
'use strict';
const WidgetGenericCapability = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget genericcapability',
		template: 'widget_genericcapability',
		___render: function() {				
			const capability = this.model.get('widget').capability;			
			if (capability) {				
				if (this.model.get('data')[capability]) {
					if (this.model.get('data')[capability].type == 'boolean') this.checkCapabilityStatus(capability, 'on');								
					switch(capability) {
						case 'measure_power':
						case 'meter_power':
							break;
						default:
							if (capability.includes('_power')) this.setPower(capability);										
					}
					this.model.set('capability', this.model.get('data')[capability]);					
				}
			}
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}