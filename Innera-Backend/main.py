import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase (Ensure the JSON file is in the same folder)
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WaitlistUser(BaseModel):
    email: str

@app.get("/")
def read_root():
    return {"status": "success", "message": "Innera Backend API is Running! 🚀"}

@app.post("/api/waitlist")
def join_waitlist(user: WaitlistUser):
    try:
        # Saving data to Firestore database in a collection named 'waitlist'
        doc_ref = db.collection("waitlist").document(user.email)
        doc_ref.set({
            "email": user.email,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        print(f"🎉 Saved to Firebase Cloud: {user.email}")
        return {"success": True, "message": "You have been successfully added to the waitlist!"}
    
    except Exception as e:
        print("Database Error:", e)
        raise HTTPException(status_code=500, detail="Could not save to database. Please try again.")