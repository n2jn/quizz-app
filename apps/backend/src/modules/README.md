# Bounded Contexts - Modular Monolith Architecture

This directory contains all 6 bounded contexts following Clean Architecture principles.

## Architecture Layers

Each bounded context follows this structure:

```
module-name/
├── module-name.module.ts       # NestJS module definition
├── domain/                     # Pure business logic (no dependencies)
│   ├── entities/              # Domain entities
│   ├── aggregates/            # Aggregate roots
│   ├── value-objects/         # Value objects
│   ├── events/                # Domain events
│   ├── repositories/          # Repository interfaces
│   └── services/              # Domain services
├── application/                # Use cases and orchestration
│   ├── commands/              # Command handlers (CQRS)
│   ├── queries/               # Query handlers (CQRS)
│   ├── services/              # Application services
│   └── event-handlers/        # Cross-context event handlers
├── infrastructure/             # External concerns
│   ├── persistence/           # Prisma repositories
│   ├── cache/                 # Redis caching
│   └── strategies/            # Passport strategies (auth)
└── presentation/               # API layer
    ├── controllers/           # REST controllers
    ├── dtos/                  # Request/Response DTOs
    └── guards/                # Authorization guards
```

## Bounded Contexts

### 1. Identity (User Authentication & Management)
- User registration and login
- JWT token management
- Password hashing

### 2. Quiz (Core Game Logic)
- Quiz session management
- Question delivery
- Answer validation
- Score calculation

### 3. Gamification (Progress & Achievements)
- XP and leveling system
- Badge system
- Streak tracking
- Category statistics

### 4. Leaderboard (Rankings)
- Global rankings
- Weekly rankings
- Cached leaderboard queries

### 5. Economy (Virtual Currency & Lives)
- Wallet management
- Coin rewards and spending
- Lives system with regeneration
- Shop purchases

### 6. Content (Admin - Question Management)
- CRUD for questions
- Publishing workflow
- Category management

## Communication Between Contexts

Contexts communicate via **Domain Events** (in-process EventEmitter):

- **Asynchronous**: Events are fired and handled asynchronously
- **Decoupled**: No direct imports between contexts
- **Event Bus**: Centralized event distribution

Example flow:
```
Quiz Context        ->  QuizCompletedEvent
                        ↓
Gamification        ->  Add XP, Update Streak
Economy            ->  Award 10 coins
Leaderboard        ->  Update ranking
```

## Dependency Rules

1. **Domain** → No dependencies (pure TypeScript)
2. **Application** → Depends on Domain only
3. **Infrastructure** → Depends on Domain + Application
4. **Presentation** → Depends on Application (NOT Domain directly)

## Next Steps

See individual ticket files in `docs/tickets/phase-2-*` for implementation details.
