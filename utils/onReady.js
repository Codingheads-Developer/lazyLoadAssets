/** @format */

/**
 * Run a callback when the document.readyState has a certain value
 * @param {string|array} state - the state(s) when to run the callback
 * @param {*} callback - the callback to run
 */
export const onReadyState = (state, callback) => {
  const validStates = Array.isArray(state) ? state : [state];
  const checkAndRun = () => {
    if (validStates.includes(document.readyState)) {
      callback();
      return true;
    }
    return false;
  };
  if (!checkAndRun()) {
    document.addEventListener('readystatechange', checkAndRun, {
      once: true,
    });
  }
};

/**
 * Run a callback when the document.readyState is 'complete'
 * (DOM + assets are loaded)
 * @param {*} callback - the callback to run
 */
export const onReady = callback =>
  onReadyState(['complete', 'loaded'], callback);

/**
 * Run a callback when the document.readyState is 'interactive'
 * (DOM is loaded - equivalent to DOMContentLoaded)
 * @param {*} callback - the callback to run
 */
export const onInteractive = callback => onReadyState('interactive', callback);

window.onReady = onReady;
window.onInteractive = onInteractive;
export default onReady;
