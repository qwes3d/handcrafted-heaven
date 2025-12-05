# Accessibility (A11y) Features

This document outlines the accessibility improvements implemented in Handcrafted Haven to ensure users with disabilities can navigate and use the site effectively.

## ✅ Implemented Features

### 1. **Semantic HTML & ARIA Landmarks**
- `<header role="banner">` — Main header/navigation area
- `<nav aria-label="...">` — Semantic navigation with descriptive labels
- `<main id="main-content" role="main">` — Primary content area
- `<footer role="contentinfo">` — Footer with content info role
- Proper use of `<form>`, `<label>`, `<button>` elements

### 2. **Skip Links**
- "Skip to main content" link at top of page
- Visible on focus for keyboard users
- Helps users bypass repetitive navigation
- Apply `.sr-only` class (screen reader only) and `.focus:not-sr-only` to show on focus

### 3. **ARIA Attributes**
- `aria-label` — Descriptive labels for icon buttons (e.g., cart icon)
- `aria-expanded` — Toggle states (mobile menu)
- `aria-haspopup="true"` — Dropdown indicators
- `aria-required="true"` — Form validation
- `aria-live="polite"` — Dynamic content updates (cart count)
- `aria-hidden="true"` — Hide decorative icons from screen readers
- Form associations with `htmlFor` on all `<label>` elements

### 4. **Keyboard Navigation**
- All interactive elements are keyboard accessible
- Focus indicators: `.focus:outline-none .focus:ring-2 .focus:ring-indigo-500`
- Focus order follows visual hierarchy
- Tab order is logical and not reversed
- Mobile menu has `aria-controls="mobile-menu"` to link button to menu

### 5. **Focus Management**
- Visible focus rings on all buttons, links, and form inputs
- Indigo focus ring (`.focus:ring-indigo-500`) applied globally
- Mobile toggle has focus styles: `focus:outline-none focus:ring-2 focus:ring-indigo-500`

### 6. **Form Accessibility**
- All form inputs have associated `<label>` elements with `htmlFor` attributes
- Required fields marked with `aria-required="true"` and `*` symbol with `aria-label="required"`
- Input IDs match label `htmlFor` (e.g., `id="search-products"` with `<label htmlFor="search-products">`)
- Proper form structure in:
  - Login/Register pages
  - Contact forms
  - Review forms
  - Product forms

### 7. **Color Contrast**
- Text uses `text-gray-900` for dark text on white backgrounds (WCAG AAA compliant)
- Links: `text-indigo-600` on white (WCAG AA compliant)
- Form inputs: `text-gray-900` (high contrast)
- Placeholder text: `placeholder-gray-500` (sufficient contrast, distinct from input text)

### 8. **Visual Indicators**
- Icons paired with text labels where possible
- Cart count badge has `aria-live="polite"` for dynamic updates
- No color-only indicators (e.g., error states use icons + color + text)

### 9. **Screen Reader Support**
- `.sr-only` class hides text visually but keeps it for screen readers
- `aria-hidden="true"` on decorative elements (icons)
- Descriptive link text (not "Click here")
- Form field descriptions in `aria-label` when needed

## 📋 Testing Checklist

- [ ] Navigate site using **Tab** key only
- [ ] Use screen reader: [NVDA (Windows)](https://www.nvaccess.org/) or [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [ ] Check color contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Test with [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- [ ] Test with [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
- [ ] Zoom page to 200% and verify layout is still usable
- [ ] Disable images and verify page is still navigable

## 🔧 Guidelines for Future Development

### When Adding New Features:
1. Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
2. Add `aria-label` or `aria-labelledby` for unlabeled controls
3. Include focus indicators (`.focus:ring-2 .focus:ring-indigo-500`)
4. Test keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
5. Verify form inputs have `<label>` with `htmlFor`
6. Add `aria-live="polite"` for dynamic content updates
7. Ensure color contrast is WCAG AA minimum (4.5:1 for normal text)

### CSS Utilities Used:
```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Show on focus */
.focus:not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: auto;
  margin: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## 📚 Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

## 🎯 Priority Improvements (Future)

- [ ] Add alt text to all product images
- [ ] Create high contrast mode toggle
- [ ] Add text size adjustment option
- [ ] Implement ARIA descriptions for complex interactive patterns
- [ ] Add captions/transcripts if video content is added
- [ ] Test with assistive technology (JAWS, NVDA, VoiceOver)
- [ ] Create accessible data tables with proper headers
- [ ] Add keyboard shortcuts documentation

---

**Last Updated:** December 5, 2025  
**Maintained By:** Development Team
