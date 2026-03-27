const BACKEND_URL = 'http://127.0.0.1:8000'

export function getImageUrl(path) {
    if (!path) return '/images/pixelated_profile_pic.png'
    if (path.startsWith('http')) return path
    return `${BACKEND_URL}/${path}`
}
