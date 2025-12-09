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

// function to give adminAcces to the web site
function adminAccess() {
  return localStorage.getItem("token") !== null;
}

// condition if function adminAcces is fullfiled
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
  const btnModifiedWorks = document.createElement("button");
  btnModifiedWorks.textContent = "modifier";
  fontAwesome_a.appendChild(btnModifiedWorks);
  const fontAwesome = document.createElement("i");
  fontAwesome.classList.add("fa-solid", "fa-pen-to-square");
  fontAwesome_a.appendChild(fontAwesome);
  fontAwesome_a.classList.add("font-awesome-a");

  // btnModifiedWorks open the modale
  btnModifiedWorks.addEventListener("click", () => {
    launchModale();
  });

  // change login to logout
  const aLogin = document.getElementById("a-login");
  aLogin.textContent = "logout";

  // disconnect when token is remove
  aLogin.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

// function that start modale
function launchModale() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const modale = document.createElement("div");
  modale.classList.add("modale");
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-xmark");
  modale.appendChild(closeIcon);
  const titleModale = document.createElement("h4");
  titleModale.innerText = "Galerie photo";
  modale.appendChild(titleModale);
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("img-container");
  modale.appendChild(imgContainer);
  allWorks.forEach((works) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    const imgProject = document.createElement("img");
    imgProject.src = works.imageUrl;
    const trashCan = document.createElement("i");
    trashCan.classList.add("fa-solid", "fa-trash-can");
    trashCan.addEventListener("click", () => {
      deleteWorks(works.id, imageWrapper);
    });
    imageWrapper.appendChild(imgProject);
    imageWrapper.appendChild(trashCan);
    imgContainer.appendChild(imageWrapper);
  });
  modale.appendChild(imgContainer);

  // We create the form in the modale
  const divFormModale = document.createElement("div");
  divFormModale.classList.add("formModale");
  const formModale = document.createElement("form");
  const btnAddImg = document.createElement("button");
  btnAddImg.textContent = "Ajouter une photo";
  btnAddImg.addEventListener("click", () => {
    launchModalAddPicture();
  });
  divFormModale.appendChild(formModale);
  divFormModale.appendChild(btnAddImg);
  modale.appendChild(divFormModale);

  // add modale to overlay
  document.body.appendChild(overlay);
  overlay.appendChild(modale);

  document.body.classList.add("modale-active");

  closeIcon.addEventListener("click", () => {
    modale.remove();
    overlay.remove();
  });

  overlay.addEventListener("click", () => {
    modale.remove();
    overlay.remove();
  });
}

// function to delete any works

async function deleteWorks(workId, ElementToRemove) {
  const token = localStorage.getItem("token");
  const request = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // if request is ok, we delete work that got same id
  if (request.ok === true) {
    ElementToRemove.remove();
    const workfilter = allWorks.filter((work) => work.id !== workId);
    loadWorks(workfilter);
  }
}

// async function sendNewWorks(){

//   const request = await fetch("http://localhost:5678/api/works",{
//     method: "POST",
//     headers: "Content-type: application/json",
//     image:,
//     title:,
//     category:
//   });
// }

function launchModalAddPicture() {
  const categories = fetch("http://localhost:5678/api/categories").then(
    (response) => response.json()
  );
  const modal = document.createElement("div");
  const previousPage = document.createElement("i");
  previousPage.classList.add("fa-solid", "fa-arrow-left");
  modal.appendChild(previousPage);
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-xmark");
  modal.appendChild(closeIcon);
  const titleModal = document.createElement("h4");
  titleModal.innerText = "Ajout photo";
  modal.appendChild(titleModal);
  const selectPicture = document.createElement("i");
  selectPicture.classList.add("fa-regular", "fa-image");
  modal.appendChild(selectPicture);
  const buttonAddPicture = document.createElement("button");
  buttonAddPicture.textContent = "+ Ajouter photo";
  modal.appendChild(buttonAddPicture);
  const info = document.createElement("p");
  info.innerText = "jpg, png : 4mo max";
  modal.appendChild(info);

  // create form

  const divForm = document.createElement("div");
  const form = document.createElement("form");
  divForm.appendChild(form);
  const labelTitle = document.createElement("label");
  labelTitle.innerText = "Titre";
  form.appendChild(labelTitle);
  const inputTitle = document.createElement("input");
  labelTitle.appendChild(inputTitle);
  const selectCategories = document.createElement("select");
  categories.forEach((element) => {
    const option = document.createElement("option");
    option.value = element.id;
    option.innerText = element.name;
    selectCategories.appendChild(categories);
  });
  form.appendChild(selectCategories);
  modal.appendChild(form);
  document.body.appendChild(modal);
}
