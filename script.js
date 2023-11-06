const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2309-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch (APIURL + 'players');
        const result = await response.json();
        // console.log(result);
        const playerData = result.data.players; // Access the player array
        console.log(playerData);

        // Call renderAllPlayers with the player data
        renderAllPlayers(playerData);

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + 'players/' + playerId);
        if (!response.ok) {
            throw new Error(`Failed to fetch player #${playerId}`);
        }
        const playerData = await response.json();
        console.log(playerData);

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + 'players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        
        if (!response.ok) {
            throw new Error('Failed to add a new player');
        }
        const addedPlayer = await response.json();
        console.log('New player added:', addedPlayer);

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + 'players/' + playerId, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to remove player #${playerId}`);
        }

        console.log(`Player #${playerId} has been removed from the roster`);

        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {

        let playerContainerHTML = '';

        if (!Array.isArray(playerList) || playerList.length === 0) {
            console.error('Player data is not in the expected format or the list is empty.');
            return;
        }

        playerList.forEach((player) => {
            const playerCard = `
            <div class="player-card">
                <h2>${player.name}</h2>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <img src="${player.imageUrl}" alt="${player.name}">

                <button class="details-button" data-player-id="${player.id}">See Details</button>
                <button class="remove-button" data-player-id="${player.id}">Remove from Roster</button>
            </div>
        `;

        playerContainerHTML += playerCard;
        });

        playerContainer.innerHTML = playerContainerHTML;

        const detailsButtons = document.querySelectorAll('.details-button');
        const removeButtons = document.querySelectorAll('.remove-button');

        detailsButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const playerId = event.target.getAttribute('data-player-id')
                fetchSinglePlayer(playerId);
            });
        });

        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const playerId = event.target.getAttribute('data-player-id')
                removePlayer(playerId);
            });
        });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    try {
    const players = await fetchAllPlayers();
    if (players) {
        renderAllPlayers(players);

         renderNewPlayerForm();
    }  

    const addPlayerForm = document.getElementById('add-player-form');

    addPlayerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const breed = document.getElementById('breed').value;
        const status = document.getElementById('status').value;
        const imageUrl = document.getElementById('imageUrl').value;

        const newPlayer = {
            name,
            breed,
            status,
            imageUrl,
        };

        try {
            await addNewPlayer(newPlayer);
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
        } catch (err) {
            console.error('Error while adding the player to the API', err);
        }
    });


    } catch (err) {
    console.error('Uh oh, something went wrong in init!', err);
    }
};


init();
