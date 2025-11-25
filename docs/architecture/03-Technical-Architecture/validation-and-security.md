# 🔒 Validation Rules & Security Implementation

This document specifies all input validation, business rule validation, and anti-cheat mechanisms.

---

## Validation Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: DTO Validation (Presentation)                 │
│ - Type checking                                         │
│ - Format validation                                     │
│ - Required fields                                       │
├─────────────────────────────────────────────────────────┤
│ Layer 2: Command/Query Validation (Application)        │
│ - Business rules                                        │
│ - Authorization                                         │
│ - Resource existence                                    │
├─────────────────────────────────────────────────────────┤
│ Layer 3: Domain Validation (Domain)                    │
│ - Invariants                                            │
│ - Aggregate consistency                                 │
│ - Domain rules                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Authentication & Authorization

### JWT Token Validation

```typescript
// identity/infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepo: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    // Verify user still exists
    const user = await this.userRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Could check if user is banned/disabled here
    if (user.status === 'BANNED') {
      throw new UnauthorizedException('Account banned');
    }

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
```

### Token Payload Structure

```typescript
interface JwtPayload {
  sub: string;        // userId
  email: string;
  username: string;
  role: UserRole;
  iat: number;        // Issued at
  exp: number;        // Expires at
}
```

### Refresh Token Validation

```typescript
// identity/application/commands/refresh-token/refresh-token.handler.ts
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler {
  async execute(command: RefreshTokenCommand): Promise<TokenResponse> {
    // 1. Validate refresh token exists in DB
    const refreshToken = await this.tokenRepo.findByToken(command.refreshToken);
    if (!refreshToken) {
      throw new InvalidRefreshTokenException('Invalid refresh token');
    }

    // 2. Check expiration
    if (refreshToken.isExpired()) {
      await this.tokenRepo.delete(refreshToken.id);
      throw new ExpiredRefreshTokenException('Refresh token expired');
    }

    // 3. Verify user still exists
    const user = await this.userRepo.findById(refreshToken.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 4. Generate new tokens
    const newAccessToken = this.jwtService.sign({ ...userPayload });
    const newRefreshToken = await this.createRefreshToken(user.id);

    // 5. Invalidate old refresh token
    await this.tokenRepo.delete(refreshToken.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
```

---

## 2. Input Validation (DTOs)

### Registration DTO

```typescript
// identity/presentation/dtos/register.dto.ts
export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  @ApiProperty({ example: 'Test123!' })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscore, and hyphen',
  })
  @ApiProperty({ example: 'john_doe' })
  username: string;
}
```

**Validation Rules:**
- Email: Valid email format, max 255 chars
- Password: 8-100 chars, must have uppercase, lowercase, and number
- Username: 3-20 chars, alphanumeric + underscore/hyphen only

### Start Quiz DTO

```typescript
// quiz/presentation/dtos/start-quiz.dto.ts
export class StartQuizDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Category ID (null = random category)' })
  categoryId?: string;

  @IsEnum(['apprenti', 'commis', 'chef', 'mof'])
  @ApiProperty({ enum: ['apprenti', 'commis', 'chef', 'mof'] })
  difficulty: DifficultyLevel;
}
```

### Submit Answer DTO

```typescript
// quiz/presentation/dtos/submit-answer.dto.ts
export class SubmitAnswerDto {
  @IsUUID()
  @ApiProperty({ description: 'Question ID' })
  questionId: string;

  @IsUUID()
  @ApiProperty({ description: 'Answer ID' })
  answerId: string;

  @IsInt()
  @Min(0)
  @Max(300000) // Max 5 minutes (300 seconds)
  @ApiProperty({ description: 'Time spent in milliseconds' })
  timeSpent: number;
}
```

**Anti-Cheat Validation:**
- `timeSpent` must be >= 0 and <= 300 seconds (5 minutes)
- This is validated again in domain layer

---

## 3. Business Rule Validation

### Start Quiz Validation

