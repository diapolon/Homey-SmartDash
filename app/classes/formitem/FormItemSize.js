/*11/06/2024*/
'use strict';
const FormItemSize = AbstractListItem.extend({
	className: 'field selectlist size',
	template: 'formitem_size',
	_initialize: function(options) {
		this.parent = options.parent;		
		this.options_x = this.model.get('options');
		this.options_y = (this.model.get('options_y') ? this.model.get('options_y') : this.model.get('options'));
		this.values = this.model.get('values');		
	},
	_domReady: function() {
		this.select_x = this.el.getElementsByClassName('select')[0];
		this.select_y = this.el.getElementsByClassName('select')[1];		
		for (let i = 0; i < this.options_x.values.length; i++) {
			let option_x = document.createElement('option');
			option_x.text = this.options_x.labels[i];
			option_x.value = this.options_x.values[i];			
			if (this.values[0].replace('-', '.') == option_x.value) option_x.setAttribute('selected', true);							
			this.select_x.add(option_x);			    
		}
		for (let i = 0; i < this.options_y.values.length; i++) {
			let option_y = document.createElement('option');
			option_y.text = this.options_y.labels[i];
			option_y.value = this.options_y.values[i];			
			if (this.values[1].replace('-', '.') == option_y.value) option_y.setAttribute('selected', true);							
			this.select_y.add(option_y);			    
		}
	}
});
