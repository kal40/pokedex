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

  let getAll = function () {
    return pokemonList;
  };

  return {
    add: add,
    getAll: getAll,
  };
})();

pokemonRepository.getAll().forEach(function (item) {
  let displayInfo = `${item.name} (height: ${item.height})`;
  if (item.height > 0.6) {
    displayInfo += " - Wow, that’s big!";
  }
  document.write(`<p>${displayInfo}</p><br>`);
});