```typescript
// quiz/application/commands/start-quiz/start-quiz.handler.ts
@CommandHandler(StartQuizCommand)
export class StartQuizHandler {
  async execute(command: StartQuizCommand): Promise<QuizSessionDto> {
    // 1. Validate user exists
    const user = await this.userRepo.findById(command.userId);
    if (!user) {
      throw new UserNotFoundException(command.userId);
    }

    // 2. Validate category (if provided)
    if (command.categoryId) {
      const category = await this.categoryRepo.findById(command.categoryId);
      if (!category) {
        throw new CategoryNotFoundException(command.categoryId);
      }
    }

    // 3. Validate difficulty
    const difficulty = await this.difficultyRepo.findByLevel(command.difficulty);
    if (!difficulty) {
      throw new InvalidDifficultyException(command.difficulty);
    }

    // 4. Check for active session
    const activeSession = await this.sessionRepo.findActiveByUserId(command.userId);
    if (activeSession) {
      throw new ActiveSessionExistsException(
        'You already have an active quiz session',
        activeSession.id,
      );
    }

    // 5. Check lives
    const lives = await this.livesRepo.findByUserId(command.userId);
    if (lives.currentLives < 1) {
      const nextRegenAt = lives.getNextRegenAt();
      throw new InsufficientLivesException(
        `Not enough lives. Next regeneration at ${nextRegenAt}`,
        {
          currentLives: lives.currentLives,
          required: 1,
          nextRegenAt,
        },
      );
    }

    // 6. Select questions
    const questions = await this.questionSelector.selectQuestions(
      command.categoryId,
      command.difficulty,
      10,
    );

    if (questions.length < 10) {
      throw new InsufficientQuestionsException(
        `Not enough published questions for ${command.difficulty} difficulty`,
      );
    }

    // 7. Create session
    const session = QuizSession.start(
      command.userId,
      command.categoryId,
      difficulty,
      questions,
    );

    // 8. Save and emit events
    await this.sessionRepo.save(session);
    this.eventBus.publishAll(session.events);

    return this.toDto(session);
  }
}
```

### Submit Answer Validation

```typescript
// quiz/application/commands/submit-answer/submit-answer.handler.ts
@CommandHandler(SubmitAnswerCommand)
export class SubmitAnswerHandler {
  async execute(command: SubmitAnswerCommand): Promise<SubmitAnswerResult> {
    // 1. Load session
    const session = await this.sessionRepo.findById(command.sessionId);
    if (!session) {
      throw new SessionNotFoundException(command.sessionId);
    }

    // 2. Verify ownership
    if (session.userId !== command.userId) {
      throw new UnauthorizedAccessException(
        'This session does not belong to you',
      );
    }

    // 3. Validate session status
    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new InvalidSessionStateException(
        `Session is ${session.status}, expected IN_PROGRESS`,
      );
    }

    // 4. Check expiration
    if (session.hasExpired()) {
      session.abandon('expired');
      await this.sessionRepo.save(session);
      throw new SessionExpiredException('Quiz session has expired');
    }

    // 5. Validate question belongs to session
    const question = session.findQuestion(command.questionId);
    if (!question) {
      throw new QuestionNotInSessionException(
        'Question not found in this session',
      );
    }

    // 6. Check if already answered
    if (session.hasAnswered(command.questionId)) {
      throw new QuestionAlreadyAnsweredException(
        'You have already answered this question',
      );
    }

    // 7. Validate answer belongs to question
    const answer = question.findAnswer(command.answerId);
    if (!answer) {
      throw new InvalidAnswerException(
        'Answer does not belong to this question',
      );
    }

    // 8. ANTI-CHEAT: Validate time spent
    this.validateTimeSpent(command.timeSpent, question.timeLimit);

    // 9. Submit answer (domain logic)
    session.submitAnswer(
      command.questionId,
      command.answerId,
      command.timeSpent,
    );

    // 10. Save and emit events
    await this.sessionRepo.save(session);
    this.eventBus.publishAll(session.events);

    return {
      isCorrect: answer.isCorrect,
      correctAnswerId: question.correctAnswer.id,
      explanation: question.explanation,
      pointsEarned: session.getLastAnswer().pointsEarned,
      currentScore: session.currentScore,
      nextQuestion: session.getNextQuestion(),
    };
  }

  private validateTimeSpent(timeSpent: number, timeLimit: number): void {
    // Must be at least 500ms (too fast = suspicious)
    if (timeSpent < 500) {
      throw new SuspiciousActivityException(
        'Answer submitted too quickly',
        { timeSpent, threshold: 500 },
      );
    }

    // Must not exceed time limit + 5 second grace period
    const maxAllowed = (timeLimit * 1000) + 5000;
    if (timeSpent > maxAllowed) {
      throw new TimeExceededException(
        'Time limit exceeded',
        { timeSpent, timeLimit: maxAllowed },
      );
    }
  }
}
```

---

