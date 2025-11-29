import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill={index < rating ? '#FFC145' : '#e0e0e0'}
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      student: 'Student',
      parent: 'Parent',
      school: 'School',
      corporate: 'Corporate'
    };
    return labels[category] || 'Student';
  };

  return (
    <div className="testimonial-card">
      <div className="testimonial-quote">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#003B73" opacity="0.2">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
      </div>
      
      <p className="testimonial-content">{testimonial.content}</p>
      
      <div className="testimonial-rating">
        {renderStars(testimonial.rating)}
      </div>

      <div className="testimonial-author">
        <div className="author-avatar">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.name} />
          ) : (
            <span>{testimonial.name.charAt(0)}</span>
          )}
        </div>
        <div className="author-info">
          <h4 className="author-name">{testimonial.name}</h4>
          <p className="author-role">
            {testimonial.role}
            {testimonial.organization && `, ${testimonial.organization}`}
          </p>
          <span className="author-category">{getCategoryLabel(testimonial.category)}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
