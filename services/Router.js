/**
 * Client-side Router with Lazy Loading Pattern
 *
 * This router implements lazy loading to improve performance:
 * - MenuPage: Loaded eagerly (at app startup)
 * - OrderPage & DetailsPage: Loaded on-demand using dynamic imports
 *
 * Benefits:
 * - Smaller initial bundle size
 * - Faster initial page load
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
  go: async (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }
    let pageElement = null;
    switch (route) {
      case '/':
        // MenuPage is loaded eagerly (imported at app startup)
        pageElement = document.createElement('menu-page');
        break;
      case '/order':
        // LAZY LOADING PATTERN: Dynamic import loads the module only when needed
        // This reduces initial bundle size and improves performance
        // The module is loaded asynchronously and cached for subsequent visits
        await import('../components/OrderPage.js');
        pageElement = document.createElement('order-page');
        break;
      default:
        if (route.startsWith('/product-')) {
          // LAZY LOADING PATTERN: DetailsPage is also loaded on-demand
          // Only imported when a product detail route is accessed
          await import('../components/DetailsPage.js');
          pageElement = document.createElement('details-page');
          pageElement.dataset.productId = route.substring(route.lastIndexOf('-') + 1);
        }
        break;
    }
    if (pageElement) {
      // get current page element
      let currentPage = document.querySelector('main').firstElementChild;
      if (currentPage) {
        currentPage.remove();
        document.querySelector('main').appendChild(pageElement);
      } else {
        document.querySelector('main').appendChild(pageElement);
      }
    }

    window.scrollX = 0;
  },
};

export default Router;
