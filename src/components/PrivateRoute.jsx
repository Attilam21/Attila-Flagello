import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute