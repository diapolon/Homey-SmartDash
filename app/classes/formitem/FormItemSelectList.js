/*13/07/2023*/
'use strict';
const FormItemSelectList = AbstractListItem.extend({
	events: {
		'change .select': 'change'
	},
	className: 'field selectlist',
	template: 'formitem_selectlist',
	_initialize: function(options) {
		this.parent = options.parent;		
		this.callback = this.model.get('callback');
		this.rel = this.model.get('rel');		
		this.options = this.model.get('options');
		this.value = this.model.get('value');
		this.model.set('default', this.options.values[0]);
	},
	_domReady: function() {
		this.select = this.el.getElementsByClassName('select')[0];
		if (this.model.get('readonly') || this.model.get('disabled')) this.select.classList.add('hide');		
		for (let i = 0; i < this.options.values.length; i++) {
			let option = document.createElement('option');
			option.text = this.options.labels[i];
			option.value = this.options.values[i];
			if (option.value == this.value) option.setAttribute('selected', true);				
			this.select.add(option);			    
		}
	},
	change: function(event, childElement) {		
		if (this.callback && typeof this.callback === 'function') {	
			this.callback(this.rel, childElement.value);
		}
	}
});
