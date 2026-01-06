/* ❄️ SNOW EFFECT */
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const flakes = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2.5 + 1,
  s: Math.random() * 0.5 + 0.3
}));

function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  flakes.forEach(f => {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  });
  ctx.fill();

  flakes.forEach(f => {
    f.y += f.s;
    f.x += Math.sin(f.y * 0.01) * 0.3;
    if (f.y > canvas.height) {
      f.y = -5;
      f.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animateSnow);
}
animateSnow();

/* 🃏 CARD DEX */
const grid = document.getElementById("card-grid");
const detail = document.getElementById("detail");
const detailContent = document.getElementById("detail-content");
const searchInput = document.getElementById("search");
const closeBtn = document.getElementById("close");

let cards = [];
let filteredCards = [];

/* Load 300 cards */
fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=300&offset=0")
  .then(res => res.json())
  .then(data => {
    cards = data.data;
    filteredCards = cards;
    render(filteredCards);
  })
  .catch(err => {
    grid.innerHTML = "<p style='text-align:center'>Failed to load cards</p>";
    console.error(err);
  });

function render(list) {
  grid.innerHTML = ""; // Clear previous cards

  list.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${card.card_images[0].image_url}" alt="${card.name}">
      <h4>${card.name}</h4>
    `;

    // Attach the card data for the popup
    div.cardData = card;

    // Click listener for popup
    div.addEventListener("click", () => showCardPopup(card));
// Save card to summoned list
let summonedCards = JSON.parse(localStorage.getItem("summonedCards")) || [];

div.addEventListener("click", () => {
  showCardPopup(card); // open the popup

  // Check if card is already in summonedCards
  if (!summonedCards.find(c => c.id === card.id)) {
    summonedCards.push(card);
    localStorage.setItem("summonedCards", JSON.stringify(summonedCards));
  }
});

    grid.appendChild(div);
  });
}


/* 🔍 SEARCH — FIXED */
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    filteredCards = cards;
  } else {
    filteredCards = cards.filter(card =>
      card.name.toLowerCase().includes(query)
    );
  }

  render(filteredCards);
});

const popup = document.getElementById("card-popup");
const popupContent = document.getElementById("card-popup-info");
const popupClose = document.getElementById("card-popup-close");

function showCardPopup(card) {
  // Fill the popup content
  popupContent.innerHTML = `
    <h2>${card.name}</h2>
    <img src="${card.card_images[0].image_url}" alt="${card.name}">
    <p><b>Type:</b> ${card.type}</p>
    <p><b>ATK:</b> ${card.atk || "—"} | <b>DEF:</b> ${card.def || "—"}</p>
    <p>${card.desc}</p>
  `;

  // Show popup
  popup.classList.add("active");
}

// Close popup when clicking the close button or outside content
popupClose.addEventListener("click", () => {
  popup.classList.remove("active");
});

popup.addEventListener("click", e => {
  if (e.target === popup) {
    popup.classList.remove("active");
  }
});


/* 🎁 CHRISTMAS PACK OPENING */
const openPackBtn = document.getElementById("open-pack");

openPackBtn.addEventListener("click", openPack);

function openPack() {
  if (!cards.length) return;

  const overlay = document.createElement("div");
  overlay.id = "pack-overlay";

  const cardRow = document.createElement("div");
  cardRow.id = "pack-cards";

  // Pick 5 random cards
  const pack = [...cards]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  pack.forEach(card => {
    const div = document.createElement("div");
    div.className = "pack-card";

    const img = document.createElement("img");
    img.src = card.card_images[0].image_url;

    div.appendChild(img);

    div.addEventListener("click", () => {
      div.classList.toggle("revealed");
    });

    cardRow.appendChild(div);
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "❌ Close Pack";
  closeBtn.style.marginTop = "30px";
  closeBtn.onclick = () => overlay.remove();

  overlay.appendChild(cardRow);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}
document.addEventListener("DOMContentLoaded", () => {
  const openPackBtn = document.getElementById("open-pack");

  if (openPackBtn) {
    openPackBtn.addEventListener("click", openPack);
  } else {
    console.error("❌ Open Pack button not found");
  }

  const viewSummonedBtn = document.getElementById("view-summoned");
  if (viewSummonedBtn) {
    viewSummonedBtn.addEventListener("click", () => {
      window.location.href = "/summon";
    });
  }
});

const glow = document.getElementById("cursor-glow");


document.addEventListener("mousemove", e => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});