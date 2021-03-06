import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    //AsyncStorage.clear();
    async function verifyToken() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('List');
      }
    }
    verifyToken();
  }, []);

  async function handleSubmit() {
    if (cpf.length > 10 && password) {
      setLoading(true);
      try {
        const response = await api.post('/login', { cpf, password });
        const { token } = response.data;
        await AsyncStorage.setItem('token', token);
        navigation.navigate('List');
      } catch (err) {
        alert('CPF ou senha inválidos');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image}></Image>
      <View style={styles.form}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Informe o CPF"
        ></TextInput>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          secureTextEntry
          placeholder="Informe a senha"
        ></TextInput>
        {loading ? (
          <ActivityIndicator color="#444" size="large"></ActivityIndicator>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  image: {
    width: 200,
    height: 200
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30
  },
  title: {
    color: '#E20C14',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginLeft: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 30
  },
  button: {
    height: 42,
    backgroundColor: '#E20C14',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
