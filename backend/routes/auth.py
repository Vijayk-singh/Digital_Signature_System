from fastapi import APIRouter, HTTPException, Depends
from models.user_model import UserRegister, UserLogin
from models.public_key_model import PublicKeyModel
from database import users_collection, public_keys_collection
from utils.crypto_utils import generate_rsa_keys
from utils.email_utils import send_verification_email, send_private_key_email
from utils.jwt_utils import create_access_token, verify_token
from passlib.context import CryptContext
import secrets
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🧠 REGISTER USER
@router.post("/register")
async def register_user(user: UserRegister):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(user.password[:72])
    verification_token = secrets.token_hex(16)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role,
        "is_verified": False,
        "verification_token": verification_token,
    }

    users_collection.insert_one(new_user)
    send_verification_email(user.email, verification_token)

    return {"message": "User registered successfully. Check your email for verification link."}


# ✅ VERIFY EMAIL
@router.get("/verify/{token}")
async def verify_email(token: str):
    user = users_collection.find_one({"verification_token": token})
    if not user:
        raise HTTPException(status_code=404, detail="Invalid or expired token")

    users_collection.update_one({"email": user["email"]}, {"$set": {"is_verified": True, "verification_token": None}})

    private_key, public_key = generate_rsa_keys()
    send_private_key_email(user["email"], private_key)

    public_key_entry = PublicKeyModel(
        email=user["email"],
        name=user["name"],
        role=user["role"],
        public_key=public_key
    ).dict()
    public_keys_collection.insert_one(public_key_entry)

    return {"message": "Email verified successfully! Public key stored and private key sent to your email."}


# 🔐 LOGIN USER
@router.post("/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(user.password[:72], db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not db_user["is_verified"]:
        raise HTTPException(status_code=403, detail="Please verify your email first.")

    # 🪙 Create JWT token
    access_token_expires = timedelta(minutes=60)
    token = create_access_token(data={"sub": db_user["email"]}, expires_delta=access_token_expires)

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user["email"],
        "role": db_user["role"]
    }


# 🧱 PROTECTED ROUTE (Test)
@router.get("/me")
async def get_me(current_user: str = Depends(verify_token)):
    user = users_collection.find_one({"email": current_user}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# 🔓 FETCH PUBLIC KEY
@router.get("/public-key/{email}")
async def get_public_key(email: str):
    record = public_keys_collection.find_one({"email": email})
    if not record:
        raise HTTPException(status_code=404, detail="Public key not found")
    return {
        "name": record["name"],
        "email": record["email"],
        "role": record["role"],
        "public_key": record["public_key"]
    }
