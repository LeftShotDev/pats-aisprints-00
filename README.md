# QuizMaker

QuizMaker is a web-based application for K-12 teachers to create, manage, and share multiple choice questions (MCQs) for classroom assessments. Teachers can build questions manually or use AI to generate standards-aligned questions based on Texas Essential Knowledge and Skills (TEKS).

## Features

### Secure Teacher Accounts
- Email and password registration
- Secure login with session persistence
- All content is private and protected behind authentication

### MCQ Library Management
- Create questions with a title, description, question stem, and 2–6 answer choices
- Edit and delete existing questions
- Search and browse your question library with pagination
- Preview and attempt questions before classroom use

### AI-Powered TEKS Question Generation
- Select a subject, grade level, strand, and specific TEKS standard
- AI generates a complete question — stem, choices, and correct answer
- Review and edit the generated question before saving

## Technology Stack

- [Next.js 15](https://nextjs.org) — React framework (App Router)
- [Cloudflare Workers](https://workers.cloudflare.com) — Serverless deployment
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite database
- [OpenNext.js](https://opennext.js.org/cloudflare) — Next.js adapter for Cloudflare
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Tailwind CSS 4](https://tailwindcss.com) — Styling

## Development

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
```

## Deploy

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Project Documentation

- [`AGENTS.md`](AGENTS.md) — AI development guidelines and project conventions
- [`docs/`](docs/) — Feature spec documents (Technical PRDs)
- [`shared-memory/`](shared-memory/) — Product overview and persistent AI context
