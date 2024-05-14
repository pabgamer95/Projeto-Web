let body = document.querySelector('body')
let banner = document.getElementById('banner')
let news = document.getElementById('news')


document.querySelector('.ball').addEventListener('click', (e)=>{
    e.target.classList.toggle('ball-move');
    e.target.classList.toggle('white')
    body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        // code to execute if body has class 'dark'
        banner.src = "imagens/Prancheta 1.4.svg" && "../imagens/Prancheta 1.4.svg"
        banner.classList.add('dark_banner')
        news.classList.add('dark_news')
      } else {
        // code to execute if body does not have class 'dark'
        banner.src = "imagens/Prancheta 2.4.svg" && "../imagens/Prancheta 2.4.svg"
        banner.classList.remove('dark_banner') 
        news.classList.remove('dark_news')
      }
});
