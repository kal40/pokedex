let pokemonRepository = (function () {
  // ===============================================================================
  // === App global variables
  // ===============================================================================

  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/";

  // ===============================================================================
  // === App
  // ===============================================================================

  let add = function (pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon object is not correct.");
    }
  };

  let addPokemonEventListener = function (element, pokemon) {
    element.addEventListener("click", () => showDetails(pokemon));
  };

  let addListItem = function (pokemon) {
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("pokemon-list__item");
    addPokemonEventListener(button, pokemon);

    let listItem = document.createElement("li");
    listItem.appendChild(button);

    let pokemonList = document.querySelector(".pokemon-list");
    pokemonList.appendChild(listItem);
  };

  let getAll = function () {
    return pokemonList;
  };

  let loadList = function () {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.error(`Something went wrong: ${error}`);
      });
  };

  let loadDetails = function (pokemon) {
    return fetch(pokemon.detailUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        pokemon.imgUrl = json.sprites.front_default;
        pokemon.height = json.height;
      })
      .catch(function (error) {
        consol.error(`Oh, something went wrong: ${error}`);
      });
  };

  let showDetails = function (pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon.name, `Height: ${pokemon.height}`, pokemon.imgUrl);
    });
  };

  // ===============================================================================
  // === Modal
  // ===============================================================================

  function showModal(title, text, imageUrl) {
    let modalOverlay = document.querySelector(".modal__overlay");

    // Clear all existing modal content
    modalOverlay.innerHTML = "";

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal__container");

    // Add the new modal content
    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal__close");
    closeButtonElement.innerText = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    let titleElement = document.createElement("h1");
    titleElement.innerText = title;
    titleElement.classList.add("modal__title");

    let contentElement = document.createElement("p");
    contentElement.innerText = text;
    contentElement.classList.add("modal__content");

    let imageElement = document.createElement("img");
    //consol.log("blabla");
    imageElement.src = imageUrl;
    imageElement.alt = "Pokemon profile image";
    imageElement.classList.add("modal__image");

    modalContainer.appendChild(closeButtonElement);
    modalContainer.appendChild(titleElement);
    modalContainer.appendChild(contentElement);
    modalContainer.appendChild(imageElement);
    modalOverlay.appendChild(modalContainer);

    modalOverlay.classList.add("is-visible");

    modalOverlay.addEventListener("click", (event) => {
      // Since this is also triggered when clicking INSIDE the modal
      // We only want to close if the user clicks directly on the overlay
      let target = event.target;
      if (target === modalOverlay) {
        hideModal();
      }
    });
  }

  function hideModal() {
    let modalOverlay = document.querySelector(".modal__overlay");
    modalOverlay.classList.remove("is-visible");
  }

  window.addEventListener("keydown", (event) => {
    let modalOverlay = document.querySelector(".modal__overlay");
    if (
      event.key === "Escape" &&
      modalOverlay.classList.contains("is-visible")
    ) {
      hideModal();
    }
  });

  return {
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadList: loadList,
    getAll: getAll,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
