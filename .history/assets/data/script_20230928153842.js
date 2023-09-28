var blogElement = document.querySelector(".blog");
let tabs = [];
let html = "";
let applyFilter = false;
let searchValue = "";
let loadedItems = 0;
const itemsPerPage = 24;

function fetchData(applyFilter, searchValue) {
  fetch("./assets/data/tabs2json4blog.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data.length);
      if (applyFilter) {
        loadedItems = 0;
        let filteredData = data.filter((item) =>
          item["hostname"].includes(searchValue)
        );
        console.log("filteredData", filteredData.length);
        tabs = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        tabs = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      console.log("tabs", tabs.length);
      loadMoreItems();

    }
    .catch ((error) => console.log(error)););
}

function search() {
  const searchValue = document.getElementById("searchInput").value;
  console.log("Search value:", searchValue);
  return searchValue;
}

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function() {
  const searchValue = search();
  fetchData(true, searchValue);
});

function convertHTMLTags(string) {
  const regex = /[<>]/g;
  const htmlEntities = {
    "<": "&lt;",
    ">": "&gt;",
  };
  return string.replace(regex, (match) => htmlEntities[match]);
}


function loadMoreItems() {
  const remainingItems = tabs.length - loadedItems;
  const itemsToLoad = Math.min(itemsPerPage, remainingItems);
  const nextItems = tabs.slice(loadedItems, loadedItems + itemsToLoad);

  nextItems.forEach((item) => {
    const dateString = item.date;
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    let formattedDate = date.toLocaleDateString("en-US", options);

    let title = item["og:title"];
    if (!title) {
      title = item.title;
    }
    if (!title) {
      title = "";
    }
    title = convertHTMLTags(title);

    let description = item["og:description"];
    if (!description) {
      description = item.description;
    }
    if (!description) {
      description = "";
    }
    description = convertHTMLTags(description);

    let image = item["og:image"];
    if (!image) {
      image = "assets/images/placeholder.png";
    }

    html += `
        <div class="conteudo post-info col-12 col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
          <div class="post-date">${formattedDate}</div>
          <img loading="lazy" src=${image} onerror="this.onerror=null; this.src='assets/images/placeholder.png';">
          <div class="post-hostname">${item.hostname}</div>
          <h3 class="post-title">
            <a href="${item.url}" target="_blank">${title}</a>
          </h3>
          <div class="post-description">${description}</div>
      </div>
    `;

    blogElement.innerHTML = html;
  });
  loadedItems += itemsToLoad;
}

function checkScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight) {
    loadMoreItems();
  }
}

window.addEventListener("scroll", checkScroll);

fetchData(false);
