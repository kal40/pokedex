# Pokedex

## Description

This is a small web application with HTML, CSS, and JavaScript that loads Pokemon's data from an external [API](https://pokeapi.co/api/v2/pokemon/) and enables the viewing of data points in detail.

The main purpose of this app is to present how I create a JavaScript app.

This site was built using [GitHub Pages](https://pages.github.com/).

[LIVE DEMO](https://pokedex.smartcoder.dev/)

## Key Features

- Load data from an external source ([API](https://pokeapi.co/docs/v2))
- View all loaded Pokemon through individual cards on a responsive webpage
- Each card includes a button to load more details about the Pokemon
- Live search among the loaded Pokemons
- Loading indicator during data fetching
- On devices with touchscreen swiping between items on the modal

## Getting started

Clone the repository:

```shell
git clone https://github.com/kal40/pokedex.git
```

## Deployment

Create a GithHub account if you dont't have one and fork my repository. Then on GitHub go to your forked repository and under the `Settings -> Pages -> Build and deployment -> Branch` choose the master branch and `Save`. After a minute you can check your live copy of my app.

Or,

just clone the [repository](https://github.com/kal40/pokedex.git) into your webserver's root directory on any hosting provider.

## Dependencies

All dependencies are included in the code, no need to install anything else.

- Bootstrap 5.2.2 is used for the user interface elements. This version of Bootstrap does not require jQuery.
- The [PokeAPI](https://pokeapi.co/docs/v2) is used by the project.

## Code quality and performance

- [Javascript Minifier](https://www.toptal.com/developers/javascript-minifier) is used to remove unnecessary pieces of the file to decrease its file size.
- Performance was checked with Chrome developer tools on different network speeds and different CPU speeds. In the case of recursive functions, the `innerHTML` and `document.write()` commands were replaced by specific DOM manipulation commands like `classList.add`, `innerText`, `appendchild`, etc.
- ESLint was used for code quality and Prettier for code formatting.
- The app was tested on different screen sizes with Chrome developer tools.

## Future improvements

- Extend the information appears on the modal by adding the proper pokemon object keys to the `loadMoreDetails` function and then adding the same key's value to the `modalBody.innerHtml`.
- Load all pokemon names to allow search among all of them, not just among the onces that have already been loaded on the page.
