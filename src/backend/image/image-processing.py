import numpy as np
from PIL import Image
import time
import os
from concurrent.futures import ProcessPoolExecutor
from scipy.sparse.linalg import svds

# cara menggunakan: 
# hasil = imageProcess(data_image_dir, query_paths)




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
    supported_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')  # Add more extensions if needed
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
    mean_vector = np.mean(data, axis=0, keepdims=True)
    centered_data = data - mean_vector
    centered_query = query - mean_vector
    return centered_data , centered_query
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
def compute_similarity(data, query): #euclidean distance
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
        # Compute Euclidean distance manually
        distance = np.sqrt(np.sum((data[:, i] - query[:, 0]) ** 2))
        similarities.append(distance)
    # Sort distances in ascending order (smaller distance = more similar)
    return similarities
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                INTEGRATION
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def imageProcessing(data_image_dir, query_paths, target_size=200, num_components = 20, batch_size=6):
    """Integrates all image processing steps."""
    #database picture to matrix---------------------------------------------------------------------------------------------------------------------
    image_paths = get_image_paths(data_image_dir)
    dataPicture = process_images_in_batches(image_paths, target_size, batch_size)

    #query to matrix---------------------------------------------------------------------------------------------------------------------
    queryPicture = process_images_in_batches(query_paths, target_size, batch_size)

    #centering dataPicture---------------------------------------------------------------------------------------------------------------------
    dataPicture_centered, queryPicture_centered = center_data(dataPicture, queryPicture)

    #find eigenvectors---------------------------------------------------------------------------------------------------------------------
    eigenvectors = compute_pca_svd(dataPicture_centered.T, num_components)

    # Project dataPicture---------------------------------------------------------------------------------------------------------------------
    projected_data = project_data(dataPicture_centered, eigenvectors)

    # Project queryPicture---------------------------------------------------------------------------------------------------------------------
    projected_query = project_data(queryPicture_centered, eigenvectors)

    # Compute---------------------------------------------------------------------------------------------------------------------
    sorted_imgPaths = compute_similarity(projected_data, projected_query)
    sorted_imgPaths = np.argsort(np.array(sorted_imgPaths))
    sorted_imgPaths = np.array(image_paths)[sorted_imgPaths]
    return sorted_imgPaths






#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                USAGE EXAMPLE
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# if __name__ == '__main__':
#     startTime = time.time()
#     # #database picture to matrix---------------------------------------------------------------------------------------------------------------------
#     data_image_dir = "dataImage/album_covers_512"
#     # data_image_dir = "dataImage/Cover_Art"
#     image_paths = get_image_paths(data_image_dir)
#     target_size = 100
#     dataPicture = process_images_in_batches(image_paths, target_size, batch_size=12)
#     t0 = time.time()
#     print(f"resizing: {t0 - startTime}")
#     # #query to matrix---------------------------------------------------------------------------------------------------------------------
#     query_paths = [r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\Algeo02-23054\dataImage\album_covers_512\22.jpg"]
#     # query_paths = [r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\Algeo02-23054\dataImage\Cover_Art\1989_Taylor_sVersion__WebstoreDeluxe_.jpg"]  # Replace with query paths
#     # query_paths = [r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\Algeo02-23054\dataImage\Cover_Art\Midnights_TheTillDawnEdition_.jpg"]
#     queryPicture = process_images_in_batches(query_paths, target_size, batch_size=6)
#     t1 = time.time()
#     print(f"imgDataBase to matrix: {t1-t0}")
#     #centering dataPicture---------------------------------------------------------------------------------------------------------------------
#     dataPicture_centered, queryPicture_centered = center_data(dataPicture, queryPicture)
#     t2 = time.time()
#     print(f"data centering: {t2-t1}")
#     #find eigenvectors---------------------------------------------------------------------------------------------------------------------
#     eigenvectors = compute_pca_svd(dataPicture_centered.T, 100)
#     t3= time.time()
#     print(f"principal component(PCA): {t3-t2}")
#     # Project dataPicture---------------------------------------------------------------------------------------------------------------------
#     projected_data = project_data(dataPicture_centered.T, eigenvectors.T)
#     # projected_data = project_with_ipca(ipca, dataPicture_centered)
#     t4 = time.time()
#     print(f"dataBase projection: {t4-t3}")
#     # Project queryPicture---------------------------------------------------------------------------------------------------------------------
#     projected_query = project_data(queryPicture_centered.T, eigenvectors.T)
#     t5 = time.time()
#     print(f"query projection: {t5-t4}")
#     # Compute---------------------------------------------------------------------------------------------------------------------
#     t6 = time.time()
#     print(f"compute similarity: {t6-t5}")
#     # Sort similarities---------------------------------------------------------------------------------------------------------------------
#     similarity_rank = compute_similarity(projected_data, projected_query)
#     idx_similarity_rank_sorted = np.argsort(np.array(similarity_rank))
#     t7 = time.time()
#     print(f"ngerank berdasarkan kemiripan: {t7-t6}")
#     # Sort image path---------------------------------------------------------------------------------------------------------------------
#     image_paths = np.array(image_paths)[idx_similarity_rank_sorted]
#     t8 = time.time()
#     print(f"ngurutin berdasarkan rank: {t8-t7}")
#     # Print sorted image path---------------------------------------------------------------------------------------------------------------------
#     print(image_paths[:10]) 
#     # Print time needed---------------------------------------------------------------------------------------------------------------------
#     print(f"total time: {t8-startTime}")