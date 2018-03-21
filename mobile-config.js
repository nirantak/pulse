// This section sets up some basic app metadata, the entire section is optional.
App.info({
	id: "com.nirantak.pulse",
	name: "Pulse",
	description: "Pulse Chat Platform",
	author: "Nirantak Raghav",
	email: "contact@nirantak.com",
	website: "https://nirantak.com"
});

// Set up resources such as icons and launch screens.
App.icons({
	iphone_3x: "public/apple-touch-icon.png",
	app_store: "public/android-chrome-512x512.png",
	android_hdpi: "public/mstile-70x70.png",
	android_xxhdpi: "public/mstile-144x144.png",
	android_xxxhdpi: "public/android-chrome-192x192.png"
});

App.launchScreens({
	iphone6p_portrait: "public/android-chrome-512x512.png",
	android_hdpi_portrait: "public/android-chrome-512x512.png"
});

// Set PhoneGap/Cordova preferences.
App.setPreference("BackgroundColor", "0xff0000ff");
App.setPreference("HideKeyboardFormAccessoryBar", true);
App.setPreference("Orientation", "default");
App.setPreference("Orientation", "all", "ios");

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
App.appendToConfig(`
  <universal-links>
    <host name="pulse.nirantak.com" />
  </universal-links>
`);
