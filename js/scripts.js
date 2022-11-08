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

  let addListItem = function (pokemon, index) {
    loadBasicDetails(pokemon).then(function () {
      let col = document.createElement("div");
      col.classList.add("col");

      col.innerHTML = `
        <div class="card text-bg-dark text-center">
          <img src="${pokemon.imgFrontUrl}" class="card-img-top" alt="${pokemon.name} profile picture">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5><br>
            <a href="#" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#pokemon-modal" data-bs-pokemonIndex=${index}>More Details</a>
          </div>
        </div>`;

      let pokemonList = document.querySelector(".pokemon-list");
      pokemonList.appendChild(col);
    });
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
            name: capitalizeFirstLetter(item.name),
            detailUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.error(`Something went wrong: ${error}`);
      });
  };

  let loadBasicDetails = function (pokemon) {
    return fetch(pokemon.detailUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        pokemon.imgFrontUrl = json.sprites.front_default;
        pokemon.height = json.height;
      })
      .catch(function (error) {
        consol.error(`Oh, something went wrong: ${error}`);
      });
  };

  let loadMoreDetails = function (pokemon) {
    return fetch(pokemon.detailUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        pokemon.imgBackUrl = json.sprites.back_default;
        pokemon.height = json.height;
        pokemon.types = json.types;
        pokemon.abilities = json.abilities;
      })
      .catch(function (error) {
        consol.error(`Oh, something went wrong: ${error}`);
      });
  };

  let getTypes = function (pokemon) {
    let types = "";
    pokemon.types.forEach(function (item, index) {
      index > 0 ? (types += `, ${item.type.name}`) : (types += item.type.name);
    });
    return types;
  };

  let getAbilities = function (pokemon) {
    let abilities = "";
    pokemon.abilities.forEach(function (item, index) {
      index > 0
        ? (abilities += `, ${item.ability.name}`)
        : (abilities += item.ability.name);
    });
    return abilities;
  };

  // ===============================================================================
  // === Modal
  // ===============================================================================

  const pokemonModal = document.getElementById("pokemon-modal");
  pokemonModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const pokemonIndex = button.getAttribute("data-bs-pokemonIndex");

    loadMoreDetails(pokemonList[pokemonIndex]).then(function () {
      const modalTitle = pokemonModal.querySelector(".modal-title");
      const modalBodyInput = pokemonModal.querySelector(".modal-body");
      modalTitle.innerText = pokemonList[pokemonIndex].name;
      modalBodyInput.innerHTML = `
      <div class="container-fluid">
        <div class="row row-cols-auto justify-content-around">
          <div class="col-5">
            <img src="${pokemonList[pokemonIndex].imgFrontUrl}" alt="${
        pokemonList[pokemonIndex].name
      }">
          </div>
          <div class="col-5">
            <img src="${pokemonList[pokemonIndex].imgBackUrl}"  alt="${
        pokemonList[pokemonIndex].name
      }">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Height: ${pokemonList[pokemonIndex].height}</p>
            <p>Types: ${getTypes(pokemonList[pokemonIndex])}</p>
            <p>Abilities: ${getAbilities(pokemonList[pokemonIndex])}</p>
            </div>
        </div>
      </div>
        `;
    });
  });

  pokemonModal.addEventListener("hidden.bs.modal", (event) => {
    const modalTitle = pokemonModal.querySelector(".modal-title");
    const modalBodyInput = pokemonModal.querySelector(".modal-body");
    modalTitle.innerText = "";
    modalBodyInput.innerHTML = "";
  });

  // ===============================================================================
  // === Utility Functions
  // ===============================================================================

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadBasicDetails: loadBasicDetails,
    getAll: getAll,
  };
})();

// ===============================================================================
// === Main
// ===============================================================================

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon, index) {
    pokemonRepository.addListItem(pokemon, index);
  });
});
