import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useRouter } from 'expo-router';

// Screen states
const SCREENS = {
  WELCOME: 'welcome',
  CREATE_ACCOUNT: 'createAccount',
  FORGOT_PASSWORD: 'forgotPassword'
};

export default function Index() {
  // Screen management
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  
  // Login screen state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Create account screen state
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Forgot password screen state
  const [resetEmail, setResetEmail] = useState('');
  
  const router = useRouter();
  
  // Navigation functions
  const goToWelcome = () => setCurrentScreen(SCREENS.WELCOME);
  const goToCreateAccount = () => setCurrentScreen(SCREENS.CREATE_ACCOUNT);
  const goToForgotPassword = () => setCurrentScreen(SCREENS.FORGOT_PASSWORD);
  
  // Action handlers
  const handleLogin = () => {
    if (username && password) {
      router.push('/projecthome');
    } else {
      alert('Please enter both username and password');
    }
  };
  
  const handleGuestLogin = () => {
    router.push('/projecthome');
  };
  
  const handleCreateAccount = () => {
    if (!newUsername || !email || !newPassword) {
      alert('Please fill all required fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Account creation logic would go here
    alert('Account created successfully!');
    goToWelcome();
  };
  
  const handleResetPassword = () => {
    if (!resetEmail) {
      alert('Please enter your email address');
      return;
    }
    
    // Password reset logic would go here
    alert('Password reset instructions sent to your email');
    goToWelcome();
  };
  
  // Render Welcome/Login Screen
  const renderWelcomeScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <ThemedText type="title" style={styles.title}>Welcome to CreativeBlock</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <ThemedTextInput 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername}
          style={styles.input}
        />
        
        <ThemedTextInput 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        
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
  
  // Render Create Account Screen
  const renderCreateAccountScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <ThemedTextInput 
          placeholder="Username" 
          value={newUsername} 
          onChangeText={setNewUsername}
          style={styles.input}
        />
        
        <ThemedTextInput 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        
        <ThemedTextInput 
          placeholder="Password" 
          value={newPassword} 
          onChangeText={setNewPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <ThemedTextInput 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAccount}>
          <ThemedText style={styles.buttonText}>Create Account</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={goToWelcome}>
          <ThemedText style={styles.linkText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
  
  // Render Forgot Password Screen
  const renderForgotPasswordScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
      
      <ThemedText style={styles.description}>
        Enter your email address and we'll send you instructions to reset your password.
      </ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <ThemedTextInput 
          placeholder="Email" 
          value={resetEmail} 
          onChangeText={setResetEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword}>
          <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={goToWelcome}>
          <ThemedText style={styles.linkText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
  
  // Main render function
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