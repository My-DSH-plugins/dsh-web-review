# CSS Numeric values / Composite keyword input design

## Goals

for properties that accept both numeric values and CSS adds a dropdown arrow on the right. Users can still type `320px`, `50%`, `var(...)` and any other valid values, and can also choose from the compact dropdown menu `auto`, `normal`, `none` and other common keywords.

This change only enhances the input method of the existing property editor; it does not change the editable property whitelist, temporary preview, rollback, annotation snapshot, or shared store or the model context format. Those that are already pure enums, `display`, `position`, `overflow` and other controls continue to use the existing `OptionMenu`; pure numeric properties do not show the dropdown caret.

## Control interaction

Composite controls keep the existing 126px width, divided into three areas:

1. Left 30px The drag handle keeps the existing numeric scrub behavior.
2. the middle is an editable text input that preserves units,CSS functions, custom property references, and Escape rollback.
3. A separate drop-down triangle button is added on the right; it only renders for numeric controls configured with keyword suggestions.

After clicking the dropdown arrow, DSH `Menu` in the host `document.body`  opens a compact menu aligned to the right. Selecting a keyword calls the existing `onChange`, so it continues through the same CSS validity check,iframe live preview,changed state and per-item reset chain. When the current value matches a suggestion a selection mark is shown; when the current value is numeric or is not among the suggestions, no additional“Current value” menu item.

Keyboard and focus rules:

- The input’s ArrowUp / ArrowDown, Shift ×10, Alt ×0.1 and Escape  behavior is unchanged.
- The dropdown caret is a focusable button with `aria-haspopup="menu"`, `aria-expanded` and a localized name.
- Escape, clicking outside, or selecting closes the menu; after a selection, focus returns to the dropdown arrow.
- Keyword values can still be dragged using the existing fallback start dragging; the first numeric adjustment converts it into a value with a unit, and values that were not touched are never silently rewritten.
- While the menu is open, Escape only closes the menu and does not cancel the entire annotation transaction.

## Keyword list

The list covers the current allowlist ’s all“numeric controls + common non-numeric CSS value”properties. The universal cascade keywords `inherit`, `initial`, `unset`, `revert`, `revert-layer` do not appear in every menu;`calc(...)`, `clamp(...)`, `var(...)`, `fit-content(...)` and other parameterized values are still entered through the input field.

| Property | Dropdown suggestions |
| --- | --- |
| `font-size` | `xx-small`, `x-small`, `small`, `medium`, `large`, `x-large`, `xx-large`, `xxx-large`, `smaller`, `larger` |
| `line-height` | `normal` |
| `letter-spacing` | `normal` |
| `width`, `height` | `auto`, `min-content`, `max-content`, `fit-content` |
| `min-width`, `min-height` | `auto`, `min-content`, `max-content`, `fit-content` |
| `max-width`, `max-height` | `none`, `min-content`, `max-content`, `fit-content` |
| `top`, `right`, `bottom`, `left` | `auto` |
| `z-index` | `auto` |
| `gap`, `row-gap`, `column-gap` | `normal` |
| `margin-top`, `margin-right`, `margin-bottom`, `margin-left` | `auto` |
| `border-width` | `thin`, `medium`, `thick` |

The following numeric controls do not get a dropdown:`opacity`, four-side `padding`, `border-radius`, as well as shadow / transform numeric components inside composite controls. In the current editing model they have no commonly used non-numeric values that need quick selection. Pure enum controls already have a dropdown caret and do not need to migrate to composite input.

