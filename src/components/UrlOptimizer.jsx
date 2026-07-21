import { useState } from 'react'
import axios from 'axios'
import { IconChart, IconLightbulb, IconTag, IconTool } from './Icons'

export default function UrlOptimizer() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/optimize-url/', { url })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze URL. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#3b82f6'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-blue-50 border-blue-200'
    if (score >= 40) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  const getSuggestionColor = (type) => {
    const colors = {
      critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
      high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
      medium: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
      low: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700' },
      tips: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    }
    return colors[type] || colors.tips
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">🔗 URL SEO Optimizer</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Enter a URL to get detailed SEO optimization suggestions and score breakdown</p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Analyzing...' : '⚡ Analyze & Optimize'}
          </button>
        </form>
        {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card p-8 text-center animate-fadeIn">
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p className="mt-4 text-[var(--text-muted)]">Analyzing {url}...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overall Score */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">SEO Score</h3>
                <p className="text-sm text-[var(--text-muted)]">{result.url}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg border-2 ${getScoreBg(result.overall_score)}`}>
                <span className="text-3xl font-bold" style={{ color: getScoreColor(result.overall_score) }}>{result.overall_score}</span>
                <span className="text-lg font-semibold" style={{ color: getScoreColor(result.overall_score) }}>/100</span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-2">
              {result.score_breakdown && Object.entries(result.score_breakdown).map(([category, data]) => (
                <div key={category} className="score-bar">
                  <span className="bar-label capitalize">{category.replace('_', ' ')}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${data.score}%`, background: getScoreColor(data.score) }}></div>
                  </div>
                  <span className="bar-value">{data.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="check-tabs">
            {['overview', 'suggestions', 'meta', 'technical'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
                {tab === 'overview' ? <><IconChart size={14} /> Overview</> : tab === 'suggestions' ? <><IconLightbulb size={14} /> Suggestions</> : tab === 'meta' ? <><IconTag size={14} /> Meta Tags</> : <><IconTool size={14} /> Technical</>}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">Page Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Title', value: result.audit_summary.title || 'Missing', color: result.audit_summary.title_length >= 50 && result.audit_summary.title_length <= 60 ? '#22c55e' : '#f59e0b' },
                  { label: 'Meta Description', value: result.audit_summary.meta_description ? 'Present' : 'Missing', color: result.audit_summary.meta_desc_length >= 120 ? '#22c55e' : '#ef4444' },
                  { label: 'Word Count', value: result.audit_summary.word_count, color: result.audit_summary.word_count >= 300 ? '#22c55e' : '#f59e0b' },
                  { label: 'Load Time', value: `${result.audit_summary.load_time}s`, color: result.audit_summary.load_time < 2 ? '#22c55e' : '#ef4444' },
                  { label: 'Page Size', value: `${result.audit_summary.page_size_kb}KB`, color: result.audit_summary.page_size_kb < 500 ? '#22c55e' : '#f59e0b' },
                  { label: 'Internal Links', value: result.audit_summary.internal_links, color: result.audit_summary.internal_links > 5 ? '#22c55e' : '#f59e0b' },
                  { label: 'Images', value: `${result.audit_summary.images_total} (${result.audit_summary.images_missing_alt} missing alt)`, color: result.audit_summary.images_missing_alt === 0 ? '#22c55e' : '#ef4444' },
                  { label: 'SSL/HTTPS', value: result.audit_summary.has_ssl ? 'Yes' : 'No', color: result.audit_summary.has_ssl ? '#22c55e' : '#ef4444' },
                  { label: 'Schema Markup', value: result.audit_summary.has_schema ? 'Yes' : 'No', color: result.audit_summary.has_schema ? '#22c55e' : '#f59e0b' },
                  { label: 'Robots.txt', value: result.audit_summary.has_robots_txt ? 'Yes' : 'No', color: result.audit_summary.has_robots_txt ? '#22c55e' : '#f59e0b' },
                  { label: 'Sitemap', value: result.audit_summary.has_sitemap ? 'Yes' : 'No', color: result.audit_summary.has_sitemap ? '#22c55e' : '#f59e0b' },
                  { label: 'OG Tags', value: result.audit_summary.og_tags, color: result.audit_summary.og_tags >= 4 ? '#22c55e' : '#f59e0b' },
                ].map((item) => (
                  <div key={item.label} className="bg-[var(--light)] p-3 rounded-lg">
                    <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                    <p className="font-semibold text-sm" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {['critical', 'high', 'medium', 'low', 'tips'].map(severity => {
                const items = result.suggestions?.[severity] || []
                if (items.length === 0) return null
                const colors = getSuggestionColor(severity)
                return (
                  <div key={severity} className="glass-card p-6">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.badge}`}>{severity}</span>
                      {items.length} {severity === 'tips' ? 'Tips' : 'Issues'}
                    </h3>
                    <div className="space-y-3">
                      {items.map((item, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[var(--text)]">{item.title}</p>
                              <p className="text-sm text-[var(--text-muted)] mt-1">{item.description}</p>
                              {item.fix && (
                                <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">How to fix:</p>
                                  <p className="text-sm text-[var(--text)]">{item.fix}</p>
                                </div>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${colors.badge}`}>{item.impact || item.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Meta Tags Tab */}
          {activeTab === 'meta' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">Optimized Meta Tags</h3>
              {result.optimized_meta && (
                <div className="space-y-4">
                  <div className="bg-[var(--light)] p-4 rounded-lg">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Current Title ({result.optimized_meta.current_title?.length || 0} chars)</p>
                    <p className="font-medium text-[var(--text)]">{result.optimized_meta.current_title || '(none)'}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Suggested Title ({result.optimized_meta.suggested_title?.length || 0} chars)</p>
                    <p className="font-medium text-green-800">{result.optimized_meta.suggested_title}</p>
                  </div>
                  <div className="bg-[var(--light)] p-4 rounded-lg">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Current Description ({result.optimized_meta.current_description?.length || 0} chars)</p>
                    <p className="text-sm text-[var(--text)]">{result.optimized_meta.current_description || '(none)'}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Suggested Description ({result.optimized_meta.suggested_description?.length || 0} chars)</p>
                    <p className="text-sm text-green-800">{result.optimized_meta.suggested_description}</p>
                  </div>
                  <div className="bg-[var(--dark)] p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">HTML Code</p>
                    <pre className="text-green-400 text-sm whitespace-pre-wrap">{result.optimized_meta.html_code}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Technical Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              {result.score_breakdown && Object.entries(result.score_breakdown).map(([category, data]) => (
                <div key={category} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[var(--text)] capitalize">{category.replace('_', ' ')}</h3>
                    <span className="text-xl font-bold" style={{ color: getScoreColor(data.score) }}>{data.score}%</span>
                  </div>
                  <div className="space-y-2">
                    {data.details?.map((detail, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${detail.status === 'pass' ? 'bg-green-500' : detail.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm font-medium text-[var(--text)]">{detail.check}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[var(--text-muted)]">{detail.detail}</span>
                          <span className="text-sm font-semibold" style={{ color: detail.status === 'pass' ? '#22c55e' : detail.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                            {detail.score}/{detail.max}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
