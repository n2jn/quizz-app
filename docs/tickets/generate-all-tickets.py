#!/usr/bin/env python3
"""
Complete Ticket Generator for PastryQuiz Backend Implementation

Generates all 67 implementation tickets.
"""

from pathlib import Path

# All 67 tickets defined
TICKETS = {
    "phase-1-foundation": [
        {
            "number": "001",
            "title": "Project Setup & Folder Structure",
            "context": "Infrastructure",
            "priority": "Critical",
            "depends_on": [],
            "time": "2h",
            "agent": "Foundation Agent",
            "objectives": "Initialize NestJS project with Clean Architecture folder structure for all 6 bounded contexts.",
            "deliverables": [
                "NestJS project initialization",
                "Install dependencies (@nestjs/*, prisma, passport, etc.)",
                "Create folder structure (modules, shared, config)",
                "Setup all 6 bounded context folders",
                "Configure TypeScript (strict mode, paths)",
                "Setup ESLint and Prettier",
                "Create .env.example"
            ],
            "files": [
                "apps/backend/package.json",
                "apps/backend/tsconfig.json",
                "apps/backend/.eslintrc.js",
                "apps/backend/src/main.ts",
                "apps/backend/src/app.module.ts",
                "apps/backend/src/modules/*/",
                "apps/backend/src/shared/"
            ],
            "specs": "application-architecture.md (Folder Structure section)"
        },
        {
            "number": "002",
            "title": "Prisma Schema & Migrations",
            "context": "Infrastructure",
            "priority": "Critical",
            "depends_on": ["#001"],
            "time": "3h",
            "agent": "Foundation Agent",
            "objectives": "Implement complete Prisma schema with all models, relationships, indexes, and constraints.",
            "deliverables": [
                "Prisma initialization",
                "Complete schema (23 models, 7 enums)",
                "All relationships and indexes",
                "Initial migration",
                "Generate Prisma Client"
            ],
            "files": [
                "apps/backend/prisma/schema.prisma",
                "apps/backend/prisma/migrations/",
                "apps/backend/.env"
            ],
            "specs": "prisma-schema.txt, IMPLEMENTATION-SPECS.md (Database Indexes)"
        },
        {
            "number": "003",
            "title": "Seed Script Implementation",
            "context": "Infrastructure",
            "priority": "High",
            "depends_on": ["#002"],
            "time": "3h",
            "agent": "Foundation Agent",
            "objectives": "Implement database seeding for categories, difficulties, badges, shop items, and test users.",
            "deliverables": [
                "Seed categories (10 items)",
                "Seed difficulties (4 items)",
                "Seed badges (18 items)",
                "Seed shop items (5 items)",
                "Create test users (admin + player)",
                "Create sample questions (5 items)"
            ],
            "files": [
                "apps/backend/prisma/seed.ts",
                "apps/backend/package.json"
            ],
            "specs": "seed-instructions.md, IMPLEMENTATION-SPECS.md (Constants section)"
        },
        {
            "number": "004",
            "title": "Shared Infrastructure",
            "context": "Infrastructure",
            "priority": "Critical",
            "depends_on": ["#002"],
            "time": "4h",
            "agent": "Foundation Agent",
            "objectives": "Implement shared services used across all bounded contexts.",
            "deliverables": [
                "PrismaService (database connection)",
                "EventBus (NestJS EventEmitter wrapper)",
                "Logger Service (structured logging)",
                "Base Repository class",
                "Base Entity class",
                "Base Aggregate Root class",
                "Base Value Object class",
                "Base Domain Event class",
                "Domain Exception classes"
            ],
            "files": [
                "apps/backend/src/shared/infrastructure/database/prisma.service.ts",
                "apps/backend/src/shared/infrastructure/events/event-bus.service.ts",
                "apps/backend/src/shared/infrastructure/logging/logger.service.ts",
                "apps/backend/src/shared/domain/base/*.ts",
                "apps/backend/src/shared/domain/exceptions/*.ts"
            ],
            "specs": "application-architecture.md (Shared Kernel section)"
        },
        {
            "number": "005",
            "title": "Authentication Infrastructure",
            "context": "Identity",
            "priority": "Critical",
            "depends_on": ["#004"],
            "time": "4h",
            "agent": "Foundation Agent",
            "objectives": "Setup JWT authentication infrastructure, guards, and decorators.",
            "deliverables": [
                "JWT Strategy (Passport)",
                "Refresh Token Strategy",
                "JwtAuthGuard",
                "RolesGuard",
                "CurrentUser decorator",
                "Roles decorator",
                "Rate Limit Guard (Redis-based)",
                "Password Service (bcrypt hashing)"
            ],
            "files": [
                "apps/backend/src/modules/identity/infrastructure/strategies/jwt.strategy.ts",
                "apps/backend/src/modules/identity/infrastructure/strategies/refresh-token.strategy.ts",
                "apps/backend/src/shared/presentation/guards/*.guard.ts",
                "apps/backend/src/shared/presentation/decorators/*.decorator.ts",
                "apps/backend/src/modules/identity/infrastructure/services/password.service.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (JWT, Rate Limits), validation-and-security.md"
        }
    ],
    "phase-2-identity": [
        {
            "number": "006",
            "title": "User Domain",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#005"],
            "time": "3h",
            "agent": "Identity Agent",
            "objectives": "Implement User aggregate with value objects and domain events.",
            "deliverables": [
                "User aggregate",
                "Email value object (validation)",
                "Password value object (hashing)",
                "Username value object (validation)",
                "UserRole enum",
                "UserRegisteredEvent",
                "UserLoggedInEvent",
                "ProfileUpdatedEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/domain/aggregates/user.aggregate.ts",
                "apps/backend/src/modules/identity/domain/value-objects/*.vo.ts",
                "apps/backend/src/modules/identity/domain/events/*.event.ts",
                "apps/backend/src/modules/identity/domain/aggregates/__tests__/user.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Domain Events - Identity), validation-and-security.md"
        },
        {
            "number": "007",
            "title": "User Repository",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#006"],
            "time": "2h",
            "agent": "Identity Agent",
            "objectives": "Implement User repository with Prisma integration.",
            "deliverables": [
                "IUserRepository interface",
                "UserRepository implementation",
                "Prisma DTO mapping (toDomain, toDto)",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/domain/repositories/user.repository.interface.ts",
                "apps/backend/src/modules/identity/infrastructure/persistence/user.repository.ts",
                "apps/backend/src/modules/identity/infrastructure/persistence/__tests__/user.repository.spec.ts"
            ],
            "specs": "application-architecture.md (Repository Pattern)"
        },
        {
            "number": "008",
            "title": "Register Command & Handler",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#007"],
            "time": "2h",
            "agent": "Identity Agent",
            "objectives": "Implement user registration command and handler.",
            "deliverables": [
                "RegisterUserCommand class",
                "RegisterUserHandler",
                "Email uniqueness check",
                "Password hashing",
                "Emit UserRegisteredEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/application/commands/register-user/register-user.command.ts",
                "apps/backend/src/modules/identity/application/commands/register-user/register-user.handler.ts",
                "apps/backend/src/modules/identity/application/commands/register-user/__tests__/register-user.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Commands section), validation-and-security.md"
        },
        {
            "number": "009",
            "title": "Login Command & Handler",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#007"],
            "time": "2h",
            "agent": "Identity Agent",
            "objectives": "Implement authentication login command and handler.",
            "deliverables": [
                "LoginCommand class",
                "LoginHandler",
                "Password verification",
                "JWT token generation",
                "Refresh token creation",
                "Emit UserLoggedInEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/application/commands/login/login.command.ts",
                "apps/backend/src/modules/identity/application/commands/login/login.handler.ts",
                "apps/backend/src/modules/identity/application/commands/login/__tests__/login.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (JWT section), validation-and-security.md"
        },
        {
            "number": "010",
            "title": "Refresh Token Handler",
            "context": "Identity",
            "priority": "Medium",
            "depends_on": ["#009"],
            "time": "2h",
            "agent": "Identity Agent",
            "objectives": "Implement refresh token rotation mechanism.",
            "deliverables": [
                "RefreshTokenCommand",
                "RefreshTokenHandler",
                "Token validation",
                "Token rotation logic",
                "Cleanup expired tokens",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/application/commands/refresh-token/refresh-token.command.ts",
                "apps/backend/src/modules/identity/application/commands/refresh-token/refresh-token.handler.ts",
                "apps/backend/src/modules/identity/application/commands/refresh-token/__tests__/refresh-token.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Refresh Token section)"
        },
        {
            "number": "011",
            "title": "Auth Controller & DTOs",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#008", "#009", "#010"],
            "time": "2h",
            "agent": "Identity Agent",
            "objectives": "Implement REST API controller for authentication endpoints.",
            "deliverables": [
                "AuthController (register, login, refresh)",
                "RegisterDto with validation",
                "LoginDto with validation",
                "RefreshTokenDto",
                "Response DTOs",
                "OpenAPI/Swagger decorators",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/identity/presentation/controllers/auth.controller.ts",
                "apps/backend/src/modules/identity/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/identity/presentation/controllers/__tests__/auth.controller.spec.ts"
            ],
            "specs": "api-design.md (Auth endpoints), validation-and-security.md"
        },
        {
            "number": "012",
            "title": "Identity Context Tests",
            "context": "Identity",
            "priority": "High",
            "depends_on": ["#011"],
            "time": "3h",
            "agent": "Identity Agent",
            "objectives": "Comprehensive testing for Identity context.",
            "deliverables": [
                "E2E tests for auth flows",
                "Integration tests for repositories",
                "Unit tests for domain logic",
                "Test coverage >90% for domain layer",
                "Edge case tests (invalid inputs, etc.)"
            ],
            "files": [
                "apps/backend/src/modules/identity/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/identity/__tests__/integration/*.spec.ts"
            ],
            "specs": "validation-and-security.md (Test cases)"
        }
    ],
    "phase-2-quiz": [
        {
            "number": "013",
            "title": "QuizSession Aggregate & Value Objects",
            "context": "Quiz",
            "priority": "Critical",
            "depends_on": ["#005"],
            "time": "5h",
            "agent": "Quiz Agent",
            "objectives": "Implement core Quiz aggregate with all business logic and value objects.",
            "deliverables": [
                "QuizSession aggregate",
                "Score value object",
                "Difficulty value object",
                "SessionStatus enum",
                "QuizStartedEvent",
                "QuestionAnsweredEvent",
                "QuizCompletedEvent",
                "PerfectScoreAchievedEvent",
                "QuizAbandonedEvent",
                "Comprehensive unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/aggregates/quiz-session.aggregate.ts",
                "apps/backend/src/modules/quiz/domain/value-objects/*.vo.ts",
                "apps/backend/src/modules/quiz/domain/events/*.event.ts",
                "apps/backend/src/modules/quiz/domain/aggregates/__tests__/quiz-session.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (QuizSession, Formulas, Events), business-rules-implementation.md"
        },
        {
            "number": "014",
            "title": "Question Entity & Related Models",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#005"],
            "time": "3h",
            "agent": "Quiz Agent",
            "objectives": "Implement Question entity with Answer entities and category/difficulty relationships.",
            "deliverables": [
                "Question entity",
                "Answer entity",
                "Category value object",
                "Question validation logic",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/entities/question.entity.ts",
                "apps/backend/src/modules/quiz/domain/entities/answer.entity.ts",
                "apps/backend/src/modules/quiz/domain/value-objects/category.vo.ts",
                "apps/backend/src/modules/quiz/domain/entities/__tests__/question.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Question structure)"
        },
        {
            "number": "015",
            "title": "Quiz Repositories",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#013", "#014"],
            "time": "3h",
            "agent": "Quiz Agent",
            "objectives": "Implement repositories for QuizSession and Question with Prisma.",
            "deliverables": [
                "IQuizSessionRepository interface",
                "QuizSessionRepository implementation",
                "IQuestionRepository interface",
                "QuestionRepository implementation",
                "Prisma DTO mappers",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/repositories/*.interface.ts",
                "apps/backend/src/modules/quiz/infrastructure/persistence/*.repository.ts",
                "apps/backend/src/modules/quiz/infrastructure/persistence/__tests__/*.spec.ts"
            ],
            "specs": "application-architecture.md (Repository Pattern)"
        },
        {
            "number": "016",
            "title": "StartQuiz Command & Handler",
            "context": "Quiz",
            "priority": "Critical",
            "depends_on": ["#015"],
            "time": "4h",
            "agent": "Quiz Agent",
            "objectives": "Implement quiz start command with question selection and session creation.",
            "deliverables": [
                "StartQuizCommand",
                "StartQuizHandler",
                "Question selection logic (10 random questions)",
                "Lives consumption check",
                "Session creation",
                "Emit QuizStartedEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.command.ts",
                "apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.handler.ts",
                "apps/backend/src/modules/quiz/application/commands/start-quiz/__tests__/start-quiz.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Quiz Flow), business-rules-implementation.md"
        },
        {
            "number": "017",
            "title": "SubmitAnswer Command & Handler",
            "context": "Quiz",
            "priority": "Critical",
            "depends_on": ["#015"],
            "time": "5h",
            "agent": "Quiz Agent",
            "objectives": "Implement answer submission with scoring, validation, and anti-cheat.",
            "deliverables": [
                "SubmitAnswerCommand",
                "SubmitAnswerHandler",
                "Answer validation logic",
                "Scoring calculation",
                "Time validation (anti-cheat)",
                "Session completion detection",
                "Emit QuestionAnsweredEvent",
                "Emit QuizCompletedEvent (on completion)",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.command.ts",
                "apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.handler.ts",
                "apps/backend/src/modules/quiz/application/commands/submit-answer/__tests__/submit-answer.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Scoring formulas), validation-and-security.md (Anti-cheat)"
        },
        {
            "number": "018",
            "title": "Question Selection Service",
            "context": "Quiz",
            "priority": "Medium",
            "depends_on": ["#015"],
            "time": "2h",
            "agent": "Quiz Agent",
            "objectives": "Implement intelligent question selection algorithm.",
            "deliverables": [
                "QuestionSelectionService",
                "Random selection by category/difficulty",
                "Avoid recent questions logic",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/services/question-selection.service.ts",
                "apps/backend/src/modules/quiz/domain/services/__tests__/question-selection.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Question Selection)"
        },
        {
            "number": "019",
            "title": "Scoring Service",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#013"],
            "time": "2h",
            "agent": "Quiz Agent",
            "objectives": "Implement scoring calculation service with all formulas.",
            "deliverables": [
                "ScoringService",
                "Base points calculation",
                "Difficulty multiplier",
                "Speed bonus calculation",
                "Perfect score detection",
                "Unit tests with all edge cases"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/services/scoring.service.ts",
                "apps/backend/src/modules/quiz/domain/services/__tests__/scoring.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Scoring Formulas), business-rules-implementation.md"
        },
        {
            "number": "020",
            "title": "Anti-Cheat Service",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#013"],
            "time": "3h",
            "agent": "Quiz Agent",
            "objectives": "Implement anti-cheat validation mechanisms.",
            "deliverables": [
                "AntiCheatService",
                "Time validation (min 500ms, max timelimit + 5s)",
                "Answer pattern detection",
                "Session timeout validation",
                "Suspicious activity logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/domain/services/anti-cheat.service.ts",
                "apps/backend/src/modules/quiz/domain/services/__tests__/anti-cheat.spec.ts"
            ],
            "specs": "validation-and-security.md (Anti-Cheat section)"
        },
        {
            "number": "021",
            "title": "Quiz Controller & DTOs",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#016", "#017"],
            "time": "3h",
            "agent": "Quiz Agent",
            "objectives": "Implement REST API controller for quiz endpoints.",
            "deliverables": [
                "QuizController (start, submit, get session)",
                "StartQuizDto",
                "SubmitAnswerDto",
                "Response DTOs",
                "JwtAuthGuard on all endpoints",
                "OpenAPI/Swagger documentation",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/quiz/presentation/controllers/quiz.controller.ts",
                "apps/backend/src/modules/quiz/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/quiz/presentation/controllers/__tests__/quiz.controller.spec.ts"
            ],
            "specs": "api-design.md (Quiz endpoints), validation-and-security.md"
        },
        {
            "number": "022",
            "title": "Quiz Context Tests",
            "context": "Quiz",
            "priority": "High",
            "depends_on": ["#021"],
            "time": "4h",
            "agent": "Quiz Agent",
            "objectives": "Comprehensive testing for Quiz context.",
            "deliverables": [
                "E2E quiz flow tests",
                "Integration tests for repositories",
                "Domain logic unit tests",
                "Anti-cheat scenario tests",
                "Test coverage >90%"
            ],
            "files": [
                "apps/backend/src/modules/quiz/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/quiz/__tests__/integration/*.spec.ts"
            ],
            "specs": "business-rules-implementation.md (Test cases)"
        }
    ],
    "phase-2-economy": [
        {
            "number": "023",
            "title": "Wallet Aggregate",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#005"],
            "time": "3h",
            "agent": "Economy Agent",
            "objectives": "Implement Wallet aggregate with currency management.",
            "deliverables": [
                "Wallet aggregate",
                "Currency value object",
                "Credit/debit methods",
                "CurrencyEarnedEvent",
                "CurrencySpentEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/domain/aggregates/wallet.aggregate.ts",
                "apps/backend/src/modules/economy/domain/value-objects/currency.vo.ts",
                "apps/backend/src/modules/economy/domain/events/*.event.ts",
                "apps/backend/src/modules/economy/domain/aggregates/__tests__/wallet.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Currency formulas)"
        },
        {
            "number": "024",
            "title": "Lives Aggregate",
            "context": "Economy",
            "priority": "Critical",
            "depends_on": ["#005"],
            "time": "3h",
            "agent": "Economy Agent",
            "objectives": "Implement Lives aggregate with regeneration logic.",
            "deliverables": [
                "Lives aggregate",
                "Consume life method",
                "Regenerate lives method",
                "Time-based regeneration logic",
                "LifeConsumedEvent",
                "LifeRegeneratedEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/domain/aggregates/lives.aggregate.ts",
                "apps/backend/src/modules/economy/domain/events/*.event.ts",
                "apps/backend/src/modules/economy/domain/aggregates/__tests__/lives.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Lives system)"
        },
        {
            "number": "025",
            "title": "Transaction Entity",
            "context": "Economy",
            "priority": "Medium",
            "depends_on": ["#023"],
            "time": "2h",
            "agent": "Economy Agent",
            "objectives": "Implement Transaction entity for audit trail.",
            "deliverables": [
                "Transaction entity",
                "TransactionType enum",
                "Transaction creation method",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/domain/entities/transaction.entity.ts",
                "apps/backend/src/modules/economy/domain/entities/__tests__/transaction.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Transaction types)"
        },
        {
            "number": "026",
            "title": "ShopItem Entity",
            "context": "Economy",
            "priority": "Low",
            "depends_on": ["#023"],
            "time": "1h",
            "agent": "Economy Agent",
            "objectives": "Implement ShopItem entity for purchasable items.",
            "deliverables": [
                "ShopItem entity",
                "ItemType enum",
                "Validation logic",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/domain/entities/shop-item.entity.ts",
                "apps/backend/src/modules/economy/domain/entities/__tests__/shop-item.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Shop items)"
        },
        {
            "number": "027",
            "title": "Economy Repositories",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#023", "#024", "#025", "#026"],
            "time": "3h",
            "agent": "Economy Agent",
            "objectives": "Implement repositories for all economy entities.",
            "deliverables": [
                "IWalletRepository",
                "WalletRepository",
                "ILivesRepository",
                "LivesRepository",
                "ITransactionRepository",
                "TransactionRepository",
                "IShopItemRepository",
                "ShopItemRepository",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/domain/repositories/*.interface.ts",
                "apps/backend/src/modules/economy/infrastructure/persistence/*.repository.ts",
                "apps/backend/src/modules/economy/infrastructure/persistence/__tests__/*.spec.ts"
            ],
            "specs": "application-architecture.md (Repository Pattern)"
        },
        {
            "number": "028",
            "title": "Purchase Commands & Handlers",
            "context": "Economy",
            "priority": "Medium",
            "depends_on": ["#027"],
            "time": "4h",
            "agent": "Economy Agent",
            "objectives": "Implement shop purchase commands.",
            "deliverables": [
                "PurchaseItemCommand",
                "PurchaseItemHandler",
                "Sufficient funds check",
                "Item application logic",
                "Transaction recording",
                "Emit ItemPurchasedEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/application/commands/purchase-item/purchase-item.command.ts",
                "apps/backend/src/modules/economy/application/commands/purchase-item/purchase-item.handler.ts",
                "apps/backend/src/modules/economy/application/commands/purchase-item/__tests__/purchase-item.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Shop mechanics)"
        },
        {
            "number": "029",
            "title": "Lives Management Commands",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#027"],
            "time": "3h",
            "agent": "Economy Agent",
            "objectives": "Implement lives consumption and regeneration commands.",
            "deliverables": [
                "ConsumeLifeCommand",
                "ConsumeLifeHandler",
                "RegenerateLivesCommand",
                "RegenerateLivesHandler",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/application/commands/consume-life/*.ts",
                "apps/backend/src/modules/economy/application/commands/regenerate-lives/*.ts",
                "apps/backend/src/modules/economy/application/commands/__tests__/*.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Lives mechanics)"
        },
        {
            "number": "030",
            "title": "Economy Event Handlers",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#027"],
            "time": "4h",
            "agent": "Economy Agent",
            "objectives": "Implement cross-context event handlers for economy.",
            "deliverables": [
                "QuizCompletedHandler (award currency)",
                "LevelUpHandler (award currency bonus)",
                "BadgeUnlockedHandler (award currency)",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/application/event-handlers/*.handler.ts",
                "apps/backend/src/modules/economy/application/event-handlers/__tests__/*.spec.ts"
            ],
            "specs": "event-architecture.md (Economy handlers), IMPLEMENTATION-SPECS.md (Currency formulas)"
        },
        {
            "number": "031",
            "title": "Economy Controllers",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#028", "#029"],
            "time": "4h",
            "agent": "Economy Agent",
            "objectives": "Implement REST API controllers for economy endpoints.",
            "deliverables": [
                "WalletController (get balance, history)",
                "ShopController (list items, purchase)",
                "LivesController (get status)",
                "DTOs with validation",
                "OpenAPI documentation",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/economy/presentation/controllers/*.controller.ts",
                "apps/backend/src/modules/economy/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/economy/presentation/controllers/__tests__/*.spec.ts"
            ],
            "specs": "api-design.md (Economy endpoints)"
        },
        {
            "number": "032",
            "title": "Economy Context Tests",
            "context": "Economy",
            "priority": "High",
            "depends_on": ["#031"],
            "time": "4h",
            "agent": "Economy Agent",
            "objectives": "Comprehensive testing for Economy context.",
            "deliverables": [
                "E2E purchase flow tests",
                "Lives regeneration tests",
                "Event handler integration tests",
                "Edge case tests",
                "Test coverage >90%"
            ],
            "files": [
                "apps/backend/src/modules/economy/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/economy/__tests__/integration/*.spec.ts"
            ],
            "specs": "business-rules-implementation.md"
        }
    ],
    "phase-2-gamification": [
        {
            "number": "033",
            "title": "PlayerProgress Aggregate",
            "context": "Gamification",
            "priority": "Critical",
            "depends_on": ["#005"],
            "time": "4h",
            "agent": "Gamification Agent",
            "objectives": "Implement PlayerProgress aggregate with XP, levels, and streaks.",
            "deliverables": [
                "PlayerProgress aggregate",
                "XP value object",
                "Level value object",
                "Streak value object",
                "addExperience method",
                "updateStreak method",
                "XPEarnedEvent",
                "LevelUpEvent",
                "StreakUpdatedEvent",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/aggregates/player-progress.aggregate.ts",
                "apps/backend/src/modules/gamification/domain/value-objects/*.vo.ts",
                "apps/backend/src/modules/gamification/domain/events/*.event.ts",
                "apps/backend/src/modules/gamification/domain/aggregates/__tests__/player-progress.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (XP/Level formulas), business-rules-implementation.md"
        },
        {
            "number": "034",
            "title": "Badge Entity & Conditions",
            "context": "Gamification",
            "priority": "Medium",
            "depends_on": ["#005"],
            "time": "2h",
            "agent": "Gamification Agent",
            "objectives": "Implement Badge entity with unlock conditions.",
            "deliverables": [
                "Badge entity",
                "BadgeCondition interface",
                "BadgeType enum",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/entities/badge.entity.ts",
                "apps/backend/src/modules/gamification/domain/value-objects/badge-condition.vo.ts",
                "apps/backend/src/modules/gamification/domain/entities/__tests__/badge.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Badges list)"
        },
        {
            "number": "035",
            "title": "Gamification Repositories",
            "context": "Gamification",
            "priority": "High",
            "depends_on": ["#033", "#034"],
            "time": "3h",
            "agent": "Gamification Agent",
            "objectives": "Implement repositories for gamification entities.",
            "deliverables": [
                "IPlayerProgressRepository",
                "PlayerProgressRepository",
                "IBadgeRepository",
                "BadgeRepository",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/repositories/*.interface.ts",
                "apps/backend/src/modules/gamification/infrastructure/persistence/*.repository.ts",
                "apps/backend/src/modules/gamification/infrastructure/persistence/__tests__/*.spec.ts"
            ],
            "specs": "application-architecture.md (Repository Pattern)"
        },
        {
            "number": "036",
            "title": "XP Calculator Service",
            "context": "Gamification",
            "priority": "High",
            "depends_on": ["#033"],
            "time": "2h",
            "agent": "Gamification Agent",
            "objectives": "Implement XP calculation service with all formulas.",
            "deliverables": [
                "XPCalculatorService",
                "calculateXP method (score × difficulty × streak)",
                "Difficulty multipliers",
                "Streak bonus calculation",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/services/xp-calculator.service.ts",
                "apps/backend/src/modules/gamification/domain/services/__tests__/xp-calculator.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (XP formula), business-rules-implementation.md"
        },
        {
            "number": "037",
            "title": "Level Calculator Service",
            "context": "Gamification",
            "priority": "High",
            "depends_on": ["#033"],
            "time": "2h",
            "agent": "Gamification Agent",
            "objectives": "Implement level calculation service.",
            "deliverables": [
                "LevelCalculatorService",
                "calculateLevel method",
                "XP requirements per level",
                "Level-up detection",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/services/level-calculator.service.ts",
                "apps/backend/src/modules/gamification/domain/services/__tests__/level-calculator.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Level formula)"
        },
        {
            "number": "038",
            "title": "Streak Calculator Service",
            "context": "Gamification",
            "priority": "Medium",
            "depends_on": ["#033"],
            "time": "3h",
            "agent": "Gamification Agent",
            "objectives": "Implement daily streak calculation and management.",
            "deliverables": [
                "StreakCalculatorService",
                "updateStreak method",
                "Streak break detection",
                "Streak protection logic",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/services/streak-calculator.service.ts",
                "apps/backend/src/modules/gamification/domain/services/__tests__/streak-calculator.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Streak mechanics)"
        },
        {
            "number": "039",
            "title": "Badge Evaluator Service",
            "context": "Gamification",
            "priority": "Medium",
            "depends_on": ["#034", "#035"],
            "time": "4h",
            "agent": "Gamification Agent",
            "objectives": "Implement badge unlock evaluation service.",
            "deliverables": [
                "BadgeEvaluatorService",
                "evaluateConditions method",
                "Badge unlock logic for all 18 badges",
                "BadgeUnlockedEvent emission",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/domain/services/badge-evaluator.service.ts",
                "apps/backend/src/modules/gamification/domain/services/__tests__/badge-evaluator.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Badge conditions)"
        },
        {
            "number": "040",
            "title": "Gamification Event Handlers",
            "context": "Gamification",
            "priority": "Critical",
            "depends_on": ["#035", "#036", "#037", "#038", "#039"],
            "time": "5h",
            "agent": "Gamification Agent",
            "objectives": "Implement cross-context event handlers for gamification.",
            "deliverables": [
                "QuizCompletedHandler (add XP, update streak, check badges)",
                "UserRegisteredHandler (create PlayerProgress)",
                "CategoryStatUpdateHandler",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/application/event-handlers/*.handler.ts",
                "apps/backend/src/modules/gamification/application/event-handlers/__tests__/*.spec.ts"
            ],
            "specs": "event-architecture.md (Gamification handlers)"
        },
        {
            "number": "041",
            "title": "Gamification Controller & DTOs",
            "context": "Gamification",
            "priority": "High",
            "depends_on": ["#040"],
            "time": "3h",
            "agent": "Gamification Agent",
            "objectives": "Implement REST API controller for gamification endpoints.",
            "deliverables": [
                "ProgressController (get progress, badges, stats)",
                "Response DTOs",
                "OpenAPI documentation",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/gamification/presentation/controllers/progress.controller.ts",
                "apps/backend/src/modules/gamification/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/gamification/presentation/controllers/__tests__/progress.controller.spec.ts"
            ],
            "specs": "api-design.md (Gamification endpoints)"
        },
        {
            "number": "042",
            "title": "Gamification Context Tests",
            "context": "Gamification",
            "priority": "High",
            "depends_on": ["#041"],
            "time": "4h",
            "agent": "Gamification Agent",
            "objectives": "Comprehensive testing for Gamification context.",
            "deliverables": [
                "E2E progression flow tests",
                "XP/Level calculation tests",
                "Badge unlock scenario tests",
                "Streak tests",
                "Test coverage >90%"
            ],
            "files": [
                "apps/backend/src/modules/gamification/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/gamification/__tests__/integration/*.spec.ts"
            ],
            "specs": "business-rules-implementation.md"
        }
    ],
    "phase-3-leaderboard": [
        {
            "number": "043",
            "title": "PlayerRanking Entity",
            "context": "Leaderboard",
            "priority": "Medium",
            "depends_on": ["#005"],
            "time": "2h",
            "agent": "Leaderboard Agent",
            "objectives": "Implement PlayerRanking entity for leaderboard data.",
            "deliverables": [
                "PlayerRanking entity",
                "Score update methods",
                "Rank calculation support",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/domain/entities/player-ranking.entity.ts",
                "apps/backend/src/modules/leaderboard/domain/entities/__tests__/player-ranking.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Leaderboard structure)"
        },
        {
            "number": "044",
            "title": "Leaderboard Repository",
            "context": "Leaderboard",
            "priority": "Medium",
            "depends_on": ["#043"],
            "time": "2h",
            "agent": "Leaderboard Agent",
            "objectives": "Implement leaderboard repository with ranking queries.",
            "deliverables": [
                "ILeaderboardRepository",
                "LeaderboardRepository",
                "Ranking queries (global, weekly, nearby)",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/domain/repositories/leaderboard.repository.interface.ts",
                "apps/backend/src/modules/leaderboard/infrastructure/persistence/leaderboard.repository.ts",
                "apps/backend/src/modules/leaderboard/infrastructure/persistence/__tests__/leaderboard.repository.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Leaderboard queries)"
        },
        {
            "number": "045",
            "title": "Leaderboard Cache Service (Redis)",
            "context": "Leaderboard",
            "priority": "High",
            "depends_on": ["#044"],
            "time": "3h",
            "agent": "Leaderboard Agent",
            "objectives": "Implement Redis caching for leaderboard performance.",
            "deliverables": [
                "LeaderboardCacheService",
                "Redis sorted sets implementation",
                "Cache invalidation strategy",
                "TTL configuration",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/infrastructure/cache/leaderboard-cache.service.ts",
                "apps/backend/src/modules/leaderboard/infrastructure/cache/__tests__/leaderboard-cache.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Leaderboard caching)"
        },
        {
            "number": "046",
            "title": "Leaderboard Queries",
            "context": "Leaderboard",
            "priority": "High",
            "depends_on": ["#045"],
            "time": "3h",
            "agent": "Leaderboard Agent",
            "objectives": "Implement leaderboard query handlers.",
            "deliverables": [
                "GetGlobalLeaderboardQuery",
                "GetWeeklyLeaderboardQuery",
                "GetNearbyPlayersQuery",
                "Query handlers with caching",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/application/queries/*/*.query.ts",
                "apps/backend/src/modules/leaderboard/application/queries/*/*.handler.ts",
                "apps/backend/src/modules/leaderboard/application/queries/__tests__/*.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md (Leaderboard queries)"
        },
        {
            "number": "047",
            "title": "Leaderboard Controller & DTOs",
            "context": "Leaderboard",
            "priority": "Medium",
            "depends_on": ["#046"],
            "time": "2h",
            "agent": "Leaderboard Agent",
            "objectives": "Implement REST API controller for leaderboard endpoints.",
            "deliverables": [
                "LeaderboardController",
                "Query DTOs",
                "Response DTOs",
                "OpenAPI documentation",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/presentation/controllers/leaderboard.controller.ts",
                "apps/backend/src/modules/leaderboard/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/leaderboard/presentation/controllers/__tests__/leaderboard.controller.spec.ts"
            ],
            "specs": "api-design.md (Leaderboard endpoints)"
        },
        {
            "number": "048",
            "title": "Leaderboard Context Tests",
            "context": "Leaderboard",
            "priority": "Medium",
            "depends_on": ["#047"],
            "time": "3h",
            "agent": "Leaderboard Agent",
            "objectives": "Comprehensive testing for Leaderboard context.",
            "deliverables": [
                "E2E leaderboard query tests",
                "Cache functionality tests",
                "Ranking accuracy tests",
                "Test coverage >90%"
            ],
            "files": [
                "apps/backend/src/modules/leaderboard/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/leaderboard/__tests__/integration/*.spec.ts"
            ],
            "specs": "IMPLEMENTATION-SPECS.md"
        }
    ],
    "phase-3-content": [
        {
            "number": "049",
            "title": "Question Admin Repository",
            "context": "Content",
            "priority": "Low",
            "depends_on": ["#015"],
            "time": "2h",
            "agent": "Content Agent",
            "objectives": "Implement admin repository for question management.",
            "deliverables": [
                "IQuestionAdminRepository",
                "QuestionAdminRepository",
                "CRUD operations",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/content/domain/repositories/question-admin.repository.interface.ts",
                "apps/backend/src/modules/content/infrastructure/persistence/question-admin.repository.ts",
                "apps/backend/src/modules/content/infrastructure/persistence/__tests__/question-admin.repository.spec.ts"
            ],
            "specs": "application-architecture.md"
        },
        {
            "number": "050",
            "title": "Question CRUD Commands & Handlers",
            "context": "Content",
            "priority": "Low",
            "depends_on": ["#049"],
            "time": "4h",
            "agent": "Content Agent",
            "objectives": "Implement question CRUD commands for admins.",
            "deliverables": [
                "CreateQuestionCommand",
                "UpdateQuestionCommand",
                "DeleteQuestionCommand",
                "Command handlers",
                "Validation logic",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/content/application/commands/*/*.command.ts",
                "apps/backend/src/modules/content/application/commands/*/*.handler.ts",
                "apps/backend/src/modules/content/application/commands/__tests__/*.spec.ts"
            ],
            "specs": "validation-and-security.md"
        },
        {
            "number": "051",
            "title": "Admin Authorization Guards",
            "context": "Content",
            "priority": "Medium",
            "depends_on": ["#005"],
            "time": "2h",
            "agent": "Content Agent",
            "objectives": "Implement admin-only authorization guards.",
            "deliverables": [
                "AdminGuard",
                "Role check implementation",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/modules/content/presentation/guards/admin.guard.ts",
                "apps/backend/src/modules/content/presentation/guards/__tests__/admin.guard.spec.ts"
            ],
            "specs": "validation-and-security.md (Authorization)"
        },
        {
            "number": "052",
            "title": "Admin Questions Controller",
            "context": "Content",
            "priority": "Low",
            "depends_on": ["#050", "#051"],
            "time": "3h",
            "agent": "Content Agent",
            "objectives": "Implement admin REST API for question management.",
            "deliverables": [
                "AdminQuestionsController",
                "CRUD endpoints",
                "DTOs with validation",
                "AdminGuard on all endpoints",
                "OpenAPI documentation",
                "Integration tests"
            ],
            "files": [
                "apps/backend/src/modules/content/presentation/controllers/admin-questions.controller.ts",
                "apps/backend/src/modules/content/presentation/dtos/*.dto.ts",
                "apps/backend/src/modules/content/presentation/controllers/__tests__/admin-questions.controller.spec.ts"
            ],
            "specs": "api-design.md (Admin endpoints)"
        },
        {
            "number": "053",
            "title": "Content Context Tests",
            "context": "Content",
            "priority": "Medium",
            "depends_on": ["#052"],
            "time": "3h",
            "agent": "Content Agent",
            "objectives": "Comprehensive testing for Content context.",
            "deliverables": [
                "E2E admin CRUD tests",
                "Authorization tests",
                "Validation tests",
                "Test coverage >90%"
            ],
            "files": [
                "apps/backend/src/modules/content/__tests__/e2e/*.spec.ts",
                "apps/backend/src/modules/content/__tests__/integration/*.spec.ts"
            ],
            "specs": "validation-and-security.md"
        }
    ],
    "phase-4-jobs": [
        {
            "number": "054",
            "title": "Life Regeneration Job",
            "context": "Jobs",
            "priority": "High",
            "depends_on": ["#024"],
            "time": "3h",
            "agent": "Jobs Agent",
            "objectives": "Implement cron job for automatic life regeneration.",
            "deliverables": [
                "LifeRegenerationJob",
                "Cron schedule (every 5 minutes)",
                "Query for players needing regeneration",
                "Lives regeneration logic",
                "Job logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/life-regeneration.job.ts",
                "apps/backend/src/jobs/__tests__/life-regeneration.spec.ts"
            ],
            "specs": "background-jobs.md (Life Regeneration)"
        },
        {
            "number": "055",
            "title": "Streak Update Job",
            "context": "Jobs",
            "priority": "High",
            "depends_on": ["#033"],
            "time": "4h",
            "agent": "Jobs Agent",
            "objectives": "Implement daily streak update and reset job.",
            "deliverables": [
                "StreakUpdateJob",
                "Cron schedule (daily at midnight UTC)",
                "Query inactive players",
                "Streak break detection",
                "Streak protection check",
                "Job logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/streak-update.job.ts",
                "apps/backend/src/jobs/__tests__/streak-update.spec.ts"
            ],
            "specs": "background-jobs.md (Streak Update)"
        },
        {
            "number": "056",
            "title": "Session Cleanup Job",
            "context": "Jobs",
            "priority": "Medium",
            "depends_on": ["#013"],
            "time": "2h",
            "agent": "Jobs Agent",
            "objectives": "Implement job to clean up expired/abandoned quiz sessions.",
            "deliverables": [
                "SessionCleanupJob",
                "Cron schedule (daily)",
                "Query expired sessions",
                "Mark as abandoned",
                "Emit QuizAbandonedEvent",
                "Job logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/session-cleanup.job.ts",
                "apps/backend/src/jobs/__tests__/session-cleanup.spec.ts"
            ],
            "specs": "background-jobs.md (Session Cleanup)"
        },
        {
            "number": "057",
            "title": "Leaderboard Reset Job",
            "context": "Jobs",
            "priority": "Medium",
            "depends_on": ["#043"],
            "time": "2h",
            "agent": "Jobs Agent",
            "objectives": "Implement weekly leaderboard reset job.",
            "deliverables": [
                "LeaderboardResetJob",
                "Cron schedule (weekly, Monday midnight UTC)",
                "Reset weekly scores",
                "Archive previous week",
                "Clear Redis cache",
                "Job logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/leaderboard-reset.job.ts",
                "apps/backend/src/jobs/__tests__/leaderboard-reset.spec.ts"
            ],
            "specs": "background-jobs.md (Leaderboard Reset)"
        },
        {
            "number": "058",
            "title": "Leaderboard Recalculation Job",
            "context": "Jobs",
            "priority": "Low",
            "depends_on": ["#043"],
            "time": "3h",
            "agent": "Jobs Agent",
            "objectives": "Implement leaderboard recalculation and cache warm-up job.",
            "deliverables": [
                "LeaderboardRecalculationJob",
                "Cron schedule (hourly)",
                "Recalculate top 100",
                "Update Redis cache",
                "Job logging",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/leaderboard-recalculation.job.ts",
                "apps/backend/src/jobs/__tests__/leaderboard-recalculation.spec.ts"
            ],
            "specs": "background-jobs.md (Leaderboard Recalculation)"
        },
        {
            "number": "059",
            "title": "Job Health Monitoring",
            "context": "Jobs",
            "priority": "Medium",
            "depends_on": ["#054", "#055", "#056", "#057", "#058"],
            "time": "3h",
            "agent": "Jobs Agent",
            "objectives": "Implement job health monitoring and alerting.",
            "deliverables": [
                "JobHealthService",
                "Track job execution history",
                "Detect failed jobs",
                "Logging and alerts",
                "Health check endpoint",
                "Unit tests"
            ],
            "files": [
                "apps/backend/src/jobs/health/job-health.service.ts",
                "apps/backend/src/jobs/health/__tests__/job-health.spec.ts"
            ],
            "specs": "background-jobs.md (Health Monitoring)"
        }
    ],
    "phase-5-integration": [
        {
            "number": "060",
            "title": "Cross-Context Event Integration Tests",
            "context": "Integration",
            "priority": "Critical",
            "depends_on": ["#012", "#022", "#032", "#042"],
            "time": "4h",
            "agent": "Integration Agent",
            "objectives": "Test cross-context event flows end-to-end.",
            "deliverables": [
                "Quiz → Gamification flow tests",
                "Quiz → Economy flow tests",
                "Gamification → Economy flow tests",
                "Event propagation tests",
                "Integration test suite"
            ],
            "files": [
                "apps/backend/test/integration/cross-context/*.spec.ts"
            ],
            "specs": "event-architecture.md"
        },
        {
            "number": "061",
            "title": "E2E Quiz Flow Test",
            "context": "Integration",
            "priority": "High",
            "depends_on": ["#060"],
            "time": "3h",
            "agent": "Integration Agent",
            "objectives": "Complete E2E test of full quiz gameplay flow.",
            "deliverables": [
                "User registration → Quiz → Results flow",
                "XP/Currency/Badges verification",
                "Leaderboard update verification",
                "Lives consumption verification",
                "E2E test suite"
            ],
            "files": [
                "apps/backend/test/e2e/quiz-flow.spec.ts"
            ],
            "specs": "business-rules-implementation.md"
        },
        {
            "number": "062",
            "title": "E2E User Registration Flow Test",
            "context": "Integration",
            "priority": "Medium",
            "depends_on": ["#060"],
            "time": "2h",
            "agent": "Integration Agent",
            "objectives": "E2E test for user registration and initialization.",
            "deliverables": [
                "Registration → Progress/Wallet/Lives creation",
                "Initial state verification",
                "Welcome flow tests",
                "E2E test suite"
            ],
            "files": [
                "apps/backend/test/e2e/registration-flow.spec.ts"
            ],
            "specs": "event-architecture.md"
        },
        {
            "number": "063",
            "title": "Validation & Error Handling Polish",
            "context": "Integration",
            "priority": "High",
            "depends_on": ["#060"],
            "time": "4h",
            "agent": "Integration Agent",
            "objectives": "Polish all validation and error handling across contexts.",
            "deliverables": [
                "Consistent error response format",
                "All DTOs have validation decorators",
                "Domain exceptions properly mapped to HTTP",
                "Validation error messages",
                "Error handling tests"
            ],
            "files": [
                "apps/backend/src/shared/presentation/filters/http-exception.filter.ts",
                "apps/backend/src/shared/presentation/interceptors/transform.interceptor.ts"
            ],
            "specs": "validation-and-security.md"
        },
        {
            "number": "064",
            "title": "API Documentation (Swagger)",
            "context": "Integration",
            "priority": "Medium",
            "depends_on": ["#063"],
            "time": "3h",
            "agent": "Integration Agent",
            "objectives": "Complete OpenAPI/Swagger documentation for all endpoints.",
            "deliverables": [
                "Swagger setup in main.ts",
                "All endpoints documented",
                "Request/Response examples",
                "Authentication documentation",
                "API documentation UI"
            ],
            "files": [
                "apps/backend/src/main.ts",
                "apps/backend/src/**/presentation/controllers/*.controller.ts"
            ],
            "specs": "api-design.md"
        },
        {
            "number": "065",
            "title": "Docker Configuration",
            "context": "Integration",
            "priority": "High",
            "depends_on": ["#064"],
            "time": "3h",
            "agent": "Integration Agent",
            "objectives": "Create Docker configuration for development and production.",
            "deliverables": [
                "Dockerfile for backend",
                "docker-compose.yml (PostgreSQL, Redis)",
                "docker-compose.dev.yml",
                "docker-compose.prod.yml",
                ".dockerignore"
            ],
            "files": [
                "Dockerfile",
                "docker-compose.yml",
                "docker-compose.dev.yml",
                "docker-compose.prod.yml",
                ".dockerignore"
            ],
            "specs": "None"
        },
        {
            "number": "066",
            "title": "Environment Configuration & Secrets",
            "context": "Integration",
            "priority": "High",
            "depends_on": ["#065"],
            "time": "2h",
            "agent": "Integration Agent",
            "objectives": "Setup environment configuration management.",
            "deliverables": [
                "ConfigModule setup",
                "Environment validation schema",
                ".env.example with all variables",
                ".env.development",
                ".env.production (template)",
                "Secrets management documentation"
            ],
            "files": [
                "apps/backend/src/config/config.module.ts",
                "apps/backend/src/config/env.validation.ts",
                "apps/backend/.env.example",
                "apps/backend/.env.development"
            ],
            "specs": "validation-and-security.md"
        },
        {
            "number": "067",
            "title": "Deployment Scripts & CI/CD",
            "context": "Integration",
            "priority": "Medium",
            "depends_on": ["#066"],
            "time": "4h",
            "agent": "Integration Agent",
            "objectives": "Setup CI/CD pipeline and deployment scripts.",
            "deliverables": [
                "GitHub Actions workflow (or similar CI)",
                "Test automation",
                "Build automation",
                "Migration scripts",
                "Deployment documentation",
                "Health check endpoint"
            ],
            "files": [
                ".github/workflows/ci.yml",
                "scripts/deploy.sh",
                "scripts/migrate.sh",
                "apps/backend/src/health/health.controller.ts"
            ],
            "specs": "None"
        }
    ]
}

TEMPLATE = """# Ticket #{number}: {title}

**Phase:** {phase} - {phase_name}
**Context:** {context}
**Priority:** {priority}
**Depends On:** {depends_on}
**Estimated Time:** {time}
**Agent:** {agent}
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
{additional_specs}

---

## 🎯 Objectives

{objectives}

---

## ✅ Deliverables

{deliverables}

---

## 📁 Files to Create/Modify

```
{files}
```

---

## 🧪 Acceptance Criteria

- [ ] All deliverables completed
- [ ] Tests pass (>90% coverage for domain layer)
- [ ] Follows Clean Architecture patterns
- [ ] Implements all specs from IMPLEMENTATION-SPECS.md
- [ ] No TypeScript errors
- [ ] Properly emits domain events

---

## 💡 Implementation Notes

Refer to IMPLEMENTATION-SPECS.md for:
- Constants and formulas
- Domain event signatures
- Validation rules
- Business logic specifications

---

## 🔗 Related Documentation

- Business Rules: `business-rules-implementation.md`
- Events: `event-architecture.md`
- Validation: `validation-and-security.md`
"""

def generate_ticket(phase_folder, ticket_data, phase_info):
    """Generate a single ticket markdown file"""

    number = ticket_data["number"]
    deliverables_list = "\n".join([f"- [ ] {d}" for d in ticket_data["deliverables"]])
    files_list = "\n".join(ticket_data["files"])
    depends_on_str = ", ".join(ticket_data["depends_on"]) if ticket_data["depends_on"] else "None"
    additional_specs = f"- **Reference:** `{ticket_data['specs']}`" if "specs" in ticket_data else ""

    content = TEMPLATE.format(
        number=number,
        title=ticket_data["title"],
        phase=phase_info["number"],
        phase_name=phase_info["name"],
        context=ticket_data["context"],
        priority=ticket_data["priority"],
        depends_on=depends_on_str,
        time=ticket_data["time"],
        agent=ticket_data["agent"],
        objectives=ticket_data["objectives"],
        deliverables=deliverables_list,
        files=files_list,
        additional_specs=additional_specs
    )

    # Sanitize filename - replace special characters
    title_sanitized = (ticket_data['title'].lower()
                      .replace(' ', '-')
                      .replace('&', 'and')
                      .replace('/', '-')
                      .replace('(', '')
                      .replace(')', ''))
    filename = f"{number}-{title_sanitized}.md"
    filepath = Path(phase_folder) / filename

    with open(filepath, 'w') as f:
        f.write(content)

    print(f"✅ Created: {filepath}")

def main():
    """Generate all tickets"""

    base_path = Path(__file__).parent

    phase_info_map = {
        "phase-1-foundation": {"number": "1", "name": "Foundation"},
        "phase-2-identity": {"number": "2a", "name": "Identity Context"},
        "phase-2-quiz": {"number": "2b", "name": "Quiz Context"},
        "phase-2-economy": {"number": "2c", "name": "Economy Context"},
        "phase-2-gamification": {"number": "2d", "name": "Gamification Context"},
        "phase-3-leaderboard": {"number": "3a", "name": "Leaderboard Context"},
        "phase-3-content": {"number": "3b", "name": "Content Context"},
        "phase-4-jobs": {"number": "4", "name": "Background Jobs"},
        "phase-5-integration": {"number": "5", "name": "Integration & Polish"}
    }

    print("🎫 Generating ALL 67 PastryQuiz Implementation Tickets...\n")

    total_generated = 0
    for phase_folder, tickets in TICKETS.items():
        phase_path = base_path / phase_folder
        phase_path.mkdir(exist_ok=True)

        phase_info = phase_info_map.get(phase_folder, {"number": "?", "name": "Unknown"})

        print(f"\n📁 Phase: {phase_folder}")
        for ticket in tickets:
            generate_ticket(phase_path, ticket, phase_info)
            total_generated += 1

    print(f"\n✨ Ticket generation complete!")
    print(f"\n📊 Summary:")
    print(f"  Total tickets generated: {total_generated}")
    print(f"  Phases: {len(TICKETS)}")
    print(f"\n🚀 All 67 tickets are ready!")
    print(f"\n💡 Next step: Start with Phase 1, ticket #001")

if __name__ == "__main__":
    main()
