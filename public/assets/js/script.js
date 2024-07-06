const formPostEl = document.querySelector('.form-post-section');
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

        if (!request.ok) {
            throw new Error(`An error occurred in the request: ${request.status}`);
        }

        const response = await request.json();

        if (response.length) {
            arrayPosts = response;
            
            renderPosts();
            renderBtnsNavigator();
        }
    } catch (error) {
        console.error(error);
        postsEl.innerHTML = 'Posts not found...';
    }
}

async function sendPost() {
    const inputTitleEl = formPostEl.querySelector('input[name="title"]');
    const inputBodyEl = formPostEl.querySelector('textarea[name="body"]');

    if (inputTitleEl.value && inputBodyEl.value) {
        try {
            const request = await fetch
            (
                'https://jsonplaceholder.typicode.com/posts',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: inputTitleEl.value,
                        body: inputTitleEl.value,
                        userId: 1
                    })
                }
            );

            if (request.ok) {
                getPosts();
            } else {
                throw new Error(`An error occurred in the request: ${request.status}`);
            }
        } catch (error) {
            console.error('An error occurred in the request:', error);
            alert('An error occurred while trying to insert the post, try again!');
        } finally {
            inputTitleEl.value = '';
            inputBodyEl.value = '';
        }
    } else {
        alert('Enter a title and body for your post!');
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

formPostEl.querySelector('#btn-send-post').addEventListener('click', sendPost);
postsBtnsNavigatorEl.querySelector('#btn-prev').addEventListener('click', prevPage);
postsBtnsNavigatorEl.querySelector('#btn-next').addEventListener('click', nextPage);