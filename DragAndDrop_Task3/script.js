const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');

const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const fileNameDisplay = document.getElementById('file-name');

const previewContainer = document.getElementById('preview-container');
const previewImg = document.getElementById('preview-img');
const removeBtn = document.getElementById('remove-btn');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const STORAGE_KEY = 'internee_saved_image';

// Check for persisted image from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedImageData = localStorage.getItem(STORAGE_KEY);
    if (savedImageData) {
        displayPreview(savedImageData);
    }
});

// Click handlers for browsing files
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        validateAndProcessFile(e.target.files[0]);
    }
});

// Drag and Drop Event Listeners
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-active');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-active');
    });
});

dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        validateAndProcessFile(files[0]);
    }
});

// Validate file type
function validateAndProcessFile(file) {
    hideError();

    if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Invalid file type! Only JPG, PNG, and GIF images are permitted.');
        return;
    }

    startUploadSimulation(file);
}

// Simulate upload progress with setTimeout
function startUploadSimulation(file) {
    fileNameDisplay.textContent = file.name;
    progressContainer.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';

    let progress = 0;
    const interval = 60; // ms per step

    function step() {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;

        if (progress < 100) {
            setTimeout(step, interval);
        } else {
            // Upload complete: read file data for preview & persistence
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                readFileAndDisplay(file);
            }, 300);
        }
    }

    setTimeout(step, interval);
}

// Read file using FileReader and save to localStorage
function readFileAndDisplay(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Data = e.target.result;
        try {
            localStorage.setItem(STORAGE_KEY, base64Data);
        } catch (err) {
            console.warn('Storage limit exceeded, skipping localStorage persistence.');
        }
        displayPreview(base64Data);
    };
    reader.readAsDataURL(file);
}

function displayPreview(dataUrl) {
    previewImg.src = dataUrl;
    previewContainer.classList.remove('hidden');
}

// Remove image & clear localStorage
removeBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    previewContainer.classList.add('hidden');
    previewImg.src = '';
    fileInput.value = '';
});

function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.remove('hidden');
    progressContainer.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}