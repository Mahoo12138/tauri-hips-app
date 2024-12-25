use base64::prelude::*;
use rand::rngs::OsRng;
use rsa::{RsaPublicKey, Pkcs1v15Encrypt};
use rsa::pkcs8::DecodePublicKey;

/// 加密密码函数
///
/// # 参数
/// - `password`: 要加密的密码字符串
/// - `public_key`: 公钥字符串（PEM 格式）
///
/// # 返回
/// - 返回一个 `Option<String>`，成功时是加密后的 Base64 字符串，失败时为 `None`
pub fn encrypt_pwd(password: &str, public_key: &str) -> Option<String> {
    // 解析公钥
    let pub_key = RsaPublicKey::from_public_key_pem(public_key).ok()?;

    // 初始化随机数生成器
    let mut rng = OsRng;

    // 加密数据
    let encrypted_data = pub_key
        .encrypt(
            &mut rng,
            Pkcs1v15Encrypt,
            password.as_bytes(),
        )
        .ok()?;

    let result = BASE64_STANDARD.decode(encrypted_data);

    result.ok().and_then(|pem| String::from_utf8(pem).ok())
}
