const user = document.getElementById("user").value;

document.addEventListener("DOMContentLoaded", () => {
    showPosts();
});


function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}


function showPosts() {
    fetch(`getposts`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let all_posts = document.querySelector("#all_posts");
        
        data.posts.forEach((post) => {
            let postdiv = document.createElement("div");
            postdiv.className = "p-3 mb-3 border rounded shadow-sm";
            postdiv.innerHTML = `
                <a style="text-decoration: none; color: black;" href="goToProfile?user=${post.author__username}">
                    <div class="d-inline-flex align-middle pb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                        <h3 class="pl-2">${post.author__username}</h3>
                    </div>
                </a>
                <p>${ post.content }</p>
                <p>${ formatTime(post.timestamp) }</p>
                <div class="d-inline-flex"> 
                    <div class="d-inline-flex align-items-center" id="like_post">
                        <div style="display: block;" id="unliked_post" class="animated">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                        </div>
                        <div style="display: none;" id="liked_post">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                        </div>
                        <div class="pl-1">${ post.like_count === null ? 0 : post.like_count }</div>
                    </div>
                    ${
                        post.author__username === user
                        ?`<div class="ml-4">
                            <a style="text-decoration: none; color: black;" href="">Edit
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                            </a>
                        </div>` 
                        :``
                    }
                </div>
                `;
                postdiv.setAttribute('data-post-id', post.id)

            all_posts.appendChild(postdiv);
        });

        document.querySelectorAll("#like_post").forEach(post => {
            const id = post.closest("[data-post-id]").dataset.postId;
            const unliked = post.querySelector("#unliked_post");
            const liked = post.querySelector("#liked_post");

            fetch(`likedpostcheck?id=${id}&user=${user}`)
            .then(response => response.json())
            .then(data => {
                if (data.liked) {
                    unliked.style.display = "none";
                    liked.style.display = "block";
                } else {
                    unliked.style.display = "block";
                    liked.style.display = "none";
                }
            })
        });

        document.querySelectorAll("#like_post").forEach(post => {
            const unliked = post.querySelector("#unliked_post");
            const liked = post.querySelector("#liked_post");

            const id = post.closest("[data-post-id]").dataset.postId;

            unliked.addEventListener("click", () => {
                unliked.style.display = "none";
                liked.style.display = "block";
                
                fetch(`likepost?id=${id}&user=${user}`)
                .then(() => {
                    all_posts.innerHTML = "";
                    showPosts();
                });
            });

            liked.addEventListener("click", () => {
                unliked.style.display = "block";
                liked.style.display = "none";

                fetch(`unlikepost?id=${id}&user=${user}`)
                .then(() => {
                    all_posts.innerHTML = "";
                    showPosts();
                });
            });
        });
    });
}