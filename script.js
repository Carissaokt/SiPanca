// Kuis pilihan ganda dengan scoring
const quizQuestions = [
  { q: "Apa sila pertama Pancasila?", options: ["Ketuhanan yang Maha Esa", "Kemanusiaan yang Adil dan Beradab", "Persatuan Indonesia", "Kerakyatan yang Dipimpin oleh Hikmat"], correct: 0 },
  { q: "Apa makna sila kedua Pancasila?", options: ["Persatuan Indonesia", "Kemanusiaan yang Adil dan Beradab", "Keadilan Sosial", "Ketuhanan yang Maha Esa"], correct: 1 },
  { q: "Sila ketiga Pancasila menekankan nilai apa?", options: ["Keadilan untuk semua", "Persatuan Indonesia", "Demokrasi", "Ketuhanan"], correct: 1 },
  { q: "Lambang sila keempat Pancasila adalah?", options: ["Pohon Beringin", "Kepala Banteng", "Rantai", "Bintang"], correct: 1 },
  { q: "Apa bunyi sila kelima Pancasila?", options: ["Persatuan Indonesia", "Kemanusiaan yang Adil", "Keadilan Sosial bagi Seluruh Rakyat Indonesia", "Ketuhanan yang Maha Esa"], correct: 2 }
];

let userAnswers = [];
let quizStarted = false;

const quizArea = document.getElementById("quizArea");
const startBtn = document.getElementById("startQuiz");

startBtn.addEventListener("click", () => {
  if (quizStarted) {
    location.reload();
    return;
  }

  quizStarted = true;
  startBtn.textContent = "🔄 Mulai Ulang";
  userAnswers = new Array(quizQuestions.length).fill(null);
  quizArea.innerHTML = "";

  quizQuestions.forEach((item, i) => {
    const div = document.createElement("div");
    div.classList.add("quiz-card");
    div.innerHTML = `
      <p class="fw-bold mb-3" style="font-size: 1.1rem;">📝 ${i + 1}. ${item.q}</p>
      <div class="options-container">
        ${item.options.map((opt, idx) => `
          <div class="quiz-option" data-question="${i}" data-option="${idx}">
            <span style="font-weight: 600; color: #667eea; margin-right: 10px;">${String.fromCharCode(65 + idx)}.</span> ${opt}
          </div>
        `).join('')}
      </div>
    `;
    quizArea.appendChild(div);
  });

  quizArea.innerHTML += `<button id="submitQuiz" class="btn btn-success mt-3" style="font-size: 1.1rem; padding: 15px 50px;">✓ Kirim Jawaban</button>`;

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      const questionNum = parseInt(this.getAttribute('data-question'));
      const optionNum = parseInt(this.getAttribute('data-option'));
      document.querySelectorAll(`[data-question="${questionNum}"]`).forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      userAnswers[questionNum] = optionNum;
    });
  });
});

document.addEventListener("click", (event) => {
  if (event.target.id === "submitQuiz") {
    let score = 0;
    quizQuestions.forEach((question, i) => {
      // Cek jawaban sekali saja di luar loop options
      if (userAnswers[i] === question.correct) {
        score++;
      }
      
      const options = document.querySelectorAll(`[data-question="${i}"]`);
      options.forEach((option, idx) => {
        option.classList.remove('selected');
        if (idx === question.correct) {
          option.classList.add('correct');
          option.innerHTML = `<span style="margin-right: 10px;">✓</span>` + option.innerHTML;
        }
        if (userAnswers[i] === idx && idx !== question.correct) {
          option.classList.add('incorrect');
          option.innerHTML = `<span style="margin-right: 10px;">✗</span>` + option.innerHTML;
        }
        option.style.cursor = 'default';
        option.onclick = null;
      });
    });

    const percentage = Math.round((score / quizQuestions.length) * 100);
    let emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "😊" : "💪";
    let message = percentage >= 80 ? "Luar Biasa!" : percentage >= 60 ? "Bagus!" : "Tetap Semangat!";
    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('score-display');
    scoreDiv.innerHTML = `${emoji} ${message}<br>Skor Kamu: ${score} / ${quizQuestions.length} (${percentage}%)`;
    event.target.replaceWith(scoreDiv);
    scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// Data cerita
const ceritaData = {
  Ketuhanan: {
    judul: "Ketuhanan yang Maha Esa",
    isi: `
      Di sebuah desa kecil, ada anak bernama Bima yang selalu berdoa sebelum beraktivitas.
      Suatu hari, ia menemukan dompet di jalan. Alih-alih mengambilnya, Bima mencari pemiliknya
      dan mengembalikannya. Ketulusannya membuat semua orang kagum. 
      Dari kisah ini, kita belajar pentingnya beriman dan jujur sebagai wujud nilai Ketuhanan.
    `
  },
  Kemanusiaan: {
    judul: "Kemanusiaan yang Adil dan Beradab",
    isi: `
      Dina melihat tetangganya yang sedang kesulitan karena banjir. 
      Tanpa ragu, ia membantu mengungsikan anak-anak dan membagikan makanan. 
      Sikap saling peduli dan menolong ini mencerminkan kemanusiaan yang beradab — 
      bahwa kebaikan kecil dapat memberi dampak besar bagi sesama.
    `
  },
  Persatuan: {
    judul: "Persatuan Indonesia",
    isi: `
      Di sekolah, tim lomba kebersihan terdiri dari siswa dengan latar berbeda: agama, suku, dan bahasa. 
      Mereka sempat berselisih, tetapi akhirnya bekerja sama membersihkan taman sekolah hingga menjadi juara. 
      Persatuan mereka mengajarkan bahwa perbedaan justru memperkuat, bukan memisahkan.
    `
  }
};

// Event listener untuk setiap kartu
document.querySelectorAll('#cerita .card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('h5') ? card.querySelector('h5').innerText : null;
    const data = title ? ceritaData[title] : null;
    if (!data) return;

    document.getElementById('storyModalLabel').innerText = data.judul;
    document.getElementById('storyContent').innerHTML = data.isi;

    const modalEl = document.getElementById('storyModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    // Pastikan backdrop bersih ketika modal ditutup (proteksi jika ada duplikasi)
    modalEl.addEventListener('hidden.bs.modal', () => {
      // hapus backdrop tambahan jika ada
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    }, { once: true });
  });
});

