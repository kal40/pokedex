let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      types: ["Monster", "Grass"],
    },
    {
      name: "Charmander",
      height: 0.6,
      types: ["Monster", "Dragon"],
    },
    {
      name: "Squirtle",
      height: 0.5,
      types: ["Monster", "Water 1"],
    },
  ];

  let add = function (item) {
    //input verification
    const requiredKeys = ["name", "height", "types"];
    let inputKeys = Object.keys(item);
    if (typeof item === "object" && inputKeys.length !== 0) {
      for (let index = 0; index < inputKeys.length; index++) {
        if (inputKeys[index] !== requiredKeys[index]) {
          console.log("Not proper keys are used.");
          return;
        }
      }
      //adding the item after verification
      pokemonList.push(item);
    } else {
      console.log("Not an object or empty object.");
      return;
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

  let showDetails = function (pokemon) {
    console.log(pokemon.name);
  };

  return {
    add: add,
    addListItem: addListItem,
    getAll: getAll,
  };
})();

pokemonRepository.getAll().forEach(function (pokemon) {
  pokemonRepository.addListItem(pokemon);
});