## 4. Anti-Cheat Mechanisms

### Time Validation

```typescript
// quiz/domain/services/anti-cheat.service.ts
@Injectable()
export class AntiCheatService {
  private readonly logger = new Logger(AntiCheatService.name);

  /**
   * Validate answer time is reasonable
   */
  validateAnswerTime(
    timeSpent: number,
    timeLimit: number,
    questionText: string,
  ): ValidationResult {
    const violations: string[] = [];

    // Too fast (< 500ms)
    if (timeSpent < 500) {
      violations.push('TOO_FAST');
      this.logger.warn(`Suspicious: Answer in ${timeSpent}ms`);
    }

    // Too slow (> time limit + 5s grace)
    const maxAllowed = (timeLimit * 1000) + 5000;
    if (timeSpent > maxAllowed) {
      violations.push('TIME_EXCEEDED');
    }

    // Suspiciously consistent timing (all answers same time)
    // This would be checked at session level

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  /**
   * Detect suspicious patterns in session
   */
  async detectSuspiciousPatterns(session: QuizSession): Promise<boolean> {
    const answers = session.answers;

    if (answers.length < 3) return false; // Not enough data

    // Pattern 1: All answers exactly same time (bot)
    const timings = answers.map(a => a.timeSpent);
    const uniqueTimings = new Set(timings);

    if (uniqueTimings.size === 1) {
      this.logger.warn(`Suspicious: All answers same time (${timings[0]}ms)`);
      return true;
    }

    // Pattern 2: All answers too fast (< 1 second)
    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    if (avgTime < 1000) {
      this.logger.warn(`Suspicious: Average answer time ${avgTime}ms`);
      return true;
    }

    // Pattern 3: Perfect score with all fast answers
    const allCorrect = answers.every(a => a.isCorrect);
    const allFast = timings.every(t => t < 2000);

    if (allCorrect && allFast) {
      this.logger.warn('Suspicious: Perfect score with all fast answers');
      return true;
    }

    return false;
  }

  /**
   * Server-side scoring (never trust client)
   */
  recalculateScore(session: QuizSession): number {
    let totalScore = 0;

    for (const answer of session.answers) {
      if (answer.isCorrect) {
        const question = session.findQuestion(answer.questionId);
        const { total } = this.scoringService.calculatePoints(
          true,
          answer.timeSpent,
          question.timeLimit,
        );
        totalScore += total;
      }
    }

    // Apply perfect score bonus
    if (session.isPerfectScore()) {
      totalScore = Math.floor(totalScore * 1.5);
    }

    return totalScore;
  }
}
```

### Rate Limiting

```typescript
// shared/presentation/guards/rate-limit.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.ip;
    const endpoint = request.route.path;

    const limits = this.getLimits(endpoint);
    const key = `ratelimit:${endpoint}:${userId}`;

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, limits.window);
    }

    // Set rate limit headers
    const remaining = Math.max(0, limits.max - current);
    request.res.setHeader('X-RateLimit-Limit', limits.max);
    request.res.setHeader('X-RateLimit-Remaining', remaining);
    request.res.setHeader('X-RateLimit-Reset', Date.now() + limits.window * 1000);

    if (current > limits.max) {
      throw new TooManyRequestsException({
        message: 'Rate limit exceeded',
        retryAfter: limits.window,
      });
    }

    return true;
  }

  private getLimits(endpoint: string): { max: number; window: number } {
    const limits: Record<string, { max: number; window: number }> = {
      '/api/v1/auth/login': { max: 5, window: 60 },        // 5 per minute
      '/api/v1/auth/register': { max: 3, window: 60 },     // 3 per minute
      '/api/v1/quiz/start': { max: 10, window: 60 },       // 10 per minute
      '/api/v1/quiz/:id/answer': { max: 20, window: 60 },  // 20 per minute
      '/api/v1/economy/shop/purchase': { max: 5, window: 60 }, // 5 per minute
    };

    return limits[endpoint] || { max: 100, window: 60 }; // Default
  }
}
```

**Usage:**
```typescript
@Controller('api/v1/auth')
export class AuthController {
  @Post('login')
  @UseGuards(RateLimitGuard)
  async login(@Body() dto: LoginDto) {
    // ...
  }
}
```

---

## 5. Domain Invariants

### Wallet Invariant: Balance Never Negative

