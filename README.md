# Eye Hospital — Premium Healthcare Website

A complete, modern, pixel-faithful, and fully responsive eye hospital frontend website built to replicate the design specifications of the modern ophthalmology clinic visual reference.

---

## 🌟 Project Highlights

- **100% Faithful Layout & Visual Proportions**: Recreates all 12 sections in the exact order and aesthetic defined in the reference.
- **Deep Navy & Teal Palette**: Precision color-matching using `--color-primary-navy` (`#073B59`), `--color-dark-navy` (`#06364F`), `--color-secondary-blue` (`#0876A8`), `--color-teal` (`#13B8B0`), and `--color-cyan` (`#75D9E1`).
- **Futuristic Biometric HUD Graphics**: Custom concentric rings, crosshairs, and pulse animations overlaying the hero close-up eye photography.
- **Micro-Interactions**: Video modal trigger ("Watch Our Story") with pulsing ripple, smooth hover elevations, and interactive doctor profiles.
- **Interactive Testimonials Carousel**: Touch-friendly carousel with auto-sliding, drag/swipe support, and dot navigation.
- **Client-Side Appointment Booking Engine**: Form validation (name, phone format, email regex, date constraint preventing past selections), loading spinner, and success confirmation modal.
- **Performance & Accessibility**: Semantic HTML5, ARIA labels, keyboard focus traps, reduced-motion compliance, and zero heavy JS frameworks.

---

## 📁 Project Structure

```
eye-hospital/
│
├── index.html                  # Semantic single-page HTML structure (all 12 sections)
│
├── css/
│   └── style.css               # Design system tokens, HUD animations & custom styling
│
├── js/
│   └── script.js               # Vanilla JavaScript for interactions, forms & modals
│
├── assets/
│   ├── images/
│   │   ├── hero-eye.jpg            # Hero close-up eye photograph
│   │   ├── hospital-reception.jpg  # Modern reception area & waiting room
│   │   ├── doctor-examination.jpg  # Ophthalmologist examination with slit lamp
│   │   ├── eye-technology.jpg      # Advanced OCT scanning & laser diagnostics
│   │   ├── doctor-1.jpg            # Dr. Rajesh Sharma (Senior Cataract & LASIK Surgeon)
│   │   ├── doctor-2.jpg            # Dr. Sunita Rao (Cornea & Refractive Specialist)
│   │   ├── doctor-3.jpg            # Dr. Vikramaditya Reddy (Vitreo-Retinal Surgeon)
│   │   ├── doctor-4.jpg            # Dr. Ananya Mukherjee (Pediatric & Squint Specialist)
│   │   ├── hospital-building.jpg   # Hospital campus exterior
│   │   ├── patient-1.jpg           # Sunita Agarwal testimonial avatar
│   │   ├── patient-2.jpg           # Rajeev Malhotra testimonial avatar
│   │   └── patient-3.jpg           # Meera Krishnan testimonial avatar
│   │
│   └── icons/                      # Inline vector SVG icons
│
└── README.md                   # Complete documentation & customization guide
```

---

## 🚀 How to Run the Project (VS Code Live Server)

1. Open **Visual Studio Code**.
2. Go to **File** → **Open Folder...** and select either the `eye-hospital` directory or its parent directory.
3. If not already installed, install the **Live Server** extension (by *Ritwick Dey*) from the Extensions panel (`Ctrl+Shift+X`).
4. Right-click on `index.html` in the file explorer.
5. Click **"Open with Live Server"** (or click **"Go Live"** in the bottom status bar).
6. Your default web browser will open `http://127.0.0.1:5500/index.html`.

---

## 🎨 Customizing Colors & Typography

All global tokens are organized in `css/style.css` and mirrored in `tailwind.config` inside `index.html`.

### 1. Color Palette Customization
In `css/style.css`, update the CSS Custom Properties:
```css
:root {
  --color-primary-navy: #073B59;    /* Primary dark headings & banners */
  --color-dark-navy: #06364F;       /* Hero background & footer */
  --color-secondary-blue: #0876A8;  /* Primary action buttons */
  --color-teal: #13B8B0;            /* Accent teal buttons & highlights */
  --color-cyan: #75D9E1;            /* Eyebrow text & glowing rings */
  --color-light-blue: #EEF7FC;      /* Section background tints */
  --color-white: #FFFFFF;
  --color-main-text: #173247;
  --color-secondary-text: #667C8D;
  --color-border: #DCEAF1;
}
```

### 2. Typography
The typography is unified across all headings, subheadings, body text, buttons, and cards using the **Plus Jakarta Sans** font family (from light 300 to extra-bold 800) for an ultra-modern, crisp, and high-end healthcare visual aesthetic. To swap fonts:
1. In `index.html`, update the Google Font `<link>` tag.
2. In `css/style.css`, update `--font-sans` or `--font-heading`.

---

## 🖼️ How to Add and Replace Images

All image files are located in `assets/images/`.

