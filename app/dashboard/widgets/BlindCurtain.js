/*22/05/2024*/
'use strict';
const WidgetBlindCurtain = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget blindcurtain',
		template: 'widget_blindcurtain',
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
			this.checkCapabilityStatus('windowcoverings_set', 'on');
		},		
		sliderMove: function(event, childElement) {			
			this.isTouching = false;
			this.isMoving = true;			
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'covering':				
					childElement.setAttribute('data-value', Math.round(childElement.value * 100) + '%');							
					break;			
			}			
		},		
		sliderEnd: function(event, childElement) {				
			const device = this.model.get('widget').device;		
			const op = childElement.getAttribute('data-op');		
			switch(op)	{
				case 'covering':				
					if (this.model.get('data')['windowcoverings_set'].setable) this.updateCapability(device, 'windowcoverings_set', (childElement.value * 1));	
					break;			
			}			
			return true;											
		},
		___touchEnd: function(event, childElement) {				
			const device = this.model.get('widget').device;		
			const op = childElement.getAttribute('data-op');				
			switch(op)	{			
				case 'up':
				case 'idle':
				case 'down':							
					if (this.model.get('data')['windowcoverings_state'].setable) this.updateCapability(device, 'windowcoverings_state', op);
					break;
				case 'set':
					if (this.model.get('data')['windowcoverings_set'].setable) this.updateCapability(device, 'windowcoverings_set', (childElement.getAttribute('data-value') * 1));	
					break;
			}
			return true;
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}
