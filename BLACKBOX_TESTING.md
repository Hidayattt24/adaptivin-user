# Blackbox Testing - Website Adaptivin

## Deskripsi Aplikasi
Adaptivin adalah platform pembelajaran matematika adaptif untuk siswa SD kelas 4-6 dengan sistem pembelajaran yang disesuaikan dengan kemampuan masing-masing siswa. Platform ini memiliki tiga role utama: Admin, Guru, dan Siswa.

**Role dalam Sistem:**
- **Admin**: Mengelola sekolah, kelas, akun guru, dan akun siswa
- **Guru**: Mengelola kelas, materi pembelajaran, bank soal, kuis, dan melihat laporan siswa
- **Siswa**: Mengakses materi pembelajaran, mengerjakan kuis adaptif, dan melihat progress belajar

---

## Test Scenario

| ID | Skenario | Ekspektasi |
|---|---|---|
| **TS-01** | Login Siswa dengan kredensial valid | Siswa berhasil login dan diarahkan ke halaman onboarding |
| **TS-02** | Login Siswa dengan kredensial invalid | Sistem menampilkan pesan error dan login gagal |
| **TS-03** | Login Guru dengan kredensial valid | Guru berhasil login dan diarahkan ke dashboard guru |
| **TS-04** | Login Guru dengan kredensial invalid | Sistem menampilkan pesan error dan login gagal |
| **TS-05** | Pemilihan peran (Pick Role) | User dapat memilih antara role Siswa atau Guru |
| **TS-06** | Onboarding Siswa pertama kali | Siswa melihat tutorial onboarding saat pertama login |
| **TS-07** | Pemilihan karakter siswa | Siswa dapat memilih dan menyimpan karakter avatar |
| **TS-08** | Melihat beranda siswa | Sistem menampilkan daftar materi dan progress belajar |
| **TS-09** | Mengakses materi pembelajaran | Siswa dapat membuka dan membaca materi pembelajaran |
| **TS-10** | Mengerjakan kuis adaptif | Siswa dapat mengerjakan kuis dengan soal yang disesuaikan kemampuan |
| **TS-11** | Melihat hasil kuis | Sistem menampilkan skor dan pembahasan setelah kuis selesai |
| **TS-12** | Mengubah profil siswa (ganti nama) | Siswa berhasil mengubah nama profil |
| **TS-13** | Mengubah password siswa | Siswa berhasil mengubah password dengan password baru |
| **TS-14** | Melihat dashboard guru | Guru melihat statistik kelas dan performa siswa |
| **TS-15** | Melihat daftar siswa dalam kelas | Guru dapat melihat daftar siswa yang terdaftar di kelas |
| **TS-16** | Menambah materi pembelajaran | Guru berhasil menambahkan materi baru ke dalam kelas |
| **TS-16** | Mengedit materi pembelajaran | Guru berhasil mengubah konten materi yang sudah ada |
| **TS-17** | Menghapus materi pembelajaran | Guru berhasil menghapus materi dari kelas |
| **TS-18** | Menambah soal ke bank soal | Guru berhasil menambahkan soal baru ke bank soal |
| **TS-19** | Mengedit soal di bank soal | Guru berhasil mengubah soal yang sudah ada |
| **TS-20** | Menghapus soal dari bank soal | Guru berhasil menghapus soal dari bank soal |
| **TS-21** | Membuat kuis dari bank soal | Guru berhasil membuat kuis dengan memilih soal dari bank soal |
| **TS-22** | Melihat laporan performa siswa | Guru dapat melihat detail performa dan progress siswa |
| **TS-23** | Melihat analisis AI untuk siswa | Guru dapat melihat rekomendasi dari AI untuk pembelajaran siswa |
| **TS-24** | Melihat grafik perkembangan kelas | Guru dapat melihat visualisasi progress kelas |
| **TS-25** | Logout dari sistem | User berhasil logout dan kembali ke halaman login |
| **TS-27** | Akses halaman tanpa autentikasi | Sistem redirect ke halaman login jika belum login |
| **TS-28** | Toggle password visibility | User dapat melihat/menyembunyikan password saat input |
| **TS-29** | Login Admin dengan kredensial valid | Admin berhasil login dan diarahkan ke dashboard admin |
| **TS-30** | Login Admin dengan kredensial invalid | Sistem menampilkan pesan error dan login gagal |
| **TS-31** | Melihat dashboard admin | Admin melihat statistik sekolah, guru, dan siswa |
| **TS-32** | Menambah sekolah baru | Admin berhasil menambahkan sekolah dengan informasi lengkap |
| **TS-33** | Mengedit data sekolah | Admin berhasil mengubah informasi sekolah yang sudah ada |
| **TS-34** | Menghapus sekolah | Admin berhasil menghapus sekolah dari sistem |
| **TS-35** | Melihat daftar sekolah | Admin dapat melihat daftar semua sekolah yang terdaftar |
| **TS-36** | Menambah kelas baru | Admin berhasil menambahkan kelas dengan mengassign ke sekolah |
| **TS-37** | Mengedit data kelas | Admin berhasil mengubah informasi kelas |
| **TS-38** | Menghapus kelas | Admin berhasil menghapus kelas dari sistem |
| **TS-39** | Melihat daftar kelas | Admin dapat melihat daftar semua kelas |
| **TS-40** | Menambah akun guru | Admin berhasil membuat akun guru baru dan assign ke sekolah |
| **TS-41** | Mengedit akun guru | Admin berhasil mengubah informasi akun guru |
| **TS-42** | Menghapus akun guru | Admin berhasil menghapus akun guru dari sistem |
| **TS-43** | Melihat daftar guru | Admin dapat melihat daftar semua guru |
| **TS-44** | Menambah akun siswa | Admin berhasil membuat akun siswa baru dan assign ke kelas |
| **TS-45** | Mengedit akun siswa | Admin berhasil mengubah informasi akun siswa |
| **TS-46** | Menghapus akun siswa | Admin berhasil menghapus akun siswa dari sistem |
| **TS-47** | Melihat daftar siswa | Admin dapat melihat daftar semua siswa |
| **TS-48** | Import data bulk (guru/siswa) | Admin dapat mengimport data dalam jumlah banyak via Excel/CSV |

---

## Test Case

### Modul 1: Autentikasi

#### TC-01: Login Siswa dengan Kredensial Valid
- **Test Scenario ID**: TS-01
- **Deskripsi**: Memverifikasi siswa dapat login dengan username/email dan password yang benar
- **Precondition**: 
  - User berada di halaman login siswa
  - User memiliki akun siswa yang terdaftar
- **Test Steps**:
  1. Buka halaman `/login/siswa`
  2. Input username/email yang valid di field "Username atau Email"
  3. Input password yang valid di field "Password"
  4. Klik tombol "Masuk"
- **Test Data**:
  - Email: `siswa@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert dengan pesan "Login Berhasil!"
  - User diarahkan ke halaman `/siswa/onboarding`
  - Token autentikasi tersimpan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-02: Login Siswa dengan Email Invalid
- **Test Scenario ID**: TS-02
- **Deskripsi**: Memverifikasi sistem menolak login dengan email yang salah
- **Precondition**: User berada di halaman login siswa
- **Test Steps**:
  1. Buka halaman `/login/siswa`
  2. Input email yang tidak terdaftar: `emailsalah@test.com`
  3. Input password apapun
  4. Klik tombol "Masuk"
- **Test Data**:
  - Email: `emailsalah@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert dengan pesan "Login Gagal!"
  - User tetap di halaman login
  - Tidak ada redirect
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-03: Login Siswa dengan Password Invalid
- **Test Scenario ID**: TS-02
- **Deskripsi**: Memverifikasi sistem menolak login dengan password yang salah
- **Precondition**: User berada di halaman login siswa
- **Test Steps**:
  1. Buka halaman `/login/siswa`
  2. Input email yang valid
  3. Input password yang salah: `passwordsalah123`
  4. Klik tombol "Masuk"
- **Test Data**:
  - Email: `siswa@test.com`
  - Password: `passwordsalah123`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert error
  - User tetap di halaman login
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-04: Login Siswa dengan Field Kosong
- **Test Scenario ID**: TS-02
- **Deskripsi**: Memverifikasi validasi form saat field kosong
- **Precondition**: User berada di halaman login siswa
- **Test Steps**:
  1. Buka halaman `/login/siswa`
  2. Biarkan field email kosong
  3. Biarkan field password kosong
  4. Klik tombol "Masuk"
- **Test Data**: (kosong)
- **Expected Result**: 
  - Browser menampilkan validasi HTML5 "Please fill out this field"
  - Form tidak ter-submit
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-05: Login Guru dengan Kredensial Valid
- **Test Scenario ID**: TS-03
- **Deskripsi**: Memverifikasi guru dapat login dengan kredensial yang benar
- **Precondition**: 
  - User berada di halaman login guru
  - User memiliki akun guru yang terdaftar
- **Test Steps**:
  1. Buka halaman `/login/guru`
  2. Input username/email yang valid
  3. Input password yang valid
  4. Klik tombol "Masuk"
- **Test Data**:
  - Email: `guru@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert "Login Berhasil!"
  - User diarahkan ke halaman `/guru/dashboard`
  - Token autentikasi tersimpan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-06: Login Guru dengan Kredensial Invalid
- **Test Scenario ID**: TS-04
- **Deskripsi**: Memverifikasi sistem menolak login guru dengan kredensial salah
- **Precondition**: User berada di halaman login guru
- **Test Steps**:
  1. Buka halaman `/login/guru`
  2. Input email atau password yang salah
  3. Klik tombol "Masuk"
- **Test Data**:
  - Email: `gurusalah@test.com`
  - Password: `passwordsalah`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert error
  - User tetap di halaman login
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-07: Toggle Password Visibility
- **Test Scenario ID**: TS-30
- **Deskripsi**: Memverifikasi fungsi show/hide password
- **Precondition**: User berada di halaman login
- **Test Steps**:
  1. Buka halaman login (siswa/guru)
  2. Input password di field password
  3. Klik icon mata di sebelah kanan field password
  4. Verifikasi password terlihat dalam plain text
  5. Klik icon mata lagi
  6. Verifikasi password kembali tersembunyi
- **Test Data**: Password: `test123`
- **Expected Result**: 
  - Password berganti dari type="password" ke type="text" dan sebaliknya
  - Icon mata berganti antara "eye" dan "eye-slash"
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-08: Checkbox "Ingat Saya"
- **Test Scenario ID**: TS-01
- **Deskripsi**: Memverifikasi fungsi checkbox "Ingat saya"
- **Precondition**: User berada di halaman login
- **Test Steps**:
  1. Buka halaman login
  2. Input kredensial valid
  3. Centang checkbox "Ingat saya"
  4. Klik tombol "Masuk"
  5. Logout dari sistem
  6. Kembali ke halaman login
- **Test Data**: 
  - Email: `siswa@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Session tetap tersimpan (jika diimplementasikan)
  - User dapat auto-login atau kredensial tersimpan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-09: Logout dari Sistem
- **Test Scenario ID**: TS-28
- **Deskripsi**: Memverifikasi user dapat logout dengan sukses
- **Precondition**: User sudah login (siswa/guru)
- **Test Steps**:
  1. Login ke sistem
  2. Navigasi ke menu profil/logout
  3. Klik tombol Logout
  4. Konfirmasi logout (jika ada)
- **Test Data**: -
- **Expected Result**: 
  - User ter-logout dari sistem
  - Token autentikasi terhapus
  - User diarahkan ke halaman login
  - User tidak bisa akses halaman protected tanpa login ulang
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 2: Pick Role & Navigation

#### TC-10: Memilih Role Siswa
- **Test Scenario ID**: TS-05
- **Deskripsi**: Memverifikasi user dapat memilih role siswa
- **Precondition**: User berada di halaman `/pick-role`
- **Test Steps**:
  1. Buka halaman `/pick-role`
  2. Verifikasi tampilan 2 card role (Guru dan Siswa)
  3. Klik pada card "Siswa"
