// PWA functionality for Sexy Jenga

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);

                // Check for updates on page load
                registration.update();

                // Handle service worker updates
                if (registration.waiting) {
                    updateReady(registration.waiting);
                }

                // When a new service worker is found
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            updateReady(newWorker);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('ServiceWorker registration failed: ', error);
            });

        // Listen for controller change
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    });
}

// Handle service worker updates
function updateReady(worker) {
    // Create a modal to notify the user of an update
    if (confirm('New version available! Reload to update?')) {
        worker.postMessage({ action: 'skipWaiting' });
    }
}

// Handle PWA installation (Add to Home Screen)
let deferredPrompt;
const installButton = document.createElement('button');
installButton.classList.add('install-button');
installButton.textContent = 'Install App';
installButton.style.display = 'none';

// Create and append the install button to the container
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').appendChild(installButton);

    // Style the install button
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.padding = '10px 15px';
    installButton.style.backgroundColor = '#ff3399';
    installButton.style.color = 'white';
    installButton.style.border = 'none';
    installButton.style.borderRadius = '25px';
    installButton.style.fontFamily = 'Roboto, sans-serif';
    installButton.style.boxShadow = '0 4px 15px rgba(255, 51, 153, 0.4)';
    installButton.style.cursor = 'pointer';
    installButton.style.zIndex = '999';
    installButton.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Hover effects
    installButton.addEventListener('mouseover', () => {
        installButton.style.backgroundColor = '#ff66b3';
        installButton.style.boxShadow = '0 6px 20px rgba(255, 51, 153, 0.6)';
        installButton.style.transform = 'translateY(-2px)';
    });

    installButton.addEventListener('mouseout', () => {
        installButton.style.backgroundColor = '#ff3399';
        installButton.style.boxShadow = '0 4px 15px rgba(255, 51, 153, 0.4)';
        installButton.style.transform = 'translateY(0)';
    });
});

// Detect if the app can be installed
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    installButton.style.display = 'block';
});

// Install app button click handler
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Hide the install button regardless of outcome
    installButton.style.display = 'none';

    // We no longer need the prompt
    deferredPrompt = null;
});

// Listen for successful installation
window.addEventListener('appinstalled', () => {
    // Hide the install button
    installButton.style.display = 'none';
    // Clear the deferredPrompt
    deferredPrompt = null;
    // Log or perform other actions
    console.log('PWA was installed');
}); 