let galaxy = [];
let mouse = false;
let touch = false;
let currentX = 0;
let currentY = 0;
let currentSize = 0;
let move = 0.01;

let shootX = 200;
let shootY;

let i = 0;
let chris;
let chrisModalOpen = false;
let chrisImage;

// Modal content
let chrisModalData = {
  title: "Chris the Superstar",
  description: `Mr Scott-Blore was a respected teacher, a dear colleague and a very popular member of staff among the whole school community.  He loved his subject and he loved his students and he felt passionately about ensuring all students could learn and master the world of computing.  He used his sense of fun and humour to build strong relationships with students, built on mutual trust and respect and he always took the time to ensure that his lessons were engaging for all.  As a colleague and friend to many, Mr Scott-Blore was kind, compassionate and friendly and talked with such love about his wife and his little boy, always sharing the latest photos from the weekend! He is so deeply missed in our school community but his legacy will live on in the curriculum he built, the lunchtime club he created and the memories we have and share of him with one another. Loved and never forgotten.`,
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg" // Replace with your image
};

function preload() {
  chrisImage = loadImage(chrisModalData.imageUrl);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  createCanvas(windowWidth, windowHeight).id("bgCanvas");

  // Send canvas to the background
  const canvas = document.getElementById("bgCanvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1"; // 👈 Push it behind everything
  chris = new Superstar();
  shootY = random(20, 80);

  fetch("/get-data")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const newStar = new star(item.name, item.message);
        console.log(item);
        galaxy.push(newStar);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  setInterval(shoot, 10);
}

function shoot() {
  if (shootX > windowWidth) {
    shootX = -random(5000, 15000);
    shootY = random(20, 80);
  } else {
    shootX = shootX + 30;
    shootY = shootY + 2;
  }
}

function draw() {
  background(0, 0, 35);
  cursor(ARROW);

  // Shooting stars
  fill(255);
  ellipse(shootX - 15, shootY, 3, 3, 100);
  ellipse(shootX - 10, shootY, 3, 3, 100);
  ellipse(shootX - 5, shootY, 3, 3, 200);
  ellipse(shootX, shootY, 3);

  // Move and draw Chris
  chris.setX(chris.getX() + 0.2);
  chris.place();

  if (
    mouseX > chris.getX() - chris.getSize() &&
    mouseX < chris.getX() + chris.getSize() &&
    mouseY > chris.getY() - chris.getSize() &&
    mouseY < chris.getY() + chris.getSize()
  ) {
    cursor(HAND);
  }

  for (let amount = 0; amount < galaxy.length; amount++) {
    galaxy[amount].place();

    if (
      mouseX > galaxy[amount].getX() - galaxy[amount].getSize() &&
      mouseX < galaxy[amount].getX() + galaxy[amount].getSize() &&
      mouseY > galaxy[amount].getY() - galaxy[amount].getSize() &&
      mouseY < galaxy[amount].getY() + galaxy[amount].getSize()
    ) {
      touch = true;
    
      const name = galaxy[amount].getName();
      const message = galaxy[amount].getMessage();
    
      textSize(12);
      textFont("Arial");
    
      const wrappedLines = wrapText(message, 60);
      const fullText = [name, ...wrappedLines].join("\n");
    
      // Measure size of text box
      let maxLineWidth = textWidth(name);
      wrappedLines.forEach((line) => {
        const lineWidth = textWidth(line);
        if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
      });
    
      const lineHeight = textAscent() + textDescent();
      const totalHeight = lineHeight * (1 + wrappedLines.length);
    
      const padding = 10;
      const rectWidth = maxLineWidth + padding * 2;
      const rectHeight = totalHeight + padding * 2;
    
      // Initial position near star
      let rectX = galaxy[amount].getX() + 20;
      let rectY = galaxy[amount].getY();
    
      // Adjust X to keep box on screen
      if (rectX + rectWidth > width) {
        rectX = width - rectWidth - 10;
      }
      if (rectX < 0) {
        rectX = 10;
      }
    
      // Optional: Adjust Y to stay within screen vertically
      if (rectY + rectHeight > height) {
        rectY = height - rectHeight - 10;
      }
    
      // Draw box background
      fill(0);
      noStroke();
      rect(rectX, rectY, rectWidth, rectHeight);
    
      // Draw text
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text(fullText, rectX + padding, rectY + padding);
    
      // Underline the name
      stroke(255);
      line(
        rectX + padding,
        rectY + padding + textAscent(),
        rectX + padding + textWidth(name),
        rectY + padding + textAscent()
      );
      noStroke();
      currentX = galaxy[amount].getX();
      currentY = galaxy[amount].getY();
      currentSize = galaxy[amount].getSize();
    } else {
      touch = false;
      galaxy[amount].setX(galaxy[amount].getX() + 0.2);
    }
  }

  if (
    mouseX > currentX - currentSize &&
    mouseX < currentX + currentSize &&
    mouseY > currentY - currentSize &&
    mouseY < currentY + currentSize
  ) {
    cursor(HAND);
  }
  
}

function mousePressed() {
  const d = dist(mouseX, mouseY, chris.getX(), chris.getY());
  const modal = document.getElementById("chrisModal");

  if (d < chris.size / 2) { // Check if the click is inside the Chris star
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    } else {
      modal.classList.add("hidden");
    }
  }
}




function wrapText(text, maxChars) {
  let result = [];
  let currentLine = '';
  const words = text.split(' ');

  for (const word of words) {
    if (currentLine.length + word.length > maxChars) {
      if (currentLine.length > 0) {
        result.push(currentLine);
        currentLine = '';
      }

      if (word.length > maxChars) {
        let i = 0;
        while (i < word.length) {
          result.push(word.substring(i, i + maxChars));
          i += maxChars;
        }
      } else {
        currentLine = word;
      }
    } else {
      if (currentLine.length > 0) {
        currentLine += ' ' + word;
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine.length > 0) {
    result.push(currentLine);
  }

  return result;
}

function drawChrisModal() {
  if (!chrisModalOpen) return;  // Only draw modal if it's open

  const modalWidth = 800;
  const modalHeight = 500;
  const x = (width - modalWidth) / 2;
  const y = (height - modalHeight) / 2;

  // Dark overlay
  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  // Modal box
  fill(255);
  stroke(255);
  rect(x, y, modalWidth, modalHeight, 10);

  // Title
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text(chrisModalData.title, x + modalWidth / 2, y + 20);

  // Image
  if (chrisImage) {
    image(chrisImage, x + 25, y + 60, modalWidth - 50, 180);
  }

  // Description
  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  let wrappedDesc = wrapText(chrisModalData.description, 110).join("\n");
  text(wrappedDesc, x + 20, y + 260);
}


document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("chrisModal").classList.add("hidden");
      chrisModalOpen = false;  // Track modal state
    });
  }
});