- **Test Data**: -
- **Expected Result**: 
  - User diarahkan ke halaman `/login/siswa`
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-11: Memilih Role Guru
- **Test Scenario ID**: TS-05
- **Deskripsi**: Memverifikasi user dapat memilih role guru
- **Precondition**: User berada di halaman `/pick-role`
- **Test Steps**:
  1. Buka halaman `/pick-role`
  2. Klik pada card "Guru"
- **Test Data**: -
- **Expected Result**: 
  - User diarahkan ke halaman `/login/guru`
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-12: Swipe Card Role (Mobile)
- **Test Scenario ID**: TS-05
- **Deskripsi**: Memverifikasi swipe gesture pada mobile
- **Precondition**: 
  - User berada di halaman `/pick-role`
  - Menggunakan device mobile atau browser mobile mode
- **Test Steps**:
  1. Buka halaman `/pick-role` di mobile
  2. Swipe card ke kiri
  3. Verifikasi card berganti
  4. Swipe card ke kanan
  5. Verifikasi card kembali
- **Test Data**: -
- **Expected Result**: 
  - Card dapat di-swipe dengan gesture
  - Animasi smooth
  - Dot indicator berubah sesuai card aktif
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-13: Kembali ke Pemilihan Peran dari Login
- **Test Scenario ID**: TS-05
- **Deskripsi**: Memverifikasi link kembali ke pick role
- **Precondition**: User berada di halaman login siswa/guru
- **Test Steps**:
  1. Buka halaman login (siswa/guru)
  2. Klik link "Kembali ke pemilihan peran"
- **Test Data**: -
- **Expected Result**: 
  - User diarahkan kembali ke halaman `/pick-role`
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-14: Akses Protected Page Tanpa Login
- **Test Scenario ID**: TS-29
- **Deskripsi**: Memverifikasi middleware autentikasi
- **Precondition**: User belum login
- **Test Steps**:
  1. Pastikan user belum login (clear cookies/session)
  2. Akses URL protected langsung: `/siswa/beranda` atau `/guru/dashboard`
- **Test Data**: -
- **Expected Result**: 
  - User di-redirect ke halaman login
  - Middleware mencegah akses tanpa autentikasi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 3: Fitur Siswa

#### TC-15: Onboarding Siswa Pertama Kali
- **Test Scenario ID**: TS-06
- **Deskripsi**: Memverifikasi tampilan onboarding untuk siswa baru
- **Precondition**: 
  - Siswa login untuk pertama kali
  - Cookie onboarding belum di-set
- **Test Steps**:
  1. Login sebagai siswa yang baru
  2. Verifikasi halaman onboarding muncul
  3. Navigasi melalui step onboarding
  4. Selesaikan onboarding
