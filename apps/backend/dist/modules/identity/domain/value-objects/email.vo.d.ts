import { ValueObject } from '@shared/domain/base';
interface EmailProps {
    value: string;
}
export declare class Email extends ValueObject<EmailProps> {
    private static readonly EMAIL_REGEX;
    private constructor();
    static create(email: string): Email;
    get value(): string;
}
export {};
