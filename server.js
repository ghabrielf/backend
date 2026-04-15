const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "https://yovita.netlify.app"
}));
app.use(express.json());

// ==========================
// CONFIG
// ==========================

const USERNAME = "yovita";
const PASSWORD = "ielgantengbanget";

// ==========================
// MODE
// ==========================

const MODE = "TEST"; // 👉 ganti ke "REAL" kalau sudah siap

const TARGET_REAL = "2026-06-11T00:00:00+07:00";

// ==========================
// TARGET DATE (SATU SUMBER)
// ==========================

const targetDate =
  MODE === "TEST"
    ? Date.now() + 10000 // 10 detik dari server start
    : new Date(TARGET_REAL).getTime();

console.log("TARGET DATE:", new Date(targetDate));

// ==========================
// BRUTE FORCE PROTECTION
// ==========================

const attempts = {};

// ==========================
// TIME (UNTUK FE)
// ==========================

app.get("/time", (req, res) => {
  res.json({ targetDate });
});

// ==========================
// LOGIN
// ==========================

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const ip = req.ip;
  const now = Date.now();

  if (!attempts[ip]) {
    attempts[ip] = {
      count: 0,
      blockedUntil: 0
    };
  }

  const userData = attempts[ip];

  // 🔒 BLOCK
  if (now < userData.blockedUntil) {
    return res.json({
      success: false,
      message: "Terlalu banyak percobaan 😡 coba lagi nanti"
    });
  }

  // ❌ BELUM WAKTU
  if (now < targetDate) {
    return res.json({
      success: false,
      message: "Belum waktunya ⏳"
    });
  }

  // ❌ SALAH
  if (username !== USERNAME || password !== PASSWORD) {
    userData.count++;

    const delay = Math.min(userData.count * 1000, 5000);

    // 🔥 BLOCK setelah 5x
    if (userData.count >= 5) {
      userData.blockedUntil = now + 10000; // 10 detik
      userData.count = 0;
    }

    return setTimeout(() => {
      res.json({
        success: false,
        message: "Login gagal 😢"
      });
    }, delay);
  }

  // ✅ SUCCESS → RESET
  attempts[ip] = {
    count: 0,
    blockedUntil: 0
  };

  res.json({ success: true });
});

// ==========================
// CONTENT
// ==========================

app.get("/content", (req, res) => {
  const now = Date.now();

  if (now < targetDate) {
    return res.json({ locked: true });
  }

  res.json({
    locked: false,
    paragraphs: [
      "Hai Yovita...\nAkhirnya kamu sampai di sini...",
      "Aku sebenarnya sudah lama mau bikin sesuatu seperti ini...\nTapi selalu mikir, apakah ini cukup berarti buat kamu...",
      "Dan akhirnya aku memutuskan untuk tetap mencoba...\nKarena kamu pantas dapet sesuatu yang spesial.",
      "Mungkin ini tidak sempurna...\nTapi aku bikin ini dengan niat yang tulus.",
      "Setiap bagian dari ini...\naku pikirin satu-satu.",
      "Dari hal kecil...\nsampai hal yang mungkin tidak kamu sadari.",
      "Aku ingin ini jadi sesuatu...\nyang bisa kamu ingat.",
      "Bukan karena mewah...\nTapi karena dibuat khusus untuk kamu.",
      "Hari ini adalah hari spesial kamu...\nhari dimana kamu hadir di dunia ini.",
      "Dan jujur saja...\naku bersyukur banget karena itu.",
      "Karena kalau tidak...\nmungkin aku tidak akan pernah kenal kamu.",
      "Dan aku tidak akan pernah tahu...\nrasanya punya kamu di hidup aku.",
      "Kamu itu unik...\nkadang nyebelin, kadang lucu, kadang bikin gemes.",
      "Tapi justru itu...\nyang bikin kamu jadi kamu.",
      "Dan aku suka itu...\naku suka semua tentang kamu.",
      "Aku suka cara kamu bicara...\ncara kamu marah... bahkan cara kamu diam.",
      "Semua itu berarti...\nlebih dari yang kamu kira.",
      "Mungkin aku tidak selalu bilang...\natau tidak selalu menunjukan.",
      "Tapi percayalah...\nkamu penting banget buat aku.",
      "Hari ini...\naku cuma ingin kamu bahagia.",
      "Tidak peduli sederhana atau tidak...\nyang penting kamu tersenyum.",
      "Karena senyum kamu itu...\npunya efek besar.",
      "Bisa bikin hari aku jadi lebih baik...\nwalaupun sebelumnya tidak baik-baik saja.",
      "Terima kasih ya...\nuntuk semua hal kecil yang kamu lakukan.",
      "Terima kasih sudah hadir...\ndan bertahan sampai sejauh ini.",
      "Terima kasih sudah jadi bagian...\ndari cerita hidup aku.",
      "Aku tidak tahu ke depan akan seperti apa...\nTapi aku harap kita tetap berjalan bersama.",
      "Pelan-pelan...\nsatu langkah demi satu langkah.",
      "Sampai nanti...\nkita bisa melihat ke belakang dan tersenyum.",
      "Selamat ulang tahun ya, Yovita...\nSemoga semua hal baik selalu datang ke kamu ❤️",
      "terakhir",
      "I hope your day is as beautiful as you are"
    ]
  });
});

// ==========================
// START SERVER
// ==========================

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});