| File Name | Purpose | Recommended Dimensions |
| :--- | :--- | :--- |
| `hero-eye.jpg` | Main hero eye photograph (Google Gemini AI generated) | `800 x 600 px` (high-contrast iris/pupil) |
| `hospital-reception.jpg` | About Us hospital reception (Google Gemini AI generated) | `800 x 600 px` (warm architectural photo) |
| `doctor-examination.jpg` | Why Choose Us slit-lamp exam (Google Gemini AI generated) | `800 x 600 px` (clinical setting) |
| `eye-technology.jpg` | Technology section scanner (Google Gemini AI generated) | `800 x 500 px` (diagnostic equipment) |
| `doctor-1.jpg` to `doctor-4.jpg` | Specialist doctor portraits (Google Gemini AI generated) | `400 x 300 px` (professional bust portraits) |
| `hospital-building.jpg` | Contact section hospital exterior (Google Gemini AI generated) | `800 x 600 px` (daylight architectural shot) |
| `patient-1.jpg` to `patient-3.jpg` | Patient testimonial avatars | `120 x 120 px` (circular crops) |

To replace any image, simply copy your new image with the same file name into `assets/images/`, or update the `src` attribute in `index.html`.

---

## ⚙️ Connecting the Appointment Form to a Backend

The appointment form currently performs comprehensive client-side validation and displays a patient confirmation modal.

To connect this to your production backend API (e.g., Node.js / Express, Python / Django / FastAPI, PHP, or Supabase):

1. Open `js/script.js` and locate the `appointmentForm.addEventListener('submit', ...)` handler.
2. Replace the simulated `setTimeout` block with a `fetch` call:
```javascript
const bookingData = {
  fullName: document.getElementById('fullName').value.trim(),
  phone: document.getElementById('phoneNumber').value.trim(),
  email: document.getElementById('emailAddress').value.trim(),
  service: document.getElementById('serviceSelect').value,
  date: document.getElementById('appointmentDate').value,
  time: document.getElementById('appointmentTime').value
};

try {
  const response = await fetch('https://api.eyehospital.com/v1/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });

  const result = await response.json();

  if (response.ok) {
    // Show confirmation modal with server-assigned reference number
    document.getElementById('confirm-name').textContent = result.patientName;
    successModal.classList.add('is-active');
    appointmentForm.reset();
  } else {
    alert(result.message || 'Unable to schedule appointment. Please call us directly.');
  }
} catch (error) {
  console.error('Submission failed:', error);
  alert('Network error. Please try again or call our hotline.');
} finally {
  submitBtn.disabled = false;
  submitSpinner.classList.add('hidden');
  submitText.textContent = 'Submit Appointment';
}
```

---

## 📋 Section-by-Section Verification

1. **Top Emergency Bar & Header** — 24/7 helpline chip (`+91 98765 43210`), clinic location (Bengaluru, India), visiting hours, sticky navbar, eye logo, center links (`Home`, `Services`, `About`, `Doctors`, `Technology`, `FAQ`, `Contact`), and responsive slide-out mobile drawer.
2. **Hero Section** — Deep navy gradient, eyebrow text, live patient status badge, bold headline, clinical feature pills, dual CTAs, hotline call button, verified review score (4.9/5 from 12K+ reviews), eye photo with animated biometric HUD overlay, floating metric cards, and interactive HUD toggle.
3. **Highlights Strip** — 4 medical badges with icons, clean borders, and 2-column grid reflow on mobile.
4. **About Us** — Reception photo, introductory copy, 3 animated number counters (`10+`, `50K+`, `15+`), ISO 9001:2015 & NABH accreditation badges, and "Know More" button.
5. **Comprehensive Services** — Interactive category filter tabs (`All`, `Laser & Vision`, `Surgical Care`, `Retina & Kids`), 6 specialized cards with feature tags, and direct `"Book This Service →"` pre-filling triggers.
6. **Why Choose Us** — Benefit statements with teal checkmarks, examination photo, and animated pulsing video play button opening an accessible video modal.
7. **Our Expert Doctors** — 4 specialist doctor cards with real portraits, educational credentials (`MBBS, FCPS, FRCS`), experience badges, live availability tags (`🟢 Available Today`), and direct `"Book Visit →"` form pre-fill buttons.
8. **Advanced Technology** — Diagnostic scanner showcase with 4 feature cards (OCT Scan, Femtosecond Laser, Digital Testing, Operation Theater).
9. **Patient Testimonials** — Responsive carousel with quotation marks, patient reviews, avatars, and touch-swipe navigation.
10. **Frequently Asked Questions (FAQ Accordion)** — 5 collapsible clinical FAQ items covering LASIK candidacy, cataract recovery, emergency services, health insurance, and pediatric eye screenings.
11. **Appointment Booking Banner** — Navy container with watermark, consultation type radio selectors (*First Visit, Follow-up, Surgery Eval*), preferred specialist dropdown, and floating white appointment form with full validation.
12. **Contact & Location** — Phone, email, address cards with direct dialing links, operating hours table (OPD & 24/7 Trauma), hospital exterior image, and floating WhatsApp support widget.
13. **Footer** — 4-column navy footer with branding, social icons, quick links, service directory, contact details, and copyright notice.

---

## 📄 License
This project is prepared for demonstration and production deployment for Eye Hospital. All rights reserved.

