/*11/07/2023*/
'use strict';
const FormItemCheckBox = AbstractListItem.extend({		
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},
	className: 'field checkbox',
	template: 'formitem_checkbox',
	states: { checked: { value: 1, icon: 'toggle-switch'}, unchecked: { value: 0, icon: 'toggle-switch-off' } },
	_initialize: function(options) {
		this.parent = options.parent;
		this.callback = this.model.get('callback');
		if (this.model.get('states') == undefined) this.model.set('states', this.states);
		this.model.set('checked', (this.model.get('value') == this.model.get('states').checked.value ? this.model.get('states').checked.icon : this.model.get('states').unchecked.icon));
	},
	_domReady: function() {
		this.icon = this.el.getElementsByClassName('check')[0];
		this.hidden = this.el.getElementsByClassName('hidden')[0];
	},
	_touchEndB: function(event, childElement) {			
		if (childElement.classList.contains('link')) {
			System.handle_openLink(event, this.model.get('link'));					
		} else {
			this.model.set('value', (this.model.get('value') == this.model.get('states').checked.value ? this.model.get('states').unchecked.value : this.model.get('states').checked.value));
			if (this.model.get('value') == this.model.get('states').checked.value) {
				this.icon.classList.remove('mdi-'+ this.model.get('states').unchecked.icon);
				this.icon.classList.add('mdi-'+ this.model.get('states').checked.icon);
			} else {
				this.icon.classList.remove('mdi-'+ this.model.get('states').checked.icon);
				this.icon.classList.add('mdi-'+ this.model.get('states').unchecked.icon);
			}
			this.hidden.value = this.model.get('value');
			if (this.callback && typeof this.callback === 'function') {
				this.callback(this.model.get('value'));
			}
		}
		return true;
	}
});
