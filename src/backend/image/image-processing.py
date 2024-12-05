import numpy as np
from PIL import Image
import time

#---------------------------------------------------------------IMAGE TO MATRIX START---------------------------------------------------------------
def resize_matrix_manual(matrix, new_size):
    """
    Resizes a 1D matrix manually by duplicating elements to match the new size.
    Args:
        matrix (list or numpy array): Input matrix to resize.
        new_size (int): Desired size of the output matrix.
    Returns:
        numpy array: Resized matrix.
    """
    old_size = len(matrix)
    scale_factor = new_size // old_size
    resized_matrix = []
    if(scale_factor < 1):
        scale_factor = old_size // new_size
        i = 0
        mean =0
        for val in matrix:
            mean += val
            if(i%scale_factor == scale_factor-1):
                mean/=scale_factor
                resized_matrix.extend([mean])
                mean = 0
            i+=1
        while len(resized_matrix) < new_size:
            resized_matrix.append(matrix[-1])  # Pad with the last value
        return np.array(resized_matrix)
    for value in matrix:
        resized_matrix.extend([value] * scale_factor)
    
    # Handle any remaining slots if sizes are not perfectly divisible
    while len(resized_matrix) < new_size:
        resized_matrix.append(matrix[-1])  # Pad with the last value
    return np.array(resized_matrix)


def image_to_matrix(image_path, target_size):
    """
    Converts an image into a resized 1D matrix.
    Args:
        image_path (str): Path to the image file.
        target_size (int): Desired size of the output matrix.
    Returns:
        numpy array: Resized 1D matrix of the image.
    """
    # Load image and convert to grayscale
    image = Image.open(image_path).convert('L')
    
    # Flatten the grayscale image into a 1D array
    flattened = np.array(image).flatten().astype(np.float32) / 255.0
    # Resize the matrix to the target size
    resized_matrix = resize_matrix_manual(flattened, target_size)
    return resized_matrix

def build_data_picture(image_paths, target_size):
    """
    Processes a list of images and builds a `dataPicture` matrix.
    Args:
        image_paths (list): List of paths to the image files.
        target_size (int): Desired size for each image matrix.
    Returns:
        numpy array: `dataPicture` matrix (features x samples).
    """
    data_picture = []

    for image_path in image_paths:
        resized_matrix = image_to_matrix(image_path, target_size)
        data_picture.append(resized_matrix)
    
    # Combine all resized matrices column-wise
    data_picture = np.array(data_picture).T  # Transpose to get (features x samples)
    return data_picture



#-------------------------------------------------------------------IMAGE TO MATRIX END-------------------------------------------------------------------



#-------------------------------------DATA CENTERING START---------------------------------------------------------------------------------------------

# Example of data preparation
def center_data(data):
    """
    Centers the data by subtracting the mean.
    Args:
        data (numpy array): Input data matrix (features x samples).
    Returns:
        numpy array: Centered data matrix.
    """
    mean_vector = np.mean(data, axis=1, keepdims=True)
    centered_data = data - mean_vector
    return centered_data
#-------------------------------------DATA CENTERING END---------------------------------------------------------------------------------------------

#-------------------------------------------------------CALCULATE EIGENS START-------------------------------------------------------------------
#DIGUNAKAN HANYA BILA TIDAK DIPERBOLEHKAN MENGGUNAKAN numpy.linalg.svd
def power_iteration(A, num_iterations=1000, tol=1e-6):
    """
    Finds the dominant eigenvalue and eigenvector of a matrix using power iteration.
    Args:
        A (numpy array): Input square matrix.
        num_iterations (int): Number of iterations for convergence.
        tol (float): Tolerance for convergence.
    Returns:
        eigenvalue (float), eigenvector (numpy array)
    """
    n = A.shape[0]
    v = np.random.rand(n) + 1e-6# Start with a random vector
    v = v / np.linalg.norm(v)  # Normalize the vector

    for _ in range(num_iterations):
        v_next = np.matmul(A, v)
        if(np.linalg.norm(v_next) == 0):
            # Reinitialize v and continue
            v = np.random.rand(n) + 1e-6
            v = v / np.linalg.norm(v)
            continue
        v_next = v_next / np.linalg.norm(v_next)

        if np.linalg.norm(v_next - v) < tol:
            break
        v = v_next

    eigenvalue = np.dot(v, np.matmul(A, v)) / np.dot(v, v)  # Rayleigh quotient
    return eigenvalue, v

def find_eigenpairs(A, num_eigenvalues):
    """
    Finds eigenvalues and eigenvectors of a matrix using power iteration and deflation.
    Args:
        A (numpy array): Input square matrix.
        num_eigenvalues (int): Number of eigenvalues to compute.
    Returns:
        eigenvalues (numpy array), eigenvectors (numpy array)
    """
    eigenvalues = []
    eigenvectors = []
    A_copy = np.copy(A)

    for _ in range(num_eigenvalues):
        eigenvalue, eigenvector = power_iteration(A_copy)
        eigenvalues.append(eigenvalue)
        eigenvectors.append(eigenvector)
        # Deflate the matrix
        A_copy -= eigenvalue * np.outer(eigenvector, eigenvector)
    return np.array(eigenvalues), np.array(eigenvectors).T
