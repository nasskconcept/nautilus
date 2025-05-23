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
      <img src="${room.image}" alt="${room.name}" class="room-img" />
      <h3>${room.name}</h3>
      <div class="guests">👤 ${room.capacity} personnes</div>
      <div class="description">${room.description}</div>
      <div class="price">€${room.price}/nuit</div>
      <button class="btn-reserver" data-room="${encodeURIComponent(
        room.name
      )}">Réserver</button>
    </article>
  `;

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

    const fakeDescriptions = {
      "alain delon":
        "Connu pour son élégance intemporelle, Alain Delon a profité de son séjour pour méditer dans notre Spa Nautilus et écrire un nouveau scénario.",
      "vincent cassel":
        "Toujours aussi dynamique, Vincent Cassel a organisé un tournage surprise dans la Suite Bulle d’Azur et initié le personnel aux claquettes.",
      "roman polanski":
        "Fasciné par la décoration marine, Roman Polanski a proposé de tourner une scène de film dans le restaurant sous-marin.",
      "jean-paul goude":
        "Inspiré par l’architecture, Jean-Paul Goude a esquissé une nouvelle fresque pour le hall d’entrée de l’hôtel.",
      "martin solveig":
        "Le célèbre DJ a improvisé une soirée électro sur le toit du Nautilus, rassemblant tous les clients jusqu’au petit matin.",
      default:
        "Invité spécial du Nautilus, cette célébrité a partagé un moment inoubliable lors d’un événement privé.",
    };

    const translateOccupation = (occ) => {
      const dict = {
        actor: "Acteur",
        actress: "Actrice",
        director: "Réalisateur",
        "film director": "Réalisateur",
        film_director: "Réalisateur",
        producer: "Producteur",
        film_producer: "Producteur",
        screenwriter: "Scénariste",
        singer: "Chanteur",
        musician: "Musicien",
        model: "Mannequin",
        dj: "DJ",
        composer: "Compositeur",
        writer: "Écrivain",
        photographer: "Photographe",
        painter: "Peintre",
        artist: "Artiste",
        dancer: "Danseur",
        comedian: "Humoriste",
        voice_actor: "Doubleur voix",
        soldier: "Militaire",
        television_producer: "Producteur TV",
      };
      if (Array.isArray(occ)) {
        return occ
          .map(
            (o) =>
              dict[o.toLowerCase().replace(/ /g, "_")] || o.replace(/_/g, " ")
          )
          .join(", ");
      }
      const key = occ.toLowerCase().replace(/ /g, "_");
      return dict[key] || occ.replace(/_/g, " ");
    };

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
            const roles = c.occupation
              ? translateOccupation(c.occupation)
              : "Artiste";
            const anecdote =
              fakeDescriptions[key] || fakeDescriptions["default"];
            return `
              <div class="celeb-card">
                <img src="${imgSrc}" alt="${name}" class="celeb-photo"/>
                <h4>${name}</h4>
                <p class="metier"><b>Métier :</b> ${roles}</p>
                <p class="desc">${anecdote}</p>
              </div>`;
          })
          .join("");
      })
      .catch((err) => {
        celebContainer.innerHTML = `<p class="error">Erreur de chargement des célébrités (${err})</p>`;
      });
  }

  // === REDIRECTIONS BOUTONS (RÉSERVATION CHAMBRE & TABLE) ===
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-reserver")) {
      const room = event.target.getAttribute("data-room");
      window.location.href = `contact.html?room=${room}`;
    }
    if (event.target.classList.contains("btn-reservation-table")) {
      window.location.href = "contact.html?table=1";
    }
  });

  // === NAVIGATION BURGER ===
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

  // === PRÉ-REMPLISSAGE RÉSERVATION TABLE (PAGE CONTACT) ===
  const params = new URLSearchParams(window.location.search);
  if (params.has("table")) {
    const now = new Date();
    const hour = now.getHours();
    const salutation = hour >= 18 ? "Bonsoir" : "Bonjour";
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
      messageField.value = `${salutation},\n\nNous souhaiterions réserver une table au nom de [votre nom] pour [nombre de personnes] personnes.\n\nMerci !`;
    }
  }
  // === PRÉ-REMPLISSAGE RÉSERVATION CHAMBRE (PAGE CONTACT) ===
  if (params.has("room")) {
    const roomName = decodeURIComponent(params.get("room"));
    const now = new Date();
    const hour = now.getHours();
    const salutation = hour >= 18 ? "Bonsoir" : "Bonjour";
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
      messageField.value =
        `${salutation},\n\n` +
        `Nous souhaiterions réserver la chambre « ${roomName} ».\n\n` +
        `Merci beaucoup !`;
    }
  }

  // === MODALE DE REMERCIEMENT POUR LE FORMULAIRE CONTACT ===
  const contactForm = document.querySelector("#contact form");
  const modalThankyou = document.getElementById("modal-thankyou");
  const closeModalBtn = document.querySelector(".modal-thankyou .close-modal");

  if (contactForm && modalThankyou) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            modalThankyou.classList.add("active");
            contactForm.reset();
          } else {
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
          }
        })
        .catch(() => {
          alert("Erreur réseau, veuillez réessayer.");
        });
    });

    closeModalBtn.addEventListener("click", () => {
      modalThankyou.classList.remove("active");
    });
    modalThankyou.addEventListener("click", (e) => {
      if (e.target === modalThankyou) modalThankyou.classList.remove("active");
    });
  }
});
