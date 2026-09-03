# Anmol Soni — Portfolio

A personal portfolio website built with plain HTML, CSS, and JavaScript —
no frameworks, no build step, no backend. It's a static site, so it deploys
directly to Netlify (or any static host) straight from GitHub.

## Folder structure

```
anmol-soni-portfolio/
├── index.html                  Entry point — all page content lives here
├── favicon.svg                 Browser tab icon
├── css/
│   └── style.css               All styling
├── js/
│   └── script.js                Mobile nav, active-link highlighting, scroll reveal
├── assets/
│   ├── images/                 Optional images (empty by default)
│   ├── resume/                 Put your resume PDF here
│   └── certificates/           Put certificate files here
└── README.md
```

## Things you still need to fill in

The site works as-is, but a few links are placeholders because I don't have
the real files or URLs. Search `index.html` for these and replace them:

| Placeholder | What to do |
|---|---|
| `YOUR_RESUME_URL` (2 places) | Add your resume PDF to `assets/resume/`, then point the link at it, e.g. `assets/resume/Anmol_Soni_Resume.pdf` |
| `YOUR_CERTIFICATE_URL` | Add the certificate file to `assets/certificates/`, then link to it the same way |
| `YOUR_PROJECT_GITHUB_URL` (3 places, one per project) | Replace with each project's real GitHub repo URL |
| `YOUR_LIVE_DEMO_URL` (Digital Clock project) | Replace with a live link if you deploy that project separately, or delete the button if you don't have one |

**Profile photo:** the rounded square in the top-right of the hero section
currently shows your initials ("AS") as a placeholder. To use a real photo
instead, add it to `assets/images/` and replace this line in `index.html`:
```html
<div class="hero__avatar" aria-hidden="true">AS</div>
```
with:
```html
<img src="assets/images/profile.jpg" alt="Anmol Soni" class="hero__avatar" />
```

Your GitHub, LinkedIn, and email are already filled in from your CV.

## 1. Run it locally

No installation needed. Either:

- Double-click `index.html` to open it directly in a browser, **or**
- Serve it properly (recommended, avoids some browser quirks) using
  whichever you have installed:
  ```bash
  # Python
  python3 -m http.server 8000

  # Node
  npx serve .
  ```
  Then visit `http://localhost:8000`.

## 2. Upload it to GitHub

```bash
cd anmol-soni-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/anmolsoni-01/YOUR_REPO_NAME.git
git push -u origin main
```

(Create the empty repository on GitHub first, then copy its URL into the
`git remote add` command above.)

## 3. Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in (you can sign
   in with your GitHub account).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and select your portfolio repository.
4. Build settings — leave these as-is, since there's no build step:
   - Build command: *(leave blank)*
   - Publish directory: `.` (the repository root, since `index.html` is
     already at the top level)
5. Click **Deploy site**. Netlify will give you a live URL
   (something like `your-name-123abc.netlify.app`) within a minute.
6. Optional: in **Site settings → Domain management**, change the generated
   subdomain to something like `anmol-soni-portfolio.netlify.app`, or connect
   a custom domain if you have one.

## 4. Update the site later

Any time you want to change something:

```bash
# edit the files, then:
git add .
git commit -m "Describe what you changed"
git push
```

Netlify watches your GitHub repository, so every push to `main` triggers an
automatic redeploy — no need to touch Netlify again after the first setup.

## Notes on the content

- Every project, skill, achievement, and education entry reflects only what
  was provided from your CV and instructions — nothing has been invented.
- The Food Freshness project description was pulled from your CV's fuller
  detail (Arduino, MQ gas sensor, DHT11, RTC, HC-05 Bluetooth) rather than
  left as a placeholder, since that information was available.
- The achievements list keeps your original wording about one Python project
  "deployed live for public access" — if you want that project linked
  directly, add the URL to the corresponding project card's Live Demo button.

## The contact form

The "Send Message" form in the Contact section is wired up for
[Netlify Forms](https://docs.netlify.com/manage/forms/setup/) — no backend,
no extra service, and no code to write. It works automatically once you
deploy to Netlify (step 3 above), because Netlify scans your HTML for
`data-netlify="true"` forms during the build and starts collecting
submissions for you. A spam honeypot field is already included.

- **Locally, it won't send anything** — the fetch request has nowhere to go
  until the site is live on Netlify, so you'll see the "Something went
  wrong" message if you test it before deploying. That's expected.
- Once deployed, submissions show up under **Site settings → Forms** in the
  Netlify dashboard, and you can turn on email notifications there.
- To change what happens after a successful submit, edit the `.then(...)`
  block in `js/script.js` (search for `contactForm`).

## The background network

The moving constellation behind every section is a small canvas animation
in `js/script.js` (search for `initNetworkBackground`) — no libraries, just
`<canvas>`. It automatically uses your theme's accent and border colors, so
if you ever change the color palette in `css/style.css`, the background
follows along. It also respects each visitor's reduced-motion setting.