- **Test Data**: 
  - Email: `siswabaru@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Halaman onboarding ditampilkan
  - User dapat navigasi antar step
  - Setelah selesai, cookie onboarding ter-set
  - User diarahkan ke halaman pilih karakter atau beranda
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-16: Skip Onboarding untuk Siswa yang Sudah Pernah Login
- **Test Scenario ID**: TS-06
- **Deskripsi**: Memverifikasi siswa tidak melihat onboarding lagi
- **Precondition**: 
  - Siswa sudah pernah login dan menyelesaikan onboarding
  - Cookie onboarding sudah di-set
- **Test Steps**:
  1. Login sebagai siswa yang sudah pernah login
  2. Verifikasi tidak diarahkan ke onboarding
- **Test Data**: 
  - Email: `siswa@test.com`
  - Password: `password123`
- **Expected Result**: 
  - User langsung diarahkan ke beranda siswa
  - Halaman onboarding tidak muncul
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-17: Memilih Karakter Avatar
- **Test Scenario ID**: TS-07
- **Deskripsi**: Memverifikasi siswa dapat memilih karakter avatar
- **Precondition**: 
  - Siswa sudah login
  - Berada di halaman pilih karakter
- **Test Steps**:
  1. Buka halaman `/siswa/pilih-karakter`
  2. Verifikasi tampilan pilihan karakter (7 karakter)
  3. Klik salah satu karakter
  4. Klik tombol "Simpan" atau "Pilih"
- **Test Data**: Pilih karakter: "Pak Bubu"
- **Expected Result**: 
  - Karakter terpilih dengan visual feedback
  - Karakter tersimpan ke database
  - User diarahkan ke beranda
  - Avatar karakter muncul di profil siswa
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-18: Melihat Beranda Siswa
- **Test Scenario ID**: TS-08
- **Deskripsi**: Memverifikasi tampilan beranda siswa
- **Precondition**: Siswa sudah login
- **Test Steps**:
  1. Login sebagai siswa
  2. Navigasi ke halaman `/siswa/beranda`
  3. Verifikasi konten beranda
- **Test Data**: -
- **Expected Result**: 
  - Beranda menampilkan:
    - Informasi profil siswa
    - Daftar kelas yang diikuti
    - Card materi pembelajaran
    - Progress belajar
    - Navigasi ke fitur lain
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-19: Mengakses Daftar Materi Kelas
- **Test Scenario ID**: TS-09
- **Deskripsi**: Memverifikasi siswa dapat melihat daftar materi
- **Precondition**: 
  - Siswa sudah login
  - Siswa terdaftar di kelas yang memiliki materi
- **Test Steps**:
  1. Login sebagai siswa
  2. Klik pada salah satu kelas di beranda
  3. Verifikasi tampilan daftar materi
- **Test Data**: Kelas ID: `kelas-4a`
- **Expected Result**: 
  - Sistem menampilkan daftar materi dalam kelas
  - Setiap materi menampilkan:
    - Judul materi
    - Deskripsi singkat
    - Status (sudah/belum dipelajari)
    - Progress
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-20: Membuka Materi Pembelajaran
- **Test Scenario ID**: TS-09
- **Deskripsi**: Memverifikasi siswa dapat membuka dan membaca materi
- **Precondition**: 
  - Siswa sudah login
  - Berada di halaman daftar materi
- **Test Steps**:
  1. Klik pada salah satu materi
  2. Verifikasi halaman materi terbuka
  3. Scroll dan baca konten materi
- **Test Data**: Materi ID: `materi-001`
- **Expected Result**: 
  - Halaman materi terbuka: `/siswa/materi/[classId]/[materiId]`
  - Konten materi ditampilkan dengan format yang sesuai
  - Navigasi antar sub-materi tersedia (jika ada)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-21: Navigasi Antar Sub-Materi
- **Test Scenario ID**: TS-09
- **Deskripsi**: Memverifikasi navigasi antar sub-materi
- **Precondition**: 
  - Siswa membuka materi yang memiliki sub-materi
  - Berada di halaman sub-materi
- **Test Steps**:
  1. Buka materi yang memiliki multiple sub-materi
  2. Klik tombol "Next" atau "Lanjut"
  3. Verifikasi pindah ke sub-materi berikutnya
  4. Klik tombol "Previous" atau "Kembali"
  5. Verifikasi kembali ke sub-materi sebelumnya
- **Test Data**: -
- **Expected Result**: 
  - Navigasi antar sub-materi berfungsi
  - URL berubah: `/siswa/materi/[classId]/[materiId]/[subMateriId]`
  - Progress materi ter-update
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-22: Memulai Kuis Adaptif
- **Test Scenario ID**: TS-10
- **Deskripsi**: Memverifikasi siswa dapat memulai kuis
- **Precondition**: 
  - Siswa sudah login
  - Materi memiliki kuis
  - Siswa berada di halaman materi
- **Test Steps**:
  1. Selesaikan membaca materi
  2. Klik tombol "Mulai Kuis" atau "Lanjut ke Kuis"
  3. Verifikasi halaman kuis terbuka
- **Test Data**: -
- **Expected Result**: 
  - Halaman kuis terbuka: `/siswa/materi/[classId]/[materiId]/kuis`
  - Soal pertama ditampilkan
  - Timer mulai (jika ada)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-23: Menjawab Soal Kuis dengan Benar
- **Test Scenario ID**: TS-10
- **Deskripsi**: Memverifikasi sistem mencatat jawaban benar
- **Precondition**: Siswa berada di halaman kuis
- **Test Steps**:
  1. Baca soal yang ditampilkan
  2. Pilih jawaban yang benar
  3. Klik tombol "Submit" atau "Lanjut"
- **Test Data**: Pilih jawaban benar untuk soal 1
- **Expected Result**: 
  - Jawaban tercatat di sistem
  - Visual feedback jawaban benar (jika real-time)
  - Pindah ke soal berikutnya
  - Skor/progress ter-update
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-24: Menjawab Soal Kuis dengan Salah
- **Test Scenario ID**: TS-10
- **Deskripsi**: Memverifikasi sistem mencatat jawaban salah
- **Precondition**: Siswa berada di halaman kuis
- **Test Steps**:
  1. Baca soal yang ditampilkan
  2. Pilih jawaban yang salah
  3. Klik tombol "Submit" atau "Lanjut"
- **Test Data**: Pilih jawaban salah untuk soal
- **Expected Result**: 
  - Jawaban tercatat di sistem
  - Visual feedback jawaban salah (jika real-time)
  - Sistem adaptif: soal berikutnya disesuaikan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-25: Sistem Adaptif Kuis - Soal Lebih Mudah
- **Test Scenario ID**: TS-10
- **Deskripsi**: Memverifikasi sistem memberikan soal lebih mudah setelah jawaban salah
- **Precondition**: 
  - Siswa sedang mengerjakan kuis
  - Siswa menjawab beberapa soal salah berturut-turut
- **Test Steps**:
  1. Jawab 2-3 soal dengan jawaban salah
  2. Perhatikan tingkat kesulitan soal berikutnya
- **Test Data**: -
- **Expected Result**: 
  - Sistem memberikan soal dengan tingkat kesulitan lebih rendah
  - Algoritma adaptif bekerja
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-26: Sistem Adaptif Kuis - Soal Lebih Sulit
- **Test Scenario ID**: TS-10
- **Deskripsi**: Memverifikasi sistem memberikan soal lebih sulit setelah jawaban benar
- **Precondition**: 
  - Siswa sedang mengerjakan kuis
  - Siswa menjawab beberapa soal benar berturut-turut
- **Test Steps**:
  1. Jawab 2-3 soal dengan jawaban benar
  2. Perhatikan tingkat kesulitan soal berikutnya
- **Test Data**: -
- **Expected Result**: 
  - Sistem memberikan soal dengan tingkat kesulitan lebih tinggi
  - Algoritma adaptif bekerja
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-27: Menyelesaikan Kuis
- **Test Scenario ID**: TS-10, TS-11
- **Deskripsi**: Memverifikasi siswa dapat menyelesaikan kuis hingga akhir
- **Precondition**: Siswa sedang mengerjakan kuis
- **Test Steps**:
  1. Jawab semua soal kuis hingga selesai
  2. Klik tombol "Selesai" pada soal terakhir
- **Test Data**: -
- **Expected Result**: 
  - Kuis berakhir
  - Sistem menyimpan semua jawaban
  - User diarahkan ke halaman hasil kuis
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-28: Melihat Hasil Kuis
- **Test Scenario ID**: TS-11
- **Deskripsi**: Memverifikasi tampilan hasil kuis
- **Precondition**: Siswa baru saja menyelesaikan kuis
- **Test Steps**:
  1. Selesaikan kuis
  2. Verifikasi halaman hasil kuis
- **Test Data**: -
- **Expected Result**: 
  - Halaman hasil terbuka: `/siswa/materi/[classId]/[materiId]/kuis/hasil`
  - Menampilkan:
    - Skor total
    - Jumlah benar/salah
    - Pembahasan soal
    - Rekomendasi pembelajaran
    - Tombol kembali ke materi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-29: Melihat Profil Siswa
- **Test Scenario ID**: TS-08
- **Deskripsi**: Memverifikasi tampilan profil siswa
- **Precondition**: Siswa sudah login
- **Test Steps**:
  1. Login sebagai siswa
  2. Navigasi ke menu Profil
  3. Buka halaman `/siswa/profil`
- **Test Data**: -
- **Expected Result**: 
  - Halaman profil menampilkan:
    - Avatar/karakter siswa
    - Nama siswa
    - Email/username
    - Kelas
    - Statistik belajar
    - Menu pengaturan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-30: Mengubah Nama Profil Siswa
- **Test Scenario ID**: TS-12
- **Deskripsi**: Memverifikasi siswa dapat mengubah nama profil
- **Precondition**: Siswa sudah login dan berada di halaman profil
- **Test Steps**:
  1. Buka halaman `/siswa/profil`
  2. Klik tombol "Ganti Nama" atau link edit nama
  3. Input nama baru
  4. Klik tombol "Simpan"
- **Test Data**: Nama baru: `Siswa Test Baru`
- **Expected Result**: 
  - Nama ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Nama baru muncul di profil
  - Nama baru muncul di seluruh aplikasi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-31: Mengubah Password Siswa dengan Password Lama yang Benar
- **Test Scenario ID**: TS-13
- **Deskripsi**: Memverifikasi siswa dapat mengubah password
- **Precondition**: Siswa sudah login dan berada di halaman profil
- **Test Steps**:
  1. Buka halaman `/siswa/profil/ganti-password`
  2. Input password lama yang benar
  3. Input password baru
  4. Konfirmasi password baru
  5. Klik tombol "Simpan"
- **Test Data**:
  - Password Lama: `password123`
  - Password Baru: `newpassword123`
  - Konfirmasi: `newpassword123`
- **Expected Result**: 
  - Password ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - User dapat login dengan password baru
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-32: Mengubah Password dengan Password Lama yang Salah
- **Test Scenario ID**: TS-13
- **Deskripsi**: Memverifikasi validasi password lama
- **Precondition**: Siswa berada di halaman ganti password
- **Test Steps**:
  1. Buka halaman `/siswa/profil/ganti-password`
  2. Input password lama yang SALAH
  3. Input password baru
  4. Konfirmasi password baru
  5. Klik tombol "Simpan"
- **Test Data**:
  - Password Lama: `passwordsalah`
  - Password Baru: `newpassword123`
  - Konfirmasi: `newpassword123`
- **Expected Result**: 
  - Sistem menampilkan error "Password lama tidak sesuai"
  - Password tidak ter-update
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-33: Mengubah Password dengan Konfirmasi Tidak Cocok
- **Test Scenario ID**: TS-13
- **Deskripsi**: Memverifikasi validasi konfirmasi password
- **Precondition**: Siswa berada di halaman ganti password
- **Test Steps**:
  1. Buka halaman ganti password
  2. Input password lama yang benar
  3. Input password baru
  4. Input konfirmasi password yang BERBEDA
  5. Klik tombol "Simpan"
- **Test Data**:
  - Password Lama: `password123`
  - Password Baru: `newpassword123`
  - Konfirmasi: `differentpassword`
- **Expected Result**: 
  - Sistem menampilkan error "Password tidak cocok"
  - Password tidak ter-update
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 4: Fitur Guru - Dashboard

#### TC-34: Melihat Dashboard Guru
- **Test Scenario ID**: TS-14
- **Deskripsi**: Memverifikasi tampilan dashboard guru
- **Precondition**: Guru sudah login
- **Test Steps**:
  1. Login sebagai guru
  2. Verifikasi halaman `/guru/dashboard` terbuka
  3. Periksa semua elemen dashboard
- **Test Data**: 
  - Email: `guru@test.com`
  - Password: `password123`
- **Expected Result**: 
  - Dashboard menampilkan:
    - Profil guru
    - Total murid
    - Total soal
    - Chart performa kelas
    - Daftar kelas yang diajar
    - Statistik ringkasan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-35: Melihat Chart Performa di Dashboard
- **Test Scenario ID**: TS-14, TS-25
- **Deskripsi**: Memverifikasi chart performa ditampilkan dengan benar
- **Precondition**: 
  - Guru sudah login
  - Ada data performa siswa
- **Test Steps**:
  1. Login sebagai guru
  2. Buka dashboard
  3. Scroll ke bagian chart performa
  4. Verifikasi chart dapat dibaca
- **Test Data**: -
- **Expected Result**: 
  - Chart menampilkan visualisasi performa
  - Data akurat berdasarkan hasil kuis siswa
  - Interactive (hover, tooltip, dll)
  - Loading state saat fetch data
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 5: Fitur Guru - Management Kelas

#### TC-36: Melihat Daftar Kelas
- **Test Scenario ID**: TS-14
- **Deskripsi**: Memverifikasi guru dapat melihat daftar kelas yang diajar
- **Precondition**: Guru sudah login dan memiliki kelas
- **Test Steps**:
  1. Login sebagai guru
  2. Navigasi ke halaman kelas atau lihat di dashboard
- **Test Data**: -
- **Expected Result**: 
  - Daftar kelas ditampilkan dalam card
  - Setiap card menampilkan:
    - Nama kelas
    - Jumlah siswa
    - Jumlah materi
    - Progress
  - Card dapat diklik untuk detail
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-37: Membuka Detail Kelas
- **Test Scenario ID**: TS-15
- **Deskripsi**: Memverifikasi guru dapat membuka detail kelas
- **Precondition**: 
  - Guru sudah login
  - Kelas sudah dibuat
- **Test Steps**:
  1. Login sebagai guru
  2. Klik pada salah satu card kelas
- **Test Data**: Kelas ID: `kelas-4a`
- **Expected Result**: 
  - Halaman detail kelas terbuka: `/guru/kelas/[kelasId]`
  - Menampilkan:
    - Informasi kelas
    - Daftar siswa
    - Daftar materi
    - Menu navigasi kelas
    - Statistik kelas
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-38: Melihat Daftar Siswa dalam Kelas
- **Test Scenario ID**: TS-15
- **Deskripsi**: Memverifikasi daftar siswa dalam kelas
- **Precondition**: 
  - Guru berada di halaman detail kelas
  - Kelas memiliki siswa
- **Test Steps**:
  1. Buka detail kelas
  2. Navigasi ke tab/section "Siswa"
  3. Verifikasi daftar siswa
- **Test Data**: -
- **Expected Result**: 
  - Daftar siswa ditampilkan dalam tabel/card
  - Setiap siswa menampilkan:
    - Nama
    - Avatar/foto
    - Email/username
    - Progress belajar
    - Aksi (lihat detail)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-39: Melihat Detail Siswa Individual
- **Test Scenario ID**: TS-15, TS-22
- **Deskripsi**: Memverifikasi guru dapat melihat detail siswa
- **Precondition**: Guru berada di halaman daftar siswa
- **Test Steps**:
  1. Buka daftar siswa kelas
  2. Klik pada salah satu siswa
- **Test Data**: Siswa ID: `siswa-001`
- **Expected Result**: 
  - Halaman detail siswa terbuka: `/guru/kelas/[kelasId]/siswa/[siswaId]`
  - Menampilkan:
    - Profil siswa
    - Performa di setiap materi
    - Riwayat kuis
    - Progress belajar
    - Grafik perkembangan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 6: Fitur Guru - Management Materi

#### TC-40: Melihat Daftar Materi dalam Kelas
- **Test Scenario ID**: TS-16
- **Deskripsi**: Memverifikasi daftar materi dalam kelas
- **Precondition**: 
  - Guru berada di halaman detail kelas
  - Kelas memiliki materi
- **Test Steps**:
  1. Buka detail kelas
  2. Navigasi ke tab/section "Materi"
- **Test Data**: -
- **Expected Result**: 
  - Daftar materi ditampilkan
  - Setiap materi menampilkan:
    - Judul materi
    - Deskripsi
    - Jumlah sub-materi
    - Status publish
    - Aksi (edit, hapus, preview)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-41: Menambah Materi Baru
- **Test Scenario ID**: TS-16
- **Deskripsi**: Memverifikasi guru dapat menambah materi baru
- **Precondition**: Guru berada di halaman materi kelas
- **Test Steps**:
  1. Buka halaman materi kelas
  2. Klik tombol "Tambah Materi"
  3. Input informasi materi:
     - Judul
     - Deskripsi
     - Konten/isi materi
     - Tingkat kesulitan
  4. Klik tombol "Simpan"
- **Test Data**:
  - Judul: `Penjumlahan Bilangan Bulat`
  - Deskripsi: `Materi tentang penjumlahan bilangan bulat`
  - Konten: `[konten pembelajaran]`
- **Expected Result**: 
  - Materi tersimpan ke database
  - Sistem menampilkan konfirmasi berhasil
  - Materi muncul di daftar materi
  - Siswa dapat mengakses materi (jika published)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-42: Menambah Materi dengan Field Wajib Kosong
- **Test Scenario ID**: TS-16
- **Deskripsi**: Memverifikasi validasi form materi
- **Precondition**: Guru berada di form tambah materi
- **Test Steps**:
  1. Klik "Tambah Materi"
  2. Biarkan field judul kosong
  3. Klik "Simpan"
- **Test Data**: (field kosong)
- **Expected Result**: 
  - Sistem menampilkan error validasi
  - Materi tidak tersimpan
  - Focus ke field yang error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-43: Mengedit Materi yang Ada
- **Test Scenario ID**: TS-17
- **Deskripsi**: Memverifikasi guru dapat mengedit materi
- **Precondition**: Materi sudah ada dalam kelas
- **Test Steps**:
  1. Buka daftar materi
  2. Klik tombol "Edit" pada salah satu materi
  3. Ubah informasi materi (judul, konten, dll)
  4. Klik tombol "Simpan"
- **Test Data**: 
  - Judul baru: `Penjumlahan Bilangan Bulat - Updated`
- **Expected Result**: 
  - Materi ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Perubahan terlihat di daftar materi
  - Siswa melihat materi yang ter-update
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-44: Menghapus Materi
- **Test Scenario ID**: TS-18
- **Deskripsi**: Memverifikasi guru dapat menghapus materi
- **Precondition**: Materi sudah ada dalam kelas
- **Test Steps**:
  1. Buka daftar materi
  2. Klik tombol "Hapus" pada salah satu materi
  3. Konfirmasi penghapusan (jika ada dialog)
- **Test Data**: Materi ID: `materi-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi
  - Setelah konfirmasi, materi terhapus dari database
  - Materi hilang dari daftar
  - Siswa tidak dapat lagi mengakses materi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-45: Preview Materi
- **Test Scenario ID**: TS-17
- **Deskripsi**: Memverifikasi guru dapat preview materi sebelum publish
- **Precondition**: Materi sudah dibuat
- **Test Steps**:
  1. Buka daftar materi
  2. Klik tombol "Preview" pada materi
- **Test Data**: -
- **Expected Result**: 
  - Modal/halaman preview terbuka
  - Menampilkan materi seperti yang dilihat siswa
  - Ada opsi untuk close/kembali
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-46: Upload File/Gambar dalam Materi
- **Test Scenario ID**: TS-16, TS-17
- **Deskripsi**: Memverifikasi upload media dalam materi
- **Precondition**: Guru berada di form tambah/edit materi
- **Test Steps**:
  1. Buka form materi
  2. Klik area upload atau insert image
  3. Pilih file gambar dari device
  4. Upload file
  5. Verifikasi file ter-upload
  6. Simpan materi
- **Test Data**: Upload file: `contoh-soal.png`
- **Expected Result**: 
  - File ter-upload ke server/storage
  - Preview gambar muncul di editor
  - Gambar tersimpan dengan materi
  - Gambar dapat dilihat siswa
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 7: Fitur Guru - Management Soal

#### TC-47: Melihat Bank Soal
- **Test Scenario ID**: TS-19
- **Deskripsi**: Memverifikasi guru dapat melihat bank soal
- **Precondition**: Guru sudah login
- **Test Steps**:
  1. Login sebagai guru
  2. Navigasi ke menu "Bank Soal"
  3. Buka halaman `/guru/kelas/[kelasId]/soal/bank`
