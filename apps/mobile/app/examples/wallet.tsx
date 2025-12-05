import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  useWallet,
  useLives,
  useShopItems,
  usePurchaseItem,
} from '../../src/api/hooks/useEconomy';

/**
 * Example Wallet & Shop Screen
 *
 * Demonstrates:
 * - useWallet hook to display coins and lives
 * - useLives hook with auto-refresh for life regeneration
 * - useShopItems hook to display available items
 * - usePurchaseItem hook to buy items
 * - Pull-to-refresh functionality
 * - Optimistic UI updates
 */
export default function WalletScreen() {
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useWallet();
  const { data: lives, isLoading: livesLoading } = useLives();
  const {
    data: shopItems,
    isLoading: shopLoading,
    refetch: refetchShop,
  } = useShopItems();
  const purchaseItem = usePurchaseItem();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchShop()]);
    setRefreshing(false);
  };

  const handlePurchase = async (itemId: string, itemName: string, cost: number) => {
    if (!wallet) return;

    if (wallet.coins < cost) {
      Alert.alert('Insufficient Coins', 'You do not have enough coins for this item.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${itemName} for ${cost} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            try {
              const result = await purchaseItem.mutateAsync({ itemId });
              Alert.alert(
                'Purchase Successful!',
                `You bought ${result.item.name}. New balance: ${result.newBalance} coins.`
              );
            } catch (error) {
              Alert.alert('Purchase Failed', 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const calculateLifeRegenTime = () => {
    if (!lives || lives.lives >= lives.maxLives) return null;

    const now = new Date();
    const lastRegen = new Date(lives.lastLifeRegenAt);
    const timeSinceRegen = Math.floor((now.getTime() - lastRegen.getTime()) / 1000);
    const regenInterval = 10 * 60; // 10 minutes in seconds
    const timeToNextLife = regenInterval - (timeSinceRegen % regenInterval);

    const minutes = Math.floor(timeToNextLife / 60);
    const seconds = timeToNextLife % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (walletLoading || livesLoading || shopLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const lifeRegenTime = calculateLifeRegenTime();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Wallet Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.sectionTitle}>Your Wallet</Text>

        <View style={styles.balanceCards}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceEmoji}>💰</Text>
            <Text style={styles.balanceLabel}>Coins</Text>
            <Text style={styles.balanceValue}>{wallet?.coins || 0}</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceEmoji}>❤️</Text>
            <Text style={styles.balanceLabel}>Lives</Text>
            <Text style={styles.balanceValue}>
              {lives?.lives || 0}/{lives?.maxLives || 5}
            </Text>
            {lifeRegenTime && (
              <Text style={styles.regenTime}>Next in {lifeRegenTime}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Shop Items */}
      <View style={styles.shopSection}>
        <Text style={styles.sectionTitle}>Shop</Text>

        {shopItems?.map((item) => (
          <View key={item.id} style={styles.shopItem}>
            <View style={styles.shopItemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View
                  style={[
                    styles.itemTypeBadge,
                    item.type === 'POWER_UP' && styles.powerUpBadge,
                    item.type === 'LIFE_PACK' && styles.lifePackBadge,
                    item.type === 'COSMETIC' && styles.cosmeticBadge,
                  ]}
                >
                  <Text style={styles.itemTypeBadgeText}>
                    {item.type.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <View style={styles.itemValueContainer}>
                  <Text style={styles.itemValueLabel}>Value:</Text>
                  <Text style={styles.itemValue}>+{item.value}</Text>
                </View>
                <View style={styles.itemCostContainer}>
                  <Text style={styles.itemCost}>{item.cost}</Text>
                  <Text style={styles.coinSymbol}>💰</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.buyButton,
                (!item.isAvailable || (wallet?.coins || 0) < item.cost) &&
                  styles.buyButtonDisabled,
              ]}
              onPress={() => handlePurchase(item.id, item.name, item.cost)}
              disabled={
                !item.isAvailable ||
                (wallet?.coins || 0) < item.cost ||
                purchaseItem.isPending
              }
            >
              {purchaseItem.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buyButtonText}>
                  {!item.isAvailable
                    ? 'Unavailable'
                    : (wallet?.coins || 0) < item.cost
                      ? 'Not Enough'
                      : 'Buy'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {(!shopItems || shopItems.length === 0) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        )}
      </View>
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
  balanceSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  balanceCards: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  regenTime: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  shopSection: {
    marginBottom: 20,
  },
  shopItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shopItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  powerUpBadge: {
    backgroundColor: '#E3F2FD',
  },
  lifePackBadge: {
    backgroundColor: '#FCE4EC',
  },
  cosmeticBadge: {
    backgroundColor: '#F3E5F5',
  },
  itemTypeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemValueLabel: {
    fontSize: 12,
    color: '#666',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  itemCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  coinSymbol: {
    fontSize: 18,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  },
});
