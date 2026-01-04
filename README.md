# Prompter 

**Prompter** is a small React + Vite tool that helps you create structured, higher-quality prompts through a guided form. Fill the form, toggle optional guidance flags, and export your prompt in multiple formats  including the optimized **Toon** format.

---

##  Features

- Guided form to compose prompts with: **role**, **expertise**, **context**, **task**, **constraints**, **tone**, and **format**.
- Toggleable **flags** (e.g., chain-of-thought, accessibility, production-ready code) to inject best-practice guidance into prompts.
- **Export modes:** `json`, `toon` (optimized format), and `xml`.
- One-click copy to clipboard and toast notifications for success/error.
- Small, extensible codebase with clear places to add roles, flags, and export strategies.

---

##  Quick start

```bash
# Install dependencies (recommended: pnpm)
pnpm install

# Start the dev server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview

# Lint the code
pnpm run lint
```

> Tip: You can also use `npm` or `yarn` if you prefer.

---

## 🔒 Privacy & Data

Prompter runs entirely in the browser and processes all input locally on the client. No form data or prompts are transmitted to any external server or database by this project. If you add integrations, analytics, or third-party services, verify their privacy practices.