- **Test Data**: -
- **Expected Result**: 
  - Daftar soal ditampilkan
  - Setiap soal menampilkan:
    - Pertanyaan
    - Tingkat kesulitan
    - Materi terkait
    - Aksi (edit, hapus, preview)
  - Fitur search dan filter tersedia
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-48: Menambah Soal Baru ke Bank Soal
- **Test Scenario ID**: TS-19
- **Deskripsi**: Memverifikasi guru dapat menambah soal baru
- **Precondition**: Guru berada di halaman bank soal
- **Test Steps**:
  1. Klik tombol "Tambah Soal"
  2. Input informasi soal:
     - Pertanyaan
     - Pilihan jawaban (A, B, C, D)
     - Jawaban benar
     - Pembahasan
     - Tingkat kesulitan
     - Materi terkait
  3. Klik tombol "Simpan"
- **Test Data**:
  - Pertanyaan: `2 + 2 = ?`
  - Pilihan: A:3, B:4, C:5, D:6
  - Jawaban: `B`
  - Tingkat: `Mudah`
- **Expected Result**: 
  - Soal tersimpan ke database
  - Sistem menampilkan konfirmasi berhasil
  - Soal muncul di bank soal
  - Soal dapat digunakan untuk kuis
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-49: Menambah Soal dengan Data Tidak Lengkap
- **Test Scenario ID**: TS-19
- **Deskripsi**: Memverifikasi validasi form tambah soal
- **Precondition**: Guru berada di form tambah soal
- **Test Steps**:
  1. Klik "Tambah Soal"
  2. Input pertanyaan saja
  3. Biarkan pilihan jawaban kosong
  4. Klik "Simpan"
- **Test Data**: 
  - Pertanyaan: `Berapa hasil 5 + 3?`
  - Pilihan: (kosong)
- **Expected Result**: 
  - Sistem menampilkan error validasi
  - Soal tidak tersimpan
  - Pesan error menunjukkan field yang wajib diisi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-50: Mengedit Soal di Bank Soal
- **Test Scenario ID**: TS-20
- **Deskripsi**: Memverifikasi guru dapat mengedit soal
- **Precondition**: Soal sudah ada di bank soal
- **Test Steps**:
  1. Buka bank soal
  2. Klik tombol "Edit" pada salah satu soal
  3. Ubah pertanyaan atau jawaban
  4. Klik "Simpan"
- **Test Data**: 
  - Pertanyaan baru: `Berapakah hasil dari 2 + 2?`
- **Expected Result**: 
  - Soal ter-update di database
  - Perubahan terlihat di bank soal
  - Kuis yang menggunakan soal ini ikut ter-update (atau ada warning)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-51: Menghapus Soal dari Bank Soal
- **Test Scenario ID**: TS-21
- **Deskripsi**: Memverifikasi guru dapat menghapus soal
- **Precondition**: Soal sudah ada di bank soal
- **Test Steps**:
  1. Buka bank soal
  2. Klik tombol "Hapus" pada salah satu soal
  3. Konfirmasi penghapusan
- **Test Data**: Soal ID: `soal-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi
  - Soal terhapus dari database
  - Soal hilang dari bank soal
  - Warning jika soal digunakan di kuis aktif
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-52: Search Soal di Bank Soal
- **Test Scenario ID**: TS-19
- **Deskripsi**: Memverifikasi fitur pencarian soal
- **Precondition**: 
  - Guru berada di halaman bank soal
  - Ada beberapa soal di bank soal
- **Test Steps**:
  1. Buka bank soal
  2. Input keyword di search box: `penjumlahan`
  3. Tekan Enter atau klik Search
- **Test Data**: Keyword: `penjumlahan`
- **Expected Result**: 
  - Sistem menampilkan soal yang mengandung keyword
  - Hasil search akurat dan relevan
  - Jumlah hasil ditampilkan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-53: Filter Soal Berdasarkan Tingkat Kesulitan
- **Test Scenario ID**: TS-19
- **Deskripsi**: Memverifikasi filter soal berdasarkan difficulty
- **Precondition**: Guru berada di halaman bank soal
- **Test Steps**:
  1. Buka bank soal
  2. Pilih filter tingkat kesulitan: `Mudah`
  3. Verifikasi hasil filter
- **Test Data**: Filter: `Mudah`
- **Expected Result**: 
  - Sistem menampilkan hanya soal dengan tingkat "Mudah"
  - Filter dapat di-clear/reset
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 8: Fitur Guru - Management Kuis

#### TC-54: Membuat Kuis dari Bank Soal
- **Test Scenario ID**: TS-22
- **Deskripsi**: Memverifikasi guru dapat membuat kuis
- **Precondition**: 
  - Guru berada di halaman materi
  - Bank soal memiliki soal
- **Test Steps**:
  1. Buka detail materi
  2. Klik "Kelola Kuis" atau "Tambah Kuis"
  3. Pilih soal dari bank soal
  4. Set konfigurasi kuis (jumlah soal, waktu, dll)
  5. Klik "Simpan" atau "Buat Kuis"
- **Test Data**:
  - Judul: `Kuis Penjumlahan 1`
  - Jumlah soal: `10`
  - Waktu: `30 menit`
- **Expected Result**: 
  - Kuis tersimpan dan terhubung dengan materi
  - Siswa dapat mengakses kuis
  - Soal teracak sesuai algoritma adaptif
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-55: Melihat Daftar Kuis
- **Test Scenario ID**: TS-22
- **Deskripsi**: Memverifikasi daftar kuis yang telah dibuat
- **Precondition**: Guru sudah membuat kuis
- **Test Steps**:
  1. Buka detail materi
  2. Navigasi ke section kuis
- **Test Data**: -
- **Expected Result**: 
  - Daftar kuis ditampilkan
  - Setiap kuis menampilkan:
    - Judul kuis
    - Jumlah soal
    - Jumlah siswa yang mengerjakan
    - Status aktif/non-aktif
    - Aksi (edit, hapus, lihat hasil)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-56: Mengaktifkan/Non-aktifkan Kuis
- **Test Scenario ID**: TS-22
- **Deskripsi**: Memverifikasi toggle status kuis
- **Precondition**: Kuis sudah dibuat
- **Test Steps**:
  1. Buka daftar kuis
  2. Toggle switch aktif/non-aktif pada salah satu kuis
  3. Verifikasi perubahan status
- **Test Data**: -
- **Expected Result**: 
  - Status kuis berubah
  - Kuis non-aktif tidak dapat diakses siswa
  - Kuis aktif dapat diakses siswa
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-57: Mengedit Kuis
- **Test Scenario ID**: TS-22
- **Deskripsi**: Memverifikasi guru dapat mengedit kuis
- **Precondition**: Kuis sudah dibuat
- **Test Steps**:
  1. Buka daftar kuis
  2. Klik "Edit" pada salah satu kuis
  3. Ubah soal atau konfigurasi kuis
  4. Klik "Simpan"
- **Test Data**: Tambah 2 soal baru
- **Expected Result**: 
  - Kuis ter-update
  - Perubahan berlaku untuk siswa yang belum mengerjakan
  - Ada warning jika ada siswa yang sudah mengerjakan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-58: Menghapus Kuis
- **Test Scenario ID**: TS-22
- **Deskripsi**: Memverifikasi guru dapat menghapus kuis
- **Precondition**: Kuis sudah dibuat
- **Test Steps**:
  1. Buka daftar kuis
  2. Klik "Hapus" pada salah satu kuis
  3. Konfirmasi penghapusan
- **Test Data**: -
- **Expected Result**: 
  - Kuis terhapus dari database
  - Siswa tidak dapat lagi mengakses kuis
  - Data hasil kuis siswa (jika ada) ter-handle dengan benar
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 9: Fitur Guru - Laporan & Analisis

#### TC-59: Melihat Laporan Performa Kelas
- **Test Scenario ID**: TS-23, TS-25
- **Deskripsi**: Memverifikasi laporan performa keseluruhan kelas
- **Precondition**: 
  - Guru berada di halaman kelas
  - Siswa sudah mengerjakan kuis
- **Test Steps**:
  1. Buka detail kelas
  2. Navigasi ke menu "Laporan"
  3. Buka halaman `/guru/kelas/[kelasId]/laporan`
- **Test Data**: -
- **Expected Result**: 
  - Halaman laporan menampilkan:
    - Grafik performa kelas
    - Rata-rata nilai
    - Distribusi nilai
    - Cluster siswa (cepat/sedang/lambat)
    - Rekomendasi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-60: Melihat Laporan Detail Siswa
- **Test Scenario ID**: TS-23
- **Deskripsi**: Memverifikasi laporan individual siswa
- **Precondition**: Siswa sudah mengerjakan beberapa kuis
- **Test Steps**:
  1. Buka daftar siswa
  2. Klik pada salah satu siswa
  3. Navigasi ke tab "Laporan"
- **Test Data**: Siswa ID: `siswa-001`
- **Expected Result**: 
  - Halaman laporan siswa menampilkan:
    - Grafik perkembangan
    - Riwayat nilai kuis
    - Materi yang sudah diselesaikan
    - Weak points
    - Strong points
    - Waktu belajar
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-61: Melihat Analisis AI untuk Siswa
- **Test Scenario ID**: TS-24
- **Deskripsi**: Memverifikasi fitur analisis AI
- **Precondition**: 
  - Siswa sudah mengerjakan kuis
  - Fitur AI aktif
- **Test Steps**:
  1. Buka laporan siswa individual
  2. Klik tombol "Lihat Analisis AI" atau section AI
  3. Verifikasi hasil analisis
- **Test Data**: -
- **Expected Result**: 
  - Modal/section analisis AI terbuka
  - Menampilkan:
    - Analisis pola belajar siswa
    - Rekomendasi pembelajaran
    - Area yang perlu diperkuat
    - Prediksi performa
  - Loading state saat generate analisis
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-62: Melihat Grafik Perkembangan Siswa
- **Test Scenario ID**: TS-23, TS-25
- **Deskripsi**: Memverifikasi visualisasi grafik perkembangan
- **Precondition**: Siswa memiliki riwayat nilai kuis
- **Test Steps**:
  1. Buka laporan siswa
  2. Klik "Lihat Grafik Perkembangan" atau modal
  3. Verifikasi grafik ditampilkan
- **Test Data**: -
- **Expected Result**: 
  - Modal/halaman grafik terbuka
  - Grafik menampilkan trend nilai over time
  - Interactive (hover, zoom, dll)
  - Dapat di-export (opsional)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-63: Melihat Cluster Siswa di Laporan Kelas
- **Test Scenario ID**: TS-23, TS-25
- **Deskripsi**: Memverifikasi pengelompokan siswa berdasarkan performa
- **Precondition**: 
  - Kelas memiliki beberapa siswa
  - Siswa sudah mengerjakan kuis
- **Test Steps**:
  1. Buka halaman laporan kelas
  2. Scroll ke section "Cluster Siswa" atau "Pengelompokan"
  3. Verifikasi pengelompokan siswa
- **Test Data**: -
- **Expected Result**: 
  - Siswa dikelompokkan menjadi:
    - Siswa cepat (advanced)
    - Siswa sedang (on-track)
    - Siswa lambat (needs support)
  - Setiap cluster menampilkan jumlah siswa
  - Dapat klik untuk detail siswa per cluster
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-64: Melihat Hasil Kuis Siswa
- **Test Scenario ID**: TS-23
- **Deskripsi**: Memverifikasi guru dapat melihat detail hasil kuis siswa
- **Precondition**: Siswa sudah mengerjakan kuis
- **Test Steps**:
  1. Buka laporan siswa
  2. Klik pada salah satu kuis yang sudah dikerjakan
  3. Verifikasi detail jawaban
- **Test Data**: -
- **Expected Result**: 
  - Modal/halaman detail hasil kuis terbuka
  - Menampilkan:
    - Daftar soal dan jawaban siswa
    - Jawaban benar/salah
    - Skor per soal
    - Total skor
    - Waktu pengerjaan
    - Pembahasan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-65: Export Laporan (Opsional)
- **Test Scenario ID**: TS-23
- **Deskripsi**: Memverifikasi fitur export laporan jika tersedia
- **Precondition**: Laporan sudah ditampilkan
- **Test Steps**:
  1. Buka halaman laporan
  2. Klik tombol "Export" atau "Download"
  3. Pilih format (PDF/Excel)
  4. Download file
- **Test Data**: Format: PDF
- **Expected Result**: 
  - File laporan ter-generate
  - File ter-download ke device
  - Format sesuai pilihan
  - Konten laporan lengkap
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 10: UI/UX & Responsiveness

#### TC-66: Responsiveness di Mobile (320px)
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi tampilan di layar mobile kecil
- **Precondition**: -
- **Test Steps**:
  1. Buka website di browser
  2. Resize window ke 320px width atau gunakan device emulator
  3. Navigasi ke berbagai halaman
  4. Verifikasi layout dan fungsi
- **Test Data**: Screen: 320px x 568px (iPhone SE)
- **Expected Result**: 
  - Layout responsive dan tidak broken
  - Text terbaca dengan jelas
  - Button dapat diklik dengan mudah
  - Tidak ada horizontal scroll
  - Navigation menu accessible
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-67: Responsiveness di Tablet (768px)
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi tampilan di layar tablet
- **Precondition**: -
- **Test Steps**:
  1. Buka website di browser
  2. Resize window ke 768px width atau gunakan tablet emulator
  3. Navigasi ke berbagai halaman
- **Test Data**: Screen: 768px x 1024px (iPad)
- **Expected Result**: 
  - Layout memanfaatkan space dengan baik
  - Tidak ada elemen yang overlapping
  - Navigation optimal untuk tablet
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-68: Responsiveness di Desktop (1920px)
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi tampilan di layar desktop besar
- **Precondition**: -
- **Test Steps**:
  1. Buka website di desktop browser
  2. Full screen mode (1920px width)
  3. Navigasi ke berbagai halaman
- **Test Data**: Screen: 1920px x 1080px
- **Expected Result**: 
  - Layout optimal untuk layar besar
  - Konten tidak terlalu stretched
  - Max-width container diterapkan
  - Grid layout terlihat baik
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-69: Loading State & Skeleton
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi loading state saat fetch data
- **Precondition**: -
- **Test Steps**:
  1. Buka halaman yang fetch data dari API (dashboard, beranda, dll)
  2. Perhatikan loading state sebelum data muncul
  3. Gunakan throttling network untuk simulasi slow connection
- **Test Data**: Network: Slow 3G
- **Expected Result**: 
  - Skeleton/loading placeholder muncul
  - Tidak ada blank screen
  - Smooth transition dari loading ke data
  - Loading spinner/indicator jelas terlihat
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-70: Error State & Error Handling
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi penanganan error
- **Precondition**: -
- **Test Steps**:
  1. Simulasikan error (matikan backend, block API, dll)
  2. Coba fetch data atau submit form
  3. Verifikasi error message
- **Test Data**: -
- **Expected Result**: 
  - Error message user-friendly ditampilkan
  - Tidak ada error log di console (untuk production)
  - Ada opsi retry atau kembali
  - Tidak crash/white screen
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-71: Empty State
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi tampilan saat data kosong
- **Precondition**: Data list/table kosong
- **Test Steps**:
  1. Login sebagai user baru atau hapus semua data
  2. Buka halaman list (kelas, materi, soal, dll)
  3. Verifikasi empty state
- **Test Data**: -
- **Expected Result**: 
  - Empty state dengan ilustrasi/icon muncul
  - Pesan yang jelas "Belum ada data"
  - Call-to-action untuk tambah data
  - UI tetap terlihat rapi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-72: Animation & Transition
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi smoothness animasi
- **Precondition**: -
- **Test Steps**:
  1. Navigasi antar halaman
  2. Buka/tutup modal
  3. Hover pada button/card
  4. Scroll page
- **Test Data**: -
- **Expected Result**: 
  - Animasi smooth tanpa lag
  - Transition duration appropriate (200-300ms)
  - Tidak ada flicker
  - Page transition smooth
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-73: Color & Theme Consistency
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi konsistensi warna dan tema
- **Precondition**: -
- **Test Steps**:
  1. Navigasi ke berbagai halaman
  2. Verifikasi penggunaan warna
  3. Check button styles, cards, typography
- **Test Data**: -
- **Expected Result**: 
  - Warna konsisten sesuai design system
  - Primary color: #1C6EA4 digunakan dengan konsisten
  - Secondary colors sesuai
  - Contrast ratio accessibility compliant
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 11: Performance & Security

#### TC-74: Page Load Performance
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi kecepatan load halaman
- **Precondition**: -
- **Test Steps**:
  1. Clear cache browser
  2. Buka halaman utama
  3. Measure load time dengan DevTools Network
  4. Test di berbagai halaman
- **Test Data**: -
- **Expected Result**: 
  - First Contentful Paint < 2s
  - Largest Contentful Paint < 3s
  - Time to Interactive < 4s
  - Total page load < 5s (normal connection)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-75: Image Optimization
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi optimisasi gambar
- **Precondition**: -
- **Test Steps**:
  1. Buka halaman dengan banyak gambar
  2. Check network tab untuk size gambar
  3. Verifikasi lazy loading
- **Test Data**: -
- **Expected Result**: 
  - Gambar menggunakan format modern (WebP, AVIF)
  - Image lazy loading implemented
  - Responsive images (srcset)
  - Size gambar optimal
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-76: Session Management
- **Test Scenario ID**: TS-29
- **Deskripsi**: Memverifikasi management session user
- **Precondition**: -
- **Test Steps**:
  1. Login ke sistem
  2. Biarkan idle selama waktu tertentu
  3. Coba akses halaman protected
  4. Atau close tab dan buka lagi
- **Test Data**: Idle time: 30 menit
- **Expected Result**: 
  - Session expired setelah idle timeout
  - User di-redirect ke login
  - Token di-refresh secara automatic (jika implemented)
  - Tidak ada security vulnerability
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-77: SQL Injection Prevention
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi proteksi SQL injection
- **Precondition**: -
- **Test Steps**:
  1. Input SQL injection pattern di form login:
     - Email: `' OR '1'='1`
     - Password: `' OR '1'='1`
  2. Coba di search box: `'; DROP TABLE users;--`
  3. Verifikasi sistem menolak input
