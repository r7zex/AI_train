import { Link } from 'react-router-dom'

export interface Crumb { label: string; to?: string }

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300 mx-1">›</span>}
          {crumb.to
            ? <Link to={crumb.to} className="hover:text-blue-600 transition-colors">{crumb.label}</Link>
            : <span className="text-gray-700 font-medium">{crumb.label}</span>}
        </span>
      ))}
    </nav>
  )
}
