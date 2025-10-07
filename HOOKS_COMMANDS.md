# Pre-Commit Hooks - Command Reference

Quick reference for all hook-related commands.

## 🚀 Initial Setup

```bash
# Full installation (one-time setup)
npm install --save-dev husky lint-staged prettier @commitlint/cli @commitlint/config-conventional
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## 📝 Daily Usage

### Running Checks Manually

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without changing files
npm run format:check

# Run all checks (add to package.json scripts)
npm run lint && npm run format:check
```

### Committing Code

```bash
# Normal commit (hooks run automatically)
git add .
git commit -m "feat: add new feature"

# Bypass hooks (use sparingly!)
git commit --no-verify -m "emergency fix"
git commit -n -m "hotfix"

# Test commit message format without committing
echo "feat: test message" | npx commitlint
```

## 🔧 Troubleshooting Commands

### Hooks Not Working

```bash
# Reinstall Husky
rm -rf .husky
rm -rf node_modules/.husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Verify hooks are installed
ls -la .husky/
```

### Cache Issues

```bash
# Clear ESLint cache
rm -rf node_modules/.cache
rm .eslintcache

# Clear Prettier cache
rm -rf node_modules/.cache/prettier

# Clear all caches and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Testing Hooks

```bash
# Test pre-commit hook
echo "console.log('test');" > test-file.js
git add test-file.js
git commit -m "test: should warn about console.log"
rm test-file.js

# Test commit message validation
git commit --allow-empty -m "bad message format"  # Should fail
git commit --allow-empty -m "feat: good message"  # Should pass

# Test lint-staged in isolation
npx lint-staged
```

## 📦 Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .js,.jsx --cache",
    "lint:fix": "eslint src --ext .js,.jsx --fix --cache",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,scss,md}\"",
    "precommit": "lint-staged",
    "validate": "npm run lint && npm run format:check"
  }
}
```

## 🎯 Common Workflows

### Setting Up on a New Machine

```bash
# Clone repo
git clone <repo-url>
cd <repo-name>

# Install dependencies (will run prepare script automatically)
npm install

# Verify hooks are installed
ls -la .husky/
```

### Updating Hooks Configuration

```bash
# Edit .husky/pre-commit
nano .husky/pre-commit

# Edit commitlint config
nano commitlint.config.js

# Edit ESLint config
nano .eslintrc.json

# Edit Prettier config
nano .prettierrc

# Test changes
git commit --allow-empty -m "test: testing updated hooks"
```

### Temporarily Disable Hooks

```bash
# Skip pre-commit and commit-msg hooks
HUSKY=0 git commit -m "skip hooks"

# Or use --no-verify flag
git commit --no-verify -m "bypass hooks"

# For all git commands in current session
export HUSKY=0
git commit -m "hooks disabled"
unset HUSKY
```

## 🔍 Debugging

### View Hook Output

```bash
# Run pre-commit hook manually
.husky/pre-commit

# Run commit-msg hook manually
echo "feat: test" > .git/COMMIT_EDITMSG
.husky/commit-msg .git/COMMIT_EDITMSG
```

### Check Hook Execution

```bash
# Enable verbose output
HUSKY_DEBUG=1 git commit -m "feat: test"

# Check if hooks are being called
echo "echo 'Pre-commit running'" >> .husky/pre-commit
git commit --allow-empty -m "test: debug"
```

### Verify Installed Packages

```bash
# Check if packages are installed
npm list husky lint-staged prettier @commitlint/cli

# Check versions
npm list --depth=0 | grep -E "husky|lint-staged|prettier|commitlint"
```

## 📊 Performance Optimization

```bash
# Enable ESLint caching
npm run lint -- --cache

# Clear cache if having issues
rm .eslintcache

# Run Prettier with cache
prettier --write --cache "src/**/*.{js,jsx}"

# Check what lint-staged will run
npx lint-staged --debug
```

## 🆘 Emergency Fixes

### Complete Reset

```bash
# Nuclear option - complete reset
rm -rf .husky
rm -rf node_modules
rm package-lock.json
rm .eslintcache
npm install
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Disable All Hooks Globally

```bash
# Create .huskyrc in home directory
echo 'HUSKY=0' > ~/.huskyrc

# Or set environment variable
export HUSKY=0  # Add to .bashrc or .zshrc

# Re-enable later
unset HUSKY
# Or remove ~/.huskyrc
```

## 📚 Configuration Files Reference

```
.
├── .husky/                    # Git hooks
│   ├── pre-commit            # Runs before commit
│   └── commit-msg            # Validates commit message
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .prettierignore           # Files to ignore in Prettier
├── commitlint.config.js      # Commit message rules
└── package.json              # Scripts and lint-staged config
```

## 🎓 Learning Resources

```bash
# Husky documentation
open https://typicode.github.io/husky/

# Lint-staged documentation  
open https://github.com/okonet/lint-staged

# Commitlint documentation
open https://commitlint.js.org/

# Conventional commits
open https://www.conventionalcommits.org/
```

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Check hooks exist
[ -f .husky/pre-commit ] && echo "✅ pre-commit exists" || echo "❌ Missing"
[ -f .husky/commit-msg ] && echo "✅ commit-msg exists" || echo "❌ Missing"

# 2. Check hooks are executable
[ -x .husky/pre-commit ] && echo "✅ pre-commit executable" || echo "❌ Not executable"
[ -x .husky/commit-msg ] && echo "✅ commit-msg executable" || echo "❌ Not executable"

# 3. Check packages installed
npm list husky lint-staged prettier @commitlint/cli 2>/dev/null && echo "✅ All packages installed" || echo "❌ Missing packages"

# 4. Test hooks work
git commit --allow-empty -m "feat: test hooks" && echo "✅ Hooks working" || echo "❌ Hooks failed"
```

---

**Need more help? See [PRE_COMMIT_HOOKS.md](./PRE_COMMIT_HOOKS.md) for full documentation.**
