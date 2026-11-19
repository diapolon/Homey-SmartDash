/*26/04/2024*/
'use strict';
const ListDevices = AbstractList.extend({
	id: 'list_devices',	
	className: 'slide lists',
	template: 'list_devices',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__render: function() {			
		//this.params.debug = DATABASE.settings.debug;
	},
	__domReady: function() {		
		let self = this;
		this.listenTo(Data, 'dataReady', function() {					
			self.toUpdate();
		});		
	},
	toUpdate: function() {					
		const contents = DataForm.devices();			
		if (contents.length) this.refresh(contents);
	},
	_touchEnd: function(event, childElement) {			
		switch(childElement.id) {
			case 'button_debug':
				const debug = JSON.stringify(HOMEY.data);
				System.handle_openShare(debug);
				break;
			case 'button_update':				
				Data.data_update_check(); 									
				break;			
		}
		return false;
	}
});