/**
 * Client-side Router with Lazy Loading and View Transitions Patterns
 *
 * This router implements multiple modern web patterns:
 *
 * LAZY LOADING PATTERN:
 * - MenuPage: Loaded eagerly (at app startup)
 * - OrderPage & DetailsPage: Loaded on-demand using dynamic imports
 *
 * VIEW TRANSITIONS PATTERN:
 * - Uses View Transitions API for smooth page changes
 * - Progressive enhancement with graceful fallback
 * - Native-like animations between routes
 *
 * Benefits:
 * - Smaller initial bundle size
 * - Faster initial page load
 * - Smooth, animated transitions
 * - Enhanced user experience
 * - Code splitting for better caching
 * - Only load what users actually need
 */
const Router = {
  init: () => {
    document.querySelectorAll('a.navlink').forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        Router.go(href);
      });
    });
    // It listen for history changes
    window.addEventListener('popstate', (event) => {
      Router.go(event.state.route, false);
    });
    // Process initial URL
    Router.go(location.pathname);
  },
  setMetadata: (title, color) => {
    document.title = `${title} - Coffee Shop`;
    document.querySelector('meta[name="theme-color"]').content = color;
  },
  go: async (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }
    let pageElement = null;
    switch (route) {
      case '/':
        // MenuPage is loaded eagerly (imported at app startup)
        pageElement = document.createElement('menu-page');
        Router.setMetadata('Menu', '#fff');
        break;
      case '/order':
        // LAZY LOADING PATTERN: Dynamic import loads the module only when needed
        // This reduces initial bundle size and improves performance
        // The module is loaded asynchronously and cached for subsequent visits
        await import('../components/OrderPage.js');
        pageElement = document.createElement('order-page');
        Router.setMetadata('Your Order', '#f60');
        break;
      default:
        if (route.startsWith('/product-')) {
          // LAZY LOADING PATTERN: DetailsPage is also loaded on-demand
          // Only imported when a product detail route is accessed
          Router.setMetadata('Product Details', '#f0f');
          await import('../components/DetailsPage.js');
          pageElement = document.createElement('details-page');
          pageElement.dataset.productId = route.substring(route.lastIndexOf('-') + 1);
        }
        break;
    }
    if (pageElement) {
      function changePage() {
        // get current page element
        let currentPage = document.querySelector('main').firstElementChild;
        if (currentPage) {
          currentPage.remove();
          document.querySelector('main').appendChild(pageElement);
        } else {
          document.querySelector('main').appendChild(pageElement);
        }
      }

      // VIEW TRANSITIONS PATTERN: Progressive enhancement for smooth page transitions
      // Uses the modern View Transitions API when available, falls back gracefully
      // Provides native-like animations between page changes in SPAs
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          changePage();
        });
      } else {
        changePage();
      }
    }

    window.scrollX = 0;
  },
};

export default Router;
