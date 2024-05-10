const animeCardTemplate = document.getElementById("anime-template");
const animeCardContainer = document.getElementById("anime-card-container");
const searchInput = document.getElementById("search");
let paginationContainer = document.getElementById("pagination-container");

let animeData = [];
let currentPage = 1;
const itemsPerPage = 25;
const maxPagesToShow = 11;

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAnimeData = animeData.filter(anime => anime.title.toLowerCase().includes(value));
    currentPage = 1;
    renderAnimeCards(filteredAnimeData, currentPage);
});

async function fetchAnimeData(page) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
        const data = await response.json();

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            animeData = data.data;
            renderAnimeCards(animeData, page); // Movido para cá
            renderPagination(data.pagination);
        } else {
            console.error('Error fetching data: Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function renderAnimeCards(data, page, current_page) {
    console.log("Rendering anime cards for page", page);
    console.log("Received data:", data);

    // Limpa o conteúdo do container antes de adicionar os novos cards
    animeCardContainer.innerHTML = "";

    // Itera sobre os dados para criar e adicionar os cards ao container
    data.forEach((anime) => {
        // Cria um novo card
        const card = document.createElement('div');
        card.classList.add('card'); // Adiciona a classe 'card'

        // Preenche o conteúdo do card com a estrutura do template
        card.innerHTML = `
            <img class="card-img-top" data-image>
            <div class="card-body">
                <h5 class="card-title" data-header></h5>
                <p class="card-text" data-body></p>
            </div>
        `;

        // Atualiza as propriedades dos elementos do card
        const header = card.querySelector("[data-header]");
        header.textContent = anime.title;

        const image = card.querySelector(".card-img-top");
        let imageSrc = anime.images && anime.images.jpg && anime.images.jpg.image_url ? anime.images.jpg.image_url : "https://via.placeholder.com/300x450";
        image.src = imageSrc;

        // Adiciona o card ao container
        animeCardContainer.appendChild(card);
    });
}



function renderPagination(pagination) {
    if (!paginationContainer) {
        paginationContainer = document.getElementById("pagination-container");
    }
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    paginationContainer.innerHTML = "";
    const totalPages = pagination.last_visible_page;
    let currentPage = pagination.current_page
    console.log(currentPage)
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;

        if (startPage < 1) {
            startPage = 1;
            endPage = maxPagesToShow;
        }
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - maxPagesToShow + 1;
            if (startPage < 1) {
                startPage = 1;
            }
        }
    }

    if (currentPage > 1) {
        const prevPageLink = document.createElement('a');
        prevPageLink.href = "#";
        prevPageLink.textContent = 'Anterior';
        prevPageLink.addEventListener('click', function() {
            fetchAnimeData(currentPage - 1);
        });
        paginationContainer.appendChild(prevPageLink);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = "#";
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', function() {
            fetchAnimeData(i);
        });
        paginationContainer.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const nextPageLink = document.createElement('a');
        nextPageLink.href = "#";
        nextPageLink.textContent = 'Próximo';
        nextPageLink.addEventListener('click', function() {
            fetchAnimeData(currentPage + 1);
        });
        paginationContainer.appendChild(nextPageLink);
    }
}

fetchAnimeData(currentPage);
