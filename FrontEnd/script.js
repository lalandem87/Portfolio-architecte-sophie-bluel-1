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
const btnAll = document.createElement("button");
btnAll.textContent = "Tous";
filterPart.appendChild(btnAll);

async function loadCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  for (let i = 0; i < categories.length; i++) {
    const btnfilters = document.createElement("button");
    btnfilters.textContent = categories[i].name;
    filterPart.appendChild(btnfilters);
  }
}

loadCategories();
