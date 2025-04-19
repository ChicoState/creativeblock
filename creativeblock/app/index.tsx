import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screen states
const SCREENS = {
  WELCOME: 'welcome',
  CREATE_ACCOUNT: 'createAccount',
  FORGOT_PASSWORD: 'forgotPassword'
};

// User data structure
interface User {
  username: string;
  password: string;
  email: string;
}

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
  
  // User management
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Check for logged in user on mount
  useEffect(() => {
    checkLoggedInUser();
  }, []);
  
  // Check if a user is already logged in
  const checkLoggedInUser = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(user);
        // Auto navigate to project home if user is logged in
        router.push('/projecthome');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking logged in user:', error);
      setIsLoading(false);
    }
  };
  
  // Navigation functions
  const goToWelcome = () => setCurrentScreen(SCREENS.WELCOME);
  const goToCreateAccount = () => setCurrentScreen(SCREENS.CREATE_ACCOUNT);
  const goToForgotPassword = () => setCurrentScreen(SCREENS.FORGOT_PASSWORD);
  
  // User storage functions
  const saveUser = async (user: User) => {
    try {
      // Get existing users or initialize empty array
      const usersJson = await AsyncStorage.getItem('users');
      let users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if username already exists
      if (users.some(u => u.username === user.username)) {
        return false;
      }
      
      // Add new user and save
      users.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  };
  
  const getUserByUsername = async (username: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) return null;
      
      const users: User[] = JSON.parse(usersJson);
      return users.find(u => u.username === username) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };
  
  const getUserByEmail = async (email: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) return null;
      
      const users: User[] = JSON.parse(usersJson);
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  };
  
  const updateUserPassword = async (email: string, newPassword: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (!usersJson) return false;
      
      let users: User[] = JSON.parse(usersJson);
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) return false;
      
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };
  
  const setLoggedInUser = async (username: string) => {
    try {
      await AsyncStorage.setItem('currentUser', username);
      setCurrentUser(username);
    } catch (error) {
      console.error('Error setting logged in user:', error);
    }
  };
  
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  };
  
  // Action handlers
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    
    const user = await getUserByUsername(username);
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }
    
    if (user.password !== password) {
      Alert.alert('Error', 'Invalid password');
      return;
    }
    
    // Login successful
    await setLoggedInUser(username);
    router.push('/projecthome');
  };
  
  const handleGuestLogin = () => {
    // Guest login doesn't set a current user
    router.push('/projecthome');
  };
  
  const handleCreateAccount = async () => {
    if (!newUsername || !email || !newPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Create new user
    const newUser: User = {
      username: newUsername,
      password: newPassword,
      email: email
    };
    
    const success = await saveUser(newUser);
    if (success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: goToWelcome }
      ]);
      
      // Clear form fields
      setNewUsername('');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('Error', 'Username already exists');
    }
  };
  
  const handleResetPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    const user = await getUserByEmail(resetEmail);
    if (!user) {
      Alert.alert('Error', 'No account found with this email');
      return;
    }
    
    // In a real app, you would send an email with a reset link
    // For this demo, we'll just simulate "resetting" the password to a default
    const tempPassword = 'resetpass123';
    const success = await updateUserPassword(resetEmail, tempPassword);
    
    if (success) {
      Alert.alert(
        'Success', 
        `Password has been reset to: ${tempPassword}`,
        [{ text: 'OK', onPress: goToWelcome }]
      );
      setResetEmail('');
    } else {
      Alert.alert('Error', 'Failed to reset password');
    }
  };
  
  // Render Welcome/Login Screen
  const renderWelcomeScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo}
        />
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
          returnKeyType="done"
          onSubmitEditing={handleLogin}
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
  
  // Show loading screen if still checking for logged in user
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  
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