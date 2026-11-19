/*18/04/2024*/
'use strict';
const GridNetwork = {
	dashboard: AbstractListItem.extend({
		className: 'grid button',
		template: 'grid_button',
		__render: function() {
			if (HOMEY.status.errors == 0) this.el.classList.add('online');						
			else if (HOMEY.status.errors > 5) this.el.classList.add('offline');						
			else this.el.classList.add('error');						
		},
		_domReady: function() {				
			let self = this;			
			this.listenTo(Data, 'updateReady', function() {	self.updateOk(); });		
			this.listenTo(Data, 'updateError', function() {	self.updateKo(); });				
		},
		updateOk: function() {		
			if (this.el.classList.contains('error')) {				
				this.el.classList.remove('error', 'offline');
				this.el.classList.add('online');			
			}
		},		
		updateKo: function() {			
			if (this.el.classList.contains('online')) {
				this.el.classList.remove('online');			
				this.el.classList.add('error');			
			}
			if (HOMEY.status.errors > 5 && !this.el.classList.contains('offline')) this.el.classList.add('offline');						
		}
	})
}