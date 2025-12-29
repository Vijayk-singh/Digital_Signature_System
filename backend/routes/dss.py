from fastapi import APIRouter, UploadFile, Form, HTTPException
from utils.crypto_utils import verify_signature
from database import users_collection, public_keys_collection

router = APIRouter(prefix="/dss", tags=["Digital Signature"])

@router.post("/verify")
async def verify_document(
    email: str = Form(...),
    signature: str = Form(...),
    file: UploadFile = None
):
    try:
        # ✅ Fetch from public_keys_collection (not users_collection)
        key_record = public_keys_collection.find_one({"email": email})
        if not key_record:
            raise HTTPException(status_code=404, detail="Public key not found for this user")

        file_bytes = await file.read()

        # ✅ Use the stored public key
        valid = verify_signature(file_bytes, signature, key_record["public_key"])

        return {
            "valid": valid,
            "signee": key_record["name"] if valid else None,
            "message": "Signature verified successfully!" if valid else "Invalid or tampered signature."
        }

    except Exception as e:
        print("Verification error:", e)
        raise HTTPException(status_code=500, detail=str(e))
