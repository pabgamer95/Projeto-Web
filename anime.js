function fetchAnimeInfo(animeId) {
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

  async function fetchTop10AnimeInfo() {
    const maxAnimes = 30;
    let animeInfos = [];

    for (let i = 1; i <= maxAnimes; i++) {
      try {
        let animeInfo = await fetchAnimeInfo(i);
        animeInfos.push(animeInfo);
      } catch (error) {
        console.error(error);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return animeInfos;
  }

  async function mostrarTop10AnimeInfo() {
    let animeInfos = await fetchTop10AnimeInfo();
    let animeListDiv = document.getElementById('anime-list');

    animeInfos.forEach((animeInfo, index) => {
      let title = animeInfo.title || 'Título não disponível';
      let synopsis = animeInfo.synopsis || 'Sinopse não disponível';
      let imageSrc = animeInfo.images && animeInfo.images.jpg && animeInfo.images.jpg.image_url ? animeInfo.images.jpg.image_url : 'https://via.placeholder.com/300x450';

      let animeDiv = document.createElement('div');
      animeDiv.classList.add('anime');

      let h3 = document.createElement('h3');
      h3.textContent = `Anime ${index + 1}: ${title}`;

      let p = document.createElement('p');
      p.textContent = synopsis;

      let img = document.createElement('img');
      img.src = imageSrc;
      img.alt = title;
      img.style.maxWidth = '200px';

      animeDiv.appendChild(h3);
      animeDiv.appendChild(p);
      animeDiv.appendChild(img);

      animeListDiv.appendChild(animeDiv);
    });
  }

  mostrarTop10AnimeInfo();