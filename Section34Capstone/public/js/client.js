const $sortOrderImg = $("#sort-order-img");
const $toggleBtn = $("#sort-order-toggle");
const $orderInput = $("#order-input");
const $sortSelect = $("#sort");
const $sortForm = $("#sort-form");
const $discordLogoImg = $("footer > div > img");
const $addBtn = $("#add-btn");
const $formContainer = $("#new-book-form-container");

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Function to update arrow image based on order and theme
function updateSortOrderImage() {
  const isDark = darkModeQuery.matches;
  const order = $toggleBtn.data("order");

  const color = isDark ? "white" : "black";
  const direction = order === "ASC" ? "up" : "down";

  $sortOrderImg.attr("src", `/images/${direction}-${color}.png`);
}

// Update discord logo and arrow image
function updateLogo(e) {
  $discordLogoImg.attr("src", e.matches ? "/images/discord-logo-white.svg" : "/images/discord-logo-black.svg");
  updateSortOrderImage();
}

// Initial update
updateLogo(darkModeQuery);
darkModeQuery.addEventListener("change", updateLogo);

// Submit sort form when dropdown changes
$sortSelect.on("change", () => {
  $sortForm.submit();
});

// Toggle sort order and submit
$toggleBtn.on("click", function (e) {
  e.preventDefault();

  const current = $(this).data("order");
  const newOrder = current === "ASC" ? "DESC" : "ASC";

  $(this).data("order", newOrder);
  $orderInput.val(newOrder);

  updateSortOrderImage();
  $sortForm.submit();
});

// Show the new book form
$addBtn.on("click", function () {
  if ($("#new-book-form").length) return;

  $(this).hide();

  const $form = $(`
  <form id="new-book-form" method="POST" action="/add">
    <input
      type="text"
      name="title"
      placeholder="Title"
      class="new-book-title"
      autocomplete="off"
    />
    <input
      type="text"
      class="new-book-author"
      name="author"
      placeholder="Author"
      autocomplete="off"
    />

    <div class="new-book-info">
      <div id="new-book-rating">
        <label for="rating">Rating:</label>
        <div>
          <input id="rating" type="text" name="rating" autocomplete="off" />
          <span>/10</span>
        </div>
      </div>

      <div id="new-book-date">
        <label for="date">Date:</label>
        <input id="date" type="date" name="date" autocomplete="off" />
      </div>

      <div id="new-book-isbn">
        <label for="isbn">ISBN:</label>
        <input id="isbn" type="text" name="isbn" autocomplete="off"/>
      </div>
    </div>

    <hr class="new-book-hr" />

    <textarea
      name="comment"
      placeholder="Share your thoughts about the book..."
      class="new-book-comment"
    ></textarea>

    <div class="new-book-buttons">
      <button type="button" id="cancel-new-book">Cancel</button>
      <button type="submit" id="submit-new-book">Add Book</button>
    </div>
  </form>
  `);

  $formContainer.append($form);

  // Input validation logic
  $formContainer.on("submit", "#new-book-form", function (e) {
    e.preventDefault();

    const fields = {
      title: $("input[name='title']"),
      author: $("input[name='author']"),
      isbn: $("#isbn"),
      rating: $("#rating"),
      date: $("#date"),
      comment: $("textarea[name='comment']")
    };

    const regex = {
      isbn: /^\d{13}$/,
      rating: /^(10|[1-9])$/
    };

    let isValid = true;

    // Reset styles
    Object.values(fields).forEach(($field) => {
      $field.css("border-bottom-color", "");
    });

    // Title: non-empty
    if (!fields.title.val().trim()) {
      fields.title.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    // Author: non-empty
    if (!fields.author.val().trim()) {
      fields.author.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    // ISBN: must be 13 digits
    if (!regex.isbn.test(fields.isbn.val().trim())) {
      fields.isbn.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    // Rating: must be 1–10 inclusive
    if (!regex.rating.test(fields.rating.val().trim())) {
      fields.rating.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    // Date: non-empty
    if (!fields.date.val().trim()) {
      fields.date.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    // Comment: non-empty
    if (!fields.comment.val().trim()) {
      fields.comment.css("border-bottom-color", "#d42f2f");
      isValid = false;
    }

    if (isValid) this.submit();
  });

  $("#cancel-new-book").on("click", function () {
    $formContainer.empty();
    $addBtn.show();
  });
});

// Detect Edit button click
$(document).on("click", ".edit-entry", function () {
  const isbn = $(this).data("id");
  console.log("Edit clicked for ISBN:", isbn);
  // TODO: Trigger edit flow (open a form with prefilled values)
});

// Detect Delete button click
$(document).on("click", ".delete-entry", async function () {
  const isbn = $(this).data("id");

  try {
    const response = await fetch("/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isbn })
    });

    if (response.ok) {
      $(this).closest(".book-entry").remove();
    } else {
      console.error("Delete failed");
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
});


updateSortOrderImage(); // Initial update of the sort arrow
