const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];
let currentPostId = null;

// Função para inicializar o app
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    document.getElementById('post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createPost();
    });
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updatePost();
    });
    document.getElementById('cancel-update').addEventListener('click', () => {
        document.getElementById('edit-post').classList.add('hidden');
    });
    document.getElementById('search').addEventListener('input', filterPosts);
});

// Função para buscar posts da API ou do localStorage
async function fetchPosts() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
        displayPosts();
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        posts = data;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Função para exibir posts na página
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <div class="flex space-x-2">
                <button class="update-button bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600" onclick="editPost(${post.id}, '${post.title}', '${post.body}')">Update</button>
                <button class="delete-button bg-red-500 text-white p-2 rounded-md hover:bg-red-600" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });
}

// Função para criar um novo post
async function createPost() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    if (!title || !body) {
        showFeedback('error', 'Por favor. Digite título e descrição.');
        return;
    }

    const newPost = { title, body };
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    showFeedback('success', 'Post criado com sucesso.');
}

// Função para editar um post existente
function editPost(id, title, body) {
    currentPostId = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-body').value = body;
    document.getElementById('edit-post').classList.remove('hidden');
}

// Função para atualizar um post existente
function updatePost() {
    const title = document.getElementById('edit-title').value;
    const body = document.getElementById('edit-body').value;

    if (!title || !body) {
        showFeedback('error', 'Por favor. Digite título e descrição.');
        return;
    }

    posts = posts.map(post =>
        post.id === currentPostId ? { ...post, title, body } : post
    );
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    document.getElementById('edit-post').classList.add('hidden');
    showFeedback('success', 'Post atualizado com sucesso.');
}

// Função para deletar um post
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    showFeedback('success', 'Post deletado com sucesso.');
}

// Função para filtrar posts com base no campo de pesquisa
function filterPosts() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.body.toLowerCase().includes(searchQuery)
    );
    displayPosts(filteredPosts);
}

// Função para mostrar feedback ao usuário
function showFeedback(type, message) {
    const feedbackElement = document.getElementById('form-feedback') || document.getElementById('edit-feedback');
    feedbackElement.className = `feedback ${type}`;
    feedbackElement.textContent = message;
    feedbackElement.classList.remove('hidden');
    setTimeout(() => {
        feedbackElement.classList.add('hidden');
    }, 3000);
}
