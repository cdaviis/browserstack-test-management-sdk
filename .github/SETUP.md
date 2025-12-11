# GitHub Actions Setup

## Publishing to npm

This workflow automatically publishes the package to npm when a GitHub release is created.

### Required Secret

You need to add an **NPM_TOKEN** secret to your GitHub repository:

1. **Create an npm access token:**
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Click on your profile → **Access Tokens**
   - Click **Generate New Token** → **Automation** (or **Classic**)
   - Copy the token (you won't be able to see it again!)

2. **Add the secret to GitHub:**
   - Go to your repository on GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click **Add secret**

### How It Works

1. When you create a GitHub release, the workflow triggers
2. It runs linting, builds the package, and runs tests
3. If all checks pass, it publishes to npm with `--access public`

### Manual Publishing

If you prefer to publish manually:

```bash
npm login
npm publish --access public
```

### Publishing to GitHub Packages Instead

If you want to publish to GitHub Packages instead of npm, change the workflow:
- Set `registry-url: https://npm.pkg.github.com/`
- Use `NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}` (no secret needed)
- Update `package.json` to include the `publishConfig` field

