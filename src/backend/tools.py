import os
from pathlib import Path
import time
import shutil

DATASET_DIR = Path() / "uploads/dataset"
MAPPER_DIR = Path() / "uploads/mapper"
QUERY_DIR = Path() / "uploads/query"
QUERY_RESULT_DIR = Path() / "uploads/query_result"

def delete_old_files(directory: Path, age_limit_seconds: int):
    now = time.time()
    for item in directory.iterdir():
        if item.is_dir():
            creation_time = item.stat().st_mtime
            if now - creation_time > age_limit_seconds:
                shutil.rmtree(item)

def delete_dataset(is_image: bool):
    for file in os.listdir(DATASET_DIR):
        if (is_image and file.endswith((".png", ".jpg", ".jpeg"))):
            os.remove(DATASET_DIR / file)
        if (not is_image and file.endswith((".mid"))):
            os.remove(DATASET_DIR / file)
    return {"message": "Dataset deleted"}

def delete_mapper():
    for file in os.listdir(MAPPER_DIR):
        os.remove(MAPPER_DIR / file)
    return {"message": "Mapper deleted"}

def delete_query(session_id):
    for file in os.listdir(QUERY_DIR / session_id):
        os.remove(QUERY_DIR / session_id / file)
    return {"message": "Query deleted"}

def delete_query_result(session_id):
    for file in os.listdir(QUERY_RESULT_DIR / session_id):
        os.remove(QUERY_RESULT_DIR / session_id / file)
    return {"message": "Query result deleted"}

def is_valid_mapper_format(files: list):
    # cek validitas format, yaitu "image.png/jpg/jpeg<spasi>midi.midi"
    if (len(files) > 2 or len(files) == 1):
        return False, "invalid file format."
    
    # cek validitas file
    image_name = files[0]
    if (not is_image_file(image_name)):
        return False, f"invalid image file format: {image_name}"
    midi_name = files[1]
    if (not is_midi_file(midi_name)):
        return False, f"invalid midi file format: {midi_name}"
    # cek apakah image dan midi file ada
    if not (DATASET_DIR / image_name).exists():
        return False, f"image file not found: {image_name}"
    if not (DATASET_DIR / midi_name).exists():
        return False, f"midi file not found: {midi_name}"
    
    return True, ""


def is_valid_mapper(contents: str):
    content_list = contents.split("\n")

    mapper = {}

    for content in content_list:
        content = content.rstrip()
        files = content.split()

        if (len(files) == 0):
            continue
        
        # check mapper format
        is_valid_format, message = is_valid_mapper_format(files)
        if (not is_valid_format):
            return False, message


        image_file = files[0]
        audio_file = files[1]

        # one image can have a few audio file
        mapper[image_file] = audio_file

        # one audio file can only have one image
        if (audio_file in mapper):
            return False, f"Invalid mapper. One midi file can only have one image: {audio_file}!"
        mapper[audio_file] = image_file

    # if there is a file in the dataset that is not mapped        
    for file in os.listdir(DATASET_DIR):
        if (file not in mapper and (is_image_file(file) or is_midi_file(file))):
            return False, f"Invalid mapper. File {file} is not mapped!"

    return True, ""

def is_image_file(file_name: str):
    return file_name.lower().endswith((".png", ".jpg", ".jpeg"))

def is_midi_file(file_name: str):
    return file_name.lower().endswith((".mid"))