# IF2123 - Aljabar Linier dan Geometri
[![Backend: FastAPI](https://img.shields.io/badge/backend-fastapi-blue)](https://fastapi.tiangolo.com/)
[![Frontend: Next.js](https://img.shields.io/badge/frontend-next.js-black)](https://nextjs.org/)
[![Deployment: Preview](https://img.shields.io/badge/deployment-preview-blue)](https://algeo02-23054.vercel.app/)
[![Status](https://img.shields.io/badge/Completion-100%25-brightgreen)](https://github.com/albertchriss/Algeo02-23054)
> Tugas Besar 2 - IF2123 Aljabar Linier dan Geometri


## 🎵 Image Retrieval dan Music Information Retrieval
Repository ini merupakan implementasi Information Retrieval yang menggabungkan Music Information Retrieval (MIR) dan Image Retrieval dengan pendekatan Principal Component Analysis (PCA) dan teknik berbasis vektor lainnya. Tujuan utama dari sistem ini adalah untuk mencari dan mengidentifikasi lagu atau gambar album berdasarkan input suara atau gambar.


## 🚀 Fitur Utama
#### 1. Music Information Retrieval (Query by Humming)
   - Sistem menerima input berupa file audio atau rekaman suara (humming).
   - Menggunakan ekstraksi fitur (distribusi nada, interval nada, dan hubungan dengan nada pertama) dan Cosine Similarity untuk menemukan lagu yang sesuai dari dataset.
   
#### 2. Image Retrieval (Album Picture Finder)
   - Menggunakan Principal Component Analysis (PCA) untuk membandingkan gambar album yang terkait dengan dataset lagu.
   - Input berupa gambar album, dan sistem akan mencocokkan gambar yang mirip dalam dataset menggunakan jarak Euclidean.
     
## 📋 Cara Penggunaan
#### 1. Unggah Dataset
   - **Website Lokal**: Anda dapat mengunggah dataset audio dan gambar album melalui website lokal setelah meng-[clone repository](#clone-repository) ini.
   - **Versi Preview**: Pada versi preview di https://algeo02-23054.vercel.app/, pengunggahan dataset tidak didukung. Sistem akan menggunakan dataset default.

#### 2. Lakukan Query
   - Pilih mode pencarian:
      - Audio Query by Humming: Input file audio (midi).
      - Image Query with PCA: Input gambar album.
   
#### 3. Lihat Hasil
   - Hasil pencarian ditampilkan dengan persentase kemiripan dan waktu eksekusi.


## 🛠️ Setup Instructions
### Clone Repository
1. Clone repository melalui bash
   ```sh
    git clone https://github.com/albertchriss/Algeo02-23054.git
    ```
   
2. Ubah direktori ke `Algeo02-23054`
   ```sh
    cd Algeo02-23054
    ```

### Backend
  1. Ubah direktori ke `backend`
     ```sh
     cd src/backend
     ```
     
  2. Buat and aktivasi virtual environment
     ```sh
     python -m venv venv
     .\venv\Scripts\Activate
     ```
     
  3. Install backend dependencies
     ```sh
     pip install -r requirements.txt
     ```
### Frontend
  1. Ubah direktori ke `frontend`
     ```sh
     cd src/frontend
     ```
     
  2. Install frontend dependencies
     ```sh
     npm install
     ```

## Cara menjalankan program
1. Ubah direktori ke `frontend`
   ```sh
   cd src/frontend
   ```
     
2. Jalankan program secara lokal
   ```sh
   npm run dev
   ```
   
3. Buka program pada web browser
   ```sh
   http://localhost:3000/
   ```

## Anggota Kelompok Micin Kriuk
| NIM      | Nama                                 |
| -------- | ------------------------------------ |
| 13523054 | Aloisius Adrian Stevan Gunawan       |
| 13523077 | Albertus Christian Poandy            |
| 13523102 | Michael Alexander Angkawijaya        | 

