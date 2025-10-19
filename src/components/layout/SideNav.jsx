import { cn } from '../../utils/cn'
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
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'rosa', label: 'Rosa', icon: Users },
    { id: 'match', label: 'Match', icon: Target },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart3 },
    { id: 'avversario', label: 'Avversario', icon: UserCheck }
  ]

  return (
    <div className="w-64 bg-surface border-r border-surface">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">🏆 eFootballLab</h1>
      </div>
      
      <nav className="px-4 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
                currentPage === item.id
                  ? 'bg-primary text-primary-fg'
                  : 'text-muted hover:bg-surface hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium text-primary-fg">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-muted truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-1 text-muted hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SideNav
