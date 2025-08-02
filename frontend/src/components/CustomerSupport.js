import React, { useState } from 'react';
const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Support request submitted successfully!');
      setFormData({ subject: '', message: '' });
    } catch (err) {
      setError('Failed to submit support request.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h3>Customer Support</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
        />
        {error && <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{success}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};
export default CustomerSupport;
