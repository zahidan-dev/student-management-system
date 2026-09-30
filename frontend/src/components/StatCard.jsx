const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'blue' }) => {
  return (
    <div className='stat-card'>
      <div className='stat-card-top'>
        <div className={`stat-icon ${variant}`}>
          {Icon && <Icon size={21} />}
        </div>
      </div>

      <div className='stat-content'>
        <p>{title}</p>

        <h2>{value}</h2>

        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  )
}

export default StatCard
