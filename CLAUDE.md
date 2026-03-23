# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt 4 application (Vue 3 + Vue Router 5) bootstrapped from the Nuxt minimal starter template. Uses ES modules (`"type": "module"`).

## Commands

- **Dev server**: `npm run dev` (starts on http://localhost:3000)
- **Build**: `npm run build`
- **Preview production build**: `npm run preview`
- **Static generation**: `npm run generate`
- **Prepare (post-install)**: `npm run postinstall` (runs `nuxt prepare` to generate `.nuxt/` types)

## Architecture

This follows standard Nuxt 4 conventions with file-based routing and auto-imports:

- `app/` — Application source (app.vue is the root component)
- `nuxt.config.ts` — Nuxt configuration (devtools enabled, compatibility date 2025-07-15)
- `.nuxt/` — Auto-generated types and build artifacts (gitignored)
- `.output/` — Production build output (gitignored)

Nuxt auto-imports Vue APIs, composables, and components — no manual imports needed for standard Vue/Nuxt utilities.

## Workflow Rules

1. 完成功能后必须进行完备的检验和测试（至少执行 `npm run build` 确认构建通过），确认没有问题后直接提交并 push 到远程仓库，无需额外询问。
