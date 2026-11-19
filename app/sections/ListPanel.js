/*18/07/2023*/
'use strict';
const ListPanel = AbstractList.extend({
	id: 'list_panel',
	className: 'slide lists',
	template: 'list_panel',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.panel = options.panel;					
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_edit':				
				System.navigate('sections/panels/'+ this.panel +'/edit', 'fade'); 
				break;
			case 'button_add':				
				System.navigate('sections/panels/'+ this.panel +'/wizard/choose', 'fade'); 
				break;
		}
		return false;
	}
});
