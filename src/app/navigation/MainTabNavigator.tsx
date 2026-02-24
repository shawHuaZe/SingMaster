// Main Tab Navigator
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { colors } from '../../shared/constants';

import HomeScreen from '../../features/practice/screens/HomeScreen';
import PracticeScreen from '../../features/practice/screens/PracticeHomeScreen';
import ProgressScreen from '../../features/progress/screens/ProgressScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Simple icon components
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return focused ? '🏠' : '🏡';
      case 'Practice':
        return focused ? '🎤' : '🎵';
      case 'Progress':
        return focused ? '📊' : '📈';
      case 'Profile':
        return focused ? '👤' : '👤';
      default:
        return '📱';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {getIcon()}
      </Text>
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerTitle: 'SingMaster',
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          title: '练习',
          headerTitle: '选择关卡',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: '进度',
          headerTitle: '我的进度',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          headerTitle: '个人中心',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: 8,
    height: 85,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});

export default MainTabNavigator;
