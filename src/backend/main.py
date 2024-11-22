from fastapi import FastAPI
from fastapi import UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS setup for communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React/Next.js origin
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the backend!"}

@app.post('/uploadfile/')
async def create_upload_file(file_upload: UploadFile):
    contents = await file_upload.read()
    print(contents)
    return {"content": contents}