- **Test Data**: Various SQL injection patterns
- **Expected Result**: 
  - Input di-sanitize
  - Query parameterized
  - Tidak ada error message yang expose database structure
  - Login gagal dengan input malicious
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-78: XSS Prevention
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi proteksi Cross-Site Scripting
- **Precondition**: -
- **Test Steps**:
  1. Input XSS pattern di text field:
     - `<script>alert('XSS')</script>`
     - `<img src=x onerror=alert('XSS')>`
  2. Simpan dan reload halaman
  3. Verifikasi script tidak execute
- **Test Data**: Various XSS patterns
- **Expected Result**: 
  - HTML/Script tags di-escape
  - Tidak ada alert popup
  - Content di-render sebagai text, bukan HTML
  - CSP (Content Security Policy) implemented
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-79: Authorization Check
- **Test Scenario ID**: TS-29
- **Deskripsi**: Memverifikasi user tidak bisa akses resource lain
- **Precondition**: Login sebagai siswa
- **Test Steps**:
  1. Login sebagai siswa
  2. Coba akses URL guru: `/guru/dashboard`
  3. Coba akses data siswa lain via API
- **Test Data**: -
- **Expected Result**: 
  - Access denied / 403 Forbidden
  - Redirect ke halaman authorized
  - API return unauthorized error
  - Tidak ada data leak
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-80: Rate Limiting
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi rate limiting untuk prevent abuse
- **Precondition**: -
- **Test Steps**:
  1. Kirim banyak request dalam waktu singkat (brute force login)
  2. Verifikasi system throttle request
- **Test Data**: 50 requests in 10 seconds
- **Expected Result**: 
  - Request di-throttle setelah threshold
  - Error 429 Too Many Requests
  - Lockout temporary untuk IP/user
  - CAPTCHA muncul (opsional)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 12: Browser Compatibility

#### TC-81: Chrome Browser
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi kompatibilitas dengan Chrome
- **Precondition**: -
- **Test Steps**:
  1. Buka website di Google Chrome (latest version)
  2. Test semua fitur utama
  3. Check console untuk errors
- **Test Data**: Chrome version: latest
- **Expected Result**: 
  - Semua fitur berfungsi normal
  - Layout sesuai design
  - Tidak ada console error
  - Performance optimal
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-82: Firefox Browser
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi kompatibilitas dengan Firefox
- **Precondition**: -
- **Test Steps**:
  1. Buka website di Mozilla Firefox (latest version)
  2. Test semua fitur utama
  3. Check console untuk errors
- **Test Data**: Firefox version: latest
- **Expected Result**: 
  - Semua fitur berfungsi normal
  - Layout consistent dengan Chrome
  - Tidak ada console error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-83: Safari Browser
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi kompatibilitas dengan Safari
- **Precondition**: -
- **Test Steps**:
  1. Buka website di Safari (Mac/iOS)
  2. Test semua fitur utama
  3. Check console untuk errors
- **Test Data**: Safari version: latest
- **Expected Result**: 
  - Semua fitur berfungsi normal
  - Layout consistent
  - Tidak ada console error
  - iOS Safari touch events berfungsi
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-84: Edge Browser
- **Test Scenario ID**: -
- **Deskripsi**: Memverifikasi kompatibilitas dengan Microsoft Edge
- **Precondition**: -
- **Test Steps**:
  1. Buka website di Microsoft Edge (latest version)
  2. Test semua fitur utama
  3. Check console untuk errors
- **Test Data**: Edge version: latest
- **Expected Result**: 
  - Semua fitur berfungsi normal
  - Layout sesuai design
  - Tidak ada console error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 13: Fitur Admin - Autentikasi & Dashboard

#### TC-85: Login Admin dengan Kredensial Valid
- **Test Scenario ID**: TS-31
- **Deskripsi**: Memverifikasi admin dapat login dengan kredensial yang benar
- **Precondition**: 
  - User berada di halaman login admin
  - User memiliki akun admin yang terdaftar
- **Test Steps**:
  1. Buka halaman `/pick-role` dan pilih role Admin (atau langsung `/login/admin`)
  2. Input email admin yang valid
  3. Input password yang valid
  4. Klik tombol "Masuk"
- **Test Data**:
  - Email: `admin@adaptivin.com`
  - Password: `admin123`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert "Login Berhasil!"
  - User diarahkan ke halaman `/admin/dashboard`
  - Token autentikasi tersimpan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-86: Login Admin dengan Kredensial Invalid
- **Test Scenario ID**: TS-32
- **Deskripsi**: Memverifikasi sistem menolak login admin dengan kredensial salah
- **Precondition**: User berada di halaman login admin
- **Test Steps**:
  1. Buka halaman `/login/admin`
  2. Input email atau password yang salah
  3. Klik tombol "Masuk"
- **Test Data**:
  - Email: `adminsalah@adaptivin.com`
  - Password: `passwordsalah`
- **Expected Result**: 
  - Sistem menampilkan SweetAlert error "Login Gagal!"
  - User tetap di halaman login
  - Tidak ada redirect
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-87: Melihat Dashboard Admin
- **Test Scenario ID**: TS-33
- **Deskripsi**: Memverifikasi tampilan dashboard admin
- **Precondition**: Admin sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Verifikasi halaman `/admin/dashboard` terbuka
  3. Periksa semua elemen dashboard
