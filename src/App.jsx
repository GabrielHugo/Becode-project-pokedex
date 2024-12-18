import { useState } from 'react';
import './App.css';
import axios from 'axios';
import PokemonFetcher from './components/PokemonFetcher';
import PokemonDisplay from './components/PokemonDisplay';
import PokemonScrollableList from './components/PokemonScrollableList';

function App() {

    const [light, setLight] = useState('black')

    const [screenColor, setcreenColor] = useState('black')

    const HandleClick = (event) => {

        setcreenColor('white')
        setLight('rgb(104, 162, 94)')
    }

    const [pokemonData, setPokemonData] = useState(null);
    const [error, setError] = useState(null);

    const handleFetch = async (pokemonName) => {
        if (!pokemonName) {
            setError("Veuillez entrer un nom.");
            setPokemonData(null);
            return;
        }

        try {
            const pokemonDetails = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const speciesUrl = pokemonDetails.data.species.url;
            const speciesResponse = await axios.get(speciesUrl);

            const frenchName = speciesResponse.data.names.find(
                name => name.language.name === 'fr'
            )?.name || pokemonDetails.data.name;

            const pokemonDataWithFrenchName = {
                ...pokemonDetails.data,
                name: frenchName
            };

            setPokemonData(pokemonDataWithFrenchName);
            setError(null);
        } catch (err) {
            setError("Aucun résultat trouvé. Vérifiez l'orthographe ou utilisez le nom anglais.");
            setPokemonData(null);
        }
    };

    const handleSelectFromList = (englishName) => {
        handleFetch(englishName);
    };

    return (
        <div className="pokedexcontainer">
            <div className="upscreencontainer">
                <div className="upscreenborder">
                    <div className="upscreen">
                        {error && <div className="error-message">{error}</div>}
                        {pokemonData && <PokemonDisplay pokemonData={pokemonData} />}
                    </div>
                </div>
            </div>

            <div className="separator">
                <div className="separatordark1"></div>
                <div className="separatordark2"></div>
                <div className="separatordark3"></div>
            </div>

            <div className="containerbottompart">
                <div className="left">
                    <div className="lightup" style={{background: light}}></div>
                    <div className="lightdown" style={{background: light}}></div>
                    <div className="bluecircle">
                        <div className="reflect"></div>
                    </div>
                </div>

                <div className="bottomscreencontainer">
                    <div className="screenborder">
                        <div className="screen" style={{ backgroundColor: screenColor}}>
                            <div className="listcontainer">
                                <PokemonScrollableList onSelect={handleSelectFromList} />
                            </div>

                            <div className="filters">
                                <PokemonFetcher onFetch={handleFetch} />
                            </div>


                        </div>
                        <div className="buttonscontainer">
                            <div className="start"></div>
                            <div className="select"></div>
                        </div>
                    </div>
                </div>

                <div className="rightborder">
                    <div className="rightborderinside">
                        <div className="joystick">
                            <button className="plus">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
