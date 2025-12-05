import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const examples = [
    {
      title: "Login & Registration",
      description: "Authentication flow with login and signup",
      route: "/examples/login",
      icon: "🔐",
    },
    {
      title: "Quiz Game",
      description: "Complete quiz gameplay with timer and scoring",
      route: "/examples/quiz",
      icon: "🎯",
    },
    {
      title: "Wallet & Shop",
      description: "Economy management with coins, lives, and shop",
      route: "/examples/wallet",
      icon: "💰",
    },
    {
      title: "Profile & Stats",
      description: "User profile with badges and achievements",
      route: "/examples/profile",
      icon: "👤",
    },
    {
      title: "Leaderboard",
      description: "Global, weekly, and monthly rankings",
      route: "/examples/leaderboard",
      icon: "🏆",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>React Query Examples</Text>
        <Text style={styles.subtitle}>
          Tap any example below to see React Query hooks in action
        </Text>
      </View>

      {examples.map((example, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => router.push(example.route as any)}
        >
          <Text style={styles.cardIcon}>{example.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{example.title}</Text>
            <Text style={styles.cardDescription}>{example.description}</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All examples use React Query for server state management
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  cardArrow: {
    fontSize: 32,
    color: "#007AFF",
    fontWeight: "300",
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
  },
});
