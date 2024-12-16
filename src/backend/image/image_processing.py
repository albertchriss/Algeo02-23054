import numpy as np
from PIL import Image
import time
import os
from concurrent.futures import ProcessPoolExecutor
from scipy.sparse.linalg import svds
import joblib

# cara menggunakan: 
# hasil = imageProcess(data_image_dir, query_paths)


progress = 0

#keterangan kode:
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                IMAGE TO MATRIX
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def get_image_paths(directory):
    """
    Retrieves all image file paths from the given directory.
    Args:
        directory (str): Path to the directory containing images.
    Returns:
        list: List of image file paths.
    """
    supported_extensions = ('.jpg', '.jpeg', '.png')  # Add more extensions if needed
    image_paths = [
        os.path.join(directory, file)
        for file in os.listdir(directory)
        if file.lower().endswith(supported_extensions)
    ]
    return image_paths

def image_to_matrix2(image_path, target_size):
    image = Image.open(image_path).resize((target_size, target_size), Image.Resampling.NEAREST)
    resized_image = image.convert('L')
    return np.array(resized_image).flatten().astype(np.float32) / 255.0

def process_images_in_batches(image_paths, target_size, batch_size=6):
    results = []
    with ProcessPoolExecutor() as executor:
        for i in range(0, len(image_paths), batch_size):
            batch = image_paths[i:i + batch_size]
            resized_matrices = list(executor.map(image_to_matrix2, batch, [target_size] * len(batch)))
            results.extend(resized_matrices)
    return results
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                DATA CENTERING
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def center_data(data, query):
    """
    Centers the data by subtracting the mean.
    Args:
        data (numpy array): Input data matrix (features x samples).
    Returns:
        numpy array: Centered data matrix.
    """
    now = time.time()
    mean_vector = np.mean(data, axis=0, keepdims=True)
    print(len(data))
    print("chris tes mean: ", time.time()-now)
    now = time.time()
    centered_data = data - mean_vector
    print("chris tes center: ", time.time()-now)
    now = time.time()
    centered_query = query - mean_vector
    print("chris tes center query: ", time.time()-now)
    return centered_data , centered_query


def center_data_with_mean(data, means):
    return data - means
def find_means(data):
    return np.mean(data, axis=0, keepdims=True)
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                PCA
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def compute_pca_svd(data, num_components):
    """
    Performs PCA using Singular Value Decomposition (SVD).
    Args:
        data (numpy array): Centered data matrix (features x samples).
        num_components (int): Number of principal components to retain.
    Returns:
        numpy array: Principal components (features x num_components).
    """
    num_components = 20
    U, S, _ = svds(data, num_components, which = 'LM', return_singular_vectors="u")
    idx = np.argsort(S)[::-1]
    U = U[: , idx]
    return U
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                DATA PROJECTION
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def project_data(data, components):
    """Projects the data onto the principal components."""
    return np.matmul(components.T, data.T)
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                COMPUTE SIMILARITY
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def compute_similarity(data, query, threshold = 40): #euclidean distance
    """
    Computes similarity scores between data and query.
    Args:
        data (numpy array): Projected data matrix.
        query (numpy array): Projected query matrix.
    Returns:
        list: Similarity scores for each data sample.
    """
    similarities = []
    for i in range(data.shape[1]):
        distance = np.sqrt(np.sum((data[:, i] - query[:, 0]) ** 2))
        # similarities.append(distance)
        similarity = max(0, 100 * (1 - distance / threshold))
        similarities.append(similarity)
    return similarities
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                INTEGRATION
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def preProcessingDataSet(data_image_dir: str, target_size=100, batch_size=4):
    """
    Preprocesses data sets
    Args:
        data_image_dir (string): Folder path
        target_size (integer): Desired feature resizing
    Returns:
        image_paths (list of string): Contains image path
        projected_data (numpy array): Projected data matrix
        eigenvectors (numpy array): Matrix representing top features
        dataMean (numpy array): 1D array of integer of average features in number
    """

    print("Starting image dataset processing...")
    startTime = time.time()
    #database picture to matrix---------------------------------------------------------------------------------------------------------------------
    image_paths = get_image_paths(data_image_dir)
    dataPicture = process_images_in_batches(image_paths, target_size, batch_size)
    t1 = time.time()
    print(f"imgDataBase to matrix: {t1-startTime}")
    #centering dataPicture---------------------------------------------------------------------------------------------------------------------
    dataMean = find_means(dataPicture)
    t2 = time.time()
    print(f"data centering: {t2-t1}")
    #find eigenvectors---------------------------------------------------------------------------------------------------------------------
    dataPicture_centered = center_data_with_mean(dataPicture, dataMean)
    eigenvectors = compute_pca_svd(dataPicture_centered.T, 20)
    t3= time.time()
    print(f"principal component(PCA): {t3-t2}")
    # Project dataPicture---------------------------------------------------------------------------------------------------------------------
    projected_data = project_data(dataPicture_centered, eigenvectors)
    t4 = time.time()
    print(f"dataBase projection: {t4-t3}")

    return image_paths, projected_data, eigenvectors, dataMean
    


