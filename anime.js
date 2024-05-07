async function fetchAnimeInfo(animeId) {
  await delay(250)
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}`;

    xhr.open('GET', pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar informações do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function mostrarAnimesPorPagina(page, pageSize) {
  let animeListDiv = document.getElementById('anime-list');
  animeListDiv.innerHTML = ''; // Limpa a lista de animes antes de adicionar novos

  for (let i = (page - 1) * pageSize + 1; i <= page * pageSize; i++) {
    try {
      let animeInfo = await fetchAnimeInfo(i);
      let imageSrc = animeInfo.images && animeInfo.images.jpg && animeInfo.images.jpg.image_url ? animeInfo.images.jpg.image_url : 'https://via.placeholder.com/300x450';

      let column = document.createElement('div');
      column.classList.add('col-md-4', 'mb-4');

      let image = document.createElement('img');
      image.src = imageSrc;
      image.alt = `Anime ${i}`;
      image.classList.add('img-fluid');

      image.addEventListener('click', function () {
        window.location.href = `detalhes_anime.html?animeId=${i}`
      })

      column.appendChild(image);
      animeListDiv.appendChild(column);
    } catch (error) {
      console.error(error);
    }
  }
}

let allAnimeDetails = [];
let allAnimeTitles = [];

// Função para buscar os detalhes de todos os animes disponíveis uma vez que a página é carregada
async function fetchAllAnimeDetails() {
  try {
    for (let i = 1; i <= 300; i++) {
      await delay(1000)
      let animeInfo = await fetchAnimeInfo(i);
      allAnimeDetails.push(animeInfo);
      allAnimeTitles.push(animeInfo.title.toLowerCase());
    }
  } catch (error) {
    console.error(error);
  }
}

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function searchAnime(term) {
  const animeListDiv = document.getElementById('anime-list');
  animeListDiv.innerHTML = ''; // Limpa a lista de animes antes de adicionar os resultados da busca

  try {
    console.log('Termo de busca:', term);

    // Verifica se o termo de busca não está vazio
    if (term.trim() === '') {
      console.log('Termo de busca vazio. Nenhum anime será encontrado.');
      return; // Retorna sem fazer a busca se o termo de busca estiver vazio
    }

    // Busca o ID do anime pelo nome
    const animeId = searchAnimeIdByName(term);

    if (animeId === null) {
      console.log(`Anime com o nome "${term}" não foi encontrado.`);
      return;
    }

    // Busca os detalhes do anime pelo ID
    const animeInfo = await fetchAnimeInfo(animeId);

    // Cria e exibe o elemento do anime na lista
    createAnimeElement(animeInfo);

    console.log('Fim da busca.');
  } catch (error) {
    console.error('Erro ao filtrar animes:', error);
  }
}

// Função para buscar o ID do anime pelo nome
function searchAnimeIdByName(name) {
  const anime = allAnimeDetails.find(anime => anime.title.toLowerCase() === name.toLowerCase());
  return anime ? anime.id : null;
}

// Função para criar e exibir o elemento do anime na lista
function createAnimeElement(animeInfo) {
  const animeListDiv = document.getElementById('anime-list');

  const column = document.createElement('div');
  column.classList.add('col-md-4', 'mb-4');

  const image = document.createElement('img');
  const imageSrc = animeInfo.images && animeInfo.images.jpg && animeInfo.images.jpg.image_url ? animeInfo.images.jpg.image_url : 'https://via.placeholder.com/300x450';
  image.src = imageSrc;
  image.alt = animeInfo.title;
  image.classList.add('img-fluid');

  image.addEventListener('click', function () {
    window.location.href = `detalhes_anime.html?animeId=${animeInfo.id}`
  });

  column.appendChild(image);
  animeListDiv.appendChild(column);
}


async function mostrarTop30AnimeInfo() {
  const pageSize = 30; // Número de animes por página
  const totalAnimes = 1000; // Total de animes disponíveis
  const totalPages = Math.ceil(totalAnimes / pageSize); // Calcula o total de páginas

  let paginationList = document.getElementById('pagination');
  paginationList.innerHTML = ''; // Limpa a lista de paginação antes de adicionar novos números de página

  for (let page = 1; page <= totalPages; page++) {
    let li = document.createElement('li');
    li.classList.add('page-item');

    let link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.textContent = page;
    link.addEventListener('click', function () {
      mostrarAnimesPorPagina(page, pageSize);
    });

    li.appendChild(link);
    paginationList.appendChild(li);
  }

  // Mostra a primeira página por padrão ao carregar
  mostrarAnimesPorPagina(1, pageSize);
}

mostrarTop30AnimeInfo();

// Função para buscar animes conforme o usuário digita
document.getElementById('search-input').addEventListener('input', function () {
  console.log("Evento de entrada acionado."); // Adiciona mensagem de log
  const searchTerm = this.value.trim().toLowerCase();
  searchAnime(searchTerm);
});

// Inicializa a busca dos detalhes de todos os animes disponíveis ao carregar a página
fetchAllAnimeDetails();
