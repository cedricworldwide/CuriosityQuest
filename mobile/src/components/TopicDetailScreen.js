import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext.js';
import { useTranslation } from '../contexts/TranslationContext.js';

/**
 * TopicDetailScreen shows the details of a selected topic and allows
 * the user to explore deeper prompts. Points and badges are
 * awarded through the rewardUser function from AuthContext.
 */
export default function TopicDetailScreen() {
  const route = useRoute();
  const { id } = route.params;
  const { user, token, rewardUser } = useAuth();
  const { t, lang } = useTranslation();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deeperPrompt, setDeeperPrompt] = useState(null);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [rewardMessage, setRewardMessage] = useState(null);

  useEffect(() => {
    async function fetchTopic() {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/topics/${id}`
        );
        setTopic(res.data.topic);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [id]);

  async function handleExplore() {
    if (!user || !token) return;
    setExploreLoading(true);
    setRewardMessage(null);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/ai/generate`,
        {
          params: { topicId: id, lang },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDeeperPrompt(res.data.prompt);
      const rewardRes = await rewardUser({ points: 10 });
      if (rewardRes.points >= 50 && !rewardRes.badges.includes('Curious Explorer')) {
        await rewardUser({ badge: 'Curious Explorer' });
        setRewardMessage('🎉 You earned the Curious Explorer badge!');
      } else {
        setRewardMessage(`+10 ${t('points')}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load deeper content');
    } finally {
      setExploreLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (!topic) return null;
  const title = lang === 'zh' ? topic.title_zh : topic.title_en;
  const description = lang === 'zh' ? topic.description_zh : topic.description_en;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!user ? (
        <View style={styles.noticeBox}>
          <Text style={{ color: '#8a6d3b' }}>{t('loginToExplore')}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleExplore}
          disabled={exploreLoading}
          style={[styles.exploreButton, exploreLoading && { opacity: 0.6 }]}
        >
          <Text style={styles.exploreButtonText}>
            {exploreLoading ? t('loading') : t('exploreMore')}
          </Text>
        </TouchableOpacity>
      )}
      {rewardMessage && (
        <Text style={styles.rewardMessage}>{rewardMessage}</Text>
      )}
      {deeperPrompt && (
        <View style={styles.promptBox}>
          <Text style={styles.promptHeading}>{t('deeperPrompt')}</Text>
          <Text style={styles.promptText}>{deeperPrompt}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    color: '#4a5568'
  },
  exploreButton: {
    backgroundColor: '#4299e1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  noticeBox: {
    backgroundColor: '#fcf8e3',
    borderLeftColor: '#faebcc',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4
  },
  rewardMessage: {
    marginTop: 8,
    color: '#38a169'
  },
  promptBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#edf2f7',
    borderLeftWidth: 4,
    borderLeftColor: '#f6ad55',
    borderRadius: 4
  },
  promptHeading: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#dd6b20'
  },
  promptText: {
    color: '#2d3748'
  }
});