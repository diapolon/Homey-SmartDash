/*13/03/2024*/
'use strict';
const FormItemPushButton = AbstractListItem.extend({
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',		
		'touchend .button': 'touchEndB'
	},
	className: 'field pushbutton',
	template: 'formitem_pushbutton',
	_initialize: function(options) {
		this.parent = options.parent;		
		this.buttons = this.model.get('buttons');	
	},
	__touchEnd: function(event, childElement) {			
		return true;
	},
	_touchEndB: function(event, childElement) {
		let rel = childElement.getAttribute('rel');			
		let button = this.buttons[rel];
		if (button.callback && typeof button.callback === 'function') {
			let valid = true;
			if (button.required) {
				for (let i = 0; i < button.required.length; i++) {
					let field = document.getElementById(button.required[i]);
					if (field.value == '' || field.value == 0) valid = false;
				}
			}
			if (valid) {
				button.callback();
			} else {
				System.notify_alert(LANG.notify.msg.required, LANG.notify.title.error, LANG.buttons.ok);						
			}
		}
		return true;
	}
});
