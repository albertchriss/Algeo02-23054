from fastapi import FastAPI, Query, Form
from fastapi import UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import zipfile
import io
import os
from tools import *

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
    delete_dataset(is_image)

    try:
        zip_data = await file_upload.read()

        # extract zip file
        with zipfile.ZipFile(io.BytesIO(zip_data)) as zip_ref:
            for file_name in zip_ref.namelist():
                # check jika file adalah file gambar atau file audio
                if (is_image_file(file_name) and is_image) or (is_midi_file(file_name) and not is_image):
                    extracted_file_path = DATASET_DIR / Path(file_name).name
                    with open(extracted_file_path, "wb") as extracted_file:
                        extracted_file.write(zip_ref.read(file_name))
                
                # file bukan file gambar atau file audio
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
        images = [
            {
                "imgSrc": f"http://localhost:8000/uploads/dataset/{file_name}", 
                "title": file_name.split(".")[0]
            }
            for file_name in os.listdir(DATASET_DIR)
            if is_image_file(file_name)
        ]

        if len(images) == 0:
            raise HTTPException(status_code=404, detail="No images found")

        return {"images": images}
    else:
        mapper = await read_mapper()
        mapper = mapper["mappers"]

        midis = [
            {
                "imgSrc": f"http://localhost:8000/uploads/dataset/{mapper[file_name][0]}" if file_name in mapper else "/cover.jpg", 
                "audioSrc": f"http://localhost:8000/uploads/dataset/{file_name}",
                "title": file_name.split(".")[0]
            }
            for file_name in os.listdir(DATASET_DIR)
            if is_midi_file(file_name)
        ]

        if len(midis) == 0:
            raise HTTPException(status_code=404, detail="No audios found")
        
        return {"midis": midis}


@app.get("/mapper/")
async def read_mapper():
    mapper_files = [
        f"http://localhost:8000/uploads/mapper/{file_name}" 
        for file_name in os.listdir(MAPPER_DIR)
    ]
    if (len(mapper_files) == 0):
        raise HTTPException(status_code=404, detail="No mapper found")
    
    mapper: dict[int, list] = {}

    mapper_file = mapper_files[0]
    with open(MAPPER_DIR / Path(mapper_file).name, "rb") as file_object:
        contents = file_object.read()
        try:
            contents_str = contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Invalid file encoding. Ensure the file is UTF-8 encoded.")
        
        content_list = contents_str.split("\n")
        for content in content_list:
            content = content.rstrip()
            files = content.split()
            if (len(files) == 0):
                continue
            image_name = files[0]
            midi_name = files[1]
            if (image_name not in mapper):
                mapper[image_name] = [midi_name]
            else:
                mapper[image_name].append(midi_name)

            if (midi_name not in mapper):
                mapper[midi_name] = [image_name]
            else:
                mapper[midi_name].append(image_name)

    return {"mappers": mapper}
