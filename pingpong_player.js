let levaPalka;  
let pravaPalka; 
let micek;      
let winSound = new Audio('./win.mp3');
let bounceSound = new Audio('./bounce.mp3');
let pointSound = new Audio('./point.mp3');
let hraBezi = false;
let obtiznost = "easy"; // výchozí režim
let rychlostNarazu = 0; // přidává se při nárazu podle obtížnosti



const sirka = 1000;  
const vyska = 500;   

let hrac1 = 0;  
let hrac2 = 0;  
const maxSkore = 5;

window.onload = function () {
  const btn = document.getElementById("start-button");
  const pole = document.getElementById("pole");

  btn.addEventListener("click", function () {
    hraBezi = true;
    btn.style.display = "none";
  });

  // obtížnostní tlačítka
  document.querySelectorAll(".diff-btn").forEach(button => {
    button.addEventListener("click", function () {
      obtiznost = this.dataset.mode;
      switch (obtiznost) {
        case "easy":
          rychlostNarazu = 0;
          break;
        case "medium":
          rychlostNarazu = 0.2;
          break;
        case "hard":
          rychlostNarazu = 0.5;
          break;
      }

      // zvýraznění vybraného tlačítka
      document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
};



class Palka1 {
  constructor(x, y) {
    this.x = x;         
    this.y = y;         
    this.sirka = 20;    
    this.vyska = 100;   
    this.rychlost = 11;  
  }
  vykresli() {
    fill(255, 0, 0);    
    rect(this.x, this.y, this.sirka, this.vyska);
  }
  pohyb(move) {
    this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska);
  }
}

class Palka2 {
    constructor(x, y) {
      this.x = x;         
      this.y = y;         
      this.sirka = 20;    
      this.vyska = 100;   
      this.rychlost = 11;  
    }
    vykresli() {
      fill(0, 0, 255);    
      rect(this.x, this.y, this.sirka, this.vyska);
    }
    pohyb(move) {
      this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska);
    }
  }

class Micek {
  constructor() {
    this.rychlostMicek = 6;     
      this.x = sirka / 2;         
    this.y = vyska / 2;         
    this.prumer = 20;           
    this.rychlostX = this.rychlostMicek; 
    this.rychlostY = this.rychlostMicek; 
  }

  vykresli() {                  
    fill(255, 255, 255);         
    ellipse(this.x, this.y, this.prumer); 
  }

  aktualizuj() {                 
    this.x += this.rychlostX;    
    this.y += this.rychlostY;    
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1.10;      
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

document.getElementById("easy-btn").addEventListener("click", function () {
  this.classList.toggle("active");
});

function points() {
  textSize(32);                      
  fill(255);                          
  textAlign(CENTER, TOP);             
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);
}

function updateScores() {
  let player1Element = document.getElementById('player1-score'); 
  let player2Element = document.getElementById('player2-score'); 

  if (player1Element && player2Element) {
    player1Element.textContent = hrac1;    
    player2Element.textContent = hrac2;    
  } else {
    console.error("Elementy pro skóre nebyly nalezeny.");
  }
}

function setup() {
  let holder = document.getElementById("pole");                      
  let canvas = createCanvas(sirka, vyska);       
  canvas.parent(holder);                         
  levaPalka = new Palka1(10, vyska / 2 - 50);     
  pravaPalka = new Palka2(sirka - 30, vyska / 2 - 50);
  micek = new Micek();                      
  }

  window.onload = function () {
  const btn = document.getElementById("start-button");
  const pole = document.getElementById("pole");

  btn.addEventListener("click", function () {
    hraBezi = true;
    btn.style.display = "none";
    pole.classList.remove("blur");
  });

  // Při načtení stránky přidáme blur
  pole.classList.add("blur");
};


function draw() {
  background(0); 
  if (!hraBezi) {
  levaPalka.vykresli();
  pravaPalka.vykresli();
  micek.vykresli();
  points();
  return;
}
         
  points();               

  pravaPalka.vykresli();
  levaPalka.vykresli();    
  pravaPalka.vykresli();   
  micek.vykresli();        
  micek.aktualizuj();      


  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
  micek.rychlostX *= -1;
  if (obtiznost !== "easy") {
    micek.rychlostX += Math.sign(micek.rychlostX) * rychlostNarazu;
  }
  pointSound.play();
}
 
  
  if (micek.mimoHriste()) { 
    if (micek.x <= 0) {
      hrac2++;             
    } else if (micek.x >= sirka) {
      hrac1++;             
    }
    bounceSound.play();
    micek = new Micek();   
    updateScores();        
  }

  if (hrac1 >= maxSkore || hrac2 >= maxSkore) {
    noLoop();
    background(0);
    fill(255); 
    textFont("Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif", 32)                         
    textAlign(CENTER, TOP);      
    winSound.play();       
    text("%s VYHRÁL!".replace("%s", hrac1 >= maxSkore ? "ČERVENÝ HRÁČ" : "MODRÝ HRÁČ"), sirka / 2, vyska / 2);
  }

  if (keyIsDown(87)) {     
    levaPalka.pohyb(-1);
  }
  if (keyIsDown(83)) {     
    levaPalka.pohyb(1);
  }
  if (keyIsDown(UP_ARROW)) {     
    pravaPalka.pohyb(-1);
  }
     if (keyIsDown(DOWN_ARROW)) {     
        pravaPalka.pohyb(1);
    }
}
  