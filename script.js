
const PokeApiLinkRoot = "https://pokeapi.co/api/v2"
const PokeApiLinkAllPokemon = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
const GetPokeApiLinkPokemonData = (id) => { return PokeApiLinkRoot + "/pokemon/" + id };

const Pokemon_Page = (Pokemon) => "/pokemon.html?Pokemon=" + Pokemon;
const Pokemons_Container_DOM = document.querySelector("#Pokemons-Container");
const Pokemon_Filter_Name_Or_ID_DOM = document.querySelector("#Pokemon-Filter-Name-Or-ID");

const Pokemon_Filter_Types_DOM = document.querySelector("#Pokemon-Types-Filter-Container");

const Pokemon_Select_Order_DOM = document.querySelector("#Pokemon-Filter-Select-Order");
const Pokemon_Select_Sprite_DOM = document.querySelector("#Pokemon-Filter-Select-Sprites");
const Pokemon_Names_Datalist = document.querySelector("#Pokemon-Names-Datalist");
let ShowMorePokemonBTN_DOM = document.querySelector("#ShowMorePokemon");

let Maximum_Displaying_Pokemon = 100;


const Pokemon_Types = [
  { type: "normal", color: "rgb(168, 167, 122)", text_color: "white" },
  { type: "fire", color: "rgb(238, 129, 48)", text_color: "white" },
  { type: "water", color: "rgb(99, 144, 240)", text_color: "white" },
  { type: "electric", color: "rgb(247, 208, 44)", text_color: "black" },
  { type: "grass", color: "rgb(122, 199, 76)", text_color: "black" },
  { type: "ice", color: "rgb(150, 217, 214)", text_color: "black" },
  { type: "fighting", color: "rgb(194, 46, 40)", text_color: "white" },
  { type: "poison", color: "rgb(163, 62, 161)", text_color: "white" },
  { type: "ground", color: "rgb(226, 191, 101)", text_color: "black" },
  { type: "flying", color: "rgb(169, 143, 243)", text_color: "white" },
  { type: "psychic", color: "rgb(249, 85, 135)", text_color: "white" },
  { type: "bug", color: "rgb(166, 185, 26)", text_color: "black" },
  { type: "rock", color: "rgb(182, 161, 54)", text_color: "black" },
  { type: "ghost", color: "rgb(115, 87, 151)", text_color: "white" },
  { type: "dragon", color: "rgb(111, 53, 252)", text_color: "white" },
  { type: "dark", color: "rgb(112, 87, 70)", text_color: "white" },
  { type: "steel", color: "rgb(183, 183, 206)", text_color: "black" },
  { type: "fairy", color: "rgb(214, 133, 173)", text_color: "black" },
  { type: "reset", color: "rgb(255, 255, 255)", text_color: "black" }
];

function getTypeInfo(typeName) {
  const typeObj = Pokemon_Types.find(t => t.type === typeName);
  return typeObj ? typeObj : null; // returns null if not found
}
function getTypeDisplayHTML(typeName, newclass) {
  let Element = getTypeInfo(typeName)
  return `<div class="Pokemon-Types-Display ${newclass || ""}" style="background-color:${Element.color}; color:${Element.text_color}">${Element.type}</div>`
}


Pokemon_Types.forEach(function(Element) {
  const Type = Element.type.toLowerCase();
  const HTML = `<button class="Pokemon-Types-Filter-Btn" value="${Type}">${getTypeDisplayHTML(Type)}</button>`;
  Pokemon_Filter_Types_DOM.insertAdjacentHTML("beforeend", HTML);
});



function doThisPokemonHasThisType(Pokemon, TypeToFind) {
  let types = Pokemon.types;
  let found = false;
  types.forEach(function(type) {
    if (type.type.name == TypeToFind) {
      found = true;
      return true
    }
  })
  return found
}

function filterPokemonMethods(method, method_arg, array) {
  let filtered_array = array;
  if (method_arg == "" || method_arg == undefined) {
    return filtered_array;
  }
  switch (method) {
    case "Name_Or_Id":
      filtered_array = filtered_array.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(method_arg.toLowerCase()) ||
        pokemon.id.toString().includes(Number(method_arg).toString())
      );
      return filtered_array;
    case "Type":

      filtered_array = filtered_array.filter((pokemon) => doThisPokemonHasThisType(pokemon, method_arg))
      return filtered_array;
  }
}

function getSpritePokemon(source, PokemonData) {
  switch (source) {
    case "Showdown":
      return PokemonData.sprites.other.showdown.front_default
    default:
      return PokemonData.sprites.front_default
  }

}