def compute_pca(data):
    """
    Computes PCA manually on the given data.
    Args:
        data (numpy array): Centered data matrix (features x samples).
    Returns:
        numpy array: Principal components.
    """
    # Compute covariance matrix
    covariance_matrix = np.matmul(data, data.T) / data.shape[1]

    # Eigen decomposition
    # eigenvalues, eigenvectors = find_eigenpairs(covariance_matrix, num_eigenvalues=data.shape[0])
    eigenvalues, eigenvectors = np.linalg.eig(covariance_matrix)
    total_variance = np.sum(eigenvalues)
    variance_explained = eigenvalues / total_variance
    cumulative_variance = np.cumsum(variance_explained)
    k = np.argmax(cumulative_variance >= 0.5) + 1
    # k = 5
    # Sort eigenvectors by decreasing eigenvalues  (APAKAH DIPERLUKAN?)
    sorted_indices = np.argsort(-eigenvalues)
    eigenvalues = eigenvalues[sorted_indices]
    eigenvectors = eigenvectors[:, sorted_indices][: , : k ]
    # eigenvectors = eigenvectors
    return k, eigenvectors
    # sorted_indices = np.argsort(-eigenvalues)
    # principal_components = eigenvectors[:, sorted_indices]
    # return principal_components
#-------------------------------------------------------CALCULATE EIGENS END-------------------------------------------------------------------
#------------------------------------------------------------------------------------PCA START-------------------------------------------------------------------







def compute_pca_svd(data, num_components):
    """
    Performs PCA using Singular Value Decomposition (SVD).
    Args:
        data (numpy array): Centered data matrix (features x samples).
        num_components (int): Number of principal components to retain.
    Returns:
        numpy array: Principal components (features x num_components).
    """
    U, S, Vt = np.linalg.svd(data, full_matrices=False)
    principal_components = U[:, :num_components]
    return principal_components
#------------------------------------------------------------------------------------PCA END-------------------------------------------------------------------



def project_data(data, components):
    """Projects the data onto the principal components."""
    return np.matmul(components.T, data)



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
    



#-------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                USAGE EXAMPLE
#-------------------------------------------------------------------------------------------------------------------------------------------------------
startTime = time.time()

#database picture to matrix
image_paths = [r"C:\\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\1989.jpg", r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\1989_Taylor_sVersion_.jpg", r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\Fearless_PlatinumEdition_.jpg", r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\Evermore.jpg", r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\Midnights_TheLateNightEdition_.jpg"]  # Replace with image paths
target_size = 1000  #sets matrix (target_size)X1
dataPicture = build_data_picture(image_paths, target_size)
t0 = time.time()

#query to matrix
query_paths = [r"C:\Users\WINDOWS 10\Desktop\CODING\Python3\tubesAlgeo2\data\Cover_Art\1989_Taylor_sVersion__WebstoreDeluxe_.jpg"]  # Replace with query paths
queryPicture = build_data_picture(query_paths, target_size)
t1 = time.time()

#centering dataPicture
dataPicture_centered = center_data(dataPicture)
t2 = time.time()

#find eigenvectors
# k, eigenvectors = compute_pca(dataPicture_centered)
eigenvectors = compute_pca_svd(dataPicture_centered, 100)
t3= time.time()

# Project dataPicture
projected_data = project_data(dataPicture_centered, eigenvectors)
t4 = time.time()

#centering queryPicture
queryPicture_centered = queryPicture - np.mean(dataPicture, axis=1, keepdims=True)
t5 = time.time()

# Project queryPicture
projected_query = project_data(queryPicture_centered, eigenvectors)
t6 = time.time()

# Compute
similarity_rank = compute_similarity(projected_data, projected_query)
t7 = time.time()

# Sort similarities
idx_similarity_rank_sorted = np.argsort(np.array(similarity_rank))
t8 = time.time()

# Sort image path
image_paths = np.array(image_paths)[idx_similarity_rank_sorted]
t9 = time.time()

# Print sorted image path
print(image_paths)

# Print time needed
print(f"imgDataBase to matrix: {t1-t0}")
print(f"queryPicture ke matrix: {t2-t1}")
print(f"principal component(PCA): {t3-t2}")
print(f"dataBase projection: {t4-t3}")
print(f"query center: {t5-t4}")
print(f"query projection: {t6-t5}")
print(f"compute similarity: {t7-t6}")
print(f"ngerank berdasarkan kemiripan: {t8-t7}")
print(f"ngurutin berdasarkan rank: {t9-t8}")
print(f"total time: {t9-t0}")
