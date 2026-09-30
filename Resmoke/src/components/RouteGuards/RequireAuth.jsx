import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import EmailVerificationModal from '../Modals/EmailVerificationModal'
import { useAuth } from '../../contexts/AuthContext'

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const restrictedPaths = [
    /^\/checkout\//,
    /^\/chat\//,
    /^\/my-chats$/,
    /^\/add-product$/,
    /^\/my-products$/,
    /^\/favorites$/,
    /^\/edit-product\/.*/,
    /^\/purchases$/,
    /^\/profile$/,
    /^\/edit-profile$/,
    /^\/my-reviews$/,
    /^\/statistics$/
  ]
  const path = location.pathname
  if (user && user.isVerified === false && restrictedPaths.some(rx => rx.test(path))) {
    return <EmailVerificationModal />
  }

  return children
}

export default RequireAuth
