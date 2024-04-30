const animeId = 1; // ID do anime que você deseja obter informações

fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
  })
  .then(animeData => {
    // Aqui você pode manipular os dados do anime conforme necessário
    console.log(animeData);
  })
  .catch(error => {
    console.error(`Erro na requisição: ${error.message}`);
  });
