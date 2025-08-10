# Blog Card Clickable Overlay Fix - Test Plan

## Issue Fixed
Fixed blog card clickable overlay where focus outline artifacts appeared on cards of varying sizes due to mismatch between button focus ring and visual card boundaries.

## Solution Implemented
- Replaced `<button>` wrapper with semantic `<a>` tag
- Added proper href with blog slug for accessibility and SEO
- Used `focus-visible` for better keyboard navigation experience
- Focus styles now perfectly match card boundaries

## Test Cases

### Manual Tests

#### Test 1: Click Functionality
**Steps:**
1. Navigate to `/blog`
2. Wait for blog cards to load
3. Click on different blog cards of varying heights
4. Verify each click navigates to the correct blog post URL

**Expected Result:** All cards navigate to correct `/blog/{slug}` URLs

#### Test 2: Keyboard Navigation
**Steps:**
1. Navigate to `/blog` 
2. Use Tab key to navigate through blog cards
3. Press Enter on focused cards
4. Verify focus outline appearance

**Expected Result:** 
- Focus moves between cards sequentially
- Focus outline appears only when using keyboard (focus-visible)
- Focus outline is bounded to card dimensions
- Enter key navigates to blog post

#### Test 3: Focus Outline Verification
**Steps:**
1. Navigate to `/blog`
2. Use Tab to focus cards of different heights (small, medium, large content)
3. Observe focus outline boundaries

**Expected Result:**
- No blue outline artifacts outside card boundaries
- Focus outline matches card size exactly for all card heights
- Outline has proper offset and border-radius

#### Test 4: Accessibility
**Steps:**
1. Test with screen reader
2. Verify aria-label descriptions
3. Test keyboard-only navigation

**Expected Result:**
- Screen reader announces card content properly
- Keyboard navigation works without mouse
- Focus states are clearly visible

### Automated Tests (To Implement)

#### E2E Test: Blog Card Navigation
```javascript
// cypress/e2e/blog-card-navigation.cy.js
describe('Blog Card Navigation', () => {
  beforeEach(() => {
    cy.visit('/blog');
    cy.wait('@getBlogPosts'); // Mock API call
  });

  it('should navigate to correct blog post when clicked', () => {
    cy.get('[data-testid="blog-card"]').first().as('firstCard');
    cy.get('@firstCard').should('have.attr', 'href').and('include', '/blog/');
    cy.get('@firstCard').click();
    cy.url().should('include', '/blog/');
  });

  it('should navigate with keyboard interaction', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'href').and('include', '/blog/');
    cy.focused().type('{enter}');
    cy.url().should('include', '/blog/');
  });

  it('should have proper focus styles', () => {
    cy.get('[data-testid="blog-card"]').first().focus();
    cy.focused().should('have.css', 'outline-color', 'rgb(37, 99, 235)'); // blue-400
  });
});
```

#### Visual Regression Test
```javascript
// cypress/e2e/blog-card-visual.cy.js
describe('Blog Card Visual Regression', () => {
  it('should not show focus outline artifacts', () => {
    cy.visit('/blog');
    cy.get('[data-testid="blog-card"]').each(($card) => {
      cy.wrap($card).focus();
      cy.wrap($card).matchImageSnapshot('blog-card-focus');
    });
  });
});
```

## Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Edge (latest)

## Test Data Requirements
- Blog posts with varying content lengths (short, medium, long excerpts)
- Blog posts with different image aspect ratios
- Ensure mix of card heights for comprehensive testing

## Setup Instructions for Testing

### Add Cypress (Recommended)
```bash
npm install --save-dev cypress @cypress/react18
```

### Add Test Attributes (Optional)
Add `data-testid="blog-card"` to the anchor tag in BlogCard.tsx for easier testing:
```tsx
<a
  data-testid="blog-card"
  href={`/blog/${blog.slug}`}
  // ... other props
>
```

### GitHub Actions (CI/CD)
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
```

## Performance Considerations
- Focus styles use `focus-visible` for better UX (no focus on mouse click)
- Semantic anchor improves SEO and accessibility
- No JavaScript overhead for focus management