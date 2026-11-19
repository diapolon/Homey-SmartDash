/*02/01/2025*/
function _it() {
	let obj = _en();
	
	obj.language = 'it';
	
	obj.time = { days: 'Giorni', day: 'Giorno', hours: 'h', minutes: 'm', from: 'da' }; 

	obj.buttons = { ok: 'Ok', yes: 'Si', no: 'No', back: 'Indietro', enter: 'Accedi', add: 'Aggiungi', remove: 'Rimuovi', css: 'CSS', copy: 'Copia', local: 'Locale', remote:  'Cloud', skip: 'Configura più tardi', save: 'Salva', cancel: 'Annulla', apply: 'Applica', exit: 'Esci', retry: 'Riprova', next: 'Avanti', prev: 'Precedente', send: 'Invia richiesta', edit: 'Modifica', show: 'Mostra', hide: 'Nascondi', disabled: 'Disattivo', enabled: 'Attivo', import: 'Importa', export: 'Crea backup', customize: 'Impostazioni', upgrade: 'Controlla aggiornamento', reboot: 'Riavvia Homey' }; 

	obj.debug = { readings: 'Letture', errors: 'Errori' };

	obj.menu.section_panels = { name: 'Pannelli', edit: 'Modifica', pin: 'Pin Richiesto', settings: 'Impostazioni', trigger: 'Variabile Homey per controllo pannello', autoswitch: 'Scorrimento automatico' };
	obj.menu.section_panel = { name: 'Pannello', add: 'Widget / Nuovo', edit: 'Widget / Modifica' };			
	obj.menu.section_devices = { name: 'Dispositivi' };
	obj.menu.section_settings = { name: 'Impostazioni', homey: 'Homey Pro', system: 'Sistema', screensaver: 'Screensaver', screensaver_slide: 'Slide', backup: 'Backup', pin: 'Codice di accesso', panels: 'Pannelli', custom: 'Customize theme' };
	obj.menu.section_info = { name: 'Info' };
	obj.menu.disconnect = { name: 'Disconnetti' };
	
	obj.htmls.intro = '<p class="center strong p10t p10b">Benvenuto!</p><p>Questa app permette di interagire con i dispositivi collegati a Homey</p><p class="strong">L\'app è gratuita e non raccoglie nessun tipo di dato </p>';				
	obj.htmls.export = 'Salva su file o condividi tutti i dati di <strong>SmartDash</strong>';
	obj.htmls.import = 'Ripristina da file tutti i dati di <strong>SmartDash</strong>';

	obj.forms.options.none = '-- nessuno --';
	obj.forms.options.default = '-- predefinito --';
	obj.forms.options.choose = '-- scegli --';
	obj.forms.options.type = '-- seleziona tipo --';
	obj.forms.options.grid = '-- seleziona dimensioni --';	
	obj.forms.options.device = '-- dispositivo --';	
	obj.forms.options.grids.labels = ['9 colonne'];
	obj.forms.options.feedback.labels = ['Disattivo', 'Suoni', 'Vibrazione'];
	obj.forms.options.refresh.labels = ['Disattivo', '5 sec', '10 sec', '15 sec', '25 sec', '30 sec', '1 min', '2 min', '5 min', '10 min', '25 min', '30 min', '60 min'];
	obj.forms.options.mode.labels = ['-- scegli --', 'Flow', 'Variabile'];
	obj.forms.options.boolean.labels = ['No', 'Si', 'Inverti'];			
	obj.forms.options.insight.choose = '-- grafico --';
	obj.forms.options.insight.resolutions.labels = ['lastHour', 'last6Hours', 'last24Hours', 'last7Days', 'last14Days', 'last31Days', 'last2Years', 'today', 'thisWeek', 'thisMonth', 'thisYear', 'yesterday', 'lastWeek', 'lastMonth', 'lastYear'];
	obj.forms.options.insight.aggregations.labels = ['-- tipo --', 'Media (%)', 'Media (°)', 'Somma (kWh)', 'Somma abs (kWh)'];
	obj.forms.options.panel.theme.labels = ['rettangolare', 'rettangolare (alt)', 'arrotondato', 'arrotondato (alt)', 'mushroom like'];
							
	obj.fields.groups = { info: 'Informazioni', config: 'Configurazione', aspect: 'Aspetto', devices: 'Dispositivi', params: 'Parametri', display: 'Opzioni di visualizzazione', position: 'Cambia posizione', app: 'App', homey: 'Homey Pro', homey_remote: 'Accesso Remoto', homey_new: 'Homey Pro 2023', homey_old: 'Homey Pro 2016/2019', trigger: 'Variabile Homey per controllo pannello', autoplay: 'Scorrimento automatico pannelli', advanced: 'Funzionalità avanzate' };			
	obj.fields.token = 'Chiave API';			
	obj.fields.login = 'Login';	
	obj.fields.reminder = 'Ricordami';						
	obj.fields.name = 'Titolo';
	obj.fields.hidename = 'Nascondi titolo';
	obj.fields.hideupdatetime = 'Nascondi ultimo aggiornamento';
	obj.fields.device = 'Dispositivo';
	obj.fields.type = 'Tipo';
	obj.fields.zone = 'Zona';
	obj.fields.icon = 'Icona';
	obj.fields.mode = 'Modalità';
	obj.fields.logic = 'Variabile';
	obj.fields.logic_value = 'Valore';
	obj.fields.capability = 'Parametro';
	obj.fields.font_size = 'Grandezza caratteri';
	obj.fields.insight = 'Grafico';
	obj.fields.insight_resolution = 'Risoluzione';
	obj.fields.insight_type = 'Tipo';
	obj.fields.insight_color = 'Colore';
	obj.fields.dimension_portrait = 'Formato verticale';
	obj.fields.dimension_landscape = 'Formato orizzontale';
	obj.fields.color = 'Colore sfondo';
	obj.fields.theme = 'Tema';			
	obj.fields.opacity = 'Opacità';
	obj.fields.enabled = 'Visibile';			
	obj.fields.locked = 'Sola lettura';			
	obj.fields.language = 'Lingua';
	obj.fields.feedback = 'Feedback pulsanti';	
	obj.fields.url = 'Indirizzo';
	obj.fields.sync = 'Frequenza di aggiornamento';
	obj.fields.refresh = 'Frequenza di aggiornamento';
	obj.fields.address = 'Indirizzo locale';
	obj.fields.address_token = 'Indirizzo bearer token';
	obj.fields.grid = 'Griglia dashboard';
	obj.fields.params = 'Parametri';
	obj.fields.params_volume_max = 'Volume massimo';	
	obj.fields.moveto = 'Sposta prima di';
	obj.fields.moveto2 = 'Sposta nel pannello';
	obj.fields.updatetime = 'Ultimo aggiornamento';
	obj.fields.model = 'Modello';						
	obj.fields.version = 'Versione';
	obj.fields.upgrade_available = 'Aggiornamento disponibile';
	obj.fields.upgrade = 'Aggiorna';
	obj.fields.connection = 'Connessione';
	obj.fields.showtime = 'Mostra orario';
	obj.fields.status = 'Attivo';
	obj.fields.idletime = 'Tempo di inattività';
	obj.fields.idlevalidity = 'Periodo di validità';				
	obj.fields.autoplay_duration = 'Durata';
	obj.fields.pin = 'Codice di accesso';
	obj.fields.pin_code = 'Codice';
	obj.fields.custom = 'Personalizza CSS';
	obj.fields.custom_css = 'Personalizza CSS';

	obj.labels.solarpanel = { production_daily: 'Produzione giornaliera', production_total: 'Produzione totale', power: 'Potenza' };
	obj.labels.powerwall = { solar: 'Fotovoltaico', battery: 'Batteria', home: 'Casa', grid: 'Rete' };		
	obj.labels.cloud = { ok: 'Connesso', ko: 'Disconnesso' };		
	obj.labels.connection = { local: 'Locale', cloud: 'Cloud' };		
	obj.labels.humidex = { comfortable: 'Confortevole', noticeable_discomfort: 'Disagio', evident_discomfort: 'Disagio significativo', great_discomfort: 'Disagio enorme, evitare affaticamenti', dangerous_discomfort: 'Disagio pericoloso', heat_stroke: 'Probabile colpo di calore' };					
	obj.labels.dewpoint = { dry: 'Secco', comfortable: 'Confortevole', muggy: 'Afoso', oppressive: 'Soffocante', uncomfortable: 'Non confortevole' };
	
	obj.labels.on = 'Acceso';
	obj.labels.off = 'Spento';
	obj.labels.status = 'Stato';
	obj.labels.mode = 'Modalità';
	obj.labels.now = 'Attuale';
	
	obj.messages.nointernet = 'Controlla la tua connessione dati se è attiva e riprova.';
	obj.messages.device_loading = 'Dispositivi caricati';
	obj.messages.devices_found = 'Dispositivi trovati:';
	
	obj.notify.msg.required = 'Attenzione, campi obbligatori';
	obj.notify.msg.save_ok = 'Dati salvati!';	
	obj.notify.msg.import_ok = 'Dati importati!';	
	obj.notify.msg.confirm = 'Attenzione, sei sicuro di voler procedere?';			
	obj.notify.msg.need_reload = 'Attenzione, è necessario riavviare l\'app';			
	obj.notify.msg.confirm_reboot = 'Sei sicuro di voler riavviare Homey?';
	obj.notify.msg.reboot_ok = 'Homey si sta riavviando, attendere prego';
	obj.notify.msg.no_update = 'L\'app installata è l\'ultima versione!';
	obj.notify.msg.confirm_update = 'Aggiornamento trovato, sei sicuro di voler procedere?';
	obj.notify.msg.error = 'Attenzione, è avvenuto un errore';	
	obj.notify.msg.copy = 'Sei sicuro di voler copiare il widget?';	
	obj.notify.msg.delete = 'Sei sicuro di voler rimuovere il widget?';	
	obj.notify.msg.error_connection = 'Attenzione: errore nella connessione, verifica i dati';			
	obj.notify.msg.error_url = 'Attenzione, l\'url non è valido';	
	obj.notify.msg.app.exit = "Sei sicuro di voler uscire dall'app?";
	obj.notify.msg.ok = "Operazione effettuata!";	

	obj.notify.title.info = 'Info';
	obj.notify.title.send = 'Invio';
	obj.notify.title.edit = 'Modifica';
	obj.notify.title.alert = 'Attenzione';
	obj.notify.title.update = 'Aggiornamento';
	obj.notify.title.error = 'Avviso';
	obj.notify.title.close = 'Chiudi';

	obj.no_results.widgets = 'Non sono presenti Widgets';
	obj.no_results.devices = 'Non sono presenti dispositivi';			
	obj.no_results.notifications = 'Non sono presenti aggiornamenti';	
	
	obj.widgets.Dummy = 'Questo Widget crea uno spazio vuoto.<br />Utile per realizzare layout sorprendenti';

	return obj;
}