/*13/06/2024*/
'use strict';
const FormPanelWidget = AbstractForm.extend({
	id: 'form_panel_widget',	
	className: 'slide forms edit',
	template: 'form_widget_edit',
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
	__render: function() {			
		this.params.edit = (this.widget != '-1');
		this.params.css = (this.widget != '-1' && DATABASE.settings.custom == 1);
	},
	_touchEnd: function(event, childElement) {	
		switch(childElement.id) {
			case 'button_options':
				document.getElementById('submenu').classList.toggle('hide');				
				break;		
			case 'button_css':
				System.navigate('sections/panels/'+ this.panel +'/wizard/'+ this.type +'/edit/'+ this.widget +'/css');
				break;		
			case 'button_remove':		
				if (this.widget != '-1') {
					let self = this;
					System.notify_confirm(LANG.notify.msg.delete, function(button) {
						if (button == 2) {						
							DATABASE.panels[self.panel].widgets.splice(self.widget, 1);
							Database.save();							
							System.navigate('sections/panels/'+ self.panel, 'fade');
						}						
					}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);						
				}			
				break;
			case 'button_copy':		
				if (this.widget != '-1') {
					let self = this;
					System.notify_confirm(LANG.notify.msg.copy, function(button) {
						if (button == 2) {				
							let _data = JSON.parse(JSON.stringify(DATABASE.panels[self.panel].widgets[self.widget]));
							_data['name'] += ' #2';
							_data['enabled'] = 0;
							DATABASE.panels[self.panel].widgets.push(_data);
							Database.save();							
							System.navigate('sections/panels/'+ self.panel, 'fade');		
						}						
					}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);											
				}			
				break;
			case 'button_save':						
				let _data = JSON.parse(JSON.stringify(CONFIG.widget));
				_data.type = this.type;						
				if (this.widget != '-1') _data = { ..._data,  ...DATABASE.panels[this.panel].widgets[this.widget] };
				_data['enabled'] = parseInt(document.getElementById('dashboard_enabled').value);				
				let name = document.getElementById('dashboard_name');				
				if (name.value == '') {
					System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
					return false;
				}				
				_data['name'] = name.value;
				let locked = document.getElementById('dashboard_locked');				
				let hidename = document.getElementById('dashboard_hidename');				
				let hideupdatetime = document.getElementById('dashboard_hideupdatetime');				
				let opacity = document.getElementById('dashboard_opacity');
				let textcolor = document.getElementById('dashboard_textcolor');
				let color = document.getElementById('dashboard_color');
				let dimension_p_x = document.getElementById('dashboard_dimension_portrait_x');							
				let dimension_p_y = document.getElementById('dashboard_dimension_portrait_y');							
				let dimension_l_x = document.getElementById('dashboard_dimension_landscape_x');											
				let dimension_l_y = document.getElementById('dashboard_dimension_landscape_y');							
				let font_size = document.getElementById('dashboard_font_size');							
				if (locked != null) _data['locked'] = parseInt(locked.value);								
				if (hidename != null) _data['hidename'] = parseInt(hidename.value);				
				if (hideupdatetime != null) _data['hideupdatetime'] = parseInt(hideupdatetime.value);				
				if (opacity != null) _data['opacity'] = parseInt(opacity.value);					
				if (textcolor != null) _data['textcolor'] = textcolor.value;								
				if (color != null) _data['color'] = color.value;								
				_data['dimension']['p'] = dimension_p_x.value.replace('.', '-') +'x'+ dimension_p_y.value;							
				_data['dimension']['l'] = dimension_l_x.value +'x'+ dimension_l_y.value;							
				if (font_size != null) _data['font']['size'] = font_size.value;							
				if (_data['format'] != undefined) delete _data['format'];
				
				const obj = eval('Widget'+ _data.type);
				_data = new obj.save(_data, this.widget, this.panel);				
				if (typeof _data == 'boolean') {
					System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
					return false;
				}
				
				if (this.widget == '-1') DATABASE.panels[this.panel].widgets.push(_data);												
				else {
					DATABASE.panels[this.panel].widgets[this.widget] = _data;
					let position = document.getElementById('dashboard_position');
					let position2 = document.getElementById('dashboard_position2');
					if (position2.value != '') {							
						DATABASE.panels[position2.value].widgets.push(_data);																		
						DATABASE.panels[this.panel].widgets.splice(this.widget, 1);

					} else {
						if (position.value != '') {							
							const change = function(arr, fromIndex, toIndex) {
							    let element = arr[fromIndex];
							    arr.splice(fromIndex, 1);
							    arr.splice(toIndex, 0, element);
							    return arr;
							}							
							DATABASE.panels[this.panel].widgets = change(DATABASE.panels[this.panel].widgets, this.widget, position.value);					
						}
					}
				}
				Database.save();				
				System.navigate('sections/panels/'+ this.panel, 'fade');
				break;
		}
		return false;
	}
});