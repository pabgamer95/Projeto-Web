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

    // Exibe os episódios na página
    exibirEpisodios(episodes);
  } catch (error) {
    console.error("Erro ao mostrar detalhes do anime:", error);
  }
}

// Função para exibir os episódios do anime na página
function exibirEpisodios(episodes) {
  const episodiosContainer = document.getElementById("episodes-container");

  episodes.forEach((episode, index) => {
    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");
    episodeElement.innerHTML = `
        <div class="episode-title">Episódio ${index + 1}: ${episode.title}</div>
        <div class="episode-details">Detalhes do episódio: ${
          episode.details
        }</div>
        <div class="expand-arrow">&#9660;</div>
      `;

    // Adiciona evento de clique na setinha para mostrar mais detalhes
    const expandArrow = episodeElement.querySelector(".expand-arrow");
    expandArrow.addEventListener("click", () => {
      mostrarDetalhesEpisodio(episode);
    });

    episodiosContainer.appendChild(episodeElement);
  });
}

// Função para mostrar os detalhes de um episódio quando se clica na setinha
function mostrarDetalhesEpisodio(episode) {
  alert(`Detalhes do episódio:
  Título: ${episode.title}
  Detalhes: ${episode.details}`);
}
function toggleSinopseAndEpisodes() {
  const sinopseContainer = document.getElementById("anime-synopsis");
  const episodiosContainer = document.getElementById("episodes-container");

  if (sinopseContainer.style.display === "block") {
    sinopseContainer.style.display = "none";
    episodiosContainer.style.display = "block";
  } else {
    sinopseContainer.style.display = "block";
    episodiosContainer.style.display = "none";
  }
}
function mudarExib(opcao) {
  const episodiosContainer = document.getElementById("episodes-container");
  const personagensContainer = document.getElementById("personagens-container");
  const statusContainer = document.getElementById("status-container");
  const reviewsContainer = document.getElementById("reviews-container");
  const recomendacoesContainer = document.getElementById("recomendacoes-container");

  // Oculta todos os contêineres
  episodiosContainer.style.display = "none";
  personagensContainer.style.display = "none";
  statusContainer.style.display = "none";
  reviewsContainer.style.display = "none";
  recomendacoesContainer.style.display = "none";

  // Exibe o contêiner correspondente à opção selecionada
  switch (opcao) {
    case 'episodios':
      episodiosContainer.style.display = "block";
      break;
    case 'personagens':
      personagensContainer.style.display = "block";
      break;
    case 'status':
      statusContainer.style.display = "block";
      break;
    case 'reviews':
      reviewsContainer.style.display = "block";
      break;
    case 'recomendacoes':
      recomendacoesContainer.style.display = "block";
      break;
    default:
      console.error("Opção desconhecida:", opcao);
  }
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = parseInt(urlParams.get("id"));
  if (!isNaN(animeId)) {
    mostrarDetalhesAnime(animeId);
  } else {
    console.error("ID do anime não especificado na URL.");
  }
};
