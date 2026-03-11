# Project Rules for Superpowers

## Project Overview

This is a Hugo-based static blog site using the PaperMod theme.

- **Project Type**: Hugo Static Site Generator
- **Theme**: PaperMod
- **Language**: Chinese (zh-cn)
- **Base URL**: https://cqkxxc.github.io/

## Technology Stack

- **Static Site Generator**: Hugo
- **Theme**: PaperMod (Git submodule)
- **Content Format**: Markdown
- **Deployment**: GitHub Pages (via GitHub Actions)

## Project Structure

```
.
├── archetypes/          # Content templates
├── content/             # Blog posts and pages
│   ├── posts/          # Blog articles
│   ├── about.md        # About page
│   └── search.md       # Search page
├── docs/               # Documentation
├── layouts/            # Custom layouts
├── static/             # Static assets
│   └── live2d-widget/  # Live2D widget
├── themes/             # Hugo themes
│   └── PaperMod/       # PaperMod theme (submodule)
├── .github/workflows/   # CI/CD
├── hugo.toml           # Hugo configuration
└── .trae/              # Trae/Superpowers configuration
    ├── skills/         # Superpowers skills
    └── rules/          # Project rules
```

## Build Commands

```bash
# Development server
hugo server -D

# Build site
hugo --minify

# Build with drafts
hugo --buildDrafts
```

## Content Guidelines

- Posts are written in Markdown
- Content language: Chinese (zh-cn)
- Posts stored in `content/posts/`
- Use front matter for metadata (title, date, tags, etc.)

## Development Workflow

1. Create new content: `hugo new content posts/my-post.md`
2. Edit content in `content/posts/`
3. Test locally: `hugo server -D`
4. Commit and push to deploy

## Testing

- No automated tests configured
- Manual testing via local Hugo server
- Verify rendering before deployment

## Linting/Type Checking

- No linting configured for this project
- Hugo provides built-in validation

## Notes

- This is a content-focused static site
- No complex build steps beyond Hugo
- Deployment is automated via GitHub Actions
