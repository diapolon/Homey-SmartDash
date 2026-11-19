/*10/05/2024*/
'use strict';
const WidgetWeather = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget weather',
		template: 'widget_weather',
		_domReady: function() {			    	
		},
		___render: function() {
		    let data = this.model.get('data');
			this.model.set('weather', getWeatherDevice(data));				
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}