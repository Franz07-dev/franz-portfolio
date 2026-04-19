# Franz Portfolio 🚀

A professional portfolio website showcasing projects, skills, and ways to get in touch. This project demonstrates how to build a real website that can be deployed and shared with employers or clients.

## What You'll Learn

This project covers:
- **Multi-page websites** - Different pages for different sections
- **Routing** - Navigate between pages smoothly
- **Components** - Reusable UI pieces (Navbar, Footer)
- **Email integration** - Send emails from forms
- **Markdown support** - Display formatted content
- **Responsive design** - Works on phones and computers

## Features

✅ Home page with introduction
✅ About page with background
✅ Portfolio section with project showcases
✅ Contact form with email delivery
✅ Responsive navigation
✅ Clean, modern design
✅ Multiple integrated projects

## Projects Included

1. **Expense Tracker** - Track your spending
2. **GitHub Viewer** - Explore GitHub profiles
3. **Markdown Viewer** - Display formatted markdown
4. **To-Do List** - Manage tasks
5. **Weather App** - Check weather forecasts
6. **Task Manager** - Full app with authentication (integrated)
7. **Code Explainer** - Explain code snippets (integrated)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment (Optional)

For email functionality, create `.env.local`:
```
RESEND_API_KEY="your-resend-key-here"
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx              → Home page
├── layout.tsx            → Main layout wrapper
├── globals.css           → Global styles
├── about/                → About page
│   └── page.tsx
├── contact/              → Contact page
│   └── page.tsx
├── projects/             → Project showcase
│   ├── page.tsx
│   ├── expense-tracker/
│   ├── github-viewer/
│   ├── markdown-viewer/
│   ├── to-do-list/
│   └── weather-app/
├── api/                  → Backend
│   └── contact/          → Contact form endpoint
components/
├── Navbar.tsx            → Navigation bar
└── Footer.tsx            → Footer
public/                  → Images and static files
```

## How It Works

1. **User visits website** → Lands on home page
2. **Navigates around** → Clicks menu to explore pages
3. **Fills contact form** → Email sent via Resend API
4. **Clicks projects** → Showcases individual work
5. **Accesses integrated apps** → Can use Task Manager or Code Explainer

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code quality
```

## Technologies Used

- **Next.js** - React framework with routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Resend** - Email delivery
- **Marked** - Markdown parsing
- **React** - UI library

## Customization

### Change Your Name/Info
Edit `app/page.tsx` and `app/about/page.tsx`

### Update Projects
Edit or add new folders in `app/projects/`

### Modify Styling
Edit `app/globals.css` or component styles

### Update Navigation
Edit `components/Navbar.tsx`

## Troubleshooting

**Page not loading?**
- Check if dev server is running (`npm run dev`)
- Refresh the browser

**Contact form not working?**
- Ensure `RESEND_API_KEY` is set
- Check email address is valid

**Images not showing?**
- Make sure images are in `/public` folder
- Check file paths are correct

## Deploying

Easiest way is using Vercel:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables if needed
5. Deploy!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Resend Email](https://resend.com/docs)
- [Marked Markdown Parser](https://marked.js.org)

## Tips for Junior Developers

- Start by customizing the home page
- Try adding a new project section
- Experiment with colors and layouts
- Deploy early and test on different devices
- Ask for feedback on your portfolio

## Next Steps

- [ ] Personalize all content
- [ ] Add your own projects
- [ ] Set up email (Resend)
- [ ] Deploy to Vercel
- [ ] Share with potential employers
- [ ] Integrate Task Manager
- [ ] Integrate Code Explainer
