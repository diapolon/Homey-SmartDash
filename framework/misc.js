/*16/05/2024*/

function ImgError(source) {
	source.src = 'ui/images/placeholder.png';
	//source.onerror = '';
	//source.classList.add('error');
	return true;
}

function getDate(date) {
	let fmt = 'mmm d yyyy';
	if (LANG.language != 'en') fmt = 'd mmm yyyy';
	return date.format(fmt);
}

function formatDateEn(d) {
	return d.getFullYear() + '-' + pad(d.getMonth() + 1) +'-'+ pad(d.getDate()) +' '+ pad(d.getHours()) +':'+ pad(d.getMinutes()) +':'+ pad(d.getSeconds());
}

function pad(n) { return n < 10 ? '0'+ n : n }

function ucfirst(s) { return s && s[0].toUpperCase() + s.slice(1); }

function days_between(date1, date2) {
	return Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

function sort_object(obj) {
	return Object.values(obj).sort((a, b) => {
            if (a.name === b.name) return 0;
            if (a.name < b.name) return -1;
            return 1;
        });			 
}

function getTime(timestamp, invalidReturn) {
	let d = new Date(timestamp);
	if (timestamp === 0 || isNaN(d.getTime())) return invalidReturn;

	let cd = new Date();

	let db = days_between(cd, d);
	let fmt;
	if (cd.getDate() == d.getDate()) fmt = 'HH:MM'; // this day
	else if (db  < 2 && ((cd < d) ^ (cd.getDay() == d.getDay() + 1))) fmt = 'B, HH:MM'; // yesterday
	else if (db  < 7 && ((cd < d) ^ (cd.getDay() >= d.getDay()))) fmt = 'ddd, HH:MM'; // this week
	else if (cd.getFullYear() == d.getFullYear()) fmt = 'd mmm, HH:MM'; // this year
	else fmt = 'd/m/yy, HH:MM'; // one upon a time

	return d.format(fmt);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function isWeatherDevice(data) {	
	return (data['forecast_temperature'] != undefined || data['weathercondition'] != undefined || data['conditioncode'] != undefined || data['weather_description'] != undefined || data['current_weather_message'] != undefined);
}
		
function isValidJson(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

function getWeatherDevice(device_data) {
	const icons = { 1: 'sunny', 2: 'cloudy', 3: 'lightning', 4: 'partly-rainy', 5: 'rainy', 6: 'snowy', 7: 'dust', 8: 'partly-cloudy', 9: 'fog' };
	const icons_open_weather = { 200: 3, 201: 3, 202: 3, 210: 3, 211: 3, 212: 3, 221: 3, 230: 3, 231: 3, 232: 3, 300: 4, 301: 4, 302: 4, 310: 4, 311: 4, 312: 4, 313: 4, 314: 4, 321: 4, 500: 5, 501: 5, 502: 5, 503: 5, 504: 5, 511: 6, 520: 4, 521: 4, 522: 4, 531: 4, 600: 6, 601: 6, 602: 6, 611: 6, 612: 6, 613: 6, 615: 6, 616: 6, 620: 6, 621: 6, 622: 6, 701: 7, 711: 7, 721: 7, 731: 7, 741: 7, 751: 7, 761: 7, 762: 7, 771: 7, 781: 7, 800: 1, 801: 8, 802: 8, 803: 2, 804: 2 };
	const icons_open_meteo = { 0: 1, 1: 1, 2: 8, 3: 2, 45: 9, 48: 9, 51: 4, 53: 4, 55: 4, 56: 4, 57: 4, 61: 5, 63: 5, 65: 5, 66: 5, 67: 5, 71: 6, 73: 6, 75: 6, 77: 6, 80: 5, 81: 5, 82: 5, 85: 6, 86: 6, 95: 3, 96: 3, 99: 3 };
	let data = { icon: '-', condition: '-', temperature: '-', temperature_minmax: '', temperature_feelslike: '-', wind: '-', humidity: '-' };	
	if (device_data['measure_temperature'] != undefined) data.temperature = device_data.measure_temperature.value;
	if (device_data['measure_temperature_feelslike'] != undefined) data.temperature_feelslike = device_data.measure_temperature_feelslike.value;
	if (device_data['measure_temperature_feels_like'] != undefined) data.temperature_feelslike = device_data.measure_temperature_feels_like.value;
	if (device_data['measure_temperature_min'] != undefined && device_data['measure_temperature_max'] != undefined) data.temperature_minmax = device_data.measure_temperature_min.value +'&deg; / '+ device_data.measure_temperature_max.value +'&deg;';
	if (device_data['measure_humidity'] != undefined) data.humidity = device_data.measure_humidity.value;
	if (device_data['measure_wind_strength'] != undefined) data.wind = device_data.measure_wind_strength.value +' '+ device_data.measure_wind_strength.units;
	if (device_data['weathercondition'] != undefined && device_data['measure_weathercode'] != undefined) {						
		//open meteo
		data.icon = 'weather-'+ icons[icons_open_meteo[device_data.measure_weathercode.value]];
		data.condition = device_data.weathercondition.value;								
	} else if (device_data['conditioncode'] != undefined && device_data['conditioncode_detail'] != undefined) {						
		//Y.r weather forecast & OpenWeather
		data.icon = 'weather-'+ icons[icons_open_weather[device_data.conditioncode_detail.value]];															
		if (device_data['measure_temperature_day'] != undefined) data.temperature = device_data.measure_temperature_day.value;
		data.condition = device_data.description.value;								
	} else if (device_data['forecast_temperature'] != undefined) 	{
		//weather underground								
		data.temperature = device_data.forecast_temperature.value;
		if (device_data['forecast_temperature_feelslike'] != undefined) data.temperature_feelslike = device_data.forecast_temperature_feelslike.value;
		if (device_data['forecast_humidity'] != undefined) data.humidity = device_data.forecast_humidity.value;
		if (device_data['forecast_gust_strength'] != undefined) data.wind = device_data.forecast_gust_strength.value +' '+ device_data.forecast_gust_strength.units;
		if (device_data['forecast_temperature_min'] != undefined && device_data['forecast_temperature_max'] != undefined) data.temperature_minmax = device_data.forecast_temperature_min.value +'&deg; / '+ device_data.forecast_temperature_max.value +'&deg;';
		data.condition = device_data.forecast_summary.value;									
	} else if (device_data['weather_description'] != undefined) 	{
		//yr now
		if (device_data['measure_wind_strength1'] != undefined) data.wind = device_data.measure_wind_strength1.value +' '+ device_data.measure_wind_strength1.units;						
		if (device_data['measure_temperature_min_next_6_hours'] != undefined && device_data['measure_temperature_max_next_6_hours'] != undefined) data.temperature_minmax = device_data.measure_temperature_min_next_6_hours.value +'&deg; / '+ device_data.measure_temperature_max_next_6_hours.value +'&deg;';
		data.condition = device_data.weather_description.value;									
	} else if (device_data['current_weather_title'] != undefined) 	{
		//knmi
		data.temperature = device_data.current_temp.value;
		data.temperature_feelslike = device_data.feel_temp.value;
		data.humidity = device_data.humidity.value;
		if (device_data['expected_today_min_temp'] != undefined && device_data['expected_today_max_temp'] != undefined) data.temperature_minmax = device_data.expected_today_min_temp.value +'&deg; / '+ device_data.expected_today_max_temp.value +'&deg;';
		if (device_data['wind_speed_k_m_h'] != undefined) data.wind = device_data.wind_speed_k_m_h.value +' Kmh';
		data.condition = device_data.current_weather_title.value;									
	}
	return data;
}