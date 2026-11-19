/*06/05/2024*/
'use strict';
const PinPad = AbstractView.extend({
	template: 'pinpad',
	id: 'pinpad',
	events: {		
		'touchstart .button': 'touchStart',
		'touchcancel .button': 'touchCancel',
		'touchmove .button': 'touchMove',
		'touchend .button': 'touchEnd'		
	},	
	locked: true,
	timers: { unlock: undefined, autoclose: undefined },
	params: { counter : 0, pin: '', numbers: [] },	
	_domReady: function() {		
		this.password = document.getElementById('password');				
		this._reset();
	},
	show: function(route) {		
		self = this;
		this.route = route;		
		this.el.classList.add('show');
		this.timers.autoclose = new Timer(function() { self.close() }, 30);
		this.timers.autoclose.start();
	},
	close: function() {				
		this._reset();
		if (this.timers.autoclose) {
			this.timers.autoclose.stop();			
			this.timers.autoclose = undefined;
		}
		this.el.classList.remove('show');
	},
	lock: function() {		
		this.locked = true;		
		if (this.timers.unlock) {
			this.timers.unlock.stop();			
			this.timers.unlock = undefined;
		}		
	},
	_reset: function() {		
		let p = document.getElementsByClassName('p');			
		for (let i = 0; i < p.length; i++) p[i].classList.remove('selected');
		this.params = { counter : 0, pin: '', numbers: [] };		
	},
	_touchEnd: function(event, childElement) {
		const op = childElement.getAttribute('data-op');		
		switch(op) {
			case 'calc':
				const value = childElement.getAttribute('data-value');						
				if (this.params.numbers.length < 5) {
					this.params.numbers.push(value);					
					document.getElementById('p_'+ this.params.numbers.length).classList.add('selected');		
					this.params.pin += value;		
				}
				if (this.params.numbers.length >= 5) {				
					if (this.params.pin == DATABASE.pin.code) {												
						let self = this;
						this.locked = false;
						this.timers.unlock = new Timer(function() { self.lock(); }, 60);
						this.timers.unlock.start();
						this.close();
						System.navigate(this.route, 'fade');													
					} else this._reset();									
				}				
				break;			
			case 'close':				
				this.close();
				break;							
		}
		return true;
	},
});