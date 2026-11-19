/*11/12/2019*/
'use strict';
const FormItemPassword = AbstractListItem.extend({	
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},
	className: 'field textbox password',
	template: 'formitem_password',
	_domReady: function() {	
		this.input = this.el.getElementsByClassName('input')[0];
		this.button = this.el.getElementsByClassName('show')[0];
	},		
	_touchEndB: function(event, childElement) {
		childElement.classList.remove('tapped');
		this.input.type = (this.input.type == 'password' ? 'text' : 'password');
		this.button.innerHTML = (this.input.type == 'password' ? LANG.buttons.show : LANG.buttons.hide);
		return true;
	}
});
