import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext.jsx';

/**
 * TopicCard displays the title and a brief description of a topic.
 * Clicking on the card navigates to the detailed view for that topic.
 */
export default function TopicCard({ topic }) {
  const { t, lang } = useTranslation();
  const title = lang === 'zh' ? topic.title_zh : topic.title_en;
  const description = lang === 'zh' ? topic.description_zh : topic.description_en;
  return (
    <Link
      to={`/topic/${topic.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
    </Link>
  );
}