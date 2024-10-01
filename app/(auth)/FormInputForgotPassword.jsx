import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig'; // Adjust the path to your Firebase config

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      if (email) {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);
        Alert.alert("Success", "A password reset email has been sent to your email address.");
      } else {
        Alert.alert("Error", "Please enter your email address.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Forgot Password</Text>
      
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button title="Send Reset Email" onPress={handleForgotPassword} />

      <Text style={{ marginTop: 20 }}>
        Please check your email for instructions on how to reset your password.
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;
