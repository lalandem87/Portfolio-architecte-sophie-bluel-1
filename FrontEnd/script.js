let allWorks = []; // Store works globally to avoid re-fetching

async function loadWorks(worksToDisplay = null) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Clear gallery

  // Use provided works or fetch if not available
  const works = worksToDisplay || allWorks;

  works.forEach((element) => {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.style.marginBottom = "10px";
    const titreImage = document.createElement("h3");
    titreImage.textContent = element.title;
    article.appendChild(img);
    article.appendChild(titreImage);
    gallery.appendChild(article);
  });
}

async function initGallery() {
  // Fetch works once
  const response = await fetch("http://localhost:5678/api/works");
  allWorks = await response.json();

  // Display all works initially
  loadWorks(allWorks);
}

function setActiveButton(activeBtn) {
  // Reset all buttons
  document.querySelectorAll(".works-filter button").forEach((btn) => {
    btn.style.background = "";
    btn.style.color = "";
  });

  // Set active button
  activeBtn.style.background = "#1D6154";
  activeBtn.style.color = "#FFFFFF";
}

async function loadCategories() {
  const filterPart = document.querySelector(".works-filter");

  // Create "Tous" button
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  filterPart.appendChild(btnAll);

  // Set "Tous" as active initially
  setActiveButton(btnAll);

  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll);
    loadWorks(allWorks); // Display all works
  });

  // Fetch categories
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  categories.forEach((category) => {
    const btnFilter = document.createElement("button");
    btnFilter.textContent = category.name;
    filterPart.appendChild(btnFilter);

    btnFilter.addEventListener("click", () => {
      setActiveButton(btnFilter);

      // Filter works by category
      const filteredWorks = allWorks.filter(
        (work) => work.category.name === category.name
      );
      loadWorks(filteredWorks);
    });
  });
}

// Initialize everything
initGallery();
loadCategories();

function adminAccess() {
  return localStorage.getItem("token") !== null;
}

if (adminAccess()) {
  const editMode = document.getElementById("mode-edition");
  editMode.style.display = "flex";
  const sentenceModeEdition = document.createElement("p");
  sentenceModeEdition.innerText = "Mode edition";
  editMode.appendChild(sentenceModeEdition);
  editMode.classList.add("adminEditMode");
  const FilterPart = document.querySelector(".works-filter");
  FilterPart.style.display = "none";
  const adminMyProject = document.getElementById("admin-my-project");
  adminMyProject.classList.add("admin-my-project");
  const fontAwesome_a = document.getElementById("font-awesome-a");
  const modifiedWorks = document.createElement("a");
  modifiedWorks.innerText = "modifier";
  fontAwesome_a.appendChild(modifiedWorks);
  const fontAwesome = document.createElement("i");
  fontAwesome.classList.add("fa-solid", "fa-pen-to-square");
  fontAwesome_a.appendChild(fontAwesome);
  fontAwesome_a.classList.add("font-awesome-a");
  const aLogin = document.getElementById("a-login");
  aLogin.textContent = "logout";
  aLogin.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}
