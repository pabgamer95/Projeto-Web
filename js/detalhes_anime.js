// Função para buscar os detalhes do anime com base no animeId
async function fetchAnimeInfo(animeId) {
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

// Função para buscar a tradução da Sinopse do anime
async function traduzirSinopse(synopsis) {
  const chaveAPI = 'SUA_CHAVE_API_DO_GOOGLE_TRANSLATE';
  const texto = synopsis;
  const idiomaDestino = 'pt'; // Traduzir para Português

  const url = `https://translation.googleapis.com/language/translate/v2?key=${chaveAPI}&q=${encodeURIComponent(texto)}&target=${idiomaDestino}`;

  try {
      const response = await fetch(url, {
          method: 'POST'
      });

      if (response.ok) {
          const data = await response.json();
          return data.data.translations[0].translatedText;
      } else {
          throw new Error(`Erro ao traduzir a sinopse "${synopsis}": ${response.statusText}`);
      }
  } catch (error) {
      console.error('Erro ao traduzir sinopse:', error);
      return synopsis; // Retorna a sinopse original em caso de erro
  }
}

// Função para exibir os detalhes do anime na página
async function mostrarDetalhesAnime(animeId) {
  try {
      // Busca os detalhes do anime
      let animeDetails = await fetchAnimeInfo(animeId);

      document.getElementById('anime-image').src = animeDetails.images.jpg.large_image_url;
      document.getElementById('anime-title').textContent = animeDetails.title;
      // Chama o Google Translate para traduzir a sinopse
      document.getElementById('anime-synopsis').textContent = await traduzirSinopse(animeDetails.synopsis);
      document.getElementById('anime-score').textContent = animeDetails.score;
      document.getElementById('anime-episodes').textContent = animeDetails.episodes;
      document.getElementById('anime-status').textContent = animeDetails.status;
      document.getElementById('anime-airing').textContent = animeDetails.aired.string;
      document.getElementById('anime-rating').textContent = animeDetails.rating;
      document.getElementById('anime-url').href = animeDetails.url;

  } catch (error) {
      console.error("Erro ao mostrar detalhes do anime:", error);
  }
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = parseInt(urlParams.get('id'));
  if (!isNaN(animeId)) {
      mostrarDetalhesAnime(animeId);
  } else {
      console.error("ID do anime não especificado na URL.");
  }
};
