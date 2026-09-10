# Annotation Editor Focus and Temporary Hide Plan

## Goals

Solve the problem of the property editor obscuring the page under inspection, while keeping the existing annotation transaction, live preview, rollback, and send pipeline unchanged.

This time only the host-side `AnnotationEditor` overlay.iframe inside the iframe, the selection outline and numbered markers, the top annotation toolbar and the bottom annotation pill do not hide with the editor, avoiding any change to the existing annotation state machine.

## Interaction states

### 1. Normal state `visible`

- The editor is fully visible.
- Add in the editor’s upper-right area a“Temporarily hide editor”eye button.
- Numeric properties are still dragged horizontally with the existing drag handle.

### 2. Drag-focus state `scrubbing`

- pointer Moving beyond the existing 3px threshold, it enters,pointer up / cancel / and exits on lost capture.
- The currently dragged `ScrubNumber` Keep 100% opaque, with size, color and position unchanged.
- The rest of the editor is hidden completely and immediately; those areas do not respond to the pointer during dragging, preventing accidental input.
- The editor’s white backing, borders, and shadow must disappear completely while dragging; the inspector, top input area, and bottom action area must not leave or layer any white background, ensuring the page behind is directly visible.
- The drag-focus state enters and exits immediately, with no hide or restore animation.
- pointer cancel continue to follow the existing rule: restore the property values from when the drag started.

### 3. Temporarily hidden state `hidden`

- Clicking the eye button immediately collapses the editor card.
- Only a single 36×36px ’s white circular eye button, placed near the editor’s original anchor and clamped within the preview bounds.
- Clicking again expands it in place; comments, property drafts, scroll position,dirty/invalid state and the temporary page preview are all preserved.
- Hiding is not the same as Cancel, without rolling back, confirming or clearing the comments.
- `Escape`  still cancels the entire edit transaction while hidden, consistent with the current behavior.

## Component changes

1. `ScrubNumber`
   - Added an optional `onScrubChange(active: boolean)`.
   - only after exceeding 3px threshold is exceeded, report `true`; all exit paths uniformly report `false`.
   - Use a stable attribute name to identify the control currently being dragged, avoiding state conflicts between multiple numeric controls.

2. `AnnotationEditor`
   - Add local display state:`visibility: 'visible' | 'hidden'` and `activeScrub: EditableStyleProperty | null`.
   - add stable `data-*` markers.
   - use the same state to drive visual de-emphasis,pointer-events, the eye button and accessibility attributes.
   - The hidden round button reuses the existing editor positioning result and does not write display state into the shared store.

3. Styles
   - While dragging, use a single unified rule to hide `.editor`  of the entire subtree, then let `[data-scrub-active]`  row and its descendants override the inherited `visibility`. This also covers section divider, inspector borders, and scrollbars, with no need to maintain a per-item dimmable list.
   - The root editor’s background, border, and shadow are cleared independently; the active row keeps its original size, color, and position.
   - Drag focus and the eye collapse both toggle immediately; normal hover/expand animations still follow `prefers-reduced-motion`.

## Accessibility and edge-case behavior

- The eye button uses `aria-pressed`, the visible-state text“Temporarily hide editor”, and the hidden-state label“Show editor”.
- The drag focus state is only a transient display state; it is not sent to the model and does not enter the annotation snapshot.
- After being hidden, the round button stays keyboard-focusable,focus ring is not clipped.
- unmount, Cancel, Confirm and on page change, ensure cleanup of active scrub; no hidden state may be left behind.

## Verification plan

- `inspector-controls.spec.tsx`: 3px threshold,pointer up, pointer cancel, lost pointer capture all produce the correct start/end notifications.
- `annotation-editor.spec.tsx`: while dragging, the active control is 100%, all other areas are fully hidden and restored when it ends; hiding/show preserves the draft and temporary styles;Escape still rolls back.
- `panel.spec.tsx`: the hidden state does not change pick, comment, send  state.
- Browser E2E: real drag attributes, asserting that only the active row is visible,divider/the scroll container is invisible, the round button is restored, and Cancel precise rollback.
- Finally run `pnpm check`; since this is a visible UI changes, then run `pnpm test:e2e`.

## Prototype mapping

SVG The prototype consists of three boards: normal state, drag-focus state, and temporarily hidden state:

- `docs/annotation-editor-visibility-prototype.svg`
