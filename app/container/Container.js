/*16/12/2024*/
'use strict';
const Container = AbstractView.extend({	
	events: {
		'touchstart #nav_bar .button': 'touchStart',
		'touchcancel #nav_bar .button': 'touchCancel',
		'touchmove #nav_bar .button': 'touchMove',
		'touchend #nav_bar .button': 'touchEnd',
		'touchstart #main': 'swipeStart',
		'touchcancel #main': 'swipeCancel',
		'touchmove #main': 'swipeMove',
		'touchend #main': 'swipeEnd'
	},
	template: 'container',
	id: 'wrapper_container',
	className: 'wrapper',		
	daemon: undefined,	
	swipe: { isSwiping: false, startX: 0, startY: 0, threshold: 100, restraint: 100, allowedTime: 300, startTime: 0 },
	_initialize: function(options) {
		CONFIG.state_history = [];
		this.currentPage = undefined;				
		this.bottombar = new BottomBar({ model: DataForm.bottombar(), parent: this });
		this.bottombar.render();								
		this.screensaver = new ScreenSaver();
		this.screensaver.render();
		this.pinpad = new PinPad();
		this.pinpad.render();
		if (!CONFIG.emulated) {
			if (DATABASE.settings.keepawake == 1) cordova.plugins.brightness.setKeepScreenOn(true);
			else cordova.plugins.brightness.setKeepScreenOn(false);
			if (DATABASE.settings.unsecure == 1) cordova.plugins.certificates.trustUnsecureCerts(true);		
		}
	},
	domReady: function() {		
		this.site = document.getElementById('site');		
		this.mask = document.getElementById('mask');
		this.main = document.getElementById('main');
		this.container = document.getElementById('content');
		this.nav_bar = document.getElementById('nav_bar');			
		this.title = document.getElementById('title');		
		this.button_back = document.getElementById('button_back');
		this.button_dashboard = document.getElementById('button_dashboard');
				
		this.addComponents();		
						
		this.daemon = new Daemon(function() { Data.update_check(); }, DATABASE.settings.sync);
		this.daemon.start();					

	},		
	addComponents: function() {		
		const components = ['bottombar', 'screensaver', 'pinpad'];				
		let fragment = document.createDocumentFragment();
		for (let i = 0; i < components.length; i++) fragment.appendChild(this[components[i]].el);								
		this.main.appendChild(fragment);
		for (let i = 0; i < components.length; i++) this[components[i]].trigger('domReady');		
	},		
	setTitle: function(title) {		
		this.title.innerHTML = title;			
	},		
	setButtons: function(state) {				
		if (state.includes('#dashboard')) {			
			this.site.classList.add('dashboard');
			this.site.classList.remove('others');			
		} else {
			this.site.classList.add('others');
			this.site.classList.remove('dashboard');			
		}
	},
	slidePage: function(page) {
		this.mask.classList.remove('hide');
		const state = window.location.hash;

		const to = this._getNextPosition(state);
		if (to == 'right') CONFIG.state_history.pop();					
		else CONFIG.state_history.push(state);			
		
		this.setButtons(state);		
		
		if (this.currentPage) this.currentPage.close();
		this.currentPage = page;
		this.container.innerHTML = '';
		this.container.appendChild(this.currentPage.el);
		let self = this;
		window.setTimeout(function () { 
			self.mask.classList.add('hide');
		}, 100);
	},
	_getNextPosition: function(state) {
		const l = CONFIG.state_history.length;
		if (l === 0 || state === CONFIG.state_history[l - 1]) return 'center';
		if (state === CONFIG.state_history[l - 2]) return 'right';
		return 'left';
	},
	swipeMove: function(event, childElement) {			
	},
	swipeCancel: function(event, childElement) {
		this.swipe.isSwiping = false;
	},
	swipeStart: function(event, childElement) {			
		/*let state = window.location.hash;
		if (state.includes('#dashboard') && event.changedTouches.length == 1) {
			this.swipe.isSwiping = true;
			let touchobj = event.changedTouches[0];				
			this.swipe.startX = touchobj.pageX;
			this.swipe.startY = touchobj.pageY;
			this.swipe.startTime = new Date().getTime();
		}*/
	},
	swipeEnd: function(event, childElement) {				
		/*if (this.swipe.isSwiping) {
			let touchobj = event.changedTouches[0];
			let distX = touchobj.pageX - this.swipe.startX;
			let distY = touchobj.pageY - this.swipe.startY;
			if ((new Date().getTime() - this.swipe.startTime) <= this.swipe.allowedTime) {
				let state = window.location.hash;
			    if (Math.abs(distX) >= this.swipe.threshold && Math.abs(distY) <= this.swipe.restraint) { 
					if (distX < 0) this._swipeToLeft(state);
					else this._swipeToRight(state);
			    } else if (Math.abs(distY) >= this.swipe.threshold && Math.abs(distX) <= this.swipe.restraint) {
					//if (distY < 0) this._swipeFromUp(state);
					//else this._swipeFromDown(state);
			    }
			}				
			this.swipe.isSwiping = false;
		}*/
	},
	_swipeFromUp: function(state) { 		
		//if (state == '#dashboard/down') System.navigate('dashboard/center', 'slide', 'down');		
		//else if (state == '#dashboard/center') System.navigate('dashboard/up', 'slide', 'down');					
	},
	_swipeFromDown: function(state) { 
		//if (state == '#dashboard/up') System.navigate('dashboard/center', 'slide', 'up');		
		//else if (state == '#dashboard/center') System.navigate('dashboard/down', 'slide', 'up');				
	},
	_swipeToLeft: function(state) {		
		//if (state == '#dashboard/left') System.navigate('dashboard/center', 'fade');		
		//else if (state == '#dashboard/center') System.navigate('dashboard/right', 'slide', 'left');		
	},
	_swipeToRight: function(state) {
		//if (state == '#dashboard/right') System.navigate('dashboard/center', 'fade');		
		//else if (state == '#dashboard/center') System.navigate('dashboard/left', 'slide', 'right');		
	},
	_touchEnd: function(event, childElement) {
		switch(childElement.id) {
			case 'button_dashboard':
				System.navigate('dashboard', 'fade');
				break;
			case 'button_back':
				System.handle_backButton();																					
				break;				
		}
		return true;
	},
	_onClose: function() { 		
		this.daemon.stop();
		this.daemon = undefined;			
	}	
});