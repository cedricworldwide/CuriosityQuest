import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopicCard from './TopicCard.jsx';
import { useTranslation } from '../contexts/TranslationContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Dashboard fetches and displays a list of topics. Users can click on
 * a topic card to view more details and explore deeper prompts. The
 * dashboard also greets the authenticated user by name.
 */
export default function Dashboard() {
  const { t, lang } = useTranslation();
  const { user, token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/topics`
        );
        setTopics(res.data.topics);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">{t('loading')}</p>;
  }
  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {user && (
        <h2 className="text-xl mb-4 text-gray-700">
          {t('dashboard')}, {user.displayName}!
        </h2>
      )}
      <h1 className="text-2xl font-bold mb-4">{t('topics')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}