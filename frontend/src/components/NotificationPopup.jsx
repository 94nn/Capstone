import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import './NotificationPopup.css'
import { getImageUrl } from '../utils/imageUrl'

const NotificationPopup = ({ isVisible, onClose, notifications, setNotifications }) => {
    const popupRef = useRef(null)
    const student_id = localStorage.getItem('student_id')

    const unreadCount = notifications.filter(n => !n.is_read).length

    const markRead = async (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n))
        try {
            await axios.patch(`/api/notifications/${id}/read`)
        } catch (err) {
            console.error('Error marking notification as read:', err)
        }
    }

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
        try {
            await axios.patch(`/api/notifications/read-all/${student_id}`)
        } catch (err) {
            console.error('Error marking all as read:', err)
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose()
            }
        }
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isVisible, onClose])

    if (!isVisible) return null

    return (
        <div className="notif-popup" ref={popupRef}>
            <div className="notif-popup-header">
                <h3 className="notif-popup-title">Notifications</h3>
                {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead}>
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="notif-list">
                {notifications.length === 0 ? (
                    <p className="notif-empty">No notifications yet.</p>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notif-item ${!notif.is_read ? 'notif-item--unread' : ''}`}
                            onClick={() => markRead(notif.id)}
                        >
                            {!notif.is_read && <span className="notif-dot" />}
                            {notif.image_url && (
                                <img
                                    src={`http://127.0.0.1:8000/storage/${notif.image_url}`}
                                    alt="badge"
                                    className="notif-badge-image"
                                />
                            )}
                            <div className="notif-item-body">
                                <p className="notif-item-title">{notif.title}</p>
                                <p className="notif-item-message">{notif.message}</p>
                                <p className="notif-item-time">{notif.created_at}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default NotificationPopup