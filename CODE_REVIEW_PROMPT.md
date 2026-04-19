# Code Review Checklist Prompt

Use this prompt when reviewing your projects before deployment. Ask the AI to check for **real issues**, not over-engineering.

---

## The Prompt to Use:

```
Please do a code review of my [PROJECT_NAME] project and check for:

1. **Real Bugs** (things that would break functionality):
   - Missing error handling on API calls (if response fails, does it handle it?)
   - Input validation issues (can invalid data break the app?)
   - localStorage/browser API checks for SSR (proper typeof window guards?)
   - Logic errors that would cause crashes

2. **Security Issues** (actual risks):
   - Hardcoded API keys or credentials exposed (should be .env)
   - SQL injection or input injection risks
   - CORS issues with external APIs

3. **Basic Best Practices** (things junior devs should know):
   - Are error messages clear to users?
   - Does the contact form have email/required field validation?
   - Are loading states handled?
   - Do async operations have try-catch?

**Important:** Only recommend fixes that are:
- Actual bugs (not "best practices")
- Things I can reasonably understand and implement as a junior dev
- Not over-engineering solutions I won't encounter at my level

Ask me if recommendations are within my current scope before suggesting complex patterns.
```

---

## How I Reviewed Your Portfolio:

1. ✅ **Read all main files** (layout, pages, components, API routes)
2. ✅ **Searched for common issues:**
   - localStorage usage (checking for `typeof window` guards)
   - API calls (checking for error handling)
   - Form validation (input sanitization)
   - Environment variables (API keys in code vs .env)
3. ✅ **Checked for crashes:**
   - Unhandled promise rejections
   - Missing null checks
   - Browser API usage on server
4. ✅ **Verified security:**
   - No exposed credentials
   - No SQL injection risks
   - No obvious XSS vulnerabilities
5. ✅ **Looked at error messages:**
   - Are they helpful to users?
   - Do they explain what went wrong?

---

## What I Should NOT Have Done:

- ❌ Recommend DOMPurify without knowing if you need it
- ❌ Suggest advanced TypeScript patterns you haven't learned
- ❌ Add "nice to have" refactorings
- ❌ Over-complicate things that work fine

**Bottom line:** Focus on **things that break** or **security issues**, not stylistic improvements.

---

## Quick Checklist Before You Deploy Any Project:

- [ ] Does it build with `npm run build`?
- [ ] Any hardcoded API keys? (Move to .env.local)
- [ ] Do forms validate input?
- [ ] Do API calls handle errors (try-catch)?
- [ ] Does localStorage have `typeof window` guard?
- [ ] Are error messages user-friendly?
- [ ] No console errors in browser?
- [ ] Tested on mobile and desktop?

That's it. You're good to ship.
