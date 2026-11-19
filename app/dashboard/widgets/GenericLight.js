/*10/05/2024*/
'use strict';
const WidgetGenericLight = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget genericlight',
		template: 'widget_genericlight',
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
				case 'dim':				
					childElement.setAttribute('data-value', Math.round(childElement.value * 100) + '%');							
					break;			
			}			
		},		
		sliderEnd: function(event, childElement) {				
			const device = this.model.get('widget').device;		
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'dim':
					if (this.model.get('data')['dim'].setable) this.updateCapability(device, 'dim', (childElement.value * 1));	
					break;
			}		
			return true;											
		},	
		___touchEnd: function(event, childElement) {		
			const device = this.model.get('widget').device;
			if (this.model.get('data')['onoff'].setable) this.updateCapability(device, 'onoff', !this.model.get('data')['onoff'].value);						
			return true;
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}