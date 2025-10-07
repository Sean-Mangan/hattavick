# Hattavick UI - D&D Campaign Manager Frontend

A modern React application for managing D&D and TTRPG campaigns, featuring lore management, character tracking, session notes, and collaborative tools.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Pre-Commit Rules](#pre-commit-rules)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🛠 Tech Stack

- **React** 18.1.0 - UI framework
- **Redux Toolkit** 1.9.5 - State management with RTK Query
- **React Router** 6.3.0 - Client-side routing
- **Material-UI** 5.8.3 - Component library
- **Redux Persist** - State persistence
- **Axios** - HTTP client
- **React Helmet** - SEO management
- **SASS** - CSS preprocessing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm 8+
- **Backend API** running (see backend repository)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sean-Mangan/hattavick.git
   cd hattavick/hattavick_ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (if needed)
   - Update `src/config/settings.json` with your API endpoints
   - Ensure backend API URL is correctly set

4. **Start development server**
   ```bash
   npm start
   ```
   - Opens [http://localhost:3000](http://localhost:3000)
   - Hot reload enabled
   - Console shows lint errors

---

## 💻 Development Guide

### Available Scripts

#### `npm start`
Runs the app in development mode with hot reload.

#### `npm run build`
Creates optimized production build in `/build` folder.

#### `npm test`
⚠️ **Note**: Tests are not currently implemented. This is planned for future development.

#### `npm run eject`
⚠️ **Warning**: One-way operation. Only use if you need full webpack control.

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards (see below)
   - Test manually in the browser
   - Check console for errors

3. **Review your changes**
   ```bash
   git status
   git diff
   ```

4. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "feat: add new lore filtering feature"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Hot Reload & Browser DevTools

- Changes auto-reload in browser
- Use **React DevTools** for component inspection
- Use **Redux DevTools** for state debugging
- Check **Network tab** for API calls
- **Console** shows errors and warnings

### Working with the Backend

- Backend must be running for full functionality
- API calls are handled via RTK Query in `src/features/`
- Check `src/app/api/apiSlice.js` for base configuration
- Mock data can be used for UI development

---

## 📁 Project Structure

```
src/
├── app/
│   ├── store.js              # Redux store configuration
│   └── api/
│       └── apiSlice.js       # RTK Query base API
├── features/
│   ├── auth/                 # Authentication logic & API
│   └── campaign/             # Campaign management API & state
├── Pages/
│   ├── HomePage/             # Landing page
│   ├── LoginPage/            # Authentication
│   ├── CampaignPages/        # Campaign-specific pages
│   │   ├── CampaignHomePage/
│   │   ├── LorePage/         # Unified lore management (NEW)
│   │   ├── CharacterPage/
│   │   └── ...
│   └── ...
├── Components/
│   ├── CampaignNavBar/       # Campaign navigation
│   ├── HomeNav/              # Main site navigation
│   ├── Loading/              # Loading states
│   └── ...
├── config/
│   └── settings.json         # App configuration
├── Resources/                # Static assets
├── App.js                    # Main app & routing
├── index.js                  # App entry point
└── index.css                 # Global styles
```

### Key Architectural Patterns

- **Feature-based organization**: Related code grouped by feature
- **RTK Query**: API calls with caching and state management
- **Redux Persist**: Auth state persists across sessions
- **CSS Modules**: Scoped styling for components
- **React Router v6**: Nested routes with outlet context

---

## 📏 Coding Standards

### JavaScript/React

#### Component Structure
```javascript
// 1. Imports (grouped logically)
import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";

// 2. JSDoc comments for complex components
/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
function ComponentName({ prop1, prop2 }) {
  // 3. Hooks first
  const [state, setState] = useState(null);
  const data = useSelector(selectData);
  
  // 4. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // 5. Effects last
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

#### Naming Conventions

- **Components**: PascalCase (`HomePage.js`, `LoreCard.js`)
- **Files**: Match component name (`HomePage.js` for `HomePage` component)
- **Functions**: camelCase (`handleSubmit`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Modules**: Component.module.css
- **Regular CSS**: Component.css (co-located with component)

#### Best Practices

✅ **DO:**
- Use functional components with hooks
- Implement `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations
- Add JSDoc comments for complex functions
- Keep components small and focused (< 300 lines)
- Use prop destructuring
- Handle loading and error states
- Clean up effects (return cleanup function)

❌ **DON'T:**
- Use class components (use functional instead)
- Mutate state directly (use setState)
- Forget dependency arrays in useEffect
- Leave console.log in production code
- Use inline styles (prefer CSS modules)
- Create deeply nested components
- Ignore PropTypes or TypeScript (future enhancement)

### CSS/Styling

#### Style Organization

1. **CSS Modules for scoped styles** (preferred)
   ```css
   /* Component.module.css */
   .container { }
   .title { }
   ```

2. **Regular CSS for shared/legacy styles**
   ```css
   /* Component.css */
   .component-specific-class { }
   ```

3. **Material-UI `sx` prop for one-offs**
   ```javascript
   <Button sx={{ mt: 2 }} />
   ```

#### CSS Best Practices

✅ **DO:**
- Use CSS Grid for layouts
- Use Flexbox for component alignment
- Mobile-first responsive design
- Use CSS variables for theming
- Use rem/em for font sizes
- Prefer CSS transitions over JS animations

❌ **DON'T:**
- Use `!important` (unless absolutely necessary)
- Use fixed pixel heights/widths
- Ignore responsive breakpoints
- Create deeply nested selectors
- Use inline styles excessively

### State Management

#### Redux/RTK Query

- **Global state**: User auth, campaign context
- **Local state**: Component UI state, forms
- **Server state**: RTK Query (automatic caching)

```javascript
// RTK Query example
const { data, isLoading, error } = useGetFactionsQuery(campaignId);
const [updateFaction] = useUpdateFactionMutation();
```

---

## 🔒 Pre-Commit Rules

### Automated Pre-Commit Hooks (Recommended)

We strongly recommend setting up automated pre-commit hooks to enforce code quality automatically. This will:
- ✅ Auto-fix linting issues
- ✅ Format code with Prettier
- ✅ Validate commit messages
- ✅ Catch common mistakes before they're committed

**📚 [Complete Hooks Setup Guide](./PRE_COMMIT_HOOKS.md)** - Full documentation

**⚡ Quick Setup:**
```bash
# Install dependencies
npm install --save-dev husky lint-staged prettier @commitlint/cli @commitlint/config-conventional

# Initialize Husky
npx husky-init && npm install

# Add hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

See [HOOKS_SETUP.md](./HOOKS_SETUP.md) for quick installation instructions.

### Manual Pre-Commit Checklist

If you haven't set up automated hooks yet, follow this manual checklist:

#### 1. Code Quality Checks

```bash
# Check for console.logs (remove them)
grep -r "console.log" src/

# Check for TODO comments (create issues for them)
grep -r "TODO" src/

# Check for debugging code
grep -r "debugger" src/
```

#### 2. Manual Testing Checklist

- [ ] Component renders without errors
- [ ] No console errors in browser
- [ ] Responsive design works (test mobile view)
- [ ] Navigation functions correctly
- [ ] API calls complete successfully
- [ ] Loading states display
- [ ] Error handling works

#### 3. Code Review Self-Check

- [ ] Code follows naming conventions
- [ ] Components are properly documented
- [ ] No unused imports
- [ ] No commented-out code (delete or explain)
- [ ] CSS is organized and scoped
- [ ] No hardcoded values (use config/settings.json)
- [ ] Proper error handling
- [ ] Accessibility considered (alt text, aria labels)

#### 4. Git Hygiene

```bash
# Review changes
git diff

# Stage only relevant files
git add src/path/to/changed/files

# Write meaningful commit message
git commit -m "type: descriptive message"
```

### Commit Message Format

Use conventional commits:

```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, dependencies

**Examples:**
```
feat(lore): add unified lore page with tabs
fix(auth): resolve token expiration issue
docs(readme): update development guide
refactor(cards): optimize card component performance
style(navbar): improve mobile responsiveness
```

### Pre-Commit Checklist Summary

```bash
# 1. Lint check (manual - no linter configured yet)
# - Check for obvious errors
# - Review imports

# 2. Build check
npm run build
# - Ensure no build errors
# - Check bundle size if concerned

# 3. Manual testing
# - Test your feature
# - Test on mobile size
# - Check console for errors

# 4. Git review
git status
git diff
# - Review every change
# - Ensure no unintended modifications

# 5. Commit
git add <files>
git commit -m "type: message"

# 6. Push
git push origin <branch>
```

---

## 🧪 Testing

### Current Status

⚠️ **No automated tests are currently implemented.**

### Planned Testing Strategy

#### Unit Tests (Future)
- Jest + React Testing Library
- Test individual components
- Test Redux reducers and actions
- Test utility functions

#### Integration Tests (Future)
- Test component interactions
- Test API integration with RTK Query
- Test routing and navigation

#### E2E Tests (Future)
- Cypress or Playwright
- Test critical user flows
- Test authentication
- Test campaign management

### Manual Testing Guidelines

Until automated tests are implemented, follow these manual testing procedures:

1. **Feature Testing**
   - Test happy path
   - Test edge cases
   - Test error scenarios
   - Test loading states

2. **Browser Testing**
   - Chrome (primary)
   - Firefox
   - Safari
   - Mobile browsers (iOS Safari, Chrome Mobile)

3. **Responsive Testing**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

4. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility (basic)
   - Color contrast

---

## 🚢 Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Build output in /build folder
# - Minified
# - Optimized
# - Ready for deployment
```

### Environment Configuration

Update `src/config/settings.json` for different environments:
- API endpoints
- Feature flags
- Image URLs
- App settings

### Deployment Platforms

This app can be deployed to:
- **Vercel** (recommended for React apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **Heroku**
- Any static hosting service

---

## 🤝 Contributing

### Getting Help

- Review existing code for patterns
- Ask questions in pull requests
- Document your changes

### Pull Request Process

1. Create feature branch from `main` or `dev`
2. Make changes following coding standards
3. Test thoroughly (manual testing)
4. Update documentation if needed
5. Create PR with clear description
6. Wait for code review
7. Address feedback
8. Merge after approval

### Code Review Guidelines

**Reviewers should check:**
- Code follows style guide
- Components are properly structured
- No obvious bugs
- Responsive design works
- No console errors
- Performance considerations
- Accessibility basics

---

## 📚 Additional Resources

### Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI](https://mui.com/)
- [React Router v6](https://reactrouter.com/)

---

## 📝 License

[Add your license information here]

---

## 👥 Team

- **Owner**: Sean-Mangan
- **Repository**: [hattavick](https://github.com/Sean-Mangan/hattavick)
- **Current Branch**: `main`

---

**Happy Coding! 🎲**
