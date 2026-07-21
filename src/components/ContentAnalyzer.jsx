import { useState } from 'react'
import axios from 'axios'
import { IconGlobe, IconLightbulb } from './Icons'

export default function ContentAnalyzer() {
  const [form, setForm] = useState({ title: '', content: '', target_keyword: '', meta_description: '', url: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) { setError('Please enter content to analyze'); return }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/analyze/', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed.')
    } finally { setLoading(false) }
  }

  const getScoreColor = (score) => score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const truncate = (str, len) => str && str.length > len ? str.slice(0, len) + '...' : str || ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="form-card animate-fadeIn">
        <h2>Content Analysis</h2>
        <p className="subtitle">Analyze your content for SEO optimization</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Page Title</label>
            <input type="text" className="input-field" placeholder="Enter your page title"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Target Keyword</label>
            <input type="text" className="input-field" placeholder="e.g., python tutorial"
              value={form.target_keyword} onChange={(e) => setForm({ ...form, target_keyword: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Meta Description</label>
            <textarea className="input-field" rows="2" placeholder="120-160 characters"
              value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea className="input-field" rows="10" placeholder="Paste your content here..."
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <p className="hint">{form.content.split(/\s+/).filter(Boolean).length} words</p>
          </div>
          <div className="form-group">
            <label>URL (optional)</label>
            <input type="url" className="input-field" placeholder="https://example.com/page"
              value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Analyzing...' : 'Analyze SEO'}
          </button>
        </form>
        {error && <div className="mt-4 p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg text-[var(--danger)] text-sm">{error}</div>}
      </div>

      <div className="space-y-5 animate-fadeIn">
        {!result && (form.title || form.meta_description) && (
          <div className="preview-section">
            <h4>Google Search Preview</h4>
            <div className="google-preview">
              <div className="url-line">
                <div className="favicon"><IconGlobe size={14} /></div>
                <div>
                  <div className="site-url">{form.url || 'https://example.com'}</div>
                  <div className="breadcrumb">{form.url || 'https://example.com'} › page</div>
                </div>
              </div>
              <div className="title">{truncate(form.title, 60)}</div>
              <div className="description">{truncate(form.meta_description || 'Add a meta description to see preview...', 160)}</div>
            </div>
          </div>
        )}

        {!result && !form.title && !form.meta_description && (
          <div className="preview-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div className="text-center text-[var(--text-muted)]">
              <IconGlobe size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Fill the form to see live preview</p>
            </div>
          </div>
        )}

        {result && (
          <>
            <div className="preview-section">
              <h4>Google Search Preview</h4>
              <div className="google-preview">
                <div className="url-line">
                  <div className="favicon"><IconGlobe size={14} /></div>
                  <div>
                    <div className="site-url">{form.url || 'https://example.com'}</div>
                    <div className="breadcrumb">{form.url || 'https://example.com'} › page</div>
                  </div>
                </div>
                <div className="title">{truncate(form.title || result.title, 60)}</div>
                <div className="description">{truncate(form.meta_description || result.meta_description || 'No description', 160)}</div>
              </div>
            </div>

            <div className="result-card text-center">
              <h3>Overall Score</h3>
              <div className="score-ring" style={{ width: 120, height: 120, margin: '0 auto' }}>
                <svg width={120} height={120}>
                  <circle cx={60} cy={60} r={52} fill="none" stroke="#e2e8f0" strokeWidth={10} />
                  <circle cx={60} cy={60} r={52} fill="none" stroke={getScoreColor(result.overall_score)}
                    strokeWidth={10} strokeDasharray={326.7} strokeDashoffset={326.7 - (result.overall_score / 100) * 326.7}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                </svg>
                <span className="score-value">{result.overall_score}</span>
              </div>
              <p className="mt-2 font-semibold text-sm" style={{ color: getScoreColor(result.overall_score) }}>
                {result.overall_score >= 80 ? 'Good' : result.overall_score >= 50 ? 'Needs Work' : 'Poor'}
              </p>
            </div>

            <div className="result-card">
              <h3>Score Breakdown</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Title', score: result.title_score },
                  { label: 'Meta Description', score: result.meta_score },
                  { label: 'Content Quality', score: result.content_score },
                  { label: 'Readability', score: result.readability_score },
                  { label: 'Keywords', score: result.keyword_score },
                  { label: 'Headings', score: result.heading_score },
                  { label: 'URL', score: result.url_score },
                ].map((item) => (
                  <div key={item.label} className="score-bar">
                    <span className="bar-label">{item.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${item.score}%`, background: getScoreColor(item.score) }}></div>
                    </div>
                    <span className="bar-value">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {result.readability && (
              <div className="result-card">
                <h3>Readability</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Flesch Score', value: result.readability.flesch_kincaid },
                    { label: 'Level', value: result.readability.level },
                    { label: 'Words', value: result.readability.word_count },
                    { label: 'Sentences', value: result.readability.sentence_count },
                  ].map((item) => (
                    <div key={item.label} className="bg-[var(--surface)] p-3 rounded-lg text-center">
                      <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                      <p className="text-lg font-bold text-[var(--text)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="result-card">
                <h3>Suggestions</h3>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-[var(--surface)] rounded-lg">
                      <IconLightbulb size={16} className="mt-0.5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm text-[var(--text-secondary)]">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
