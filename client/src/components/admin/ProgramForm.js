import React, { useState, useEffect } from 'react';
import './AdminForms.css';

const ProgramForm = ({ program, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'bootcamp',
    description: '',
    shortDescription: '',
    duration: '',
    level: 'beginner',
    price: { amount: 0, currency: 'USD' },
    deliveryMode: 'online',
    isFeatured: false,
    isActive: true,
    outcomes: [''],
    prerequisites: [''],
    features: [''],
    modules: [{ title: '', description: '', duration: '', topics: [''] }]
  });

  useEffect(() => {
    if (program) {
      setFormData({
        ...program,
        outcomes: program.outcomes?.length ? program.outcomes : [''],
        prerequisites: program.prerequisites?.length ? program.prerequisites : [''],
        features: program.features?.length ? program.features : [''],
        modules: program.modules?.length ? program.modules.map(m => ({
          ...m,
          topics: m.topics?.length ? m.topics : ['']
        })) : [{ title: '', description: '', duration: '', topics: [''] }]
      });
    }
  }, [program]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('price.')) {
      const priceField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        price: { ...prev.price, [priceField]: priceField === 'amount' ? Number(value) : value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) => 
        i === moduleIndex ? { ...mod, [field]: value } : mod
      )
    }));
  };

  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) => 
        i === moduleIndex ? {
          ...mod,
          topics: mod.topics.map((t, ti) => ti === topicIndex ? value : t)
        } : mod
      )
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', description: '', duration: '', topics: [''] }]
    }));
  };

  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const addTopic = (moduleIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) => 
        i === moduleIndex ? { ...mod, topics: [...mod.topics, ''] } : mod
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up empty values
    const cleanedData = {
      ...formData,
      outcomes: formData.outcomes.filter(o => o.trim()),
      prerequisites: formData.prerequisites.filter(p => p.trim()),
      features: formData.features.filter(f => f.trim()),
      modules: formData.modules.map(m => ({
        ...m,
        topics: m.topics.filter(t => t.trim())
      })).filter(m => m.title.trim())
    };
    onSave(cleanedData);
  };

  return (
    <form className="admin-form program-form" onSubmit={handleSubmit}>
      <h2>{program ? 'Edit Program' : 'Add New Program'}</h2>

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Program Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="bootcamp">Bootcamp</option>
              <option value="olympiad">Olympiad</option>
              <option value="corporate">Corporate</option>
              <option value="climate">Climate</option>
            </select>
          </div>

          <div className="form-group">
            <label>Level</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 8 weeks" required />
          </div>

          <div className="form-group">
            <label>Delivery Mode</label>
            <select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange}>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (USD) *</label>
            <input type="number" name="price.amount" value={formData.price.amount} onChange={handleChange} min="0" required />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select name="price.currency" value={formData.price.currency} onChange={handleChange}>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Short Description *</label>
          <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} maxLength="200" required />
        </div>

        <div className="form-group">
          <label>Full Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
        </div>

        <div className="form-row checkboxes">
          <label className="checkbox-label">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
            Featured Program
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            Active (Visible on site)
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Learning Outcomes</h3>
        {formData.outcomes.map((outcome, i) => (
          <div key={i} className="array-input">
            <input type="text" value={outcome} onChange={(e) => handleArrayChange('outcomes', i, e.target.value)} placeholder="What students will learn" />
            {formData.outcomes.length > 1 && (
              <button type="button" className="btn-remove" onClick={() => removeArrayItem('outcomes', i)}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('outcomes')}>+ Add Outcome</button>
      </div>

      <div className="form-section">
        <h3>Prerequisites</h3>
        {formData.prerequisites.map((prereq, i) => (
          <div key={i} className="array-input">
            <input type="text" value={prereq} onChange={(e) => handleArrayChange('prerequisites', i, e.target.value)} placeholder="Required knowledge/skills" />
            {formData.prerequisites.length > 1 && (
              <button type="button" className="btn-remove" onClick={() => removeArrayItem('prerequisites', i)}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('prerequisites')}>+ Add Prerequisite</button>
      </div>

      <div className="form-section">
        <h3>Program Features</h3>
        {formData.features.map((feature, i) => (
          <div key={i} className="array-input">
            <input type="text" value={feature} onChange={(e) => handleArrayChange('features', i, e.target.value)} placeholder="e.g., Certificate included" />
            {formData.features.length > 1 && (
              <button type="button" className="btn-remove" onClick={() => removeArrayItem('features', i)}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('features')}>+ Add Feature</button>
      </div>

      <div className="form-section">
        <h3>Curriculum Modules</h3>
        {formData.modules.map((module, mi) => (
          <div key={mi} className="module-card">
            <div className="module-header">
              <span>Module {mi + 1}</span>
              {formData.modules.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeModule(mi)}>Remove</button>
              )}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Module Title</label>
                <input type="text" value={module.title} onChange={(e) => handleModuleChange(mi, 'title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={module.duration} onChange={(e) => handleModuleChange(mi, 'duration', e.target.value)} placeholder="e.g., 2 weeks" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={module.description} onChange={(e) => handleModuleChange(mi, 'description', e.target.value)} rows="2" />
            </div>
            <div className="form-group">
              <label>Topics</label>
              {module.topics.map((topic, ti) => (
                <div key={ti} className="array-input small">
                  <input type="text" value={topic} onChange={(e) => handleTopicChange(mi, ti, e.target.value)} placeholder="Topic name" />
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-outline" onClick={() => addTopic(mi)}>+ Topic</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addModule}>+ Add Module</button>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{program ? 'Update Program' : 'Create Program'}</button>
      </div>
    </form>
  );
};

export default ProgramForm;