- **Test Data**: -
- **Expected Result**: 
  - Dashboard menampilkan:
    - Total sekolah yang terdaftar
    - Total guru
    - Total siswa
    - Total kelas
    - Chart statistik pengguna
    - Recent activities
    - Menu navigasi admin (Sekolah, Kelas, Guru, Siswa)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 14: Fitur Admin - Management Sekolah

#### TC-88: Melihat Daftar Sekolah
- **Test Scenario ID**: TS-37
- **Deskripsi**: Memverifikasi admin dapat melihat daftar semua sekolah
- **Precondition**: Admin sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke menu "Sekolah" atau buka `/admin/sekolah`
  3. Verifikasi daftar sekolah ditampilkan
- **Test Data**: -
- **Expected Result**: 
  - Daftar sekolah ditampilkan dalam table/card
  - Setiap sekolah menampilkan:
    - Nama sekolah
    - Alamat
    - Jumlah guru
    - Jumlah siswa
    - Status (aktif/non-aktif)
    - Aksi (edit, hapus, lihat detail)
  - Fitur search dan filter tersedia
  - Pagination tersedia (jika data banyak)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-89: Menambah Sekolah Baru
- **Test Scenario ID**: TS-34
- **Deskripsi**: Memverifikasi admin dapat menambahkan sekolah baru
- **Precondition**: Admin berada di halaman daftar sekolah
- **Test Steps**:
  1. Buka halaman `/admin/sekolah`
  2. Klik tombol "Tambah Sekolah" atau "+ Sekolah Baru"
  3. Input informasi sekolah:
     - Nama sekolah
     - NPSN (Nomor Pokok Sekolah Nasional)
     - Alamat lengkap
     - Nomor telepon
     - Email sekolah
     - Kepala sekolah
  4. Klik tombol "Simpan"
- **Test Data**:
  - Nama: `SD Negeri 1 Jakarta`
  - NPSN: `12345678`
  - Alamat: `Jl. Merdeka No. 123, Jakarta Pusat`
  - Telepon: `021-1234567`
  - Email: `sdn1jakarta@school.com`
  - Kepala Sekolah: `Budi Santoso, S.Pd`
- **Expected Result**: 
  - Sekolah baru tersimpan ke database
  - Sistem menampilkan konfirmasi berhasil via SweetAlert
  - Sekolah baru muncul di daftar sekolah
  - User diarahkan kembali ke daftar sekolah atau detail sekolah
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-90: Menambah Sekolah dengan Field Wajib Kosong
- **Test Scenario ID**: TS-34
- **Deskripsi**: Memverifikasi validasi form tambah sekolah
- **Precondition**: Admin berada di form tambah sekolah
- **Test Steps**:
  1. Klik tombol "Tambah Sekolah"
  2. Biarkan field nama sekolah kosong
  3. Input field lain
  4. Klik tombol "Simpan"
- **Test Data**: (field nama kosong)
- **Expected Result**: 
  - Sistem menampilkan error validasi "Nama sekolah wajib diisi"
  - Sekolah tidak tersimpan
  - Form tetap terbuka
  - Focus ke field yang error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-91: Mengedit Data Sekolah
- **Test Scenario ID**: TS-35
- **Deskripsi**: Memverifikasi admin dapat mengedit informasi sekolah
- **Precondition**: Sekolah sudah ada di sistem
- **Test Steps**:
  1. Buka daftar sekolah
  2. Klik tombol "Edit" pada salah satu sekolah
  3. Ubah informasi sekolah (nama, alamat, dll)
  4. Klik tombol "Simpan Perubahan"
- **Test Data**: 
  - Nama baru: `SD Negeri 1 Jakarta - Updated`
  - Alamat baru: `Jl. Merdeka No. 123 Blok A, Jakarta Pusat`
- **Expected Result**: 
  - Informasi sekolah ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Perubahan terlihat di daftar sekolah
  - Data guru dan siswa di sekolah tidak terpengaruh
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-92: Menghapus Sekolah
- **Test Scenario ID**: TS-36
- **Deskripsi**: Memverifikasi admin dapat menghapus sekolah
- **Precondition**: Sekolah sudah ada di sistem
- **Test Steps**:
  1. Buka daftar sekolah
  2. Klik tombol "Hapus" pada salah satu sekolah
  3. Verifikasi dialog konfirmasi muncul
  4. Konfirmasi penghapusan
- **Test Data**: Sekolah ID: `school-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi dengan warning jika ada guru/siswa terkait
  - Setelah konfirmasi, sekolah terhapus dari database
  - Sekolah hilang dari daftar
  - Guru dan siswa di sekolah tersebut di-handle (soft delete atau reassign)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-93: Melihat Detail Sekolah
- **Test Scenario ID**: TS-37
- **Deskripsi**: Memverifikasi admin dapat melihat detail sekolah
- **Precondition**: Sekolah sudah ada di sistem
- **Test Steps**:
  1. Buka daftar sekolah
  2. Klik pada salah satu card/row sekolah atau tombol "Detail"
- **Test Data**: -
- **Expected Result**: 
  - Halaman detail sekolah terbuka: `/admin/sekolah/[sekolahId]`
  - Menampilkan:
    - Informasi lengkap sekolah
    - Daftar guru di sekolah
    - Daftar siswa di sekolah
    - Daftar kelas di sekolah
    - Statistik performa sekolah
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-94: Search Sekolah
- **Test Scenario ID**: TS-37
- **Deskripsi**: Memverifikasi fitur pencarian sekolah
- **Precondition**: Admin berada di halaman daftar sekolah
- **Test Steps**:
  1. Buka halaman daftar sekolah
  2. Input keyword di search box: `Jakarta`
  3. Tekan Enter atau klik Search
- **Test Data**: Keyword: `Jakarta`
- **Expected Result**: 
  - Sistem menampilkan sekolah yang mengandung keyword "Jakarta"
  - Hasil search akurat
  - Jumlah hasil ditampilkan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 15: Fitur Admin - Management Kelas

#### TC-95: Melihat Daftar Kelas
- **Test Scenario ID**: TS-41
- **Deskripsi**: Memverifikasi admin dapat melihat daftar semua kelas
- **Precondition**: Admin sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke menu "Kelas" atau buka `/admin/kelas`
  3. Verifikasi daftar kelas ditampilkan
- **Test Data**: -
- **Expected Result**: 
  - Daftar kelas ditampilkan dalam table/card
  - Setiap kelas menampilkan:
    - Nama kelas
    - Tingkat (4/5/6)
    - Sekolah
    - Wali kelas (guru)
    - Jumlah siswa
    - Status
    - Aksi (edit, hapus, lihat detail)
  - Fitur search, filter (by sekolah, tingkat), dan sort tersedia
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-96: Menambah Kelas Baru
- **Test Scenario ID**: TS-38
- **Deskripsi**: Memverifikasi admin dapat menambahkan kelas baru
- **Precondition**: 
  - Admin berada di halaman daftar kelas
  - Minimal ada 1 sekolah terdaftar
- **Test Steps**:
  1. Buka halaman `/admin/kelas`
  2. Klik tombol "Tambah Kelas" atau "+ Kelas Baru"
  3. Input informasi kelas:
     - Nama kelas
     - Tingkat (dropdown: 4/5/6)
     - Pilih sekolah (dropdown)
     - Pilih wali kelas/guru (dropdown, opsional)
     - Deskripsi
     - Tahun ajaran
  4. Klik tombol "Simpan"
- **Test Data**:
  - Nama: `Kelas 4A`
  - Tingkat: `4`
  - Sekolah: `SD Negeri 1 Jakarta`
  - Wali Kelas: `Bu Ani`
  - Deskripsi: `Kelas 4A Tahun Ajaran 2024/2025`
  - Tahun Ajaran: `2024/2025`
- **Expected Result**: 
  - Kelas baru tersimpan ke database
  - Kelas di-assign ke sekolah yang dipilih
  - Sistem menampilkan konfirmasi berhasil
  - Kelas baru muncul di daftar kelas
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-97: Menambah Kelas tanpa Memilih Sekolah
- **Test Scenario ID**: TS-38
- **Deskripsi**: Memverifikasi validasi form tambah kelas
- **Precondition**: Admin berada di form tambah kelas
- **Test Steps**:
  1. Klik "Tambah Kelas"
  2. Input nama kelas dan tingkat
  3. Biarkan dropdown sekolah kosong
  4. Klik "Simpan"
- **Test Data**: (sekolah tidak dipilih)
- **Expected Result**: 
  - Sistem menampilkan error validasi "Sekolah wajib dipilih"
  - Kelas tidak tersimpan
  - Form tetap terbuka
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-98: Mengedit Data Kelas
- **Test Scenario ID**: TS-39
- **Deskripsi**: Memverifikasi admin dapat mengedit informasi kelas
- **Precondition**: Kelas sudah ada di sistem
- **Test Steps**:
  1. Buka daftar kelas
  2. Klik tombol "Edit" pada salah satu kelas
  3. Ubah informasi kelas (nama, wali kelas, dll)
  4. Klik tombol "Simpan Perubahan"
- **Test Data**: 
  - Nama baru: `Kelas 4B`
  - Wali Kelas baru: `Pak Budi`
- **Expected Result**: 
  - Informasi kelas ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Perubahan terlihat di daftar kelas
  - Siswa di kelas tidak terpengaruh
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-99: Menghapus Kelas
- **Test Scenario ID**: TS-40
- **Deskripsi**: Memverifikasi admin dapat menghapus kelas
- **Precondition**: Kelas sudah ada di sistem
- **Test Steps**:
  1. Buka daftar kelas
  2. Klik tombol "Hapus" pada salah satu kelas
  3. Verifikasi dialog konfirmasi muncul
  4. Konfirmasi penghapusan
- **Test Data**: Kelas ID: `class-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi dengan warning jika ada siswa di kelas
  - Setelah konfirmasi, kelas terhapus dari database
  - Kelas hilang dari daftar
  - Siswa di kelas di-handle (reassign atau soft delete)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-100: Filter Kelas Berdasarkan Sekolah
- **Test Scenario ID**: TS-41
- **Deskripsi**: Memverifikasi filter kelas by sekolah
- **Precondition**: Admin berada di halaman daftar kelas
- **Test Steps**:
  1. Buka halaman daftar kelas
  2. Pilih filter sekolah dari dropdown
  3. Verifikasi hasil filter
- **Test Data**: Filter: `SD Negeri 1 Jakarta`
- **Expected Result**: 
  - Sistem menampilkan hanya kelas dari sekolah yang dipilih
  - Filter dapat di-clear/reset
  - Jumlah hasil filter ditampilkan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-101: Filter Kelas Berdasarkan Tingkat
- **Test Scenario ID**: TS-41
- **Deskripsi**: Memverifikasi filter kelas by tingkat
- **Precondition**: Admin berada di halaman daftar kelas
- **Test Steps**:
  1. Buka halaman daftar kelas
  2. Pilih filter tingkat: `Kelas 4`
  3. Verifikasi hasil filter
- **Test Data**: Filter: `4`
- **Expected Result**: 
  - Sistem menampilkan hanya kelas tingkat 4
  - Filter dapat dikombinasi dengan filter sekolah
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 16: Fitur Admin - Management Guru

#### TC-102: Melihat Daftar Guru
- **Test Scenario ID**: TS-45
- **Deskripsi**: Memverifikasi admin dapat melihat daftar semua guru
- **Precondition**: Admin sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke menu "Guru" atau buka `/admin/guru`
  3. Verifikasi daftar guru ditampilkan
- **Test Data**: -
- **Expected Result**: 
  - Daftar guru ditampilkan dalam table/card
  - Setiap guru menampilkan:
    - Nama lengkap
    - Email/username
    - Sekolah
    - Kelas yang diajar
    - Jumlah siswa
    - Status akun (aktif/non-aktif)
    - Aksi (edit, hapus, reset password, lihat detail)
  - Fitur search dan filter by sekolah tersedia
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-103: Menambah Akun Guru Baru
- **Test Scenario ID**: TS-42
- **Deskripsi**: Memverifikasi admin dapat membuat akun guru baru
- **Precondition**: 
  - Admin berada di halaman daftar guru
  - Minimal ada 1 sekolah terdaftar
