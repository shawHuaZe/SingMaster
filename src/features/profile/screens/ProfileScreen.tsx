// Profile Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useUserStore } from '../../../core/storage/userStore';
import { useProgressStore } from '../../../core/storage/progressStore';
import { Card } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useUserStore();
  const { progress } = useProgressStore();

  const menuItems = [
    { icon: '👤', label: '个人资料', onPress: () => {} },
    { icon: '🔔', label: '通知设置', onPress: () => {}, toggle: true },
    { icon: '🎧', label: '音效设置', onPress: () => {} },
    { icon: '🌙', label: '深色模式', onPress: () => {}, toggle: true },
    { icon: '📖', label: '使用帮助', onPress: () => {} },
    { icon: '📝', label: '用户协议', onPress: () => {} },
    { icon: '🔒', label: '隐私政策', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nickname?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{user?.nickname || '歌手'}</Text>
              <Text style={styles.phone}>{user?.phone || ''}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>等级 {user?.level || 1}</Text>
              </View>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.streak || 0}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round((progress.totalPracticeTime || 0) / 60)}
              </Text>
              <Text style={styles.statLabel}>练习分钟</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {progress.completedLessons.length}
              </Text>
              <Text style={styles.statLabel}>完成关卡</Text>
            </View>
          </View>
        </Card>

        {/* Membership */}
        <Card style={styles.membershipCard}>
          <View style={styles.membershipContent}>
            <Text style={styles.membershipIcon}>💎</Text>
            <View style={styles.membershipInfo}>
              <Text style={styles.membershipTitle}>开通会员</Text>
              <Text style={styles.membershipDesc}>解锁更多功能和课程</Text>
            </View>
            <TouchableOpacity style={styles.membershipButton}>
              <Text style={styles.membershipButtonText}>开通</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.toggle ? (
                <Switch
                  value={false}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.surface}
                />
              ) : (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>SingMaster v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    ...typography.headingMedium,
    color: colors.text,
  },
  phone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  levelBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  levelText: {
    ...typography.labelSmall,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.numeric,
    color: colors.text,
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  membershipCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
  },
  membershipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipTitle: {
    ...typography.headingSmall,
    color: '#FFFFFF',
  },
  membershipDesc: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  membershipButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
  },
  membershipButtonText: {
    ...typography.labelMedium,
    color: colors.secondary,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  logoutButton: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.error,
  },
  version: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default ProfileScreen;
