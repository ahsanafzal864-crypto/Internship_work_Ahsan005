let currentStep = 1;
const totalSteps = 4;
const STORAGE_KEY = 'internee_multistep_form_data';

const form = document.getElementById('multi-step-form');
const progressFill = document.getElementById('progress-fill');
const stepCircles = document.querySelectorAll('.step-circle');
const successScreen = document.getElementById('success-screen');
const resetBtn = document.getElementById('reset-form-btn');
const summaryContent = document.getElementById('summary-content');

// Load saved data and set up autosave on input changes
window.addEventListener('DOMContentLoaded', () => {
    loadSavedData();

    // Autosave on any form field change
    form.addEventListener('input', saveDataToStorage);
    form.addEventListener('change', saveDataToStorage);
});

// Navigate Forward
function nextStep(step) {
    if (validateStep(step)) {
        currentStep = step + 1;
        if (currentStep === 4) {
            renderSummary();
        }
        updateStepUI();
        saveDataToStorage();
    }
}

// Navigate Backward
function prevStep(step) {
    currentStep = step - 1;
    updateStepUI();
    saveDataToStorage();
}

// Validate Fields for the current step
function validateStep(step) {
    const activeStepElement = document.getElementById(`step-${step}`);
    const inputs = activeStepElement.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        const parent = input.closest('.input-group');
        const val = input.value.trim();

        if (!val) {
            parent.classList.add('invalid');
            isValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            parent.classList.add('invalid');
            isValid = false;
        } else if (input.type === 'url' && !val.startsWith('http')) {
            parent.classList.add('invalid');
            isValid = false;
        } else {
            parent.classList.remove('invalid');
        }
    });

    return isValid;
}

// Update Active Views and Progress Bar
function updateStepUI() {
    // Switch Active Step with Transition
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Update Progress Indicator Circles
    stepCircles.forEach((circle, index) => {
        const stepNum = index + 1;
        circle.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            circle.classList.add('active');
        } else if (stepNum < currentStep) {
            circle.classList.add('completed');
        }
    });

    // Update Progress Track Bar
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;
}

// Generate Summary List on Step 4
function renderSummary() {
    const data = getFormData();
    summaryContent.innerHTML = `
        <div class="summary-item"><span class="summary-label">Full Name</span><span class="summary-val">${data.fullName || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">Email</span><span class="summary-val">${data.email || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">Phone</span><span class="summary-val">${data.phone || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">Education</span><span class="summary-val">${data.education || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">Track</span><span class="summary-val">${data.domain || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">GitHub</span><span class="summary-val">${data.github || '-'}</span></div>
        <div class="summary-item"><span class="summary-label">Experience</span><span class="summary-val">${data.experience || '-'}</span></div>
    `;
}

// Helper: Extract Form Object
function getFormData() {
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

// Autosave to LocalStorage
function saveDataToStorage() {
    const data = getFormData();
    data._savedStep = currentStep;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load Autosaved Data on Page Load
function loadSavedData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            if (key !== '_savedStep') {
                const el = form.elements[key];
                if (el) el.value = data[key];
            }
        });

        if (data._savedStep && data._savedStep <= totalSteps) {
            currentStep = data._savedStep;
            if (currentStep === 4) renderSummary();
            updateStepUI();
        }
    } catch (e) {
        console.error('Error loading saved form data:', e);
    }
}

// Final Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEY);
    form.classList.add('hidden');
    document.querySelector('.progress-bar-container').classList.add('hidden');
    successScreen.classList.remove('hidden');
});

// Reset Form
resetBtn.addEventListener('click', () => {
    form.reset();
    currentStep = 1;
    form.classList.remove('hidden');
    document.querySelector('.progress-bar-container').classList.remove('hidden');
    successScreen.classList.add('hidden');
    updateStepUI();
});