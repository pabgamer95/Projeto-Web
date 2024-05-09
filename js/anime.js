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
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    const data = await response.json();

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        animeData = data.data;
        renderAnimeCards(animeData, page);
        renderPagination(data.pagination);
    } else {
        console.error('Error fetching data: Invalid data format');
    }
}

function renderAnimeCards(data, page) {
    animeCardContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedData = data.slice(start, end);
    slicedData.forEach((anime) => {
        const card = animeCardTemplate.content.cloneNode(true).querySelector('.card');
        const header = card.querySelector("[data-header]");
        header.textContent = anime.title;

        let imageSrc = anime.images && anime.images.jpg && anime.images.jpg.image_url ? anime.images.jpg.image_url : "https://via.placeholder.com/300x450";
        const image = card.querySelector(".card-img-top");
        image.src = imageSrc;

        // Add click event to the image
        image.addEventListener('click', function() {
            // Get the ID from the anime object
            const animeId = anime.mal_id; // Assuming there's an 'id' property in the anime object
            // Redirect to the details page with the ID
            window.location.href = `detalhes_anime/detalhes_anime.html?id=${animeId}`;
        });

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
    const currentPage = pagination.current_page;

    let startPage = 1;
    let endPage = totalPages;

    // Verifica se há mais páginas do que o número máximo permitido
    if (totalPages > maxPagesToShow) {
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        // Calcula a página inicial e final da lista de páginas a serem exibidas
        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;

        // Ajusta as páginas iniciais e finais se necessário
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

    // Adiciona botão "Anterior"
    if (currentPage > 1) {
        const prevPageLink = document.createElement('a');
        prevPageLink.href = "#";
        prevPageLink.textContent = 'Anterior';
        prevPageLink.addEventListener('click', function() {
            fetchAnimeData(currentPage - 1);
        });
        paginationContainer.appendChild(prevPageLink);
    }

    // Adiciona botões de número de página
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

    // Adiciona botão "Próximo"
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

// Fetch anime data for the first page
fetchAnimeData(currentPage);
