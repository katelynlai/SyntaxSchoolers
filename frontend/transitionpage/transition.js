const params = new URLSearchParams(window.location.search);
const score = params.get("score");

if (score) {
  document.getElementById("score-value").textContent = score;
}

function goToNextLevel() {
  window.location.href = "../level3/level3.html";
}