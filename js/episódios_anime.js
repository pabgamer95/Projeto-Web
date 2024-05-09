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