The keyword scope is based on CSSWG of [CSS Sizing](https://drafts.csswg.org/css-sizing-3/), [CSS Positioned Layout](https://drafts.csswg.org/css-position/), [CSS Box Model](https://drafts.csswg.org/css-box-4/), [CSS Box Alignment](https://drafts.csswg.org/css-align/), [CSS Fonts](https://drafts.csswg.org/css-fonts/) and [CSS Backgrounds and Borders](https://drafts.csswg.org/css-backgrounds/) syntax is the baseline; the menu only offers stable, commonly used, parameterless shortcuts, and the input box remains the full CSS value fallback entry point.

## Files that need changes

### Product code

1. `src/client/property-editor-config.ts`
   - lets `number(...)`  metadata accepts keyword suggestions, and all composite properties are configured per the table above.
   - Keep `menu` ’s limited enumeration and `number` ’s keyword suggestion semantics stay distinguishable, avoiding rendering pure enum controls as text inputs by mistake.
   - Provides a single configuration source for composite controls such as size and spacing, and forbids repeating hardcoded keywords inside components.

2. `src/client/InspectorControls.tsx`
   - Extend `ScrubNumber`: adds optional suggestions and localized menu button labels.
   - On the right side of the numeric input, add DSH `Menu` trigger button, handling open, selectedId, close, focus return and Escape isolation.
   - Extend `BoxModelControl`, pass margin of `auto` pass suggestions to the four side inputs;padding no suggestions are passed.
   - Keep `parseNumeric`, scrub fallback, invalid and focus-entry Escape rollback logic.

3. `src/client/CompositeControls.tsx`
   - Let the inner `Cell` and `SizeControl` pass through keyword suggestions, so that W/H Both inputs show the same kind of size keyword.
   - Radius, Shadow, Transform ’s internal numeric components stay unchanged.

4. `src/client/AnnotationEditor.tsx`
   - `renderControl` pass the suggestions from the numeric property metadata to `ScrubNumber`.
   - Size, margin  and other composite rows property registry read suggestions and pass them to the composite control.
   - Selecting a keyword still uniformly calls `updateProperty`, without adding a second set of preview or validation state.

5. `src/client/InspectorControls.module.css`
   - Reserve space for the right-side chevron 22–24px, adjust the input field’s right padding, while keeping the left 30px scrub area.
   - Add, for the trigger button, hover, focus-visible, open and disabled styles, all using the existing DSH token.
   - Cover normal rows, narrow containers,Size dual-field and BoxModel two-axis layout, ensuring 320px width without overflowing.

6. `src/client/locales.ts`
   - Add“Choose preset” Chinese and English accessibility strings; visible menu items continue to use CSS original values; keywords are not translated.

### Testing and visual validation

7. `tests/property-editor-config.spec.ts`
   - Pin the complete property →  keyword mapping.
   - Assert that purely numeric properties have no suggestions and that purely menu properties keep their original kind.

8. `tests/inspector-controls.spec.tsx`
   - Covers chevron rendering with / dropdown caret rendering when there are no suggestions.
   - Cover opening the menu with the current numeric value, keyword selection,selected state, click-to-select / Escape closing, and focus return.
   - overlay menu Escape does not bubble up to the outer editor, and that keyword values continue to pass through fallback scrub converted to numeric values.
   - Cover BoxModel the four sides’ `auto` selection still follows the existing axis / all-linked rules.

9. `tests/composite-controls.spec.tsx`
   - Cover SizeControl of W/H the W/H suggestion menus of SizeControl and the value updates after the width/height link

10. `tests/annotation-editor.spec.tsx`
    - on a real iframe select on the element `width: auto`, `max-width: none` or `line-height: normal`, asserting live styles,changed / reset, Confirm diff and Cancel precise rollback.
    - assert that pure numeric properties have no dropdown arrow, while pure enum `display` still uses the original menu.

11. `tests/webview.e2e.spec.ts` and `tests/visual-shot.ts`
    - E2E Open the real property editor, select a keyword from the menu on the right, and confirm the page preview matches the final structured change.
    - Add wide-screen and narrow-screen screenshots of the open menu state to verify portal the menu is not editor overflow clipping and does not escape the viewport.

### Documentation

12. `docs/figma-property-editor-plan.md`, the root `README.md` and package README
    - Updated the original“semantic presets”’s design intent was updated to the composite input behavior that has already shipped, noting that manually entered CSS values are always preserved.
    - Do not modify wire, model context, or known-limitations documentation, because those contracts have not changed.

## Parts explicitly left unchanged

- `annotation-properties.ts`: the property allowlist is unchanged.
- `live-patch.ts`: both keywords and numeric values continue to pass through the existing preview as strings /  rollback ledger.
- `stores.ts`, annotation contract, node route, context formatter: no state or fields are added.
- iframe picker, element hierarchy selection, and overlay positioning: not part of this feature.
- Harness slot, store seat and injection relationships: unchanged; this time it is local display state inside the host component.

## Acceptance criteria

- Only numeric CSS controls show a drop-down triangle on the right.
- Users can freely switch within the same control between manually entered numeric values / CSS text and dropdown keywords, and the raw string is not normalized by no-op handling.
- Dropdown selection previews immediately, supports per-item reset, can Cancel precise rollback, and only after Confirm then, after Confirm, enter the existing structured diff.
- Pure enum, pure numeric and composite effect controls have no visual or behavioral regressions.
- Keyboard, focus, narrow-screen, and portaled menu are all usable; the menu Escape does not accidentally cancel the annotation.
- After implementation, pass `pnpm check` and `pnpm test:e2e`, and complete a real DSH Preview manual acceptance testing.

## Prototype

- `docs/css-keyword-menu-prototype.svg`
