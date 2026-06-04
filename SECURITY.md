# Security Policy

## Supported versions

This project is currently in active MVP development. Security fixes are applied to the main branch.

## Reporting a vulnerability

If you find a vulnerability in this project, please do not open a public issue with sensitive details.

Instead, contact the maintainer privately.

Maintainer: Yaroslav / xxxoness

## Security scope

Important areas:

- Admin authentication
- Supabase service role usage
- Environment variables
- Product/order data handling
- Contact/order forms
- Cookie consent and analytics loading
- Legal and personal-data related flows

## Secrets policy

Never commit real secrets to this repository.

Do not commit:

- `.env`
- `.env.local`
- production database URLs
- Supabase service role keys
- admin password hashes
- session secrets
- analytics private tokens
- API keys

Use `.env.example` only for empty example variables.

## Deployment notes

Production secrets must be configured in the hosting provider, for example Vercel environment variables.

Server-only keys must never be exposed to the browser.