function createCardTemplate(PokemonDataRaw) {
  let PokemonData = {
    name: PokemonDataRaw.name,
    id: PokemonDataRaw.id,
    type: PokemonDataRaw.types.map((x) => x.type.name),
    sprites: PokemonDataRaw.sprites,
    moves: PokemonDataRaw.moves,
    abilities: PokemonDataRaw.abilities.map((x) => x.ability),
    base_exp: PokemonDataRaw.base_experience,
  }
  let types_template = "";
  PokemonData.type.forEach((type) => {
    types_template = types_template + getTypeDisplayHTML(type, "Pokemon-Card-Types");
  })
  let Pokemon_ID_Edited = PokemonData.id
  if (Pokemon_ID_Edited < 10) {
    Pokemon_ID_Edited = "00" + Pokemon_ID_Edited;
  } else if (Pokemon_ID_Edited >= 10 && Pokemon_ID_Edited < 100) {
    Pokemon_ID_Edited = "0" + Pokemon_ID_Edited;
  }
  let Select_Sprite_Value = Pokemon_Select_Sprite_DOM.value;
  let template = `
      <div class="Pokemon-Card">
          <img loading="lazy" class="Pokemon-Card-Img" src="${
            getSpritePokemon(Select_Sprite_Value, PokemonData) || "https://miro.medium.com/v2/resize:fit:537/1*8Ck817bxnkBpSFq7aTy6qw.png"}">
          <div class="Pokemon-Card-Under-Img">
            <p class="Pokemon-Card-Pokedex-Id">${"#" + Pokemon_ID_Edited}</p>
            <p class="Pokemon-Card-Pokedex-Exp">Exp: ${PokemonData.base_exp}</p>
          </div>
          <a disabled class="Pokemon-Card-Name">${PokemonData.name}</a>
          <div class="Pokemon-Card-Types-Wrapper">
            ${types_template}
          </div>
      </div>`

  return template;
}

function sortPokemon_List(method, array) {
  if (!method) {
    return array;
  }
  switch (method) {
    case "Ascending":
      return array.sort((a, b) => a.id - b.id)
    case "Descending":
      return array.sort((a, b) => b.id - a.id);
    case "A-Z":
      return array.sort((a, b) => a.name.localeCompare(b.name));

    case "Z-A":
      return array.sort((a, b) => b.name.localeCompare(a.name));
  }

}

let Pokemon_List_Array_To_Show = [];
let Pokemon_Filter_Type_Selected = "";

function displayCard() {
  console.log(Pokemon_List_Array_To_Show.length)
  let Filter_NameID = Pokemon_Filter_Name_Or_ID_DOM.value;
  let Filter_Order = Pokemon_Select_Order_DOM.value;

  let ordered_processed_array = sortPokemon_List(Filter_Order, Pokemon_List_Array_To_Show)
  let name_processed_array = filterPokemonMethods("Name_Or_Id", Filter_NameID, ordered_processed_array);
  let type_processed_array = filterPokemonMethods("Type", Pokemon_Filter_Type_Selected, name_processed_array);


  Pokemons_Container_DOM.innerHTML = "";

  
  type_processed_array.forEach(function(pokemonData, index) {
    if (index < Maximum_Displaying_Pokemon){
      const card_template = createCardTemplate(pokemonData);
      Pokemons_Container_DOM.insertAdjacentHTML("beforeend", card_template);
    }
  });
}

document.querySelectorAll(".Pokemon-Types-Filter-Btn").forEach(function(element) {
  element.addEventListener("click", function(x) {

    document.querySelectorAll(".Pokemon-Types-Filter-Btn").forEach((element) => {element.querySelector(".Pokemon-Types-Display").style.outline = "";})
  
    element.querySelector(".Pokemon-Types-Display").style.outline = "3px solid white";
    
    Pokemon_Filter_Type_Selected = element.getAttribute("value");
    if (Pokemon_Filter_Type_Selected == "reset") {
      Pokemon_Filter_Type_Selected = "";
    } else {
      
    }
    displayCard();
  });
})

Pokemon_Filter_Name_Or_ID_DOM.addEventListener("change", () => displayCard());
Pokemon_Select_Order_DOM.addEventListener("change", () => displayCard());
Pokemon_Select_Sprite_DOM.addEventListener("change", () => displayCard());



async function GetAllPokemonDataUntil(MaxIndex) {
  Pokemons_Container_DOM.innerHTML = `<div class="Loading-Screen"><img src="https://cdn.dribbble.com/userupload/21186314/file/original-b7b2a05537ad7bc140eae28e73aecdfd.gif"></div>`
  try {
    let promises = [];
    for (let Count = 1; Count <= MaxIndex; Count++) {
      let PokeApiPokemonLink = ""
      if (Count > 1025) {
        PokeApiPokemonLink = GetPokeApiLinkPokemonData(10000 + (Count - 1025));
      } else {
        PokeApiPokemonLink = GetPokeApiLinkPokemonData(Count);
      }

      const promise = fetch(PokeApiPokemonLink)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${PokeApiPokemonLink}`)
          }
          return response.json();
        })
        .catch((error) => {
          console.error(`Fetch failed`, error)
        });
      promises.push(promise)
    }

    Pokemon_List_Array_To_Show = await Promise.all(promises);
    Pokemon_List_Array_To_Show.forEach((pokemon) => {
      Pokemon_Names_Datalist.insertAdjacentHTML("beforeend", `<option>${pokemon.name}</option>`)
    })

    
    displayCard();
  } catch (error) {
    console.error(`HTTP ERROR: ${error}`)
  }

}


async function getAllPokemonList() {
  try {
    const response = await fetch(PokeApiLinkAllPokemon);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Max Count is:", data.count);
    GetAllPokemonDataUntil(data.count);
  } catch (error) {
    console.error("Failed to fetch Pokémon list:", error);
  }
}
getAllPokemonList()


function loadMore(){
  Maximum_Displaying_Pokemon += 50;
  if (Maximum_Displaying_Pokemon >= Pokemon_List_Array_To_Show.length){
    ShowMorePokemonBTN_DOM.style.opacity = 0;
    ShowMorePokemonBTN_DOM.setAttribute('disabled', '')
  }
  displayCard();
}


// if (typeof variable === 'string') {
//   return 'string';
// } else if (typeof variable === 'object' && variable !== null && !Array.isArray(variable)) {
//   return 'object';
// } else {
//   return 'neither';
// }