- **Test Steps**:
  1. Buka halaman `/admin/guru`
  2. Klik tombol "Tambah Guru" atau "+ Guru Baru"
  3. Input informasi guru:
     - Nama lengkap
     - Email
     - Username
     - Password (auto-generate atau manual)
     - Pilih sekolah (dropdown)
     - NIP (Nomor Induk Pegawai)
     - Nomor telepon
     - Alamat
  4. Klik tombol "Simpan"
- **Test Data**:
  - Nama: `Ani Suryani, S.Pd`
  - Email: `ani.suryani@gmail.com`
  - Username: `ani_guru`
  - Password: `guru123` (atau auto-generate)
  - Sekolah: `SD Negeri 1 Jakarta`
  - NIP: `198501012010012001`
  - Telepon: `081234567890`
  - Alamat: `Jl. Mawar No. 45, Jakarta`
- **Expected Result**: 
  - Akun guru baru tersimpan ke database
  - Password di-hash dengan aman
  - Guru di-assign ke sekolah yang dipilih
  - Sistem menampilkan konfirmasi berhasil dan menampilkan username & password (jika auto-generate)
  - Email notifikasi dikirim ke guru (opsional)
  - Guru baru muncul di daftar guru
  - Guru dapat login dengan kredensial yang dibuat
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-104: Menambah Guru dengan Email yang Sudah Terdaftar
- **Test Scenario ID**: TS-42
- **Deskripsi**: Memverifikasi validasi email unique
- **Precondition**: Admin berada di form tambah guru
- **Test Steps**:
  1. Klik "Tambah Guru"
  2. Input email yang sudah terdaftar
  3. Input data lainnya
  4. Klik "Simpan"
- **Test Data**: Email: `ani.suryani@gmail.com` (sudah terdaftar)
- **Expected Result**: 
  - Sistem menampilkan error "Email sudah terdaftar"
  - Guru tidak tersimpan
  - Form tetap terbuka dengan data yang sudah diinput
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-105: Menambah Guru dengan Field Wajib Kosong
- **Test Scenario ID**: TS-42
- **Deskripsi**: Memverifikasi validasi form tambah guru
- **Precondition**: Admin berada di form tambah guru
- **Test Steps**:
  1. Klik "Tambah Guru"
  2. Biarkan beberapa field wajib kosong (nama, email, sekolah)
  3. Klik "Simpan"
- **Test Data**: (field wajib kosong)
- **Expected Result**: 
  - Sistem menampilkan error validasi untuk setiap field wajib
  - Guru tidak tersimpan
  - Highlight field yang error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-106: Mengedit Akun Guru
- **Test Scenario ID**: TS-43
- **Deskripsi**: Memverifikasi admin dapat mengedit informasi guru
- **Precondition**: Guru sudah ada di sistem
- **Test Steps**:
  1. Buka daftar guru
  2. Klik tombol "Edit" pada salah satu guru
  3. Ubah informasi guru (nama, nomor telepon, sekolah, dll)
  4. Klik tombol "Simpan Perubahan"
- **Test Data**: 
  - Nama baru: `Ani Suryani, S.Pd., M.Pd`
  - Telepon baru: `081234567899`
  - Sekolah baru: `SD Negeri 2 Jakarta`
- **Expected Result**: 
  - Informasi guru ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Perubahan terlihat di daftar guru
  - Jika sekolah diubah, kelas yang diajar di-handle
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-107: Menghapus Akun Guru
- **Test Scenario ID**: TS-44
- **Deskripsi**: Memverifikasi admin dapat menghapus akun guru
- **Precondition**: Guru sudah ada di sistem
- **Test Steps**:
  1. Buka daftar guru
  2. Klik tombol "Hapus" pada salah satu guru
  3. Verifikasi dialog konfirmasi muncul
  4. Konfirmasi penghapusan
