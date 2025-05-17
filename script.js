document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btnIniciar');
    const btnDownload = document.getElementById('btnDownload');
    const btnAtualizar = document.getElementById('btnAtualizar');
    const errorMessageDiv = document.getElementById('errorMessage');
    const downloadLinkError = document.getElementById('downloadLinkError');
    const orientationMessageDiv = document.getElementById('orientationMessage');

    const SERVER_IP = 'samp.capitalroleplay.com.br'; // Placeholder IP, replace with actual
    const SERVER_PORT = '7777'; // Standard SA-MP port
    const SAMP_URL = `samp://${SERVER_IP}:${SERVER_PORT}`;

    // Replace with actual download/update links
    const DOWNLOAD_CLIENT_URL = 'https://www.example.com/download/samp-client'; 
    const UPDATE_LAUNCHER_URL = 'https://www.example.com/download/launcher-update';

    btnDownload.addEventListener('click', () => {
        window.location.href = DOWNLOAD_CLIENT_URL;
    });
    
    downloadLinkError.href = DOWNLOAD_CLIENT_URL; // Set the link in the error message

    btnAtualizar.addEventListener('click', () => {
        window.location.href = UPDATE_LAUNCHER_URL;
    });

    btnIniciar.addEventListener('click', () => {
        errorMessageDiv.style.display = 'none'; // Hide previous error
        
        // Try to open SA-MP URL
        window.location.href = SAMP_URL;

        // Heuristic to detect if SA-MP app is not installed or failed to open
        // If after a short delay, the page is still visible, it might mean the protocol handler failed.
        // This is not foolproof but a common workaround.
        const visibilityCheckTimeout = setTimeout(() => {
            if (!document.hidden) { // document.hidden checks if the tab is active
                errorMessageDiv.style.display = 'block';
            }
        }, 2500); // 2.5 seconds timeout

        // If the page loses focus (e.g., app opened), clear the timeout
        const onBlurHandler = () => {
            clearTimeout(visibilityCheckTimeout);
            window.removeEventListener('blur', onBlurHandler);
            window.removeEventListener('visibilitychange', onVisibilityChangeHandler);
        };
        const onVisibilityChangeHandler = () => {
            if (document.hidden) {
                clearTimeout(visibilityCheckTimeout);
                window.removeEventListener('blur', onBlurHandler);
                window.removeEventListener('visibilitychange', onVisibilityChangeHandler);
            }
        };

        window.addEventListener('blur', onBlurHandler);
        window.addEventListener('visibilitychange', onVisibilityChangeHandler);
    });

    // Attempt to lock screen to landscape
    function lockLandscape() {
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
            screen.orientation.lock('landscape').catch(err => {
                console.warn("Não foi possível bloquear a orientação: ", err);
                // Show message if locking failed and current orientation is not landscape
                if (!window.matchMedia("(orientation: landscape)").matches) {
                   showOrientationMessage();
                }
            });
        } else if (typeof window.screen.mozLockOrientation === 'function') { // Firefox
            window.screen.mozLockOrientation('landscape');
        } else if (typeof window.screen.msLockOrientation === 'function') { // IE/Edge
            window.screen.msLockOrientation('landscape');
        } else {
            // Fallback for browsers that don't support lock
            if (!window.matchMedia("(orientation: landscape)").matches) {
                showOrientationMessage();
            }
        }
    }
    
    function showOrientationMessage() {
        orientationMessageDiv.style.display = 'block';
    }

    function checkAndPromptOrientation() {
        if (!window.matchMedia("(orientation: landscape)").matches) {
            showOrientationMessage();
        } else {
            orientationMessageDiv.style.display = 'none';
        }
    }

    // Initial attempt to lock and check orientation
    lockLandscape();
    checkAndPromptOrientation();


    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
        lockLandscape(); // Re-attempt lock on change
        checkAndPromptOrientation();
    });
    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            // Sometimes lock is released by user interaction, re-check.
            if (!window.matchMedia("(orientation: landscape)").matches) {
                showOrientationMessage();
            } else {
                 orientationMessageDiv.style.display = 'none';
            }
        });
    }
    
    // Ensure the launcher is always trying to be landscape, provide feedback if not
    // This is more of a persistent check for user experience.
    // The CSS is designed for landscape, so this primarily handles the message.
    setInterval(checkAndPromptOrientation, 3000); // Check periodically
});

