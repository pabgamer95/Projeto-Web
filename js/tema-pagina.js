let body = document.querySelector('body')
let banner = document.getElementById('banner')


document.querySelector('.ball').addEventListener('click', (e)=>{
    e.target.classList.toggle('ball-move');
    e.target.classList.toggle('white')
    body.classList.toggle('dark');
});
