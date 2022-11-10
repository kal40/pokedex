# Pokedex

## Description

This is a small web application with HTML, CSS, and JavaScript that loads Pokemon's data from an external [API](https://pokeapi.co/api/v2/ability/?limit=99) and enables the viewing of data points in detail.

This site was built using [GitHub Pages](https://pages.github.com/)and can be viewed here: [Pokedex](https://kal40.github.io/pokedex/)

The main purpose of this app is to present how I create the architecture of a JavaScript app, as well as how I test and debug my code.

## Key Features

- Load data from an external source ([API](https://pokeapi.co/api/v2/ability/?limit=99))
- View all loaded Pokemon through individual cards on a responsive webpage
- Each card includes a button to load more details about the Pokemon
- Live search among the loaded Pokemons
- Loading indicator during data fetching
- Swiping between items on the modal

## Dependences

- It requires an active internet connection for loading the data from the external API otherwise throws an error message.
- Bootstrap 5.2.2 is used for the user interface elements. This version of Bootstrap does not require jQuery.
- The [PokeAPI](https://pokeapi.co/docs/v2) is used by the project.

## Code quality and performance

- [Javascript Minifier](https://www.toptal.com/developers/javascript-minifier) is used to remove unnecessary pieces of the file to decrease its file size.
- Performance was checked with Chrome developer tools on different network speeds and different CPU speeds. In the case of recursive functions, the `innerHTML` and `document.write()` commands were replaced by specific DOM manipulation commands like `classList.add`, `innerText`, `appendchild`, etc.
- ESLint was used for code quality and Prettier for code style analyzing
- The app was tested on different screen sizes with Chrome developer tools.

## Scalability

The number of Pokemons can be changed with the number at the end of the `apiURL` global variable.
The Pokemon's additional details on the modal can be extended by adding the proper pokemon object keys to the `loadMoreDetails` function and then adding the same keys to the `modalBody.innerHtml`.
