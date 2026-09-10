# Element Hierarchy Selector Plan

## Goals

In the existing annotation overlay, add a“Adjust”alongside“Select” entry point so users can switch target elements along the DOM switch the target element along the DOM hierarchy, while also providing a keyboard navigation close to Figma keyboard navigation.

See the prototype at [`element-selector-ui-prototype.svg`](./element-selector-ui-prototype.svg).

## Product interactions

### Collapsed state

- After a page element is selected, the left side of the floating panel shows, in order,“Select”and“Adjust”two circular buttons, with the comment input and confirm button kept on the right.
- The two panels are mutually exclusive: opening“Select”will collapse“Adjust”, opening“Adjust”will collapse“Select”.
- Switching the target element does not submit or create an annotation; it updates the current edit transaction’s target, the page’s rounded selection outline, the overlay anchor and the pending snapshot.
- A compact current-target info bar stays pinned below the comment input;“Adjust”remains visible after expanding; it is only hidden when the element tree is expanded.

### Selector expanded state

- At the top is a row of four compact actions:“Child / Parent / Previous / Next”. Each item shows a subdued keycap hint at its end, with no redundant direction icons layered on top.
- Below is a browsable element tree of the current document. Each row consists of an expand arrow, an element type icon,tag, and“direct text summary”or“Child element count”composed of.
- The current element uses DSH Business-blue light fill, blue outline and a left accent bar, with no extra status pill; the ancestor path expands automatically and the current row is scrolled into view.
- Rows with element children can be expanded/collapse; clicking any row immediately switches the current target. Text nodes do not get their own row; short text is folded into the summary of its owning element.
- `html`, `body` can appear in the tree and be selected; host-injected marker/chrome do not enter the tree. Invisible elements are still shown, but rendered with dimmed text.
- When a boundary is reached, the corresponding action button is disabled: with no child elements, disable“Enter”, reaching `body`/when the configured root node is reached, disable“Parent”, and disabled when there is no next element sibling“Next”.

### Keyboard shortcuts

- `Enter`: move into the first element child.
- `\` (`KeyboardEvent.code === 'Backslash'`: go back to the parent element.
- `Shift+Tab` / `Tab`: in the canvas focus surface, switch to the previous / next element sibling, and prevents the browser’s default focus movement.
- When the selector is collapsed, focus moves into the host-owned canvas focus surface after an element is selected; the page’s own `window` / `document` listeners do not receive these shortcuts.
- After the selector is expanded,`Enter` / `Backslash` / `Shift+Tab` / `Tab` still perform the four hierarchy switches;`↑` / `↓` moves through visible rows,`→` expands or enters a child,`←` collapse or return to the parent,`Space` selects the currently focused row.
- When the selector is collapsed, the current-target info bar stays visible; each successful switch applies only a brief directional animation to the target text, while child/the parent level uses the vertical direction, and the previous/next use the horizontal direction, and the boundary stays as it is,reduced-motion only fades in and out.
- The page selection box is a reusable 6px rounded overlay: it moves between the old and new rectangles when the target switches, and follows immediately on scroll and size changes,reduced-motion does not move position.
- Input fields, textareas,`contenteditable`, menus/Shortcuts are not intercepted during menus, popups or IME composition. In the comment input, `Enter` continues to confirm the annotation, while normal UI of `Tab` continues to handle accessible focus navigation.

## States and boundaries

- `AnnotationEditor` Add `mode: 'collapsed' | 'select' | 'adjust'` Local UI state;DOM expansion state is also kept local to the editor and does not enter the shared store.
- `WebviewView` continues to own live `Element` and patch ledger, and provide the editor with `onSelectElement(next)`; the element-switching logic is handled centrally here.
- before switching targets, restore the old target’s current transaction preview values; then create a new patch, snapshot and the edit transaction. Comment drafts are kept, while style/text changes are cleared, to avoid mapping the old element’s CSS diff be mismatched onto the new element.
- If a committed annotation’s target is switched, the annotation is treated as re-anchored: the original target reverts to the committed state it had before entering edit mode, and the new target starts from a clean baseline; only after confirming again does it update store.
- The tree only holds the current iframe document’s short-lived `Element` references. Navigation,iframe reload, and are all released when the editor closes or unmounts.

## Implementation breakdown

1. Add a pure DOM navigation module `element-navigation.ts`: filter out host chrome, computing the parent/first element child/next element sibling, and generating the tree row label, and provides unit-testable boundary behavior.
2. Extend picker surface: allow the host to use the same `select(element)` update the highlight; without cramming tree logic into iframe injection script.
3. In `WebviewView` implement the atomic `switchEditorElement`: roll back the old patch, creating a new patch/snapshot, and update selection and editor positioning.
4. Add `ElementSelector.tsx` and CSS Module: toolbar, expandable tree, current-item styling, automatic ancestor expansion and scroll positioning; all copy goes into `locales.ts`.
5. Extend `AnnotationEditor`: add a select button, mutually exclusive panel state and a target-switch callback, and extend the height/width measurement to cover the selector state.
6. Integrate into the host canvas focus surface and element tree Figma -style hierarchy shortcuts, and the element tree also implements roving-tabindex  and arrow-key navigation;iframe capture serves only as a same-origin fallback after the page is explicitly refocused.
7. Update README user documentation, but does not change the structured annotation wire, model context, and the shared store shape.

## Verification plan

- Pure functions: first child element, parent element, previous/next sibling, ignoring text nodes and injected chrome, the root node and no-sibling boundaries, and tree summary truncation.
- Components: the select button is visible;“Select/Adjust”are mutually exclusive; ancestors expand automatically; tree rows expand/collapse; clicking a row or any of the three buttons switches the target; disabled boundaries behave correctly.
- Keyboard: the canvas focus surface and the in-tree `Enter`, `Backslash`, `Shift+Tab`, `Tab`; arrow keys inside the tree, expand/collapse and Space selection; text inputs, menus,IME  are not hijacked.
- transaction: precisely roll back the old element before switching; the new target has no old diff; the comment is preserved; after confirming snapshot  points to the new element; after cancel, both sides DOM are both restored.
- E2E: in demo card, from `button` back to `.card`, enter `h3`, switch between siblings, and verify the persistent target info bar, the movement animation of the single rounded selection box, overlay repositioning, tree syncing, and the final annotation target; the page pre-registers keyboard listeners during the capture phase to prove that the normal canvas flow does not leak shortcuts to the page, and to verify the in-tree hierarchy shortcuts and arrow-key navigation.
- Full gate:`pnpm check`, followed by `pnpm test:e2e`  and narrow-width/dark theme visual screenshots.
