import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { QuestionText } from '../value-objects/question-text.vo';
import { Explanation } from '../value-objects/explanation.vo';
import { Answer } from '../entities/answer.entity';
export declare enum QuestionStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export interface QuestionProps {
    id: string;
    text: QuestionText;
    explanation: Explanation;
    imageUrl: string | null;
    categoryId: string;
    difficultyId: string;
    status: QuestionStatus;
    createdById: string;
    answers: Answer[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class Question extends AggregateRoot<string> {
    private props;
    private static readonly MIN_ANSWERS;
    private static readonly MAX_ANSWERS;
    private constructor();
    get text(): QuestionText;
    get explanation(): Explanation;
    get imageUrl(): string | null;
    get categoryId(): string;
    get difficultyId(): string;
    get status(): QuestionStatus;
    get createdById(): string;
    get answers(): readonly Answer[];
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, text: QuestionText, explanation: Explanation, categoryId: string, difficultyId: string, createdById: string, answers: Answer[], imageUrl?: string | null): Question;
    publish(): void;
    archive(): void;
    isPublished(): boolean;
    static fromPersistence(props: QuestionProps): Question;
}
