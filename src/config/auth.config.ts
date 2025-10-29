// jwt:
//  secret
//  expiresIn

import { registerAs } from "@nestjs/config";
import type { StringValue } from "ms";

export interface AuthConfig {
    jwt: {
        secret: string;
        expiresIn: StringValue | number | undefined;
    };
}

export const authConfig = registerAs('auth', (): AuthConfig => ({
    jwt: {
        secret: process.env.JWT_TOKEN as string,
        expiresIn: process.env.JWT_EXPIRES_IN as StringValue ?? '60m'
    }
}))