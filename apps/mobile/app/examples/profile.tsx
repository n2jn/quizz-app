import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useProfile, useLogout } from '../../src/api/hooks/useAuth';
import {
  useProgress,
  useUserBadges,
  useAchievements,
} from '../../src/api/hooks/useGamification';
import { useRouter } from 'expo-router';

/**
 * Example Profile Screen
 *
 * Demonstrates:
 * - useProfile hook to display user information
 * - useProgress hook to show level, XP, and stats
 * - useUserBadges hook to display earned badges
 * - useAchievements hook to show achievements progress
 * - useLogout hook for signing out
 * - Progress bars and visual indicators
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useProfile();
  const {
    data: progress,
    isLoading: progressLoading,
    refetch: refetchProgress,
  } = useProgress();
  const {
    data: badges,
    isLoading: badgesLoading,
    refetch: refetchBadges,
  } = useUserBadges();
  const {
    data: achievements,
    isLoading: achievementsLoading,
    refetch: refetchAchievements,
  } = useAchievements();
  const logout = useLogout();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'achievements'>('stats');

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchUser(),
      refetchProgress(),
      refetchBadges(),
      refetchAchievements(),
    ]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  const calculateXPProgress = () => {
    if (!progress) return 0;
    return (progress.xp / progress.xpToNextLevel) * 100;
  };

  if (userLoading || progressLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userUsername}>@{user?.username}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Level & XP */}
      <View style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelValue}>{progress?.level || 1}</Text>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>
              {progress?.xp || 0} / {progress?.xpToNextLevel || 100} XP
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${calculateXPProgress()}%` }]}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text
            style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}
          >
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Text
            style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}
          >
            Badges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'achievements' && styles.activeTabText,
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress?.totalQuestionsAnswered || 0}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress?.correctAnswers || 0}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress?.accuracy.toFixed(1) || 0}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <View style={styles.statFullWidth}>
            <Text style={styles.statValue}>{progress?.longestStreak || 0}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>

          <View style={styles.statFullWidth}>
            <Text style={styles.statValue}>{progress?.totalXp || 0}</Text>
            <Text style={styles.statLabel}>Total XP Earned</Text>
          </View>
        </View>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <View style={styles.badgesContainer}>
          {badgesLoading ? (
            <ActivityIndicator color="#007AFF" />
          ) : badges && badges.length > 0 ? (
            <View style={styles.badgesGrid}>
              {badges.map((userBadge) => (
                <View key={userBadge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeIcon,
                      userBadge.badge.rarity === 'LEGENDARY' && styles.legendaryBadge,
                      userBadge.badge.rarity === 'EPIC' && styles.epicBadge,
                      userBadge.badge.rarity === 'RARE' && styles.rareBadge,
                    ]}
                  >
                    <Text style={styles.badgeEmoji}>🏆</Text>
                  </View>
                  <Text style={styles.badgeName}>{userBadge.badge.name}</Text>
                  <Text style={styles.badgeRarity}>{userBadge.badge.rarity}</Text>
                  <Text style={styles.badgeDate}>
                    Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No badges earned yet</Text>
              <Text style={styles.emptySubtext}>Complete challenges to earn badges!</Text>
            </View>
          )}
        </View>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <View style={styles.achievementsContainer}>
          {achievementsLoading ? (
            <ActivityIndicator color="#007AFF" />
          ) : achievements && achievements.length > 0 ? (
            achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  {achievement.isUnlocked && (
                    <Text style={styles.achievementUnlocked}>✓</Text>
                  )}
                </View>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <View style={styles.achievementProgress}>
                  <View style={styles.achievementProgressBar}>
                    <View
                      style={[
                        styles.achievementProgressFill,
                        {
                          width: `${(achievement.progress / achievement.target) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.achievementProgressText}>
                    {achievement.progress} / {achievement.target}
                  </Text>
                </View>
                <View style={styles.achievementFooter}>
                  <Text style={styles.achievementCategory}>{achievement.category}</Text>
                  <Text style={styles.achievementPoints}>
                    {achievement.points} pts
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No achievements available</Text>
            </View>
          )}
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={logout.isPending}
      >
        {logout.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  levelSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 16,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statFullWidth: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  badgesContainer: {
    marginBottom: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendaryBadge: {
    backgroundColor: '#FFD700',
  },
  epicBadge: {
    backgroundColor: '#9C27B0',
  },
  rareBadge: {
    backgroundColor: '#2196F3',
  },
  badgeEmoji: {
    fontSize: 30,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeRarity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    color: '#999',
  },
  achievementsContainer: {
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  achievementUnlocked: {
    fontSize: 24,
    color: '#4CAF50',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  achievementProgress: {
    marginBottom: 12,
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666',
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCategory: {
    fontSize: 12,
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  achievementPoints: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
