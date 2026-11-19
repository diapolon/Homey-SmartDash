/*08/01/2025*/
'use strict';
const Dashboard = AbstractList.extend({
	dashClasses: { toolbar: 'rows2', panel: 'rows' },
	dashViews: { toolbar: [], panels: [] },
	dashList: { toolbar: undefined, panels: [] },
	template: 'dashboard',	
	className: 'slide dashboard',		
	current: 0,
	panels: 5,
	daemons: { autoswitch: undefined, control: undefined },
	timers: { autoswitch: undefined, control: undefined },
	types: {
		'Button': 'GridButton',
		'Title': 'GridTitle',
		'Network': 'GridNetwork',
		'Menu': 'GridMenu',
		'AutoSwitch': 'GridAutoSwitch',
		'Unknown': 'WidgetUnknown',
		'Empty': 'WidgetEmpty',				
		'Dummy': 'WidgetDummy',		
		'Panel': 'WidgetPanel',		
		'Clock': 'WidgetClock',		
		'GenericCapability': 'WidgetGenericCapability',
		'GenericAlert': 'WidgetGenericAlert',
		'GenericSensor': 'WidgetGenericSensor',
		'GenericSocket': 'WidgetGenericSocket',
		'GenericLight': 'WidgetGenericLight',
		'GenericFan': 'WidgetGenericFan',
		'GenericThermostat': 'WidgetGenericThermostat',
		'GenericSpeaker': 'WidgetGenericSpeaker',
		'Iframe': 'WidgetIframe',
		'Insight': 'WidgetInsight',
		'Lock': 'WidgetLock',
		'Timeline': 'WidgetTimeline',
		'PresenceSensor': 'WidgetPresenceSensor',
		'THSensor': 'WidgetTHSensor',
		'ComfortSensor': 'WidgetComfortSensor',
		'SMSensor': 'WidgetSMSensor',				
		'VirtualButton': 'WidgetVirtualButton',		
		'VirtualCamera': 'WidgetVirtualCamera',				
		'VideoPlayer': 'WidgetVideoPlayer',				
		'HomeyImage': 'WidgetHomeyImage',				
		'LightRGB': 'WidgetLightRGB',
		'BlindCurtain': 'WidgetBlindCurtain',
		'Separator': 'WidgetSeparator',
		'Powerwall': 'WidgetPowerwall',
		'JsonVariable': 'WidgetJsonVariable',
		'Weather': 'WidgetWeather',
		'SolarPanel': 'WidgetSolarPanel',
		'EnergyFlow': 'WidgetEnergyFlow',
		'Test': 'WidgetTest',
	 },
	__initialize: function(options) { 	
		this.data = options.dashboard;
		this.dashViews.toolbar = this.initializeItems(this.data.toolbar);	
		for(let i = 0; i <= this.panels; i++) this.dashViews['panels'][i] = this.initializeItems(options.dashboard.panels[i]);		
		
		this.parent = options.parent;		
	},
	__render: function() {
		this.updateBackground();
		this.getCustomCss();
	},
	__domReady: function() {			
		this.dashList.toolbar = document.getElementById(this.id).getElementsByClassName(this.dashClasses.toolbar)[0];		
		this.renderItems(this.dashViews.toolbar, this.dashList.toolbar);
		for(let i = 0; i <= this.panels; i++) {
			this.dashList['panels'][i] = document.getElementById(this.id).getElementsByClassName(this.dashClasses.panel)[i];		
			this.renderItems(this.dashViews['panels'][i], this.dashList['panels'][i]);
		}	
		
		let self = this;
		this.listenTo(Data, 'updateReady', function() {	self.toUpdate(); });								
		this.toUpdate();
		
		Data.update_check();
		
		this._homeyControl();		
		this._autoSwitch();		
	},
	getType: function(type) {	
		if (this.types[type] == undefined) type = 'Unknown';
		return eval(this.types[type]).dashboard;
	},	
	initializeItems: function(model) {	
		let views = [];		
		let self = this;		
		_.each(model, function(content, index) {			
			const type = content.get('type');			
			const obj = self.getType(type);
			const view = new obj({ id: content.get('id'), model: content, parent: self });			
			view.render();
			views.push(view);
		});			
		return views;
	},	
	toUpdate: function() {		
		let self = this;
		for (const p in this.data.panels) {			    				
			let models = this.data.panels[p]; 
			_.each(models, function(content, index) {				
				if (content.get('widget')) {
					let refresh = false;
					const device_id = content.get('widget').device;			
					if (device_id == '' || HOMEY.data.devices[device_id] == undefined) refresh = true;
					else {
						const device = JSON.parse(JSON.stringify(HOMEY.data.devices[device_id]));									
						if (device != undefined && device.lastUpdated > content.get('lastUpdated')) {
							content.set('data', device.data);
							content.set('lastUpdated', device.lastUpdated);
							content.set('update', getTime(device.lastUpdated, '?'));										
							refresh = true;
						}
					}
					if (refresh) self.dashViews['panels'][p][index].refresh();
				}
			});					
		}
	},	
	updateBackground: function() {		
		for (let i = 0; i < LANG.forms.options.panel.bg.values.length; i++) {				
			this.el.classList.remove(LANG.forms.options.panel.bg.values[i]);		
		}
		if (DATABASE.panels[this.current].bg) this.el.classList.add(DATABASE.panels[this.current].bg);					
	},	
	updateHomeyControl: function() {		
		if (DATABASE.autoplay.logic != '') {
			if (DATABASE.autoplay.timeout > 0 && !this.timers.control) {
				let self = this;
				this.timers.control = new Timer(function() { self._homeyControlClose() }, DATABASE.autoplay.timeout);
				this.timers.control.start();
			}
		}
	},	
	resetHomeyControl: function() {		
		if (DATABASE.autoplay.logic != '') {
			if (this.daemons.control) this._homeyControlClose();							
		}
	},	
	_homeyControl: function() {					
		if (DATABASE.autoplay.logic != '') {
			let self = this;
			this.daemons.control = new Daemon(function() { 
				Homey.getVariable(DATABASE.autoplay.logic, function(json) {		    
		    		const panel = parseInt(json.value) - 1;
					if (panel != self.current && panel >= 0 && panel <= self.panels && DATABASE.panels[panel].enabled > 0 && DATABASE.panels[panel].widgets.length > 0) {
						if (self.daemons.autoswitch) self.daemons.autoswitch.stop();		
						//disable screensaver	
						document.getElementById(self.id).click();
						//Homey.setVariable(DATABASE.autoplay.logic, { value: 0 });
						Data.trigger('show_'+ panel);		
						self.updateHomeyControl();							
					}
		    	}, function(json) {
				});			    
			}, 2);
			this.daemons.control.start();					
		}
	},	
	_homeyControlClose: function() {	
		Homey.setVariable(DATABASE.autoplay.logic, { value: 0 });
		if (this.timers.control) {
			this.timers.control.stop();			
			this.timers.control = undefined;
		}
		if (this.daemons.autoswitch) this.daemons.autoswitch.start();			
	},	
	_autoSwitch: function() {					
		if (DATABASE.autoplay.enabled == 1) {
			let availables = [];
			for (const p in DATABASE.panels) {			    							
				if (DATABASE.panels[p].enabled == 1 && DATABASE.panels[p].mode == 1 && DATABASE.panels[p].widgets.length > 0) availables.push(parseInt(p));				
			}			
			if (availables.length > 1) {
				let self = this;
				let new_position = 0;
				this.daemons.autoswitch = new Daemon(function() { 
					const pos = availables.indexOf(new_position);
					new_position = availables[pos+1];
					if (new_position == undefined) new_position = availables[0];							
					Data.trigger('show_'+ new_position);
				}, DATABASE.autoplay.duration);
				this.daemons.autoswitch.start();
			}
		}
	},	
	getCustomCss: function() {
		if (DATABASE.settings.custom == 1) {
			let dashboard_css = [];
			for (const p in DATABASE.panels) {			    				
				const panel = DATABASE.panels[p];				
				if (panel.css && panel.css != '') {
					const lines = panel.css.split('\n');
					for (let i = 0; i < lines.length; i++) dashboard_css.push('#panel_'+ p + lines[i]);			
				}
				for (const position in panel.widgets) {			    				
					const widget = panel.widgets[position];																		
					if (widget.enabled == 1 && widget.css && widget.css != '') {
						const lines = widget.css.split('\n');
						for (let i = 0; i < lines.length; i++) {				
							let rule = lines[i];
							if (rule.startsWith('.content')) rule = ' '+ rule;
							dashboard_css.push('#panel_'+ p +' ul.rows #widget_'+ p +'_'+ position + rule);
						}					
					}
				}
			}
			this.params.style = dashboard_css.join('\n');
		}
	},	
	__onClose: function() { 				
		if (this.daemons.autoswitch) {
			this.daemons.autoswitch.stop();			
			this.daemons.autoswitch = undefined;
		}
		if (this.daemons.control) {
			this.daemons.control.stop();			
			this.daemons.control = undefined;
		}
		_.invoke(this.dashViews.toolbar, 'close');		
		for(let i = 0; i <= this.panels; i++) _.invoke(this.dashViews['panels'][i], 'close');				
		this.dashViews = { toolbar: [], panels: [] };		
	}
});