# I Love You Sayang

Website animasi: hujan karakter pink, hitung mundur 3-2-1, tulisan "You Are My Love",
lalu hati dari partikel yang berdetak dengan tulisan atau foto di tengahnya.

## Isi folder
- `index.html` : halaman utama
- `style.css`  : tampilan
- `script.js`  : animasi dan pengaturan (bagian `CONFIG` di paling atas)
- `assets/`    : tempat menaruh foto

## Mengganti teks atau foto
Buka `script.js`, ubah bagian `CONFIG`:
- `words` dan `countdown` : kata dan angka yang muncul
- `message` : tulisan di tengah hati (bagian tengahnya, ♥, berwarna merah)
- `photo` : isi dengan path foto, misalnya `"assets/foto.jpg"`. Jika diisi, foto tampil
  di dalam hati dan menggantikan tulisan.
- `showPicker` : ubah ke `false` untuk menghapus tombol "Pilih foto" di versi yang dibagikan.

Taruh fotonya di folder `assets/` dengan nama yang sama seperti di `photo`.

## Menjalankan di komputer
Klik dua kali `index.html`, atau jalankan `python -m http.server` di folder ini lalu buka
http://localhost:8000.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub (misalnya `love-website`).
2. Upload semua isi folder ini ke repository tersebut (file harus ada di root, bukan di dalam subfolder).
3. Buka **Settings > Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
5. Tunggu 1-2 menit. Alamatnya: `https://USERNAME.github.io/love-website/`
