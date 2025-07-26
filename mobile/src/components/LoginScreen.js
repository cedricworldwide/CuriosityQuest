import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext.js';
import { useTranslation } from '../contexts/TranslationContext.js';

/**
 * LoginScreen allows users to enter their email and password to
 * authenticate. On success they are redirected to the Dashboard.
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('login')}</Text>
      <View style={styles.field}>
        <Text style={styles.label}>{t('email')}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{t('password')}</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.6 }]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('login')}</Text>}
      </TouchableOpacity>
      <Text style={styles.switchText}>
        {t('noAccount')} 
        <Text onPress={() => navigation.navigate('Signup')} style={styles.switchLink}>{t('signup')}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  field: {
    marginBottom: 12
  },
  label: {
    marginBottom: 4,
    color: '#4a5568'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 8
  },
  error: {
    color: 'red',
    marginBottom: 8
  },
  button: {
    backgroundColor: '#4299e1',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  switchText: {
    marginTop: 8,
    color: '#4a5568'
  },
  switchLink: {
    color: '#4299e1'
  }
});