import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#fff1f2', minHeight: '100vh' }}>
          <h2 style={{ color: '#dc2626' }}>App Error — screenshot and send to Claude:</h2>
          <pre style={{
            background: '#1e1e1e', color: '#f87171', padding: '20px',
            borderRadius: '8px', overflow: 'auto', marginTop: '16px',
            fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {this.state.error?.message}{'\n\n'}{this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Use RELATIVE paths — avoids all alias issues
const CitizenPortal = lazy(() => import('./portals/citizen/CitizenPortal'))
const AdminPortal   = lazy(() => import('./portals/admin/AdminPortal'))
const LandingPage   = lazy(() => import('./LandingPage'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#f5f7f2',
      fontFamily: 'sans-serif', fontSize: '1rem', gap: '12px', color: '#1a6b3c'
    }}>
      Loading CivicClean AI...
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<LandingPage />} />
            <Route path="/citizen/*" element={<CitizenPortal />} />
            <Route path="/admin/*"   element={<AdminPortal />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
