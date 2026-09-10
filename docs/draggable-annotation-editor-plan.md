# Annotation editor drag and resize plan

## Goals

Add a `:::` drag handle, and allow the floating window to be resized from any of its four edges or corners, so users can actively tidy their workspace when the editor covers page content, while preserving the existing auto-avoidance, temporary-hide, property-scrub, element-switch, rollback and send behaviors.

This change only affects the host-side `AnnotationEditor` ’s position interactions;iframe internal selection box, number markers, annotation data and model context stay unchanged.

## Research findings

- The handle uses 34×34px real button, exceeding WCAG 2.2 [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) of 24×24 CSS px minimum size, and reuses the existing top bar button spacing.
- During dragging, use Pointer Events, and after `pointerdown` and then call [`setPointerCapture()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture), ensuring they are still reliably received after the pointer leaves the handle or floating panel move/up; `pointercancel` and `lostpointercapture` all converge on the cancel path.
- Only the handle sets `touch-action: none`, `cursor: grab/grabbing` and temporary text-selection blocking. The whole card is not used as a drag area, avoiding conflicts with comment input, selection/adjust buttons, the scrollbar, and numeric dragging conflict.
- Resizing uses eight contiguous hit areas — four edges plus four corners: the four corners are 24×24px; edge hit areas are 12px, and with a coarse pointer expands to 20px.WCAG 2.2 treats a continuous region for selecting a value by spatial position as one target, so the edges are not split into densely packed small buttons.

## Top bar approach

- Only when `mode !== 'collapsed'` is displayed in the expanded state `:::`, placed between the comment input and the eye button.
- Button visual size 34×34px, with the graphic being 2×3 six-dot handle; the accessible label is“Move editor”.
- The default state uses `grab`; during an active drag it uses `grabbing`, the button takes on a light brand-blue background, the floating panel’s shadow tightens slightly, and no movement animation plays.
- If a click or movement does not exceed 3px does not change the position and does not open the attached panel.

## Position state

The edit session holds the following pure UI state, not written to the shared store, nor does it enter the annotation snapshot:

```ts
type EditorPosition = { left: number; top: number } | null
type EditorSize = { width: number; height: number } | null
```

- `null`  means automatic mode, continuing to use `placeFloatingEditor()` ’s target-avoidance result.
- Drag more than 3px  and beyond, the manual coordinates are recorded; move values are recorded in preview canvas coordinates.
- The manual position is preserved in“Select / Adjust”switching, target-level switching and temporary hide/restore; and it resets after closing the edit transaction, confirming, cancelling or changing pages.
- After the user positions it manually, scrolling the target element no longer pulls the editor back next to the target; preview size changes and editor height changes only clamp to the boundary.
- `EditorSize` only takes effect in the expanded state;Select and Adjust switching, target switching, hiding and restoring all preserve the size. The preferred width and height after release is written into the browser profile, and it is restored after closing and reopening or refreshing; the position is still released with the editing transaction.
- A small canvas only clamps the current render size and does not overwrite the saved preferred size; once the canvas is restored, the width and height chosen by the user continue to apply.

## Edge resizing

1. In the expanded state, provide `n / ne / e / se / s / sw / w / nw` eight hit zones; the collapsed state does not scale, avoiding conflicts with the compact pill’s interactions.
2. When resizing from the west or north edge, the opposite edge stays fixed while `left` / `top`, and it will not jump back after crossing the minimum value.
3. Minimum width 320px; Select minimum height 260px; Adjust minimum height 300px. When the canvas is smaller, the minimum value yields to the canvas size minus 8px.
4. The inner inspector scrolls using the remaining height; the top bar, bottom bar, and comment draft are not lost on resize.
5. Resizing likewise uses 3px activation threshold,Pointer Capture  and rollback on cancel; no click-to-zoom, keyboard zoom, inertia, or snapping is provided.

## Pointer interaction

1. Respond only to the primary button `pointerdown`, recording the pointer start point and the floating panel start point, and capturing the current pointer.
2. Once the movement exceeds 3px then enters `dragging`, updating the boundary-clamped floating panel coordinates in real time.
3. each frame clamps the position within the preview canvas, keeping at least 8px, keeping the full top bar always visible.
4. `pointerup` commits the final coordinates;`pointercancel` and `lostpointercapture` restore the drag start point.
5. Not crossing the threshold, `pointerup`  performs no action.

## Component changes

1. `floating-position.ts`
   - Extract `clampFloatingEditorPosition()`, uniformly handling manual coordinates, editor size changes and preview resize.
   - Keep `placeFloatingEditor()` as the automatic mode, without mixing the user’s offset into the target-avoidance algorithm.

2. `AnnotationEditor.tsx`
   - Add `DragHandleIcon`, the handle button, and pointer capture lifecycle.
   - Receives the current `EditorPosition` and an update callback, so that when a target switch causes the component to change key still retains the manual position.
   - Accepts `EditorSize`, renders the eight-direction resize layer, and commits the west/north-direction position changes and size changes are committed together.
   - While dragging, pause automatic reposition; hiding the eye FAB uses the top-right anchor of the final manual position.

3. `WebviewView.tsx`
   - Change `EditorPosition` into the existing local `EditorSession`, reused when switching targets, and released naturally when the transaction is closed.
   - `EditorSize` does not enter the shared store or annotation wire; it only writes a defensively validated profile local preferences.
   - Adds no new store action, without changing the annotation wire  data.

4. Keyboard and hierarchy selection
   - The element tree is a pointer picker and does not establish treeitem keyboard focus, nor does it show `focus-visible` highlight.
   - The parent, child, previous, and next keyboard shortcuts are captured centrally by the floating canvas; editable inputs still keep native text keyboard behavior.
   - iframe Page controls release focus when picked, so their native key actions and focus ring do not interfere with the hierarchy shortcuts.

5. Overlay separation
   - Use a stable three-layer shadow to improve edge definition on light pages.
   - Does not use `clip-path` clip the card, because it would clip away the outer shadow at the same time; the content continues to be `overflow: hidden` and 18px rounded-corner clipping.
6. `AnnotationEditor.module.css` / `locales.ts`
   - adds a handle, resize hit areas, a dragging state and a drop shadow, and removes the editor’s keyboard focus highlight.
   - Add Chinese product copy and the matching English locale; code comments continue to be in English.

## Boundary rules

- The safe margin follows the existing floating-window positioning of 8px; at all times `left >= 8`, `top >= 8`, and the right and bottom edges stay within bounds.
- When the floating window is larger than the available canvas, prioritize keeping the entire top bar visible and let the existing inspector scroll area stay tall; dragging must not push the close/Hide/move the controls out of the canvas by dragging.
- Dragging the floating window does not change the selected element, temporary styles, comment draft or editor scroll position.
- Property value scrubbing takes priority over floating-panel dragging; the two pointer capture lifecycles do not share state with each other.
- `prefers-reduced-motion` does not add snapping, bounce, or inertia; normal mode also does not use inertia, so the floating window does not overshoot the user’s expected drop point.

## Verification plan

- `floating-position.spec.ts`: clamping the manual position on all four sides, editor size changes, narrow canvases and very tall editors.
- `annotation-editor.spec.tsx`: the handle and the eight resize zones only appear in the expanded state;3px threshold;pointer capture; drag/resize commit;cancel/lost capture rollback; after hiding, it is restored from the manual geometry.
- `panel.spec.tsx`: switching targets, selecting/the position is preserved in adjust mode and when temporarily hidden; it resets on confirm, cancel, and page change; shared annotation state is unchanged.
- `webview.e2e.spec.ts`: drag to different positions in a real preview, resize from the corners, verify the minimum size and boundaries, and confirm the property controls can still be scrubbed.
- After implementing, run `pnpm check` and `pnpm test:e2e`, then start the real DSH preview for manual acceptance.

## Prototype

- `docs/draggable-annotation-editor-prototype.svg`
