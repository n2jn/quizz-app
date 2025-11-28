import { ValueObject } from '@shared/domain/base/value-object.base';
export interface QuestionTextProps {
    value: string;
}
export declare class QuestionText extends ValueObject<QuestionTextProps> {
    private static readonly MIN_LENGTH;
    private static readonly MAX_LENGTH;
    get value(): string;
    private constructor();
    static create(text: string): QuestionText;
}
