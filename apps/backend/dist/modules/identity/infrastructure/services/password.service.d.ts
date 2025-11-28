export declare class PasswordService {
    private readonly saltRounds;
    hash(plainPassword: string): Promise<string>;
    compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
