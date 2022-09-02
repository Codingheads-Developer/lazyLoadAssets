import activateOnScroll from './activateOnScroll';

/**
 * lazyStyles
 * JS Plugin to lazy load styles
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyStyles {
  /**
   * Options to be set on the intersection observer
   */
  static observerOptions: IntersectionObserverInit = {
    rootMargin: '200px 100px',
  };

  static initializeElement = (target: HTMLElement) => {
    let stylesData = target.dataset.lazyStylesheet;
    const allowMultipleRuns = target.dataset.lazyStylesheetAllowMultiple || false;
    let styles: string[];
    try {
      const scriptsArray = JSON.parse(stylesData);
      styles = scriptsArray;
    } catch (e) {
      styles = [stylesData];
    }

    const existingStyles = Array.from(document.styleSheets);

    styles.forEach(style => {
      // Don't run multiple times.
      if (!allowMultipleRuns) {
        const existing = existingStyles.find(existing => existing.href == style);
        if (existing) {
          return;
        }
      }

      const styleElement = document.createElement('link');
      styleElement.rel = 'stylesheet';
      styleElement.type = 'text/css';
      styleElement.href = style;
      document.head.appendChild(styleElement);
    });
  };

  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `[data-lazy-stylesheet]:not([data-lazystylesheet-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazystylesheetInit',
          options: this.observerOptions,
          callback: this.initializeElement,
        });
      });
    }
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).lazyStyles = this;
  }
}
