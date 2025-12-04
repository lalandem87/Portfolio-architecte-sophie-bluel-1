async function loadWorks() {
  const responses = await fetch("http://localhost:5678/api/works");
  const works = await responses.json();

  const gallery = document.querySelector(".gallery");
  works.forEach((element) => {
    const article = document.createElement("article");
    gallery.appendChild(article);
    const img = document.createElement("img");
    img.src = element.imageUrl;
    const titreImage = document.createElement("h3");
    titreImage.textContent = element.title;
    article.appendChild(img);
    img.style.marginBottom = "10px";
    article.appendChild(titreImage);
  });
}
loadWorks();

const filterPart = document.querySelector(".works-filter");
const gallery = document.querySelector(".gallery"); // Ajouté pour que gallery soit accessible
const btnAll = document.createElement("button");
btnAll.textContent = "Tous";
filterPart.appendChild(btnAll);

async function loadCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  const worksResponse = await fetch("http://localhost:5678/api/works");
  const works = await worksResponse.json();

  for (let i = 0; i < categories.length; i++) {
    const btnfilters = document.createElement("button");
    btnfilters.textContent = categories[i].name;
    filterPart.appendChild(btnfilters);

    btnfilters.addEventListener("click", (event) => {
      const categorieChoose = event.target.textContent;
      gallery.innerHTML = "";
      document.querySelectorAll("button").forEach((btn) => {
        btn.style.background = "";
        btn.style.color = "";

        event.target.style.background = "#1D6154";
        event.target.style.color = "#FFFFFF";
      });
      for (let i = 0; i < works.length; i++) {
        if (categorieChoose === works[i].category.name) {
          const article = document.createElement("article");
          const img = document.createElement("img");
          const titreImage = document.createElement("h3");
          img.src = works[i].imageUrl;
          titreImage.textContent = works[i].title;
          article.appendChild(img);
          article.appendChild(titreImage);
          gallery.appendChild(article);
        }
      }
    });
  }

  btnAll.addEventListener("click", () => {
    gallery.innerHTML = "";

    // Réinitialiser tous les autres boutons
    document.querySelectorAll("button").forEach((btn) => {
      btn.style.background = "";
      btn.style.color = "";
    });

    // Activer seulement "Tous"
    btnAll.style.background = "#1D6154";
    btnAll.style.color = "#FFFFFF";

    loadWorks();
  });
}

loadCategories();
