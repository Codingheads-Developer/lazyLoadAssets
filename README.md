# Lazy-loaded Assets

This library contains some JavaScript plugins to allow lazy-loading images, scripts, stylesheets, iframes and more. The lazy-load functionality also works with pictures tags.

## Initializing in JavaScript

To initialize the library, you need to create a new instance of the `lazyLoadAssets` class:

```javascript
new lazyLoadAssets(document.body, {
  plugins: [...],
  imagesLoaded: imagesLoaded, // optional
})
```

For example:

```javascript
import {
  activateOnScroll,
  lazyVideo,
  lazyIframe,
  lazyScripts,
  lazyStyles,
  lazyCssBg,
  lazyLoadAssets,
  animate,
  onInteractive,
} from '@codingheads/lazyload';
import imagesLoaded from 'imagesloaded';

onInteractive(() => {
  new lazyLoadAssets(document.body, {
    plugins: [
      activateOnScroll,
      lazyVideo,
      lazyIframe,
      lazyCssBg,
      lazyScripts,
      lazyStyles,
      animate,
    ],
    imagesLoaded,
  });
});
```

**Starting with version 2.0, if you want to use ImagesLoaded, you must pass it to the lazyLoadAssets constructor.**

## Changelog

v2.0

- Removed support for Foundation Interchange (use Picture instead)
- Removed imagesloaded by default; you can still add it if needed.

## Plugins

1. `activateOnScroll`
   The `activateOnScroll` plugins is the base plugin that triggers actions when elements come into the viewport. It also is the plugin that implements lazy-load for images/picture tags.

   You can also use the plugin as standalone, whenever you need to trigger some event when a specific DOM element comes into the viewport:

   ```javascript
   new activateOnScroll(element, options);
   ```

   The options object can have the following properties:

   - `callback` - the callback function to be run when the element comes into view (it receives the element that is being activated as a parameter);
   - `activatedClass` - the class to be added when the element has been activated (default: `animation-started`);
   - `activatedClassTargetSelector` - a selector for the element that should receive the "activatedClass" class, when it is a child of the actual element (default: `false`);
   - `initAttribute` = the dataset attribute to set when activated (it is used to prevent duplicate activations. Default: `activateOnScrollInit`),
   - `options` - the settings for the IntersectionObserver (default: `{ rootMargin: '100px 0px' }`).

   Image elements that will be activated by this plugin should have their structure like this:

   ```html
   <img data-lazy-img data-src="https://test.image" alt="" />
   ```

2. `lazyCssBg`
   This plugin is used for elements which have their background image set by CSS.

   ```html
   <style>
     #my-element[data-css-bg-loaded] {
       background-image: url(https://test.image);
     }
   </style>
   <div id="my-element" data-lazy-css-bg>....</div>
   ```

   The element will receive the "data-css-bg-loaded" attribute when it gets into view.

3. `lazyIframe`
   Used to lazy-load iframes.

   ```html
   <iframe data-lazysrc="https://my.iframe"></iframe>
   ```

4. `lazyScripts`
   Used to load script tags only when a specific element is visible. For example, to lazy-load magnific-popup only when the newsletter section in the footer is visible. Or to lazy-load Mailchimp/Sendinblue scripts until the newsletter section is visible.

   Use the `data-lazy-script` attribute, which accepts a single value or an array of script URLs.

   ```html
   <section class="newsletter-section" data-lazy-script="[https://mailchimp.some.script]">
     Mailchimp content
   </section>
   ```

5. `lazyStyles`
   Used to load stylesheets only when a specific element is visible. Similar to lazy-loaded scripts.

   Use the `data-lazy-stylesheet` attribute, which accepts a single value or an array of stylesheet URLs.

   **Warning! Do not use `data-lazy-script` and `data-lazy-stylesheet` on the same element. Use them in separate elements (perhaps a nested element structure).**

   ```html
   <section class="newsletter-section" data-lazy-script="[https://mailchimp.some.script]">
     <div class="" data-lazy-stylesheet="[https://mailchimp.some.styles]">
       Mailchimp content
     </div>
   </section>
   ```

6. `animate`

   This plugin will add a specified class on the elements when they come into view. It's similar to AOS, but much simpler/more limited.

   ```html
   <style>
     [data-animate='load-from-left'] {
       transform: translateX(-100px);
       transition: transform 0.3s;
     }
     [data-animate='load-from-left'].load-from-left {
       transform: translateX(0);
     }
     // or
     [data-animate='load-from-left'][data-animate-init] {
       transform: translateX(0);
     }
   </style>
   <div data-animate="load-from-left">Text loaded from left...</div>
   ```

   When the element comes into view, it will receive the `load-from-left` class which can be used to animate the element.

   You can also set the `rootMargin` for the IntersectionObserver by using the `data-root-margin` attribute.

   ```html
   <div data-animate="load-from-left" data-root-margin="500px 200px">
     Text loaded from left...
   </div>
   ```

7. `lazyVideo`

   This will allow you to create video elements that are loaded only when they come into view.
   Use the `data-lazy-video` attribute on the video element, and replace `src` with `data-src` on the source element tags:

   ```html
   <video data-lazy-video autoplay muted loop playsinline>
     <source data-src="one-does-not-simply.webm" type="video/webm" />
     <source data-src="one-does-not-simply.mp4" type="video/mp4" />
   </video>
   ```

## New content (AJAX etc)

When new content is inserted into the page (either by AJAX, or by sliders that duplicate content etc.), the new content is automatically parsed and lazy-loaded. So you don't need to call the initializer again. It will just work.

## jQuery

When initialized, if jQuery is present on the page, the plugins will also make themselves available as jQuery plugins:

```javascript
$('.my-element').activateOnScroll({
  callback: function (element) {
    console.log(element);
  },
});
```
