# AZRYL AI 🤖

**AZRYL AI** adalah aplikasi web AI full-stack cerdas yang ditenagai oleh asisten AI bernama **azrylasissten**, dikembangkan oleh **AZRYL** (Content Creator di TikTok: **@AZRYL**).

Backend dibangun dengan **Node.js + Express** dan terintegrasi dengan AI provider **Grok (xAI)** menggunakan konfigurasi environment variable yang aman.

---

## 🚀 Panduan Memulai Cepat

Ikuti langkah-langkah mudah berikut untuk menjalankan project:

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 3. Masukkan API Key Anda ke `.env`
Buka file `.env` dan masukkan API key Grok/xAI milik Anda:
```env
PORT=3000
AI_API_KEY=xai-YOUR_ACTUAL_GROK_API_KEY
AI_BASE_URL=https://api.x.ai/v1
AI_MODEL=grok-4.6
```

> ⚠️ **Catatan Keamanan:** Jangan pernah melakukan commit file `.env` atau membagikan API key Anda ke publik.

### 4. Jalankan Aplikasi
```bash
# Mode pengembangan (Development)
npm run dev

# Atau mode produksi (Production)
npm run build
npm start

# Atau standalone Express murni
npm run start:standalone
```

### 5. Buka di Browser
Akses aplikasi melalui:
```
http://localhost:3000
```

---

## 📡 Dokumentasi Endpoint Backend API

### 1. GET `/` (Status API)
Mengembalikan status operasional API AZRYL AI.

**Contoh cURL:**
```bash
curl -X GET http://localhost:3000/ -H "Accept: application/json"
```

**Contoh Response:**
```json
{
  "success": true,
  "name": "AZRYL AI",
  "assistant": "azrylasissten",
  "developer": "AZRYL",
  "status": "online"
}
```

---

### 2. GET `/api/identity`
Mengembalikan informasi resmi identitas AI azrylasissten dan developernya.

**Contoh cURL:**
```bash
curl -X GET http://localhost:3000/api/identity
```

**Contoh Response:**
```json
{
  "success": true,
  "name": "azrylasissten",
  "developer": "AZRYL",
  "tiktok": "@AZRYL",
  "role": "Asisten AI yang ramah, profesional, dan berpengetahuan luas",
  "exact_response": "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!",
  "description": "Asisten AI resmi yang dikembangkan oleh AZRYL (@AZRYL)."
}
```

---

### 3. POST `/api/chat`
Mengirim pesan ke azrylasissten dengan dukungan memori percakapan (session context).

**Contoh cURL (Pertanyaan Identitas):**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Halo, kamu siapa?"
  }'
```

**Contoh Response:**
```json
{
  "success": true,
  "message": "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!",
  "sessionId": "session_12345"
}
```

**Contoh cURL (Pertanyaan Umum/Coding):**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bantu jelaskan bagaimana cara kerja fetch API di JavaScript",
    "sessionId": "session_12345"
  }'
```

---

### 4. POST `/api/chat/clear` (Opsional)
Membersihkan riwayat memori sesi percakapan.

**Contoh cURL:**
```bash
curl -X POST http://localhost:3000/api/chat/clear \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_12345"
  }'
```

---

## 🎯 Identitas & Ketentuan azrylasissten
- **Nama AI**: azrylasissten
- **Developer / Pencipta**: AZRYL
- **Akun TikTok Developer**: @AZRYL
- **Jawaban Identitas Khusus**: Jika ditanya identitas, model atau backend memprioritaskan jawaban resmi persis tanpa perubahan.

---

## 🔒 Fitur Keamanan
- API key terlindung di server-side (`.env`), tidak pernah bocor ke client-side.
- Validasi ketat body request (menolak pesan kosong).
- Error handling aman tanpa ekspos kredensial rahasia.
- Dukungan CORS dan sanitasi header.
