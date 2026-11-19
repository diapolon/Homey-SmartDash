/*19/01/2024*/
'use strict';
const Login = AbstractForm.extend({
	template: 'login',
	id: 'wrapper_login',
	className: 'wrapper',			
	__render: function() {			
		this.params.version = CONFIG.version;				
	},
	__domReady: function() {		
		if (!CONFIG.ios) {	
			let self = this;		
			this.main = document.getElementById('main');	
			window.addEventListener('keyboardDidShow', function(e) { 
				//self.main.style.top = '-'+ e.keyboardHeight +'px'; 
			});
			window.addEventListener('keyboardDidHide', function(e) { 
				self.main.style.top = 0; 
			});
		}	
	}
}); 
