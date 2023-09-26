// Получить элемент, куда вы хотите поместить созданный HTML
// const blog = document.getElementBy("blog");
// var blogElements = document.getElementsByClassName("blog");
// var firstBlogElement = blogElements[0];
var blogElement = document.querySelector(".blog");

var tabs = [];
let html = "";

// function fetchData() {
//   // showPreloader();
//   fetch("assets/data/tabs2json4blog.json")
//     .then((response) => response.json())
//     .then((data) => {
//       // Sort the data
//       const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

//       return sortedData;
//     })
//     .then((sortedData) => {
//       // Process the sorted data
//       // ...

//       // hidePreloader();
//       return sortedData;
//     })
//     .then((sortedData) => {
//       // Load more items
//       // ...
//       loadMoreItems(sortedData);
//     })
//     .catch((error) => {
//       console.error("An error occurred:", error);
//       // hidePreloader();
//     });
// }
function convertHTMLTags(string) {
  const regex = /[<>]/g;
  const htmlEntities = {
    "<": "&lt;",
    ">": "&gt;",
  };
  return string.replace(regex, (match) => htmlEntities[match]);
}

function fetchData() {
  fetch("assets/data/tabs2json4blog.json")
    .then((response) => response.json())
    .then((data) => {

      const filteredData = data.filter((item) => {
        // Replace "key" with the key you want to filter by
        return item.key === "value";
      });

      // Sort the data
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return sortedData;
    })
    .then((sortedData) => {
      tabs = sortedData;
      loadMoreItems();
    });
}

let loadedItems = 0; // Number of items already loaded
const itemsPerPage = 24; // Number of items to load per page

// Function to load more items from the JSON array

function loadMoreItems() {
  const remainingItems = tabs.length - loadedItems;
  const itemsToLoad = Math.min(itemsPerPage, remainingItems);

  // Load the next batch of items from the JSON array
  const nextItems = tabs.slice(loadedItems, loadedItems + itemsToLoad);

  // Process and display the nextItems as needed
  nextItems.forEach((item) => {
    // Process the item and add it to the page
    // Format date
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

    // Create HTML element
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
    // Insert the HTML element into the DOM
    blogElement.innerHTML = html;
  });
  loadedItems += itemsToLoad;
}
// // Example: create HTML elements and append them to a container
// const itemElement = document.createElement("div");
// itemElement.textContent = item.name;
// document.getElementById("itemsContainer").appendChild(itemElement);

// Function to check if the user has scrolled to the bottom of the page
function checkScroll() {
  // const scrollPosition = window.innerHeight + window.pageYOffset;
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight) {
    loadMoreItems();
  }
}

// loadMoreItems();

// Attach the checkScroll function to the scroll event
window.addEventListener("scroll", checkScroll);

fetchData();

// Wrap the initial loading of items in the window load event listener
// window.addEventListener("load", () => {
//   fetchData();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   showPreloader();
//   // console.log("Page loaded!");
// });

// Show preloader
// function showPreloader() {
//   const preloader = document.getElementById("preloader");
//   preloader.style.display = "block";
// }

// Hide preloader
// function hidePreloader() {
//   const preloader = document.getElementById("preloader");
//   preloader.style.display = "none";
// }

// Function to load data from file

// Call the fetchData function to initiate the data fetching process
// fetchData();
