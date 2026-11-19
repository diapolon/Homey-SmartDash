/*02/01/2025*/
'use strict';
const FormItemColorPicker = AbstractListItem.extend({	
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},	
	className: 'field colorpicker',
	template: 'formitem_colorpicker',	
	_initialize: function(options) {
		this.parent = options.parent;		
		this.options = this.model.get('options');						
		if (this.model.get('value') == '') this.model.set('value', this.options[0].value);						
	},
	_domReady: function() {		
		this.preview = this.el.getElementsByClassName('preview')[0];
		this.colors = this.el.getElementsByClassName('colors')[0];
		this.value = this.el.getElementsByClassName('hidden')[0];		
	},
	_touchEndB: function(event, childElement) {			
		let rel = childElement.getAttribute('rel');
		if (rel == 'picker') {
			this.el.classList.toggle('z3');
			this.colors.classList.toggle('hide');			
		} else {		
			this.el.classList.remove('z3');
			this.preview.classList.remove('color_'+ this.model.get('value'));						
			this.model.set('value', this.options[rel].value);			
			this.value.value = this.model.get('value');		
			this.preview.classList.add('color_'+ this.model.get('value'));						
			let self = this;
			window.setTimeout(function () { 										
				self.colors.classList.add('hide');	
			}, 100);							
		}
		return true;			
	}
});
