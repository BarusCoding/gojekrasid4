
# Selamat Datang Di Projek Rasid 
Ini merupakan projek pengembang aplikasi mirip gojek 

## Cara Deploy ke GitHub Pages

1. Buat repository di GitHub
2. Push kode ke repository tersebut
3. Install gh-pages: `npm install --save-dev gh-pages`
4. Tambahkan script berikut di package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build -- --env GITHUB_PAGES=true",
     "deploy": "gh-pages -d dist"
   }
   ```
5. Jalankan perintah: `npm run deploy`
6. Aktifkan GitHub Pages di settings repository, pilih branch gh-pages
