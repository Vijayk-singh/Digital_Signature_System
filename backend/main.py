from fastapi import FastAPI
from routes import auth, dss  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Signature System")

# --- Enable CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["http://localhost:5173"] if using Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(auth.router)
app.include_router(dss.router)  # 👈 include DSS endpoints

# --- Root Route ---
@app.get("/")
def root():
    return {"message": "Welcome to DSS Backend"}
