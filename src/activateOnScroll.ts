import lazyLoadAssets from './lazyLoadAssets';
import { debounce, deepEquals } from './utils/utils';

export interface LazyLoadPluginConstructor<T> {
  new (...args: any[]): T;
  prototype: T;
  initializer: (container: HTMLElement) => void;
  cleaner: (node: HTMLElement) => void;
}

export interface ActivateOnScrollOptions {
  activatedClass?: string;
  activatedClassTargetSelector?: string | null;
  initAttribute?: string;
  options?: IntersectionObserverInit;
  callback?: Function | null;
  removable?: boolean;
  fadeIn?: boolean;
  activateWithParent?: boolean;
}

/**!
 * ActivateOnScroll - Plugin to activate stuff when objects come in view
 * Also for lazy images
 *
 * Author: Bogdan Barbu
 * Team: Codingheads (codingheads.com)
 */
export default class activateOnScroll {
  /**
   * default options for the Intersection observer
   */
  static observerOptions: IntersectionObserverInit = {
    threshold: 0.01,
    rootMargin: '300px 100px',
  };

  static parent: lazyLoadAssets | null = null;

  // store the observers into an array, so that we might reuse them
  static #savedObservers = [];

  // the options with their defaults
  #activatedClass = 'animation-started';
  #activatedClassTargetSelector = null; // where to add the activatedClass
  #initAttribute = 'activateOnScrollInit';
  #options: IntersectionObserverInit;
  #callback: Function | null = null;
  #removable = true;
  #fadeIn = false;
  #activateWithParent = true;
  #lazyAnimClass = '';
  #observer = null;
  #element = null;

  static #supportScroll =
    'onscroll' in window &&
    !/(gle|ing)bot/.test(navigator.userAgent) &&
    !document.documentElement.classList.contains('legacy');

