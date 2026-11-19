# SmartDash for Homey

A customizable dashboard and wall-panel app for **Homey Pro** (Android and iOS),
built with Apache Cordova (Backbone + Handlebars). It connects to Homey over the
local network or the cloud and shows your devices on configurable panels of
widgets.

It works on **Homey Pro (2023)** and, with a workaround, on Homey Pro
2016/2019 (see the [community topic](https://community.homey.app/t/android-ios-pro-dashboard-homey-smartdash-v0-240104-2/83385)).
It uses the Homey Web API and requires an API key.

> **Disclaimer** — This is an independent community project. It is not
> affiliated with, endorsed by or supported by Athom B.V. "Homey" is a
> trademark of Athom B.V.

## Features

- Local and remote (cloud) login, with a Personal Access Token
- 6 customizable panels of widgets: sockets, lights, sensors, presence,
  thermostats, blinds, locks, speakers, cameras, Powerwall, solar panels,
  energy flow, weather, insights, timeline, iframes and more
- Virtual buttons to run flows or change a variable
- Screensaver (blank, clock, weather, iframe) and panel auto-switch
- Show a specific panel by setting a Homey variable
- Backup and restore of the configuration
- Custom CSS for widgets and panels, custom icons
- PIN lock and kiosk options
- Interface in English, Italian, Dutch and French

## Project structure

```
app/          application code (sections, widgets, data, i18n)
framework/    core services (Homey API client, storage, system helpers)
templates/    Handlebars templates (compiled into app/templates.js)
ui/           stylesheets and images
index.html    entry point
```

## Build

1. The third-party libraries and fonts are already included (see
   [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).
2. Compile the templates (requires `npm install -g handlebars`):

   ```sh
   ./compile_template.sh
   ```

3. Create a Cordova project, copy these files into its `www/` folder, add the
   Android platform and the plugins listed in THIRD_PARTY_NOTICES.md, then
   build with `cordova build android`.

## Configuration

On first launch, enter your Homey address (local) or Cloud ID, plus a
**Personal Access Token** created in the Homey web app (Settings → API Keys).
The token is stored only on the device. **Never commit tokens to the
repository.**

The automatic APK update check is **disabled** (`HOMEY.update.url` is empty in
`app/config.js`). To enable it, point it to an HTTPS server you control.

## License

[MIT](LICENSE) © Koghisoft. The bundled third-party components keep their own
licenses — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and
[LICENSES/](LICENSES/).
