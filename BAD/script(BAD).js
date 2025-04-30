
const PokeApiLink = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"

const Pokemons_Container_DOM = document.querySelector("#Pokemons-Container");
const Pokemon_Filter_Name_Or_ID_DOM = document.querySelector("#Pokemon-Filter-Name-Or-ID");



const Pokemon_Page = (Pokemon) => "/pokemon.html?Pokemon=" + Pokemon;
const Get_Pokemon_Data_API_URL_Via_ID_Or_Name = (PokemonRef) => "https://pokeapi.co/api/v2/pokemon/" + PokemonRef + "/";

function setUpPokemonCards(Pokemon_ID_Or_Name) {
  let PokeApiXML = new XMLHttpRequest();
  PokeApiXML.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      const ResponseAnswer = JSON.parse(PokeApiXML.responseText);

      const Pokemon_Name = ResponseAnswer.name;
      // let PokemonCardTemplate = `
      // <div class="Pokemon-Cards">
      //   <a href="${Pokemon_Page(Pokemon_Name)}">
      //     <div>
      //       <img src="${ResponseAnswer.sprites.front_default}">
      //     </div>
      //     <h1>${Pokemon_Name}</h1>
      //   </a>
      // </div>`
      let PokemonCardTemplate = `<article class="card">
          <section class="card__hero">
            <header class="card__hero-header">
              <span>$150/hr</span>
              <div class="card__icon">
                <svg height="20" width="20" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
              </div>
            </header>

            <p class="card__job-title"><img class="Pokemon-Card-Pic" src="${ResponseAnswer.sprites.front_default}"></p>
          </section>

          <footer class="card__footer">
            <div class="card__job-summary">
              <div class="card__job-icon">
                <svg height="35" width="28" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027">
                  </path>
                  <path fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1">
                  </path>
                  <path fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782">
                  </path>
                  <path fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251">
                  </path>
                </svg>
              </div>
              <div class="card__job">
                <p class="card__job-title">
                  ${ResponseAnswer.name}
                </p>
              </div>
            </div>

            <a href="${Pokemon_Page(Pokemon_Name)}"><button class="card__btn">view</button></a>
          </footer>
        </article>`


      
      Pokemons_Container_DOM.insertAdjacentHTML("beforeend", PokemonCardTemplate)

    }
  }
  PokeApiXML.open("GET", Get_Pokemon_Data_API_URL_Via_ID_Or_Name(Pokemon_ID_Or_Name), true);
  PokeApiXML.send();
}


function filterPokemons(Pokemon_Array) {
  const filterValue = Pokemon_Filter_Name_Or_ID_DOM?.value?.toLowerCase() || "";
  let Proccessed_Array = Pokemon_Array.filter((pokemon, index) =>
      pokemon.name.toLowerCase().includes(filterValue) || pokemon.url == `https://pokeapi.co/api/v2/pokemon/${index}/`);
  console.log(Proccessed_Array);
  return Proccessed_Array;
}
function displayPokemonList(Pokemon_Array) {
  Pokemons_Container_DOM.innerHTML = "";
  Pokemon_Array.forEach(function(Pokemon) {
    setUpPokemonCards(Pokemon.name);
  });
}

function loadPokemonsFromAPI() {
  let PokeApiXML = new XMLHttpRequest();
  PokeApiXML.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      const ResponseAnswer = JSON.parse(PokeApiXML.responseText);
      console.log(ResponseAnswer);
      const RawPokemonsList = ResponseAnswer.results;
      const PokemonProccessedList = filterPokemons(RawPokemonsList);
      displayPokemonList(PokemonProccessedList)
      sessionStorage.setItem("Pokemon-List", PokeApiXML.responseText)
    }
  }
  PokeApiXML.open("GET", PokeApiLink, true);
  PokeApiXML.send();
}

function loadPokemonFromSessionStorage() {
  const PokemonDataSS = sessionStorage.getItem("Pokemon-List")
  if (!PokemonDataSS) {
    return alert("Error: Cannot Load from Empty Session Storage");
  }
  const RawPokemonList = JSON.parse(PokemonDataSS).results;
  const PokemonProccessedList = filterPokemons(RawPokemonList)
  displayPokemonList(PokemonProccessedList);
}

function startPokemonList() {
  console.log("TRRR")
  if (sessionStorage.getItem("Pokemon-List")) {
    loadPokemonFromSessionStorage();
  } else {
    loadPokemonsFromAPI();
  }
}
startPokemonList();


Pokemon_Filter_Name_Or_ID_DOM.addEventListener("change", () => startPokemonList());









function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function GetAllPokemonDataUntil(MaxIndex, offset = 0, limit = 100) {
  let pendingRequests = 0;

  for (let Count = offset + 1; Count < offset + limit && Count <= MaxIndex; Count++) {
    const PokeApiPokemonLink = GetPokeApiLinkPokemonData(Count);

    if (localStorage.getItem(PokeApiPokemonLink)) {
      const Response = JSON.parse(localStorage.getItem(PokeApiPokemonLink));
      Pokemon_List_Array_To_Show.push(Response);
    } else {
      pendingRequests++;

      const RequestXML = new XMLHttpRequest();
      RequestXML.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          const Response = JSON.parse(RequestXML.responseText);
          Pokemon_List_Array_To_Show.push(Response);

          pendingRequests--;

          if (pendingRequests === 0) {
            displayCard();
          }
        }
      };
      RequestXML.open("GET", PokeApiPokemonLink);
      RequestXML.send();
    }

    // Delay each request to avoid hitting rate limits
    await sleep(100);  // 100ms delay
  }
}