# Sexy Jenga - Progressive Web App

A fun and spicy companion app for your Jenga game nights! This app lets you create custom challenges that randomly appear when it's your turn.

## Features

- 🎮 **Custom Challenges**: Add your own spicy challenges to the game
- 📱 **Mobile Friendly**: Responsive design works great on all devices
- 🔄 **Random Selection**: Draws challenges randomly from your list
- 💾 **Persistent Storage**: Your challenges are saved even if you close the browser
- 🔌 **Works Offline**: Complete functionality without an internet connection
- 📲 **Installable**: Can be installed as an app on your device
- 🔗 **Challenge Sharing**: Share your lists with friends via links or import theirs

## PWA Capabilities

This app is a full Progressive Web App (PWA) that:

- Works offline through service worker caching
- Can be installed on your device home screen
- Has a custom app icon and splash screen
- Syncs data when you're back online
- Preserves your challenges between sessions
- Supports sharing and importing challenge lists

## How to Use

### Creating Challenges

1. Enter your challenge in the input field
2. Click "Add" or press Enter to add it to your list
3. Add as many challenges as you'd like
4. Click "Draw a Card" to randomly select a challenge
5. Use "Start Over" to reset the selection display

### Sharing Challenges

1. Create your list of challenges
2. Click the "Share List" button
3. On mobile, you can share directly to other apps
4. On desktop, copy the generated link to share with friends
5. Recipients can click the link to import your challenges

### Importing Challenges

1. Click the "Import List" button
2. Paste a shared challenge link or data
3. Click "Import" to add the challenges to your game
4. Choose to replace your current list or add to it

## How to Install on Your Device

### On Android:

1. Open the app in Chrome
2. Tap the menu button (three dots in the upper right)
3. Select "Add to Home screen"
4. Follow the prompts to install

### On iOS:

1. Open the app in Safari
2. Tap the Share button
3. Scroll and select "Add to Home Screen"
4. Tap "Add" in the upper right to confirm

### On Desktop:

1. Open the app in Chrome, Edge, or other compatible browser
2. Look for the install icon in the address bar, or:
3. Click the menu button and select "Install Sexy Jenga"

## Development

### Files and Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling for the app
- `script.js` - Core game functionality
- `pwa.js` - PWA-specific functionality
- `service-worker.js` - Offline caching and PWA behavior
- `manifest.json` - PWA installation configuration
- `logo.svg` - Vector logo
- `icons/` - App icons in various sizes

### Icon Generation

To generate the required icons from the SVG logo, use:

```bash
# If Inkscape is installed:
./generate-icons.sh

# Otherwise, use an online converter to create the following icons:
# icon-72x72.png, icon-96x96.png, icon-128x128.png, icon-144x144.png,
# icon-152x152.png, icon-192x192.png, icon-384x384.png, icon-512x512.png
```

## How It Works

### Challenge Sharing

Challenges are shared through URL parameters:

1. The app encodes your challenge list using Base64 encoding
2. It creates a shareable URL with the encoded data as a parameter
3. When someone opens the URL, the app detects and decodes the parameter
4. The recipient is prompted to import the challenges

This approach allows sharing without requiring a server or database, keeping all data local to the user's device.

## License

MIT License - Feel free to modify and use for your game nights!

## Privacy

All data is stored locally on your device. The app doesn't collect or transmit any information. 