```typescript
// economy/domain/aggregates/wallet.aggregate.ts
class Wallet extends AggregateRoot {
  private balance: number;

  spendCoins(amount: number, source: string, description: string): void {
    // INVARIANT: Balance cannot go negative
    if (amount > this.balance) {
      throw new InsufficientCoinsException(
        `Insufficient coins. Required: ${amount}, Available: ${this.balance}`,
        {
          required: amount,
          available: this.balance,
        },
      );
    }

    if (amount <= 0) {
      throw new InvalidAmountException('Amount must be positive');
    }

    this.balance -= amount;
    this.lifetimeSpent += amount;

    // Record transaction
    this.transactions.push(
      new Transaction(
        uuid(),
        this.userId,
        TransactionType.SPENT,
        amount,
        source,
        description,
        this.balance, // Balance AFTER transaction
      ),
    );

    this.addDomainEvent(new CoinsSpentEvent(this.userId, amount, source));
  }
}
```

### Lives Invariant: Max 5 Lives

```typescript
// economy/domain/aggregates/lives.aggregate.ts
class Lives extends AggregateRoot {
  private readonly MAX_LIVES = 5;
  private currentLives: number;

  addLife(): void {
    // INVARIANT: Cannot exceed max lives
    if (this.currentLives >= this.MAX_LIVES) {
      throw new MaxLivesReachedException(
        `Already at maximum lives (${this.MAX_LIVES})`,
      );
    }

    this.currentLives++;
    this.addDomainEvent(new LifeAddedEvent(this.userId, this.currentLives));
  }

  consumeLife(): void {
    // INVARIANT: Cannot go below 0 lives
    if (this.currentLives <= 0) {
      throw new InsufficientLivesException(
        'No lives remaining',
        {
          current: this.currentLives,
          required: 1,
        },
      );
    }

    this.currentLives--;

    // Start regeneration timer
    if (this.currentLives < this.MAX_LIVES && !this.lastRegenAt) {
      this.lastRegenAt = new Date();
    }

    this.addDomainEvent(new LifeConsumedEvent(this.userId, this.currentLives));
  }
}
```

### QuizSession Invariant: Exactly 10 Questions

```typescript
// quiz/domain/aggregates/quiz-session.aggregate.ts
class QuizSession extends AggregateRoot {
  private readonly QUESTIONS_PER_QUIZ = 10;

  static start(
    userId: string,
    categoryId: string,
    difficulty: Difficulty,
    questions: Question[],
  ): QuizSession {
    // INVARIANT: Must have exactly 10 questions
    if (questions.length !== this.QUESTIONS_PER_QUIZ) {
      throw new InvalidQuestionCountException(
        `Expected ${this.QUESTIONS_PER_QUIZ} questions, got ${questions.length}`,
      );
    }

    const session = new QuizSession(
      uuid(),
      userId,
      categoryId,
      difficulty,
      questions,
      [],
      Score.zero(),
      SessionStatus.IN_PROGRESS,
      new Date(Date.now() + 10 * 60 * 1000), // +10 minutes
    );

    session.addDomainEvent(
      new QuizStartedEvent(session.id, userId, categoryId, difficulty.level),
    );

    return session;
  }
}
```

---

## 6. Authorization Rules

### Resource Ownership

```typescript
// shared/presentation/guards/resource-ownership.guard.ts
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;
    const resourceId = request.params.id || request.params.sessionId;

    // Determine resource type from route
    const resourceType = this.getResourceType(request.route.path);

    // Check ownership
    const isOwner = await this.checkOwnership(
      user.userId,
      resourceType,
      resourceId,
    );

    if (!isOwner) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }

  private getResourceType(path: string): string {
    if (path.includes('/quiz/')) return 'quiz-session';
    if (path.includes('/wallet/')) return 'wallet';
    // ... etc
    return 'unknown';
  }

  private async checkOwnership(
    userId: string,
    resourceType: string,
    resourceId: string,
  ): Promise<boolean> {
    // Check in database
    // This is simplified - real implementation would use repositories
    switch (resourceType) {
      case 'quiz-session':
        const session = await this.prisma.quizSession.findUnique({
          where: { id: resourceId },
        });
        return session?.userId === userId;

      case 'wallet':
        const wallet = await this.prisma.wallet.findUnique({
          where: { id: resourceId },
        });
        return wallet?.userId === userId;

      default:
        return false;
    }
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
// shared/presentation/guards/roles.guard.ts
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    const hasRole = requiredRoles.some(role => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Requires one of: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

// Usage
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminQuestionsController {
  @Post('questions')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createQuestion(@Body() dto: CreateQuestionDto) {
    // Only admins can create questions
  }

  @Delete('questions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  async deleteQuestion(@Param('id') id: string) {
    // Only super admins can delete
  }
}
```

