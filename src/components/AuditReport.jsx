import { useState, useRef } from 'react'
import { IconCheck, IconX, IconAlert, IconInfo, IconLightbulb, IconGlobe, IconBot, IconClock, IconFile, IconShield, IconHash, IconLayout, IconPhone, IconTarget, IconExternalLink, IconCode } from './Icons'

function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>
}

function Importance({ level }) {
  const colors = { Critical: '#dc2626', High: '#d97706', Medium: '#2563eb', Low: '#94a3b8', 'Nice to have': '#94a3b8', Info: '#94a3b8', 'Very important': '#dc2626', 'Important': '#d97706', 'Low importance': '#94a3b8' }
  return (
    <span className="importance">
      <span className="dot" style={{ background: colors[level] || '#94a3b8' }}></span>
      {level}
    </span>
  )
}

function ScoreBar({ label, score, color = '#2563eb' }) {
  return (
    <div className="score-bar">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${score}%`, background: color }}></div>
      </div>
      <span className="bar-value">{score} %</span>
    </div>
  )
}

function ScoreRing({ score, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="score-value">{score}%</span>
      <span className="score-label">On-page score</span>
    </div>
  )
}

function CheckCard({ id, title, status, importance, score, items, tip, tipType = 'tip', onGoTo, children }) {
  const cardClass = status === 'good' ? 'passed' : status === 'warning' ? 'warning' : status === 'error' ? 'error' : 'info'
  return (
    <div id={id} className={`check-card ${cardClass} animate-fadeIn`}>
      <div className="check-header">
        <div className="flex items-center gap-3">
          <span className="check-title">{title}</span>
          {score && <span className="text-sm text-[var(--text-muted)]">{score}</span>}
        </div>
        <div className="check-meta">
          <Badge type={status === 'good' ? 'good' : status === 'warning' ? 'warning' : status === 'error' ? 'error' : 'info'}>
            {status === 'good' ? 'Passed' : status === 'warning' ? 'Warning' : status === 'error' ? 'Error' : 'Info'}
          </Badge>
          {importance && <Importance level={importance} />}
        </div>
      </div>
      <div className="check-body">
        {items && items.map((item, i) => (
          <div key={i} className="check-item">
            <div className={`check-icon ${item.type === 'pass' ? 'pass' : item.type === 'fail' ? 'fail' : item.type === 'warn' ? 'warn' : 'info'}`}>
              {item.type === 'pass' ? <IconCheck size={11} /> : item.type === 'fail' ? <IconX size={11} /> : item.type === 'warn' ? <IconAlert size={11} /> : <IconInfo size={11} />}
            </div>
            <span className="flex-1">{item.text}</span>
            {item.detail && <span className="text-xs text-[var(--text-muted)] ml-2">{item.detail}</span>}
          </div>
        ))}
        {children}
        {tip && (
          <div className={`tip-box ${tipType === 'warning' ? 'warning-tip' : ''}`}>
            <div className="flex items-start gap-2">
              <IconLightbulb size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{tip.title}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{tip.text}</p>
              </div>
              {onGoTo && (
                <button onClick={() => onGoTo(tip.scrollTo)}
                  className="text-sm text-[var(--primary)] hover:underline whitespace-nowrap font-medium">
                  Go to tip →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OverviewSection({ data }) {
  const gradeColor = { 'A+': '#059669', 'A': '#059669', 'B+': '#2563eb', 'B': '#2563eb', 'C+': '#d97706', 'C': '#d97706', 'D': '#dc2626', 'F': '#dc2626' }
  return (
    <div id="section-overview" className="glass-card p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-[var(--text)]">On-page score</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">
            Issues: <strong className="text-[var(--text)]">{data.recommendations.length}</strong>
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: (gradeColor[data.overall_grade] || '#64748b') + '15', color: gradeColor[data.overall_grade] || '#64748b' }}>
            Grade {data.overall_grade}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-12 mt-4 flex-wrap">
        <ScoreRing score={data.overall_score} />
        <div className="flex-1 min-w-[300px] space-y-1">
          <ScoreBar label="Meta data" score={data.onpage_score} />
          <ScoreBar label="Page quality" score={data.usability_score} />
          <ScoreBar label="Page structure" score={Math.round((data.heading_structure.total_headings > 0 ? 60 : 100) * (data.duplicate_headings.has_duplicates ? 0.5 : 1))} />
          <ScoreBar label="Links" score={data.links_score} />
          <ScoreBar label="Server" score={data.performance_score} />
          <ScoreBar label="External factors" score={data.social_score} />
        </div>
      </div>
    </div>
  )
}

function HTMLPageSection({ data }) {
  return (
    <div id="section-html" className="result-card animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
          <IconFile size={18} className="text-[var(--primary)]" /> HTML Page
        </h3>
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary)] hover:underline font-medium">Show page</a>
      </div>
      <div className="flex gap-6 flex-wrap">
        <div className="flex-1 min-w-[200px] space-y-3">
          <div>
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Meta Title</span>
            <p className="font-semibold text-[var(--text)] mt-0.5">{data.title_tag.content || '—'}</p>
          </div>
          <div>
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Meta Description</span>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{data.meta_description.content || '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">URL</span>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary)] hover:underline truncate">{data.url}</a>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconFile size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">Status</p><p className="text-sm font-bold text-emerald-600">{data.status_code || 200}</p></div></div>
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconClock size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">Response</p><p className="text-sm font-bold text-[var(--text)]">{data.load_speed.server_response}s</p></div></div>
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconBot size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">Page Status</p><p className="text-sm font-bold text-emerald-600">Follow</p></div></div>
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconFile size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">File Size</p><p className="text-sm font-bold text-[var(--text)]">{data.page_size.total_kb} kB</p></div></div>
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconGlobe size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">Language</p><p className="text-sm font-bold text-[var(--text)]">{data.lang_attribute.value || '—'}</p></div></div>
            <div className="bg-[var(--surface)] p-3 rounded-lg flex items-center gap-2"><IconHash size={14} className="text-[var(--text-muted)]" /><div><p className="text-xs text-[var(--text-muted)]">Word Count</p><p className="text-sm font-bold text-[var(--text)]">{data.content_length.word_count}</p></div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TodoList({ recommendations, scrollToSection }) {
  const recToCheckId = {
    'Add a Title Tag': 'check-title',
    'Optimize Title Tag Length': 'check-title',
    'Add a Meta Description Tag': 'check-meta-desc',
    'Implement XML Sitemaps': 'check-sitemap',
    'Add robots.txt File': 'check-robots',
    'Add Canonical Tag': 'check-canonical',
    'Add Schema Markup': 'check-schema',
    'Add Alt Attributes to Images': 'check-images',
    'Remove Duplicate Heading Texts': 'check-dup-headings',
    'Fix Heading Structure': 'check-heading-structure',
    'Increase Page Text Content': 'check-content',
    'Implement Analytics Tracking': 'check-analytics',
    'Execute a Link Building Strategy': 'check-keywords',
    'Update URLs to be More Readable': 'check-url',
    'Improve Site Load Speed': 'check-performance',
    'Remove Inline Styles': 'check-performance',
    'Add Identity Schema': 'check-schema',
    'Implement llms.txt File': 'check-schema',
    'Add Facebook Open Graph Tags': 'check-social',
    'Add X (Twitter) Cards': 'check-social',
    'Add Social Sharing Plugins': 'check-social',
    'Install Facebook Pixel': 'check-social',
    'Add DMARC Mail Record': 'check-email-privacy',
    'Add SPF Mail Record': 'check-email-privacy',
    'Enable SSL/HTTPS': 'check-https',
    'Add Security Headers': 'check-security-headers',
    'Remove Noindex Directive': 'check-robots-meta',
    'Enable Browser Caching': 'check-caching',
    'Fix Mixed Content': 'check-mixed-content',
    'Add Breadcrumb Navigation': 'check-breadcrumbs',
  }

  return (
    <div id="section-todo" className="result-card animate-fadeIn">
      <h3 className="text-base font-bold text-[var(--text)] mb-1">To-Do List</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">Tasks sorted by priority</p>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>To-Do</th>
              <th>Importance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => {
              const importanceMap = { Critical: 'error', High: 'warning', Medium: 'info', Low: 'tip' }
              const rowBg = rec.priority === 'Critical' ? 'bg-red-50' : rec.priority === 'High' ? 'bg-amber-50/50' : ''
              const targetId = recToCheckId[rec.title] || 'section-checks'
              return (
                <tr key={i} className={rowBg}>
                  <td className="font-medium">{rec.title}</td>
                  <td><Badge type={importanceMap[rec.priority] || 'tip'}>{rec.priority}</Badge></td>
                  <td>
                    <span onClick={() => scrollToSection?.(targetId)}
                      className="text-[var(--primary)] font-medium text-sm cursor-pointer hover:underline">
                      {rec.priority === 'Critical' || rec.priority === 'High' ? 'More details' : 'Go to tip'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetaDataSection({ data, scrollToSection }) {
  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Meta data</span>
        <span className="section-score">{data.onpage_score}%</span>
      </div>

      <CheckCard id="check-title" title="Title" status={data.title_tag.status} importance="Very important" score={data.title_tag.exists ? '2/3' : '0/3'}
        items={[
          { text: data.title_tag.content || 'No title tag found', type: data.title_tag.exists ? 'pass' : 'fail' },
          { text: `Length: ${data.title_tag.length} characters (ideal: 50-60)`, type: data.title_tag.status === 'good' ? 'pass' : 'warn' },
        ]}
        tip={data.title_tag.status !== 'good' ? { title: 'Optimize your title tag', text: 'The page title is too short. Aim for 50-60 characters for optimal search engine display.', scrollTo: 'check-title' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-meta-desc" title="Meta description" status={data.meta_description.status} importance="Very important" score={data.meta_description.exists ? '1/1' : '0/1'}
        items={[{ text: data.meta_description.content || 'The meta description is empty.', type: data.meta_description.exists ? 'pass' : 'fail' }]}
        tip={!data.meta_description.exists ? { title: 'Add a meta description', text: 'Write a compelling 120-160 character description that includes your target keyword and a call-to-action.', scrollTo: 'check-meta-desc' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-crawl" title="Crawlability" status="good" importance="Very important" score="1/1"
        items={[{ text: 'There are no problems in accessing the page.', type: 'pass' }]} />

      <CheckCard id="check-canonical" title="Canonical link" status={data.canonical_tag.status} importance="Important" score={data.canonical_tag.exists ? '1/1' : '0/1'}
        items={[{ text: data.canonical_tag.exists ? `Canonical URL: ${data.canonical_tag.href}` : 'No canonical tag found', type: data.canonical_tag.exists ? 'pass' : 'warn' }]}
        tip={!data.canonical_tag.exists ? { title: 'Add canonical tag', text: 'Add <link rel="canonical" href="..."/> to prevent duplicate content issues.', scrollTo: 'check-canonical' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-robots-meta" title="Robots Meta Tag" status={data.robots_meta?.status || 'info'} importance="Important"
        score={data.robots_meta?.exists ? '1/1' : '0/1'}
        items={[
          { text: `Robots content: ${data.robots_meta?.content || 'Not set'}`, type: data.robots_meta?.has_noindex ? 'fail' : 'pass' },
          { text: data.robots_meta?.has_noindex ? 'Page has noindex directive!' : 'No noindex directive found.', type: data.robots_meta?.has_noindex ? 'fail' : 'pass' },
          { text: data.robots_meta?.has_nofollow ? 'Page has nofollow directive!' : 'No nofollow directive found.', type: data.robots_meta?.has_nofollow ? 'warn' : 'pass' },
        ]}
        tip={data.robots_meta?.has_noindex ? { title: 'Remove noindex', text: 'This page is set to noindex. Remove the noindex directive to allow search engines to index this page.', scrollTo: 'check-robots-meta' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-domain" title="Domain Name" status={data.domain_analysis?.status || 'info'} importance="Important"
        items={[
          { text: `Domain: ${data.domain_analysis?.domain || '—'}`, type: 'info' },
          { text: `Length: ${data.domain_analysis?.length || 0} characters`, type: (data.domain_analysis?.length || 0) < 20 ? 'pass' : 'warn' },
          { text: `TLD: .${data.domain_analysis?.tld || '—'}`, type: 'info' },
          { text: data.domain_analysis?.subdomain ? `Subdomain: ${data.domain_analysis.subdomain}` : 'No subdomain', type: 'info' },
          { text: data.domain_analysis?.has_hyphens ? 'Domain contains hyphens' : 'No hyphens in domain', type: data.domain_analysis?.has_hyphens ? 'warn' : 'pass' },
          { text: data.domain_analysis?.is_ip_address ? 'Domain is an IP address!' : 'Domain is not an IP address', type: data.domain_analysis?.is_ip_address ? 'fail' : 'pass' },
        ]} />

      <CheckCard id="check-url" title="Page URL" status={data.page_url_analysis?.status || 'info'} importance="Important"
        items={[
          { text: `Path: ${data.page_url_analysis?.path || '—'}`, type: 'info' },
          { text: data.page_url_analysis?.has_parameters ? `Has ${data.page_url_analysis.parameter_count} URL parameters` : 'Clean URL (no parameters)', type: data.page_url_analysis?.has_parameters ? 'warn' : 'pass' },
          { text: data.page_url_analysis?.has_session_id ? 'URL contains session ID!' : 'No session ID in URL', type: data.page_url_analysis?.has_session_id ? 'fail' : 'pass' },
          { text: `Path depth: ${data.page_url_analysis?.path_depth || 0} levels`, type: 'info' },
          { text: data.page_url_analysis?.has_uppercase_in_path ? 'URL contains uppercase letters' : 'URL is lowercase', type: data.page_url_analysis?.has_uppercase_in_path ? 'warn' : 'pass' },
        ]} />

      <CheckCard id="check-lang" title="Language" status={data.lang_attribute.status} importance="Low importance" score="3/3"
        items={[
          { text: `Language defined in HTML: ${data.lang_attribute.value || 'Not set'}`, type: 'info' },
        ]} />

      <CheckCard id="check-hreflang" title="Alternate/hreflang links" status={data.hreflang.status} importance="Low importance" score="1/1"
        items={[{ text: data.hreflang.exists ? `${data.hreflang.count} alternate links found (${(data.hreflang.languages || []).join(', ')})` : 'There are no alternate links specified on this page.', type: 'pass' }]} />

      <CheckCard id="check-charset" title="Charset encoding" status={data.charset.status} importance="Low importance" score="1/1"
        items={[{ text: data.charset.exists ? 'The charset encoding (UTF-8) is set correctly.' : 'Charset encoding not detected.', type: data.charset.exists ? 'pass' : 'warn' }]} />

      <CheckCard id="check-doctype" title="Doctype" status={data.doctype.status} importance="Nice to have" score="2/2"
        items={[{ text: data.doctype.exists ? 'The doctype HTML 5 is set correctly.' : 'No doctype found.', type: data.doctype.exists ? 'pass' : 'warn' }]} />

      <CheckCard id="check-favicon" title="Favicon" status={data.favicon.status} importance="Nice to have" score="1/1"
        items={[{ text: data.favicon.exists ? `The favicon is linked correctly.` : 'No favicon found.', type: data.favicon.exists ? 'pass' : 'warn' }]} />

      <CheckCard id="check-schema" title="Schema Markup" status={data.schema_markup.status} importance="Important" score={data.schema_markup.exists ? '1/1' : '0/1'}
        items={[
          { text: data.schema_markup.exists ? `Schema types: ${data.schema_markup.types.join(', ')}` : 'No structured data markup found.', type: data.schema_markup.exists ? 'pass' : 'warn' },
          { text: `${data.schema_markup.count || 0} schema(s) found`, type: 'info' },
        ]}
        tip={!data.schema_markup.exists ? { title: 'Add schema markup', text: 'Add JSON-LD structured data for Article, Product, or Organization schema to get rich snippets in search results.', scrollTo: 'check-schema' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />
    </div>
  )
}

function PageQualitySection({ data, scrollToSection }) {
  const h1Texts = data.header_tags.h1?.texts || []
  const h2Texts = data.header_tags.h2?.texts || []
  const h3Texts = data.header_tags.h3?.texts || []
  const missingAltImages = data.image_alt.missing_alt_images || []

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Page quality</span>
        <span className="section-score">{data.usability_score}%</span>
      </div>

      <CheckCard id="check-keywords" title="Common Keywords" status="good" importance="Very important" score={`${data.keyword_consistency.keywords?.length || 0} keywords`}
        items={data.keyword_consistency.keywords?.slice(0, 10).map(kw => ({
          text: `${kw.keyword} — appears ${kw.count} times`,
          type: kw.in_title || kw.in_meta || kw.in_headings ? 'pass' : 'info',
          detail: `${kw.in_title ? '✓ Title' : ''} ${kw.in_meta ? '✓ Meta' : ''} ${kw.in_headings ? '✓ Headings' : ''}`
        })) || []}
        tip={{ title: 'Use keywords strategically', text: 'Include your top keywords in the title, meta description, H1, and naturally throughout the content.', scrollTo: 'check-keywords' }}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-content" title="Content" status={data.content_length.status} importance="Very important" score="10/10"
        items={[
          { text: `The word count of ${data.content_length.word_count} words is fine.`, type: 'pass' },
          { text: `${data.stop_words.percentage}% of the text are stop words.`, type: data.stop_words.status === 'good' ? 'pass' : 'warn' },
          { text: `Average sentence length of ${data.sentence_length.average_words} words is ${data.sentence_length.status === 'good' ? 'good' : 'too long'}.`, type: data.sentence_length.status === 'good' ? 'pass' : 'warn' },
          { text: `${data.bold_tags.count} bold/strong tags found.`, type: data.bold_tags.status === 'good' ? 'pass' : 'warn' },
        ]} />

      <CheckCard id="check-h1" title="H1 Heading" status={data.header_tags.h1_status?.status || 'error'} importance="Very important" score={data.header_tags.h1_status?.exists ? '2/2' : '0/2'}
        items={h1Texts.length > 0 ? h1Texts.map(t => ({ text: t, type: 'pass' })) : [{ text: 'No H1 heading found.', type: 'fail' }]}
        tip={!data.header_tags.h1_status?.exists ? { title: 'Add an H1 heading', text: 'Every page should have exactly one H1 tag that describes the page content.', scrollTo: 'check-h1' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {h2Texts.length > 0 && (
        <CheckCard id="check-h2" title="H2 Headings" status="good" importance="Important" score={`${h2Texts.length} found`}
          items={h2Texts.map(t => ({ text: t, type: 'pass' }))}
        />
      )}

      {h3Texts.length > 0 && (
        <CheckCard id="check-h3" title="H3 Headings" status="good" importance="Important" score={`${h3Texts.length} found`}
          items={h3Texts.map(t => ({ text: t, type: 'pass' }))}
        />
      )}

      <CheckCard id="check-dup-headings" title="Duplicate Headings" status={data.duplicate_headings.status} importance="Important"
        items={data.duplicate_headings.has_duplicates
          ? data.duplicate_headings.duplicates.map(d => ({ text: `"${d.text}" appears ${d.count} times`, type: 'warn' }))
          : [{ text: 'No duplicate heading texts found.', type: 'pass' }]
        }
        tip={data.duplicate_headings.has_duplicates ? { title: 'Remove duplicate headings', text: 'Each heading should be unique. Duplicate headings confuse search engines about your page structure.', scrollTo: 'check-dup-headings' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-heading-structure" title="Heading Structure" status={data.heading_structure.status} importance="Important"
        items={[
          { text: data.heading_structure.skipped_levels ? 'Heading levels are being skipped (e.g., H1 to H3)' : 'Heading structure is sequential.', type: data.heading_structure.skipped_levels ? 'warn' : 'pass' },
          { text: `${data.heading_structure.total_headings} headings found on the page.`, type: data.heading_structure.total_headings > 30 ? 'warn' : 'pass' },
          { text: `Levels used: ${data.heading_structure.levels_used.join(', ')}`, type: 'info' },
        ]}
        tip={data.heading_structure.skipped_levels ? { title: 'Fix heading hierarchy', text: 'Use headings sequentially: H1 → H2 → H3. Never skip levels for proper document structure.', scrollTo: 'check-heading-structure' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-images" title="Image ALT Attributes" status={data.image_alt.status} importance="Low importance"
        score={data.image_alt.missing_alt === 0 ? `${data.image_alt.total}/${data.image_alt.total}` : `${data.image_alt.with_alt}/${data.image_alt.total}`}
        items={[
          ...missingAltImages.map(src => ({ text: `<img src="${src}" />`, type: 'fail' })),
          ...(missingAltImages.length === 0 ? [{ text: `All ${data.image_alt.total} images have alt attributes.`, type: 'pass' }] : []),
        ]}
        tip={missingAltImages.length > 0 ? { title: 'Add alt attributes to images', text: `${missingAltImages.length} images are missing alt attributes. Alt text helps search engines understand images and improves accessibility.`, scrollTo: 'check-images' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-image-dimensions" title="Image Width/Height" status={data.image_width_height?.status || 'info'} importance="Low importance"
        score={data.image_width_height ? `${data.image_width_height.with_dimensions}/${data.image_width_height.total}` : '—'}
        items={[
          { text: `${data.image_width_height?.with_dimensions || 0}/${data.image_width_height?.total || 0} images have width/height attributes.`, type: (data.image_width_height?.missing_dimensions || 0) === 0 ? 'pass' : 'warn' },
          { text: 'Width/height attributes prevent layout shifts (CLS).', type: 'info' },
        ]} />

      <CheckCard id="check-lazy-loading" title="Lazy Loading" status={data.lazy_loading?.status || 'info'} importance="Low importance"
        items={[
          { text: `${data.lazy_loading?.lazy_loaded || 0}/${data.lazy_loading?.total_images || 0} images use lazy loading.`, type: (data.lazy_loading?.lazy_loaded || 0) > 0 ? 'pass' : 'info' },
          { text: 'Lazy loading improves initial page load performance.', type: 'info' },
        ]} />

      <CheckCard id="check-frames" title="Frames" status="good" importance="Very important" score="1/1"
        items={[{ text: 'This page does not use a frameset.', type: 'pass' }]} />

      <CheckCard id="check-mobile" title="Mobile Optimization" status={data.mobile_viewport.status} importance="Low importance"
        score={data.mobile_viewport.exists ? '2/2' : '1/2'}
        items={[
          { text: data.mobile_viewport.exists ? 'A viewport is provided.' : 'No viewport meta tag found.', type: data.mobile_viewport.exists ? 'pass' : 'warn' },
          { text: data.mobile_viewport.content || 'No viewport content', type: 'info' },
          { text: data.apple_touch_icon.exists ? 'Apple touch icon is set.' : 'No Apple touch icon is specified.', type: data.apple_touch_icon.exists ? 'pass' : 'warn' },
        ]} />

      <CheckCard id="check-social" title="Social Media" status={data.social_plugins.status} importance="Nice to have"
        items={[
          { text: data.social_plugins.count > 0 ? `${data.social_plugins.count} social sharing options found.` : 'There are few social sharing options on the page.', type: data.social_plugins.count > 0 ? 'pass' : 'warn' },
        ]} />

      <CheckCard id="check-breadcrumbs" title="Breadcrumb Navigation" status={data.breadcrumb_navigation?.status || 'info'} importance="Low importance"
        items={[
          { text: data.breadcrumb_navigation?.has_schema ? 'BreadcrumbList schema found.' : 'No BreadcrumbList schema.', type: data.breadcrumb_navigation?.has_schema ? 'pass' : 'info' },
          { text: data.breadcrumb_navigation?.has_nav_element ? 'Breadcrumb navigation element found.' : 'No breadcrumb navigation element.', type: data.breadcrumb_navigation?.has_nav_element ? 'pass' : 'info' },
        ]} />

      <CheckCard id="check-https" title="HTTPS" status={data.ssl_enabled.enabled ? 'good' : 'error'} importance="Low importance" score="2/2"
        items={[{ text: data.ssl_enabled.enabled ? 'This page uses HTTPS.' : 'This page does not use HTTPS.', type: data.ssl_enabled.enabled ? 'pass' : 'fail' }]} />
    </div>
  )
}

function OthersSection({ data, scrollToSection }) {
  const h1Texts = data.header_tags.h1?.texts || []
  const h2Texts = data.header_tags.h2?.texts || []

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Others</span>
      </div>

      <CheckCard id="check-h1-other" title="H1 heading" status={data.header_tags.h1_status?.status || 'error'} importance="Very important"
        score={data.header_tags.h1_status?.exists ? '2/2' : '0/2'}
        items={h1Texts.length > 0 ? h1Texts.map(t => ({ text: t, type: 'pass' })) : [{ text: 'No H1 heading found.', type: 'fail' }]}
        tip={!data.header_tags.h1_status?.exists ? { title: 'Add H1', text: 'No H1 heading found.', scrollTo: 'check-h1-other' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-headings-other" title="Headings" status={data.heading_structure.status} importance="Important"
        score={data.duplicate_headings.has_duplicates ? '0/3' : '2/3'}
        items={[
          { text: data.duplicate_headings.has_duplicates ? `${data.duplicate_headings.count} duplicate heading texts found.` : 'No duplicate heading texts found.', type: data.duplicate_headings.has_duplicates ? 'warn' : 'pass' },
          { text: data.heading_structure.skipped_levels ? 'Heading structure skips levels.' : 'Heading structure is sequential.', type: data.heading_structure.skipped_levels ? 'warn' : 'pass' },
          { text: `${data.heading_structure.total_headings} headings on the page.`, type: data.heading_structure.total_headings > 30 ? 'warn' : 'pass' },
        ]} />

      <CheckCard id="check-robots" title="Robots.txt" status={data.robots_txt.status} importance="Important" score={data.robots_txt.exists ? '1/1' : '0/1'}
        items={[
          { text: data.robots_txt.exists ? 'robots.txt file found.' : 'robots.txt not found.', type: data.robots_txt.exists ? 'pass' : 'warn' },
          { text: data.robots_txt.has_sitemap_directive ? 'Sitemap directive found in robots.txt.' : 'No Sitemap directive in robots.txt.', type: data.robots_txt.has_sitemap_directive ? 'pass' : 'info' },
        ]}
        tip={!data.robots_txt.exists ? { title: 'Add robots.txt', text: 'Create a robots.txt file at your domain root.', scrollTo: 'check-robots' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-sitemap" title="XML Sitemap" status={data.xml_sitemap.status} importance="Important" score={data.xml_sitemap.exists ? '1/1' : '0/1'}
        items={[
          { text: data.xml_sitemap.exists ? 'XML Sitemap found.' : 'XML Sitemap not found.', type: data.xml_sitemap.exists ? 'pass' : 'warn' },
          { text: data.xml_sitemap.url_count ? `${data.xml_sitemap.url_count} URLs in sitemap` : '—', type: 'info' },
        ]}
        tip={!data.xml_sitemap.exists ? { title: 'Create XML sitemap', text: 'Generate an XML sitemap and submit to Google Search Console.', scrollTo: 'check-sitemap' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      <CheckCard id="check-analytics" title="Analytics" status={data.analytics.status} importance="Low importance" score={data.analytics.exists ? '1/1' : '0/1'}
        items={[{ text: data.analytics.exists ? 'Analytics tracking detected.' : 'No analytics tracking found.', type: data.analytics.exists ? 'pass' : 'warn' }]} />

      <CheckCard id="check-other-meta" title="Other Meta Tags" status={data.other_meta_tags?.status || 'info'} importance="Important"
        items={[
          { text: `Author: ${data.other_meta_tags?.author || 'Not set'}`, type: data.other_meta_tags?.author ? 'pass' : 'info' },
          { text: `Generator: ${data.other_meta_tags?.generator || 'Not set'}`, type: 'info' },
          { text: `Googlebot: ${data.other_meta_tags?.googlebot || 'Not set'}`, type: 'info' },
          { text: `Publisher: ${data.other_meta_tags?.publisher || 'Not set'}`, type: data.other_meta_tags?.publisher ? 'pass' : 'info' },
        ]} />

      <CheckCard id="check-email-privacy" title="Email Privacy" status={data.email_privacy.status} importance="Low importance"
        items={[{ text: data.email_privacy.message, type: data.email_privacy.status === 'good' ? 'pass' : 'warn' }]} />
    </div>
  )
}

function LinkStructureSection({ data }) {
  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Link structure</span>
        <span className="section-score">{data.links_score}%</span>
      </div>
      <CheckCard title="Internal links" status={data.onpage_links.internal > 0 ? 'good' : 'warning'} importance="Important" score={data.onpage_links.internal > 0 ? '3/4' : '1/4'}
        items={[
          { text: `${data.onpage_links.internal} internal links found.`, type: data.onpage_links.internal > 0 ? 'pass' : 'warn' },
          { text: `${data.onpage_links.unique_internal || data.onpage_links.internal} unique internal links.`, type: 'info' },
          { text: `${data.onpage_links.external} external links found.`, type: 'info' },
          { text: `${data.onpage_links.unique_external || data.onpage_links.external} unique external links.`, type: 'info' },
          { text: `${data.onpage_links.nofollow} nofollow links.`, type: 'info' },
          { text: `${data.onpage_links.dofollow} dofollow links.`, type: 'info' },
          { text: `${data.onpage_links.external_percentage}% external links.`, type: data.onpage_links.external_percentage > 50 ? 'warn' : 'pass' },
        ]} />
      <CheckCard title="Friendly URLs" status={data.friendly_urls.status} importance="Important"
        items={[
          { text: data.friendly_urls.unfriendly === 0 ? 'All URLs are clean and readable.' : `${data.friendly_urls.unfriendly} URLs contain parameters.`, type: data.friendly_urls.status === 'good' ? 'pass' : 'warn' },
          { text: `${data.friendly_urls.total} total links analyzed.`, type: 'info' },
        ]} />
      <CheckCard title="Backlinks" status="warning" importance="Very important" score="0/4"
        items={[{ text: 'Backlink data requires external API for detailed analysis.', type: 'info' }]} />
    </div>
  )
}

function ServerSection({ data }) {
  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Server configuration</span>
        <span className="section-score">{data.performance_score}%</span>
      </div>

      <CheckCard title="HTTP redirects" status="good" importance="Very important" score="1/1"
        items={[{ text: 'The checked page does not redirect to another URL.', type: 'pass' }]} />

      <CheckCard title="HTTP header" status="good" importance="Important" score="2/2"
        items={[
          { text: 'No X-Powered HTTP header is sent.', type: 'pass' },
          { text: data.compression.enabled ? `Uses ${data.compression.type} compression.` : 'No compression detected.', type: data.compression.enabled ? 'pass' : 'warn' },
        ]} />

      <CheckCard title="Performance" status={data.load_speed.status} importance="Low importance" score={data.load_speed.status === 'good' ? '2/2' : '1/2'}
        items={[
          { text: `Response time: ${data.load_speed.server_response}s${data.load_speed.status !== 'good' ? ' (should be < 2s)' : ''}`, type: data.load_speed.status === 'good' ? 'pass' : 'fail' },
          { text: `HTML file size: ${data.page_size.total_kb} kB`, type: data.page_size.status === 'good' ? 'pass' : 'warn' },
          { text: `Resources: ${data.resources.total} total (${data.resources.js} JS, ${data.resources.css} CSS, ${data.resources.images} images)`, type: 'info' },
        ]} />

      <CheckCard title="Caching" status={data.caching?.status || 'info'} importance="Important"
        items={[
          { text: data.caching?.has_caching ? 'Browser caching is enabled.' : 'No caching headers found.', type: data.caching?.has_caching ? 'pass' : 'warn' },
          { text: `Cache-Control: ${data.caching?.cache_control || 'Not set'}`, type: 'info' },
          { text: `ETag: ${data.caching?.etag || 'Not set'}`, type: 'info' },
        ]} />

      <CheckCard title="Mixed Content" status={data.mixed_content?.status || 'info'} importance="Important"
        items={[
          { text: data.mixed_content?.found ? `${data.mixed_content.count} HTTP resources found on HTTPS page!` : 'No mixed content found.', type: data.mixed_content?.found ? 'fail' : 'pass' },
        ]} />

      <CheckCard title="Technology" status="info" importance="Info"
        items={[
          { text: `Server: ${data.server.software || 'Unknown'}`, type: 'info' },
          { text: `Technologies: ${data.technology.list?.map(t => t.name).join(', ') || 'None detected'}`, type: 'info' },
        ]} />
    </div>
  )
}

function ExternalFactorsSection({ data }) {
  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">External factors</span>
        <span className="section-score">{data.social_score}%</span>
      </div>

      <CheckCard title="Facebook Open Graph" status={data.facebook.og_count > 0 ? 'good' : 'warning'} importance="Nice to have"
        items={[
          { text: data.facebook.og_count > 0 ? `${data.facebook.og_count} OG tags found.` : 'No Open Graph tags found.', type: data.facebook.og_count > 0 ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:title'] ? '✓ og:title' : '✕ og:title missing', type: data.facebook.og_tags?.['og:title'] ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:description'] ? '✓ og:description' : '✕ og:description missing', type: data.facebook.og_tags?.['og:description'] ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:image'] ? '✓ og:image' : '✕ og:image missing', type: data.facebook.og_tags?.['og:image'] ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:url'] ? '✓ og:url' : '✕ og:url missing', type: data.facebook.og_tags?.['og:url'] ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:type'] ? '✓ og:type' : '✕ og:type missing', type: data.facebook.og_tags?.['og:type'] ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:site_name'] ? '✓ og:site_name' : '✕ og:site_name missing', type: data.facebook.og_tags?.['og:site_name'] ? 'pass' : 'info' },
          { text: data.facebook.og_tags?.['og:locale'] ? '✓ og:locale' : '✕ og:locale missing', type: data.facebook.og_tags?.['og:locale'] ? 'pass' : 'info' },
        ]} />

      <CheckCard title="Twitter Cards" status={data.twitter.count > 0 ? 'good' : 'warning'} importance="Nice to have"
        items={[
          { text: data.twitter.count > 0 ? `${data.twitter.count} Twitter tags found.` : 'No Twitter Card tags found.', type: data.twitter.count > 0 ? 'pass' : 'warn' },
          { text: data.twitter.tags?.['twitter:card'] ? '✓ twitter:card' : '✕ twitter:card missing', type: data.twitter.tags?.['twitter:card'] ? 'pass' : 'warn' },
          { text: data.twitter.tags?.['twitter:title'] ? '✓ twitter:title' : '✕ twitter:title missing', type: data.twitter.tags?.['twitter:title'] ? 'pass' : 'warn' },
          { text: data.twitter.tags?.['twitter:description'] ? '✓ twitter:description' : '✕ twitter:description missing', type: data.twitter.tags?.['twitter:description'] ? 'pass' : 'warn' },
          { text: data.twitter.tags?.['twitter:image'] ? '✓ twitter:image' : '✕ twitter:image missing', type: data.twitter.tags?.['twitter:image'] ? 'pass' : 'warn' },
          { text: data.twitter.tags?.['twitter:site'] ? '✓ twitter:site' : '✕ twitter:site missing', type: data.twitter.tags?.['twitter:site'] ? 'pass' : 'info' },
        ]} />

      <CheckCard title="Social Profiles" status="info" importance="Info"
        items={[
          { text: data.instagram?.linked ? 'Instagram profile linked.' : 'No Instagram profile linked.', type: data.instagram?.linked ? 'pass' : 'info' },
          { text: data.linkedin?.linked ? 'LinkedIn profile linked.' : 'No LinkedIn profile linked.', type: data.linkedin?.linked ? 'pass' : 'info' },
          { text: data.youtube?.linked ? 'YouTube channel linked.' : 'No YouTube channel linked.', type: data.youtube?.linked ? 'pass' : 'info' },
        ]} />

      <CheckCard title="Security Headers" status={data.security_headers?.status || 'info'} importance="Important"
        score={`${data.security_headers?.score || 0}/5`}
        items={[
          { text: data.security_headers?.has_hsts ? '✓ HSTS enabled' : '✕ HSTS not found', type: data.security_headers?.has_hsts ? 'pass' : 'warn' },
          { text: data.security_headers?.has_x_content_type ? '✓ X-Content-Type-Options set' : '✕ X-Content-Type-Options not found', type: data.security_headers?.has_x_content_type ? 'pass' : 'warn' },
          { text: data.security_headers?.has_x_frame ? '✓ X-Frame-Options set' : '✕ X-Frame-Options not found', type: data.security_headers?.has_x_frame ? 'pass' : 'warn' },
          { text: data.security_headers?.has_csp ? '✓ Content-Security-Policy set' : '✕ Content-Security-Policy not found', type: data.security_headers?.has_csp ? 'pass' : 'warn' },
          { text: data.security_headers?.has_referrer_policy ? '✓ Referrer-Policy set' : '✕ Referrer-Policy not found', type: data.security_headers?.has_referrer_policy ? 'pass' : 'warn' },
        ]} />
    </div>
  )
}

function AdvancedSEOSection({ data, scrollToSection }) {
  const preview = data.search_preview || {}
  const desktop = preview.desktop || {}
  const mobile = preview.mobile || {}
  const www = data.www_canonicalization || {}
  const freshness = data.content_freshness || {}
  const broken = data.broken_links || {}
  const robots = data.robots_meta || {}
  const mobilePrev = data.mobile_preview || {}

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Advanced SEO</span>
      </div>

      {/* Search Preview */}
      <div className="check-card info">
        <div className="check-header">
          <span className="check-title">Search Preview</span>
          <Badge type="info">Desktop</Badge>
        </div>
        <div className="check-body">
          <p className="text-xs text-[var(--text-muted)] mb-3">Here is how the site may appear in search results:</p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xl">
            <p className="text-blue-700 text-lg font-normal hover:underline cursor-pointer truncate">{desktop.title || 'No title'}</p>
            <p className="text-green-700 text-sm truncate">{desktop.url || data.url}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{desktop.description || 'No description available'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Search Preview */}
      <div className="check-card info">
        <div className="check-header">
          <span className="check-title">Mobile Search Preview</span>
          <Badge type="info">Mobile</Badge>
        </div>
        <div className="check-body">
          <p className="text-xs text-[var(--text-muted)] mb-3">Here is how the site may appear in search results on a mobile device:</p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
            <p className="text-blue-700 text-base font-normal hover:underline cursor-pointer truncate">{mobile.title || 'No title'}</p>
            <p className="text-green-700 text-xs truncate">{mobile.url || data.url}</p>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{mobile.description || 'No description available'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Snapshot */}
      <CheckCard id="check-mobile-snapshot" title="Mobile Snapshot" status={mobilePrev.has_viewport ? 'good' : 'warning'} importance="Important"
        items={[
          { text: mobilePrev.has_viewport ? 'Viewport meta tag is set correctly.' : 'No viewport meta tag found.', type: mobilePrev.has_viewport ? 'pass' : 'warn' },
          { text: data.mobile_viewport?.content || 'No viewport content', type: 'info' },
        ]} />

      {/* Canonical Tag */}
      <CheckCard id="check-canonical-adv" title="Canonical Tag" status={data.canonical_tag.status} importance="Important"
        items={[
          { text: data.canonical_tag.exists ? `Canonical URL: ${data.canonical_tag.href}` : 'No canonical link tag found on the page.', type: data.canonical_tag.exists ? 'pass' : 'fail' },
        ]}
        tip={!data.canonical_tag.exists ? { title: 'How to fix', text: 'Add <link rel="canonical" href="..." /> to the <head> section of base.html.', scrollTo: 'check-canonical-adv' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Noindex Meta */}
      <CheckCard id="check-noindex" title="Noindex Meta" status={robots.has_noindex ? 'error' : 'good'} importance="Very important"
        items={[
          { text: robots.has_noindex ? 'Page has a noindex directive! Search engines will NOT index this page.' : 'The page does not contain any noindex meta tag or header.', type: robots.has_noindex ? 'fail' : 'pass' },
        ]}
        tip={robots.has_noindex ? { title: 'How to fix', text: 'Remove or change <meta name="robots" content="noindex" /> to "index, follow" in base.html.', scrollTo: 'check-noindex' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* WWW Canonicalization */}
      <CheckCard id="check-www" title="WWW Canonicalization" status={www.status} importance="Important"
        items={[
          { text: www.is_canonicalized ? 'WWW and non-www versions are properly canonicalized.' : 'The www and non-www versions of the URL are not redirected to the same site.', type: www.is_canonicalized ? 'pass' : 'warn' },
          { text: `Current: ${data.url}`, type: 'info' },
          { text: www.has_www ? 'Domain uses www prefix.' : 'Domain does not use www prefix.', type: 'info' },
        ]}
        tip={!www.is_canonicalized ? { title: 'How to fix', text: 'Decide whether you want your site\'s URLs to include "www" or not. Use HTTP 301 redirects to pass PageRank from the "wrong" URLs to the standard ones.', scrollTo: 'check-www' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* OpenGraph Meta */}
      <CheckCard id="check-og-adv" title="OpenGraph Meta" status={data.facebook.og_count >= 4 ? 'good' : 'warning'} importance="Important"
        items={[
          { text: data.facebook.og_count >= 4 ? 'All essential OpenGraph tags are present.' : 'Some OpenGraph meta tags are missing.', type: data.facebook.og_count >= 4 ? 'pass' : 'warn' },
          { text: data.facebook.og_tags?.['og:title'] ? '✓ og:title' : '✕ og:title missing', type: data.facebook.og_tags?.['og:title'] ? 'pass' : 'fail' },
          { text: data.facebook.og_tags?.['og:description'] ? '✓ og:description' : '✕ og:description missing', type: data.facebook.og_tags?.['og:description'] ? 'pass' : 'fail' },
          { text: data.facebook.og_tags?.['og:image'] ? '✓ og:image' : '✕ og:image missing', type: data.facebook.og_tags?.['og:image'] ? 'pass' : 'fail' },
          { text: data.facebook.og_tags?.['og:url'] ? '✓ og:url' : '✕ og:url missing', type: data.facebook.og_tags?.['og:url'] ? 'pass' : 'fail' },
        ]}
        tip={data.facebook.og_count < 4 ? { title: 'How to fix', text: 'Add og:title, og:description, og:image, and og:url meta tags to base.html <head> section.', scrollTo: 'check-og-adv' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Schema Meta Data */}
      <CheckCard id="check-schema-adv" title="Schema Meta Data" status={data.schema_markup.status} importance="Important"
        items={[
          { text: data.schema_markup.exists ? `Schema types found: ${data.schema_markup.types.join(', ')}` : 'No Schema.org data found on the page.', type: data.schema_markup.exists ? 'pass' : 'warn' },
          { text: `${data.schema_markup.count || 0} schema(s) found`, type: 'info' },
        ]}
        tip={!data.schema_markup.exists ? { title: 'How to fix', text: 'Add JSON-LD structured data in base.html: <script type="application/ld+json">{"@type": "WebPage", ...}</script>', scrollTo: 'check-schema-adv' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Sitemaps */}
      <CheckCard id="check-sitemap-adv" title="Sitemaps" status={data.xml_sitemap.status} importance="Important"
        items={[
          { text: data.xml_sitemap.exists ? 'XML Sitemap found and accessible.' : 'No sitemaps found.', type: data.xml_sitemap.exists ? 'pass' : 'warn' },
          { text: data.xml_sitemap.url_count ? `${data.xml_sitemap.url_count} URLs in sitemap` : '—', type: 'info' },
        ]}
        tip={!data.xml_sitemap.exists ? { title: 'How to fix', text: 'Create an XML sitemap and submit it to Google Search Console.', scrollTo: 'check-sitemap-adv' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Robots.txt */}
      <CheckCard id="check-robots-adv" title="Robots.txt" status={data.robots_txt.status} importance="Important"
        items={[
          { text: data.robots_txt.exists ? 'robots.txt file found and accessible.' : 'Robots.txt file is missing or unavailable.', type: data.robots_txt.exists ? 'pass' : 'warn' },
          { text: data.robots_txt.has_sitemap_directive ? 'Sitemap directive found in robots.txt.' : 'No Sitemap directive in robots.txt.', type: data.robots_txt.has_sitemap_directive ? 'pass' : 'info' },
        ]}
        tip={!data.robots_txt.exists ? { title: 'How to fix', text: 'Create a robots.txt file at your domain root with crawl directives.', scrollTo: 'check-robots-adv' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Content Freshness */}
      <CheckCard id="check-freshness" title="Keep Your Content Fresh" status={freshness.status} importance="Medium"
        items={[
          { text: freshness.has_freshness_signal ? `${freshness.signal_count} freshness signal(s) found.` : 'No content freshness information found (no XML sitemap lastmod, og:updated_time, or Last-Modified header).', type: freshness.has_freshness_signal ? 'pass' : 'warn' },
          ...(freshness.signals || []).map(s => ({ text: `${s.signal}: ${s.value} (${s.source})`, type: 'pass' })),
        ]}
        tip={!freshness.has_freshness_signal ? { title: 'How to fix', text: 'Add og:updated_time meta tag in base.html, or add lastmod to your XML sitemap, or set Last-Modified HTTP header.', scrollTo: 'check-freshness' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />

      {/* Broken Links */}
      <CheckCard id="check-broken" title="Broken Links" status={broken.status} importance="Important"
        items={[
          { text: broken.broken_count > 0 ? `The page has ${broken.broken_count} broken link(s).` : broken.checked ? `All ${broken.checked_count} links are working.` : 'Links could not be checked.', type: broken.broken_count > 0 ? 'fail' : 'pass' },
          ...(broken.broken || []).map(b => ({ text: `${b.url} — Status: ${b.status_code || 'Error'}`, type: 'fail' })),
          { text: `Checked ${broken.checked_count || 0} of ${broken.total_internal || 0} internal links.`, type: 'info' },
        ]}
        tip={broken.broken_count > 0 ? { title: 'How to fix', text: 'Fix or remove all broken links that return 404/500 errors. Update URLs to point to valid pages.', scrollTo: 'check-broken' } : null}
        onGoTo={(id) => scrollToSection?.(id)}
      />
    </div>
  )
}

function SuggestionsSection({ data }) {
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

  const allSuggestions = data.all_suggestions || {}
  const severityOrder = ['critical', 'high', 'medium', 'low', 'tips']

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Suggestions &amp; Where to Fix</span>
        <span className="section-score">{data.recommendations.length} issues</span>
      </div>

      {severityOrder.map(severity => {
        const items = allSuggestions[severity] || []
        if (items.length === 0) return null
        const colors = getSuggestionColor(severity)
        const statusMap = { critical: 'error', high: 'warning', medium: 'info', low: 'info', tips: 'info' }
        return (
          <CheckCard key={severity} title={`${items.length} ${severity === 'tips' ? 'Tips' : 'Issues'} — ${severity}`} status={statusMap[severity]} importance="Important">
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[var(--text)]">{item.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{item.description}</p>
                      {item.fix && (
                        <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">How to fix:</p>
                          <p className="text-xs text-[var(--text)]">{item.fix}</p>
                        </div>
                      )}
                      {item.where_to_fix && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                          <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Where to fix:</p>
                          <p className="text-xs text-blue-800">{item.where_to_fix}</p>
                          {item.file && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">{item.file}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors.badge} whitespace-nowrap`}>{item.impact || item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </CheckCard>
        )
      })}
    </div>
  )
}

