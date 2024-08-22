document.addEventListener('DOMContentLoaded', function() {
    const postsList = document.getElementById('posts-list');

    // Função para buscar posts da API
    function fetchPosts() {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(posts => {
                posts.forEach(post => {
                    const postItem = document.createElement('li');
                    
                    const postTitle = document.createElement('h2');
                    postTitle.textContent = post.title;
                    
                    const postBody = document.createElement('p');
                    postBody.textContent = post.body.slice(0, 100) + '...';  // Exibir uma parte do conteúdo
                    
                    const detailsButton = document.createElement('button');
                    detailsButton.textContent = 'Ver Detalhes';
                    detailsButton.addEventListener('click', function() {
                        fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`)
                            .then(response => response.json())
                            .then(details => {
                                alert(`Título: ${details.title}\n\nConteúdo: ${details.body}`);
                            });
                    });

                    postItem.appendChild(postTitle);
                    postItem.appendChild(postBody);
                    postItem.appendChild(detailsButton);
                    
                    postsList.appendChild(postItem);
                });
            })
            .catch(error => console.error('Erro ao buscar posts:', error));
    }

    // Carregar os posts ao iniciar a página
    fetchPosts();
});
