const pageSize = 9;
const postsBtnsNavigatorEl = document.querySelector('.posts-buttons-navigator');
const postsEl = document.querySelector('#posts');
let arrayPosts = [];
let currentPage = 1;

async function getPosts() {
    try {
        postsEl.innerHTML = 'Loading...';
        postsBtnsNavigatorEl.style.display = 'none';

        const request = await fetch('https://jsonplaceholder.typicode.com/posts');
        const response = await request.json();

        if (response.length) {
            arrayPosts = response;
            
            renderPosts();
            renderBtnsNavigator();
        }
    } catch (error) {
        console.error('Ocorreu um erro na requisição:', error);
        postsEl.innerHTML = 'Posts not found...';
    }
}

const renderPosts = () => {
    let posts = '';

    arrayPosts.filter((post, index) => {
        let start = (currentPage - 1) * pageSize;
        let end = currentPage * pageSize;
        if (index >= start && index < end) return true;
    }).forEach(post => {
        posts += `
            <div class="post-card">
                <div class="post-card-title">
                    <h2>${post.title}</h2>
                </div>
                <div class="post-card-body">
                    <p>${post.body}</p>
                </div>
            </div>
        `;
    });

    postsEl.innerHTML = posts;
}

const renderBtnsNavigator = () => {
    postsBtnsNavigatorEl.style.display = 'flex';
    postsBtnsNavigatorEl.querySelector('#btn-prev').setAttribute('disabled', 'disabled');

    if (arrayPosts.length <= pageSize) {
        postsBtnsNavigatorEl.querySelector('#btn-next').setAttribute('disabled', 'disabled');

        return;
    }

    postsBtnsNavigatorEl.querySelector('#btn-next').removeAttribute('disabled');
}

const prevPage = () => {
    postsBtnsNavigatorEl.querySelector('#btn-next').removeAttribute('disabled');

    if (currentPage > 1) {
        currentPage--;
    }

    if (currentPage === 1) {
        postsBtnsNavigatorEl.querySelector('#btn-prev').setAttribute('disabled', 'disabled');
    }

    renderPosts();
}

const nextPage = () => {
    postsBtnsNavigatorEl.querySelector('#btn-prev').removeAttribute('disabled');

    if ((currentPage * pageSize) < arrayPosts.length) {
        currentPage++;
    }

    if ((currentPage * pageSize) >= arrayPosts.length) {
        postsBtnsNavigatorEl.querySelector('#btn-next').setAttribute('disabled', 'disabled');
    }

    renderPosts();
}

getPosts();

postsBtnsNavigatorEl.querySelector('#btn-prev').addEventListener('click', prevPage);
postsBtnsNavigatorEl.querySelector('#btn-next').addEventListener('click', nextPage);