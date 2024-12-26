
// Base URLs
pub const BASE_API_URL: &str = "https://hippiusgw.hand-china.com";

// Authentication Endpoints
pub mod auth {
    pub const SEND_CODE: &str = "/oauth/public/send-phone-captcha";
    pub const LOGIN_BY_PASSWORD: &str = "/oauth/login-password";
    pub const LOGIN_BY_CODE: &str = "/oauth/token/mobile";
}

// API Request Constants
pub mod request {
    pub const TIMEOUT_SECONDS: u64 = 10;
    pub const MAX_RETRIES: u32 = 3;
}

// Error Messages
pub mod errors {
    pub const NETWORK_ERROR: &str = "Network connection failed";
    pub const PARSE_ERROR: &str = "Failed to parse server response";
}