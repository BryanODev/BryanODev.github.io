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

// ===== STAR BURST ON ICON CLICK =====
var stars = 15;
var starSize = 80;
var starDistance = 200;
var starSpeed = 1.25;
var colors = ["#e84545", "#f9cb40", "#2d9cdb", "#48cc61"];

function buildStars() {
  for (let i = 0; i < stars; i++) {
    var id = 'gStar' + i;
    var sz = Math.floor((Math.random() * (starSize)) + (starSize / 3));
    var createStar = {
      id: id,
      class: "gStar",
      html: '<i class="fa fa-star"></i>',
      css: {
        position: 'absolute',
        zIndex: 510,
        fontSize: sz + 'px',
        opacity: 0
      }
    };
    $("body").append($("<div>", createStar));
  }
}

function fireStars(e) {
  e.preventDefault();

  const icon = $(e.currentTarget)[0];

  // Get the icon's center relative to the document, works on mobile & desktop
  const rect = icon.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const iconCenterX = rect.left + scrollLeft + rect.width / 2;
  const iconCenterY = rect.top + scrollTop + rect.height / 2;

  const colors = ["#e84545", "#f9cb40", "#2d9cdb", "#48cc61"];

  for (let i = 0; i < stars; i++) {
    const sz = parseFloat($("#gStar" + i).css("font-size"));
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * starDistance;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const tl = gsap.timeline();
    tl.set('#gStar' + i, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.35,
      left: iconCenterX - sz / 2,
      top: iconCenterY - sz / 2,
      color: colors[i % colors.length]
    })
    .to('#gStar' + i, 0.35, { autoAlpha: 0.7 })
    .to('#gStar' + i, 0.6, {
      x: x,
      y: y - 50,
      rotation: 280,
      scale: 1,
      ease: "power1.out"
    }, '<')
    .to('#gStar' + i, 0.35, {
      autoAlpha: 0,
      y: "+=50",
      force3D: true
    }, ">-.25");
  }
}




// Build stars once
buildStars();

// Trigger when clicking your floating icon
$("#icon").click(fireStars);
