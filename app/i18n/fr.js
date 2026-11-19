/*02/01/2025*/
function _fr() {
	let obj = _en();

	obj.language = 'fr';
	
	obj.time = { days: 'Jours', day: 'Jour', hours: 'h', minutes: 'm', from: 'de' }; 

	obj.buttons = { ok: 'Ok', yes: 'Oui', no: 'Non', back: 'Retour', enter: 'Entrer', add: 'Ajouter', remove: 'Retirer', css: 'CSS', copy: 'Copier', local: 'Localement', remote: 'Cloud', skip: 'Configurer plus tard', save: 'Sauvegarder', cancel: 'Annuler', apply: 'Appliquer', exit: 'Quitter', retry: 'Réessayer', next: 'Suivant', prev: 'Précédent', send: 'Envoyer', edit: 'Editer', show: 'Montrer', hide: 'Cacher', disabled: 'Désactiver', enabled: 'Activer', import: 'Télécharger un backup', export: 'Créer un backup', customize: 'Paramètres', upgrade: 'Vérifier les mises à jour', reboot: 'Redémarrer Homey' }; 

	obj.debug = { readings: 'Relevés', errors: 'Erreurs' };			

	obj.menu.section_panels = { name: 'Panneaux', edit: 'Editer', pin: 'Code d\'accès requis', settings: 'Paramètres', trigger: 'Homey variable for control panel', autoswitch: 'Panneaux défilement automatique' };
	obj.menu.section_panel = { name: 'Pannel', add: 'Widget / Ajouter', edit: 'Widget / Editer' };
	obj.menu.section_devices = { name: 'Appareils' };
	obj.menu.section_settings = { name: 'Paramètres', homey: 'Homey Pro', system: 'Système', screensaver: 'Économiseur d\’écran', screensaver_slide: 'Slide', backup: 'Backup', pin: 'Code d\'accès', panels: 'Panneaux', custom: 'Customize theme' };
	obj.menu.section_info = { name: 'Informations' };
	obj.menu.disconnect = { name: 'Déconnecté' };
	
	obj.htmls.intro = '<p class="center strong p10t p10b">Bienvenue!.</p><p>Cette application vous permet de contrôler les appareils connectés à Homey.</p><p class="strong">L\'application est gratuite et ne collecte aucune donnée</p>';				
	obj.htmls.export = 'Exporter toutes les données de <strong>SmartDash</strong>';
	obj.htmls.import = 'Restaurer toutes les données de <strong>SmartDash</strong> à partir d\'un fichier';
	
	obj.forms.options.none = '-- aucun --';
	obj.forms.options.default = '-- défaut --';
	obj.forms.options.choose = '-- sélectionner --';
	obj.forms.options.type = '-- sélectionner type --';
	obj.forms.options.grid = '-- sélectionner taille --';	
	obj.forms.options.device = '-- appareil --';	
	//obj.forms.options.grids.labels = ['Large', 'Normale', 'Compacte', 'Square'];
	obj.forms.options.sync.labels = ['5 secs', '10 secs', '25 secs', '30 secs', '60 secs'];
	obj.forms.options.feedback.labels = ['Désactiver', 'Son', 'Vibration'];			
	obj.forms.options.insight.choose = '-- insight --';
	obj.forms.options.insight.resolutions.labels = ['denière heure', '6 dernières heures', '24 dernières heures', '7 derniers jours', '14 derniers jours', '31 derniers jours', '2 dernières années', 'aujourd\'hui', 'cette semaine', 'ce mois', 'cette année', 'hier', 'la semaine dernière', 'le mois dernier', 'l\'année dernière'];	
	obj.forms.options.insight.aggregations.labels = ['-- type --', 'moyenne (%)', 'moyenne (°)', 'somme (kWh)', 'somme absolue (kWh)'];			
	obj.forms.options.refresh.labels = ['Désactivé', '5 sec', '10 sec', '15 sec', '25 sec', '30 sec', '1 min', '2 min', '5 min', '10 min', '25 min', '30 min', '60 min'];
	obj.forms.options.mode.labels = ['-- sélectionner --', 'Flow', 'Variable'];
	obj.forms.options.boolean.labels = ['Non', 'Oui', 'Toggle'];
	obj.forms.options.panel.theme.labels = ['carré', 'carré (alt)', 'arrondi', 'arrondi (alt)', 'mushroom like'];
	obj.forms.options.panel.mode.labels = ['Par défaut', 'Cacher du défilement automatique'];
	obj.forms.options.screensaver.time.labels = ['1 min', '2 mins', '3 mins', '5 mins', '10 mins'];
	obj.forms.options.autoplay.duration.labels = ['5 secs', '10 secs', '15 secs', '25 secs', '30 secs', '1 min', '2 mins', '3 mins', '4 mins', '5 mins'];
	
	obj.fields.groups = { info: 'Information', config: 'Configuration', aspect: 'Aspect', devices: 'Appareils', params: 'Paramètres', display: 'Option d\'affichage', position: 'Changer la position', app: 'Application', homey: 'Homey Pro', homey_remote: 'Accès à distance', homey_new: 'Homey Pro 2023', homey_old: 'Homey Pro 2016/2019', trigger: 'Homey variable for control panel', autoplay: 'Panneaux défilement automatique', advanced: 'Advanced' };			
	obj.fields.token = 'Clée API';
	obj.fields.cloud_id = 'CloudID';
	obj.fields.login = 'Identifiant';	
	obj.fields.reminder = 'Rappel';
	obj.fields.feedback = 'Retour tactile';	
	obj.fields.name = 'Titre';
	obj.fields.hidename = 'Cacher le titre';
	obj.fields.hideupdatetime = 'Cacher dernière mise à jour';
	obj.fields.device = 'Appareil';
	obj.fields.type = 'Type';
	obj.fields.zone = 'Zone';
	obj.fields.icon = 'Icône';
	obj.fields.mode = 'Mode';
	obj.fields.flow = 'Flow';
	obj.fields.logic = 'Variable';
	obj.fields.logic_value = 'Valeur';
	obj.fields.url = 'URL';
	obj.fields.font_size = 'Taille de la police';
	obj.fields.capability = 'Capacité';
	obj.fields.insight = 'Insight';
	obj.fields.insight_resolution = 'Resolution';
	obj.fields.insight_type = 'Type';
	obj.fields.insight_color = 'Couleur';
	obj.fields.dimension_portrait = 'Taille (portrait)';
	obj.fields.dimension_landscape = 'Taille (paysage)';
	obj.fields.color = 'Couleur de fond d\'écran';
	obj.fields.theme = 'Thème';
	obj.fields.opacity = 'Opacité';	
	obj.fields.language = 'Langue';
	obj.fields.debug = 'Debug';
	obj.fields.enabled = 'Visible';	
	obj.fields.locked = 'Verrouillé';	
	obj.fields.sync = 'Délai de synchronisation';
	obj.fields.refresh = 'Heure de rafraichissement';
	obj.fields.address = 'URL locale';	
	obj.fields.address_token = 'URL du token Bearer';	
	obj.fields.grid = 'Grille du dashboard';
	obj.fields.params = 'Paramètres';
	obj.fields.capabilities = 'Capacités';	
	obj.fields.moveto = 'Déplacer avant';
	obj.fields.updatetime = 'Dernière mise à jour';
	obj.fields.model = 'Modèle';			
	obj.fields.version = 'Version';
	obj.fields.upgrade_available = 'Mise à jour disponible';
	obj.fields.cloud = 'Cloud';
	obj.fields.connection = 'Connexion';
	obj.fields.upgrade = 'Mise à jour';
	obj.fields.backup = 'Backup des données';
	obj.fields.showtime = 'Afficher l\’horloge';
	obj.fields.status = 'Activer';
	obj.fields.idletime = 'Temps d\’inactivité';
	obj.fields.idlevalidity = 'Validité';	
	obj.fields.autoplay_duration = 'Durée';
	obj.fields.pin = 'Code d\'accès';
	obj.fields.pin_code = 'Code';
				
	obj.labels.solarpanel = { production_daily: 'Production journalière', production_total: 'Production totale', power: 'Puissance' };
	obj.labels.powerwall = { solar: 'Solaire', battery: 'Batterie', home: 'Accueil', grid: 'Grille' };	
	obj.labels.cloud = { ok: 'Connecté', ko: 'Déconnecté' };		
	obj.labels.connection = { local: 'Localement', cloud: 'Cloud' };		
	obj.labels.humidex = { comfortable: 'Confortable', noticeable_discomfort: 'Inconfort perceptible', evident_discomfort: 'Inconfort évident', great_discomfort: 'Grand inconfort', dangerous_discomfort: 'Inconfort dangereux', heat_stroke: 'Coup de chaleur possible' };						
	obj.labels.dewpoint = { dry: 'Sec', comfortable: 'Comfortable', muggy: 'Moite', oppressive: 'Oppressant', uncomfortable: 'Inconfortable' };			
	
	obj.labels.on = 'On';
	obj.labels.off = 'Off';
	obj.labels.status = 'Statut';
	obj.labels.mode = 'Mode';
	obj.labels.now = 'Maintenant';
					
	obj.messages.nointernet = 'Veuillez contrôler votre connexion et réessayez.';
	obj.messages.devices_loading = 'Chargement des appareils';
	obj.messages.devices_found = 'Appareils trouvés:';
	
	obj.notify.msg.required = 'Attention, champs obligatoires';
	obj.notify.msg.save_ok = 'Données sauvegardées!';	
	obj.notify.msg.import_ok = 'Données importées!';	
	obj.notify.msg.confirm = 'Attention, êtes-vous sûr de vouloir continuer?';
	obj.notify.msg.need_reload = 'Attention, un redémarrage de l\'application est nécessaire';
	obj.notify.msg.confirm_reboot = 'Voulez-vous redémarrer Homey?';
	obj.notify.msg.reboot_ok = 'Homey redémarre, veuillez patienter';
	obj.notify.msg.no_update = 'L\’application est à jour';
	obj.notify.msg.confirm_update = 'Mise à jour trouvée, êtes-vous sûr de vouloir continuer?';
	obj.notify.msg.error = 'Attention, une erreur s’est produite';	
	obj.notify.msg.copy = 'Voulez-vous copier le widget?';	
	obj.notify.msg.delete = 'Voulez-vous supprimer le widget?';	
	obj.notify.msg.error_connection = 'Attention : erreur de connexion, vérifiez vos données';	
	obj.notify.msg.error_url = 'Attention, insérez une URL valide';	
	obj.notify.msg.app.exit = "Voulez-vous quitter l’application?";
	obj.notify.msg.ok = "Ok!";	
	
	obj.notify.title.info = 'Information';
	obj.notify.title.send = 'Envoyer';
	obj.notify.title.edit = 'Editer';
	obj.notify.title.alert = 'Alerter';
	obj.notify.title.update = 'Mettre à jour';
	obj.notify.title.error = 'Erreur';
	obj.notify.title.close = 'Fermer';
	
	obj.no_results.widgets = 'Aucun widget trouvé';
	obj.no_results.devices = 'Aucun appareil trouvé';	
	obj.no_results.notifications = 'Aucune mise à jour trouvée';
			
	return obj;
}