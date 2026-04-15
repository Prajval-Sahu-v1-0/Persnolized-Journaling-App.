# Oden's Journal

A terminal-themed digital journal application built with Next.js and Tailwind CSS. The interface features a unique "Gentle Azul" aesthetic with custom fonts, colors, and a clean command-line-style experience for writing and saving your daily entries.

## Features

- **Terminal Interface:** Immersive command-line aesthetic for a distraction-free writing experience.
- **Gentle Azul Theme:** A soothing color palette tailored for focused journaling.
- **Save Entries:** Locally save and persist your daily thoughts via a built-in SQLite database.
- **View Past Entries:** Dedicated interface to read back your previously saved journal entries.
- **Responsive Design:** Polished layout utilizing Tailwind CSS.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite (built-in, automatically initialized)
- **Language:** TypeScript/JavaScript

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Clone this repository to your local machine.
2. Install the necessary dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start journaling.

## How to Use

1. Navigate to the main page to see the terminal-styled prompt.
2. Type your journal entry directly into the multi-line input area.
3. Click the `[SAVE]` button or use the equivalent action to store your entry.
4. Navigate to the Saved Entries page (e.g., `/saved`) to view your historic records.

## Customization

The project uses a custom Tailwind setup to maintain the "Gentle Azul" aesthetic. You can modify the global styles, colors, and typography within `tailwind.config.ts` or the main CSS file.

---
*Built as a dedicated space for quiet reflection.*

