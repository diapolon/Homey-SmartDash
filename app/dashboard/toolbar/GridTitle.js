/*03/06/2024*/
'use strict';
const GridTitle = {
	dashboard: AbstractListItem.extend({
		className: 'grid title',
		template: 'grid_title',
		_domReady: function() {					
			this.title = document.getElementById('grid_title');		
			this.title.classList.add('on');
			let self = this;							
			this.listenTo(Data, 'updateTime', function() { self.toUpdate(); });		
			this.daemon = new Daemon(function() { self.toUpdate; }, 60);
			this.daemon.start();					
			
			this.toUpdate();		
		},
		toUpdate: function() {		
			if (DATABASE.panels[this.parent.current].showtime == 1) this.title.innerHTML = getTime(new Date().getTime(), '?');
			else this.title.innerHTML = '';
			
		},		
	})
}