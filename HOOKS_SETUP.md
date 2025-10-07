# Pre-Commit Hooks Installation

Follow these steps to set up pre-commit hooks for code quality:

## Quick Install

```bash
# 1. Install dependencies
npm install --save-dev husky lint-staged prettier @commitlint/cli @commitlint/config-conventional

# 2. Initialize Husky
npx husky-init && npm install

# 3. Set up pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# 4. Set up commit message validation
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# 5. Test it works
git add .
git commit -m "test: testing hooks"
```

## What Gets Checked

### Pre-Commit (Automatic)
- ✅ ESLint fixes JavaScript/React issues
- ✅ Prettier formats your code
- ⚠️  Warns about console.log (doesn't block)
- ❌ Blocks debugger statements

### Commit Message (Validates Format)
- Must follow: `type(scope): subject`
- Valid types: feat, fix, docs, style, refactor, perf, test, chore, revert

## Manual Setup

If automatic setup fails, copy the example files:

```bash
cp .husky/pre-commit.example .husky/pre-commit
cp .husky/commit-msg.example .husky/commit-msg
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

## Troubleshooting

### Hooks not running?
```bash
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Need to bypass hooks?
```bash
git commit --no-verify -m "emergency fix"
```

## Full Documentation

See [PRE_COMMIT_HOOKS.md](./PRE_COMMIT_HOOKS.md) for complete documentation.
