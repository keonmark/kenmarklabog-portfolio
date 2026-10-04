# Ken Mark S. Labog — Personal Portfolio

Professional portfolio website for **Ken Mark S. Labog**, 4th Year BSIT student at Isabela State University – Cauayan Campus.

Built with plain **HTML5, CSS3, and vanilla JavaScript**. No frameworks, no build step, no external runtime dependencies.

---

## Project Status

Implementation is proceeding in approved steps:

1. [x] Step 1 — Project scaffold, `.gitignore`, README, git init
2. [ ] Step 2 — Design system: `assets/css/styles.css` tokens, reset, typography, layout
3. [ ] Step 3 — Full `index.html` with all required sections
4. [ ] Step 4 — Section styling + responsive pass
5. [ ] Step 5 — `assets/js/main.js` (nav, reveals, form, back-to-top)
6. [ ] Step 6 — Assets: favicon, placeholder images, QR code, resume
7. [ ] Step 7 — SEO: meta/OG/JSON-LD, `robots.txt`, `sitemap.xml`
8. [ ] Step 8 — Accessibility + performance audit
9. [ ] Step 9 — Content audit against the brief
10. [ ] Step 10 — Final commit; deployment deferred until domain/hosting confirmed

---

## Structure

```
portfolio-website/
├── index.html                 # Main single-page site (Step 3)
├── resume.html                # Printable resume page (Step 6)
├── robots.txt                 # Step 7
├── sitemap.xml                # Step 7
├── README.md
├── .gitignore
└── assets/
    ├── css/styles.css         # Design tokens + all styles (Step 2/4)
    ├── js/main.js             # All JavaScript (Step 5)
    ├── docs/                  # ken-mark-labog-resume.pdf goes here
    └── images/
        ├── profile/           # Profile photo
        ├── projects/
        │   ├── campus-cashier/  # Project screenshots
        │   └── adlor/           # Project screenshots
        ├── qr-portfolio.png   # Static portfolio QR code (Step 6)
        ├── favicon.svg
        └── og-cover.png       # Open Graph share image
```

---

## TODO Registry — Information Still Needed

> Rules: never invent personal details, dates, employers, certificate numbers, or verification URLs. Fill items below only when verified.

### Content

- [ ] Profile photograph (`assets/images/profile/`)
- [ ] GitHub profile URL (username not yet chosen)
- [ ] LinkedIn URL (none currently — omit link until it exists)
- [ ] Phone number (optional; do not hard-code until provided)
- [ ] Personal domain (not yet purchased; confirm instructor requirement first)
- [ ] Hosting provider selection

### Certifications / Training

- [ ] GICAST — exact title and issuing organization
- [ ] Networking-related exam/certification — exact title
- [ ] Dates / credential IDs / verification URLs for all certifications (if provided later)

### Experience — SPES

- [ ] Organization name
- [ ] Position/role
- [ ] Start and end dates
- [ ] Responsibilities and accomplishments

### Education

- [ ] Luna National High School graduation year
- [ ] Luna Central School graduation year

### Projects

- [ ] Campus Cashier system — verified final technology stack and feature list
- [ ] Campus Cashier screenshots (`assets/images/projects/campus-cashier/`)
- [ ] ADLOR — confirm whether backup is the final version
- [ ] ADLOR screenshots (`assets/images/projects/adlor/`)

### Assets

- [ ] `assets/docs/ken-mark-labog-resume.pdf` (printable `resume.html` works until then)
- [ ] Open Graph cover image
- [ ] Favicon finalization

---

## Updating Content Later

Instructions will be added after implementation (how to add a certification, add a project, swap the resume, update links).

---

## Local Preview

No build required. Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 8000
# then visit http://localhost:8000
```

---

## License

Personal portfolio. All content © Ken Mark S. Labog.