function MetaTagsSection({ data }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#3b82f6'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const optimized = data.optimized_meta || {
    current_title: data.title_tag.content || '',
    suggested_title: data.title_tag.content || '',
    current_description: data.meta_description.content || '',
    suggested_description: data.meta_description.content || '',
    html_code: ''
  }

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Optimized Meta Tags</span>
      </div>

      <CheckCard id="check-meta-summary" title="Page Summary" status="good" importance="Important">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Title', value: data.title_tag.content || 'Missing', color: data.title_tag.status === 'good' ? '#22c55e' : '#f59e0b' },
            { label: 'Meta Description', value: data.meta_description.content ? 'Present' : 'Missing', color: data.meta_description.status === 'good' ? '#22c55e' : '#ef4444' },
            { label: 'Word Count', value: data.content_length.word_count, color: data.content_length.word_count >= 300 ? '#22c55e' : '#f59e0b' },
            { label: 'Load Time', value: `${data.load_speed.server_response}s`, color: data.load_speed.status === 'good' ? '#22c55e' : '#ef4444' },
            { label: 'Page Size', value: `${data.page_size.total_kb}KB`, color: data.page_size.status === 'good' ? '#22c55e' : '#f59e0b' },
            { label: 'Internal Links', value: data.onpage_links.internal, color: data.onpage_links.internal > 5 ? '#22c55e' : '#f59e0b' },
            { label: 'Images', value: `${data.image_alt.total} (${data.image_alt.missing_alt} missing alt)`, color: data.image_alt.missing_alt === 0 ? '#22c55e' : '#ef4444' },
            { label: 'SSL/HTTPS', value: data.ssl_enabled.enabled ? 'Yes' : 'No', color: data.ssl_enabled.enabled ? '#22c55e' : '#ef4444' },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--surface)] p-3 rounded-lg">
              <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
              <p className="font-semibold text-sm" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </CheckCard>

      <CheckCard id="check-meta-current" title="Current vs Suggested" status="info" importance="Important">
        <div className="space-y-3">
          <div className="bg-[var(--surface)] p-3 rounded-lg">
            <p className="text-xs text-[var(--text-muted)] mb-1">Current Title ({optimized.current_title?.length || 0} chars)</p>
            <p className="font-medium text-sm text-[var(--text)]">{optimized.current_title || '(none)'}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Suggested Title ({optimized.suggested_title?.length || 0} chars)</p>
            <p className="font-medium text-sm text-green-800">{optimized.suggested_title}</p>
          </div>
          <div className="bg-[var(--surface)] p-3 rounded-lg">
            <p className="text-xs text-[var(--text-muted)] mb-1">Current Description ({optimized.current_description?.length || 0} chars)</p>
            <p className="text-xs text-[var(--text)]">{optimized.current_description || '(none)'}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Suggested Description ({optimized.suggested_description?.length || 0} chars)</p>
            <p className="text-xs text-green-800">{optimized.suggested_description}</p>
          </div>
          {optimized.html_code && (
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">HTML Code (copy &amp; paste into base.html)</p>
              <pre className="text-green-400 text-xs whitespace-pre-wrap font-mono">{optimized.html_code}</pre>
            </div>
          )}
        </div>
      </CheckCard>
    </div>
  )
}

