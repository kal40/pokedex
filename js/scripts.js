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

pokemonList.forEach(function (item) {
  let displayInfo = `${item.name} (height: ${item.height})`;
  if (item.height > 0.6) {
    displayInfo += " - Wow, that’s big!";
  }
  document.write(`<p>${displayInfo}</p><br>`);
});
