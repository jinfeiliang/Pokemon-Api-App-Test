
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
const PokemonURLParam = GetURLParameter('Pokemon');

const PokeApiPokemonData = "https://pokeapi.co/api/v2/pokemon/" + PokemonURLParam;



function loadPokemonData(){
    let PokeApiPokemonDataXML = new XMLHttpRequest();
    PokeApiPokemonDataXML.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            const ResponseAnswer = JSON.parse(PokeApiPokemonDataXML.responseText);
            console.log(ResponseAnswer);

            let PokemonData = {
                name: ResponseAnswer.name,
                id: ResponseAnswer.id,
                type: ResponseAnswer.type,
                sprites: ResponseAnswer.sprites,
                moves: ResponseAnswer.moves,
                abilities: ResponseAnswer.abilities.map((x) => x.ability),
            }
            console.log(PokemonData.abilities)

        }
    }
    PokeApiPokemonDataXML.open("GET", PokeApiPokemonData, true);
    PokeApiPokemonDataXML.send();
}
loadPokemonData()