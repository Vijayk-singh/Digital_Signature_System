# utils/crypto_utils.py

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import base64

# ------------------ Generate RSA Keys ------------------
def generate_rsa_keys():
    """Generates RSA 2048-bit private and public key pair (PEM format)."""
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    return private_pem.decode(), public_pem.decode()


# ------------------ Sign File ------------------
def sign_file(file_bytes: bytes, private_key_pem: str) -> str:
    """Sign file using private key and return base64 signature."""
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
        password=None
    )

    signature = private_key.sign(
        file_bytes,
        padding.PKCS1v15(),  # <-- same as browser RSASSA-PKCS1-v1_5
        hashes.SHA256()
    )

    return base64.b64encode(signature).decode()


# ------------------ Verify File ------------------
def verify_signature(file_bytes: bytes, signature_b64: str, public_key_pem: str) -> bool:
    """Verify base64 signature using PEM public key."""
    try:
        public_key = serialization.load_pem_public_key(public_key_pem.encode())
        signature = base64.b64decode(signature_b64)

        public_key.verify(
            signature,
            file_bytes,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except Exception as e:
        print("❌ Verification error:", e)
        return False

      #  WLWjVLMNwR6ArbN/upFG+de4YijKOLEkmvhEM/8bPnoTgGoXYWckj5hhxSk5v79CFkRifm81TYmBzdB1akzJ2yBiSXIszKXwoV3J13EAGrkfF2UAbN30eAQLwJ/rFF1aA3cEsBPUw1rzpQQtTIxU97X/XVZbCABnJ0WVwSctJNQpg4d+hufxW+mXGCkKBfpQ1dfPm5QwSjZ+2wnzEbNPY/AEF01fUEfnVScHgdq3IyIfh75sUeE5qui8KGqgvqD+bXExGr+6uIkQnKonTm6wkmJ3pM3AvI2L8HYqp2oBJHPWv5FXsD3lCLga+s/S6CF5vbtNWtAwR1cEqgqCOzwJBw==