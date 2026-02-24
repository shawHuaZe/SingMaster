// Login Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUserStore } from '../../../core/storage/userStore';
import { Button } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';

const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const { login, register, isLoading } = useUserStore();

  const handleLogin = async () => {
    if (!phone || !code) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }

    try {
      await login(phone, code);
    } catch (error) {
      Alert.alert('登录失败', '请检查输入信息');
    }
  };

  const handleRegister = async () => {
    if (!phone || !code) {
      Alert.alert('提示', '请输入完整信息');
      return;
    }

    try {
      await register(phone, code, '用户' + phone.slice(-4));
    } catch (error) {
      Alert.alert('注册失败', '请稍后重试');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎤</Text>
            <Text style={styles.appName}>SingMaster</Text>
            <Text style={styles.tagline}>让每个人都能唱出属于自己的声音</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>手机号</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="请输入手机号"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>验证码</Text>
              <View style={styles.codeRow}>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="请输入验证码"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity style={styles.codeButton}>
                  <Text style={styles.codeButtonText}>获取验证码</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title={isLogin ? '登录' : '注册'}
              onPress={isLogin ? handleLogin : handleRegister}
              loading={isLoading}
              style={styles.button}
              size="large"
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isLogin ? '还没有账号？' : '已有账号？'}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchButton}>
                  {isLogin ? '立即注册' : '立即登录'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  appName: {
    ...typography.displayLarge,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  codeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  codeInput: {
    flex: 1,
  },
  codeButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  codeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  switchText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  switchButton: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
