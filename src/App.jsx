import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import ContentAnalyzer from './components/ContentAnalyzer'
import MetaTagGenerator from './components/MetaTagGenerator'
import KeywordAnalyzer from './components/KeywordAnalyzer'
import WebsiteAuditor from './components/WebsiteAuditor'
import AuditPage from './components/AuditPage'
import './App.css'

function Navbar() {
  const location = useLocation()
  const links = [
    { path: '/', label: 'SEO Checker', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 10 105.196 5.196a7.5 7.5 0 1010.607 10.607z' },
    { path: '/content', label: 'Content', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { path: '/meta-tags', label: 'Meta Tags', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z' },
    { path: '/keywords', label: 'Keywords', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z' },
  ]

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <span className="logo-text">SEO<span className="logo-accent">Pro</span></span>
        </Link>
        <nav>
          {links.map(link => (
            <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'active' : ''}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon}/>
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function AppContent() {
  const location = useLocation()
  const isAuditPage = location.pathname.startsWith('/audit')

  return (
    <div className="min-h-screen">
      <Navbar />
      {isAuditPage ? (
        <Routes>
          <Route path="/audit/:url" element={<AuditPage />} />
        </Routes>
      ) : (
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WebsiteAuditor />} />
            <Route path="/content" element={<ContentAnalyzer />} />
            <Route path="/meta-tags" element={<MetaTagGenerator />} />
            <Route path="/keywords" element={<KeywordAnalyzer />} />
          </Routes>
        </main>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
