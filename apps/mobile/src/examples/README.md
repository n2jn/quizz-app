# Example Screens - React Query Integration

This folder contains complete, production-ready example screens that demonstrate how to use the React Query hooks throughout the mobile app.

## Overview

All examples follow best practices for:
- State management with React Query
- Error handling and loading states
- User feedback with alerts and notifications
- Pull-to-refresh functionality
- Optimistic UI updates
- Type safety with TypeScript

## Example Screens

### 1. LoginScreen.tsx

**Demonstrates:**
- `useLogin()` - User authentication
- `useRegister()` - User registration
- Form state management
- Error handling and validation
- Loading states with ActivityIndicator
- Navigation after successful login/register

**Key Features:**
- Toggle between login and registration
- Input validation
- Error messages from API
- Disabled state during loading
- Automatic navigation to home on success

**Usage:**
```tsx
import LoginScreen from '../src/examples/LoginScreen';

// In your navigation/routing
<Stack.Screen name="login" component={LoginScreen} />
```

---

### 2. QuizScreen.tsx

**Demonstrates:**
- `useStartQuiz()` - Start a new quiz session
- `useQuizSession(sessionId)` - Fetch current question
- `useSubmitAnswer(sessionId)` - Submit answers
- `useCompleteQuiz(sessionId)` - Finish the quiz
- Timer implementation
- Dynamic UI based on answer correctness

**Key Features:**
- Difficulty selection (Easy, Medium, Hard)
- Real-time timer for each question
- Answer feedback (correct/incorrect)
- Point calculations with time bonuses
- Progress tracking (score, question count)
- Auto-advance to next question
- Quiz completion summary

**Usage:**
```tsx
import QuizScreen from '../src/examples/QuizScreen';

<Stack.Screen name="quiz" component={QuizScreen} />
```

---

### 3. WalletScreen.tsx

**Demonstrates:**
- `useWallet()` - Display coins and lives
- `useLives()` - Auto-refreshing lives data
- `useShopItems()` - Available items in shop
- `usePurchaseItem()` - Buy items
- Pull-to-refresh
- Life regeneration countdown

**Key Features:**
- Real-time wallet balance
- Life regeneration timer (counts down to next life)
- Shop items with categories (Power-ups, Life Packs, Cosmetics)
- Purchase confirmation dialogs
- Insufficient funds handling
- Visual badges for item types
- Optimistic UI updates

**Usage:**
```tsx
import WalletScreen from '../src/examples/WalletScreen';

<Stack.Screen name="wallet" component={WalletScreen} />
```

---

### 4. ProfileScreen.tsx

**Demonstrates:**
- `useProfile()` - User information
- `useProgress()` - Level, XP, and stats
- `useUserBadges()` - Earned badges
- `useAchievements()` - Achievement progress
- `useLogout()` - Sign out
- Tab navigation
- Progress bars

**Key Features:**
- User profile with avatar
- Level and XP progress bar
- Tabbed interface (Stats, Badges, Achievements)
- Detailed statistics (questions, accuracy, streaks)
- Badge collection with rarity indicators
- Achievement tracking with progress
- Pull-to-refresh
- Logout functionality

**Usage:**
```tsx
import ProfileScreen from '../src/examples/ProfileScreen';

<Stack.Screen name="profile" component={ProfileScreen} />
```

---

### 5. LeaderboardScreen.tsx

**Demonstrates:**
- `useGlobalLeaderboard()` - All-time rankings
- `useWeeklyLeaderboard()` - Weekly rankings
- `useMonthlyLeaderboard()` - Monthly rankings
- Tab navigation between leaderboard types
- Current user highlighting

**Key Features:**
- Three leaderboard types (Global, Weekly, Monthly)
- User's current rank card
- Top 3 special styling with medals (🥇🥈🥉)
- Current user highlighting
- Avatar placeholders
- Score and level display
- Pull-to-refresh
- Total entries count

**Usage:**
```tsx
import LeaderboardScreen from '../src/examples/LeaderboardScreen';

<Stack.Screen name="leaderboard" component={LeaderboardScreen} />
```

---

## Common Patterns

### 1. Loading States

All examples handle loading states:

```tsx
if (isLoading) {
  return (
    <View style={[styles.container, styles.centered]}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}
```

### 2. Error Handling

Errors are caught and displayed to users:

```tsx
try {
  await mutation.mutateAsync(data);
} catch (error) {
  Alert.alert('Error', 'Something went wrong. Please try again.');
}
```

### 3. Pull-to-Refresh

Most screens implement pull-to-refresh:

```tsx
const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
```

### 4. Optimistic Updates

React Query automatically handles cache invalidation:

```tsx
onSuccess: () => {
  // Invalidate related queries to refetch updated data
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
}
```

## Styling

All examples use StyleSheet for performance and follow a consistent design system:

- Primary color: `#007AFF` (iOS blue)
- Success color: `#4CAF50` (green)
- Warning color: `#FF9800` (orange)
- Error color: `#F44336` (red)
- Background: `#f5f5f5` (light gray)
- Card background: `#fff` (white)
- Text primary: `#333`
- Text secondary: `#666`

## Integration with Your App

To integrate these examples into your app:

1. **Copy the screen files** to your app's screen directory
2. **Import the hooks** - They're already set up
3. **Add to navigation** - Register in your router/navigator
4. **Customize styling** - Adjust colors and layouts to match your design
5. **Add features** - Build upon these examples

## Next Steps

1. Link `@quizz-app/shared-types` package for shared types
2. Replace inline type definitions with imported types
3. Add image support for avatars and badges
4. Implement animations and transitions
5. Add accessibility features (a11y)
6. Add analytics tracking
7. Implement offline support with React Query's offline features

## Notes

- All examples use Expo Router for navigation
- Examples assume you have QueryProvider wrapped around your app
- Type definitions are inline but should be imported from shared-types package
- Examples use Alert for user feedback - consider using a Toast library for better UX
- Life regeneration assumes 10-minute intervals (configurable in backend)

## Support

For questions or issues with these examples, refer to:
- React Query docs: https://tanstack.com/query/latest
- Expo Router docs: https://docs.expo.dev/router/introduction/
- React Native docs: https://reactnative.dev/
