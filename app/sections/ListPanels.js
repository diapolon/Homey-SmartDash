/*02/05/2024*/
'use strict';
const ListPanels = AbstractList.extend({
	id: 'list_panels',	
	className: 'slide lists',
	template: 'list_panels',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__domReady: function() {	
			if (DATABASE.autoplay.enabled == 1) document.getElementById(this.id).getElementsByClassName('button')[0].classList.add('on');		
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_autoplay':				
				System.navigate('sections/panels/autoplay', 'fade'); 
				break;		
			case 'button_settings':				
				System.navigate('sections/panels/settings', 'fade'); 
				break;				
		}
		return false;
	}
});