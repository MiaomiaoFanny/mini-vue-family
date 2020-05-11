/* /parentPath/path */
export function resolvePath(path, parentPath) {
  if (path === '*') {
    return path
  }
  if (!parentPath || path[0] === '/') {
    return cleanPath('/' + path)
  }
  return cleanPath('/' + parentPath + '/' + path)
}

export function cleanPath(path) {
  return path.replace(/\/+/g, '/')
}