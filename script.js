document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const outputElement = document.getElementById('output');
    const selectButton = document.getElementById('selectBtn');
    const resetButton = document.getElementById('resetBtn');
    const newOptionInput = document.getElementById('newOption');
    const addButton = document.getElementById('addBtn');
    const optionsList = document.getElementById('optionsList');
    const shareButton = document.getElementById('shareBtn');
    const importButton = document.getElementById('importBtn');

    // Options list - stored in local storage to persist across refreshes
    let options = getOptionsFromLocalStorage();

    // Initialize options list display
    updateOptionsList();

    // Add some visual flair when selecting
    let animationInProgress = false;

    // Select button event listener
    selectButton.addEventListener('click', () => {
        if (animationInProgress) return;

        if (options.length === 0) {
            outputElement.textContent = 'Please add options to the list first';
            return;
        }

        animationInProgress = true;

        // Visual selecting effect
        let counter = 0;
        const maxCount = 15 + Math.floor(Math.random() * 10); // Random number of flickers
        const randomOptions = [...options]; // Copy the array to shuffle

        // Shuffle the array
        for (let i = randomOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomOptions[i], randomOptions[j]] = [randomOptions[j], randomOptions[i]];
        }

        // Flash through options for visual effect
        const interval = setInterval(() => {
            if (counter < maxCount) {
                const randomOption = randomOptions[counter % randomOptions.length];
                outputElement.textContent = randomOption;
                counter++;

                // Speed up towards the end
                if (counter > maxCount * 0.7) {
                    clearInterval(interval);
                    setTimeout(finalSelection, 60);
                }
            } else {
                clearInterval(interval);
                finalSelection();
            }
        }, 100);

        function finalSelection() {
            // Select random option from options
            const randomIndex = Math.floor(Math.random() * options.length);
            const selectedOption = options[randomIndex];

            // Update output with final selection
            outputElement.textContent = selectedOption;
            animationInProgress = false;

            // Add highlight effect to the final selection
            outputElement.classList.add('highlight');
            setTimeout(() => {
                outputElement.classList.remove('highlight');
            }, 800);
        }
    });

    // Reset button event listener - now just resets the display
    resetButton.addEventListener('click', () => {
        outputElement.textContent = 'Ready to select';
    });

    // Add option button event listener
    addButton.addEventListener('click', () => {
        addNewOption();
    });

    // Add option on Enter key
    newOptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewOption();
        }
    });

    // Function to add a new option
    function addNewOption() {
        const newOption = newOptionInput.value.trim();

        if (newOption && !options.includes(newOption)) {
            options.push(newOption);
            saveOptionsToLocalStorage();
            updateOptionsList();
            newOptionInput.value = '';

            // Focus back on input for quick addition of multiple options
            newOptionInput.focus();
        } else if (options.includes(newOption)) {
            alert('This option is already in the list!');
        }
    }

    // Share button event listener
    shareButton.addEventListener('click', () => {
        if (options.length === 0) {
            alert('Please add some challenges to share!');
            return;
        }

        shareOptions();
    });

    // Import button event listener
    importButton.addEventListener('click', () => {
        showImportModal();
    });

    // Function to share options
    function shareOptions() {
        // Create share data
        const shareData = {
            title: 'Sexy Jenga Challenges',
            text: 'Check out these Sexy Jenga challenges I created!',
            url: createShareUrl(),
        };

        // Check if Web Share API is available
        if (navigator.share && !isDesktop()) {
            navigator.share(shareData)
                .then(() => console.log('Share successful'))
                .catch((error) => {
                    console.log('Share failed:', error);
                    showShareFallback();
                });
        } else {
            // Fallback for desktop or browsers without Web Share API
            showShareFallback();
        }
    }

    // Check if the user is on desktop
    function isDesktop() {
        return window.innerWidth >= 1024 && !('ontouchstart' in window);
    }

    // Create a URL with encoded challenges
    function createShareUrl() {
        // Create a JSON string of the options
        const optionsJson = JSON.stringify(options);

        // Base64 encode the JSON string to make it URL-friendly
        const encodedOptions = btoa(encodeURIComponent(optionsJson));

        // Create a URL with the encoded data
        const url = new URL(window.location.href);
        url.searchParams.set('challenges', encodedOptions);

        return url.href;
    }

    // Show fallback share modal
    function showShareFallback() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.classList.add('share-modal');

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.classList.add('share-modal-content');

        // Modal header
        const header = document.createElement('h2');
        header.textContent = 'Share Your Challenges';

        // Share link
        const shareLink = document.createElement('input');
        shareLink.type = 'text';
        shareLink.value = createShareUrl();
        shareLink.readOnly = true;

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy Link';
        copyBtn.addEventListener('click', () => {
            shareLink.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Link';
            }, 2000);
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(shareLink);
        modalContent.appendChild(copyBtn);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);

        // Add to document
        document.body.appendChild(modal);

        // Select the link text for easy copying
        shareLink.select();
    }

    // Show the import modal
    function showImportModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.classList.add('share-modal');

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.classList.add('share-modal-content');

        // Modal header
        const header = document.createElement('h2');
        header.textContent = 'Import Challenges';

        // Import options
        const importTextarea = document.createElement('textarea');
        importTextarea.placeholder = 'Paste shared link or challenge data here...';

        // Import button
        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import';
        importBtn.addEventListener('click', () => {
            const importValue = importTextarea.value.trim();

            if (importValue) {
                try {
                    // Try to extract challenges parameter from URL first
                    let challengesData;
                    try {
                        const url = new URL(importValue);
                        challengesData = url.searchParams.get('challenges');
                    } catch (e) {
                        // If not a URL, treat the entire input as challenges data
                        challengesData = importValue;
                    }

                    if (challengesData) {
                        // Decode the challenges
                        const decodedOptions = decodeURIComponent(atob(challengesData));
                        const importedOptions = JSON.parse(decodedOptions);

                        if (Array.isArray(importedOptions) && importedOptions.length > 0) {
                            if (options.length > 0) {
                                if (confirm('Do you want to replace your current challenges or add to them?\nClick OK to replace, Cancel to add.')) {
                                    options = [...importedOptions];
                                } else {
                                    // Add new challenges (avoiding duplicates)
                                    importedOptions.forEach(option => {
                                        if (!options.includes(option)) {
                                            options.push(option);
                                        }
                                    });
                                }
                            } else {
                                options = [...importedOptions];
                            }

                            saveOptionsToLocalStorage();
                            updateOptionsList();
                            document.body.removeChild(modal);

                            // Show success message
                            outputElement.textContent = `Successfully imported ${importedOptions.length} challenges!`;
                            outputElement.classList.add('highlight');
                            setTimeout(() => {
                                outputElement.classList.remove('highlight');
                            }, 800);
                        } else {
                            throw new Error('Invalid challenges data');
                        }
                    } else {
                        throw new Error('No challenges found in the provided data');
                    }
                } catch (error) {
                    alert('Could not import challenges. Please make sure you\'ve entered a valid shared link or data.');
                    console.error('Import error:', error);
                }
            }
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cancel';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(importTextarea);
        modalContent.appendChild(importBtn);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);

        // Add to document
        document.body.appendChild(modal);
    }

    // Check for shared challenges in URL when page loads
    function checkForSharedChallenges() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedChallenges = urlParams.get('challenges');

        if (sharedChallenges) {
            try {
                // Decode the challenges
                const decodedOptions = decodeURIComponent(atob(sharedChallenges));
                const importedOptions = JSON.parse(decodedOptions);

                if (Array.isArray(importedOptions) && importedOptions.length > 0) {
                    // Ask user if they want to use the shared challenges
                    if (confirm(`Someone shared ${importedOptions.length} challenges with you. Would you like to import them?`)) {
                        if (options.length > 0) {
                            if (confirm('Do you want to replace your current challenges or add to them?\nClick OK to replace, Cancel to add.')) {
                                options = [...importedOptions];
                            } else {
                                // Add new challenges (avoiding duplicates)
                                importedOptions.forEach(option => {
                                    if (!options.includes(option)) {
                                        options.push(option);
                                    }
                                });
                            }
                        } else {
                            options = [...importedOptions];
                        }

                        saveOptionsToLocalStorage();
                        updateOptionsList();

                        // Show success message
                        outputElement.textContent = `Successfully imported ${importedOptions.length} challenges!`;
                        outputElement.classList.add('highlight');
                        setTimeout(() => {
                            outputElement.classList.remove('highlight');
                        }, 800);

                        // Remove the challenges parameter from the URL to prevent reimporting on refresh
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        // User declined, remove the challenges parameter from the URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }
            } catch (error) {
                console.error('Error processing shared challenges:', error);
                // Remove the invalid challenges parameter from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }

    // Check for shared challenges when the page loads
    checkForSharedChallenges();

    // Function to update the options list display
    function updateOptionsList() {
        optionsList.innerHTML = '';

        if (options.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'No options added yet';
            emptyItem.style.fontStyle = 'italic';
            emptyItem.style.color = '#888';
            optionsList.appendChild(emptyItem);
            return;
        }

        options.forEach((option, index) => {
            const li = document.createElement('li');

            // Option text
            const optionText = document.createElement('span');
            optionText.textContent = option;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-option');
            deleteBtn.addEventListener('click', () => {
                options.splice(index, 1);
                saveOptionsToLocalStorage();
                updateOptionsList();
            });

            li.appendChild(optionText);
            li.appendChild(deleteBtn);
            optionsList.appendChild(li);
        });
    }

    // Local storage functions for options
    function saveOptionsToLocalStorage() {
        localStorage.setItem('randomSelectorOptions', JSON.stringify(options));
    }

    function getOptionsFromLocalStorage() {
        try {
            const savedOptions = localStorage.getItem('randomSelectorOptions');
            return savedOptions ? JSON.parse(savedOptions) : [];
        } catch (e) {
            console.error('Error parsing options from local storage:', e);
            return [];
        }
    }
}); 