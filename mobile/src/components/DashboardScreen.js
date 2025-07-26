import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext.js';
import { useTranslation } from '../contexts/TranslationContext.js';

/**
 * DashboardScreen fetches and displays topics in a scrollable list.
 * Users can switch languages, view their points/badges and log in
 * or out from this screen.
 */
export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { lang, setLanguage, t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/topics`
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

  function navigateToTopic(id) {
    navigation.navigate('Topic', { id });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Language selector */}
      <View style={styles.langSelector}>
        <TouchableOpacity
          onPress={() => setLanguage('en')}
          style={[styles.langButton, lang === 'en' && styles.langButtonActive]}
        >
          <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>{t('english')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLanguage('zh')}
          style={[styles.langButton, lang === 'zh' && styles.langButtonActive]}
        >
          <Text style={[styles.langText, lang === 'zh' && styles.langTextActive]}>{t('chinese')}</Text>
        </TouchableOpacity>
      </View>
      {/* Auth actions */}
      <View style={styles.authContainer}>
        {user ? (
          <>
            <Text style={styles.userInfo}>
              {t('points')}: {user.points} {user.badges && user.badges.length > 0 ? `| ${t('badges')}: ${user.badges.length}` : ''}
            </Text>
            <TouchableOpacity onPress={logout} style={styles.authButton}>
              <Text style={styles.authButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.authButton}>
              <Text style={styles.authButtonText}>{t('login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.authButton}>
              <Text style={styles.authButtonText}>{t('signup')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Text style={styles.heading}>{t('topics')}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4299e1" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        topics.map(topic => {
          const title = lang === 'zh' ? topic.title_zh : topic.title_en;
          const description = lang === 'zh' ? topic.description_zh : topic.description_en;
          return (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => navigateToTopic(topic.id)}
            >
              <Text style={styles.topicTitle}>{title}</Text>
              <Text style={styles.topicDescription} numberOfLines={3}>
                {description}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  langSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0'
  },
  langButtonActive: {
    backgroundColor: '#4299e1'
  },
  langText: {
    color: '#4a5568'
  },
  langTextActive: {
    color: '#ffffff'
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  authButton: {
    backgroundColor: '#f6ad55',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 4
  },
  authButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  userInfo: {
    marginRight: 8,
    color: '#4a5568'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2d3748'
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2d3748'
  },
  topicDescription: {
    fontSize: 14,
    color: '#4a5568'
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});