/*04/06/2024*/
'use strict';
const FormPanelCss = AbstractForm.extend({
	id: 'form_panel_css',	
	className: 'slide forms edit',
	template: 'form_edit',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.panel = options.panel;				
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_save':						
				let value = '';
				let css = document.getElementById('panel_css');				
				if (css.value != '') {
					let tmp = [];
					const lines = css.value.split('\n');
					for (let i = 0; i < lines.length; i++) {				
						const v = lines[i];
						if (v != '' && v.includes('.panel')) tmp.push(v.trim());								
					}
					if (tmp.length > 0) value = tmp.join('\n');
				}	
				DATABASE.panels[this.panel].css = value;
				Database.save();				
				System.navigate('sections/panels/'+ this.panel +'/edit', 'fade');
				break;
		}
		return false;
	}
});