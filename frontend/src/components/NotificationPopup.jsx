import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import './NotificationPopup.css'

const NotificationPopup = ({ isVisible, onClose, notifications, setNotifications }) => {
    const popupRef = useRef(null)

    const unreadCount = notifications.filter(n => !n.is_read).length

    const markRead = (id) => {
        axios.patch(`/api/notifications/${id}/read`)
            .catch(err => console.error('Error marking notification as read:', err))
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    const markAllRead = () => {
        axios.patch('/api/notifications/read-all/1')
            .catch(err => console.error('Error marking all as read:', err))
        setNotifications(notifications.map(n => ({ ...n, is_read: true })))
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
                            <div className="notif-item-body">
                                <p className="notif-item-title">{notif.title}</p>
                                <p className="notif-item-message">{notif.message}</p>
                                <p className="notif-item-time">{notif.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default NotificationPopup