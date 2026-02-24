// Root Navigator
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, AuthStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { useUserStore } from '../../core/storage/userStore';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import LevelDetailScreen from '../../features/gamification/screens/LevelDetailScreen';
import PracticeSessionScreen from '../../features/practice/screens/PracticeSessionScreen';
import ResultScreen from '../../features/gamification/screens/ResultScreen';
import LearningScreen from '../../features/practice/screens/LearningScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, loadUser } = useUserStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LevelDetail"
              component={LevelDetailScreen}
              options={{ title: '关卡详情' }}
            />
            <Stack.Screen
              name="Practice"
              component={PracticeSessionScreen}
              options={{
                title: '练习',
                headerBackVisible: true,
              }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{
                title: '结果',
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="Learning"
              component={LearningScreen}
              options={{
                title: '学习',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
