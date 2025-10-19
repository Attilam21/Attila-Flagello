import { 
  Home, 
  Users, 
  Target, 
  BarChart3, 
  UserCheck,
  LogOut 
} from 'lucide-react'

const SideNav = ({ currentPage, onPageChange, user, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'rosa', label: 'Rosa', icon: Users },
    { id: 'match', label: 'Match', icon: Target },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart3 },
    { id: 'avversario', label: 'Avversario', icon: UserCheck }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">🏆 eFootballLab</h1>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="user-email">
              {user.email}
            </span>
            <button
              onClick={onLogout}
              className="logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SideNav
