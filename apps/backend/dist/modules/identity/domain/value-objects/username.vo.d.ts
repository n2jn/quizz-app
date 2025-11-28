import { ValueObject } from '@shared/domain/base';
interface UsernameProps {
    value: string;
}
export declare class Username extends ValueObject<UsernameProps> {
    private static readonly MIN_LENGTH;
    private static readonly MAX_LENGTH;
    private static readonly USERNAME_REGEX;
    private constructor();
    static create(username: string): Username;
    get value(): string;
}
export {};
