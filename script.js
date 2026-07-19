

const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".project-card");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    cards.forEach(card => {

        const title = card.textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

});


document.addEventListener("keydown", function (e) {

    if (e.key === "/") {

        e.preventDefault();

        searchInput.focus();

    }

});


document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        searchInput.value = "";

        cards.forEach(card => {

            card.style.display = "";

        });

    }

});