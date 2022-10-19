let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/";

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
      console.log(pokemon);
    });
  };

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
