/*28/06/2024*/
'use strict';
const WidgetComfortSensor = {
	dashboard: AbstractWidget.dashboard.extend({
		className: 'widget comfortsensor',
		template: 'widget_comfortsensor',
		___render: function() {		
			if (this.model.get('data')['measure_temperature'] != undefined && this.model.get('data')['measure_humidity'] != undefined) {
				this._absoluteHumidity();
				this._dewPoint();
				this._humidex();			
				this._perception();			
			}
		},
		_format: function() {	
			const dim = (CONFIG.screen == 'landscape' ?  this.model.get('widget').dimension.l : this.model.get('widget').dimension.p);			
			let format = 'large';
			switch(dim) {
				case '1x1':
				case '2x1':
				case '3x1':
				case '4x1':
				case '5x1':
				case '6x1':
				case '2x2':
					format = 'small';
					break;
				case '3x2':
				case '4x2':
				case '5x2':
				case '6x2':
					format = 'medium';
					break;
			}	
			this.model.set('format', format);							
		},
		_absoluteHumidity: function() {						
			const A = 6.112; // Water vapor pressure constant (hPa)
			const B = 17.67; // Temperature-related constant
			const C = 243.5; // Temperature-related constant (°C)
			const R = 216.7; // Gas constant for dry air (J/(kg·K))
		
			const t = this.model.get('data')['measure_temperature'].value;
			const h = this.model.get('data')['measure_humidity'].value;
			// Calculate water vapor pressure (hPa)
			const waterVaporPressure = A * Math.exp((B * t) / (t + C));						
			const saturationVaporDensity = R * (waterVaporPressure / (t + 273.15));						
			const absoluteHumidity = (h * saturationVaporDensity) / 100;									
			this.model.set('absolute_humidity', { value: parseFloat(absoluteHumidity.toFixed(2)), units: 'g/m3' });							
		},
		_dewPoint: function() {        
			const t = this.model.get('data')['measure_temperature'].value;
			const h = this.model.get('data')['measure_humidity'].value;
			
			const A = 17.625; 
			const B = 243.04; 
  
			// convert temp to Celsius
			//temp = (temp - 32) * (5/9);

			const dew_n = B * (Math.log(h / 100.0) + ((A * t)/(t + B)));   //Math.log(rh/100*6.112/6.1078*Math.exp((17.67*temp)/(temp-0+243.5)));
			const dew_d = A - Math.log(h / 100.0) - ((A * t)/(t + B));	  		
			// convert dew to F
			//dew = (dew * (9/5)) + 32;
			// round dew			
			this.model.set('dew_point', { value: parseFloat((dew_n / dew_d).toFixed(1)), units: '&deg;' });							
		},
		_humidex: function() {        
			const t = this.model.get('data')['measure_temperature'].value;
        	const dew_point = this.model.get('dew_point').value;        	
        	const e = 6.11 * Math.exp(5417.7530 * ((1 / 273.16) - (1 / (dew_point + 273.15))));
        	const h = (0.5555) * (e - 10);        	
        	
        	this.model.set('humidex', { value: parseFloat((t + h).toFixed(1)), units: '&deg;' });							
		},
		_perception: function() {        
			const t = this.model.get('data')['measure_temperature'].value;
			const h = this.model.get('data')['measure_humidity'].value;			
			const dew_point = this.model.get('dew_point').value;        	
			const humidex = this.model.get('humidex').value;        	
        	
        	let comfort = -1;
        	
        	//humidex perception
			if (humidex >= 30) comfort = 3;
        	
        	//summer scharlaux index
        	if (comfort == -1) {
				if (t < 17 || t > 39 || h < 30) {
					comfort = -1;
	        	} else {
	        		const tc = -17.089 * Math.log(h) + 94.979;
	        		const ise = tc - t;
		        	if (ise < 0) comfort = 2;	        		
		        	else comfort = 1;	        	
	        	}	
            }
            
            //winter scharlaux index
            if (comfort == -1) {
				if (t < -5 || t > 6 || h < 40) {
					comfort = -1;
	        	} else {
	        		const tc = (0.0003 * h) + (0.1497 * h) - 7.7133;
	        		const ish = t - tc;
		        	if (ish < 0) comfort = 2;		        		
		        	else comfort = 1;
		        }
			}
			
			//dew point perception
			/*if (comfort == -1) {
	        	if (dew_point <= 55) comfort = 1;
	        	else if (dew_point < 65) comfort = 3;
	        	else comfort = 4;
	        }*/
	        
        	//thoms discomfort perception
			if (comfort == -1) {
				const tw = (t * Math.atan(0.151977 * Math.pow(h + 8.313659, 1 / 2)) + Math.atan(t + h) - Math.atan(h - 1.676331) + Math.pow(0.00391838 * h, 3 / 2) * Math.atan(0.023101 * h) - 4.686035);
	        	const tdi = 0.5 * tw + 0.5 * t;
	        	if (tdi >= 29) comfort = 4;
		        //else comfort = 1;
			}

			//generic
	        if (comfort == -1) {
	        	if (t >= 22 && t <= 27 && h >= 40 && h <= 60) comfort = 1;        		
        	}
        				
			let perception = { value: '', icon: 'help-circle', color: 'color_red' };
        	switch (comfort) {
        		case 0:
        			perception = { value: LANG.labels.dewpoint.dry, icon: 'emoticon-confused', color: 'color_orange' };
        			break;
        		case 1:
        			perception = { value: LANG.labels.dewpoint.comfortable, icon: 'emoticon-happy', color: 'color_green' };
        			break;
        		case 2:
        			perception = { value: LANG.labels.dewpoint.uncomfortable, icon: 'emoticon-confused', color: 'color_orange' };
        			break;
        		case 3:
        			perception = { value: LANG.labels.dewpoint.muggy, icon: 'emoticon-confused', color: 'color_blue' };
        			break;
        		case 4:
        			perception = { value: LANG.labels.dewpoint.oppressive, icon: 'emoticon-sad', color: 'color_red' };
        			break;
        	}
			/*const vp = 6.112 * Math.pow(10, 7.5 * t / (237.7 + t))
        	const e = h * vp / 100;
        	const rsi = ((t - 21) / (58 - e)).toFixed(2);

        if self._temperature < 26 or self._temperature > 35:
            perception = RelativeStrainPerception.OUTSIDE_CALCULABLE_RANGE
        elif rsi >= 0.45:
            perception = RelativeStrainPerception.EXTREME_DISCOMFORT
        elif rsi >= 0.35:
            perception = RelativeStrainPerception.SIGNIFICANT_DISCOMFORT
        elif rsi >= 0.25:
            perception = RelativeStrainPerception.DISCOMFORT
        elif rsi >= 0.15:
            perception = RelativeStrainPerception.SLIGHT_DISCOMFORT
        else:
            perception = RelativeStrainPerception.COMFORTABLE
*/
			
			/*let perception = '';
			let icon = '';
			let color = '';
        	if (dew_point < 10) {
        		perception = LANG.labels.dewpoint.dry;        		
        		icon = 'emoticon-confused';
        		color = ' color_orange';
        	} else if (dew_point < 16) {
        		perception = LANG.labels.dewpoint.comfortable;
        		icon = 'emoticon-happy';
        		color = 'color_green';
        	} else if (dew_point < 21) {
        		perception = LANG.labels.dewpoint.muggy;        		
        		icon = 'emoticon-confused';
        		color = 'color_blue';
        	} else {
        		perception = LANG.labels.dewpoint.oppressive;        		
        		icon = 'emoticon-sad';
        		color = 'color_black';
        	}*/
    
        	this.model.set('perception', perception);							
		}
	}),
	edit: AbstractWidget.edit,
	save: AbstractWidget.save			
}