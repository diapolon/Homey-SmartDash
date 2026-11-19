/*10/05/2024*/
'use strict';
const WidgetLightRGB = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget lightrgb',
		template: 'widget_lightrgb',
		events: {
			'touchstart .button': 'touchStart',
			'touchcancel .button': 'touchCancel',
			'touchmove .button': 'touchMove',
			'touchend .button': 'touchEnd',
			'touchstart .slider': 'touchStart',
			'touchcancel .slider': 'touchCancel',
			'touchmove .slider': 'sliderMove',
			'touchend .slider': 'sliderEnd'
		},			
		domRefresh: function() {					
			this.checkCapabilityStatus('onoff', 'on');
		},		
		sliderMove: function(event, childElement) {
			this.isTouching = false;
			this.isMoving = true;			
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'hue':											
					break;
				case 'temperature':					
					break;						
				case 'saturation':
					childElement.style.filter = 'saturate('+ childElement.value +')';
					break;		
				case 'dim':				
					childElement.setAttribute('data-value', Math.round(childElement.value * 100) + '%');							
					break;			
			}
		},		
		sliderEnd: function(event, childElement) {				
			const device = this.model.get('widget').device;		
			const op = childElement.getAttribute('data-op');		
			let value;
			let capability;			
			switch(op)	{
				case 'temperature':				
					capability = 'light_temperature';				
					value = (childElement.value * 1);					
					break;
				case 'hue':						
					capability = 'light_hue';				
					value = (childElement.value * 1);										
					break;
				case 'saturation':				
					capability = 'light_saturation';				
					value = (childElement.value * 1);					
					break;
				case 'dim':
					capability = 'dim';				
					value = (childElement.value * 1);					
					break;
			}				
			if (this.model.get('data')[capability].setable) this.updateCapability(device, capability, value);
			return true;											
		},	
		___touchEnd: function(event, childElement) {		
			const device = this.model.get('widget').device;
			const op = childElement.getAttribute('data-op');					
			let value;
			let capability;			
			switch(op)	{
				case 'mode':				
					value = childElement.getAttribute('data-value');						
					capability = 'light_mode';									
					break;
				case 'onoff':
					capability = 'onoff';				
					value = !this.model.get('data')['onoff'].value;
					break;
			}					
			if (this.model.get('data')[capability].setable) this.updateCapability(device, capability, value);
			return true;
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}