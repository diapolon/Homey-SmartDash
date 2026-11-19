/*06/02/2025*/
'use strict';
const Cover = AbstractView.extend({
	template: 'cover',
	id: 'wrapper_cover',
	className: 'wrapper',			
	_domReady: function() {													
		const callback_success = function(database) {
			DATABASE = { ...DATABASE,  ...database };		
			System.language_init();	
			System.screen_init();			 
			Database.upgrade_check();
			window.setTimeout(function() {		
				System.homey_init();						 					
				if (DATABASE.settings.server == '' || DATABASE.settings.token == '') System.navigate('login', 'fade');					
				else System.navigate('intro', 'fade');
			}, 300);		
		};
		const callback_error = function(e) { 
			System.notify_alert(JSON.stringify(e)); 
			System.navigate('login', 'fade');					
		};
		Database.load(callback_success, callback_error);				
	}
}); 
