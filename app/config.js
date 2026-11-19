/*05/03/2025*/
var APP;
var LANG = {};

var HOMEY = {};
HOMEY.status = { msg: 'OK', errors: 0 };
HOMEY.data = { lastUpdated: 0, zones: {}, devices: {}, flows: {}, logics: {}, insights: {} };
// Aggiornamento automatico APK DISATTIVATO: il dominio originale non è più
// attivo e scaricare/installare APK da un dominio non controllato è un rischio.
// Per riattivarlo, indicare qui un URL HTTPS sotto il proprio controllo.
HOMEY.update = { url: '', version: 'smartdash_update.json' };

var CONFIG = {};
CONFIG.state_history = [];
CONFIG.emulated = (typeof(PhoneGap) != 'undefined');
CONFIG.uuid;
CONFIG.model;
CONFIG.ios = false;
CONFIG.screen = 'portrait';
CONFIG.font_size = 14;
CONFIG.notifications = false;
CONFIG.widget = { device: '', name: '', type: '', icon: '', enabled: 1, theme: 'default', font: { size: 0 }, hidename: 0, hideupdatetime: 0, mode: 0, url: '', params: {}, capability: '', capabilities: [], flow: '', logic: { variable: '', value: '' }, image: { id: '', owner: '', mode: 'latest', fit: 'contain' }, insight: { resolution: '', value: '', type: '', color: 'blue' }, dimension: { p: '2x2', l: '2x2' }, bg: '', color: 'white', textcolor: 'black', opacity: 0, locked: 0, refresh: 0, css: '' };
CONFIG.local = true;
CONFIG.version = '0.250305.1';
CONFIG.cloud = { fallback: false, server_1: 'connect.athom.com', server_2: 'homey.athom-prod-euwest1-001.homeypro.net' };

var DATABASE = {};
DATABASE.settings = { lang: '', toolbar: '1', grid: '1', server: '', cloud_id: '', token: '', server_token: '', sync: 60, feedback: 0, access_mode: 0, fontsize: 0, debug: 0, unsecure: 0, keepawake: 0, custom: 0, version: '0' };
DATABASE.autoplay = { enabled: 0, duration: 5, logic: '', timeout: 0 };
DATABASE.pin = { enabled: 0, code: '00000' };
DATABASE.panels = {};
DATABASE.panels[0] = { name: 'Main', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-1-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.panels[1] = { name: '2', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-2-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.panels[2] = { name: '3', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-3-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.panels[3] = { name: '4', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-4-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.panels[4] = { name: '5', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-5-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.panels[5] = { name: '6', enabled: 1, mode: 1, bg: 'black', theme: '', icon: 'numeric-6-box-multiple-outline', showtime: 1, css: '', widgets: [] };
DATABASE.screensaver = { enabled: 0, time: 5, from: 0, to: 23, opacity: 0, brightness: -1, css: '', slides: {} };
DATABASE.screensaver.slides[0] = { enabled: 1, type: 'clock', device: '', data: { url: '', refresh: 0 } };
DATABASE.screensaver.slides[1] = { enabled: 0, type: 'clock', device: '', data: { url: '', refresh: 0 } };
DATABASE.screensaver.slides[2] = { enabled: 0, type: 'clock', device: '', data: { url: '', refresh: 0 } };
DATABASE.screensaver.slides[3] = { enabled: 0, type: 'clock', device: '', data: { url: '', refresh: 0 } };
DATABASE.screensaver.slides[4] = { enabled: 0, type: 'clock', device: '', data: { url: '', refresh: 0 } };
DATABASE.screensaver.slides[5] = { enabled: 0, type: 'clock', device: '', data: { url: '', refresh: 0 } };