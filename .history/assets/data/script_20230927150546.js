var blogElement = document.querySelector(".blog");

let tabs = [];
let searchValue = "";
let applyFilter = false; // Flag to determine whether the filter should be applied

function fetchData() {
  fetch("assets/data/tabs2json4blog.json")
    .then((response) => response.json())
    .then((data) => {
      let filteredData = data; // Initialize filteredData with the original data
      if (applyFilter) {
        filteredData = data.filter((item) =>
          item["hostname"].includes(searchValue)
        );
        console.log("filteredData", filteredData.length);
      }
      tabs = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("tabs", tabs.length);
      loadMoreItems();
    });
}

// Event listener for search button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", fetchData(true));

/*
// Event listener for search button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  applyFilter = true; // Enable the filter
  fetchData();
});
*/

function search() {
  searchValue = document.getElementById("searchInput").value;
  console.log("Search value:", searchValue);
  document.getElementById("searchInput").value = "";
  return searchValue;
}

function convertHTMLTags(string) {
  const regex = /[<>]/g;
  const htmlEntities = {
    "<": "&lt;",
    ">": "&gt;",
  };
  return string.replace(regex, (match) => htmlEntities[match]);
}


// function fetchData() {
//   fetch("assets/data/tabs2json4blog.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const filteredData = data.filter((item) =>
//         item["title"].includes(searchInput)
//       );
//       // console.log(filteredData.length);
//       // console.log(filteredData);
//       const sortedData = filteredData.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );
//       // console.log(sortedData.length);
//       // console.log(sortedData);
//       tabs = sortedData;
//       // console.log(tabs.length);
//       // console.log(tabs);
//       return tabs;
//     });
//   loadMoreItems();
// }

let loadedItems = 0;
const itemsPerPage = 24;

function loadMoreItems() {
  let html = "";
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

fetchData();
