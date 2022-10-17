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

for (let index = 0; index < pokemonList.length; index++) {
  let displayInfo = `${pokemonList[index].name} (height: ${pokemonList[index].height})`;
  if (pokemonList[index].height > 0.6) {
    displayInfo += " - Wow, that’s big!";
  }
  document.write(`<p>${displayInfo}</p><br>`);
}
