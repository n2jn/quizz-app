export declare class UserResponseDto {
    userId: string;
    email: string;
    username: string;
    role: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
