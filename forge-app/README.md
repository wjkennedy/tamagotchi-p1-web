# Tamagotchi Forge App Scaffold

This scaffold powers the Jira issue panel, project page, and dashboard gadget surfaces for the Tamagotchi experience.

## Permissions

- Required scopes: `read:jira-work` (to read issue/project metadata) and `read:jira-user` (to render user-aware pet context).
- Optional write scopes (opt-in):
  - `write:jira-work` if you want to persist pet care actions as comments, transitions, or issue updates.
  - `write:jira-user` only if you later store per-user preferences via Jira APIs.

Keep optional scopes disabled until you add write behavior.

## Storage keys

- Per-user pet state: `PetState:{cloudId}:{accountId}`
- Optional project pet state: `ProjectPetState:{cloudId}:{projectId}`
