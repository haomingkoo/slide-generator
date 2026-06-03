# Security

This project is a local, agent-driven slide-generation workflow. It is not yet a hosted service.

## Sensitive Inputs

Do not commit private decks, client data, credentials, proprietary source material, or generated project artifacts.

Generated project folders are ignored by default:

```txt
projects/*/work/
projects/*/deck/
projects/*/exports/
projects/*/qa/
```

## Reporting Issues

For now, report security-sensitive issues privately to the repository owner rather than opening a public issue.

## Current Scope

The current codebase includes local validation scripts. It does not yet include:

- a web server,
- authentication,
- remote execution,
- package publishing,
- external API calls.

Future integrations with MCPs, browser tooling, PDF parsing, PPTX tooling, or hosted workflows should include a separate threat review.
