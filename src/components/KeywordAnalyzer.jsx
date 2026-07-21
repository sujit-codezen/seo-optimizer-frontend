import { useState } from 'react'
import axios from 'axios'
import { IconTag, IconCheck, IconX } from './Icons'

export default function KeywordAnalyzer() {
  const [form, setForm] = useState({ content: '', target_keyword: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) { setError('Please enter content'); return }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/keywords/', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed.')
    } finally { setLoading(false) }
  }

  const getDensityColor = (d) => d > 2 ? '#059669' : d > 1 ? '#d97706' : '#4f46e5'
  const getDensityBg = (d) => d > 2 ? 'rgba(5,150,105,0.12)' : d > 1 ? 'rgba(217,119,6,0.12)' : 'rgba(79,70,229,0.12)'
  const maxDensity = result?.keywords?.length ? Math.max(...result.keywords.map(k => k.density)) : 1

  const getLiveKeywords = () => {
    if (!form.content.trim()) return []
    const words = form.content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3)
    const freq = {}
    words.forEach(w => freq[w] = (freq[w] || 0) + 1)
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="form-card animate-fadeIn">
        <h2>Keyword Analyzer</h2>
        <p className="subtitle">Extract and analyze keywords from your content</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Content</label>
            <textarea className="input-field" rows="12" placeholder="Paste your content here..." required
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <p className="hint">{form.content.split(/\s+/).filter(Boolean).length} words</p>
          </div>
          <div className="form-group">
            <label>Target Keyword (optional)</label>
            <input type="text" className="input-field" placeholder="e.g., python tutorial"
              value={form.target_keyword} onChange={(e) => setForm({ ...form, target_keyword: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Analyzing...' : 'Analyze Keywords'}
          </button>
        </form>
        {error && <div className="mt-4 p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg text-[var(--danger)] text-sm">{error}</div>}
      </div>

      <div className="space-y-5 animate-fadeIn">
        {!result && form.content.trim().split(/\s+/).filter(Boolean).length > 5 && (
          <div className="preview-section">
            <h4>Keyword Preview</h4>
            <div className="keyword-cloud">
              {getLiveKeywords().map(([word, count], i) => {
                const max = getLiveKeywords()[0]?.[1] || 1
                const size = 0.75 + (count / max) * 0.75
                const opacity = 0.5 + (count / max) * 0.5
                return (
                  <span key={i} className="kw-tag" style={{
                    fontSize: `${size}rem`, opacity,
                    background: getDensityBg(count / form.content.split(/\s+/).length * 100),
                    color: getDensityColor(count / form.content.split(/\s+/).length * 100),
                  }}>
                    {word} <span style={{ marginLeft: 4, fontSize: '0.65rem', opacity: 0.7 }}>{count}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {!result && !(form.content.trim().split(/\s+/).filter(Boolean).length > 5) && (
          <div className="preview-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div className="text-center text-[var(--text-muted)]">
              <IconTag size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Paste content to see keyword preview</p>
            </div>
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">Total Words</p>
                <p className="text-2xl font-extrabold text-[var(--text)]">{result.word_count}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">Unique Keywords</p>
                <p className="text-2xl font-extrabold text-[var(--text)]">{result.unique_keywords}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">Top Keyword</p>
                <p className="text-sm font-bold text-[var(--primary)] truncate">{result.top_keyword?.word || '—'}</p>
              </div>
            </div>

            <div className="result-card">
              <h3>Keyword Cloud</h3>
              <div className="keyword-cloud">
                {result.keywords?.slice(0, 25).map((kw, i) => {
                  const size = 0.75 + (kw.density / maxDensity) * 0.75
                  const opacity = 0.5 + (kw.density / maxDensity) * 0.5
                  return (
                    <span key={i} className="kw-tag" style={{
                      fontSize: `${size}rem`, opacity,
                      background: getDensityBg(kw.density), color: getDensityColor(kw.density),
                    }}>
                      {kw.word} <span style={{ marginLeft: 4, fontSize: '0.65rem', opacity: 0.7 }}>{kw.count}</span>
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="result-card">
              <h3>Keyword Density</h3>
              <div className="density-chart">
                {result.keywords?.slice(0, 12).map((kw, i) => (
                  <div key={i} className="density-row">
                    <span className="kw-label">{kw.word}</span>
                    <div className="bar-wrap">
                      <div className="bar-inner" style={{
                        width: `${Math.max((kw.density / maxDensity) * 100, 8)}%`,
                        background: getDensityColor(kw.density),
                      }}>
                        <span>{kw.density}%</span>
                      </div>
                    </div>
                    <span className="count-badge">{kw.count}x</span>
                  </div>
                ))}
              </div>
            </div>

            {form.target_keyword && result.target_keyword_analysis && (
              <div className="result-card">
                <h3>Target Keyword: "{form.target_keyword}"</h3>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Found</p>
                    <div className="flex items-center justify-center gap-1">
                      {result.target_keyword_analysis.found ? (
                        <><IconCheck size={18} className="text-emerald-600" /><span className="text-lg font-bold text-emerald-600">Yes</span></>
                      ) : (
                        <><IconX size={18} className="text-red-600" /><span className="text-lg font-bold text-red-600">No</span></>
                      )}
                    </div>
                  </div>
                  <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Count</p>
                    <p className="text-lg font-bold text-[var(--text)]">{result.target_keyword_analysis.count || 0}</p>
                  </div>
                  <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Density</p>
                    <p className="text-lg font-bold text-[var(--text)]">{result.target_keyword_analysis.density || 0}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="result-card">
              <h3>All Keywords ({result.keywords?.length || 0})</h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords?.map((kw, i) => (
                  <span key={i} className="kw-tag" style={{
                    background: getDensityBg(kw.density), color: getDensityColor(kw.density), fontSize: '0.8125rem',
                  }}>
                    {kw.word} ({kw.density}%)
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
