/** @flow */
const map: WeakMap<Element, number> = new WeakMap();

function slowGet(element: ?Element): number {
  if (!element) return 1;
  const style = window.getComputedStyle(element, null);
  if (style) {
    const z = style.getPropertyValue('z-index');
    const zIndex = parseInt(z, 10);
    if (zIndex) return Math.max(zIndex, getZIndex(element.parentElement)); // eslint-disable-line no-use-before-define
  }
  return getZIndex(element.parentElement); // eslint-disable-line no-use-before-define
}

export default function getZIndex(element: ?Element): number {
  if (!element) return 1;
  if (map.has(element)) map.get(element);

  const index = slowGet(element);
  map.set(element, index);
  return index;
}
