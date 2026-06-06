# Cooking To-Do List & Meal Planner AI

A premium, AI-powered Cooking To-Do List and Meal Planner micro-application built with React 18, Vite, and custom HSL Glassmorphic CSS. Designed specifically for the Google for Developers Hackathon (Warm-Up Challenge).

## Features
- **Structured Schedule Fit**: Input details of your day (work, workouts, meetings) and receive a customized Breakfast, Lunch, and Dinner plan.
- **Interactive Checklists**: Check off recipe steps and grocery items as you go.
- **Ingredient Substitutions**: Toggle smart, AI-recommended ingredient substitutions which dynamically adjust the grocery list and estimated cost.
- **Budget Feasibility Analyzer**: Set a daily cooking budget in **INR (₹)**. The app dynamically calculates cost adjustments from substitutions, rendering a real-time progress gauge and offering cost-saving tips.
- **Dual Mode**: Direct client-side integration with the **Google Gemini API** (using `gemini-1.5-flash`), with a high-fidelity **Demo Mode** fallback to explore instantly.

---

## Local Development

To run this application locally, you will need [Node.js](https://nodejs.org/) installed on your machine.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Open the address printed in the console (usually `http://localhost:5173`).

---

## Deploying to Netlify

Netlify is the easiest way to deploy this application. It reads build settings from the included `netlify.toml` automatically.

### Option 1: Git Integration (Recommended)
1. Initialize git and push the project to a GitHub, GitLab, or Bitbucket repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repo on GitHub, then link and push:
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
2. Log in to [Netlify](https://www.netlify.com/).
3. Click **Add new site** -> **Import an existing project**.
4. Choose your Git provider and select this repository.
5. Netlify will auto-detect the configuration from the `netlify.toml` file:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**. It will build and be live in seconds!

### Option 2: Drag and Drop (No Git)
1. Build the production build locally on your machine:
   ```bash
   npm run build
   ```
   This will create a `dist` folder in the root directory.
2. Log in to [Netlify](https://www.netlify.com/).
3. Navigate to **Sites** and scroll to the bottom.
4. Drag and drop the `dist` folder directly into the Netlify UI upload zone.

---

## Deploying to Hostinger

Hostinger supports static site hosting via their website builder, panel, or VPS.

### Option 1: Static Hosting (Shared Hosting Panel)
1. Build the production build locally on your machine:
   ```bash
   npm run build
   ```
   This generates the production files inside the `dist` folder.
2. Log in to your Hostinger hPanel.
3. Open the **File Manager** for your domain.
4. Navigate to the `public_html` directory.
5. Upload the entire contents of the `dist` folder (all HTML, CSS, JS files, and assets) directly into `public_html`.

### Option 2: Deploying via Hostinger Git Deployment
1. Push the code to a private GitHub repository.
2. In Hostinger hPanel, search for **Git** under the Advanced section.
3. Add your repository URL, set branch to `main`, and specify `/dist` or configure a custom deployment script if deploying the pre-built files.
