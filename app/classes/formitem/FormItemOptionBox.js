/*04/07/2023*/
'use strict';
const FormItemOptionBox = AbstractListItem.extend({		
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},
	className: 'field optionbox',
	template: 'formitem_optionbox',
	states: { checked: 'toggle-switch', unchecked: 'toggle-switch-off' },
	_initialize: function(options) {
		if (this.model.get('states') == undefined) this.model.set('states', this.states);
		this.parent = options.parent;
		this.options = this.model.get('options');	
		for (let i = 0; i < this.options.length; i++) {
			this.options[i].icon = (this.model.get('value') == this.options[i].value ? this.model.get('states').checked : this.model.get('states').unchecked);
		}
		this.model.set('options', this.options);
	},
	_domReady: function() {
		this.icons = this.el.getElementsByClassName('radio');
		this.hidden = this.el.getElementsByClassName('hidden')[0];
	},
	_touchEndB: function(event, childElement) {			
		let rel = childElement.getAttribute('rel');
		for (let i = 0; i < this.options.length; i++) {
			this.icons[i].classList.remove('mdi-'+ this.model.get('states').checked);
			this.icons[i].classList.add('mdi-'+ this.model.get('states').unchecked);
		}
		this.model.set('value', this.options[rel].value);			
		this.hidden.value = this.model.get('value');
		this.icons[rel].classList.remove('mdi-'+ this.model.get('states').unchecked);
		this.icons[rel].classList.add('mdi-'+ this.model.get('states').checked);
		return true;			
	}
});
