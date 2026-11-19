/*30/12/2024*/
'use strict';
const App = Backbone.Router.extend({
	site: undefined,
	routes: {
		'': 'cover',		
		'login': 'login',
		'intro': 'intro',
		'disconnect': 'disconnect',						
		'dashboard': 'dashboard',				
		'sections/panels': 'section_panels',			
		'sections/panels/settings': 'section_panels_settings',						
		'sections/panels/settings/:type': 'section_panels_setting',										
		'sections/panels/:panel': 'section_panel',					
		'sections/panels/:panel/edit': 'section_panel_edit',					
		'sections/panels/:panel/css': 'section_panel_edit_css',					
		'sections/panels/:panel/wizard/choose': 'section_panel_wizard_choose',			
		'sections/panels/:panel/wizard/:type/add/info': 'section_panel_wizard_add_info',			
		'sections/panels/:panel/wizard/:type/add/new': 'section_panel_wizard_add_new',			
		'sections/panels/:panel/wizard/:type/edit/:widget': 'section_panel_wizard_edit',					
		'sections/panels/:panel/wizard/:type/edit/:widget/css': 'section_panel_wizard_edit_css',					
		'sections/devices': 'section_devices',			
		'sections/devices/:id': 'section_device',			
		'sections/settings': 'section_settings',		
		'sections/settings/backup': 'section_setting_backup',
		'sections/settings/screensaver/css': 'section_setting_screensaver_css',		
		'sections/settings/screensaver/:slide': 'section_setting_screensaver_slide',		
		'sections/settings/:type': 'section_setting',				
		'sections/info': 'section_info'
	},
	initialize: function() {
		Collections.initialize();
		System.initialize();
		this.currentPage = undefined;
		this.containerPage = false;
		this.site = document.getElementById('site');
		Backbone.history.start(); 
	},
	changePage: function(page, title) { 		
		page.render();
		this.currentPage.setTitle(title);
		this.currentPage.slidePage(page);								
		window.setTimeout(function () {				
			page.trigger('domReady'); 			
		});
	},
	showPage: function(page) {			
		if (this.currentPage) this.currentPage.close();
		this.currentPage = page;
		this.currentPage.render();
		this.site.innerHTML = null;
		this.site.appendChild(this.currentPage.el);
		this.currentPage.trigger('domReady');
	},
	/*pages*/
	initContainer: function() { 
		if (this.containerPage) return;			
		this.containerPage = true;
		let containerPage = new Container();
		this.showPage(containerPage);
	},
	cover: function() {		
		let page = new Cover();
		this.showPage(page);
	},
	intro: function() {
		this.containerPage = false;		
		let page = new Intro({ model: DataForm.intro() });
		this.showPage(page);
	},
	login: function() {	
		let page = new Login({ model: DataForm.login() });
		this.showPage(page);
	},
	
	error: function() { 
	},
	
	disconnect: function() { 		
		System.notify_confirm(LANG.notify.msg.ok, function(button2) { 							
			//window.localStorage.removeItem('settings');
			//window.localStorage.removeItem('updateTime');
			//window.localStorage.removeItem('panels');			
			System.navigate('', 'fade');
		}, LANG.notify.title.info, [LANG.buttons.ok]);		
	},	
	
	dashboard: function() {	
		if (!this.containerPage) this.initContainer();			
		const page = new Dashboard({ id: 'dashboard', dashboard: DataForm.dashboard(), parent: this.currentPage });
		this.changePage(page, '');					
	},		
			
	section_panels: function() {			
		const page = new ListPanels({ model: DataForm.panels() });
		this.changePage(page, LANG.menu.section_panels.name);		
	},
	section_panels_settings: function() {
		const page = new List({ id: 'list_panels_settings', model: DataForm.panels_settings() });		
		this.changePage(page, LANG.menu.section_panels.name +' / '+ LANG.menu.section_panels.settings);		
	},	
	section_panels_setting: function(type) {
		const page = new FormPanels({ type: type, model: DataForm.panels_setting(type) });
		this.changePage(page, LANG.menu.section_panels.name +' / '+ LANG.menu.section_panels[type]);		
	},	
		
	section_panel: function(panel) {		
		const page = new ListPanel({ panel: panel, model: DataForm.panel(panel) });
		this.changePage(page, LANG.menu.section_panel.name +' #'+ (parseInt(panel) + 1));		
	},
	section_panel_edit: function(panel) {
		const page = new FormPanel({ panel: panel, model: DataForm.panel_edit(panel) });
		this.changePage(page, LANG.menu.section_panel.name +' #'+ (parseInt(panel) + 1));		
	},
	section_panel_edit_css: function(panel) {			
		const page = new FormPanelCss({ panel: panel, model: DataForm.panel_edit_css(panel) });		
		this.changePage(page, LANG.menu.section_panel.name +' #'+ (parseInt(panel) + 1));
	},
	section_panel_wizard_choose: function(panel) {								
		const page = new List({ id: 'wizard_choose', model: DataForm.widget_wizard(panel) });
		this.changePage(page, LANG.menu.section_panel.add);
	},				
	section_panel_wizard_add_info: function(panel, type) {				
		const page = new List({ id: 'wizard_choose_info', model: DataForm.widget_wizard_info(panel, type) });
		this.changePage(page, LANG.menu.section_panel.add);
	},				
	section_panel_wizard_add_new: function(panel, type) {				
		const page = new FormPanelWidget({ widget: '-1', panel: panel, type: type, model: DataForm.widget_edit(panel, type, '-1') });		
		this.changePage(page, LANG.menu.section_panel.add);
	},				
	section_panel_wizard_edit: function(panel, type, widget) {			
		const page = new FormPanelWidget({ widget: widget, panel: panel, type: type, model: DataForm.widget_edit(panel, type, widget) });		
		this.changePage(page, LANG.menu.section_panel.edit);
	},				
	section_panel_wizard_edit_css: function(panel, type, widget) {			
		const page = new FormPanelWidgetCss({ widget: widget, panel: panel, type: type, model: DataForm.widget_edit_css(panel, type, widget) });		
		this.changePage(page, LANG.menu.section_panel.edit);
	},				
	
	section_devices: function() {								
		const page = new ListDevices({ model: DataForm.devices() });
		this.changePage(page, LANG.menu.section_devices.name);		
	},			
	section_device: function(id) {				
		if (HOMEY.data.devices[id] == undefined) {
			System.alert_show('Device not found');
			System.navigate('error', 'fade');
			return;
		}		
		const page = new ListDevice({ device: id, model: DataForm.device(id) });
		this.changePage(page, LANG.menu.section_devices.name);
	},		
	
	section_settings: function() {				
		const page = new List({ id: 'list_settings', model: DataForm.settings() });
		this.changePage(page, LANG.menu.section_settings.name);		
	},				
	section_setting: function(type) {				
		const page = new FormSettings({ type: type, model: DataForm.setting(type) });
		this.changePage(page, LANG.menu.section_settings.name +' / '+ LANG.menu.section_settings[type]);		
	},		
	section_setting_screensaver_slide: function(slide) {				
		const page = new FormSettings({ type: 'screensaver_slide', slide: slide, model: DataForm.settings_screensaver_slide(slide) });
		this.changePage(page, LANG.menu.section_settings.name +' / '+ LANG.menu.section_settings.screensaver +'/ '+ LANG.menu.section_settings.screensaver_slide +' # '+ (parseInt(slide) + 1));		
	},		
	section_setting_screensaver_css: function() {				
		const page = new FormSettings({ type: 'screensaver_css', model: DataForm.settings_screensaver_css() });
		this.changePage(page, LANG.menu.section_settings.name +' / '+ LANG.menu.section_settings.screensaver +'/ CSS');		
	},		
	section_setting_backup: function() {				
		const page = new Form({ id: 'list_backup', model: DataForm.setting('backup') });
		this.changePage(page, LANG.menu.section_settings.name +' / '+ LANG.menu.section_settings.backup);		
	},		
	
	section_info: function() {				
		const page = new Info({ model: DataForm.info() });
		this.changePage(page, LANG.menu.section_info.name);		
	}		
});	