- **Test Data**: Guru ID: `teacher-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi dengan warning jika guru mengajar kelas
  - Setelah konfirmasi, akun guru terhapus dari database
  - Guru hilang dari daftar
  - Kelas yang diajar guru di-handle (reassign wali kelas)
  - Materi dan soal yang dibuat guru tetap ada atau di-handle
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-108: Reset Password Guru
- **Test Scenario ID**: TS-43
- **Deskripsi**: Memverifikasi admin dapat reset password guru
- **Precondition**: Guru sudah ada di sistem
- **Test Steps**:
  1. Buka daftar guru
  2. Klik tombol "Reset Password" pada salah satu guru
  3. Verifikasi dialog konfirmasi
  4. Konfirmasi reset
- **Test Data**: -
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi
  - Password guru di-reset ke default atau auto-generate
  - Sistem menampilkan password baru
  - Admin dapat copy password untuk diberikan ke guru
  - Email notifikasi dikirim ke guru (opsional)
  - Guru dapat login dengan password baru
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-109: Melihat Detail Guru
- **Test Scenario ID**: TS-45
- **Deskripsi**: Memverifikasi admin dapat melihat detail guru
- **Precondition**: Guru sudah ada di sistem
- **Test Steps**:
  1. Buka daftar guru
  2. Klik pada salah satu guru atau tombol "Detail"
- **Test Data**: -
- **Expected Result**: 
  - Halaman detail guru terbuka: `/admin/guru/[guruId]`
  - Menampilkan:
    - Informasi lengkap guru
    - Sekolah
    - Kelas yang diajar
    - Materi yang dibuat
    - Soal yang dibuat
    - Statistik aktivitas guru
    - Riwayat login (opsional)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-110: Search Guru
- **Test Scenario ID**: TS-45
- **Deskripsi**: Memverifikasi fitur pencarian guru
- **Precondition**: Admin berada di halaman daftar guru
- **Test Steps**:
  1. Buka halaman daftar guru
  2. Input keyword di search box: `Ani`
  3. Tekan Enter atau klik Search
- **Test Data**: Keyword: `Ani`
- **Expected Result**: 
  - Sistem menampilkan guru yang mengandung keyword "Ani"
  - Search meliputi nama, email, NIP
  - Hasil search akurat
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-111: Filter Guru Berdasarkan Sekolah
- **Test Scenario ID**: TS-45
- **Deskripsi**: Memverifikasi filter guru by sekolah
- **Precondition**: Admin berada di halaman daftar guru
- **Test Steps**:
  1. Buka halaman daftar guru
  2. Pilih filter sekolah dari dropdown
  3. Verifikasi hasil filter
- **Test Data**: Filter: `SD Negeri 1 Jakarta`
- **Expected Result**: 
  - Sistem menampilkan hanya guru dari sekolah yang dipilih
  - Filter dapat di-clear/reset
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 17: Fitur Admin - Management Siswa

#### TC-112: Melihat Daftar Siswa
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi admin dapat melihat daftar semua siswa
- **Precondition**: Admin sudah login
- **Test Steps**:
  1. Login sebagai admin
  2. Navigasi ke menu "Siswa" atau buka `/admin/siswa`
  3. Verifikasi daftar siswa ditampilkan
- **Test Data**: -
- **Expected Result**: 
  - Daftar siswa ditampilkan dalam table/card
  - Setiap siswa menampilkan:
    - Nama lengkap
    - Email/username
    - Sekolah
    - Kelas
    - NISN (Nomor Induk Siswa Nasional)
    - Karakter avatar
    - Status akun (aktif/non-aktif)
    - Aksi (edit, hapus, reset password, lihat detail)
  - Fitur search dan filter by sekolah/kelas tersedia
  - Pagination tersedia
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-113: Menambah Akun Siswa Baru
- **Test Scenario ID**: TS-46
- **Deskripsi**: Memverifikasi admin dapat membuat akun siswa baru
- **Precondition**: 
  - Admin berada di halaman daftar siswa
  - Minimal ada 1 kelas terdaftar
- **Test Steps**:
  1. Buka halaman `/admin/siswa`
  2. Klik tombol "Tambah Siswa" atau "+ Siswa Baru"
  3. Input informasi siswa:
     - Nama lengkap
     - Email (opsional)
     - Username
     - Password (auto-generate atau manual)
     - Pilih sekolah (dropdown)
     - Pilih kelas (dropdown, filtered by sekolah)
     - NISN
     - Tanggal lahir
     - Jenis kelamin
     - Alamat
  4. Klik tombol "Simpan"
- **Test Data**:
  - Nama: `Budi Prasetyo`
  - Email: `budi.prasetyo@student.com` (opsional)
  - Username: `budi_siswa`
  - Password: `siswa123` (atau auto-generate)
  - Sekolah: `SD Negeri 1 Jakarta`
  - Kelas: `Kelas 4A`
  - NISN: `0012345678`
  - Tanggal Lahir: `2014-05-15`
  - Jenis Kelamin: `Laki-laki`
  - Alamat: `Jl. Melati No. 12, Jakarta`
- **Expected Result**: 
  - Akun siswa baru tersimpan ke database
  - Password di-hash dengan aman
  - Siswa di-assign ke kelas yang dipilih
  - Sistem menampilkan konfirmasi berhasil dan menampilkan username & password
  - Email notifikasi dikirim ke siswa/orang tua (opsional)
  - Siswa baru muncul di daftar siswa
  - Siswa dapat login dengan kredensial yang dibuat
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-114: Menambah Siswa dengan Username yang Sudah Terdaftar
- **Test Scenario ID**: TS-46
- **Deskripsi**: Memverifikasi validasi username unique
- **Precondition**: Admin berada di form tambah siswa
- **Test Steps**:
  1. Klik "Tambah Siswa"
  2. Input username yang sudah terdaftar
  3. Input data lainnya
  4. Klik "Simpan"
- **Test Data**: Username: `budi_siswa` (sudah terdaftar)
- **Expected Result**: 
  - Sistem menampilkan error "Username sudah terdaftar"
  - Siswa tidak tersimpan
  - Form tetap terbuka dengan data yang sudah diinput
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-115: Menambah Siswa dengan Field Wajib Kosong
- **Test Scenario ID**: TS-46
- **Deskripsi**: Memverifikasi validasi form tambah siswa
- **Precondition**: Admin berada di form tambah siswa
- **Test Steps**:
  1. Klik "Tambah Siswa"
  2. Biarkan field wajib kosong (nama, username, kelas)
  3. Klik "Simpan"
- **Test Data**: (field wajib kosong)
- **Expected Result**: 
  - Sistem menampilkan error validasi untuk setiap field wajib
  - Siswa tidak tersimpan
  - Highlight field yang error
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-116: Mengedit Akun Siswa
- **Test Scenario ID**: TS-47
- **Deskripsi**: Memverifikasi admin dapat mengedit informasi siswa
- **Precondition**: Siswa sudah ada di sistem
- **Test Steps**:
  1. Buka daftar siswa
  2. Klik tombol "Edit" pada salah satu siswa
  3. Ubah informasi siswa (nama, kelas, alamat, dll)
  4. Klik tombol "Simpan Perubahan"
- **Test Data**: 
  - Nama baru: `Budi Prasetyo Utomo`
  - Kelas baru: `Kelas 4B`
  - Alamat baru: `Jl. Melati No. 12 Blok C, Jakarta`
- **Expected Result**: 
  - Informasi siswa ter-update di database
  - Sistem menampilkan konfirmasi berhasil
  - Perubahan terlihat di daftar siswa
  - Jika kelas diubah, progress belajar di-handle
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-117: Menghapus Akun Siswa
- **Test Scenario ID**: TS-48
- **Deskripsi**: Memverifikasi admin dapat menghapus akun siswa
- **Precondition**: Siswa sudah ada di sistem
- **Test Steps**:
  1. Buka daftar siswa
  2. Klik tombol "Hapus" pada salah satu siswa
  3. Verifikasi dialog konfirmasi muncul
  4. Konfirmasi penghapusan
- **Test Data**: Siswa ID: `student-001`
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi dengan warning tentang data yang akan hilang
  - Setelah konfirmasi, akun siswa terhapus dari database
  - Siswa hilang dari daftar
  - Data hasil kuis siswa di-handle (soft delete atau archive)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-118: Reset Password Siswa
- **Test Scenario ID**: TS-47
- **Deskripsi**: Memverifikasi admin dapat reset password siswa
- **Precondition**: Siswa sudah ada di sistem
- **Test Steps**:
  1. Buka daftar siswa
  2. Klik tombol "Reset Password" pada salah satu siswa
  3. Verifikasi dialog konfirmasi
  4. Konfirmasi reset
- **Test Data**: -
- **Expected Result**: 
  - Sistem menampilkan dialog konfirmasi
  - Password siswa di-reset ke default atau auto-generate
  - Sistem menampilkan password baru
  - Admin dapat copy password untuk diberikan ke siswa/orang tua
  - Email notifikasi dikirim (opsional)
  - Siswa dapat login dengan password baru
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-119: Melihat Detail Siswa
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi admin dapat melihat detail siswa
- **Precondition**: Siswa sudah ada di sistem
- **Test Steps**:
  1. Buka daftar siswa
  2. Klik pada salah satu siswa atau tombol "Detail"
- **Test Data**: -
- **Expected Result**: 
  - Halaman detail siswa terbuka: `/admin/siswa/[siswaId]`
  - Menampilkan:
    - Informasi lengkap siswa
    - Sekolah dan kelas
    - Karakter avatar
    - Progress belajar
    - Riwayat nilai kuis
    - Materi yang sudah diselesaikan
    - Statistik aktivitas siswa
    - Grafik perkembangan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-120: Search Siswa
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi fitur pencarian siswa
- **Precondition**: Admin berada di halaman daftar siswa
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. Input keyword di search box: `Budi`
  3. Tekan Enter atau klik Search
- **Test Data**: Keyword: `Budi`
- **Expected Result**: 
  - Sistem menampilkan siswa yang mengandung keyword "Budi"
  - Search meliputi nama, username, NISN
  - Hasil search akurat
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-121: Filter Siswa Berdasarkan Sekolah
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi filter siswa by sekolah
- **Precondition**: Admin berada di halaman daftar siswa
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. Pilih filter sekolah dari dropdown
  3. Verifikasi hasil filter
- **Test Data**: Filter: `SD Negeri 1 Jakarta`
- **Expected Result**: 
  - Sistem menampilkan hanya siswa dari sekolah yang dipilih
  - Filter dapat dikombinasi dengan filter kelas
  - Filter dapat di-clear/reset
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-122: Filter Siswa Berdasarkan Kelas
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi filter siswa by kelas
- **Precondition**: Admin berada di halaman daftar siswa
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. Pilih filter kelas dari dropdown
  3. Verifikasi hasil filter
- **Test Data**: Filter: `Kelas 4A`
- **Expected Result**: 
  - Sistem menampilkan hanya siswa dari kelas yang dipilih
  - Dropdown kelas filtered by sekolah (jika filter sekolah aktif)
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-123: Pindah Kelas Siswa Secara Massal
- **Test Scenario ID**: TS-47
- **Deskripsi**: Memverifikasi admin dapat memindahkan banyak siswa ke kelas lain
- **Precondition**: 
  - Admin berada di halaman daftar siswa
  - Ada beberapa siswa di sistem
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. Centang checkbox beberapa siswa
  3. Klik tombol "Pindah Kelas" atau bulk action
  4. Pilih kelas tujuan dari dropdown
  5. Konfirmasi
- **Test Data**: 
  - Siswa dipilih: 5 siswa
  - Kelas tujuan: `Kelas 5A`
- **Expected Result**: 
  - Sistem menampilkan konfirmasi
  - Semua siswa yang dipilih dipindah ke kelas baru
  - Progress belajar siswa di-handle
  - Konfirmasi berhasil ditampilkan
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

### Modul 18: Fitur Admin - Import Data Bulk

#### TC-124: Import Guru via Excel/CSV
- **Test Scenario ID**: TS-50
- **Deskripsi**: Memverifikasi admin dapat import banyak guru sekaligus
- **Precondition**: Admin berada di halaman daftar guru
- **Test Steps**:
  1. Buka halaman daftar guru
  2. Klik tombol "Import Guru" atau "Upload Excel"
  3. Download template Excel (jika ada tombol)
  4. Upload file Excel yang sudah diisi dengan data guru
  5. Verifikasi preview data
  6. Klik "Import"
- **Test Data**: File: `import_guru.xlsx` berisi 10 data guru
- **Expected Result**: 
  - Sistem validasi format file (xlsx/csv)
  - Preview data ditampilkan sebelum import
  - Sistem validasi data (email unique, dll)
  - Jika ada error, ditampilkan row mana yang error
  - Data valid berhasil di-import
  - Konfirmasi jumlah data berhasil/gagal
  - Password auto-generate untuk setiap guru
  - Export hasil import dengan username & password
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-125: Import Siswa via Excel/CSV
- **Test Scenario ID**: TS-50
- **Deskripsi**: Memverifikasi admin dapat import banyak siswa sekaligus
- **Precondition**: Admin berada di halaman daftar siswa
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. Klik tombol "Import Siswa" atau "Upload Excel"
  3. Download template Excel (jika ada tombol)
  4. Upload file Excel yang sudah diisi dengan data siswa
  5. Verifikasi preview data
  6. Klik "Import"
- **Test Data**: File: `import_siswa.xlsx` berisi 30 data siswa
- **Expected Result**: 
  - Sistem validasi format file (xlsx/csv)
  - Preview data ditampilkan sebelum import
  - Sistem validasi data (username unique, kelas exist, dll)
  - Jika ada error, ditampilkan row mana yang error
  - Data valid berhasil di-import
  - Konfirmasi jumlah data berhasil/gagal
  - Password auto-generate untuk setiap siswa
  - Export hasil import dengan username & password
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-126: Import dengan File Format Salah
- **Test Scenario ID**: TS-50
- **Deskripsi**: Memverifikasi validasi format file import
- **Precondition**: Admin berada di halaman import
- **Test Steps**:
  1. Klik tombol import
  2. Upload file dengan format salah (e.g., .pdf, .docx)
  3. Klik "Import"
- **Test Data**: File: `data.pdf`
- **Expected Result**: 
  - Sistem menampilkan error "Format file tidak didukung"
  - File tidak di-upload
  - Pesan error jelas: "Hanya file .xlsx atau .csv yang diperbolehkan"
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-127: Import dengan Data Invalid
- **Test Scenario ID**: TS-50
- **Deskripsi**: Memverifikasi validasi data saat import
- **Precondition**: Admin berada di halaman import
- **Test Steps**:
  1. Upload file Excel dengan data invalid (email salah format, kelas tidak exist, dll)
  2. Verifikasi preview
  3. Klik "Import"
- **Test Data**: File dengan 10 row, 3 row data invalid
- **Expected Result**: 
  - Sistem menampilkan warning di preview
  - Error message untuk setiap row yang invalid
  - Admin dapat pilih: skip row error atau cancel import
  - Hanya data valid yang di-import
  - Laporan detail: berapa berhasil, berapa gagal, error apa
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-128: Download Template Import
- **Test Scenario ID**: TS-50
- **Deskripsi**: Memverifikasi download template Excel untuk import
- **Precondition**: Admin berada di halaman import
- **Test Steps**:
  1. Klik tombol "Download Template" atau "Template Excel"
  2. Verifikasi file ter-download
  3. Buka file Excel
- **Test Data**: -
- **Expected Result**: 
  - File template ter-download
  - Format: .xlsx
  - Template berisi:
    - Header kolom yang sesuai (Nama, Email, Username, dll)
    - Contoh data di row pertama (opsional)
    - Instruksi/keterangan
    - Format yang benar
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-129: Export Data Guru ke Excel
- **Test Scenario ID**: TS-45
- **Deskripsi**: Memverifikasi admin dapat export data guru
- **Precondition**: Admin berada di halaman daftar guru
- **Test Steps**:
  1. Buka halaman daftar guru
  2. (Opsional) Apply filter tertentu
  3. Klik tombol "Export" atau "Download Excel"
  4. Verifikasi file ter-download
- **Test Data**: -
- **Expected Result**: 
  - File Excel ter-download
  - Berisi data guru sesuai filter (atau semua jika tidak ada filter)
  - Format rapi dan lengkap
  - Dapat dibuka dengan Microsoft Excel/Google Sheets
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

#### TC-130: Export Data Siswa ke Excel
- **Test Scenario ID**: TS-49
- **Deskripsi**: Memverifikasi admin dapat export data siswa
- **Precondition**: Admin berada di halaman daftar siswa
- **Test Steps**:
  1. Buka halaman daftar siswa
  2. (Opsional) Apply filter tertentu
  3. Klik tombol "Export" atau "Download Excel"
  4. Verifikasi file ter-download
- **Test Data**: -
- **Expected Result**: 
  - File Excel ter-download
  - Berisi data siswa sesuai filter (atau semua jika tidak ada filter)
  - Format rapi dan lengkap
  - Dapat dibuka dengan Microsoft Excel/Google Sheets
- **Actual Result**: _(akan diisi saat testing)_
- **Status**: _(Pass/Fail)_

---

## Summary Test Coverage

### Modul yang Ditest:
1. ✅ Autentikasi (Login/Logout)
2. ✅ Pick Role & Navigation
3. ✅ Fitur Siswa (Onboarding, Karakter, Beranda, Materi, Kuis, Profil)
4. ✅ Fitur Guru - Dashboard
5. ✅ Fitur Guru - Management Kelas
6. ✅ Fitur Guru - Management Materi
7. ✅ Fitur Guru - Management Soal
8. ✅ Fitur Guru - Management Kuis
9. ✅ Fitur Guru - Laporan & Analisis
10. ✅ UI/UX & Responsiveness
11. ✅ Performance & Security
12. ✅ Browser Compatibility
13. ✅ Fitur Admin - Autentikasi & Dashboard
14. ✅ Fitur Admin - Management Sekolah
15. ✅ Fitur Admin - Management Kelas
16. ✅ Fitur Admin - Management Guru
17. ✅ Fitur Admin - Management Siswa
18. ✅ Fitur Admin - Import Data Bulk

### Total:
- **Test Scenario**: 48
- **Test Case**: 130

---

## Cara Penggunaan Dokumen

### Untuk Tester:
1. Ikuti test steps secara berurutan
2. Gunakan test data yang sudah disediakan
3. Catat actual result setelah melakukan testing
4. Tandai status Pass/Fail untuk setiap test case
5. Jika Fail, tambahkan screenshot dan deskripsi bug
6. Prioritaskan test case berdasarkan critical features

### Prioritas Testing:
- **High Priority**: TC-01 sampai TC-33 (Autentikasi & Fitur Siswa)
- **Medium Priority**: TC-34 sampai TC-65 (Fitur Guru)
- **Medium Priority**: TC-82 sampai TC-130 (Fitur Admin)
- **Low Priority**: TC-66 sampai TC-81 (UI/UX, Performance, Compatibility)

### Bug Report Format:
Jika menemukan bug saat testing, catat dengan format:
```
Bug ID: BUG-001
Test Case: TC-XX
Severity: Critical/High/Medium/Low
Deskripsi: [deskripsi bug]
Steps to Reproduce: [langkah reproduce bug]
Expected: [hasil yang diharapkan]
Actual: [hasil actual]
Screenshot: [lampirkan screenshot]
```

---

## Catatan
- Dokumen ini dapat diupdate sesuai kebutuhan
- Test data dapat disesuaikan dengan environment testing
- Tambahkan test case baru jika ada fitur tambahan
- Lakukan regression testing setelah fix bug

---

**Dibuat untuk**: Lomba LIDM - Website Adaptivin  
**Tanggal**: November 2025  
**Versi**: 1.0



