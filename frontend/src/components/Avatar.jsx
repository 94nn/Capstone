import { getImageUrl, getInitials } from '../utils/imageUrl'
import './Avatar.css'

function Avatar({ name, src, size = 40, className = '' }) {
    const imgUrl = getImageUrl(src)
    const initials = getInitials(name)

    return (
        <div
            className={`avatar ${className}`}
            style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
            {imgUrl
                ? <img src={imgUrl} alt={name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                : null
            }
            <span className="avatar-initials" style={{ display: imgUrl ? 'none' : 'flex' }}>
                {initials}
            </span>
        </div>
    )
}

export default Avatar
