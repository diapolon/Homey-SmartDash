/*02/05/2024*/
'use strict';
const FormPanel = AbstractForm.extend({
	id: 'form_panel',
	className: 'slide forms edit',
	template: 'form_panel_edit',
	events: {
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'
	},
	__initialize: function(options) { 			
		this.panel = options.panel;				
	},
	__render: function() {			
		this.params.hide = false;
		if (DATABASE.panels[this.panel].enabled == 0) this.params.hide = true;		
		this.params.css = (!this.params.hide && DATABASE.settings.custom == 1);
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_options':
				document.getElementById('submenu').classList.toggle('hide');				
				break;		
			case 'button_css':
				System.navigate('sections/panels/'+ this.panel +'/css');
				break;		
			case 'button_save':											
				let name = document.getElementById('panel_name');
				let icon = document.getElementById('panel_icon');				
				let bg = document.getElementById('panel_bg');								
				let theme = document.getElementById('panel_theme');												
				//let mode = document.getElementById('panel_mode');		
				let showtime = document.getElementById('panel_showtime');										
				if (icon.value == '') {
					System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
					return false;
				}						
				DATABASE.panels[this.panel].name = (name.value == '' ? (parseInt(this.panel) + 1) : name.value);				
				DATABASE.panels[this.panel].icon = icon.value;													
				DATABASE.panels[this.panel].bg = bg.value;				
				DATABASE.panels[this.panel].theme = theme.value;								
				//DATABASE.panels[this.panel].mode = parseInt(mode.value);		
				DATABASE.panels[this.panel].showtime = parseInt(showtime.value);		
				Database.save();					
				System.navigate('sections/panels/'+this.panel, 'fade');
				break;
		}
		return false;
	}
});