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
import {
  useGlobalLeaderboard,
  useWeeklyLeaderboard,
  useMonthlyLeaderboard,
} from '../../src/api/hooks/useLeaderboard';

type LeaderboardType = 'global' | 'weekly' | 'monthly';

/**
 * Example Leaderboard Screen
 *
 * Demonstrates:
 * - useGlobalLeaderboard hook for all-time rankings
 * - useWeeklyLeaderboard hook for weekly rankings
 * - useMonthlyLeaderboard hook for monthly rankings
 * - Tab navigation between leaderboard types
 * - User highlighting in leaderboard
 * - Pull-to-refresh functionality
 * - Ranking medals and positions
 */
export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('global');

  const {
    data: globalData,
    isLoading: globalLoading,
    refetch: refetchGlobal,
  } = useGlobalLeaderboard(50);
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    refetch: refetchWeekly,
  } = useWeeklyLeaderboard(50);
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    refetch: refetchMonthly,
  } = useMonthlyLeaderboard(50);

  const [refreshing, setRefreshing] = useState(false);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'global':
        return globalData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'global':
        return globalLoading;
      case 'weekly':
        return weeklyLoading;
      case 'monthly':
        return monthlyLoading;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    switch (activeTab) {
      case 'global':
        await refetchGlobal();
        break;
      case 'weekly':
        await refetchWeekly();
        break;
      case 'monthly':
        await refetchMonthly();
        break;
    }
    setRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const data = getCurrentData();
  const loading = isLoading();

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text
            style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}
          >
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text
            style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'monthly' && styles.activeTabText,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* User's Rank Card */}
      {data?.userEntry && (
        <View style={styles.userRankCard}>
          <View style={styles.userRankLeft}>
            <Text style={styles.userRankLabel}>Your Rank</Text>
            <Text style={styles.userRankValue}>
              {getRankIcon(data.userEntry.rank)}
            </Text>
          </View>
          <View style={styles.userRankRight}>
            <Text style={styles.userRankScore}>{data.userEntry.score} pts</Text>
            <Text style={styles.userRankLevel}>Level {data.userEntry.level}</Text>
          </View>
        </View>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {data?.entries && data.entries.length > 0 ? (
            <>
              {data.entries.map((entry) => (
                <View
                  key={entry.userId}
                  style={[
                    styles.entryCard,
                    entry.isCurrentUser && styles.currentUserCard,
                    entry.rank <= 3 && styles.topThreeCard,
                  ]}
                >
                  <View style={styles.entryLeft}>
                    <View
                      style={[
                        styles.rankContainer,
                        entry.rank === 1 && styles.rank1,
                        entry.rank === 2 && styles.rank2,
                        entry.rank === 3 && styles.rank3,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankText,
                          entry.rank <= 3 && styles.medalText,
                        ]}
                      >
                        {getRankIcon(entry.rank)}
                      </Text>
                    </View>
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>
                        {entry.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.userDetails}>
                      <Text
                        style={[
                          styles.entryName,
                          entry.isCurrentUser && styles.currentUserName,
                        ]}
                      >
                        {entry.name}
                        {entry.isCurrentUser && ' (You)'}
                      </Text>
                      <Text style={styles.entryUsername}>@{entry.username}</Text>
                    </View>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={styles.entryScore}>{entry.score}</Text>
                    <Text style={styles.entryLevel}>Lv {entry.level}</Text>
                  </View>
                </View>
              ))}

              {/* Total Entries Info */}
              <View style={styles.totalEntriesContainer}>
                <Text style={styles.totalEntriesText}>
                  Showing {data.entries.length} of {data.totalEntries} players
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No leaderboard data available</Text>
              <Text style={styles.emptySubtext}>
                Be the first to set a score!
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
  },
  userRankCard: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  userRankLeft: {
    flex: 1,
  },
  userRankLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  userRankValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userRankRight: {
    alignItems: 'flex-end',
  },
  userRankScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userRankLevel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  topThreeCard: {
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank1: {
    backgroundColor: '#FFD700',
  },
  rank2: {
    backgroundColor: '#C0C0C0',
  },
  rank3: {
    backgroundColor: '#CD7F32',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  medalText: {
    fontSize: 20,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentUserName: {
    color: '#007AFF',
  },
  entryUsername: {
    fontSize: 14,
    color: '#666',
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  entryLevel: {
    fontSize: 12,
    color: '#666',
  },
  totalEntriesContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  totalEntriesText: {
    fontSize: 14,
    color: '#666',
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
});