def queryImage(query_paths: list, cache_path: str, target_size=100, batch_size=4):
    """
    Integrates all image processing steps.
    Args:
        query_paths (array of string): contains an array of path (1 picture)
    Returns: 
        sorted: list of dictionaries with path as key and similarity percentage as value
    """
    path = str(cache_path / "processed_data.pkl")
    # Load the processed data using joblib
    image_paths, projected_data, eigenvectors, dataMean = joblib.load(path)

    print("Starting image processing...")
    startTime = time.time()
    yield 10
    #query to matrix---------------------------------------------------------------------------------------------------------------------
    queryPicture = process_images_in_batches(query_paths, target_size, batch_size)
    t1 = time.time()
    print(f"imgQuery to matrix: {t1-startTime}")
    yield 20
    #centering dataPicture---------------------------------------------------------------------------------------------------------------------
    queryPicture_centered = center_data_with_mean(queryPicture, dataMean)
    t2 = time.time()
    print(f"data centering: {t2-t1}")
    yield 30
    # Project queryPicture---------------------------------------------------------------------------------------------------------------------
    projected_query = project_data(queryPicture_centered, eigenvectors)
    t3 = time.time()
    print(f"query projection: {t3-t2}")
    yield 40
    
    sorted_imgPaths = compute_similarity(projected_data, projected_query)
    yield 60
    
    t4 = time.time()
    print(f"compute similarity: {t4-t3}")
    sorted_similarities = sorted(
        zip(sorted_imgPaths, image_paths), key=lambda x: x[0], reverse=True
    )
    t5 = time.time()
    print(f"sortZip: {t5-t4}")
    yield 80
    sorted_by_percentage_images = []
    for similarity, img_path in sorted_similarities[:12]:
        print(f"Image: {img_path}, Similarity: {similarity:.2f}%")
        if similarity > 75:
            sorted_by_percentage_images.append({"filename": img_path, "score": similarity})
    yield 100
    return sorted_by_percentage_images


def imageProcessing(data_image_dir: str, query_paths: list, target_size=100, num_components = 20, batch_size=4):
    """Integrates all image processing steps."""

    print("Starting image processing...")
    startTime = time.time()
    #database picture to matrix---------------------------------------------------------------------------------------------------------------------
    image_paths = get_image_paths(data_image_dir)
    dataPicture = process_images_in_batches(image_paths, target_size, batch_size)
    t1 = time.time()
    print(f"imgDataBase to matrix: {t1-startTime}")

    #query to matrix---------------------------------------------------------------------------------------------------------------------
    queryPicture = process_images_in_batches(query_paths, target_size, batch_size)
    t2 = time.time()
    print(f"imgQuery to matrix: {t2-t1}")

    #centering dataPicture---------------------------------------------------------------------------------------------------------------------
    dataPicture_centered, queryPicture_centered = center_data(dataPicture, queryPicture)
    t3 = time.time()
    print(f"data centering: {t3-t2}")

    #find eigenvectors---------------------------------------------------------------------------------------------------------------------
    eigenvectors = compute_pca_svd(dataPicture_centered.T, num_components)
    t4= time.time()
    print(f"principal component(PCA): {t4-t3}")

    # Project dataPicture---------------------------------------------------------------------------------------------------------------------
    projected_data = project_data(dataPicture_centered, eigenvectors)
    t5 = time.time()
    print(f"dataBase projection: {t5-t4}")

    # Project queryPicture---------------------------------------------------------------------------------------------------------------------
    projected_query = project_data(queryPicture_centered, eigenvectors)
    t6 = time.time()
    print(f"query projection: {t6-t5}")

    # Compute---------------------------------------------------------------------------------------------------------------------
    sorted_imgPaths = compute_similarity(projected_data, projected_query)
    sorted_similarities = sorted(
        zip(sorted_imgPaths, image_paths), key=lambda x: x[0], reverse=True
    )

    sorted_by_percentage_images = {}
    for similarity, img_path in sorted_similarities[:12]:
        print(f"Image: {img_path}, Similarity: {similarity:.2f}%")
        if similarity > 75:
            sorted_by_percentage_images.append({"filepath": img_path, "score": similarity})
    t7 = time.time()
    print(f"compute similarity: {t7-t6}")
    return sorted_by_percentage_images






#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                USAGE EXAMPLE
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# if __name__ == '__main__':
#     print("start")
    # imgPath, projData, eigen, datMean = 
    # preProcessingDataSet(r"D:\album_covers_512")
    # res = queryImage([r"D:\album_covers_512\22.jpg"])
    # print(res[0]["score"])
    # print("end")
    # print("start2")
    # res = imageProcessing(r"D:\album_covers_512", [r"D:\album_covers_512\22.jpg"])
    # print("end2")