---

## 7. Error Response Format

### Standard Error Response

```typescript
{
  "error": {
    "code": "INSUFFICIENT_LIVES",
    "message": "You don't have enough lives to start a quiz",
    "details": {
      "currentLives": 0,
      "required": 1,
      "nextRegenAt": "2025-11-25T15:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-11-25T15:00:00Z",
    "requestId": "req_abc123",
    "path": "/api/v1/quiz/start"
  }
}
```

### Exception Filter

```typescript
// shared/presentation/filters/domain-exception.filter.ts
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.getHttpStatus(exception);

    const errorResponse = {
      error: {
        code: exception.code || exception.constructor.name,
        message: exception.message,
        details: exception.details || {},
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.headers['x-request-id'] || uuid(),
        path: request.url,
      },
    };

    response.status(statusCode).json(errorResponse);
  }

  private getHttpStatus(exception: DomainException): number {
    const statusMap: Record<string, number> = {
      InsufficientLivesException: 422,
      InsufficientCoinsException: 422,
      SessionExpiredException: 422,
      QuestionAlreadyAnsweredException: 409,
      ActiveSessionExistsException: 409,
      UnauthorizedAccessException: 403,
      SessionNotFoundException: 404,
      UserNotFoundException: 404,
      InvalidDifficultyException: 400,
      InvalidSessionStateException: 400,
      SuspiciousActivityException: 429, // Too Many Requests
    };

    return statusMap[exception.constructor.name] || 422;
  }
}
```

---

## 8. Validation Summary Checklist

### Start Quiz Endpoint
- ✅ JWT token valid
- ✅ User exists
- ✅ Category exists (if provided)
- ✅ Difficulty is valid (apprenti/commis/chef/mof)
- ✅ No active session exists for user
- ✅ User has >= 1 life
- ✅ Enough published questions available (10)
- ✅ Rate limit not exceeded (10/min)

### Submit Answer Endpoint
- ✅ JWT token valid
- ✅ Session exists
- ✅ User owns session
- ✅ Session status is IN_PROGRESS
- ✅ Session not expired
- ✅ Question belongs to session
- ✅ Question not already answered
- ✅ Answer belongs to question
- ✅ Time spent >= 500ms (anti-cheat)
- ✅ Time spent <= time limit + 5s (anti-cheat)
- ✅ Rate limit not exceeded (20/min)

### Purchase Item Endpoint
- ✅ JWT token valid
- ✅ Item exists and is available
- ✅ User has sufficient coins
- ✅ Purchase doesn't violate limits (e.g., max 2 streak protections)
- ✅ Rate limit not exceeded (5/min)

### Admin Endpoints
- ✅ JWT token valid
- ✅ User has ADMIN or SUPER_ADMIN role
- ✅ Resource-specific validations

---

## 9. Security Best Practices Applied

### Password Hashing
```typescript
// identity/infrastructure/services/password.service.ts
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
```

### SQL Injection Prevention
- ✅ Using Prisma ORM (parameterized queries)
- ✅ Never concatenating SQL strings
- ✅ Input validation at DTO level

### XSS Prevention
- ✅ Input sanitization (strip HTML tags from usernames)
- ✅ Output encoding (handled by framework)
- ✅ Content-Security-Policy headers (in production)

### CORS Configuration
```typescript
// main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Secure Headers
```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
```

---

## Summary: Security & Validation Layers

```
User Request
    ↓
[Rate Limiting] ← Redis-based
    ↓
[CORS Check] ← Origin validation
    ↓
[JWT Authentication] ← Token verification
    ↓
[RBAC Authorization] ← Role check
    ↓
[DTO Validation] ← class-validator
    ↓
[Business Rules] ← Command handler
    ↓
[Domain Invariants] ← Aggregate
    ↓
[Anti-Cheat] ← Pattern detection
    ↓
Success Response / Error Response
```

All validation layers work together to ensure:
1. **Authentication**: User is who they claim to be
2. **Authorization**: User has permission to perform action
3. **Input Validation**: Data is well-formed
4. **Business Rules**: Action is allowed by business logic
5. **Domain Invariants**: System state remains consistent
6. **Anti-Cheat**: Fair play is maintained
