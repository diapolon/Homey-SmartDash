/*02/01/2025*/
'use strict';
const FormItemIconPicker = AbstractListItem.extend({		
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEndB'
	},
	className: 'field iconpicker',
	template: 'formitem_iconpicker',	
	_initialize: function(options) {		
		this.parent = options.parent;
		this.options = this.model.get('options');			
	},
	_domReady: function() {		
		this.preview = this.el.getElementsByClassName('preview')[0];
		this.delete = this.el.getElementsByClassName('delete')[0];
		this.icons = this.el.getElementsByClassName('icons')[0];		
		this.value = this.el.getElementsByClassName('value')[0];		
	},
	_touchEndB: function(event, childElement) {			
		let rel = childElement.getAttribute('rel');
		switch(rel) {
			case 'picker':
				this.icons.classList.toggle('hide');			
				break;
			case 'delete':
				this.preview.classList.remove('mdi-'+ this.model.get('value'));			
				this.value.value = '';
				this.delete.classList.add('hide');
				break;
			default:
				this.preview.classList.remove('mdi-'+ this.model.get('value'));			
				this.model.set('value', this.options[rel]);			
				this.value.value = this.model.get('value');		
				this.delete.classList.remove('hide');
				this.preview.classList.add('mdi-'+ this.model.get('value'));	
				let self = this;
				window.setTimeout(function () { 										
					self.icons.classList.add('hide');	
				}, 100);													
		}
		return true;			
	}
});