/*25/03/2024*/
'use strict';
const FormPanelWidgetCss = AbstractForm.extend({
	id: 'form_panel_widget_css',	
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
		this.type = options.type;		
		this.widget = options.widget;				
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_save':						
				let value = '';
				let css = document.getElementById('dashboard_css');				
				if (css.value != '') {
					let tmp = [];
					const lines = css.value.split('\n');
					for (let i = 0; i < lines.length; i++) {				
						const v = lines[i];
						if (v != '' && v.includes('.content')) tmp.push(v.trim());								
					}
					if (tmp.length > 0) value = tmp.join('\n');
				}	
				DATABASE.panels[this.panel].widgets[this.widget].css = value;
				Database.save();				
				System.navigate('sections/panels/'+ this.panel +'/wizard/'+ this.type +'/edit/'+ this.widget, 'fade');
				break;
		}
		return false;
	}
});