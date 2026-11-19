/*10/05/2024*/
'use strict';
const WidgetTimeline = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget timeline',
		template: 'widget_timeline',	
		_domReady: function() {			    	
			this.el.classList.add('shadow');
			this.timeline = this.el.getElementsByClassName('list')[0];	    	
			this.domRefresh();		    
		},
		domRefresh: function() {			    			
		    let self = this;
		    Homey.getTimeline(function(notifications) {		    	    		    
		    	let data = '';		    	
		    	if (Object.values(notifications).length > 0) {		    		
			    	for (const notification of Object.values(notifications).reverse()) {										    	
			    		const txt = notification.excerpt.replace(/\*\*([^\*]+)\*\*([^\*])/g, '<strong>$1</strong>$2');	    		
			    		data += '<li><div>'+ txt +'</div>'+ self.getTime(notification.dateCreated) +'</li>';	    		
			    	}
			    } else data += '<li><div>'+ LANG.no_results.notifications +'</div></li>';	    			
		    	self.timeline.innerHTML = data;
		    	self.el.classList.remove('shadow');
			}, function(json) {			
				self.el.classList.remove('shadow');
			});		
		},
		refresh: function() {				
		    this.domRefresh();		
		},
		getTime: function(date) {			    	
			const d = new Date(date);
			const cd = new Date();		
			let fmt;
			if (cd.getDate() == d.getDate()) fmt = 'HH:MM'; // this day		
			else if (cd.getFullYear() == d.getFullYear()) fmt = 'd mmm, HH:MM'; // this year
			else fmt = 'd/m/yy, HH:MM'; // one upon a time
			return d.format(fmt);
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save		
}