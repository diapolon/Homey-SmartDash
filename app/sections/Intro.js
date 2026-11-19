/*03/06/2024*/
'use strict';
const Intro = AbstractForm.extend({
	template: 'login',
	id: 'wrapper_login',
	className: 'wrapper',			
	__render: function() {			
		this.params.version = CONFIG.version;				
	},
	__domReady: function() {				
		this.listenToOnce(Data, 'dataReady', function() {					
			System.navigate('dashboard', 'fade');			
		});		
	}
}); 
