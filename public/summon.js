const grid = document.getElementById("summoned-grid");

// Load summoned cards from localStorage
let summonedCards = JSON.parse(localStorage.getItem("summonedCards")) || [];

function renderSummoned() {
  grid.innerHTML = "";
  if (!summonedCards.length) {
    grid.innerHTML = "<p style='text-align:center'>You haven't summoned any cards yet!</p>";
    return;
  }

  summonedCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${card.card_images[0].image_url}" alt="${card.name}">
      <h4>${card.name}</h4>
    `;

    div.addEventListener("click", () => {
      // Optional: show popup here as well
      alert(`${card.name}\nType: ${card.type}\nATK: ${card.atk || "—"} | DEF: ${card.def || "—"}`);
    });

    grid.appendChild(div);
  });
}

renderSummoned();
