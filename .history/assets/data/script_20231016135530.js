var blogElement = document.querySelector(".blog");
var totalElement = document.querySelector(".navTotal");

let tabs = [];
let html = "";
let loadedItems = 0;
let currentItem = 0;
const itemsPerPage = 24;

function fetchData(inputValue) {
  currentItem = 0;
  loadedItems = 0;
  html = "";
  // Perform data fetching using the inputValue
  // console.log("Fetching data for:", inputValue);
  // ...rest of the code
  fetch("assets/data/tabs2json4blog.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("data:", data.length);
      // console.log("inputValue:", inputValue);
      if (inputValue) {
        let filteredData = data.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(inputValue.toLowerCase())
          )
        );

        // console.log("filteredData:", filteredData.length);
        tabs = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        // console.log("tabs:", tabs.length);
      } else {
        tabs = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      const uniqueHostnames = tabs.reduce((acc, item) => {
        acc[item.hostname] = true;
        return acc;
      }, {});
      const hostnamesCount = Object.keys(uniqueHostnames).length;
      console.log('Total unique hostnames:', hostnamesCount);
      sortedHostnames = (Object.keys(uniqueHostnames)).sort();
      console.log(sortedHostnames);

      const uniqueOgType = tabs.reduce((acc, item) => {
        acc[item["og:type"]] = true;
        return acc;
      }, {});
      const ogTypeCount = Object.keys(uniqueOgType).length;
      console.log('Total unique og:type:', ogTypeCount);
      sortedOgTypes = (Object.keys(uniqueOgType)).sort();
      console.log(sortedOgTypes);


      totalElement.innerHTML = `<div><p>Found: ${tabs.length} of ${data.length}</p></div>`;
      loadMoreItems();
    })
    .catch((error) => console.log(error));
}

/*
// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Add event listener to the search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  // Scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Use 'auto' for instant scroll
  });

  const inputValue = searchInput.value; // Get the input value
  fetchData(inputValue); // Call the fetchData function with the input value
});
*/

// Get references to the search input and search button
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Add event listener to the search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission
  performSearch();
});

// Add event listener for "Enter" key press on the search input
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    performSearch();
  }
});


// Function to handle the search action
function performSearch() {
  // Scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Use 'auto' for instant scroll
  });

  const inputValue = searchInput.value; // Get the input value
  fetchData(inputValue); // Call the fetchData function with the input value
}

function convertHTMLTags(string) {
  let clearString = "";
  const regex = /[<>]/g;
  const htmlEntities = {
    "<": "&lt;",
    ">": "&gt;",
  };
  if (typeof string !== "string") {
    clearString = string[0];
  } else {
    clearString = string;
  }
  return clearString.replace(regex, (match) => htmlEntities[match]);
}

function loadMoreItems() {
  if (tabs.length === 0) {
    blogElement.innerHTML = `
    <div class="nothing"><p>Nothing found</p></div>
    `;
    return;
  }
  const remainingItems = tabs.length - loadedItems;
  const itemsToLoad = Math.min(itemsPerPage, remainingItems);
  const nextItems = tabs.slice(loadedItems, loadedItems + itemsToLoad);

  nextItems.forEach((item) => {
    currentItem++;
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
          <div class="post-date">
            <div><p>${formattedDate}</p></div>
            <div><p>#${currentItem} of ${tabs.length}</p></div>
          </div>
          <img loading="lazy" src=${image} onerror="this.onerror=null; this.src='assets/images/placeholder.png';">
          <div class="post-date">
            <div><p>${formattedDate}</p></div>
            <div><p>#${currentItem} of ${tabs.length}</p></div>
          </div>
          
          <div class="post-hostname">${item.hostname}</div>
          <div class="post-og-type">#${item["og:type"]}</div>
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
