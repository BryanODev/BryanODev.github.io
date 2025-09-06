// ========================
// COOKIE / LANGUAGE HANDLING
// ========================
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
  console.log("Cookie Set: ", name + "=" + value);
}

function getCookie(name) {
  const nameWithEqual = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameWithEqual) === 0) {
      console.log("Cookie Found: ", c.substring(nameWithEqual.length));
      return c.substring(nameWithEqual.length);
    }
  }
  console.log("Cookie Not Found");
  return "";
}

// ========================
// HEADER FETCH + MENU TOGGLE
// ========================
fetch("/Sections/header")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header-container").innerHTML = data;

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("open");

        menuToggle.innerHTML = menuToggle.classList.contains("open")
          ? "<i class='bx bx-x'></i>"
          : "<i class='bx bx-menu'></i>";
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          navMenu.classList.remove("active");
          menuToggle.innerHTML = "<i class='bx bx-menu'></i>";
          menuToggle.classList.remove("open");
        }
      });
    }
  });

// ========================
// SOCIAL BAR FETCH + LANGUAGE BUTTONS
// ========================
fetch("/Sections/socialbar")
  .then(response => response.text())
  .then(data => {
    document.getElementById("social-bar-container").innerHTML = data;

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const selectedLang = e.target.getAttribute('data-lang');
        console.log('Language Selected:', selectedLang);

        setCookie('language', selectedLang, 365);

        loadTranslations(selectedLang);
        loadTranslations(selectedLang, 'header');
        loadTranslations(selectedLang, 'footer');

        updateSocialBarButtons(selectedLang);
        document.getElementById('language-modal').style.display = 'none';
      });
    });
  });

function updateSocialBarButtons(selectedLang) {
  const socialBarLangButtons = document.querySelectorAll('#social-bar .lang-btn');
  socialBarLangButtons.forEach(button => {
    if (button.getAttribute('data-lang') === selectedLang) {
      button.disabled = true;
      button.style.opacity = '0.5';
    } else {
      button.disabled = false;
      button.style.opacity = '1';
    }
  });
}

// ========================
// TRANSLATION LOADER
// ========================
function loadTranslations(language = 'en', section = '') {
  let translationFilePath = './trans.json'; // default

  if (section === 'header') translationFilePath = '/Sections/header/trans.json';
  else if (section === 'footer') translationFilePath = '/Sections/footer/trans.json';

  fetch(translationFilePath)
    .then(response => response.json())
    .then(translations => {
      document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
          element.textContent = translations[language][key];
        }
      });
    })
    .catch(error => console.error(`Error loading translations for ${section || 'page'}:`, error));
}

// ========================
// DOM CONTENT LOADED INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = getCookie('language');

  loadTranslations(savedLang);
  loadTranslations(savedLang, 'header');
  loadTranslations(savedLang, 'footer');

  updateSocialBarButtons(savedLang);

  const languageModal = document.getElementById('language-modal');
  if (languageModal && savedLang !== '') {
    console.log("We found a cookie");
    languageModal.style.display = 'none';
  }
});

// ========================
// FOOTER FETCH
// ========================
fetch("/Sections/footer")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer-container").innerHTML = data;

    const savedLang = getCookie('language') || 'en';
    loadTranslations(savedLang, 'footer');
  });

// ========================
// LAZY LOADING IMAGES (OPTIONAL)
// ========================
window.addEventListener('scroll', () => {
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(image => {
    if (image.getBoundingClientRect().top <= window.innerHeight && !image.src) {
      image.src = image.getAttribute('data-src');
    }
  });
});

// ========================
// SCROLL RESTORATION
// ========================
window.history.scrollRestoration = 'auto';

document.addEventListener("DOMContentLoaded", () => {
    const icon = document.getElementById("icon");

    if (!icon) {
        console.log("Icon not found!");
        return;
    }

    icon.addEventListener("click", () => {
        console.log("Icon clicked!"); // debug

        // Remove class if already there to restart animation
        icon.classList.remove("animate-spin");
        void icon.offsetWidth; // force reflow
        icon.classList.add("animate-spin");
    });
});

const icon = document.getElementById('icon');

// Disable right-click on the image
icon.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Right-click disabled on icon');
});