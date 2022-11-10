let pokemonRepository = (function () {
  // ===============================================================================
  // === App global variables
  // ===============================================================================

  let pokemonList = []
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=99'

  // ===============================================================================
  // === App
  // ===============================================================================

  let add = function (pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon) {
      pokemonList.push(pokemon)
    } else {
      console.error('Pokemon object is not correct.')
    }
  }

  let addListItem = function (pokemon, index) {
    let card = document.createElement('div')
    card.classList.add('card', 'text-bg-dark', 'text-center')
    card.setAttribute('id', `${pokemon.name}-card`)
    let img = document.createElement('img')
    img.classList.add('card-img-top')
    img.setAttribute('src', pokemon.imgFrontUrl)
    img.setAttribute('alt', `${pokemon.name} profile picture`)
    let divCardBody = document.createElement('div')
    divCardBody.classList.add('card-body')
    let cardHeading = document.createElement('h5')
    cardHeading.classList.add('card-title')
    cardHeading.innerText = pokemon.name
    let cardButton = document.createElement('a')
    cardButton.classList.add('btn', 'btn-outline-success')
    cardButton.setAttribute('href', '#')
    cardButton.setAttribute('data-bs-toggle', 'modal')
    cardButton.setAttribute('data-bs-target', '#pokemon-modal')
    cardButton.setAttribute('data-bs-pokemonIndex', index)
    cardButton.innerText = 'More Details'
    let pokemonList = document.querySelector('.pokemon-list')

    divCardBody.appendChild(cardHeading)
    divCardBody.appendChild(cardButton)

    card.appendChild(img)
    card.appendChild(divCardBody)

    pokemonList.appendChild(card)
  }

  let getAll = function () {
    return pokemonList
  }

  let loadList = function () {
    showLoadingMessage()
    return fetch(apiUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        for (const item of json.results) {
          let pokemon = {
            name: capitalizeFirstLetter(item.name),
            detailUrl: item.url,
          }
          add(pokemon)
        }
      })
      .then(async function () {
        for (const pokemon of pokemonList) {
          await fetch(pokemon.detailUrl)
            .then(function (response) {
              return response.json()
            })
            .then(function (json) {
              pokemon.imgFrontUrl = json.sprites.front_default
            })
            .catch(function (error) {
              console.error(`Oh, something went wrong: ${error}`)
            })
        }
        hideLoadingMessage()
      })
      .catch(function (error) {
        console.error(`Something went wrong: ${error}`)
        hideLoadingMessage()
      })
  }

  let loadMoreDetails = function (pokemon) {
    showLoadingMessage()
    return fetch(pokemon.detailUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        pokemon.imgBackUrl = json.sprites.back_default
        pokemon.height = json.height
        pokemon.types = json.types
        pokemon.abilities = json.abilities
      })
      .catch(function (error) {
        console.error(`Oh, something went wrong: ${error}`)
        hideLoadingMessage()
      })
  }

  let getTypes = function (pokemon) {
    let types = ''
    pokemon.types.forEach(function (item, index) {
      index > 0 ? (types += `, ${item.type.name}`) : (types += item.type.name)
    })
    return types
  }

  let getAbilities = function (pokemon) {
    let abilities = ''
    pokemon.abilities.forEach(function (item, index) {
      index > 0
        ? (abilities += `, ${item.ability.name}`)
        : (abilities += item.ability.name)
    })
    return abilities
  }

  function pokemonListCardsFilter(filteredPokemonList) {
    pokemonList.forEach(function (pokemon) {
      if (filteredPokemonList.includes(pokemon)) {
        let pokemonCard = document.querySelector(`#${pokemon.name}-card`)
        pokemonCard.classList.remove('hidden')
      } else {
        let pokemonCard = document.querySelector(`#${pokemon.name}-card`)
        pokemonCard.classList.add('hidden')
      }
    })
  }

  // ===============================================================================
  // === Search bar
  // ===============================================================================

  let searchForm = document.querySelector("input[type='search']")
  searchForm.addEventListener('search', pokemonSearch)

  function pokemonSearch(event) {
    const searchString = event.target.value.toLowerCase()
    let filteredPokemonList = pokemonList.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchString)
    })
    pokemonListCardsFilter(filteredPokemonList)
  }

  // ===============================================================================
  // === Loader
  // ===============================================================================

  function showLoadingMessage() {
    let loader = document.querySelector('.loader')
    loader.classList.remove('hidden')
  }

  function hideLoadingMessage() {
    let loader = document.querySelector('.loader')
    loader.classList.add('hidden')
  }

  // ===============================================================================
  // === Alerts
  // ===============================================================================

  let alertTrigger = function () {
    alert('There is no internet connection', 'danger')
  }

  let alertDismiss = function () {
    const alert = bootstrap.Alert.getOrCreateInstance('#alert')
    alert.close()
  }

  window.addEventListener('offline', alertTrigger)

  window.addEventListener('online', alertDismiss)

  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible fade show" id="alert" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  // ===============================================================================
  // === Modal
  // ===============================================================================

  const pokemonModal = document.getElementById('pokemon-modal')
  pokemonModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget
    const pokemonIndex = button.getAttribute('data-bs-pokemonIndex')

    loadMoreDetails(pokemonList[pokemonIndex]).then(function () {
      const modalTitle = pokemonModal.querySelector('.modal-title')
      const modalBodyInput = pokemonModal.querySelector('.modal-body')
      modalTitle.innerText = pokemonList[pokemonIndex].name
      modalBodyInput.innerHTML = `
      <div class="container-fluid">
        <div class="row row-cols-auto justify-content-center">
          <div class="col-5">
            <img src="${pokemonList[pokemonIndex].imgFrontUrl}" alt="${
        pokemonList[pokemonIndex].name
      }" width=100%>
          </div>
          <div class="col-5">
            <img src="${pokemonList[pokemonIndex].imgBackUrl}"  alt="${
        pokemonList[pokemonIndex].name
      }"  width=100%>
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
        `
      hideLoadingMessage()
    })
  })

  pokemonModal.addEventListener('hidden.bs.modal', () => {
    const modalTitle = pokemonModal.querySelector('.modal-title')
    const modalBodyInput = pokemonModal.querySelector('.modal-body')
    modalTitle.innerText = ''
    modalBodyInput.innerHTML = ''
  })

  // ===============================================================================
  // === Utility Functions
  // ===============================================================================

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    getAll: getAll,
  }
})()

// ===============================================================================
// === Main
// ===============================================================================

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon, index) {
    pokemonRepository.addListItem(pokemon, index)
  })
})
