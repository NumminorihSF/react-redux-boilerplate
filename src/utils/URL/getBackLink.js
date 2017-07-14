/** @flow */
type args = {
  params: Object,
  routes: Array<{ path?: string }>,
};

export default function ({ routes = [], params = {} }: args) {
  const [_, ...routesToUse] = routes; // eslint-disable-line no-unused-vars
  const pathParts = routesToUse
    .filter(route => 'path' in route)
    .map(route => ((route.path: any): string))
    .map(part => (part.startsWith(':') ? params[part.slice(1)] : part));
  pathParts.pop();

  return `/${pathParts.join('/')}`;
}
