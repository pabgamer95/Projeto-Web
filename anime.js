async function criarLinhasAnimes() {
    const table = document.createElement("table"); // Create the <table> element
    table.border = "2"; // Set the border attribute
    const tbody = document.querySelector("#anime-table tbody"); // Create the <tbody> element
    table.appendChild(tbody); // Append <tbody> to <table>

    const limit = 10; // Limite de 10 animes
    let count = 0; // Contador de animes válidos
    let attempt = 1; // Contador de tentativas de solicitação

    try {
        for (let i = 1; count < limit && attempt <= limit; i++) {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${i}`);
            console.log(response.ok)
            if (response.ok) {
                const animeData = await response.json();

                // Verifica se o anime é válido
                if (animeData.title) {
                    // Cria uma linha na tabela com os dados do anime
                    const tr = document.createElement("tr");

                    // Coluna do nome do anime
                    const tdNome = document.createElement("td");
                    tdNome.textContent = animeData.title;
                    tr.appendChild(tdNome);

                    // Coluna da imagem do anime
                    const tdImagem = document.createElement("td");
                    const imagem = document.createElement("img");
                    imagem.src = animeData.image_url;
                    imagem.alt = animeData.title;
                    imagem.classList.add("anime-image"); // Aplicando classe de estilo à imagem
                    tdImagem.appendChild(imagem);
                    tr.appendChild(tdImagem);

                    tbody.appendChild(tr);

                    count++; // Incrementa o contador de animes válidos

                    // Exibe os detalhes do anime no console
                    console.log("Anime encontrado:", animeData);
                }
            }

            attempt++; // Incrementa o contador de tentativas de solicitação

            // Aguarda 1 segundo entre as solicitações para evitar o erro "too many requests"
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    } catch (error) {
        console.error(`Erro na requisição: ${error.message}`);
    } finally {
        document.body.appendChild(table); // Append the <table> element to the HTML document
    }
}

// Chamando a função para criar as linhas da tabela quando a página carregar
window.onload = criarLinhasAnimes;