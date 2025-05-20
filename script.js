document.addEventListener("DOMContentLoaded", () => {
  // --- CHAMBRES ---
  const roomsContainer = document.querySelector("#rooms");
  if (roomsContainer) {
    roomsContainer.innerHTML = "";
    fetch("chambres_nautilus_complet.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Chambres HTTP ${res.status}`);
        return res.json();
      })
      .then((rooms) => {
        rooms.forEach((room) => {
          roomsContainer.innerHTML += `
            <article class="room-card">
              <h3>${room.name}</h3>
              <div class="guests">👤 ${room.capacity} pers.</div>
              <img src="${room.image}" alt="${room.name}">
              <div class="description">${room.description}</div>
              <div class="price">€${room.price}/nuit</div>
            </article>`;
        });
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des chambres :", err);
        roomsContainer.innerHTML = `<p class="error">Impossible de charger les chambres.</p>`;
      });
  }

  // --- MENU RESTAURATION ---
  const menuContainer = document.querySelector("#menu");
  if (menuContainer) {
    menuContainer.innerHTML = "";
    fetch("menu_nautilus.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Menu HTTP ${res.status}`);
        return res.json();
      })
      .then((menus) => {
        menus.forEach((item) => {
          menuContainer.innerHTML += `
      <article class="menu-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-info">
          <h4>${item.name} <small>${item.category}</small></h4>
          <p>${item.description}</p>
          <strong>€${item.price.toFixed(2)}</strong>
        </div>
      </article>`;
        });
      })

      .catch((err) => {
        console.error("Erreur lors du chargement du menu :", err);
        menuContainer.innerHTML = `<p class="error">Impossible de charger le menu.</p>`;
      });
  }

  // --- SERVICES ---
  const servicesContainer = document.querySelector("#services-list");
  if (servicesContainer) {
    servicesContainer.innerHTML = "";
    fetch("services.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Services HTTP ${res.status}`);
        return res.json();
      })
      .then((svcs) => {
        svcs.forEach((s) => {
          servicesContainer.innerHTML += `
            <div class="service-card">
              <i class="${s.icon}"></i>
              <h3>${s.name}</h3>
              <p>${s.description}</p>
            </div>`;
        });
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des services :", err);
        servicesContainer.innerHTML = `<p class="error">Impossible de charger les services.</p>`;
      });
  }

  // --- CÉLÉBRITÉS ---
  const celebContainer = document.querySelector("#celeb-list");
  if (celebContainer) {
    celebContainer.innerHTML = "";

    const API_KEY = "WKglzWknGdmBlhNhzT22hw==apgp6ydI5Ci3ZF53";

    const celebImages = {
      "alain delon": "assets/alainDelon.jpg",
      "vincent cassel": "assets/vincentCassel.jpg",
      "roman polanski": "assets/romanPolanski.PNG",
      "jean-paul goude": "assets/jeanPaulGoude.jpg",
      "martin solveig": "assets/martinSolveig.PNG",
    };

    fetch("https://api.api-ninjas.com/v1/celebrity?nationality=FR", {
      headers: { "X-Api-Key": API_KEY },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API Célébrités HTTP ${res.status}`);
        return res.json();
      })
      .then((celebs) => {
        celebs.slice(0, 5).forEach((c) => {
          const name = c.name || "Célébrité anonyme";
          const nameKey = name.toLowerCase();
          const imgSrc =
            celebImages[nameKey] || "assets/celebrities/default.jpg";
          const anecdote = `En 2023, ${name} a séjourné dans notre Suite Corail pour un événement privé.`;
          const roles = c.occupation ? c.occupation.join(", ") : "Artiste";

          celebContainer.innerHTML += `
            <div class="celeb-card">
              <img src="${imgSrc}" alt="${name}" class="celeb-photo" />
              <h4>${name} <small>(${roles}, ${
            c.country || "France"
          })</small></h4>
              <p>${anecdote}</p>
            </div>`;
        });
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des célébrités :", err);
        celebContainer.innerHTML = `<p class="error">Impossible de charger les célébrités : ${err.message}</p>`;
      });
  }

  // --- MENU BURGER ---
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }
});
