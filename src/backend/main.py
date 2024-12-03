from fastapi import FastAPI, Query, Form
from fastapi import UploadFile, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import zipfile
import io
import os

DATASET_DIR = Path() / "uploads/dataset"
MAPPER_DIR = Path() / "uploads/mapper"
DATASET_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
MAPPER_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists

app = FastAPI()

data_set_directory = Path(__file__).parent / "uploads/dataset"
mapper_directory = Path(__file__).parent / "uploads/mapper"
app.mount("/uploads/dataset", StaticFiles(directory=data_set_directory), name="dataset")
app.mount("/uploads/mapper", StaticFiles(directory=mapper_directory), name="mapper")

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

@app.post('/uploadmapper/')
async def create_upload_mapper(file_upload: UploadFile):
    delete_mapper()
    try:
        contents = await file_upload.read()
        try:
            contents_str = contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Invalid file encoding. Ensure the file is UTF-8 encoded.")
        
        is_valid, message = is_valid_mapper(contents_str)
        if (not is_valid):
        #     # print(contents_str)
            print(f"Validation failed: {message}")  # Log
            raise HTTPException(status_code=401, detail=message)
        
        file_upload_path = MAPPER_DIR / Path(file_upload.filename)
        with open(file_upload_path, "wb") as file_object:
            file_object.write(contents)
        return {"content": contents}
    
    except HTTPException as http_exc:
        # Re-raise the HTTP exceptions that are meant to provide specific feedback
        raise http_exc
    except Exception as exc:
        # Catch any other exceptions and raise a generic HTTP exception
        raise HTTPException(status_code=400, detail="Invalid file")
    
@app.post('/uploaddataset/')
async def create_upload_dataset(file_upload: UploadFile, is_image: str = Form(...)):
    is_image = is_image.lower() == "true"
    delete_dataset()

    try:
        zip_data = await file_upload.read()

        with zipfile.ZipFile(io.BytesIO(zip_data)) as zip_ref:
            for file_name in zip_ref.namelist():
                # check jika file adalah file gambar
                if (file_name.lower().endswith((".png", ".jpg", ".jpeg")) and is_image) or (file_name.lower().endswith((".midi")) and not is_image):
                    extracted_file_path = DATASET_DIR / Path(file_name).name
                    with open(extracted_file_path, "wb") as extracted_file:
                        extracted_file.write(zip_ref.read(file_name))
                else:
                    if (is_image):
                        raise HTTPException(status_code=400, detail="Only image files are allowed")
                    else:
                        raise HTTPException(status_code=400, detail="Only midi files are allowed")

        data_urls = [
            f"http://localhost:8000/uploads/data-set/{file_name}"
            for file_name in os.listdir(DATASET_DIR)
        ]
        return {"uploaded_images": data_urls}
    
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid zip file")


@app.get("/dataset/")
async def read_dataset(is_image: bool = Query(...)):
    if (is_image):
        image_urls = [
            f"http://localhost:8000/uploads/dataset/{file_name}"
            for file_name in os.listdir(DATASET_DIR)
            if file_name.lower().endswith((".png", ".jpg", ".jpeg"))
        ]
        image_names = [
            file_name.split(".")[0]
            for file_name in os.listdir(DATASET_DIR)
        ]
        return {"images": image_urls, "image_names": image_names}
    else:
        midi_urls = [
            f"http://localhost:8000/uploads/dataset/{file_name}"
            for file_name in os.listdir(DATASET_DIR)
            if file_name.lower().endswith((".midi"))
        ]
        midi_names = [
            file_name.split(".")[0]
            for file_name in os.listdir(DATASET_DIR)
        ]
        return {"midis": midi_urls, "midi_names": midi_names}


def delete_dataset():
    for file in os.listdir(DATASET_DIR):
        os.remove(DATASET_DIR / file)
    return {"message": "Dataset deleted"}

def delete_mapper():
    for file in os.listdir(MAPPER_DIR):
        # print(file)
        os.remove(MAPPER_DIR / file)
    return {"message": "Mapper deleted"}

def is_valid_mapper(contents):
    content_list = contents.split("\n")
    for content in content_list:
        content = content.rstrip()
        files = content.split()
        if (len(files) == 0):
            continue
        if (len(files) > 2 or len(files) == 1):
            return False, "invalid file format."
        image_name = files[0]
        if (not image_name.endswith((".png", ".jpg", ".jpeg"))):
            return False, f"invalid image file format: {image_name}"
        midi_name = files[1]
        if (not midi_name.endswith((".midi"))):
            return False, f"invalid midi file format: {midi_name}"
        if not (DATASET_DIR / image_name).exists():
            return False, f"image file not found: {image_name}"
        if not (DATASET_DIR / midi_name).exists():
            return False, f"midi file not found: {midi_name}"
    return True, ""
