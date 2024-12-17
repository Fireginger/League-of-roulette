document.addEventListener("DOMContentLoaded", async () => {
  const items = document.getElementById("items");
  const itemContainer = document.getElementById("item2");
  const openCaseButton = document.getElementById("openCase");
  const itemWidth = 100; // Width of each item in pixels
  const popUp = createPopUp(); // Création de la pop-up

  // Fetch the latest version of the game
  const versionResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  const versions = await versionResponse.json();
  const latestVersion = versions[0];

  // Fetch champion data
  const championsResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
  const championsData = await championsResponse.json();
  const champions = Object.keys(championsData.data);

  // Fetch item data
  const itemsResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`);
  const itemsData = await itemsResponse.json();
  const itemEntries = Object.entries(itemsData.data);

  const filteredItems = itemEntries.filter(([itemId, itemData]) => {
    // console.log(itemData.gold.total)
    // console.log(itemData.gold.purchasable)
    console.log(itemData)
    if (itemData.gold.total > 1650 && itemData.gold.purchasable == true){
      return itemData
    }
  });

  console.log(itemEntries.length)
  console.log(filteredItems.length)

  filteredItems.forEach(([itemId, itemData]) => {
    createElement(itemContainer, `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${itemData.image.full}`, `Item ${itemId}`);
  });

  filteredItems.forEach(([itemId, itemData]) => {
    createElement(itemContainer, `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${itemData.image.full}`, `Item ${itemId}`);
  });
  
  // Populate the roulette with champion images
  champions.forEach(champion => {
    const championElement = document.createElement("div");
    championElement.classList.add("item");
    const championImage = document.createElement("img");
    championImage.src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion}.png`;
    championImage.alt = champion;
    championElement.appendChild(championImage);
    items.appendChild(championElement);
  });

  // Create element for item roulette
  function createElement(container, imageUrl, altText) {
    const element = document.createElement("div");
    element.classList.add("item");

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altText;

    element.appendChild(image);
    container.appendChild(element);
  }

  // Duplicate items for infinite scrolling
  champions.forEach(champion => {
    const championElement = document.createElement("div");
    championElement.classList.add("item");
    const championImage = document.createElement("img");
    championImage.src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion}.png`;
    championImage.alt = champion;
    championElement.appendChild(championImage);
    items.appendChild(championElement);
  });

  // --- 5. Créer une Pop-up ---
  function createPopUp() {
    const popUp = document.createElement("div");
    popUp.id = "popUp";
    popUp.style.display = "none";
    popUp.style.position = "fixed";
    popUp.style.top = "50%";
    popUp.style.left = "50%";
    popUp.style.transform = "translate(-50%, -50%)";
    popUp.style.background = "rgba(0, 0, 0, 0.8)";
    popUp.style.color = "white";
    popUp.style.padding = "20px";
    popUp.style.borderRadius = "10px";
    popUp.style.zIndex = "1000";
    popUp.style.textAlign = "center";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.marginTop = "10px";
    closeBtn.style.padding = "5px 10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => popUp.style.display = "none");

    popUp.appendChild(closeBtn);
    document.body.appendChild(popUp);

    return popUp;
  }

  // Spin functionality
  function spinRoulette() {
    const spinCount = Math.floor(Math.random() * champions.length);
    const spinCountObjet = Math.floor(Math.random() * filteredItems.length)
    lengthItem = filteredItems;
    console.log(spinCount)
    console.log(spinCountObjet) // Random item index
    const spinDistance = spinCount * itemWidth;
    const spinDistanceObjet = spinCountObjet * itemWidth;
    console.log(spinDistance)
    console.log(spinDistanceObjet) // Distance to stop at random champion

    // Animate the roulette
    items.style.transition = "transform 8s cubic-bezier(0.25, 0.1, 0.25, 1)";
    items.style.transform = `translateX(-${spinDistance + (champions.length * itemWidth)}px)`; // Scroll into the duplicated section

    // Animate the second roulette
    itemContainer.style.transition = "transform 12s cubic-bezier(0.25, 0.1, 0.25, 0.1";
    itemContainer.style.transform = `translateX(-${spinDistanceObjet + ((filteredItems.length) * itemWidth)}px)`

    // Reset position to simulate infinite scroll
    setTimeout(() => {
      items.style.transition = "none"; // Disable transition for reset
      items.style.transform = `translateX(-${spinDistance}px)`; // Reset to corresponding position in original section
    }, 8000); // Match the animation duration
    
    setTimeout(() => {
      itemContainer.style.transition = "none"; // Disable transition for reset
      itemContainer.style.transform = `translateX(-${spinDistanceObjet}px)`; // Reset to corresponding position in original section
    }, 12000); // Match the animation duration

    
    setTimeout(() => {
      displayResults(spinCount, spinCountObjet);
    }, 13000);
  }

  function displayResults(spinCount, lengthItem) {
    const championName = champions[spinCount + 2];
    console.log(spinCount);
    const itemName = filteredItems[(lengthItem) + 2][1].name;
    console.log(lengthItem);
    const itemImage = filteredItems[(lengthItem) + 2][1].image.full;
    popUp.innerHTML = `
      <h2>🎉 Résultat 🎉</h2>
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div>
          <p><strong>Champion :</strong></p>
          <img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championName}.png" alt="${championName}" style="width: 100px; border-radius: 8px;">
          <p>${championName}</p>
        </div>
        <div>
          <p><strong>Item :</strong></p>
          <img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${itemImage}" alt="${itemName}" style="width: 100px; border-radius: 8px;">
          <p>${itemName}</p>
        </div>
      </div>
      <button style="margin-top: 10px; padding: 5px 10px; cursor: pointer;">Fermer</button>
    `;

    const closeBtn = popUp.querySelector("button");
    closeBtn.addEventListener("click", () => popUp.style.display = "none");

    popUp.style.display = "block";
  }
  // Attach the spin event to the button
  openCaseButton.addEventListener("click", spinRoulette);
  
});
