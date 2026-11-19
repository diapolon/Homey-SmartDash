/*23/04/2024*/
'use strict';
const ListDevice = AbstractList.extend({
	id: 'list_device',
	className: 'slide lists',
	template: 'list_device',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.device = options.device;					
	},
	__domReady: function() {		
		let self = this;
		this.listenTo(Data, 'dataReady', function() {					
			self.toUpdate();
		});		
	},
	toUpdate: function() {					
		this.refresh(DataForm.device(this.device));
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_update':				
				Data.data_update_check(); 									
				break;			
		}
		return false;
	}
});
