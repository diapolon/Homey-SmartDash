/*30/12/2024*/
'use strict';
const ScreenSaver = AbstractView.extend({
	template: 'screensaver',
	id: 'screensaver',
	daemon: undefined,
	obj: null,
	slides: { availables: [], current: 0 },
	active: false,		
	__render: function() {	
		this.getCustomCss();
	},			
	_domReady: function() {				
		this.inner = document.getElementById('screensaver_inner');
		try {
			let self = this;
	    	this.daemon = new Daemon(function() { self.toUpdate(); }, 60);
			this.daemon.start();					    			
	    } catch(err) {
	    	System.notify_alert(err);	        
	    }		
	},	
	_init: function() {		
		if (DATABASE.screensaver.opacity == 1) this.el.classList.add('opacity');
		else this.el.classList.remove('opacity');								
		this.slides.availables = [];
		for (const s in DATABASE.screensaver.slides) {			    				
			if (DATABASE.screensaver.slides[s].enabled == 1) this.slides.availables.push(s);				
		}		
		this.lastUpdated = 0;
		this.slides.current = this.slides.availables[0];				
	},
	toUpdate: function() {			
		if (this._isTime()) this._show();
		else this._hide();
	},
	_isTime: function() {			
		if (DATABASE.screensaver.enabled == 1) {			
			const hour = new Date().getHours();			
			if ((DATABASE.screensaver.from <= DATABASE.screensaver.to && (hour >= DATABASE.screensaver.from && hour <= DATABASE.screensaver.to)) || (DATABASE.screensaver.from > DATABASE.screensaver.to && (hour >= DATABASE.screensaver.from || hour <= DATABASE.screensaver.to))) {				
				return true;				
			}
		}
		return false;		
	},	
	_enable: function() {
		if (this.obj == null) {			
			let self = this;			
			this.obj = new Scsaver('#scsaver', { autoStart: false, waitTime: (DATABASE.screensaver.time * 60 * 1000) });					
			this.obj.on('waitStart', function() {								
				self.active = false;
			});			
			this.obj.on('showStart', function() {												
				if (!CONFIG.emulated && DATABASE.screensaver.brightness != -1) cordova.plugins.brightness.setBrightness(DATABASE.screensaver.brightness);				
				self._init();								
				self.active = true;
				self.toUpdate();
			});			
			this.obj.on('hideStart', function() {
				self.active = false;				
				if (!CONFIG.emulated && DATABASE.screensaver.brightness != -1) cordova.plugins.brightness.setBrightness(-1);				
			});			
			this.obj.enabled();					
		}		
	},
	_disable: function() {			
		if (this.obj != null) {			
			this.obj.disabled();			
			this.obj = null;					
		}
	},
	_show: function() {						
		this._enable();
		if (this.active) {
			this._update();
			const pos = this.slides.availables.indexOf(this.slides.current);
			let new_position = this.slides.availables[pos+1];
			if (new_position == undefined) new_position = this.slides.availables[0];						
			this.slides.current = new_position;			 
		}		
	},
	_update: function() {				
		switch(DATABASE.screensaver.slides[this.slides.current].type) {
			case 'blank':
					this.inner.innerHTML = '';		
				break;				
			case 'clock':												
				this.inner.innerHTML = '<div class="screensaver_time x"><div class="y">'+ getTime(new Date().getTime(), '?') +'</div></div>';					
				break;
			case 'pictureframe':												
				this.inner.innerHTML = '<div class="screensaver_time x"><div class="y">'+ getTime(new Date().getTime(), '?') +'</div></div>';					
				break;	
			case 'iframe':				
					if (this.inner.innerHTML == '' || this.slides.availables.length > 1) this.inner.innerHTML = '<div class="screensaver_iframe"><iframe id="s_iframe" src="'+ DATABASE.screensaver.slides[this.slides.current].data.url +'"></iframe></div>';
					if (this.slides.availables.length == 1 && DATABASE.screensaver.slides[this.slides.current].data.refresh > 0) {
						this.lastUpdated++;
						if (this.lastUpdated == DATABASE.screensaver.slides[this.slides.current].data.refresh) {
							this.lastUpdated = 0;
							document.getElementById('s_iframe').src += '';
						}
					}
				break;							
			case 'weather':
				if (HOMEY.data.devices[DATABASE.screensaver.slides[this.slides.current].device] != undefined) {
					const device = HOMEY.data.devices[DATABASE.screensaver.slides[this.slides.current].device];
					const data = getWeatherDevice(device.data);
					let html = '<div class="screensaver_weather"><div class="weatherTitle">'+ device.name +'</div>';
					if (data.icon != '-') html += '<div class="weatherIcon"><i class="mdi mdi-'+ data.icon +'"></i></div>';
					html += '<div class="weatherInfo">'+
							'<div class="temperature"><span>'+ data.temperature +'&deg;</span></div>'+
							'<div class="description">'+
								'<div class="condition">'+ data.condition +'</div>'+
								'<div class="minmax">'+ data.temperature_minmax +'</div>'+
							'</div>'+
						'</div>'+
						'<div class="weatherInfos">'+								
								'<div><div class="icon"><i class="mdi mdi-weather-windy"></i></div><div class="info"><span>Wind</span>'+ data.wind +'</div></div>'+
								'<div><div class="icon"><i class="mdi mdi-water-outline"></i></div><div class="info"><span>Humidity</span>'+ data.humidity +'%</div></div>'+
								'<div><div class="icon"><i class="mdi mdi-thermometer"></i></div><div class="info"><span>Feels Like</span>'+ data.temperature_feelslike +'&deg;</div></div>'+
						'</div>'+
						'</div>';
					this.inner.innerHTML = html;
				} 				
				break;						
		}		
	},
	_hide: function() {			
		this._disable();
	},
	getCustomCss: function() {
		if (DATABASE.settings.custom == 1) {
			let screensaver_css = [];
			if (DATABASE.screensaver.css && DATABASE.screensaver.css != '') {
				const lines = DATABASE.screensaver.css.split('\n');
				for (let i = 0; i < lines.length; i++) screensaver_css.push('#screensaver ' + lines[i]);			
			}							
			this.params.style = screensaver_css.join('\n');
		}
	},
	_onClose: function() {		
		this._hide();		
		this.daemon.stop();
		this.daemon = undefined;					
	}
});