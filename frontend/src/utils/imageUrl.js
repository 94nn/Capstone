const BACKEND_URL = 'http://127.0.0.1:8000'

export function getImageUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${BACKEND_URL}/${path}`
}

export function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
