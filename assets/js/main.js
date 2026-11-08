/* ==========================================================================
   Portfolio interactions — Ken Mark S. Labog
   1. Helpers            4. Progress / back-to-top
   2. Mobile navigation  5. Contact form (mailto compose)
   3. Current year       6. Gallery, scroll spy, reveals, print
   ========================================================================== */
(function () {
  "use strict";

  var CONTACT_EMAIL = "kenmarklabog@gmail.com";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  /* 2. MOBILE NAVIGATION
     ---------------------------------------------------------------------- */
  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    var desktopQuery = window.matchMedia("(min-width: 1101px)");

    function isOpen() {
      return menu.classList.contains("is-open");
    }

    function openMenu() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    function closeMenu(focusToggle) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    // Close after choosing a navigation link
    menu.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) closeMenu(false);
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        closeMenu(true);
      }
    });

    // Clicking outside the header closes the menu
    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (!event.target.closest(".site-header")) {
        closeMenu(false);
      }
    });

    // Reset menu state when resizing to desktop so focus/visibility stay sane
    function onViewportChange(event) {
      if (event.matches) closeMenu(false);
    }

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", onViewportChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(onViewportChange);
    }
  }

  /* 3. CURRENT YEAR
     ---------------------------------------------------------------------- */
  function initCurrentYear() {
    var yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* 4. SCROLL PROGRESS BAR (decorative)
     ---------------------------------------------------------------------- */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var progress = max > 0 ? window.scrollY / max : 0;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      bar.style.transform = "scaleX(" + progress + ")";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* 4b. BACK-TO-TOP BUTTON
     ---------------------------------------------------------------------- */
  function initBackToTop() {
    var button = document.getElementById("back-to-top");
    if (!button) return;

    var visibleAt = 400;

    function updateVisibility() {
      if (window.scrollY > visibleAt) {
        button.hidden = false;
      } else {
        button.hidden = true;
      }
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateVisibility();
          ticking = false;
        });
      },
      { passive: true }
    );

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });

    updateVisibility();
  }

  /* 5. CONTACT FORM — validate, then compose a mailto: email
     ---------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.querySelector(".contact-form");
    if (!form) return;

    var fields = {
      name: form.querySelector("#contact-name"),
      email: form.querySelector("#contact-email"),
      subject: form.querySelector("#contact-subject"),
      message: form.querySelector("#contact-message")
    };

    function errorElementFor(input) {
      return document.getElementById(input.id + "-error");
    }

    function setError(input, message) {
      var errorEl = errorElementFor(input);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = message;
      } else {
        input.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateEmail(value) {
      // Practical check: something@something.tld (no RFC-exhaustive regex)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(input) {
      var value = input.value.trim();

      if (input === fields.email) {
        if (!value) {
          setError(input, "Please enter your email address.");
          return false;
        }
        if (!validateEmail(value)) {
          setError(input, "Please enter a valid email address.");
          return false;
        }
      } else if (!value) {
        setError(input, "Please fill out this field.");
        return false;
      }

      setError(input, "");
      return true;
    }

    Object.keys(fields).forEach(function (key) {
      var input = fields[key];
      if (!input) return;
      // Re-validate on blur once the user has left a field
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "" || input.hasAttribute("aria-invalid")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var allValid = true;
      var firstInvalid = null;

      Object.keys(fields).forEach(function (key) {
        var input = fields[key];
        if (!input) return;
        if (!validateField(input)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      var subject = fields.subject.value.trim();
      var message = fields.message.value.trim();

      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;

      var mailtoUrl =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      // Opens the visitor's email app with the message prefilled.
      // The message is NOT sent automatically.
      window.location.href = mailtoUrl;

      var status = document.getElementById("form-status");
      if (status) {
        status.textContent =
          "Your email app should now open with the message prefilled. " +
          "Please press Send there to finish. If nothing opens, email me directly at " +
          CONTACT_EMAIL + ".";
      }
    });
  }

  /* 6. CERTIFICATE GALLERY MODAL
     ---------------------------------------------------------------------- */
  function initCertificateGallery() {
    var modal = document.getElementById("certificate-modal");
    var previews = Array.prototype.slice.call(document.querySelectorAll(".certificate-preview"));
    if (!modal || !previews.length) return;

    var modalImage = document.getElementById("certificate-modal-image");
    var modalTitle = document.getElementById("certificate-modal-title");
    var modalDate = document.getElementById("certificate-modal-date");
    var closeButton = modal.querySelector(".certificate-modal__close");
    var previousButton = modal.querySelector(".certificate-modal__nav--previous");
    var nextButton = modal.querySelector(".certificate-modal__nav--next");
    var verifySection = document.getElementById("certificate-modal-verify");
    var verifyBody = document.getElementById("certificate-modal-verify-body");
    var verifyButton = document.getElementById("certificate-modal-verify-btn");
    var modalPosition = document.getElementById("certificate-modal-position");
    var currentIndex = 0;
    var trigger = null;
    var closeTimer = null;

    function detailsFor(index) {
      var card = previews[index].closest(".certificate-card");
      var image = previews[index].querySelector("img");
      var title = card.querySelector("h3");
      var date = card.querySelector("time");
      return {
        card: card,
        image: image,
        title: title.textContent,
        date: date.textContent,
        dateTime: date.getAttribute("datetime")
      };
    }

    /* Body markup for the compact "Credential Verification" block, built from
       the card's data-verify* attributes. The VERIFY button itself lives in
       the title row; empty string means no section at all. Codes are plain
       readable text — there are no copy controls or inputs. */
    function verifyMarkup(card) {
      var type = card.getAttribute("data-verify");
      if (!type) return "";
      var code = card.getAttribute("data-verify-code") || "";

      function esc(value) {
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
      }

      function valueBlock(label, value) {
        return (
          '<div class="certificate-verify__group">' +
          '<span class="certificate-verify__label">' + esc(label) + "</span>" +
          '<div class="certificate-verify__code"><code>' + esc(value) + "</code></div></div>"
        );
      }

      if (type === "link") {
        // Cisco: the VERIFY button alone — no extra section.
        return "";
      }

      if (type === "certiport") {
        return (
          valueBlock("Verification code", code) +
          '<p class="certificate-verify__note">Enter this code at Certiport\u2019s verification portal.</p>'
        );
      }

      if (type === "spup") {
        return (
          valueBlock("Certificate ID", code) +
          '<p class="certificate-verify__note">Issuer: SPUP Open University \u00b7 OpenLearning</p>'
        );
      }

      if (type === "tesda") {
        var lastName = card.getAttribute("data-verify-name-last") || "";
        var firstName = card.getAttribute("data-verify-name-first") || "";
        var firstFour = card.getAttribute("data-verify-num-first4") || "";
        var lastFour = card.getAttribute("data-verify-num-last4") || "";
        return (
          '<p class="certificate-verify__note">Enter these details in the official ' +
          "TESDA Registry of Certified Workers.</p>" +
          '<p class="certificate-verify__holder">' + esc(lastName + ", " + firstName) + "</p>" +
          '<div class="certificate-verify__fields">' +
          valueBlock("First four", firstFour) +
          valueBlock("Last four", lastFour) +
          "</div>"
        );
      }

      return "";
    }

    function padNumber(value) {
      return value < 10 ? "0" + value : String(value);
    }

    function showCertificate(index) {
      currentIndex = (index + previews.length) % previews.length;
      var details = detailsFor(currentIndex);
      modalImage.src = details.image.src;
      modalImage.alt = details.image.alt;
      modalTitle.textContent = details.title;
      modalDate.textContent = details.date;
      modalDate.setAttribute("datetime", details.dateTime);
      modalPosition.textContent = padNumber(currentIndex + 1) + " / " + padNumber(previews.length);

      var verifyUrl = details.card.getAttribute("data-verify-url") || "";
      if (verifyUrl) {
        verifyButton.setAttribute("href", verifyUrl);
        verifyButton.setAttribute("target", "_blank");
        verifyButton.setAttribute("rel", "noopener noreferrer");
        verifyButton.hidden = false;
      } else {
        verifyButton.removeAttribute("href");
        verifyButton.removeAttribute("target");
        verifyButton.removeAttribute("rel");
        verifyButton.hidden = true;
      }

      var markup = verifyMarkup(details.card);
      if (markup) {
        verifyBody.innerHTML = markup;
        verifySection.hidden = false;
      } else {
        verifyBody.innerHTML = "";
        verifySection.hidden = true;
      }
    }

    function closeModal() {
      if (modal.hidden) return;
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      closeTimer = window.setTimeout(function () {
        modal.hidden = true;
        modalImage.removeAttribute("src");
        if (trigger) trigger.focus();
      }, prefersReducedMotion.matches ? 0 : 250);
    }

    function openModal(index, opener) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      trigger = opener;
      showCertificate(index);
      modal.hidden = false;
      document.body.classList.add("modal-open");
      window.requestAnimationFrame(function () {
        modal.classList.add("is-open");
        closeButton.focus();
      });
    }

    previews.forEach(function (preview, index) {
      preview.addEventListener("click", function () {
        openModal(index, preview);
      });
    });

    closeButton.addEventListener("click", closeModal);
    previousButton.addEventListener("click", function () {
      showCertificate(currentIndex - 1);
    });
    nextButton.addEventListener("click", function () {
      showCertificate(currentIndex + 1);
    });

    modal.addEventListener("click", function (event) {
      if (!event.target.closest(".certificate-modal__figure, button")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (modal.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showCertificate(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showCertificate(currentIndex + 1);
      } else if (event.key === "Tab") {
        var focusable = Array.prototype.slice.call(modal.querySelectorAll("button:not([disabled]), a[href]"));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* 6a. PROJECT GALLERY — scrollable screenshot panel + full-size lightbox
     ---------------------------------------------------------------------- */
  function initProjectGallery() {
    var gallery = document.querySelector("[data-project-gallery]");
    var modal = document.getElementById("cashier-lightbox");
    if (!gallery || !modal) return;

    var shots = Array.prototype.slice.call(gallery.querySelectorAll("[data-gallery-thumb]"));
    if (!shots.length) return;

    var modalImage = document.getElementById("cashier-lightbox-image");
    var modalLabel = document.getElementById("cashier-lightbox-label");
    var modalPosition = document.getElementById("cashier-lightbox-position");
    var closeButton = modal.querySelector(".certificate-modal__close");
    var previousButton = modal.querySelector(".certificate-modal__nav--previous");
    var nextButton = modal.querySelector(".certificate-modal__nav--next");

    var currentIndex = 0;
    var trigger = null;
    var closeTimer = null;

    function detailsFor(index) {
      var shot = shots[index];
      var image = shot.querySelector("img");
      var label = shot.querySelector(".project-gallery__shot-label");
      return {
        src: image.getAttribute("src"),
        alt: shot.getAttribute("data-alt") || "",
        label: label ? label.textContent.trim() : ""
      };
    }

    /* Marks the active screenshot in the panel (and returns its details).
       The modal image is only written while the viewer is open, so nothing
       extra is fetched on page load. */
    function selectShot(index) {
      currentIndex = (index + shots.length) % shots.length;
      shots.forEach(function (shot, shotIndex) {
        var selected = shotIndex === currentIndex;
        shot.classList.toggle("is-selected", selected);
        shot.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      return detailsFor(currentIndex);
    }

    function showImage(index) {
      var details = selectShot(index);
      modalImage.setAttribute("src", details.src);
      modalImage.setAttribute("alt", details.alt);
      modalLabel.textContent = details.label;
      modalPosition.textContent = currentIndex + 1 + " / " + shots.length;
    }

    function closeModal() {
      if (modal.hidden) return;
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      closeTimer = window.setTimeout(function () {
        modal.hidden = true;
        modalImage.removeAttribute("src");
        modalImage.setAttribute("alt", "");
        if (trigger) trigger.focus();
      }, prefersReducedMotion.matches ? 0 : 250);
    }

    function openModal(index, opener) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      trigger = opener;
      modal.hidden = false;
      showImage(index);
      document.body.classList.add("modal-open");
      window.requestAnimationFrame(function () {
        modal.classList.add("is-open");
        closeButton.focus();
      });
    }

    /* Selecting a screenshot in the panel opens it full size. */
    shots.forEach(function (shot, index) {
      shot.addEventListener("click", function () {
        openModal(index, shot);
      });
    });

    closeButton.addEventListener("click", closeModal);
    previousButton.addEventListener("click", function () {
      showImage(currentIndex - 1);
    });
    nextButton.addEventListener("click", function () {
      showImage(currentIndex + 1);
    });

    /* Clicking the dark backdrop (anything outside the figure and buttons)
       closes the viewer; clicking the screenshot itself does not. */
    modal.addEventListener("click", function (event) {
      if (!event.target.closest(".certificate-modal__figure, button")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (modal.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(currentIndex + 1);
      } else if (event.key === "Tab") {
        var focusable = Array.prototype.slice.call(modal.querySelectorAll("button:not([disabled]), a[href]"));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    selectShot(0);
  }

  /* 6b. SCROLL SPY — mark the section currently being read
     ---------------------------------------------------------------------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var entries = [];
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var section = document.getElementById(href.slice(1));
      if (section) entries.push({ link: link, section: section });
    });
    if (!entries.length) return;

    var visible = {};

    var observer = new IntersectionObserver(
      function (items) {
        items.forEach(function (item) {
          visible[item.target.id] = item.isIntersecting;
        });
        var current = null;
        entries.forEach(function (entry) {
          if (visible[entry.section.id]) {
            if (!current) current = entry;
            // Prefer the section closest to the top of the viewport
            if (
              entry.section.getBoundingClientRect().top <
              current.section.getBoundingClientRect().top
            ) {
              current = entry;
            }
          }
        });
        entries.forEach(function (entry) {
          if (entry === current) {
            entry.link.setAttribute("aria-current", "true");
          } else {
            entry.link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );

    entries.forEach(function (entry) {
      observer.observe(entry.section);
    });
  }

  /* 7. REVEAL ANIMATIONS (IntersectionObserver)
     ---------------------------------------------------------------------- */
  function initRevealAnimations() {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    function showAll() {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    // Content must never stay hidden: show immediately if motion is reduced
    // or IntersectionObserver is unavailable.
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* 8. PRINT BUTTON (resume "Print / Save as PDF")
     ---------------------------------------------------------------------- */
  function initPrintButtons() {
    var buttons = document.querySelectorAll("[data-print]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  ready(function () {
    initNavigation();
    initCurrentYear();
    initScrollProgress();
    initBackToTop();
    initContactForm();
    initCertificateGallery();
    initProjectGallery();
    initScrollSpy();
    initRevealAnimations();
    initPrintButtons();
  });
})();
