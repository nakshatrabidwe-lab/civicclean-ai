import React, { useState } from 'react';

export default function Settings() {
  const [confidence, setConfidence] = useState(85);
  const [autoDispatch, setAutoDispatch] = useState(true);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #e5e7eb', maxWidth: '680px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Settings</h2>
        <p style={{ margin: '4px 0 24px', color: '#6b7280', fontSize: '0.88rem' }}>Configure AI rules, notification channels, and SLAs.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Confidence Threshold */}
          <div style={{ borderBottom: '1.5px solid #f3f4f6', paddingBottom: '20px' }}>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '4px', fontSize: '0.92rem', color: '#111827' }}>
              YOLO Detection Confidence Threshold ({confidence}%)
            </label>
            <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: '0.82rem' }}>
              Minimum AI confidence required to automatically flag an issue.
            </p>
            <input 
              type="range" 
              min="50" 
              max="98" 
              value={confidence} 
              onChange={(e) => setConfidence(e.target.value)}
              style={{ width: '100%', accentColor: '#16a34a', cursor: 'pointer' }}
            />
          </div>

          {/* Automated Dispatch Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #f3f4f6', paddingBottom: '20px' }}>
            <div>
              <label style={{ fontWeight: '700', display: 'block', fontSize: '0.92rem', color: '#111827' }}>Auto-Dispatch Critical Alerts</label>
              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.82rem' }}>Automatically alert nearest sanitation team for critical dumping.</p>
            </div>
            <input 
              type="checkbox" 
              checked={autoDispatch} 
              onChange={() => setAutoDispatch(!autoDispatch)}
              style={{ width: '20px', height: '20px', accentColor: '#16a34a', cursor: 'pointer' }}
            />
          </div>

          {/* Service Level Agreement */}
          <div style={{ borderBottom: '1.5px solid #f3f4f6', paddingBottom: '20px' }}>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '6px', fontSize: '0.92rem', color: '#111827' }}>Default Cleanup SLA Target</label>
            <select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', outline: 'none', background: '#fff', fontSize: '0.88rem', color: '#111827' }}>
              <option value="2">2 Hours (High Priority Wards)</option>
              <option value="4">4 Hours (Standard)</option>
              <option value="12">12 Hours (Non-critical)</option>
            </select>
          </div>

          <button style={{ width: 'fit-content', padding: '11px 24px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}