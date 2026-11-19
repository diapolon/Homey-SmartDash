/*02/05/2024*/
'use strict';
const FormPanels = AbstractForm.extend({
	id: 'form_panels',
	className: 'slide forms edit',
	template: 'form_edit',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.type = options.type;							
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_save':									
				switch(this.type) {
					case 'trigger':
						DATABASE.autoplay.logic = document.getElementById('panels_autoplay_logic').value;				
						DATABASE.autoplay.timeout = parseInt(document.getElementById('panels_autoplay_timeout').value);				
						break;
					case 'autoswitch':
						DATABASE.autoplay.duration = parseInt(document.getElementById('panels_autoplay_duration').value);				
						break;
				}			
				Database.save();													
				System.navigate('sections/panels/settings', 'fade');
				break;
		}
		return false;
	}
});