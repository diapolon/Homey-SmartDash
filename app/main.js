/*25/03/2024*/
'use strict';
let deviceready = 'deviceready';
if (CONFIG.emulated) {
	deviceready = 'DOMContentLoaded';
	alert('Emulation');	
}
document.addEventListener(deviceready, System.on_deviceready, false);	
