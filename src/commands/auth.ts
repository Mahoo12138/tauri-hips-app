import { invoke } from "@tauri-apps/api/core";


export const loginByPasswd = async (phone: string, password: string) => {
    return invoke<CommandResponse<{}>>("login_by_passwd", { phone, password });
}

export const loginByCode = async (phone: string, captcha: string, captchaKey: string) => {
    const payload = { phone, captcha, captchaKey }
    return invoke<CommandResponse<{}>>("login_by_code", { payload });
}

export const sendVerificationCode = (phone: string) => {
    return invoke<CommandResponse<{captchaKey: string}>>("send_code", { phone });
}

interface CommandResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}