from fastapi import FastAPI, Query, Form
from fastapi import UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import zipfile
import io
import os
from tools import *
from pydantic import BaseModel

DATASET_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
MAPPER_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
QUERY_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists

app = FastAPI()

data_set_directory = Path(__file__).parent / "uploads/dataset"
mapper_directory = Path(__file__).parent / "uploads/mapper"
query_directory = Path(__file__).parent / "uploads/query"
app.mount("/uploads/dataset", StaticFiles(directory=data_set_directory), name="dataset")
app.mount("/uploads/mapper", StaticFiles(directory=mapper_directory), name="mapper")
app.mount("/uploads/query", StaticFiles(directory=query_directory), name="query")

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

@app.post('/uploadquery/')
async def create_upload_query(file_upload: UploadFile, is_image: str = Form(...)):
    try:
        delete_query()
        file_name = file_upload.filename
        if (is_image_file(file_name) and is_image) or (is_midi_file(file_name) and not is_image):
            extracted_file_path = QUERY_DIR / Path(file_name).name
            try:
                contents = await file_upload.read()
                with open(extracted_file_path, "wb") as extracted_file:
                    extracted_file.write(contents)
                
                return {"file_name": f"http://localhost:8000/uploads/query/{file_name}"}
            except:
                print(f"Failed to write file: {file_name}")
    except HTTPException as http_exc:
        # Re-raise the HTTP exceptions that are meant to provide specific feedback
        raise http_exc
    except Exception as exc:
        # Catch any other exceptions and raise a generic HTTP exception
        raise HTTPException(status_code=400, detail="Invalid file")

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
        
        file_upload_path = MAPPER_DIR / Path("mapper.txt")
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
            for file_info in zip_ref.infolist():
                # Skip directories
                if file_info.is_dir():
                    continue

                file_name = file_info.filename
                # check jika file adalah file gambar atau file audio
                if (is_image_file(file_name) and is_image) or (is_midi_file(file_name) and not is_image):
                    extracted_file_path = DATASET_DIR / Path(file_name).name
                    try:
                        with open(extracted_file_path, "wb") as extracted_file:
                            extracted_file.write(zip_ref.read(file_name))
                    except:
                        print(f"Failed to write file: {file_name}")
                        continue
                
                # file bukan file gambar atau file audio
                else:
                    continue
                    if (is_image):
                        raise HTTPException(status_code=400, detail=f"Only image files are allowed: {file_name}")
                    else:
                        raise HTTPException(status_code=400, detail=f"Only midi files are allowed: {file_name}")

        data_urls = [
            f"http://localhost:8000/uploads/data-set/{file_name}"
            for file_name in os.listdir(DATASET_DIR)
        ]
        return {"uploaded_images": data_urls}
    
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid zip file")


@app.get("/dataset/")
async def read_dataset(is_image: bool = Query(0), page: int = Query(1), limit: int = Query(5), search: str = Query("")):
    page = max(1, page)
    start_index = (page-1)*limit
    end_index = page*limit
    if (is_image):
        image_data = [file_name for file_name in os.listdir(DATASET_DIR) if is_image_file(file_name) and search.lower() in file_name.lower().replace(".jpg", "").replace(".jpeg", "").replace(".png", "")]
        images = [
            {
                "imgSrc": f"http://localhost:8000/uploads/dataset/{file_name}", 
                "title": file_name
            }
            for file_name in image_data[start_index : min(end_index, len(image_data))]
        ]

        if len(images) == 0:
            raise HTTPException(status_code=404, detail="No images found")

        return {"images": images, "total": len(image_data)}
    else:
        mapper = await read_mapper()
        mapper = mapper["mappers"]

        midi_data = [file_name for file_name in os.listdir(DATASET_DIR) if is_midi_file(file_name) and search.lower() in file_name.lower().replace(".mid", "")]
        midis = [
            {
            "imgSrc": f"http://localhost:8000/uploads/dataset/{mapper[file_name][0]}" if file_name in mapper else "/cover.jpg", 
            "audioSrc": f"http://localhost:8000/uploads/dataset/{file_name}",
            "title": Path(file_name).stem  
            }
            for file_name in midi_data[start_index : min(end_index, len(midi_data))]
        ]

        if len(midis) == 0:
            raise HTTPException(status_code=404, detail="No audios found")
        
        return {"midis": midis, "total": len(midi_data)}


@app.get("/mapper/")
async def read_mapper():
    if not (MAPPER_DIR / "mapper.txt").exists():
        raise HTTPException(status_code=404, detail="No mapper found")
    
    mapper: dict[int, list] = {}

    mapper_file = "http://localhost:8000/uploads/mapper/mapper.txt"
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


@app.get("/dataset/{file_name}")
async def read_file(file_name: str, page: int = Query(1), limit: int = Query(10)):
    start_index = (page-1)*limit
    end_index = page*limit
    if (not is_image_file(file_name)):
        raise HTTPException(status_code=404, detail="Album not found")

    mapper = await read_mapper()
    mapper = mapper["mappers"]

    if (file_name not in mapper):
        raise HTTPException(status_code=404, detail="Album not found")
    
    midis = [
        {
            "imgSrc": f"http://localhost:8000/uploads/dataset/{file_name}", 
            "audioSrc": f"http://localhost:8000/uploads/dataset/{midi_name}",
            "title": Path(midi_name).stem
        }
        for midi_name in mapper[file_name][start_index : min(end_index, len(mapper[file_name]))]
    ]
    
    return {"midi": midis, "total": len(mapper[file_name])}


@app.post("/mapper/generate/")
async def generate_mapper():
    delete_mapper()
    image_data = [file_name for file_name in os.listdir(DATASET_DIR) if is_image_file(file_name)]
    midi_data = [file_name for file_name in os.listdir(DATASET_DIR) if is_midi_file(file_name)]

    if (len(image_data) == 0):
        raise HTTPException(status_code=400, detail="No image files found")

    if (len(midi_data) == 0):
        raise HTTPException(status_code=400, detail="No midi files found")

    if (len(image_data) > len(midi_data)):
        raise HTTPException(status_code=400, detail="Image files cannot be more than midi files")

    # for midi in midi_data:
    mapper_path = MAPPER_DIR / "mapper.txt"
    with open(mapper_path, "wb") as mapper_file:
        for i in range(len(midi_data)):
            mapper_file.write(f"{image_data[i%len(image_data)]} {midi_data[i]}\n".encode("utf-8"))