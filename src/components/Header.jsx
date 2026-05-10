import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path ? 'text-primary' : 'text-[#86868b]'

  return (
    <header className="sticky top-0 z-50 bg-[rgba(255,255,255,0.8)] backdrop-blur-xl border-b border-[#e0e0e0]">
      <div className="max-w-[980px] mx-auto px-4">
        <nav className="flex items-center justify-between h-[52px]">
          <Link to="/" className="font-semibold text-[17px] text-[#1d1d1f] tracking-tight">
            六爻
          </Link>
          <ul className="flex gap-6">
            {[
              { path: '/', label: '首页' },
              { path: '/divination', label: '起卦' },
              { path: '/learn', label: '学习' },
              { path: '/practice', label: '练习' },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-[14px] transition-colors hover:text-[#1d1d1f] ${isActive(path)}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
