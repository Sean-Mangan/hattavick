# Pre-Commit Hooks Setup Guide

This guide will help you set up automated pre-commit hooks to enforce code quality and consistency.

## 🎯 Recommended Pre-Commit Hooks

### Essential Hooks

1. **Linting** - ESLint for JavaScript/React
2. **Formatting** - Prettier for consistent code style
3. **Type Checking** - (Future: TypeScript)
4. **Commit Message Validation** - Conventional commits
5. **File Size Checks** - Prevent large files
6. **No Debug Code** - Block console.log, debugger

### Nice-to-Have Hooks

- **Bundle Size Analysis** - Warn on large bundle increases
- **Accessibility Checks** - Basic a11y validation
- **Dependency Audit** - Check for vulnerable packages

---

## 🚀 Quick Start - Husky + Lint-Staged

This is the **recommended approach** for React projects.

### Step 1: Install Dependencies

```bash
npm install --save-dev husky lint-staged prettier eslint
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### Step 2: Initialize Husky

```bash
# Initialize husky
npx husky-init && npm install

# This creates .husky/ folder and adds prepare script to package.json
```

### Step 3: Configure Package.json

Add these configurations to your `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,scss,md}\""
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "src/**/*.{json,css,scss,md}": ["prettier --write"]
  }
}
```

### Step 4: Create Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

This creates `.husky/pre-commit` file:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Step 5: Create Commit Message Hook

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Step 6: Configure ESLint

Create `.eslintrc.json`:

```json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Step 7: Configure Prettier

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
build
node_modules
coverage
.husky
package-lock.json
```

### Step 8: Configure Commitlint

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
      ],
    ],
    "subject-case": [0], // Allow any case
    "subject-max-length": [2, "always", 100],
  },
};
```

---

## 🔧 Alternative: Simple Custom Hooks

If you want lightweight custom hooks without dependencies:

### Create .husky/pre-commit

```bash
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Check for console.log
echo "Checking for console.log..."
if git diff --cached --name-only | grep -E '\.js$|\.jsx$' | xargs grep -n 'console\.log' --color; then
    echo "❌ Error: console.log found in staged files"
    echo "Please remove console.log statements before committing"
    exit 1
fi

# Check for debugger
echo "Checking for debugger..."
if git diff --cached --name-only | grep -E '\.js$|\.jsx$' | xargs grep -n 'debugger' --color; then
    echo "❌ Error: debugger statement found in staged files"
    exit 1
fi

# Check for TODO without issue number
echo "Checking for TODO comments..."
if git diff --cached --name-only | grep -E '\.js$|\.jsx$' | xargs grep -n 'TODO' | grep -v '#[0-9]'; then
    echo "⚠️  Warning: TODO found without issue number"
    echo "Please link TODO to an issue: TODO(#123): description"
fi

# Check file size (warn if > 500KB)
echo "Checking file sizes..."
for file in $(git diff --cached --name-only); do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        if [ $size -gt 512000 ]; then
            echo "⚠️  Warning: $file is larger than 500KB ($size bytes)"
        fi
    fi
done

echo "✅ Pre-commit checks passed!"
exit 0
```

### Create .husky/commit-msg

```bash
#!/bin/sh

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Check commit message format: type(scope): subject
if ! echo "$commit_msg" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|revert)(\(.+\))?: .{1,}$'; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Commit message must follow conventional commits:"
    echo "  type(scope): subject"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, perf, test, chore, revert"
    echo ""
    echo "Examples:"
    echo "  feat(lore): add filtering to lore page"
    echo "  fix(auth): resolve token expiration issue"
    echo "  docs: update README with setup instructions"
    echo ""
    exit 1
fi

echo "✅ Commit message format valid"
exit 0
```

Make them executable:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

---

## 📦 Additional Useful Hooks

### Pre-Push Hook (Run tests before push)

`.husky/pre-push`:

```bash
#!/bin/sh

echo "🧪 Running tests before push..."

# When you add tests:
# npm test -- --coverage --watchAll=false

# For now, just build to ensure no errors
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before pushing."
    exit 1
fi

echo "✅ Build successful, proceeding with push"
exit 0
```

