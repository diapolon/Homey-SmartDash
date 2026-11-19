/*12/02/2024*/
'use strict';
const Daemon = function(callback, interval) {
		this._callback = callback;
		this._interval = Math.floor(interval) * 1000;		
		this.start = function() { this._SESSION = window.setInterval(this._callback, this._interval, this); };
		this.stop = function() { window.clearInterval(this._SESSION); };
		this.forceCall = function() { this._callback(); };
};

const Timer = function(callback, delay) {
		this._SESSION = undefined;
		this._callback = callback;
		this._delay = Math.floor(delay) * 1000;			
		this.start = function() { 
			if (this._SESSION) return;
			this._SESSION = window.setTimeout(this._callback, this._delay);
		};
		this.stop = function() { 
			window.clearTimeout(this._SESSION); 
			this._SESSION = undefined;
		};
		this.restart = function() { 
			this.stop();
			this.start();
		};
};