  // trigger a window resize - but debounce it
  static #triggerResize = debounce(() => {
    const resize = () => {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('resize'));
      });
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(resize, { timeout: 100 });
    } else {
      resize();
    }
  }, 100);

  // finish activating the element - when the image is loaded
  static #finishActivatingElement = (
    element: HTMLElement,
    {
      activatedClass = '',
      isLazyBg = false,
      isLazyImg = false,
      intoViewTimestamp = null,
      fadeIn = false,
      inPicture = false,
    }: {
      activatedClass?: string;
      isLazyBg?: boolean;
      isLazyImg?: boolean;
      intoViewTimestamp?: number;
      fadeIn?: boolean;
      inPicture?: boolean;
    } = {}
  ) => {
    requestAnimationFrame(() => {
      if (activatedClass.length) {
        element.classList.add(activatedClass);
      }
      element.dataset.lazyLoaded = 'true';
    });
    if (fadeIn) {
      // wait for a minimum interval before fading in
      const minInterval = 200,
        time = new Date(),
        interval = time.getTime() - intoViewTimestamp;
      if (element.tagName == 'IMG' || interval > minInterval) {
        requestAnimationFrame(() => {
          element.style.opacity = '1';
        });
      } else {
        setTimeout(() => {
          requestAnimationFrame(() => {
            element.style.opacity = '1';
          });
        }, minInterval - interval);
      }
    }
    if (isLazyImg && !inPicture) {
      // trigger a window resize - but debounce it
      this.#triggerResize();
    }
  };

  // activate the element - change src
  static activateElement = (
    element: HTMLElement,
    { activatedClass = '', fadeIn = false, inPicture = false } = {}
  ) => {
    const time = new Date();
    const intoViewTimestamp = time.getTime();
    const dataset = element.dataset,
      isLazyBg = 'lazyBg' in dataset,
      isLazyImg = 'lazyImg' in dataset || 'srcset' in dataset;
    const finish = () => {
      this.#finishActivatingElement(element, {
        activatedClass,
        isLazyBg,
        isLazyImg,
        intoViewTimestamp,
        fadeIn,
        inPicture,
      });
    };

    if (isLazyBg || isLazyImg) {
      if (!inPicture && activateOnScroll.parent?.imagesLoaded) {
        activateOnScroll.parent.imagesLoaded(element, { background: true }, finish);
      } else {
        if (element.tagName == 'IMG') {
          element.onload = function () {
            finish();
            element.onload = null;
          };
        } else {
          finish();
        }
      }
      if (fadeIn) {
        requestAnimationFrame(() => {
          element.style.opacity = '0';
          element.style.transition = 'opacity 0.3s';
        });
      }

      if (isLazyBg || isLazyImg) {
        const image = element as HTMLImageElement;
        requestAnimationFrame(() => {
          const url = dataset.src;
          if (isLazyBg) {
            // background image
            image.style.backgroundImage = `url(${url})`;
            image.removeAttribute('data-lazy-bg');
            return;
          }

          // img element
          if (url) {
            image.src = url;
            image.removeAttribute('data-src');
          }
          image.removeAttribute('data-lazy-img');
          const srcset = dataset.srcset,
            sizes = dataset.sizes;
          if (srcset) {
            image.srcset = srcset;
            image.removeAttribute('data-srcset');
          }
          if (sizes) {
            image.sizes = sizes;
            image.removeAttribute('data-sizes');
          }
        });
      }
    }
  };

  // handle the event when the element gets into the viewport
  #trigger() {
    const targetEl = this.#activatedClassTargetSelector
      ? this.#element.querySelector(this.#activatedClassTargetSelector)
      : false;
    const target = targetEl || this.#element;

    // custom activated class
    const elementactivatedClass = target.dataset.activated;
    if (elementactivatedClass) {
      this.#activatedClass = elementactivatedClass;
    }

    // fade in?
    if ('fadeIn' in this.#element.dataset) {
      this.#fadeIn = true;
    }

    // add animation class
    this.#lazyAnimClass = target.dataset.lazyAnimation;
    if (this.#activatedClass && this.#activatedClass.length && !this.#lazyAnimClass) {
      requestAnimationFrame(() => {
        target.classList.add(this.#activatedClass);
      });
    }

    // trigger the callback
    if (this.#callback) {
      setTimeout(() =>
        this.#callback(this.#element, {
          activatedClass: this.#activatedClass,
          callback: this.#callback,
          fadeIn: this.#fadeIn,
          lazyAnimClass: this.#lazyAnimClass,
          instance: this,
        })
      );
    }

    // if this is a lazy-image animation, do things differently
    if (this.#lazyAnimClass) {
      requestAnimationFrame(() => {
        this.#element.classList.add('opacity-0');
        setTimeout(() => {
          this.#element.classList.add(this.#lazyAnimClass);
          this.#element.classList.remove('opacity-0'); // prevent fading out first
        }, 50);
      });
    }

    // trigger loading for picture source tags
    const parent = this.#element.parentElement;
    const inPicture = this.#element.tagName == 'IMG' && parent.tagName == 'PICTURE';
    if (inPicture) {
      [...parent.querySelectorAll('source')].forEach(element =>
        activateOnScroll.activateElement(element, {
          inPicture: true,
        })
      );
    }

    // trigger loading on the tag
    activateOnScroll.activateElement(this.#element, {
      activatedClass: this.#activatedClass,
      fadeIn: this.#fadeIn,
      inPicture,
    });

    // trigger an event...
    this.#element.dispatchEvent(
      new CustomEvent('activatedOnScroll', {
        bubbles: true,
        detail: {
          instance: this,
        },
      })
    );
  }

  #init() {
    // don't duplicate activations
    if (this.#initAttribute in this.#element.dataset) return;

    // signal that this is initialized
    this.#element.dataset[this.#initAttribute] = true;

    // start right away if this is a google bot or a legacy browser
    if (!activateOnScroll.#supportScroll) {
      this.#trigger();
      return;
    }

    // allow external trigger
    this.#element.addEventListener('activateOnScroll', e => {
      if (!this.#activateWithParent || e.target == this.#element) {
        this.#trigger();
      }
    });
  }

  constructor(
    element: HTMLElement,
    {
      activatedClass = 'animation-started',
      activatedClassTargetSelector = null,
      initAttribute = 'activateOnScrollInit',
      options = undefined,
      callback = null,
      removable = true,
      fadeIn = false,
      activateWithParent = true,
    }: ActivateOnScrollOptions = {}
  ) {
    // store the settings
    this.#activatedClass = activatedClass;
    this.#activatedClassTargetSelector = activatedClassTargetSelector;
    this.#initAttribute = initAttribute;
    this.#options = options || activateOnScroll.observerOptions;
    this.#callback = callback;
    this.#removable = removable;
    this.#fadeIn = fadeIn;
    this.#activateWithParent = activateWithParent;
    this.#element = element;
    this.#element.activateOnScrollInstance = this;

    // search for an existing observer
    let observer: IntersectionObserver | null = null;
    const args = [
      activatedClass,
      activatedClassTargetSelector,
      initAttribute,
      options,
      callback,
      removable,
      fadeIn,
      activateWithParent,
    ];
    if (activateOnScroll.#savedObservers.length) {
      const match = activateOnScroll.#savedObservers.filter(savedObserver =>
        deepEquals(savedObserver.args, args)
      );
      observer = match?.[0]?.observer;
    }

    // no previous matching observer found. Create a new one
    if (!observer) {
      const dispatchTargetEvent = (entry, type, observer) => {
        return entry.target.dispatchEvent(
          new CustomEvent(type, {
            bubbles: true,
            detail: {
              entry,
              observer,
              ...args,
              instance: this,
            },
          })
        );
      };
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // allow cancelling the event
            if (!dispatchTargetEvent(entry, 'willActivateOnScroll', observer)) return;

            // don't reobserve
            if (this.#removable) observer.unobserve(entry.target);

            dispatchTargetEvent(entry, 'activateOnScroll', observer);
          }
        });
      }, this.#options);
      // save the observer
      activateOnScroll.#savedObservers.push({
        observer,
        args,
      });
    }
    this.#observer = observer;

    // initialize the observer on this element
    this.#observer.observe(this.#element);

    // unobserve when in view
    this.#element.addEventListener('activatedOnScroll', e => {
      if (e.target == this.#element && this.#removable) {
        this.#observer.unobserve(this.#element);
        this.#element.activateOnScrollInstance = null;
      }
    });

    // initialize the event handlers
    this.#init();
  }

  // initializer - to be used with the lazyLoadAssets plugin
  static initializer(container: HTMLElement) {
    const lazyImages = container.querySelectorAll(
      ['bg', 'img'].map(type => `[data-lazy-${type}]:not([data-lazyimg-init])`).join(', ')
    );
    if (lazyImages.length) {
      [...lazyImages].forEach(element => {
        new activateOnScroll(element as HTMLElement, {
          initAttribute: 'lazyimgInit',
        });
      });
    }
  }

  // the cleaner, to be used in lazyLoadAssets
  static cleaner(node: HTMLElement) {
    node.removeAttribute('data-lazyimg-init');
    if (node.style.opacity == '0') node.style.opacity = '';
  }

  // save to the window object
  static saveToGlobal(global = window) {
    (global as any).activateOnScroll = activateOnScroll;
  }

  /* register a jQuery plugin, if jquery is in the page */
  static addToJquery() {
    if ('jQuery' in window) {
      (window as any).jQuery.fn.activateOnScroll = function (options) {
        this.each((i, element) => new activateOnScroll(element, options));
        return this;
      };
    }
  }
}

activateOnScroll.addToJquery();
activateOnScroll.saveToGlobal();