### Post-Commit Hook (Success message)

`.husky/post-commit`:

```bash
#!/bin/sh

echo "✅ Commit successful!"
echo "📝 Remember to push your changes: git push"
```

### Post-Checkout Hook (Install dependencies if package.json changed)

`.husky/post-checkout`:

```bash
#!/bin/sh

changedFiles="$(git diff --name-only $1 $2)"

if echo "$changedFiles" | grep -q "package-lock.json"; then
    echo "📦 package-lock.json changed, running npm install..."
    npm install
fi
```

---

## 🎨 VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "files.eol": "\n"
}
```

Recommended VS Code Extensions:

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **GitLens** (eamodio.gitlens)

---

## 🔍 Testing Your Hooks

### Test Pre-Commit Hook

```bash
# Add a file with console.log
echo "console.log('test');" > test.js
git add test.js
git commit -m "test: testing hooks"
# Should fail!

# Remove console.log and try again
echo "// clean code" > test.js
git add test.js
git commit -m "test: testing hooks"
# Should pass!
```

### Test Commit Message Hook

```bash
# Bad message (should fail)
git commit --allow-empty -m "updated stuff"

# Good message (should pass)
git commit --allow-empty -m "feat: add new feature"
```

### Bypass Hooks (Use Sparingly!)

```bash
# Skip pre-commit hooks
git commit --no-verify -m "emergency fix"

# Skip all hooks
git commit -n -m "hotfix"
```

---

## 📊 Hook Performance Tips

1. **Only lint staged files** - Use lint-staged
2. **Parallelize checks** - Run multiple checks concurrently
3. **Cache results** - ESLint/Prettier cache
4. **Skip on rebase** - Check for rebase in progress

### Optimized Pre-Commit with Parallel Checks

`.husky/pre-commit`:

```bash
#!/bin/sh

# Run checks in parallel
(
  echo "🔍 Linting..." && npx lint-staged
) &
(
  echo "🎨 Format checking..." && npm run format:check
) &

# Wait for all background jobs
wait

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit checks failed"
  exit 1
fi

echo "✅ All pre-commit checks passed"
```

---

## 🚨 Common Issues & Solutions

### Issue: Hooks not running

```bash
# Reinstall husky
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Issue: Permission denied

```bash
# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Issue: Hooks running on every file

```bash
# Use lint-staged to only check staged files
# Add to package.json:
"lint-staged": {
  "*.{js,jsx}": ["eslint --fix", "prettier --write"]
}
```

### Issue: Slow hook execution

```bash
# Enable ESLint cache
# In package.json:
"lint": "eslint src --ext .js,.jsx --cache"

# Enable Prettier cache
"format": "prettier --write --cache \"src/**/*.{js,jsx}\""
```

---

## 📝 Complete Setup Checklist

```bash
# 1. Install dependencies
npm install --save-dev husky lint-staged prettier eslint @commitlint/cli @commitlint/config-conventional

# 2. Initialize Husky
npx husky-init && npm install

# 3. Create hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# 4. Create config files
# - .eslintrc.json
# - .prettierrc
# - .prettierignore
# - commitlint.config.js

# 5. Update package.json with lint-staged config

# 6. Test hooks
echo "console.log('test');" > test.js
git add test.js
git commit -m "test"  # Should fail

# 7. Commit the hook setup
git add .
git commit -m "chore: add pre-commit hooks with husky and lint-staged"
git push
```

---

## 🎯 Recommended Setup for This Project

For the Hattavick UI project, I recommend:

### Minimal Setup (Start Here)

1. **Husky** - Git hooks manager
2. **Lint-staged** - Run linters on staged files
3. **Prettier** - Code formatting
4. **Commitlint** - Enforce conventional commits

### Full Setup (Future)

Add these when ready:

1. **ESLint** - Already configured with CRA
2. **TypeScript** - Add type checking
3. **Bundle analyzer** - Monitor bundle size
4. **Dependency checks** - npm audit in pre-push

---

## 🔗 Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

---

**Ready to get started? Run the Quick Start commands above! 🚀**
