import { useState } from 'react'
import axios from 'axios'
import { IconGlobe, IconImage, IconLightbulb } from './Icons'

export default function MetaTagGenerator() {
  const [form, setForm] = useState({ title: '', content: '', url: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required'); return }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/meta-tags/', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed.')
    } finally { setLoading(false) }
  }

  const truncate = (str, len) => str && str.length > len ? str.slice(0, len) + '...' : str || ''
  const getScoreColor = (s) => s >= 70 ? '#059669' : s >= 40 ? '#d97706' : '#dc2626'
  const suggestedTitle = result?.suggested_title || result?.optimized?.title || ''
  const suggestedDesc = result?.suggested_description || result?.optimized?.description || ''

  const getDomain = () => {
    try { return form.url ? new URL(form.url.startsWith('http') ? form.url : `https://${form.url}`).hostname : 'example.com' }
    catch { return 'example.com' }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="form-card animate-fadeIn">
        <h2>Meta Tag Generator</h2>
        <p className="subtitle">Generate optimized meta tags for your page</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Page Title</label>
            <input type="text" className="input-field" placeholder="Your page title" required
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <p className="hint">{form.title.length}/60 characters</p>
          </div>
          <div className="form-group">
            <label>URL (optional)</label>
            <input type="url" className="input-field" placeholder="https://example.com"
              value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Page Content</label>
            <textarea className="input-field" rows="10" placeholder="Paste your page content..." required
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Generating...' : 'Generate Meta Tags'}
          </button>
        </form>
        {error && <div className="mt-4 p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg text-[var(--danger)] text-sm">{error}</div>}
      </div>

      <div className="space-y-5 animate-fadeIn">
        {!result && form.title && (
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
              <div className="description">Add content to generate a meta description...</div>
            </div>
          </div>
        )}

        {!result && !form.title && (
          <div className="preview-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div className="text-center text-[var(--text-muted)]">
              <IconGlobe size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Fill the form to see live preview</p>
            </div>
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card text-center">
                <h3 className="mb-3">Title Score</h3>
                <div className="score-ring" style={{ width: 90, height: 90, margin: '0 auto' }}>
                  <svg width={90} height={90}>
                    <circle cx={45} cy={45} r={38} fill="none" stroke="#e2e8f0" strokeWidth={7} />
                    <circle cx={45} cy={45} r={38} fill="none" stroke={getScoreColor(result.title_score)}
                      strokeWidth={7} strokeDasharray={239} strokeDashoffset={239 - (result.title_score / 100) * 239}
                      strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                  </svg>
                  <span className="score-num" style={{ color: getScoreColor(result.title_score) }}>{result.title_score}</span>
                </div>
              </div>
              <div className="result-card text-center">
                <h3 className="mb-3">Meta Score</h3>
                <div className="score-ring" style={{ width: 90, height: 90, margin: '0 auto' }}>
                  <svg width={90} height={90}>
                    <circle cx={45} cy={45} r={38} fill="none" stroke="#e2e8f0" strokeWidth={7} />
                    <circle cx={45} cy={45} r={38} fill="none" stroke={getScoreColor(result.meta_score)}
                      strokeWidth={7} strokeDasharray={239} strokeDashoffset={239 - (result.meta_score / 100) * 239}
                      strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                  </svg>
                  <span className="score-num" style={{ color: getScoreColor(result.meta_score) }}>{result.meta_score}</span>
                </div>
              </div>
            </div>

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
                <div className="title">{truncate(suggestedTitle || form.title, 60)}</div>
                <div className="description">{truncate(suggestedDesc || 'No description generated', 160)}</div>
              </div>
            </div>

            <div className="preview-section">
              <h4>Social Media Preview</h4>
              <div className="social-preview">
                <div className="social-img"><IconImage size={32} /></div>
                <div className="social-body">
                  <div className="social-domain">{getDomain()}</div>
                  <div className="social-title">{truncate(suggestedTitle || form.title, 60)}</div>
                  <div className="social-desc">{truncate(suggestedDesc || 'No description', 120)}</div>
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3>Generated HTML</h3>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">{result.meta_tags?.html || '—'}</pre>
              </div>
            </div>

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
