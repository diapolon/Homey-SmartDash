/*02/01/2025*/
function _nl() {
	let obj = _en();
	
	obj.language = 'nl';
	
	obj.time = { days: 'Dagen', day: 'Dag', hours: 'u', minutes: 'm', from: 'vanaf' }; 

	obj.buttons = { ok: 'Ok', yes: 'Ja', no: 'Nee', back: 'Terug', enter: 'Enter', add: 'Toevoegen', remove: 'Verwijderen', css: 'CSS', copy: 'Kopiëren', local: 'Lokaal', remote: 'Cloud', skip: 'Configureer later', save: 'Opslaan', cancel: 'Annuleren', apply: 'Toepassen', exit: 'Verlaten', retry: 'Opnieuw proberen', next: 'Volgende', prev: 'Vorige', send: 'Verzenden', edit: 'Bewerken', show: 'Tonen', hide: 'Verbergen', disabled: 'Uitgeschakeld', enabled: 'Ingeschakeld', import: 'Backup inlezen', export: 'Backup maken', customize: 'Aanpassen', upgrade: 'Controleer voor updates', reboot: 'Homey opnieuw opstarten' }; 
	
	obj.debug = { readings: 'Readings', errors: 'Fouten' };
	
	obj.menu.dashboard = { name: 'Dashboard' };
	obj.menu.section_panels = { name: 'Panelen', edit: 'Bewerken', pin: 'PIN verplicht', settings: 'Instellingen', trigger: 'Homey variable for control panel', autoswitch: 'Panelen automatisch wisselen' };
	obj.menu.section_panel = { name: 'Panel', add: 'Widget / Toevoegen', edit: 'Widget / Wijzigen' };
	obj.menu.section_devices = { name: 'Apparaten' };
	obj.menu.section_settings = { name: 'Instellingen', homey: 'Homey Pro', system: 'Systeem', screensaver: 'Screensaver', backup: 'Backup', pin: 'Toegangscode', panels: 'Panelen', custom: 'Customize theme' };
	obj.menu.section_info = { name: 'Info' };
	obj.menu.disconnect = { name: 'Verbreken' };
	
	obj.htmls.intro = '<p class="center strong p10t p10b">Welkom!</p><p>Deze app stelt je in staat om apparaten van Homey te bedienen.</p><p class="strong">De app is gratis te gebruiken en verzamelt geen enkele vorm van gegevens.</p>';				
	obj.htmls.export = 'Sla alle gegevens van <strong>SmartDash</strong> op in een bestand';
	obj.htmls.import = 'Lees bestand in met alle gegevens van <strong>SmartDash</strong>';
	
	obj.forms.options.none = '-- geen --';
	obj.forms.options.default = '-- standaard --';
	obj.forms.options.choose = '-- kies --';
	obj.forms.options.type = '-- kies type --';
	obj.forms.options.grid = '-- kies grootte --';			
	obj.forms.options.device = '-- apparaten --';					
	obj.forms.options.sync.labels = ['5 sec', '10 sec', '25 sec', '30 sec', '60 sec'];
	obj.forms.options.feedback.labels = ['Uitgeschakeld', 'Geluid', 'Trillen'];	
	obj.forms.options.insight.choose = '-- insight --';		
	obj.forms.options.insight.resolutions.labels = ['LaatsteUur', 'Laatste6Uur', 'Laatste24Uur', 'Laatste7Dagen', 'Laatste14Dagen', 'Laatste31Dagen', 'Laatste2Jaar', 'Vandaag', 'DezeWeek', 'DezeMaand', 'DitJaar', 'Gisteren', 'VorigeWeek', 'VorigeMaand', 'VorigJaar'];	
	obj.forms.options.insight.aggregations.labels = ['-- type --', 'Gemiddeld (%)', 'Gemiddeld (°)', 'Opgeteld (kWh)', 'Abs sum (kWh)'];
	obj.forms.options.refresh.labels = ['Uitgeschakeld', '5 sec', '10 sec', '15 sec', '25 sec', '30 sec', '1 min', '2 min', '5 min', '10 min', '25 min', '30 min', '60 min'];			
	obj.forms.options.mode.labels = ['-- kies --', 'Flow', 'Variabele'];
	obj.forms.options.boolean.labels = ['Nee', 'Ja', 'Toggle'];
	obj.forms.options.panel.theme.labels = ['vierkant', 'vierkant (alt)', 'afgerond', 'afgerond (alt)', 'mushroom like'];
	obj.forms.options.panel.mode.labels = ['standaard', 'verberg bij wisselen'];
	obj.forms.options.screensaver.time.labels = ['1 min', '2 min', '3 min', '5 min', '10 min'];
	obj.forms.options.autoplay.duration.labels = ['5 sec', '10 sec', '15 sec', '25 sec', '30 sec', '1 min', '2 min', '3 min', '4 min', '5 min'];
	
	obj.fields.groups = { info: 'Informatie', config: 'Configuratie', aspect: 'Aspect', devices: 'Apparaats', params: 'Parameters', display: 'Scherm opties', position: 'Verander positie', app: 'App', homey: 'Homey Pro', homey_remote: 'Remote Toegang', homey_new: 'Homey Pro 2023', homey_old: 'Homey Pro 2016/2019', trigger: 'Homey variable for control panel', autoplay: 'Panelen automatisch wisselen', advanced: 'Advanced' };
	obj.fields.login = 'Inloggen';	
	obj.fields.reminder = 'Reminder';
	obj.fields.feedback = 'Knoppen feedback';	
	obj.fields.name = 'Titel';
	obj.fields.hidename = 'Verberg titel';
	obj.fields.hideupdatetime = 'Verberg laatst geüpdated';
	obj.fields.device = 'Apparaat';
	obj.fields.type = 'Type';
	obj.fields.zone = 'Zone';
	obj.fields.icon = 'Icoon';
	obj.fields.mode = 'Modus';
	obj.fields.flow = 'Flow';
	obj.fields.logic = 'Variabele';
	obj.fields.logic_value = 'Waarde';
	obj.fields.url = 'Url';
	obj.fields.font_size = 'Lettertypegrootte';
	obj.fields.capability = 'Capability';
	obj.fields.insight = 'Insight';
	obj.fields.insight_resolution = 'Resolutie';
	obj.fields.insight_type = 'Type';
	obj.fields.insight_color = 'Kleur';
	obj.fields.dimension_portrait = 'Grootte (portrait)';
	obj.fields.dimension_landscape = 'Grootte (landscape)';
	obj.fields.color = 'Achtergrond kleur';
	obj.fields.theme = 'Thema';
	obj.fields.opacity = 'Doorzichtigheid';	
	obj.fields.language = 'Taal';
	obj.fields.debug = 'Debug';
	obj.fields.enabled = 'Zichtbaar';	
	obj.fields.locked = 'Vergrendelen';	
	obj.fields.sync = 'Pollingtijd';
	obj.fields.refresh = 'Verversingstijd';
	obj.fields.address = 'Lokale Url';	
	obj.fields.address_token = 'Url voor bearer token';	
	obj.fields.grid = 'Dashboard rooster';
	obj.fields.params = 'Parameters';
	obj.fields.capabilities = 'Capabilities';	
	obj.fields.moveto = 'Verplaats voor';
	obj.fields.moveto2 = 'Verplaats naar panel';
	obj.fields.updatetime = 'Laatst geüpdated';
	obj.fields.model = 'Model';			
	obj.fields.version = 'Versie';
	obj.fields.upgrade_available = 'Upgrade beschikbaar';
	obj.fields.cloud = 'Cloud';
	obj.fields.connection = 'Verbinding';
	obj.fields.upgrade = 'Upgrade';
	obj.fields.backup = 'Backup gegevens';
	obj.fields.showtime = 'Toon klok';
	obj.fields.status = 'Aan';
	obj.fields.idletime = 'Inactieve tijd';
	obj.fields.idlevalidity = 'Geldigheid';	
	obj.fields.autoplay_duration = 'Duur';
	obj.fields.pin = 'Access code';
	obj.fields.pin_code = 'Code';
	
	obj.labels.solarpanel = { production_daily: 'Vandaag opgewekt', production_total: 'Totaal opgewekt', power: 'Stroom' };
	obj.labels.powerwall = { solar: 'Zon', battery: 'Batterij', home: 'Thuis', grid: 'Netwerk' };	
	obj.labels.cloud = { ok: 'Verbonden', ko: 'Verbroken' };		
	obj.labels.connection = { local: 'Lokaal', cloud: 'Cloud' };		
	obj.labels.humidex = { comfortable: 'Comfortabel', noticeable_discomfort: 'Merkbaar oncomfortabel', evident_discomfort: 'Duidelijk oncomfortabel', great_discomfort: 'Ernstig oncomfortabel', dangerous_discomfort: 'Gevaarlijk', heat_stroke: 'Hitteberoerte mogelijk' };						
	obj.labels.dewpoint = { dry: 'Droog', comfortable: 'Comfortabel', muggy: 'Benauwd', oppressive: 'Drukkend', uncomfortable: 'Oncomfortabel' };			
	
	obj.labels.on = 'Aan';
	obj.labels.off = 'Uit';
	obj.labels.status = 'Status';
	obj.labels.mode = 'Modus';
	obj.labels.now = 'Nu';
					
	obj.messages.nointernet = 'Controleer je data verbinding en probeer opnieuw.';
	obj.messages.devices_loading = 'Laadt apparaten';
	obj.messages.devices_found = 'Apparaten gevonden:';
	
	obj.notify.msg.required = 'Attentie, velden verplicht';
	obj.notify.msg.save_ok = 'Gegevens opgeslagen!';	
	obj.notify.msg.import_ok = 'Gegevens geïmporteerd!';	
	obj.notify.msg.confirm = 'Attentie, weet je zeker dat je door wilt gaan?';
	obj.notify.msg.need_reload = 'Attentie, opnieuw starten van de app noodzakelijk';
	obj.notify.msg.confirm_reboot = 'Wil je Homey opnieuw opstarten?';
	obj.notify.msg.reboot_ok = 'Homey start opnieuw op, een moment geduld';
	obj.notify.msg.no_update = 'App is volledig bijgewerkt';
	obj.notify.msg.confirm_update = 'Update gevonden, weet je zeker dat je door wilt gaan?';
	obj.notify.msg.error = 'Attentie, er heeft zich een fout voorgedaan';	
	obj.notify.msg.copy = 'Wil je de widget kopiëren?';	
	obj.notify.msg.delete = 'Wil je de widget verwijderen?';	
	obj.notify.msg.error_connection = 'Attentie, verbindings probleem, controleer de data-verbinding';	
	obj.notify.msg.error_url = 'Attentie, voeg een geldige url in';	
	obj.notify.msg.app.exit = "Wil je de app beëindigen?";
	obj.notify.msg.ok = "Ok!";	
	
	obj.notify.title.info = 'Info';
	obj.notify.title.send = 'Verzonden';
	obj.notify.title.edit = 'Wijzigen';
	obj.notify.title.alert = 'Waarschuwing';
	obj.notify.title.update = 'Update';
	obj.notify.title.error = 'Error';
	obj.notify.title.close = 'Sluiten';
	
	obj.no_results.widgets = 'Geen widgets gevonden';
	obj.no_results.devices = 'Geen apparaten gevonden';	
	obj.no_results.notifications = 'Geen updates gevonden';
			
	return obj;
}