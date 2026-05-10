import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo">六爻</Link>
        <ul className="nav__links">
          {[
            { path: '/', label: '首页' },
            { path: '/divination', label: '起卦' },
            { path: '/learn', label: '学习' },
            { path: '/practice', label: '练习' },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav__link ${isActive(path) ? 'nav__link--active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
