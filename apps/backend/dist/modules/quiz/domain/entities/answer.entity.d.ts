import { Entity } from '@shared/domain/base/entity.base';
export interface AnswerProps {
    id: string;
    text: string;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Answer extends Entity<string> {
    private readonly props;
    private constructor();
    get text(): string;
    get isCorrect(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, text: string, isCorrect: boolean): Answer;
    static fromPersistence(props: AnswerProps): Answer;
}
