export interface UserInfo {
    imageUrl: string;
    realName: string;
    phone: string;

    logo: string
    tenantName: string;
    currentRoleName: string;
}

export interface AuthToken {
    accessToken: string;
}