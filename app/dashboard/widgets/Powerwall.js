/*10/05/2024*/
'use strict';
const WidgetPowerwall = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget powerwall',
		template: 'widget_powerwall',
		___render: function() {					
			if (this.model.get('data')['home_power']) this.setPower('home_power');										
			if (this.model.get('data')['solar_power']) this.setPower('solar_power');										
			if (this.model.get('data')['grid_power']) this.setPower('grid_power');										
		}	
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}