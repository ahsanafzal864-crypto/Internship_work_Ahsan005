// 1. Mobile Navigation Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// 2. Interactive Highlights Slider / Carousel Component
const track = document.getElementById('slider-track');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const dotsContainer = document.getElementById('slider-dots');

let currentSlide = 0;

// Render pagination dots
slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
});

// 3. Dynamic Content Loading for Portfolio Cards (With Direct Vercel Links)
const projects = [
    {
        title: "Weather Dashboard",
        desc: "Live OpenWeather API integration with dynamic weather background gradients and geolocation.",
        tag: "API & Asynchronous JS",
        icon: "fa-cloud-sun",
        link: "https://internship-work-ahsan005.vercel.app"
    },
    {
        title: "Drag & Drop Uploader",
        desc: "Interactive drop zone with simulated progress bar, file validations, and localStorage persistence.",
        tag: "HTML5 File API",
        icon: "fa-upload",
        link: "https://internship-work-ahsan005-5lv7.vercel.app/"
    },
    {
        title: "Multi-Step Form",
        desc: "Step-by-step wizard with animated progress indicators, live validation, and autosave state.",
        tag: "Form Architecture",
        icon: "fa-list-check",
        link: "https://internship-work-ahsan005-iqbb.vercel.app/"
    },
    {
        title: "Real-Time Chat App",
        desc: "Interactive messaging interface with simulated chatbot responses, typing state, and timestamps.",
        tag: "DOM & LocalStorage",
        icon: "fa-comments",
        link: "https://internship-work-ahsan005-n8ro.vercel.app/"
    }
];

const projectsGrid = document.getElementById('projects-grid');

function renderProjects() {
    projectsGrid.innerHTML = projects.map(proj => `
        <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="project-card">
            <div>
                <div class="card-top">
                    <i class="fa-solid ${proj.icon} card-icon"></i>
                    <i class="fa-solid fa-arrow-up-right-from-square external-icon"></i>
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
            </div>
            <span class="tag">${proj.tag}</span>
        </a>
    `).join('');
}

renderProjects();

// 4. Contact Form Real-Time Client Validation
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Full Name validation
    if (!nameInput.value.trim()) {
        showError(nameInput);
        isValid = false;
    } else {
        clearError(nameInput);
    }

    // Email address validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        showError(emailInput);
        isValid = false;
    } else {
        clearError(emailInput);
    }

    // Message validation (min 10 characters)
    if (messageInput.value.trim().length < 10) {
        showError(messageInput);
        isValid = false;
    } else {
        clearError(messageInput);
    }

    if (isValid) {
        formFeedback.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => formFeedback.classList.add('hidden'), 4000);
    }
});

function showError(input) {
    input.closest('.form-group').classList.add('invalid');
}

function clearError(input) {
    input.closest('.form-group').classList.remove('invalid');
}