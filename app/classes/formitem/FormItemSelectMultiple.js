/*27/11/2023*/
'use strict';
const FormItemSelectMultiple = AbstractListItem.extend({		
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},
	className: 'field icon',
	template: 'formitem_selectmultiple',	
	_initialize: function(options) {
		this.parent = options.parent;
		this.options = this.model.get('options');	
		for (let i = 0; i < this.options.length; i++) {
			this.options[i].checked = (this.model.get('value') == this.options[i].value);
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
			this.icons[i].classList.remove('checked');			
		}
		this.model.set('value', this.options[rel].value);			
		this.hidden.value = this.model.get('value');		
		this.icons[rel].classList.add('checked');
		return true;			
	}
});
