/*global bootstrap*/

let pokemonRepository = (function () {
  // ===============================================================================
  // === App global variables
  // ===============================================================================

  let pokemonList = [];
  let pokemonQuantity = 50;
  let apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${pokemonQuantity}`;

  // ===============================================================================
  // === App
  // ===============================================================================

  let add = function (pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.error('Pokemon object is not correct.');
    }
  };

  let addListItem = function (pokemon, pokemonIndex) {
    let card = document.createElement('div');
    card.classList.add('card', 'text-bg-dark', 'text-center');
    card.setAttribute('id', `${pokemon.name}-card`);
    let img = document.createElement('img');
    img.id = pokemonIndex;
    img.loading = 'lazy';
    img.height = 144;
    img.width = 144;
    img.classList.add('card-img-top', 'loader-img');
    let divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');
    let cardHeading = document.createElement('h5');
    cardHeading.classList.add('card-title');
    cardHeading.innerText = pokemon.name;
    let cardButton = document.createElement('a');
    cardButton.classList.add('btn', 'btn-outline-success');
    cardButton.setAttribute('href', '#');
    cardButton.setAttribute('data-bs-toggle', 'modal');
    cardButton.setAttribute('data-bs-target', '#pokemon-modal');
    cardButton.setAttribute('data-bs-pokemonIndex', pokemonIndex);
    cardButton.innerText = 'More Details';
    let pokemonList = document.querySelector('.pokemon-list');

    divCardBody.appendChild(cardHeading);
    divCardBody.appendChild(cardButton);

    card.appendChild(img);
    card.appendChild(divCardBody);

    pokemonList.appendChild(card);
  };

  let getAll = function () {
    return pokemonList;
  };

  let loadList = function () {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        for (const item of json.results) {
          let pokemon = {
            name: capitalizeFirstLetter(item.name),
            detailUrl: item.url,
          };
          add(pokemon);
        }
      })
      .then(function () {
        pokemonList.forEach(function (pokemon, pokemonIndex) {
          fetch(pokemon.detailUrl)
            .then(function (response) {
              return response.json();
            })
            .then(function (json) {
              pokemon.imgFrontUrl = json.sprites.front_default;
              pokemon.id = json.id;
              let imgPokemon = document.querySelector(`[id="${pokemonIndex}"]`);
              imgPokemon.addEventListener('load', function () {
                imgPokemon.classList.remove('loader-img');
                imgPokemon.alt = `${pokemon.name} profile picture`;
              });
              imgPokemon.src = pokemon.imgFrontUrl;
            })
            .catch(function (error) {
              console.error(`Oh, something went wrong: ${error}`);
            });
        });
        hideLoadingMessage();
      })
      .catch(function (error) {
        console.error(`Something went wrong: ${error}`);
        hideLoadingMessage();
      });
  };

  let loadMoreDetails = function (pokemon) {
    showLoadingMessage();
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
        console.error(`Oh, something went wrong: ${error}`);
        hideLoadingMessage();
      });
  };

  let getTypes = function (pokemon) {
    let types = '';
    pokemon.types.forEach(function (item, index) {
      index > 0 ? (types += `, ${item.type.name}`) : (types += item.type.name);
    });
    return types;
  };

  let getAbilities = function (pokemon) {
    let abilities = '';
    pokemon.abilities.forEach(function (item, index) {
      index > 0
        ? (abilities += `, ${item.ability.name}`)
        : (abilities += item.ability.name);
    });
    return abilities;
  };

  function pokemonListCardsFilter(filteredPokemonList) {
    pokemonList.forEach(function (pokemon) {
      if (filteredPokemonList.includes(pokemon)) {
        let pokemonCard = document.querySelector(`#${pokemon.name}-card`);
        pokemonCard.classList.remove('hidden');
      } else {
        let pokemonCard = document.querySelector(`#${pokemon.name}-card`);
        pokemonCard.classList.add('hidden');
      }
    });
  }

  // ===============================================================================
  // === Search bar
  // ===============================================================================

  let searchBar = document.querySelector('#searchbar');
  searchBar.addEventListener('input', pokemonSearch);
  searchBar.addEventListener('keydown', (event) => {
    if (event.key == 'Escape') {
      searchBar.value = '';
      pokemonListCardsFilter(pokemonList);
      alertDismiss('alertNoSearchResult');
    }
  });

  function pokemonSearch(event) {
    const searchString = event.target.value.toLowerCase();
    let searchedPokemonList = pokemonList.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchString);
    });
    pokemonListCardsFilter(searchedPokemonList);
    if (searchedPokemonList.length == 0) {
      if (!document.querySelector('#alertNoSearchResult')) {
        alert('Pokemon not found!', 'warning', 'alertNoSearchResult');
      }
    } else {
      alertDismiss('alertNoSearchResult');
    }
  }

  // ===============================================================================
  // === Loader
  // ===============================================================================

  function showLoadingMessage() {
    let loader = document.querySelector('.loader');
    loader.classList.remove('hidden');
  }

  function hideLoadingMessage() {
    let loader = document.querySelector('.loader');
    loader.classList.add('hidden');
  }

  // ===============================================================================
  // === Alerts
  // ===============================================================================

  let alertTriggerOffline = function () {
    setTimeout(() => {
      if (!navigator.onLine) {
        alert('There is no internet connection', 'danger', 'alertOffline');
      }
    }, 5000);
  };

  let alertDismissOffline = function () {
    const alert = bootstrap.Alert.getOrCreateInstance('#alertOffline');
    alert.close();
  };

  window.addEventListener('offline', alertTriggerOffline);

  window.addEventListener('online', alertDismissOffline);

  let alertDismiss = function (type) {
    const alert = bootstrap.Alert.getOrCreateInstance(`#${type}`);
    alert.close();
  };

  const alertPlaceholder = document.querySelector('.liveAlertPlaceholder .row');

  const alert = (message, style, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${style} d-flex align-items-center alert-dismissible fade show" id="${type}" role="alert">`,
      `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
          />
      </svg>`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('');

    alertPlaceholder.append(wrapper);
  };

  // ===============================================================================
  // === Touch interactions
  // ===============================================================================

  let modal = document.querySelector('.modal-content');
  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  function handleGesture(touchstartX, touchstartY, touchendX, touchendY) {
    const delx = touchendX - touchstartX;
    const dely = touchendY - touchstartY;
    if (Math.abs(delx) > Math.abs(dely)) {
      if (delx > 0) return 'right';
      else return 'left';
    } else if (Math.abs(delx) < Math.abs(dely)) {
      if (dely > 0) return 'down';
      else return 'up';
    } else return 'tap';
  }

  modal.addEventListener(
    'touchstart',
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    },
    false
  );

  modal.addEventListener(
    'touchend',
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      if (
        handleGesture(touchstartX, touchstartY, touchendX, touchendY) ==
          'right' &&
        pokemonIndex < pokemonQuantity
      ) {
        pokemonIndex += 1;
        loadMoreDetails(pokemonList[pokemonIndex]).then(loadModal);
      }
      if (
        handleGesture(touchstartX, touchstartY, touchendX, touchendY) ==
          'left' &&
        pokemonIndex > 1
      ) {
        pokemonIndex -= 1;
        loadMoreDetails(pokemonList[pokemonIndex]).then(loadModal);
      }
    },
    false
  );

  // ===============================================================================
  // === Modal
  // ===============================================================================

  let loadModal = function () {
    const modalTitle = pokemonModal.querySelector('.modal-title');
    const modalBodyInput = pokemonModal.querySelector('.modal-body');
    modalTitle.innerText = pokemonList[pokemonIndex].name;

    let modalBodyContainer = document.createElement('div');
    modalBodyContainer.classList.add('container-fluid');
    let modalBodyImgRowContainer = document.createElement('div');
    modalBodyImgRowContainer.classList.add(
      'row',
      'row-cols-auto',
      'justify-content-center'
    );

    let modalBodyImg1Container = document.createElement('div');
    modalBodyImg1Container.classList.add('col-5');
    let modalImg1 = document.createElement('img');
    modalImg1.width = 100;
    modalImg1.classList.add('loader-img');
    modalImg1.addEventListener('load', function () {
      modalImg1.classList.remove('loader-img');
      modalImg1.alt = `Front image of ${pokemonList[pokemonIndex].name}`;
    });
    modalImg1.src = pokemonList[pokemonIndex].imgFrontUrl;

    let modalBodyImg2Container = document.createElement('div');
    modalBodyImg2Container.classList.add('col-5');
    let modalImg2 = document.createElement('img');
    modalImg2.width = 100;
    modalImg2.classList.add('loader-img');
    modalImg2.addEventListener('load', function () {
      modalImg2.classList.remove('loader-img');
      modalImg2.alt = `Front image of ${pokemonList[pokemonIndex].name}`;
    });
    modalImg2.src = pokemonList[pokemonIndex].imgBackUrl;

    let modalBodyTextRowContainer = document.createElement('div');
    modalBodyTextRowContainer.classList.add('row');
    modalBodyTextRowContainer.innerHTML = `
          <div class="col">
            <p>Height: ${pokemonList[pokemonIndex].height}</p>
            <p>Types: ${getTypes(pokemonList[pokemonIndex])}</p>
            <p>Abilities: ${getAbilities(pokemonList[pokemonIndex])}</p>
          </div>
        `;
    modalBodyImg1Container.append(modalImg1);
    modalBodyImg2Container.append(modalImg2);
    modalBodyImgRowContainer.append(modalBodyImg1Container);
    modalBodyImgRowContainer.append(modalBodyImg2Container);
    modalBodyContainer.append(modalBodyImgRowContainer);
    modalBodyContainer.append(modalBodyTextRowContainer);
    modalBodyInput.append(modalBodyContainer);
    hideLoadingMessage();
  };

  const pokemonModal = document.getElementById('pokemon-modal');
  let pokemonIndex = 0;

  pokemonModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    pokemonIndex = button.getAttribute('data-bs-pokemonIndex');
    loadMoreDetails(pokemonList[pokemonIndex]).then(loadModal);
  });

  pokemonModal.addEventListener('hidden.bs.modal', () => {
    const modalTitle = pokemonModal.querySelector('.modal-title');
    const modalBodyInput = pokemonModal.querySelector('.modal-body');
    modalTitle.innerText = '';
    modalBodyInput.innerHTML = '';
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
