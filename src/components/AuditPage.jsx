import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AuditReport from './AuditReport'
import { IconArrowLeft, IconSearch, IconExternalLink, IconCheck, IconGlobe, IconChart, IconTarget, IconTool, IconPhone, IconLock, IconBot, IconLayout } from './Icons'

const STEPS = [
  { label: 'Fetching' },
  { label: 'Analyzing' },
  { label: 'Checking' },
  { label: 'Optimizing' },
  { label: 'Scoring' },
]

const STEP_ICONS = [
  <IconGlobe size={16} />,
  <IconSearch size={16} />,
  <IconCheck size={16} />,
  <IconTool size={16} />,
  <IconChart size={16} />,
]

export default function AuditPage() {
  const { url: encodedUrl } = useParams()
  const navigate = useNavigate()
  const url = encodedUrl ? decodeURIComponent(encodedUrl) : ''
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [activeSection, setActiveSection] = useState('meta')
  const contentRef = useRef(null)

  const scrollToSection = useCallback((id) => {
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (id === 'section-overview') setActiveSection('overview')
    else if (id === 'section-todo' || id.includes('todo')) setActiveSection('todo')
    else if (id.startsWith('check-')) {
      const sectionMap = {
        'check-title': 'meta', 'check-meta-desc': 'meta', 'check-canonical': 'meta',
        'check-robots-meta': 'meta', 'check-domain': 'meta', 'check-url': 'meta',
        'check-h1': 'quality', 'check-images': 'quality', 'check-content': 'quality',
        'check-performance': 'server', 'check-caching': 'server',
        'check-social': 'social',
      }
      setActiveSection(sectionMap[id] || 'meta')
    }
  }, [])

  useEffect(() => {
    if (!url) { navigate('/'); return }

    let step = 0
    const messages = ['Fetching page content...', 'Analyzing meta tags and structure...', 'Checking links, images, and headings...', 'Optimizing performance metrics...', 'Calculating your SEO score...']

    setProgressText(messages[0])
    const interval = setInterval(() => {
      if (step < STEPS.length - 1) { step++; setCurrentStep(step); setProgressText(messages[step]) }
    }, 800)

    axios.post('/api/audit/', { url }, { timeout: 60000 })
      .then(res => {
        clearInterval(interval)
        setCurrentStep(STEPS.length - 1)
        setProgressText('Report ready!')
        setTimeout(() => { setResult(res.data); setLoading(false) }, 500)
      })
      .catch(err => {
        clearInterval(interval)
        setError(err.response?.data?.error || 'Audit failed. Please try again.')
        setLoading(false)
      })

    return () => clearInterval(interval)
  }, [url, navigate])

  const gradeColor = { 'A+': '#059669', 'A': '#059669', 'B+': '#2563eb', 'B': '#2563eb', 'C+': '#d97706', 'C': '#d97706', 'D': '#dc2626', 'F': '#dc2626' }

  return (
    <div className="audit-page">
      {/* Audit Header Bar - below main navbar */}
      <div className="audit-header">
        <div className="audit-header-inner">
          <Link to="/" className="audit-back">
            <IconArrowLeft size={16} />
            <span>New Audit</span>
          </Link>

          <div className="audit-url-bar">
            <IconGlobe size={15} className="text-[var(--text-muted)]" />
            <span className="audit-url-text">{url}</span>
            {result && (
              <span className="audit-grade" style={{ background: (gradeColor[result.overall_grade] || '#64748b') + '15', color: gradeColor[result.overall_grade] || '#64748b' }}>
                {result.overall_grade}
              </span>
            )}
          </div>

          <a href={url} target="_blank" rel="noopener noreferrer" className="audit-visit">
            <IconExternalLink size={14} />
            Visit
          </a>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="audit-loading">
          <div className="audit-loading-card">
            <div className="loading-pulse"><div className="loading-spinner"></div></div>
            <h3>Analyzing your page...</h3>
            <p>{progressText}</p>
            <div className="progress-steps">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={`progress-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
                    <div className="step-dot">{i < currentStep ? <IconCheck size={16} /> : STEP_ICONS[i]}</div>
                    <span className="step-label">{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`progress-line ${i < currentStep ? 'done' : ''}`}></div>}
                </div>
              ))}
            </div>
            <div className="loading-bars">
              <div className="loading-shimmer h-3 w-full"></div>
              <div className="loading-shimmer h-3 w-4/5"></div>
              <div className="loading-shimmer h-3 w-5/6"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="audit-loading">
          <div className="audit-loading-card">
            <div className="audit-error-icon">
              <IconLock size={40} />
            </div>
            <h3>Audit Failed</h3>
            <p className="text-[var(--danger)]">{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary mt-4">
              <IconArrowLeft size={14} /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="audit-body" ref={contentRef}>
          {/* Score Hero */}
          <div className="audit-score-hero">
            <div className="audit-score-ring-wrap">
              <div className="audit-score-ring">
                <svg width={180} height={180}>
                  <circle cx={90} cy={90} r={78} fill="none" stroke="#e2e8f0" strokeWidth={12} />
                  <circle cx={90} cy={90} r={78} fill="none"
                    stroke={result.overall_score >= 70 ? '#22c55e' : result.overall_score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth={12} strokeDasharray={490} strokeDashoffset={490 - (result.overall_score / 100) * 490}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div className="audit-score-inner">
                  <span className="audit-score-num">{result.overall_score}</span>
                  <span className="audit-score-label">Score</span>
                </div>
              </div>
              <div className="audit-grade-badge" style={{ background: gradeColor[result.overall_grade] || '#64748b' }}>
                Grade {result.overall_grade}
              </div>
            </div>

            <div className="audit-score-bars">
              {[
                { label: 'Meta Data', score: result.onpage_score, icon: <IconTarget size={14} /> },
                { label: 'Page Quality', score: result.usability_score, icon: <IconTool size={14} /> },
                { label: 'Page Structure', score: Math.round((result.heading_structure?.total_headings > 0 ? 60 : 100) * (result.duplicate_headings?.has_duplicates ? 0.5 : 1)), icon: <IconLayout size={14} /> },
                { label: 'Links', score: result.links_score, icon: <IconGlobe size={14} /> },
                { label: 'Server', score: result.performance_score, icon: <IconLock size={14} /> },
                { label: 'External Factors', score: result.social_score, icon: <IconPhone size={14} /> },
              ].map((item) => (
                <div key={item.label} className="audit-bar-row">
                  <div className="audit-bar-label">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <div className="audit-bar-track">
                    <div className="audit-bar-fill" style={{
                      width: `${item.score}%`,
                      background: item.score >= 70 ? '#22c55e' : item.score >= 40 ? '#f59e0b' : '#ef4444'
                    }}></div>
                  </div>
                  <span className="audit-bar-value">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div className="audit-report-content">
            <AuditReport data={result} url={url} scrollToSection={scrollToSection} />
          </div>
        </div>
      )}
    </div>
  )
}
