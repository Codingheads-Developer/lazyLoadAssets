import activateOnScroll from './activateOnScroll';

/**
 * lazyScripts
 * JS Plugin to lazy load scripts
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class lazyScripts {
  /**
   * Options to be set on the intersection observer
   */
  static observerOptions: IntersectionObserverInit = {
    rootMargin: '600px 200px',
  };

  static initializeElement = (target: HTMLElement) => {
    let scriptsData: string = target.dataset.lazyScript;
    let scripts: string[];
    try {
      const scriptsArray = JSON.parse(scriptsData);
      scripts = scriptsArray;
    } catch (e) {
      scripts = [scriptsData];
    }
    scripts.forEach(script => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      document.head.appendChild(scriptElement);
    });
  };

  static initializer(container: HTMLElement = document.body) {
    // lazy-load scripts
    const elements = container.querySelectorAll(
      `[data-lazy-script]:not([data-lazyscript-init])`
    );
    if (elements.length) {
      elements.forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazyscriptInit',
          options: this.observerOptions,
          callback: this.initializeElement,
        });
      });
    }
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).lazyScripts = this;
  }
}
