# Project Coding Guidelines (Strict)

## Structure & Design

- Split by concern; keep functions, classes, modules focused.
- Follow existing structure, naming, and patterns.
- **Use ArkUI first**, then DaisyUI, then Tailwind.
- Check **MCP server** for availability before adding components.

## Naming

- Clear, self-explanatory names; slightly longer is fine.
- Be consistent with project conventions and UI frameworks.

## Code Quality

- No dead code, unused imports, or scaffolding.
- Comment only non-obvious logic.
- **Support dark/light mode**; avoid hardcoded colors.

## Implementation

- Concise, robust, single clean solutions.
- Combine UI frameworks carefully; maintain consistency.
- Prefer theme tokens/variables for styles.

## Safety & Reliability

- Code must be predictable and readable.
- **File changes:** use `_temp` versions first, then replace originals.
