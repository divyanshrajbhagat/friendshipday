// Create floating hearts background
function createFloatingHearts() {
  const container = document.getElementById('bgHearts');
  if (!container) return;
  const heartIcons = ['❤️', '💖', '💗', '💓', '✨', '🌸'];
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (5 + Math.random() * 6) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    heart.style.fontSize = (16 + Math.random() * 18) + 'px';
    container.appendChild(heart);
  }
}
createFloatingHearts();

let yesScale = 1;
let noScale = 1;
let clickCount = 0;

const messages = [
  "Will you be my bestest friend forever? ❤️",
  "kitne pyaar se poocha tha haan krna thaa, chalo ab yes krdo 😚😚",
  "aaree krde haan , i know tmne glti se no pr click krdiya 😁😚",
  "uff ye ldkiii 🤷🤦, hnn krde hnn krde😁😚",
  "गलत जवाब 😑",
  "tmhe kya lga mein itni aasani se jaane doonga aapko 🐼, see who is here 'dev' sooo say yes",
  "ab aakhiri baar pooch rhaa haan krdee",
  "ab aakhiri option ki koi option ni milega 😚😚"
];

const gifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW40azlsYm1rbmx6ZTBwbDRidTByZnlpdG8zb2Vra2t3YXRoam1nciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LpDmM2wSt6xK1uVau4/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zsd24yZGJndmt6NnZlNDM3dDBld3Fwd3F6ZXVsOWxodXpwczc0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1MGd1OHdrMHYwNnlodXk4bjFwb283ZDNtMnBsbWVmOHZleHEwaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d1E2VyhOGB542fD2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNndhNnZtMXdrYnZxcHVkOXFpcnExMjdsdGRpMnNxcXpxYTVsdm14ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gP7OHuXyxE94B5iBHv/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanBxdms0MWs5NmZsNm44eDVnN3V2aXN0bzBsMjlnZjZld29rbGlpZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10tI0MY9szuWky/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDVqNHdqM2k5ZzJybHNmYWxxdmdrcW5tNndvNDRjcjI5MHM1NDdzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ISOckXU1mxEg6Zep66/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWV4dGRkZ285anoxNXZsdmt3dXU5ZnA2bjgwbTJydms5OGp3bDFndyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uw0Kpagx_SkE/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW40azlsYm1rbmx6ZTBwbDRidTByZnlpdG8zb2Vra2t3YXRoam1nciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LpDmM2wSt6xK1uVau4/giphy.gif"
];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const mainGif = document.getElementById("mainGif");

/* NO CLICK */
noBtn.addEventListener("click", () => {
  clickCount++;

  // YES grows gradually
  yesScale += 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;

  // NO shrinks but stays visible
  if (clickCount < 6) {
    noScale -= 0.08;
    if (noScale < 0.4) noScale = 0.4;
  }

  noBtn.style.transform = `scale(${noScale})`;

  // Set position fixed so it jumps across viewport reliably on mobile
  noBtn.style.position = "fixed";

  // Move NO randomly (mobile safe padding: 20px - 100px)
  const maxX = Math.max(window.innerWidth - 120, 20);
  const maxY = Math.max(window.innerHeight - 80, 20);
  const x = Math.min(Math.max(20, Math.random() * maxX), maxX);
  const y = Math.min(Math.max(20, Math.random() * maxY), maxY);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  // Change text (line by line)
  if (clickCount < messages.length) {
    question.innerText = messages[clickCount];
    if (gifs[clickCount]) {
      mainGif.src = gifs[clickCount];
    }
  }

  // FINAL TAKEOVER (after 6 clicks)
  if (clickCount >= 6) {
    yesBtn.style.position = "fixed";
    yesBtn.style.left = "0";
    yesBtn.style.top = "0";
    yesBtn.style.width = "100vw";
    yesBtn.style.height = "100vh";
    yesBtn.style.fontSize = "28px";
    yesBtn.style.borderRadius = "0";
    yesBtn.style.zIndex = "9999";
  }
});

/* YES CLICK */
yesBtn.addEventListener("click", () => {
  nextStep();
});

/* NEXT STEP CELEBRATION */
function nextStep() {
  // Fire celebratory confetti!
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }

  // Show celebration overlay modal
  const overlay = document.getElementById('celebrationOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}
