import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // 1. CATEGORIES
  // ============================================
  console.log('📁 Seeding categories...');

  const categories = [
    { name: 'Viennoiseries', slug: 'viennoiseries', icon: '🥐', description: 'Croissants, pains au chocolat, brioches' },
    { name: 'Chocolat & Confiserie', slug: 'chocolat', icon: '🍫', description: 'Techniques du chocolat et confiserie' },
    { name: 'Entremets', slug: 'entremets', icon: '🍰', description: 'Gâteaux et entremets classiques' },
    { name: 'Tartes & Tartelettes', slug: 'tartes', icon: '🥧', description: 'Tartes aux fruits et tartelettes' },
    { name: 'Pâtes de base', slug: 'pates', icon: '🥖', description: 'Pâtes feuilletées, brisées, sablées' },
    { name: 'Crèmes & Mousses', slug: 'cremes', icon: '🍮', description: 'Crèmes pâtissières, mousses, ganaches' },
    { name: 'Techniques', slug: 'techniques', icon: '👨‍🍳', description: 'Techniques fondamentales de pâtisserie' },
    { name: 'Culture pâtissière', slug: 'culture', icon: '📚', description: 'Histoire et culture de la pâtisserie' },
    { name: 'Ingrédients', slug: 'ingredients', icon: '🧈', description: 'Connaissance des ingrédients' },
    { name: 'Matériel', slug: 'materiel', icon: '🔪', description: 'Ustensiles et matériel professionnel' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
  }

  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // 2. DIFFICULTIES
  // ============================================
  console.log('⚡ Seeding difficulties...');

  const difficulties = [
    { level: 'apprenti', name: 'Apprenti', timePerQuestion: 45, xpMultiplier: 1.0 },
    { level: 'commis', name: 'Commis', timePerQuestion: 30, xpMultiplier: 1.5 },
    { level: 'chef', name: 'Chef', timePerQuestion: 20, xpMultiplier: 2.0 },
    { level: 'mof', name: 'MOF', timePerQuestion: 15, xpMultiplier: 3.0 },
  ];

  for (const diff of difficulties) {
    await prisma.difficulty.upsert({
      where: { level: diff.level },
      create: diff,
      update: diff,
    });
  }

  console.log(`✅ Created ${difficulties.length} difficulties`);

  // ============================================
  // 3. BADGES
  // ============================================
  console.log('🏅 Seeding badges...');

  const badges = [
    // COMMON
    {
      name: 'Premier Pas',
      description: 'Complète ton premier quiz',
      imageUrl: '/badges/first-quiz.png',
      rarity: 'COMMON' as const,
      condition: 'Compléter 1 quiz',
      coinReward: 25,
      conditionData: { type: 'quizzes_completed', count: 1 },
    },
    {
      name: 'Curieux',
      description: 'Joue dans 3 catégories différentes',
      imageUrl: '/badges/curious.png',
      rarity: 'COMMON' as const,
      condition: 'Jouer dans 3 catégories',
      coinReward: 25,
      conditionData: { type: 'categories_played', count: 3 },
    },
    {
      name: 'Matinal',
      description: 'Joue avant 9h du matin',
      imageUrl: '/badges/morning.png',
      rarity: 'COMMON' as const,
      condition: 'Jouer avant 9h',
      coinReward: 25,
      conditionData: { type: 'time_of_day', before: 9 },
    },
    {
      name: 'Noctambule',
      description: 'Joue après 22h',
      imageUrl: '/badges/night.png',
      rarity: 'COMMON' as const,
      condition: 'Jouer après 22h',
      coinReward: 25,
      conditionData: { type: 'time_of_day', after: 22 },
    },
    // RARE
    {
      name: 'Sans Faute',
      description: 'Obtiens un score parfait',
      imageUrl: '/badges/perfect.png',
      rarity: 'RARE' as const,
      condition: 'Score parfait (10/10)',
      coinReward: 100,
      conditionData: { type: 'perfect_quizzes', count: 1 },
    },
    {
      name: 'Rapide',
      description: 'Réponds en moins de 5 secondes en moyenne',
      imageUrl: '/badges/fast.png',
      rarity: 'RARE' as const,
      condition: 'Temps moyen < 5s',
      coinReward: 100,
      conditionData: { type: 'average_time', maxSeconds: 5 },
    },
    {
      name: 'Chocolatier',
      description: '50 bonnes réponses en Chocolat',
      imageUrl: '/badges/chocolate.png',
      rarity: 'RARE' as const,
      condition: '50 bonnes réponses en Chocolat',
      coinReward: 100,
      conditionData: { type: 'category_answers', category: 'chocolat', count: 50 },
    },
    {
      name: 'Viennois',
      description: '50 bonnes réponses en Viennoiseries',
      imageUrl: '/badges/croissant.png',
      rarity: 'RARE' as const,
      condition: '50 bonnes réponses en Viennoiseries',
      coinReward: 100,
      conditionData: { type: 'category_answers', category: 'viennoiseries', count: 50 },
    },
    {
      name: 'Polyvalent',
      description: 'Joue dans toutes les catégories',
      imageUrl: '/badges/versatile.png',
      rarity: 'RARE' as const,
      condition: 'Jouer dans 10 catégories',
      coinReward: 150,
      conditionData: { type: 'categories_played', count: 10 },
    },
    {
      name: 'Régulier',
      description: '7 jours de suite',
      imageUrl: '/badges/streak-7.png',
      rarity: 'RARE' as const,
      condition: 'Streak de 7 jours',
      coinReward: 100,
      conditionData: { type: 'streak', days: 7 },
    },
    // EPIC
    {
      name: 'Marathonien',
      description: '30 jours de suite',
      imageUrl: '/badges/streak-30.png',
      rarity: 'EPIC' as const,
      condition: 'Streak de 30 jours',
      coinReward: 250,
      conditionData: { type: 'streak', days: 30 },
    },
    {
      name: 'Expert',
      description: 'Atteins le niveau 20',
      imageUrl: '/badges/level-20.png',
      rarity: 'EPIC' as const,
      condition: 'Niveau 20',
      coinReward: 250,
      conditionData: { type: 'level', value: 20 },
    },
    {
      name: 'Perfectionniste',
      description: '10 quiz parfaits',
      imageUrl: '/badges/perfect-10.png',
      rarity: 'EPIC' as const,
      condition: '10 quiz parfaits',
      coinReward: 250,
      conditionData: { type: 'perfect_quizzes', count: 10 },
    },
    {
      name: 'Encyclopédie',
      description: '500 bonnes réponses',
      imageUrl: '/badges/500-correct.png',
      rarity: 'EPIC' as const,
      condition: '500 bonnes réponses',
      coinReward: 250,
      conditionData: { type: 'total_correct_answers', count: 500 },
    },
    // LEGENDARY
    {
      name: 'Légende',
      description: '100 jours de suite',
      imageUrl: '/badges/streak-100.png',
      rarity: 'LEGENDARY' as const,
      condition: 'Streak de 100 jours',
      coinReward: 500,
      conditionData: { type: 'streak', days: 100 },
    },
    {
      name: 'Grand Maître',
      description: 'Atteins le niveau 50',
      imageUrl: '/badges/level-50.png',
      rarity: 'LEGENDARY' as const,
      condition: 'Niveau 50',
      coinReward: 500,
      conditionData: { type: 'level', value: 50 },
    },
    {
      name: 'Imbattable',
      description: '50 quiz parfaits',
      imageUrl: '/badges/perfect-50.png',
      rarity: 'LEGENDARY' as const,
      condition: '50 quiz parfaits',
      coinReward: 500,
      conditionData: { type: 'perfect_quizzes', count: 50 },
    },
    {
      name: 'MOF',
      description: 'Quiz parfait en difficulté MOF',
      imageUrl: '/badges/mof.png',
      rarity: 'LEGENDARY' as const,
      condition: 'Quiz parfait en MOF',
      coinReward: 500,
      conditionData: { type: 'perfect_quiz_difficulty', difficulty: 'mof' },
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      create: badge,
      update: badge,
    });
  }

  console.log(`✅ Created ${badges.length} badges`);

  // ============================================
  // 4. SHOP ITEMS
  // ============================================
  console.log('🛒 Seeding shop items...');

  const shopItems = [
    {
      type: 'POWERUP_FIFTY_FIFTY' as const,
      name: '50/50',
      description: 'Retire 2 mauvaises réponses',
      price: 100,
      available: true,
    },
    {
      type: 'POWERUP_EXTRA_TIME' as const,
      name: '+15 secondes',
      description: 'Ajoute 15 secondes au timer',
      price: 50,
      available: true,
    },
    {
      type: 'POWERUP_SKIP' as const,
      name: 'Passer',
      description: 'Passe la question sans pénalité',
      price: 150,
      available: true,
    },
    {
      type: 'LIFE' as const,
      name: 'Vie supplémentaire',
      description: '+1 vie immédiate',
      price: 300,
      available: true,
    },
    {
      type: 'STREAK_FREEZE' as const,
      name: 'Protection Streak',
      description: 'Protège ton streak pour 1 jour',
      price: 200,
      available: true,
    },
  ];

  for (const item of shopItems) {
    const existing = await prisma.shopItem.findFirst({
      where: { type: item.type },
    });

    if (!existing) {
      await prisma.shopItem.create({
        data: item,
      });
    }
  }

  console.log(`✅ Created ${shopItems.length} shop items`);

  // ============================================
  // 5. TEST USERS
  // ============================================
  console.log('👤 Seeding test users...');

  const hashedAdminPassword = await bcrypt.hash('Admin123!', 12);
  const hashedTestPassword = await bcrypt.hash('Test123!', 12);

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pastryquiz.com' },
    create: {
      email: 'admin@pastryquiz.com',
      username: 'admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      playerProgress: {
        create: {
          currentXP: 0,
          currentLevel: 1,
        },
      },
      wallet: {
        create: {
          balance: 10000,
          lifetimeEarned: 10000,
        },
      },
      lives: {
        create: {
          currentLives: 5,
          maxLives: 5,
        },
      },
      playerRanking: {
        create: {
          globalScore: 0,
          weeklyScore: 0,
        },
      },
    },
    update: {},
  });

  // Test player user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@pastryquiz.com' },
    create: {
      email: 'test@pastryquiz.com',
      username: 'testplayer',
      password: hashedTestPassword,
      role: 'PLAYER',
      playerProgress: {
        create: {
          currentXP: 0,
          currentLevel: 1,
        },
      },
      wallet: {
        create: {
          balance: 1000,
          lifetimeEarned: 1000,
        },
      },
      lives: {
        create: {
          currentLives: 5,
          maxLives: 5,
        },
      },
      playerRanking: {
        create: {
          globalScore: 0,
          weeklyScore: 0,
        },
      },
    },
    update: {},
  });

  console.log('✅ Created 2 test users');
  console.log('   📧 Admin: admin@pastryquiz.com / Admin123!');
  console.log('   📧 Player: test@pastryquiz.com / Test123!');

  // ============================================
  // 6. SAMPLE QUESTIONS
  // ============================================
  console.log('❓ Seeding sample questions...');

  const chocolatCategory = await prisma.category.findUnique({ where: { slug: 'chocolat' } });
  const apprentiDifficulty = await prisma.difficulty.findUnique({ where: { level: 'apprenti' } });

  if (chocolatCategory && apprentiDifficulty) {
    const sampleQuestions = [
      {
        text: 'Quelle est la température idéale pour tempérer le chocolat noir ?',
        explanation: 'Le chocolat noir doit être tempéré entre 31°C et 32°C pour obtenir un résultat brillant et croquant.',
        categoryId: chocolatCategory.id,
        difficultyId: apprentiDifficulty.id,
        createdById: adminUser.id,
        status: 'PUBLISHED' as const,
        answers: [
          { text: '31-32°C', isCorrect: true },
          { text: '25-27°C', isCorrect: false },
          { text: '35-37°C', isCorrect: false },
          { text: '40-45°C', isCorrect: false },
        ],
      },
      {
        text: 'Combien de fèves de cacao contient une cabosse en moyenne ?',
        explanation: 'Une cabosse de cacao contient en moyenne 20 à 40 fèves, selon la variété.',
        categoryId: chocolatCategory.id,
        difficultyId: apprentiDifficulty.id,
        createdById: adminUser.id,
        status: 'PUBLISHED' as const,
        answers: [
          { text: '20 à 40 fèves', isCorrect: true },
          { text: '5 à 10 fèves', isCorrect: false },
          { text: '50 à 100 fèves', isCorrect: false },
          { text: '100 à 200 fèves', isCorrect: false },
        ],
      },
      {
        text: 'Quel type de chocolat contient le plus de cacao ?',
        explanation: 'Le chocolat noir contient généralement 70% à 99% de cacao, contre 25-40% pour le chocolat au lait.',
        categoryId: chocolatCategory.id,
        difficultyId: apprentiDifficulty.id,
        createdById: adminUser.id,
        status: 'PUBLISHED' as const,
        answers: [
          { text: 'Chocolat noir', isCorrect: true },
          { text: 'Chocolat au lait', isCorrect: false },
          { text: 'Chocolat blanc', isCorrect: false },
          { text: 'Chocolat ruby', isCorrect: false },
        ],
      },
      {
        text: 'Quelle est la principale différence entre le cacao et le chocolat ?',
        explanation: 'Le cacao est le produit brut issu de la fève, tandis que le chocolat est un mélange de cacao, sucre et parfois lait.',
        categoryId: chocolatCategory.id,
        difficultyId: apprentiDifficulty.id,
        createdById: adminUser.id,
        status: 'PUBLISHED' as const,
        answers: [
          { text: 'Le chocolat contient du sucre ajouté', isCorrect: true },
          { text: 'Le cacao est plus sucré', isCorrect: false },
          { text: 'Il n\'y a aucune différence', isCorrect: false },
          { text: 'Le chocolat provient d\'une autre plante', isCorrect: false },
        ],
      },
      {
        text: 'Qu\'est-ce que le conchage dans la fabrication du chocolat ?',
        explanation: 'Le conchage est une étape de malaxage à chaud qui affine la texture et développe les arômes du chocolat.',
        categoryId: chocolatCategory.id,
        difficultyId: apprentiDifficulty.id,
        createdById: adminUser.id,
        status: 'PUBLISHED' as const,
        answers: [
          { text: 'Un processus de malaxage à chaud', isCorrect: true },
          { text: 'Une méthode de tempérage', isCorrect: false },
          { text: 'Une technique de moulage', isCorrect: false },
          { text: 'Un type de fermentation', isCorrect: false },
        ],
      },
    ];

    for (const q of sampleQuestions) {
      const { answers, ...questionData } = q;

      const existing = await prisma.question.findFirst({
        where: { text: q.text },
      });

      if (!existing) {
        await prisma.question.create({
          data: {
            ...questionData,
            answers: {
              create: answers,
            },
          },
        });
      }
    }

    console.log(`✅ Created ${sampleQuestions.length} sample questions`);
  }

  console.log('\n🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
