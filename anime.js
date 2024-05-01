//animes.js
// Função para buscar e criar linhas na tabela com os dados dos animes
async function criarLinhasAnimes() {
    const tbody = document.querySelector("#anime-table tbody");
    const limit = 10; // Limite de 10 animes
    let count = 0; // Contador de animes válidos
    let attempt = 1; // Contador de tentativas de solicitação

    try {
        const logger = getLogger(); // Get the logger instance

        const requests = [];
        for (let i = 1; count < limit && attempt <= limit; i++) {
            requests.push(fetch(`https://api.jikan.moe/v4/anime/${i}`));
            attempt++;
        }

        const responses = await Promise.all(requests);
        const animeDataList = await Promise.all(responses.map(response => response.json()));

        const fragment = document.createDocumentFragment(); // Create a document fragment

        for (const animeData of animeDataList) {
            if (animeData.title) {
                const tr = document.createElement("tr");

                const tdNome = document.createElement("td");
                tdNome.textContent = animeData.title;
                tr.appendChild(tdNome);

                const tdImagem = document.createElement("td");
                const imagem = document.createElement("img");
                imagem.src = animeData.image_url;
                imagem.alt = animeData.title;
                imagem.classList.add("anime-image");
                tdImagem.appendChild(imagem);
                tr.appendChild(tdImagem);

                fragment.appendChild(tr); // Add the row to the fragment

                count++;

                logger.info(`Anime encontrado: ${animeData}`);
            }
        }

        tbody.appendChild(fragment); // Append the fragment to the DOM after the loop
    } catch (error) {
        console.error(`Erro na requisição: ${error.message}`);
    }
}

function getLogger() {
    // Implement the logger instance here
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (url, delayMs, maxAttempts) => {
    let attempt = 1;
    while (attempt <= maxAttempts) {
        const response = await fetch(url);
        if (response.ok) {
            const animeData = await response.json();
            if (animeData.title) {
                const tr = document.createElement("tr");
                const tdNome = document.createElement("td");
                tdNome.textContent = animeData.title;
                tr.appendChild(tdNome);
                const tdImagem = document.createElement("td");
                const imagem = document.createElement("img");
                imagem.src = animeData.image_url;
                imagem.alt = animeData.title;
                imagem.classList.add("anime-image");
                tdImagem.appendChild(imagem);
                tr.appendChild(tdImagem);
                tbody.appendChild(tr);
                count++;
                logger.info(`Anime encontrado: ${animeData}`);
            }
        }
        attempt++;
        await delay(delayMs * Math.pow(2, attempt - 1));
    }
};

async function criarLinhasAnimes() {
    const tbody = document.querySelector("#anime-table tbody");
    const limit = 10;
    let count = 0;
    let attempt = 1;

    try {
        const logger = getLogger();

        const requests = [];
        for (let i = 1; count < limit && attempt <= limit; i++) {
            requests.push(fetch(`https://api.jikan.moe/v4/anime/${i}`));
            attempt++;
        }

        const responses = await Promise.all(requests);
        const animeDataList = await Promise.all(responses.map(response => response.json()));

        const fragment = document.createDocumentFragment();

        for (const animeData of animeDataList) {
            if (animeData.title) {
                const tr = document.createElement("tr");

                const tdNome = document.createElement("td");
                tdNome.textContent = animeData.title;
                tr.appendChild(tdNome);

                const tdImagem = document.createElement("td");
                const imagem = document.createElement("img");
                imagem.src = animeData.image_url;
                imagem.alt = animeData.title;
                imagem.classList.add("anime-image");
                tdImagem.appendChild(imagem);
                tr.appendChild(tdImagem);

                fragment.appendChild(tr);

                count++;

                logger.info(`Anime encontrado: ${animeData}`);
                console.log(`Image URL: ${animeData.image_url}`); // Log the image URL
                console.log(imagem); // Log the image element
            }
        }

        tbody.appendChild(fragment);
    } catch (error) {
        console.error(`Erro na requisição: ${error.message}`);
    }
}

// Chamando a função para criar as linhas da tabela quando a página carregar
window.onload = criarLinhasAnimes;
