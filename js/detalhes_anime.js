// Função para buscar os detalhes do anime com base no animeId, incluindo a lista de episódios
async function fetchAnimeInfo(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}`;

    xhr.open("GET", pedidoURL, true);
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
if (document.body.classList.contains('dark')) {
  // code to execute if body has class 'dark'
  banner.src = "../imagens/Prancheta 1.4.svg"
  banner.classList.add('dark_banner')
  
} else {
  // code to execute if body does not have class 'dark'
  banner.src = "../imagens/Prancheta 2.4.svg"
  banner.classList.remove('dark_banner') 
     
}
async function fetchEpisodes(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar episódios do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function fetchPersonagens(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/characters`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar personagens do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function fetchReviews(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/reviews`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar reviews do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function fetchRecomendacoes(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar recomendações do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

// Função para buscar a tradução da Sinopse do anime
async function traduzirSinopse(synopsis) {
  const chaveAPI = "SUA_CHAVE_API_DO_GOOGLE_TRANSLATE";
  const texto = synopsis;
  const idiomaDestino = "pt"; // Traduzir para Português

  const url = `https://translation.googleapis.com/language/translate/v2?key=${chaveAPI}&q=${encodeURIComponent(
    texto
  )}&target=${idiomaDestino}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } else {
      throw new Error(
        `Erro ao traduzir a sinopse "${synopsis}": ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Erro ao traduzir sinopse:", error);
    return synopsis; // Retorna a sinopse original em caso de erro
  }
}

// Função para exibir os detalhes do anime na página
async function mostrarDetalhesAnime(animeId) {
  try {
    // Busca os detalhes do anime
    let animeDetails = await fetchAnimeInfo(animeId);

    // Exibe os detalhes básicos do anime
    document.getElementById("anime-image").src =
      animeDetails.images.jpg.large_image_url;
    document.getElementById("anime-title").textContent = animeDetails.title;
    document.getElementById("anime-synopsis").textContent =
      await traduzirSinopse(animeDetails.synopsis);
    document.getElementById("anime-score").textContent = animeDetails.score;
    document.getElementById("anime-status").textContent = animeDetails.status;
    document.getElementById("anime-airing").textContent =
      animeDetails.aired.string;
    document.getElementById("anime-rating").textContent = animeDetails.rating;
    document.getElementById("anime-url").href = animeDetails.url;

    // Busca os episódios do anime
    let episodes = await fetchEpisodes(animeId);
    exibirEpisodios(episodes);

    // Busca os personagens do anime
    let personagens = await fetchPersonagens(animeId);
    exibirPersonagens(personagens);

    // Busca as reviews do anime
    let reviews = await fetchReviews(animeId);
    exibirReviews(reviews);

    // Busca as recomendações do anime
    let recomendacoes = await fetchRecomendacoes(animeId);
    exibirRecomendacoes(recomendacoes);
  } catch (error) {
    console.error("Erro ao mostrar detalhes do anime:", error);
  }
}

function exibirEpisodios(episodes) {
  const episodiosContainer = document.getElementById("episodes-container");
  episodiosContainer.innerHTML = ''; // Limpa o conteúdo anterior

  episodes.forEach((episode, index) => {
    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");
    episodeElement.innerHTML = `
      <div class="episode-title">Episódio ${index + 1}: ${episode.title}</div>
      <div class="episode-details">Detalhes do episódio: ${episode.details
      }</div>
    `;
    episodiosContainer.appendChild(episodeElement);
  });
}

function exibirPersonagens(personagens) {
  const personagensContainer = document.getElementById("personagens-container");
  personagensContainer.innerHTML = ''; // Limpa o conteúdo anterior

  personagens.forEach((personagem) => {
    const personagemElement = document.createElement("div");
    personagemElement.classList.add("personagem");
    personagemElement.innerHTML = `
      <div class="personagem-nome">${personagem.character.name}</div>
      <div class="personagem-detalhes">Detalhes do personagem: ${personagem.details
      }</div>
    `;
    personagensContainer.appendChild(personagemElement);
  });
}

function exibirReviews(reviews) {
  const reviewsContainer = document.getElementById("reviews-container");
  reviewsContainer.innerHTML = ''; // Limpa o conteúdo anterior

  reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");
    reviewElement.innerHTML = `
      <div class="review-autor">Autor: ${review.user.username}</div>
      <div class="review-detalhes">${review.review}</div>
    `;
    reviewsContainer.appendChild(reviewElement);
  });
}

function exibirRecomendacoes(recomendacoes) {
  const recomendacoesContainer = document.getElementById("recomendacoes-container");
  recomendacoesContainer.innerHTML = ''; // Limpa o conteúdo anterior

  recomendacoes.forEach((recomendacao) => {
    const recomendacaoElement = document.createElement("div");
    recomendacaoElement.classList.add("recomendacao");
    recomendacaoElement.innerHTML = `
      <div class="recomendacao-titulo">${recomendacao.entry.title}</div>
      <div class="recomendacao-detalhes">Detalhes da recomendação: ${recomendacao.details
      }</div>
    `;
    recomendacoesContainer.appendChild(recomendacaoElement);
  });
}
// Função para alternar a exibição entre as seções
function toggleSection(section) {
  const sections = [
    'sinopse-container',
    'episodes-container',
    'personagens-container',
    'status-container',
    'reviews-container',
    'recomendacoes-container'
  ];

  sections.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  const sectionId = `${section}-container`;
  document.getElementById(sectionId).style.display = 'block';
}

// Função para extrair o animeId da URL
function getAnimeIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Inicializa a página com a sinopse visível
document.addEventListener("DOMContentLoaded", () => {
  const animeId = getAnimeIdFromURL(); // Obtém o ID do anime da URL
  if (animeId) {
    mostrarDetalhesAnime(animeId);
    toggleSection('sinopse'); // Mostrar a sinopse por padrão
  } else {
    console.error("Anime ID não encontrado na URL");
  }
});
