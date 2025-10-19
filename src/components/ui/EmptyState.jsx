const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: '#1F2937',
      border: '1px solid #374151',
      borderRadius: '16px',
      margin: '24px 0'
    }}>
      {Icon && (
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          color: '#9CA3AF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={32} />
        </div>
      )}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#9CA3AF',
        marginBottom: '24px'
      }}>
        {description}
      </p>
      {action}
    </div>
  )
}

export default EmptyState