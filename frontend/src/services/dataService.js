// src/services/dataService.js

const INITIAL_ISSUES = [
  {
    id: 'ISS-8821',
    title: 'Overflowing Garbage Bin',
    location: 'Bus Stand Chowk, Ward 12',
    category: 'Solid Waste',
    status: 'IN PROGRESS',
    aiConfidence: '98% AI Verified',
    date: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    description: 'Garbage overflowing onto main road causing traffic bottleneck.'
  },
  {
    id: 'ISS-8819',
    title: 'Plastic Waste Accumulation',
    location: 'Dhamangaon Rd Market, Ward 8',
    category: 'Plastic Waste',
    status: 'ASSIGNED',
    aiConfidence: '94% AI Verified',
    date: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    description: 'Single-use plastic discarded behind fruit stalls.'
  },
  {
    id: 'ISS-8790',
    title: 'Illegal Construction Dump',
    location: 'Civil Lines, Ward 4',
    category: 'Debris',
    status: 'RESOLVED',
    aiConfidence: '99% AI Verified',
    date: '1 day ago',
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    description: 'Construction rubble cleared near main library.'
  }
];

// 1. Get stored issues or load static baseline
export const getStoredIssues = () => {
  const saved = localStorage.getItem('civic_clean_issues');
  if (!saved) {
    localStorage.setItem('civic_clean_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  return JSON.parse(saved);
};

// 2. Add dynamic citizen grievance
export const addIssue = (newGrievance) => {
  const currentIssues = getStoredIssues();
  const formattedIssue = {
    id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
    title: newGrievance.title || 'Reported Civic Issue',
    location: newGrievance.location || 'Yavatmal Central',
    category: newGrievance.category || 'General Waste',
    status: 'PENDING',
    aiConfidence: '96% AI Verified',
    date: 'Just now',
    image: newGrievance.imagePreview || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    description: newGrievance.description || 'Uploaded via Citizen Portal.'
  };

  const updated = [formattedIssue, ...currentIssues];
  localStorage.setItem('civic_clean_issues', JSON.stringify(updated));
  return updated;
};

// 3. Reset demo data back to static baseline
export const resetToDefaultData = () => {
  localStorage.setItem('civic_clean_issues', JSON.stringify(INITIAL_ISSUES));
  return INITIAL_ISSUES;
};