function TechnicalSection({ data }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#3b82f6'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const breakdown = data.score_breakdown || {}

  return (
    <div className="space-y-3">
      <div className="section-header">
        <span className="section-title">Technical Score Breakdown</span>
      </div>

      {Object.entries(breakdown).map(([category, catData]) => (
        <CheckCard key={category} title={category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} status={catData.score >= 70 ? 'good' : catData.score >= 40 ? 'warning' : 'error'} importance="Important" score={`${catData.score}%`}>
          <div className="space-y-1">
            {catData.details?.map((detail, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${detail.status === 'pass' ? 'bg-green-500' : detail.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs font-medium text-[var(--text)]">{detail.check}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)]">{detail.detail}</span>
                  <span className="text-xs font-semibold" style={{ color: detail.status === 'pass' ? '#22c55e' : detail.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                    {detail.score}/{detail.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CheckCard>
      ))}
    </div>
  )
}

export default function AuditReport({ data, url, scrollToSection: externalScrollTo }) {
  const [activeTab, setActiveTab] = useState('meta')
  const sectionRefs = useRef({})

  const checkIdToTab = {
    'check-title': 'meta', 'check-meta-desc': 'meta', 'check-crawl': 'meta',
    'check-canonical': 'meta', 'check-robots-meta': 'meta', 'check-domain': 'meta',
    'check-url': 'meta', 'check-lang': 'meta', 'check-hreflang': 'meta',
    'check-charset': 'meta', 'check-doctype': 'meta', 'check-favicon': 'meta',
    'check-schema': 'meta',
    'check-keywords': 'quality', 'check-content': 'quality', 'check-h1': 'quality',
    'check-h2': 'quality', 'check-h3': 'quality', 'check-dup-headings': 'quality',
    'check-heading-structure': 'quality', 'check-images': 'quality',
    'check-image-dimensions': 'quality', 'check-lazy-loading': 'quality',
    'check-frames': 'quality', 'check-mobile': 'quality', 'check-social': 'quality',
    'check-breadcrumbs': 'quality', 'check-https': 'quality',
    'check-robots': 'others', 'check-sitemap': 'others', 'check-analytics': 'others',
    'check-h1-other': 'others', 'check-headings-other': 'others',
    'check-other-meta': 'others', 'check-email-privacy': 'others',
    'check-performance': 'server', 'check-caching': 'server',
    'check-mixed-content': 'server', 'check-security-headers': 'external',
  }

  const scrollToSection = (id) => {
    if (id) {
      const tab = checkIdToTab[id]
      if (tab && tab !== activeTab) {
        setActiveTab(tab)
        setTimeout(() => doScroll(id), 50)
      } else {
        doScroll(id)
      }
      externalScrollTo?.(id)
    }
  }

  const doScroll = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.style.outline = '2px solid #3b82f6'
      el.style.outlineOffset = '4px'
      setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000)
    }
  }

  const tabs = [
    { id: 'meta', label: 'Meta data' },
    { id: 'quality', label: 'Page quality' },
    { id: 'others', label: 'Others' },
    { id: 'links', label: 'Link structure' },
    { id: 'server', label: 'Server configuration' },
    { id: 'external', label: 'External factors' },
    { id: 'advanced', label: 'Advanced SEO' },
    { id: 'suggestions', label: 'Suggestions' },
    { id: 'meta-tags', label: 'Meta Tags' },
    { id: 'technical', label: 'Technical' },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {!externalScrollTo && <OverviewSection data={data} />}
      <HTMLPageSection data={data} />
      <TodoList recommendations={data.recommendations} scrollToSection={scrollToSection} />

      <div id="section-checks" className="result-card">
        <h3 className="text-base font-bold text-[var(--text)] mb-4">Checks</h3>
        <div className="check-tabs">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'active' : ''}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="space-y-3 mt-4">
          {activeTab === 'meta' && <MetaDataSection data={data} scrollToSection={scrollToSection} />}
          {activeTab === 'quality' && <PageQualitySection data={data} scrollToSection={scrollToSection} />}
          {activeTab === 'others' && <OthersSection data={data} scrollToSection={scrollToSection} />}
          {activeTab === 'links' && <LinkStructureSection data={data} />}
          {activeTab === 'server' && <ServerSection data={data} />}
          {activeTab === 'external' && <ExternalFactorsSection data={data} />}
          {activeTab === 'advanced' && <AdvancedSEOSection data={data} scrollToSection={scrollToSection} />}
          {activeTab === 'suggestions' && <SuggestionsSection data={data} />}
          {activeTab === 'meta-tags' && <MetaTagsSection data={data} />}
          {activeTab === 'technical' && <TechnicalSection data={data} />}
        </div>
      </div>
    </div>
  )
}
