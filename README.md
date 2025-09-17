# TechRoast: Tech Stack Roast Battle

TechRoast is a full-stack platform where developers can submit their technology stacks and receive roasts from the community or from AI. Inspired by "Roast Me," this project adds a fun twist to developer culture by turning your tech choices into the subject of constructive, brutal, or meme-style feedback.

---

## Project Overview

The platform allows users to:
- Submit their own tech stack, including frontend, backend, database, hosting, and other tools.
- Browse submissions from other developers in a card-based layout.
- Roast stacks by adding comments categorized as "Brutal," "Constructive," or "Meme."
- Generate AI-powered roasts with a limited "Get AI Roasted" feature.
- Scroll through and explore submitted stacks and their roasts.

The initial implementation includes stack submission, roasting, AI-generated roasts, and browsing functionality. Leaderboards and advanced ranking systems are part of the future scope.

---

## Features

- **Stack Submission**
  - Submit details about your frontend, backend, database, hosting, and other tools.
  - Include a short description explaining why you chose this stack.
  - Choose between anonymous or named submissions.

- **Stack Display**
  - View submitted stacks in a card-based interface.
  - See submission dates and roast activity.

- **Roasting System**
  - Add roasts to any stack.
  - Select roast categories: Brutal, Constructive, or Meme.
  - Character limit ensures concise, punchy comments.

- **AI Roast Generator**
  - Option to generate AI-powered roasts.
  - Rate-limited to balance usage.
  - Uses Claude API for witty, context-aware roasting.

---

## Tech Stack

- **Frontend:** Next.js
- **Backend & Database:** Supabase
- **Runtime:** Node.js
- **AI Integration:** Claude API
- **Deployment:** Vercel (frontend), Supabase (backend and database)

---

## Deployment
- **Frontend:** Deploy using Vercel.
- **Backend and Database:** Hosted on Supabase.

## Getting Started

### 1. Clone the repository
<pre>
git clone https://github.com/VijayasreeGarapati/tech-stack-roast.git
</pre>
### 2. Install dependencies
<pre>
npm installx
</pre>

### 3. Set up environment variables
Create a .env.local file in the root directory and add the following:
<pre>
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_API_KEY=your-ai-api-key
</pre>

### 4. Run the project
<pre>
npm run dev
</pre>

The application will be available at: http://localhost:3000

## Future Improvements
- Leaderboards for most roasted stacks, most active roasters, and controversial stacks.
- Sorting options such as “Most Roasted” and “Recent.”
- Enhanced moderation for roast quality and tone.
