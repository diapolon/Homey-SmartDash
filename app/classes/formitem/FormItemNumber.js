/*22/12/2022*/
'use strict';
const FormItemNumber = AbstractListItem.extend({
	events: {
		'change .input': 'change'
	},
	className: 'field textbox',
	template: 'formitem_number',
	_initialize: function(options) {
		this.parent = options.parent;		
		this.callback = this.model.get('callback');
		this.rel = this.model.get('rel');		
		this.value = this.model.get('value');
	},
	_domReady: function() {
		this.input = this.el.getElementsByClassName('input')[0];
		if (this.model.get('readonly') || this.model.get('disabled')) this.input.classList.add('hide');				
	},
	change: function(event, childElement) {
		if (this.callback && typeof this.callback === 'function') {	
			this.callback(this.rel, childElement.value);
		}
	}
});
