import React from 'react';
import { Link } from 'react-router-dom';
import './ProgramCard.css';

const ProgramCard = ({ program }) => {
  const getLevelBadgeClass = (level) => {
    const classes = {
      'beginner': 'badge-beginner',
      'intermediate': 'badge-intermediate',
      'advanced': 'badge-advanced',
      'all-levels': 'badge-all'
    };
    return classes[level] || 'badge-beginner';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      bootcamp: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
        </svg>
      ),
      olympiad: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
        </svg>
      ),
      corporate: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7H12z"/>
        </svg>
      ),
      climate: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18.5l3.5 3.5L13 18.5l3.5 3.5L19 18.5l2.22 2.22 1.44-1.44L19 14.78c0-3.39-2.61-6.78-2-8.78z"/>
        </svg>
      )
    };
    return icons[category] || icons.bootcamp;
  };

  return (
    <div className="program-card">
      <div className="program-card-header">
        <div className="program-icon">
          {getCategoryIcon(program.category)}
        </div>
        <span className={`level-badge ${getLevelBadgeClass(program.level)}`}>
          {program.level}
        </span>
      </div>
      
      <div className="program-card-body">
        <h3 className="program-title">{program.title}</h3>
        <p className="program-description">{program.shortDescription}</p>
        
        <div className="program-meta">
          <div className="meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
            </svg>
            <span>{program.duration}</span>
          </div>
          <div className="meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            <span>${program.price?.amount} {program.price?.currency}</span>
          </div>
        </div>

        {program.ageGroup && (
          <div className="age-group">
            Ages {program.ageGroup.min}-{program.ageGroup.max}
          </div>
        )}
      </div>

      <div className="program-card-footer">
        <Link to={`/programs/${program.slug}`} className="btn btn-primary btn-block">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
