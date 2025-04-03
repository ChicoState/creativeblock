// Firebase-backed version of your index.tsx (replacing AsyncStorage for auth)
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

const SCREENS = {
  WELCOME: 'welcome',
  CREATE_ACCOUNT: 'createAccount',
  FORGOT_PASSWORD: 'forgotPassword'
};

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/projecthome');
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const goToWelcome = () => setCurrentScreen(SCREENS.WELCOME);
  const goToCreateAccount = () => setCurrentScreen(SCREENS.CREATE_ACCOUNT);
  const goToForgotPassword = () => setCurrentScreen(SCREENS.FORGOT_PASSWORD);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/projecthome');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleCreateAccount = async () => {
    if (!newUsername || !email || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    setIsCreating(true); // 🟡 Start loading indicator
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: goToWelcome }
      ]);
  
      // Clear the fields
      setNewUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Signup Error', error.message);
    } finally {
      setIsCreating(false); // ✅ End loading indicator
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert('Success', 'Password reset email sent!', [{ text: 'OK', onPress: goToWelcome }]);
    } catch (error: any) {
      Alert.alert('Reset Error', error.message);
    }
  };

  const handleGuestLogin = () => router.push('/projecthome');

  const renderWelcomeScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <ThemedText type="title" style={styles.title}>Welcome to CreativeBlock</ThemedText>
      </ThemedView>

      <ThemedView style={styles.formContainer}>
        <ThemedTextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <ThemedTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.optionsContainer}>
          <TouchableOpacity onPress={goToCreateAccount}>
            <ThemedText type="link" style={styles.optionText}>Create Account</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToForgotPassword}>
            <ThemedText type="link" style={styles.optionText}>Forgot Password</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleGuestLogin}>
          <ThemedText style={styles.secondaryButtonText}>Continue as Guest</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  const renderCreateAccountScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
      <ThemedView style={styles.formContainer}>
        <ThemedTextInput placeholder="Username (optional display)" value={newUsername} onChangeText={setNewUsername} style={styles.input} />
        <ThemedTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
        <ThemedTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <ThemedTextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity
  style={[styles.primaryButton, isCreating && { opacity: 0.5 }]}
  onPress={handleCreateAccount}
  disabled={isCreating}
>
  <ThemedText style={styles.buttonText}>
    {isCreating ? 'Creating...' : 'Create Account'}
  </ThemedText>
</TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={goToWelcome}>
          <ThemedText style={styles.linkText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  const renderForgotPasswordScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
      <ThemedText style={styles.description}>
        Enter your email address and we'll send you instructions to reset your password.
      </ThemedText>
      <ThemedView style={styles.formContainer}>
        <ThemedTextInput placeholder="Email" value={resetEmail} onChangeText={setResetEmail} keyboardType="email-address" style={styles.input} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword}>
          <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={goToWelcome}>
          <ThemedText style={styles.linkText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  switch (currentScreen) {
    case SCREENS.CREATE_ACCOUNT:
      return renderCreateAccountScreen();
    case SCREENS.FORGOT_PASSWORD:
      return renderForgotPasswordScreen();
    case SCREENS.WELCOME:
    default:
      return renderWelcomeScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 350,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontWeight: '500',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  optionText: {
    fontSize: 14,
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
  },
});
