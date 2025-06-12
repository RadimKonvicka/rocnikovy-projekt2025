let levaPalka;
let pravaPalka;
let micek;
let winSound = new Audio('./win.mp3');
let bounceSound = new Audio('./bounce.mp3');
let pointSound = new Audio('./point.mp3');
let hraBezi = false;
let obtiznost = "easy";
let rychlostNarazu = 0;

const sirka = 1000;
const vyska = 500;
let hrac1 = 0;
let hrac2 = 0;
const maxSkore = 5;

window.onload = function () {
  const btn = document.getElementById("start-button");
  const pole = document.getElementById("pole");

  const infoBtn = document.getElementById("info-button");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

infoBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Aby popup šel zavřít i kliknutím mimo obsah
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});


  btn.addEventListener("click", function () {
    hraBezi = true;
    btn.style.display = "none";
    pole.classList.remove("blur");
  });

  document.getElementById('reload').addEventListener('click', () => {
  location.reload();
});

  document.querySelectorAll(".diff-btn").forEach(button => {
  button.addEventListener("click", function () {
    obtiznost = this.dataset.mode;

    // základní rychlost míčku
    let zakladniRychlostX = 6;
    let zakladniRychlostY = 6;

    switch (obtiznost) {
      case "easy":
        micek.rychlostX = (micek.rychlostX < 0 ? -zakladniRychlostX : zakladniRychlostX);
        micek.rychlostY = (micek.rychlostY < 0 ? -zakladniRychlostY : zakladniRychlostY);
        break;
      case "medium":
        micek.rychlostX = (micek.rychlostX < 0 ? -zakladniRychlostX * 1.6 : zakladniRychlostX * 1.6);
        micek.rychlostY = (micek.rychlostY < 0 ? -zakladniRychlostY * 1.6 : zakladniRychlostY * 1.6);
        break;
      case "hard":
        micek.rychlostX = (micek.rychlostX < 0 ? -zakladniRychlostX * 2.2 : zakladniRychlostX * 2.2);
        micek.rychlostY = (micek.rychlostY < 0 ? -zakladniRychlostY * 2.2 : zakladniRychlostY * 2.2);
        break;
    }
  });
});

};

class Palka {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sirka = 20;
    this.vyska = 100;
    this.rychlost = 11;
  }
  vykresli(barva) {
    fill(barva);
    rect(this.x, this.y, this.sirka, this.vyska);
  }
  pohyb(smer) {
    this.y = constrain(this.y + smer * this.rychlost, 0, vyska - this.vyska);
  }
}

class Micek {
  constructor() {
    this.prumer = 20;
    this.reset();
  }

  reset() {
    this.x = sirka / 2;
    this.y = vyska / 2;
    this.rychlostX = random([-1, 1]) * 6;
    this.rychlostY = random([-1, 1]) * 6;
  }

  vykresli() {
    fill(255);
    ellipse(this.x, this.y, this.prumer);
  }

  aktualizuj() {
    this.x += this.rychlostX;
    this.y += this.rychlostY;
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1;
    }
  }

  naraz(palka) {
    return (
      this.x - this.prumer / 2 <= palka.x + palka.sirka &&
      this.x + this.prumer / 2 >= palka.x &&
      this.y >= palka.y &&
      this.y <= palka.y + palka.vyska
    );
  }

  mimoHriste() {
    return this.x <= 0 || this.x >= sirka;
  }
}

function setup() {
  let holder = document.getElementById("pole");
  let canvas = createCanvas(sirka, vyska);
  canvas.parent(holder);
  levaPalka = new Palka(10, vyska / 2 - 50);
  pravaPalka = new Palka(sirka - 30, vyska / 2 - 50);
  micek = new Micek();
}

function draw() {
  background(0);

  if (!hraBezi) {
    levaPalka.vykresli(color(255, 0, 0));
    pravaPalka.vykresli(color(0, 0, 255));
    micek.vykresli();
    zobrazSkore();
    return;
  }

  zobrazSkore();

  levaPalka.vykresli(color(255, 0, 0));
  pravaPalka.vykresli(color(0, 0, 255));
  micek.vykresli();
  micek.aktualizuj();

  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
    micek.rychlostX *= -rychlostNarazu || -1;
    pointSound.play();
  }

  if (micek.mimoHriste()) {
    if (micek.x <= 0) {
      hrac2++;
    } else {
      hrac1++;
    }
    bounceSound.play();
    micek.reset();
    updateScores();
  }

  if (hrac1 >= maxSkore || hrac2 >= maxSkore) {
    noLoop();
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, TOP);
    winSound.play();
    text(`${hrac1 >= maxSkore ? "ČERVENÝ HRÁČ" : "MODRÝ HRÁČ"} VYHRÁL!`, sirka / 2, vyska / 2);
  }

  if (keyIsDown(87)) levaPalka.pohyb(-1);
  if (keyIsDown(83)) levaPalka.pohyb(1);
  if (keyIsDown(UP_ARROW)) pravaPalka.pohyb(-1);
  if (keyIsDown(DOWN_ARROW)) pravaPalka.pohyb(1);
}

function zobrazSkore() {
  textSize(32);
  fill(255);
  textAlign(CENTER, TOP);
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);
}

function updateScores() {
  let p1 = document.getElementById('player1-score');
  let p2 = document.getElementById('player2-score');
  if (p1 && p2) {
    p1.textContent = hrac1;
    p2.textContent = hrac2;
  }
}
