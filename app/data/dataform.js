/*28/12/2024*/
'use strict';
const DataForm = {			
	intro: function() {		
		let items = [];		
		const callback = function(local) { 												
			System.spinner_show();					
			CONFIG.local = local;					 	
			Homey.checkState(function(json) {		 					 					 	
				System.spinner_hide();				
				Data.data_update_check(); 						 											
			}, function(json) { 
				System.spinner_hide();		
				if (!CONFIG.local) {						
					System.notify_confirm(LANG.notify.msg.error_fallback, function(button) {
						if (button == 2) {
							CONFIG.cloud.fallback = true;
							callback(local);
						} else {
							System.navigate('login', 'fade');			
						}
					}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);														
				} else {
					System.notify_alert(json.message, LANG.notify.title.alert, LANG.buttons.ok);									
					System.navigate('login', 'fade');			
				}
			});
		};			
		if (DATABASE.settings.cloud_id == '') callback(true);
		else {						
			switch(DATABASE.settings.access_mode) {
				case 1:
					callback(true);
					break;
				case 2:
					callback(false);
					break;
				default:
					items.push(new Models.ListItem({ id: 'infos', type: 'Html', html: '<div class="p10t size_s">'+ LANG.htmls.intro +'</div>' }));										
					items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_local', name: LANG.buttons.local, css: 'first green xl', callback: function() { callback(true); } }, { id: 'button_remote', name: LANG.buttons.remote, css: 'last red m', callback: function() { callback(false); } }] }));				
			}			
		}
		return items;
	},
	login: function() {
		let items = [];
		const callback = function() { 											
			let homeypro = document.getElementById('homeypro');
			let server = document.getElementById('server');
			let token = document.getElementById('token');		
			let server_token = document.getElementById('server_token');	
			if (server.value == '' || (token.value == '' && server_token.value == '')) System.notify_alert(LANG.notify.msg.required, LANG.notify.title.alert, LANG.buttons.ok);						
			else {				
				if (isValidUrl(server.value) && (homeypro.value == 1 || isValidUrl(server_token.value))) {
					DATABASE.settings.server = server.value;						
					if (DATABASE.settings.server.slice(-1) != '/') DATABASE.settings.server += '/';									
					if (homeypro.value == 1) {
						DATABASE.settings.server_token = '';		
						DATABASE.settings.token = token.value;							
					} else {
						DATABASE.settings.server_token = server_token.value;
						DATABASE.settings.token = '';							
					}
					System.spinner_show();		
					Database.save();				 		
					window.setTimeout(function () { 				 						
			 			System.spinner_hide();	
						System.navigate('intro', 'fade');			
					}, 300);																								
				} else System.notify_alert(LANG.notify.msg.error_url, LANG.notify.title.alert, LANG.buttons.ok);						
			}			
		};					
		const callback2 = function() { 					
			window.setTimeout(function () { 			
				System.navigate('dashboard', 'fade');				
			}, 300);																			
		};	
		const callback3 = function(rel, value) {			
			let homey_new = document.getElementsByClassName('homey_new');			
			let homey_old = document.getElementsByClassName('homey_old');			
			for (let i = 0; i < homey_new.length; i++) {				
				if (value == 1) homey_new[i].classList.remove('hide');
				else homey_new[i].classList.add('hide');   
			}
			for (let i = 0; i < homey_old.length; i++) {				
				if (value == 1) homey_old[i].classList.add('hide');
				else homey_old[i].classList.remove('hide');   
			}
			let server_token = document.getElementById('server_token');						
			if (value == 1 && server_token.value != '') server_token.value = ''; 			
		};		
		
		const old = (DATABASE.settings.server_token != '');
		let css = ['homey_new'];
		let css2 = ['homey_old'];
		if (old) css.push('hide');
		else css2.push('hide');
		//items.push(new Models.ListItem({ type: 'Html', html: '<div class="size_s">'+ LANG.fields.address +'</div>' }));				
		items.push(new Models.ListItem({ id: 'server', name: '<div class="size_s p10b">'+ LANG.fields.address +'</div>', type: 'TextBox', value: DATABASE.settings.server, placeholder: LANG.fields.server }));		
		//items.push(new Models.ListItem({ type: 'Html', html: '<div class="size_s">'+ LANG.fields.groups.homey +'</div>' }));				
		items.push(new Models.ListItem({ id: 'homeypro', name: '<div class="size_s p10b">'+ LANG.fields.groups.homey +'</div>', type: 'SelectList', value: (old ? 2: 1), options: LANG.forms.options.homeypro, rel: '', callback: callback3 }));				
		items.push(new Models.ListItem({ id: 'token', type: 'TextBox', value: DATABASE.settings.token, placeholder: LANG.fields.token, css: css }));		
		items.push(new Models.ListItem({ id: 'server_token', type: 'TextBox', value: DATABASE.settings.server_token, placeholder: LANG.fields.server_token, css: css2 }));				
		items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_save', name: LANG.buttons.save, css: 'green xl', callback: function() { callback(); } }] }));						
		items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_skip', name: LANG.buttons.skip, css: 'transparent', callback: callback2 }] }));
		return items;
	},	
	bottombar: function() {		
		let items = [];
		items.push(new Models.ListItem({ type: 'BottomBar', name: LANG.menu.dashboard.name, icon: 'monitor-dashboard', route: 'dashboard' }));
		items.push(new Models.ListItem({ type: 'BottomBar', name: LANG.menu.section_panels.name, icon: 'view-dashboard-edit', route: 'sections/panels' }));
		items.push(new Models.ListItem({ type: 'BottomBar', name: LANG.menu.section_devices.name, icon: 'devices', route: 'sections/devices' }));
		items.push(new Models.ListItem({ type: 'BottomBar', name: LANG.menu.section_settings.name, icon: 'cog', route: 'sections/settings' }));
		items.push(new Models.ListItem({ type: 'BottomBar', name: LANG.menu.section_info.name, icon: 'information', route: 'sections/info' }));
		return items;
	},	
	dashboard: function() {		
		let dashboard = { toolbar: [], panels: [] };				
		for (const p in DATABASE.panels) {			    				
			const panel = DATABASE.panels[p];
			dashboard.panels[p] = [];
			if (panel.enabled > 0) {				
				dashboard.toolbar.push(new Models.ListItem({ type: 'Button', icon: panel.icon, disabled: (panel.enabled == 2), panel: p }));				
				const theme = (panel.theme == undefined || panel.theme == '' ? 'default' : panel.theme);		
				for (const position in panel.widgets) {			    				
					if (panel.widgets[position].type == undefined) continue;
					let widget = CONFIG.widget;						
					widget = { ...widget,  ...panel.widgets[position] };		
					if (widget.enabled == 1) {				
						const id = 'widget_'+ p +'_'+ position;
						const readonly = (widget.locked == 1);
						let data = {};
						let update = '';
						let lastUpdated = 0;							
						let css = [theme, 'dp_'+ widget.dimension.p, 'dl_'+ widget.dimension.l, 'bg_'+ widget.color, 'c_'+ widget.textcolor, 'fs_'+widget.font.size];
						if (widget.opacity == 1) css.push('opacity');										
						if (HOMEY.data.devices[widget.device] != undefined) {
							const device = JSON.parse(JSON.stringify(HOMEY.data.devices[widget.device]));					
							data = device.data;
							lastUpdated = device.lastUpdated;
							update = getTime(device.lastUpdated, '?');
						}
						dashboard.panels[p].push(new Models.ListItem({ id: id, type: widget.type, css: css, name: widget.name, widget: widget, data: data, readonly: readonly, lastUpdated: lastUpdated, update: update }));				
					}
				};
				if (dashboard.panels[p].length == 0) dashboard.panels[p].push(new Models.ListItem({ type: 'Empty', text: LANG.no_results.widgets, lastUpdated: 0 }));		
			}
		}		
		dashboard.toolbar.push(new Models.ListItem({ type: 'Menu', icon: 'tune', css: ['fr'] }));
		dashboard.toolbar.push(new Models.ListItem({ type: 'Network', icon: 'web', css: ['fr'] }));		
		dashboard.toolbar.push(new Models.ListItem({ type: 'Title', css: ['fr'] }));
		return dashboard;
	},		
	widget_wizard: function(panel) {
		let items = [];	
		for (const widget in json_data.widgets) items.push(new Models.ListItem({ type: 'Page', icon: json_data.widgets[widget].icon, name: '<h3>'+  json_data.widgets[widget].name +'</h3>', route: 'sections/panels/'+ panel +'/wizard/'+ widget +'/add/info' }));		
		return items;
	},
	widget_wizard_info: function(panel, type) {
		let items = [];	
		items.push(new Models.ListItem({ type: 'Page', name: '<h3><span class="size_l mdi mdi-'+ json_data.widgets[type].icon +'"></span> '+ json_data.widgets[type].name +'</h3>', desc: '<p>'+ (LANG.widgets[json_data.widgets[type].name] ? LANG.widgets[json_data.widgets[type].name] : '') +'</p><div>'+ LANG.buttons.add +'</div>', route: 'sections/panels/'+ panel +'/wizard/'+ type +'/add/new' }));		
		return items;
	},
	widget_edit: function(panel, type, widget) {			
		let data = Object.assign({}, CONFIG.widget);
		data.type = type;
		if (widget != '-1') data = { ...data,  ...DATABASE.panels[panel].widgets[widget] };
	
		let items = [];		
	
		items.push(new Models.ListItem({ type: 'Html', html: '<div class="type"><span class="size_l mdi mdi-'+ json_data.widgets[data.type].icon +'"></span> '+ json_data.widgets[data.type].name +'</div>' }));		
		items.push(new Models.ListItem({ id: 'dashboard_enabled', type: 'CheckBox', value: data.enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>' }));							
			
	
		//items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.info +'</h2>' }));			
		//items.push(new Models.ListItem({ id: 'dashboard_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name, css: ['x1'] }));		
		//items.push(new Models.ListItem({ name: '<h4 class="title">'+ LANG.fields.type +'</h4>', type: 'TextBox', value: json_data.widgets[type].name, readonly: true, css: ['x3'] }));		
		
		const obj = eval('Widget'+ type);
		
		const settings = new obj.edit(data, widget, panel);
		for (const s in settings) items.push(settings[s]);		
		
		if (widget != '-1') { 
			let positions = { values: [""], labels: [LANG.forms.options.none] };		
			for (const p in DATABASE.panels[panel].widgets) {						
				positions.values.push(p);
				positions.labels.push(DATABASE.panels[panel].widgets[p].name);				
			};
			
			items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.position +'</h2>' }));			
			items.push(new Models.ListItem({ id: 'dashboard_position', name: '<h4 class="title">'+ LANG.fields.moveto +'</h4>', type: 'SelectList', options: positions, css: ['x2'] }));	
			
			let positions2 = { values: [""], labels: [LANG.forms.options.none] };		
			for (const p in DATABASE.panels) {			    				
				if (p == panel) continue;
				positions2.values.push(p);
				positions2.labels.push(DATABASE.panels[p].name);				
			}		
			items.push(new Models.ListItem({ id: 'dashboard_position2', name: '<h4 class="title">'+ LANG.fields.moveto2 +'</h4>', type: 'SelectList', options: positions2, css: ['x2'] }));	
		}
		return items;
	},	
	widget_edit_css: function(panel, type, widget) {			
		let items = [];
		let value = '';
		if (DATABASE.panels[panel].widgets[widget].css && DATABASE.panels[panel].widgets[widget].css != '') {
			let tmp = [];
			const lines = DATABASE.panels[panel].widgets[widget].css.split('\n');
			for (let i = 0; i < lines.length; i++) {				
				//const v = lines[i].replace('.slide.dashboard ul.rows ', '');
				tmp.push(lines[i]);								
			}
			value = tmp.join('\n');
		}							
		items.push(new Models.ListItem({ id: 'dashboard_css', type: 'TextArea', value: value, css: ['nowrap'] }));
		items.push(new Models.ListItem({ type: 'Html', html: LANG.htmls.css.widget }));
		return items;
	},	
	
	panels: function() {
		let items = [];	
		for (const p in DATABASE.panels) {			    				
			const panel = DATABASE.panels[p];
			items.push(new Models.ListItem({ type: 'Page', icon: 'widgets', name: '<h3>'+ panel.name + (panel.enabled == 2 ? ' <span class="mdi mdi-eye-off size_s color_grey"></span>' : '') +'</h3>', css: (panel.enabled == 0 ? ['light'] : []), route: 'sections/panels/'+ p }));
		}	
		return items;
	},
	panels_settings: function() {
		let items = [];	
		items.push(new Models.ListItem({ type: 'Page', icon: 'application-settings', name: '<h3>'+ LANG.menu.section_panels.trigger +'</h3>', route: 'sections/panels/settings/trigger' }));
		items.push(new Models.ListItem({ type: 'Page', icon: 'swap-horizontal-circle-outline', name: '<h3>'+ LANG.menu.section_panels.autoswitch +'</h3>', route: 'sections/panels/settings/autoswitch' }));				
		return items;
	},
	panels_setting: function(type) {
		switch(type) {
			case 'trigger':
				return this.panels_trigger();
				break;
			case 'autoswitch':
				return this.panels_autoswitch();
				break;			
		}
	},
	panels_trigger: function() {
		let items = [];	
		let css = ['options', 'hide'];
		if (DATABASE.autoplay.logic != '') css = ['options'];							
		const callback = function(rel, value) {						
			let options = document.getElementsByClassName('options');						
			for (let i = 0; i < options.length; i++) {				
				if (value == '') options[i].classList.add('hide');
				else options[i].classList.remove('hide');   
			}
		}
		let logics = { values: [""], labels: [LANG.forms.options.none] };
		for (const logic_id in HOMEY.data.logics) {
			if (HOMEY.data.logics[logic_id].type == 'number') {	
				logics.values.push(logic_id);
				logics.labels.push(HOMEY.data.logics[logic_id].name);					
			}
		}		
		items.push(new Models.ListItem({ id: 'panels_autoplay_logic', name: '<h4 class="title">'+ LANG.fields.autoplay_logic +'</h4>', type: 'SelectList', value: DATABASE.autoplay.logic, options: { values: logics.values, labels: logics.labels }, rel: '', callback: callback }));							
		items.push(new Models.ListItem({ id: 'panels_autoplay_timeout', name: '<h4 class="title">'+ LANG.fields.autoplay_timeout +'</h4>', type: 'SelectList', value: DATABASE.autoplay.timeout, options: LANG.forms.options.autoplay.timeout }));						
		return items;
	},
	panels_autoswitch: function() {		
		let items = [];	
		let css = ['options', 'hide'];		
		if (DATABASE.autoplay.enabled == 1) css = ['options'];							
		
		const callback = function(checked) {			
			DATABASE.autoplay.enabled = checked;
			Database.save();												
			let options = document.getElementsByClassName('options');			
			for (let i = 0; i < options.length; i++) {				
				if (checked == 1) options[i].classList.remove('hide');
				else options[i].classList.add('hide');   
			}			
		}	
		const callback2 = function(p, checked) {			
			DATABASE.panels[p].mode = checked;
			Database.save();						
		}	
		
		items.push(new Models.ListItem({ id: 'panels_autoplay', type: 'CheckBox', value: DATABASE.autoplay.enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>', callback: callback }));	
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>', css: css }));		
		for (const p in DATABASE.panels) {			    				
			const panel = DATABASE.panels[p];
			if (panel.enabled > 0) {
				items.push(new Models.ListItem({ id: 'panel_'+ p +'_mode', type: 'CheckBox', value: panel.mode, name: '<h4 class="title">'+ panel.name +'</h4>', states: { checked: { value: 1, icon: 'toggle-switch'}, unchecked: { value: 2, icon: 'toggle-switch-off' } }, callback: function(checked) { callback2(p, checked); }, css: css }));	
			}
		}		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>', css: css }));				
		items.push(new Models.ListItem({ id: 'panels_autoplay_duration', name: '<h4 class="title">'+ LANG.fields.autoplay_duration +'</h4>', type: 'SelectList', value: DATABASE.autoplay.duration, options: LANG.forms.options.autoplay.duration, css: css }));						
		return items;
	},
	
	panel: function(current) {
		let items = [];	
		for (const position in DATABASE.panels[current].widgets) {			    				
			const widget = DATABASE.panels[current].widgets[position];
			if (widget.type == undefined) continue;				
			let css = [];//['dp_'+ widget.dimension.p, 'dl_'+ widget.dimension.l];
			if (widget.enabled == 0) css.push('light');
			items.push(new Models.ListItem({ type: 'Page', icon: 'cog', name: '<h3>'+ widget.name +'</h3>', css: css, desc: '<div><span class="size_xs"><strong>'+ json_data.widgets[widget.type].name +'</strong></div>', route: 'sections/panels/'+ current +'/wizard/'+ widget.type +'/edit/'+ position }));				
		}
		if (items.length == 0) items.push(new Models.ListItem({ type: 'Empty', icon: 'view-dashboard', text: LANG.no_results.widgets }));		
		return items;
	},
	panel_edit: function(panel) {
		let items = [];				
		const data = DATABASE.panels[panel];		
		let css = ['options', 'hide'];
		let css2 = ['options', 'x2', 'hide'];
		if (data.enabled > 0) {
			css = ['options'];
			css2 = ['options', 'x2'];
		}
		const callback = function(rel, status) {								
			DATABASE.panels[panel].enabled = parseInt(status);
			Database.save();			
			let button_save = document.getElementById('button_save');			
			if (status > 0) button_save.classList.remove('hide');			
			else button_save.classList.add('hide');			
			let options = document.getElementsByClassName('options');			
			for (let i = 0; i < options.length; i++) {				
				if (status > 0) options[i].classList.remove('hide');
				else options[i].classList.add('hide');   
			}
		}
		//items.push(new Models.ListItem({ id: 'panel_enabled', type: 'CheckBox', value: data.enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>', readonly: (panel == 0), callback: callback }));	
		items.push(new Models.ListItem({ id: 'panel_enabled', name: '<h4 class="title">'+ LANG.fields.state +'</h4>', type: 'SelectList', value: data.enabled, options: LANG.forms.options.panel.status, callback: callback }));							
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>', css: css }));				
		items.push(new Models.ListItem({ id: 'panel_name', name: '<h4 class="title">'+ LANG.fields.name +'</h4>', type: 'TextBox', value: data.name, css: css }));				
		

		let icons = [];
		const num = parseInt(panel) + 1;
		icons.push('numeric-'+ num +'-box-multiple-outline');								
		for (const i in LANG.forms.options.icons) icons.push(LANG.forms.options.icons[i]);		
				
		items.push(new Models.ListItem({ id: 'panel_icon', name: '<h4 class="title">'+ LANG.fields.icon +'</h4>', type: 'IconPicker', placeholder: LANG.fields.icon_custom, value: data.icon, options: icons, css: css }));							
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>', css: css }));	
		items.push(new Models.ListItem({ id: 'panel_showtime', type: 'CheckBox', value: data.showtime, name: '<h4 class="title">'+ LANG.fields.showtime +'</h4>', css: css }));						
						
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.display +'</h2>', css: css }));	
		
		items.push(new Models.ListItem({ id: 'panel_bg', name: '<h4 class="title">'+ LANG.fields.color +'</h4>', type: 'SelectList', value: data.bg, options: LANG.forms.options.panel.bg, css: css2 }));				
		items.push(new Models.ListItem({ id: 'panel_theme', name: '<h4 class="title">'+ LANG.fields.theme +'</h4>', type: 'SelectList', value: data.theme, options: LANG.forms.options.panel.theme, css: css2 }));						
		return items;
	},
	panel_edit_css: function(panel) {			
		let items = [];
		let value = '';
		if (DATABASE.panels[panel].css && DATABASE.panels[panel].css != '') {
			let tmp = [];
			const lines = DATABASE.panels[panel].css.split('\n');
			for (let i = 0; i < lines.length; i++) {								
				tmp.push(lines[i]);								
			}
			value = tmp.join('\n');
		}							
		items.push(new Models.ListItem({ id: 'panel_css', type: 'TextArea', value: value, css: ['nowrap'] }));
		items.push(new Models.ListItem({ type: 'Html', html: LANG.htmls.css.panel }));
		return items;
	},
	
	settings: function() {
		let items = [];
		items.push(new Models.ListItem({ type: 'Page', icon: 'application-settings', name: '<h3>'+ LANG.menu.section_settings.system +'</h3>', route: 'sections/settings/system' }));
		items.push(new Models.ListItem({ type: 'Page', icon: 'server', name: '<h3>'+ LANG.menu.section_settings.homey +'</h3>', route: 'sections/settings/homey' }));				
		items.push(new Models.ListItem({ type: 'Page', icon: 'view-dashboard-edit', name: '<h3>'+ LANG.menu.section_settings.panels +'</h3>', route: 'sections/panels/settings' }));						
		items.push(new Models.ListItem({ type: 'Page', icon: 'key', name: '<h3>'+ LANG.menu.section_settings.pin +'</h3>', route: 'sections/settings/pin' }));						
		items.push(new Models.ListItem({ type: 'Page', icon: 'cellphone-screenshot', name: '<h3>'+ LANG.menu.section_settings.screensaver +'</h3>', route: 'sections/settings/screensaver' }));				
		items.push(new Models.ListItem({ type: 'Page', icon: 'backup-restore', name: '<h3>'+ LANG.menu.section_settings.backup +'</h3>', route: 'sections/settings/backup' }));						
		return items;
	},
	setting: function(type) {
		switch(type) {
			case 'system':
				return this.settings_system();
				break;
			case 'homey':
				return this.settings_homey();
				break;
			case 'screensaver':
				return this.settings_screensaver();
				break;
			case 'pin':
				return this.settings_pin();
				break;
			case 'backup':
				return this.settings_backup();
				break;
		}
	},
	settings_system: function() {
		let items = [];
		items.push(new Models.ListItem({ id: 'settings_fontsize', name: '<h4 class="title">'+ LANG.fields.font_size +'</h4>', type: 'SelectList', value: DATABASE.settings.fontsize, options: LANG.forms.options.fontsizes }));								
		items.push(new Models.ListItem({ id: 'settings_language', name: '<h4 class="title">'+ LANG.fields.language +'</h4>', type: 'SelectList', value: DATABASE.settings.lang, options: LANG.forms.options.languages }));				
		items.push(new Models.ListItem({ id: 'settings_access_mode', name: '<h4 class="title">'+ LANG.fields.access_mode +'</h4>', type: 'SelectList', value: DATABASE.settings.access_mode, options: LANG.forms.options.access_mode }));				
		items.push(new Models.ListItem({ id: 'settings_sync', name: '<h4 class="title">'+ LANG.fields.sync +'</h4>', type: 'SelectList', value: DATABASE.settings.sync, options: LANG.forms.options.sync }));				
		items.push(new Models.ListItem({ id: 'settings_feedback', name: '<h4 class="title">'+ LANG.fields.feedback +'</h4>', type: 'SelectList', value: DATABASE.settings.feedback, options: LANG.forms.options.feedback }));						
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.advanced +'</h2>' }));				
		items.push(new Models.ListItem({ id: 'settings_keepawake', type: 'CheckBox', value: DATABASE.settings.keepawake, name: '<h4 class="title">'+ LANG.fields.keepawake +'</h4>' }));								
		items.push(new Models.ListItem({ id: 'settings_unsecure', type: 'CheckBox', value: DATABASE.settings.unsecure, name: '<h4 class="title">'+ LANG.fields.unsecure +'</h4>' }));								
		items.push(new Models.ListItem({ id: 'settings_custom', type: 'CheckBox', value: DATABASE.settings.custom, name: '<h4 class="title">'+ LANG.fields.custom +'</h4>' }));										
		items.push(new Models.ListItem({ id: 'settings_debug', type: 'CheckBox', value: DATABASE.settings.debug, name: '<h4 class="title">'+ LANG.fields.debug +'</h4>' }));								
		return items;
	},
	settings_homey: function() {
		let items = [];		
		items.push(new Models.ListItem({ id: 'settings_server', name: '<h4 class="title">'+ LANG.fields.address +'</h4>', type: 'TextBox', value: DATABASE.settings.server, placeholder: LANG.fields.server }));
		items.push(new Models.ListItem({ id: 'settings_cloud_id', name: '<h4 class="title">'+ LANG.fields.cloud_id +'</h4>', type: 'TextBox', value: DATABASE.settings.cloud_id, placeholder: LANG.fields.cloud_id }));		
		
		const homeypro = (DATABASE.settings.server_token == '' ? 1: 2);
		let css1 = ['homey_new'];
		let css2 = ['homey_old', 'hide'];
		if (homeypro == 2) {
			css1 = ['homey_new', 'hide'];
			css2 = ['homey_old'];
		}
		const callback = function(rel, value) {			
			let homey_new = document.getElementsByClassName('homey_new');			
			let homey_old = document.getElementsByClassName('homey_old');			
			for (let i = 0; i < homey_new.length; i++) {				
				if (value == 1) homey_new[i].classList.remove('hide');
				else homey_new[i].classList.add('hide');   
			}
			for (let i = 0; i < homey_old.length; i++) {				
				if (value == 1) homey_old[i].classList.add('hide');
				else homey_old[i].classList.remove('hide');   
			}
			let settings_token = document.getElementById('settings_token');			
			let settings_server_token = document.getElementById('settings_server_token');			
			if (value == 1 && settings_server_token.value != '') settings_server_token.value = ''; 			
		};		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.homey +'</h2>' }));
		items.push(new Models.ListItem({ id: 'settings_homeypro', type: 'SelectList', value: homeypro, options: LANG.forms.options.homeypro, rel: '', callback: callback }));				
		items.push(new Models.ListItem({ id: 'settings_token', name: '<h4 class="title">'+ LANG.fields.token +'</h4>', type: 'TextBox', value: DATABASE.settings.token, placeholder: LANG.fields.token, css: css1 }));		
		items.push(new Models.ListItem({ id: 'settings_server_token', name: '<h4 class="title">'+ LANG.fields.address_token +'</h4>', type: 'TextBox', value: DATABASE.settings.server_token, placeholder: LANG.fields.server_token, css: css2 }));								
		return items;
	},	
	settings_screensaver: function() {		
		let css = ['options', 'hide'];
		let css2 = ['options', 'fl', 'hide'];
		if (DATABASE.screensaver.enabled == 1) {			
			css = ['options'];
			css2 = ['options', 'fl'];
		}
		const callback = function(checked) {						
			DATABASE.screensaver.enabled = checked;
			Database.save();			
			let button_save = document.getElementById('button_save');			
			if (checked == 1) button_save.classList.remove('hide');			
			else button_save.classList.add('hide');			
			let options = document.getElementsByClassName('options');			
			for (let i = 0; i < options.length; i++) {				
				if (checked == 1) options[i].classList.remove('hide');
				else options[i].classList.add('hide');   
			} 
		}
		
		let items = [];		
		items.push(new Models.ListItem({ id: 'settings_status', type: 'CheckBox', value: DATABASE.screensaver.enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>', callback: callback }));						
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>', css: css }));				
		items.push(new Models.ListItem({ type: 'Page', icon: 'chevron-right', name: '<h4 class="p10t">Slide #1</h4>', route: 'sections/settings/screensaver/0', css: css }));				
		items.push(new Models.ListItem({ type: 'Page', icon: 'chevron-right', name: '<h4>Slide #2</h4>', route: 'sections/settings/screensaver/1', css: css }));				
		items.push(new Models.ListItem({ type: 'Page', icon: 'chevron-right', name: '<h4>Slide #3</h4>', route: 'sections/settings/screensaver/2', css: css }));				
		
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>', css: css }));				
		items.push(new Models.ListItem({ id: 'settings_from', name: '<h4 class="title">'+ LANG.fields.idlevalidity +'</h4>', type: 'SelectList', value: DATABASE.screensaver.from, options: LANG.forms.options.hours, css: css2 }));								
		items.push(new Models.ListItem({ id: 'settings_to', name: '<h4 class="title">&nbsp;</h4>', type: 'SelectList', value: DATABASE.screensaver.to, options: LANG.forms.options.hours, css: css2 }));						
		items.push(new Models.ListItem({ id: 'settings_idletime', name: '<h4 class="title">'+ LANG.fields.idletime +'</h4>', type: 'SelectList', value: DATABASE.screensaver.time, options: LANG.forms.options.screensaver.time, css: css }));						
		items.push(new Models.ListItem({ id: 'settings_brightness', name: '<h4 class="title">'+ LANG.fields.brightness +'</h4>', type: 'SelectList', value: DATABASE.screensaver.brightness, options: LANG.forms.options.screensaver.brightness, css: css }));
		items.push(new Models.ListItem({ id: 'settings_opacity', type: 'CheckBox', value: DATABASE.screensaver.opacity, name: '<h4 class="title">'+ LANG.fields.opacity +'</h4>', css: css }));						
		
		if (DATABASE.settings.custom == 1) { 
			items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.advanced +'</h2>', css: css }));	
			items.push(new Models.ListItem({ type: 'Page', name: '<h4 class="title">'+ LANG.fields.custom_css +'</h4>', icon: 'chevron-right', route: 'sections/settings/screensaver/css', css: css }));	
		}
		
		return items;
	},
	settings_screensaver_slide: function(slide) {
		let css = ['options', 'hide'];
		let css2 = ['options', 'weather', 'hide'];		
		let css3 = ['options', 'iframe', 'hide'];		
		let css4 = ['options', 'pictureframe', 'hide'];		
		if (DATABASE.screensaver.slides[slide].enabled == 1) {
			css = ['options'];
			if (DATABASE.screensaver.slides[slide].type == 'weather') css2 = ['options', 'weather'];
			if (DATABASE.screensaver.slides[slide].type == 'iframe') css3 = ['options', 'iframe'];
			if (DATABASE.screensaver.slides[slide].type == 'pictureframe') css3 = ['options', 'pictureframe'];
		}
		const isWeatherDevice = function(data) {	
			return (data['forecast_temperature'] != undefined || data['weathercondition'] != undefined || data['conditioncode'] != undefined || data['weather_description'] != undefined || data['current_weather_message'] != undefined);
		};
		const callback = function(checked) {			
			DATABASE.screensaver.slides[slide].enabled = checked;
			Database.save();			
			let button_save = document.getElementById('button_save');			
			if (checked == 1) button_save.classList.remove('hide');			
			else button_save.classList.add('hide');			
			let options = document.getElementsByClassName('options');			
			for (let i = 0; i < options.length; i++) {				
				if (checked == 1) {
					if (options[i].classList.contains('weather')) {
						if (DATABASE.screensaver.slides[slide].type == 'weather') options[i].classList.remove('hide');
						else options[i].classList.add('hide');
					} else if (options[i].classList.contains('iframe')) {
						if (DATABASE.screensaver.slides[slide].type == 'iframe') options[i].classList.remove('hide');
						else options[i].classList.add('hide');
					} else if (options[i].classList.contains('pictureframe')) {
						if (DATABASE.screensaver.slides[slide].type == 'pictureframe') options[i].classList.remove('hide');
						else options[i].classList.add('hide');
					} else options[i].classList.remove('hide');
				} else options[i].classList.add('hide');   
			}
		}
		let devices = { values: [""], labels: [LANG.forms.options.choose] };
		if (DATABASE.screensaver.slides[slide].device != '') {
			for (const device_id in HOMEY.data.devices) {				
				if (isWeatherDevice(HOMEY.data.devices[device_id].data)) {
					devices.values.push(device_id);
					devices.labels.push(HOMEY.data.devices[device_id].name);
				}
			}
		}
		const callback_type = function(rel, value) {			
			let weather_options = document.getElementsByClassName('weather');			
			let iframe_options = document.getElementsByClassName('iframe');			
			let devices = document.getElementById('settings_type_device');
			let data = document.getElementById('settings_type_data');
			devices.innerHTML = '<option value="">'+ LANG.forms.options.choose +'</option>';
			for (let i = 0; i < weather_options.length; i++) {
				if (value == 'weather') weather_options[i].classList.remove('hide');				
				else weather_options[i].classList.add('hide');
			}
			for (let i = 0; i < iframe_options.length; i++) {
				if (value == 'iframe') iframe_options[i].classList.remove('hide');				
				else iframe_options[i].classList.add('hide');
			}
			if (value == 'weather') {								
				for (let i = 0; i < weather_options.length; i++) weather_options[i].classList.remove('hide');				
				for (const device_id in HOMEY.data.devices) {
					if (isWeatherDevice(HOMEY.data.devices[device_id].data)) {
						devices.innerHTML += '<option value="'+ device_id +'">'+ HOMEY.data.devices[device_id].name +'</option>';					
					}
				}
			}
			if (value == 'iframe') {								
				for (let i = 0; i < iframe_options.length; i++) iframe_options[i].classList.remove('hide');				
			}
		}
		let items = [];				
		items.push(new Models.ListItem({ id: 'settings_status', type: 'CheckBox', value: DATABASE.screensaver.slides[slide].enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>', callback: callback }));						
		items.push(new Models.ListItem({ id: 'settings_type', name: '<h4 class="title">'+ LANG.fields.type +'</h4>', type: 'SelectList', value: DATABASE.screensaver.slides[slide].type, options: LANG.forms.options.screensaver.type, css: css, rel: '', callback: callback_type }));
		items.push(new Models.ListItem({ id: 'settings_type_device', name: '<h4 class="title">'+ LANG.fields.device +'</h4>', type: 'SelectList', value: DATABASE.screensaver.slides[slide].device, options: { values: devices.values, labels: devices.labels }, css: css2 }));								
		items.push(new Models.ListItem({ id: 'settings_type_data_url', name: '<h4 class="title">'+ LANG.fields.url +'</h4>', type: 'TextBox', value: DATABASE.screensaver.slides[slide].data.url, css: css3 }));								
		items.push(new Models.ListItem({ id: 'settings_type_data_refresh', name: '<h4 class="title">'+ LANG.fields.refresh +'</h4>', type: 'SelectList', value: DATABASE.screensaver.slides[slide].data.refresh, options: LANG.forms.options.screensaver.refresh, css: css3 }));					
		return items;
	},
	settings_screensaver_css: function() {
		let items = [];
		let value = '';
		if (DATABASE.screensaver.css && DATABASE.screensaver.css != '') {
			let tmp = [];
			const lines = DATABASE.screensaver.css.split('\n');
			for (let i = 0; i < lines.length; i++) {								
				tmp.push(lines[i]);								
			}
			value = tmp.join('\n');
		}							
		items.push(new Models.ListItem({ id: 'screensaver_css', type: 'TextArea', value: value, css: ['nowrap'] }));
		items.push(new Models.ListItem({ type: 'Html', html: LANG.htmls.css.screensaver }));
		return items;
	},
	settings_pin: function() {
		let items = [];		
		let css = ['options', 'hide'];
		let css2 = ['fl', 'xs', 'options', 'hide'];
		if (DATABASE.pin.enabled == 1) {
			css = ['options'];			
			css2 = ['fl', 'xs', 'options'];
		}	
		const callback = function(checked) {						
			DATABASE.pin.enabled = checked;
			Database.save();			
			let button_save = document.getElementById('button_save');			
			if (checked == 1) button_save.classList.remove('hide');			
			else button_save.classList.add('hide');			
			let options = document.getElementsByClassName('options');			
			for (let i = 0; i < options.length; i++) {				
				if (checked == 1) options[i].classList.remove('hide');
				else options[i].classList.add('hide');   
			}
		}
		
		let pin = DATABASE.pin.code.toString().split('');
		
		items.push(new Models.ListItem({ id: 'settings_pin', type: 'CheckBox', value: DATABASE.pin.enabled, name: '<h4 class="title">'+ LANG.fields.status +'</h4>', callback: callback }));	
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.pin_code +'</h2>', css: css }));		
		items.push(new Models.ListItem({ id: 'settings_pin_code_1', type: 'SelectList', value: pin[0], options: LANG.forms.options.numbers, css: css2 }));				
		items.push(new Models.ListItem({ id: 'settings_pin_code_2', type: 'SelectList', value: pin[1], options: LANG.forms.options.numbers, css: css2 }));				
		items.push(new Models.ListItem({ id: 'settings_pin_code_3', type: 'SelectList', value: pin[2], options: LANG.forms.options.numbers, css: css2 }));				
		items.push(new Models.ListItem({ id: 'settings_pin_code_4', type: 'SelectList', value: pin[3], options: LANG.forms.options.numbers, css: css2 }));				
		items.push(new Models.ListItem({ id: 'settings_pin_code_5', type: 'SelectList', value: pin[4], options: LANG.forms.options.numbers, css: css2 }));				
		return items;
	},
	settings_backup: function() {
		let items = [];
		const callback = function() { 	
			const backup = JSON.stringify(DATABASE);			
			if (CONFIG.emulated) alert(backup);
			else {
				const blob = new Blob([backup], { type: 'text/plain' });				
				cordova.plugins.saveDialog.saveFile(blob, 'smartdash_data.json').then(uri => {
  					//console.info("The file has been successfully saved to", uri);
				}).catch(reason => {
					System.notify_alert(reason, LANG.notify.title.alert, LANG.buttons.ok);									  					
				});				
			}
		};	
		const callback2 = function() { 		
			let input = document.createElement('input');
  			input.type = 'file';
  			input.onchange = function() {
            	const files = Array.from(input.files);            	
            	let reader = new FileReader();    			
    			reader.onload = function(e) {        			
      				if (isValidJson(e.target.result)) {      					
      					const json = JSON.parse(e.target.result);
      					if (json.settings != undefined) DATABASE.settings = { ...DATABASE.settings,  ...json.settings };		
      					if (json.panels != undefined) DATABASE.panels = { ...DATABASE.panels,  ...json.panels };		  	      						
      					if (json.screensaver != undefined) DATABASE.screensaver = { ...DATABASE.screensaver,  ...json.screensaver };			  					
      					if (json.autoplay != undefined) DATABASE.autoplay = { ...DATABASE.autoplay,  ...json.autoplay };		  
      					if (json.pin != undefined) DATABASE.pin = { ...DATABASE.pin,  ...json.pin };		      			      						      					
      					Database.save();      					      						
      					System.notify_confirm(LANG.notify.msg.need_reload, function(button) {
							if (button == 2) System.navigate('', 'fade');
						}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);														
						return false;      					
      				}      				
      			};
      			reader.readAsText(files[0]);            	
        	};
  			input.click();
		};	
		items.push(new Models.ListItem({ type: 'Html', html: '<h4 class="title">'+ LANG.htmls.export +'</h4>' }));
		items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_backup', icon: 'plus-box-outline', name: LANG.buttons.export, css: 'green', callback: callback }] }));				
		items.push(new Models.ListItem({ type: 'Html', html: '<h4 class="title">'+ LANG.htmls.import +'</h4>' }));
		items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_restore', icon: 'upload', name: LANG.buttons.import, css: 'blue', callback: callback2 }] }));				
		
		return items;
	},	
	devices: function() {
		let items = [];		
		let zones = {};
		for (const zone_id in HOMEY.data.zones) {						
			zones[zone_id] = { name: HOMEY.data.zones[zone_id].name, devices: [] };				
		}
		for (const device_id in HOMEY.data.devices) {			
			const device = HOMEY.data.devices[device_id];    										
			zones[device.zone].devices.push(device);
		}
		const base_img = Homey.imgBaseUrl();
		for (const zone_id in zones) {			
			const zone = zones[zone_id];    							
			items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ zone.name +'</h2>' }));
			for (const device_id in zone.devices) {			
				const device = zone.devices[device_id];    							
				items.push(new Models.ListItem({ type: 'Page', name:  '<h3>'+ device.name +'</h3><div class="img">'+ (device.icon == '' ? '<span class="size_xl mdi mdi-developer-board"></span>' : '<img src="'+ base_img + device.icon +'" />') +'</div>', desc: '<div class="p5b strong">'+ device.type +'</div><div>'+ getTime(device.lastUpdated, '?') +'</div>', route: 'sections/devices/'+ device.id }));
			}
		}		
		if (items.length == 0) items.push(new Models.ListItem({ type: 'Empty', icon: 'devices', text: LANG.no_results.devices }));		
		return items;
	},
	device: function(id) {			
		const device = HOMEY.data.devices[id];		
		let items = [];		
		items.push(new Models.ListItem({ type: 'Html', html: '<h3 class="title center">'+ device.name +'</h3>' }));
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.params +'</h2>' }));		
		
		items.push(new Models.ListItem({ type: 'Html', css: ['b1b'], html: '<div class="fl col8 left">'+ LANG.fields.type +'</div><div class="fr col4 size_s right strong">'+ device.type +'</div><div class="clear"></div>' }));		
		items.push(new Models.ListItem({ type: 'Html', html: '<div class="fl col8 left">'+ LANG.fields.updatetime +'</div><div class="fr col4 size_s right strong">'+ getTime(device.lastUpdated, '?') +'</div><div class="clear"></div>' }));		
				
		let capabilities = '';								
		for (const capability_id in device.data) {			    				
			const capability = device.data[capability_id];
			capabilities += '<div class="p10t p10b b1b">';
			capabilities += '<div class="fl col8 left">'+ capability.title +'<div class="size_xs">'+ capability_id +'</div></div><div class="fr col4 size_s right strong">'+ capability.value + (capability.units != undefined ? ' '+ capability.units : '') +'</div><div class="clear"></div>';			
			capabilities += '</div>';						    	
		}		
		if (capabilities != '') {			    				
			items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.capabilities +'</h2>' }));
			items.push(new Models.ListItem({ type: 'Html', html: capabilities }));		
		}	
		if (HOMEY.data.insights[id] != undefined) {			
			let insights = '';								
			for (const insight_id in HOMEY.data.insights[id]) {				
				const insight = HOMEY.data.insights[id][insight_id];
				insights += '<div class="p10t p10b b1b">';
				insights += '<div class="fl col8 left">'+ insight.name +'</div><div class="fr col4 size_s right strong">'+ insight.type +'</div><div class="clear"></div>';			
				insights += '</div>';						    	
			}
			if (insights != '') {			    				
				items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.insights +'</h2>' }));
				items.push(new Models.ListItem({ type: 'Html', html: insights }));		
			}
		}		
		/*
		if (DATABASE.settings.debug == 1) {
			let settings = '';								
			for (const setting in device.settings) {			    				
				settings += '<div class="p10t p10b b1b">';
				settings += '<div class=" left">'+ setting +'<div class="size_s">'+ device.settings[setting] +'</div></div>';			
				settings += '</div>';						    	
			}	
			if (settings != '') {			    				
				items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.config +'</h2>' }));
				items.push(new Models.ListItem({ type: 'Html', html: settings }));		
			}	
		}
		*/
		return items;
	},
	info: function() {
		let html = '';		
		html += '<p><strong>'+ LANG.fields.model +'</strong>: <span id="model">-</span></p>';
		html += '<p><strong>'+ LANG.fields.version +'</strong>: <span id="version">-</span></p>';
		html += '<p><strong>'+ LANG.fields.connection +'</strong>: <span>'+ (CONFIG.local ? LANG.labels.connection.local : LANG.labels.connection.cloud) +'</span></p>';
		html += '<p><strong>'+ LANG.fields.cloud +'</strong>: <span id="cloud">-</span></p>';
		let items = [];	
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.homey +'</h2>' }));	
		items.push(new Models.ListItem({ type: 'Html', html: html }));	
		const callback = function() { 	
			System.notify_confirm(LANG.notify.msg.confirm_reboot, function(button) {
				if (button == 2) {
					System.spinner_show();						 		
					 	Homey.reboot(function(json) {		 			 														 		
					 		System.notify_alert(LANG.notify.msg.reboot_ok, LANG.notify.title.info, LANG.buttons.ok);									
					 		System.navigate('', 'fade');
						}, function(json) { 
							System.spinner_hide();				
							System.notify_alert(json.message, LANG.notify.title.alert, LANG.buttons.ok);									
						});						
				}
			}, LANG.notify.title.alert, [LANG.buttons.no, LANG.buttons.yes]);																			
		};		
		items.push(new Models.ListItem({ type: 'PushButton', buttons: [{ id: 'button_reboot', icon: 'reload', name: LANG.buttons.reboot, css: 'red', callback: callback }] }));				
		items.push(new Models.ListItem({ type: 'Html', html: '<h2 class="title">'+ LANG.fields.groups.app +'</h2>' }));			
		items.push(new Models.ListItem({ type: 'Html', html: '<p><strong>'+ LANG.fields.version +'</strong>: '+ CONFIG.version +'</p><span id="app"></span>' }));						
		return items;
	}
};