import activateOnScroll from './activateOnScroll';

/**
 * lazyStyles
 * JS Plugin to lazy load styles
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyStyles {
  static initializer(container: HTMLElement = document.body) {
    const elements = container.querySelectorAll(
      `[data-lazy-stylesheet]:not([data-lazystylesheet-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazystylesheetInit',
          options: {
            rootMargin: '600px 200px',
          },
          callback: (target: HTMLElement) => {
            let stylesData = target.dataset.lazyStylesheet;
            let styles: string[];
            try {
              const scriptsArray = JSON.parse(stylesData);
              styles = scriptsArray;
            } catch (e) {
              styles = [stylesData];
            }
            styles.forEach(style => {
              const styleElement = document.createElement('link');
              styleElement.rel = 'stylesheet';
              styleElement.type = 'text/css';
              styleElement.href = style;
              document.head.appendChild(styleElement);
            });
          },
        });
      });
    }
  }
}
