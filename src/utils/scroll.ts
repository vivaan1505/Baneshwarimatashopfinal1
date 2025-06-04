/**
 * Scrolls to a specific element on the page
 * @param elementId ID of the element to scroll to
 * @param options Scroll behavior options
 */
export const scrollToElement = (
  elementId: string, 
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
) => {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
    }
  });
};

/**
 * Scrolls to the top of the page
 * @param smooth Whether to use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  });
};

/**
 * Scrolls to the top of the page when navigating between routes
 * This function should be called in route change handlers
 */
export const scrollToTopOnRouteChange = () => {
  // Use setTimeout to ensure it runs after route change is complete
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Use 'auto' for route changes to avoid animation issues
    });
  }, 0);
};

export default {
  scrollToElement,
  scrollToTop,
  scrollToTopOnRouteChange
};