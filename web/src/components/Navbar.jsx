import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTranslation } from '../contexts/TranslationContext.jsx';

/**
 * Navbar displays the application title, language selector and user
 * authentication actions. When a user is logged in it also
 * shows their accumulated points and number of badges.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLanguage, t } = useTranslation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-semibold text-primary-dark">
              {t('appTitle')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {t('english')}
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-1 rounded ${lang === 'zh' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {t('chinese')}
              </button>
            </div>
            {user ? (
              <>
                <div className="text-gray-700 text-sm hidden sm:block">
                  {t('points')}: <span className="font-semibold">{user.points}</span>
                  {user.badges && user.badges.length > 0 && (
                    <>
                      {' | '}
                      {t('badges')}: <span className="font-semibold">{user.badges.length}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-white bg-secondary rounded hover:bg-secondary-dark"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-dark"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-dark"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}