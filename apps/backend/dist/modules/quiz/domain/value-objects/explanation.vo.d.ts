import { ValueObject } from '@shared/domain/base/value-object.base';
export interface ExplanationProps {
    value: string;
}
export declare class Explanation extends ValueObject<ExplanationProps> {
    private static readonly MIN_LENGTH;
    private static readonly MAX_LENGTH;
    get value(): string;
    private constructor();
    static create(text: string): Explanation;
}
