document.addEventListener("DOMContentLoaded", () => {
  // === CONSTANTES GLOBALES ===
  const PATHS = {
    rooms: "chambres_nautilus_complet.json",
    menu: "menu_nautilus.json",
    services: "services.json",
    celebrities: "https://api.api-ninjas.com/v1/celebrity?nationality=FR",
    celebImages: {
      "alain delon": "assets/alainDelon.jpg",
      "vincent cassel": "assets/vincentCassel.jpg",
      "roman polanski": "assets/romanPolanski.PNG",
      "jean-paul goude": "assets/jeanPaulGoude.jpg",
      "martin solveig": "assets/martinSolveig.PNG",
    },
  };

  const API_KEY = "WKglzWknGdmBlhNhzT22hw==apgp6ydI5Ci3ZF53";

  // === UTILS ===
  const showLoading = (container) => {
    container.innerHTML = '<p class="loading">Chargement en cours...</p>';
  };

  const createRoomCard = (room) => `
  <article class="room-card">
    <h3>${room.name}</h3>
    <div class="guests">👤 ${room.capacity} pers.</div>
    <img src="${room.image}" alt="${room.name}">
    <div class="description">${room.description}</div>
    <div class="price">€${room.price}/nuit</div>
    <button class="btn-reserver" onclick="window.location.href='contact.html?room=${encodeURIComponent(
      room.name
    )}'">
      Réserver 
    </button>
  </article>`;

  const createMenuItem = (item) => `
    <article class="menu-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-info">
        <h4>${item.name} <small>${item.category}</small></h4>
        <p>${item.description}</p>
        <strong>€${item.price.toFixed(2)}</strong>
      </div>
    </article>`;

  // === CHAMBRES ===
  const roomsContainer = document.querySelector("#rooms");
  if (roomsContainer) {
    const params = new URLSearchParams(window.location.search);
    const nbGuests = parseInt(params.get("guests"), 10);
    const roomType = params.get("roomType");

    const matchesFilter = (room) => {
      const typeMatch = !roomType || room.type === roomType;
      const capacityMatch = !isNaN(nbGuests) ? room.capacity >= nbGuests : true;
      return typeMatch && capacityMatch;
    };

    showLoading(roomsContainer);
    fetch(PATHS.rooms)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((rooms) => {
        const filtered = rooms.filter(matchesFilter);
        roomsContainer.innerHTML = filtered.length
          ? filtered.map(createRoomCard).join("")
          : '<p class="no-results">Aucune chambre ne correspond à votre recherche.</p>';
      })
      .catch((err) => {
        roomsContainer.innerHTML = `<p class="error">Erreur de chargement des chambres (${err})</p>`;
      });
  }

  // === MENU RESTAURATION ===
  const menuContainer = document.querySelector("#menu");
  if (menuContainer) {
    showLoading(menuContainer);
    fetch(PATHS.menu)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((menus) => {
        menuContainer.innerHTML = "";
        ["Entrée", "Plat", "Dessert"].forEach((cat) => {
          const section = document.createElement("section");
          section.classList.add("menu-section");
          section.innerHTML = `<h2>${cat}</h2>`;
          menus
            .filter((item) => item.category === cat)
            .forEach((item) => (section.innerHTML += createMenuItem(item)));
          menuContainer.appendChild(section);
        });
      })
      .catch((err) => {
        menuContainer.innerHTML = `<p class="error">Erreur de chargement du menu (${err})</p>`;
      });
  }

  // === SERVICES ===
  const servicesContainer = document.querySelector("#services-list");
  if (servicesContainer) {
    showLoading(servicesContainer);
    fetch(PATHS.services)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((services) => {
        servicesContainer.innerHTML = services
          .map(
            (s) => `
          <div class="service-card">
            <img src="${s.image}" alt="${s.name}" class="service-img" />
            <i class="${s.icon}"></i>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
          </div>`
          )
          .join("");
      })
      .catch((err) => {
        servicesContainer.innerHTML = `<p class="error">Erreur de chargement des services (${err})</p>`;
      });
  }

  // === CÉLÉBRITÉS ===
  const celebContainer = document.querySelector("#celeb-list");
  if (celebContainer) {
    showLoading(celebContainer);
    fetch(PATHS.celebrities, {
      headers: { "X-Api-Key": API_KEY },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((celebs) => {
        celebContainer.innerHTML = celebs
          .slice(0, 5)
          .map((c) => {
            const name = c.name || "Célébrité anonyme";
            const key = name.toLowerCase();
            const imgSrc =
              PATHS.celebImages[key] || "assets/celebrities/default.jpg";
            const roles = c.occupation ? c.occupation.join(", ") : "Artiste";
            const anecdote = `En 2023, ${name} a séjourné dans notre Suite Corail pour un événement privé.`;
            return `
            <div class="celeb-card">
              <img src="${imgSrc}" alt="${name}" class="celeb-photo"/>
              <h4>${name} <small>(${roles}, ${
              c.country || "France"
            })</small></h4>
              <p>${anecdote}</p>
            </div>`;
          })
          .join("");
      })
      .catch((err) => {
        celebContainer.innerHTML = `<p class="error">Erreur de chargement des célébrités (${err})</p>`;
      });
  }

  // === MENU BURGER ===
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => navMenu.classList.toggle("open"));
    navMenu
      .querySelectorAll("a")
      .forEach((link) =>
        link.addEventListener("click", () => navMenu.classList.remove("open"))
      );
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove("open");
      }
    });
  }

  // === NAVBAR AUTO-HIDE ===
  const nav = document.querySelector("header");
  let hideNavbarTimer;
  function hideNavbar() {
    nav.classList.add("nav-hidden");
  }
  function showNavbar() {
    nav.classList.remove("nav-hidden");
    clearTimeout(hideNavbarTimer);
    hideNavbarTimer = setTimeout(hideNavbar, 3000);
  }
  if (nav) {
    document.addEventListener("mousemove", showNavbar);
    document.addEventListener("scroll", () => {
      nav.classList.remove("nav-hidden");
      clearTimeout(hideNavbarTimer);
    });
    hideNavbarTimer = setTimeout(hideNavbar, 3000);
  }

  // === CARTE DE CONTACT ===
  const mapElement = document.querySelector(".map-wrapper");
  if (mapElement) {
    const map = L.map(mapElement).setView([43.0161, 6.2108], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      minZoom: 2,
      maxZoom: 18,
    }).addTo(map);

    const submarineIcon = L.icon({
      iconUrl: "assets/icons/submarine.png",
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -40],
    });

    L.marker([43.0161, 6.2108], { icon: submarineIcon })
      .addTo(map)
      .bindPopup(
        "<strong>Hôtel Nautilus</strong><br>Bienvenue dans les profondeurs."
      );
  }
});
