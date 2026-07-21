import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconTarget, IconChart, IconTool, IconPhone, IconLock, IconBot, IconCheck } from './Icons'

const STEPS = [
  { label: 'Fetching' },
  { label: 'Analyzing' },
  { label: 'Checking' },
  { label: 'Optimizing' },
  { label: 'Scoring' },
]

const FEATURES = [
  { icon: <IconTarget size={22} />, color: 'purple', title: 'Meta Tag Analysis', desc: 'Check title, description, canonical, and all essential meta tags.' },
  { icon: <IconChart size={22} />, color: 'blue', title: 'Score Breakdown', desc: 'Detailed scoring across meta data, content, links, and performance.' },
  { icon: <IconTool size={22} />, color: 'green', title: 'Where to Fix', desc: 'Exact file and location to fix each issue in your codebase.' },
  { icon: <IconPhone size={22} />, color: 'amber', title: 'Mobile & Speed', desc: 'Viewport, lazy loading, page size, and response time checks.' },
  { icon: <IconLock size={22} />, color: 'rose', title: 'Security Audit', desc: 'SSL, HTTPS, security headers, and mixed content detection.' },
  { icon: <IconBot size={22} />, color: 'cyan', title: 'Advanced SEO', desc: 'Broken links, freshness, canonicalization, and schema markup.' },
]

export default function WebsiteAuditor() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAudit = () => {
    if (!url.trim()) { setError('Please enter a URL'); return }
    navigate(`/audit/${encodeURIComponent(url)}`)
  }

  return (
    <div>
      <div className="hero animate-fadeIn">
        <div className="hero-badge">
          <IconCheck size={12} />
          Free Professional SEO Audit
        </div>
        <h1>
          Find &amp; Fix Your<br />
          <span>SEO Problems</span>
        </h1>
        <p>Analyze any website for technical SEO errors, on-page issues, and get actionable recommendations with exact file locations to fix them.</p>

        <div className="search-box">
          <input type="url" placeholder="Enter your website URL (e.g., https://example.com)" value={url}
            onChange={(e) => setUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAudit()} />
          <button className="btn-search" onClick={handleAudit}>
            <IconSearch size={16} />
            Analyze
          </button>
        </div>

        {error && <div className="mt-4 p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg text-[var(--danger)] text-sm max-w-xl mx-auto">{error}</div>}

        <div className="features">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`feature-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
