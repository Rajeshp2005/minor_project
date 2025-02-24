import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/submissions');
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyContent(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSendReply = async (id) => {
    try {
      const reply = replyContent[id];
      if (!reply) return;
      const res = await axios.post('http://localhost:8000/api/reply', { id, reply });
      if (res.data.success) {
        setResponseMsg(`Replied to submission #${id}`);
        setSubmissions(submissions.map(sub => sub.id === id ? res.data.submission : sub));
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      {loading ? (
        <p className="text-center">Loading submissions...</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white shadow-md rounded px-4 py-4">
              <p><strong>ID:</strong> {sub.id}</p>
              <p><strong>Name:</strong> {sub.name}</p>
              <p><strong>Email:</strong> {sub.email}</p>
              <p><strong>Message:</strong> {sub.message}</p>
              {sub.reply && (
                <p className="mt-2 text-green-600"><strong>Reply:</strong> {sub.reply}</p>
              )}
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Type your reply..."
                  value={replyContent[sub.id] || ''}
                  onChange={(e) => handleReplyChange(sub.id, e.target.value)}
                ></textarea>
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleSendReply(sub.id)}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {responseMsg && <p className="mt-4 text-center text-green-600">{responseMsg}</p>}
    </div>
  );
};

export default AdminDashboard;
