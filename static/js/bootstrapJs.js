//front page effects
document.addEventListener("DOMContentLoaded", function () {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
});

//message placeholder
function winScrolling() {
  const container = document.getElementById("messagebox");
  container.scrollBy({
    top: 10,
    behavior: "smooth", // Adds smooth scrolling
  });
  // setTimeout(winScrolling, 20);
  container.innerHTML -= placeholderHTML;
}

function sendMessaage() {}

function appendPlaceholder() {
  // The HTML content you want to append
  const placeholderHTML = `
    <p class="card-text placeholder-glow">
        <span class="placeholder col-8"></span>
        <span class="placeholder col-5"></span>

        <span class="placeholder col-4"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
        <span class="placeholder col-5"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
    </p>
  `;

  // Append the content to the container
  const container = document.getElementById("messagebox");
  container.innerHTML += placeholderHTML;

  // Scroll the document to the bottom of the page

  // Set a random timeout for the next append (between 1 and 5 seconds)
  // const randomDelay = Math.floor(Math.random() * 5000) + 1000;
  console.log("working");
}

// Start the process when the page loads
// window.onload = function () {
//   appendPlaceholder();
//   winScrolling();
// };
