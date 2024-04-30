function testAniListIntegration() {
    // URL da API AniList para buscar animes populares
    const ANILIST_API_KEY = "3paUSKjXlnAX7lK5jPtRCxN4c2JF1NigBdkGSH2O";
    const apiUrl = "https://api.anilist.co/anime/popular";

    // Fazendo uma requisição GET para a API AniList
    fetch(apiUrl)
        .then(response => {
            // Verifica se a resposta foi bem-sucedida (código de status 200)
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            // Retorna os dados da resposta em formato JSON
            return response.json();
        })
        .then(animeData => {
            // Aqui você pode manipular os dados dos animes populares, se necessário
            console.log(animeData);
            console.log("Integração da API AniList bem-sucedida!");
        })
        .catch(error => {
            console.error(`Erro na requisição: ${error.message}`);
            console.error("Falha na integração da API AniList.");
        });
}

// Chamada da função para testar a integração da API AniList
testAniListIntegration();
