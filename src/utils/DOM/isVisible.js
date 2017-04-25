/** @flow */
export default function isVisible(element: ?Element): boolean {
  if (!element) return true;
  const style = window.getComputedStyle(element, null);
  if (style) {
    const display = style.getPropertyValue('display');
    if (display === 'none') return false;
  }
  return isVisible(element.parentElement);
}
