export default function renderIcon(parent: HTMLElement, className: string[], id: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('base-icon', ...className);
  parent.append(svg);

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${id}`);
  svg.append(use);

  return svg;
}
