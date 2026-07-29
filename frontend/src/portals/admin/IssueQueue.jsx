import React, { useState } from 'react';

const mockIssues = [
  { id: 'ISS-1042', location: 'Ward 4 - Market Yard', type: 'Litter Detection', priority: 'High', status: 'Pending', confidence: '94%' },
  { id: 'ISS-1041', location: 'Ward 2 - Station Road', type: 'Overflowing Bin', priority: 'Medium', status: 'Assigned', confidence: '88%' },
  { id: 'ISS-1040', location: 'Ward 7 - Civil Lines', type: 'Illegal Dumping', priority: 'Critical', status: 'In Progress', confidence: '97%' },
  { id: 'ISS-1039', location: 'Ward 1 - Main Bus Stand', type: 'Plastic Waste Accumulation', priority: 'Low', status: 'Resolved', confidence: '91%' },
];

export default function IssueQueue() {
  const [filter, setFilter] = useState('All');

  const filteredIssues = filter === 'All' 
    ? mockIssues 
    : mockIssues.filter(issue => issue.status === filter);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>Issue Queue</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.88rem' }}>Triage, assign, and update all incoming civic reports.</p>
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e5e7eb', outline: 'none', background: '#fff', fontSize: '0.85rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280' }}>
                <th style={{ padding: '12px 8px' }}>Issue ID</th>
                <th style={{ padding: '12px 8px' }}>Location</th>
                <th style={{ padding: '12px 8px' }}>Category</th>
                <th style={{ padding: '12px 8px' }}>AI Confidence</th>
                <th style={{ padding: '12px 8px' }}>Priority</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '700', color: '#16a34a' }}>{issue.id}</td>
                  <td style={{ padding: '12px 8px', color: '#111827' }}>{issue.location}</td>
                  <td style={{ padding: '12px 8px', color: '#111827' }}>{issue.type}</td>
                  <td style={{ padding: '12px 8px', color: '#16a34a', fontWeight: '700' }}>{issue.confidence}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                      background: issue.priority === 'Critical' ? 'rgba(220, 38, 38, 0.1)' : issue.priority === 'High' ? 'rgba(234, 88, 12, 0.1)' : '#f3f4f6',
                      color: issue.priority === 'Critical' ? '#dc2626' : issue.priority === 'High' ? '#ea580c' : '#4b5563'
                    }}>
                      {issue.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#111827' }}>{issue.status}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '700' }}>
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}