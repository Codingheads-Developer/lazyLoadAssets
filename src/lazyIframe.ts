/**
 * JS plugin to lazy load iframes
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */

import activateOnScroll, { ActivateOnScrollOptions } from './activateOnScroll';

export default class lazyIframe {
  #element = null;
  #options: ActivateOnScrollOptions = {};

  // activate for iframes within container
  static #activateForContainer(iframeContainer: HTMLElement) {
    // remove all other content - that is, the placeholder image
    const items = [...iframeContainer.children].filter(
      item =>
        item.nodeType === 1 &&
        !item.matches('iframe[data-lazysrc]') &&
        !item.matches('.iframe-content')
    );
    if (items.length) {
      items.forEach(item => item.remove());
    }
    iframeContainer.removeAttribute('data-lazy-iframe');
    const iframe = iframeContainer.querySelector(
      'iframe[data-lazysrc]'
    ) as HTMLIFrameElement;
    if (iframe) {
      const iframeBg = iframe.closest('.bg-video-container') as HTMLElement;
      iframe.src = iframe.dataset.lazysrc;
      if (iframeBg) {
        iframe.addEventListener('load', () =>
          setTimeout(() => {
            iframeBg.style.background = 'none';
          }, 500)
        );
      }
      iframe.removeAttribute('data-lazysrc');
    }
  }

  // activate for iframes without container
  static #activateForIframe(iframe: HTMLIFrameElement) {
    iframe.src = iframe.dataset.lazysrc;
    iframe.removeAttribute('data-lazysrc');

    const iframeBg = iframe.closest('.bg-video-container') as HTMLElement;
    if (iframeBg) {
      iframe.addEventListener('load', () =>
        setTimeout(() => {
          iframeBg.style.background = 'none';
        }, 500)
      );
    }
  }

  static #activate(container: HTMLElement = document.body) {
    const hasContainer = !container.matches('iframe');

    if (hasContainer) {
      lazyIframe.#activateForContainer(container);
    } else {
      lazyIframe.#activateForIframe(container as HTMLIFrameElement);
    }
  }

  constructor(element: HTMLElement) {
    this.#element = element;

    // the activateOnScroll options
    this.#options = {
      activatedClass: 'iframe-loaded',
      callback: lazyIframe.#activate,
      options: {
        rootMargin: '0px',
      },
    };

    // initialize
    this.#init();
  }

  #init() {
    // load this iframe after a delay - to help with the speed score??
    const defaultDelay = 0;
    this.#element.dataset.lazyiframeInit = true; // prevent duplicate activations
    const delay =
      'lazyIframeDelay' in this.#element.dataset
        ? parseInt(this.#element.dataset.lazyIframeDelay)
        : defaultDelay;
    setTimeout(() => {
      new activateOnScroll(this.#element, this.#options);
    }, delay);
  }

  // initializer to be used with lazyLoadAssets
  static initializer(container) {
    const lazyIframeElements = container.querySelectorAll(
      `[data-lazy-iframe]:not([data-lazyiframe-init])`
    );
    if (lazyIframeElements.length) {
      [...lazyIframeElements].forEach((element: HTMLElement) => new lazyIframe(element));
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-lazyiframe-init');
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).lazyIframe = lazyIframe;
  }

  // register jQuery plugin, if jQuery is available
  static addToJquery() {
    if ('jQuery' in window) {
      (window as any).jQuery.fn.lazyIframe = function () {
        this.each((_i, element) => new lazyIframe(element));
        return this;
      };
    }
  }
}

lazyIframe.addToJquery();
