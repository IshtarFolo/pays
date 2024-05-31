// Call fetchEtAffichePays with "France" when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    fetchEtAffichePays("France");
});

function fetchEtAffichePays(paysChoisi) {
  let url = `http://localhost:8085/4w4-2024-gr1/wp-json/wp/v2/posts?_embed&per_page=57`; // URL du serveur local

// fetch pour recuperer les donnees associees a l'URL
fetch(url)
.then(function (response) {
    // Check si la reponse est Ok (HTTP status 200)
    if (!response.ok) {
        throw new Error(
            "HTTP request failed with status " + response.status
        );
    }
    return response.json();
})

.then(function(data) {
    // On capture l'élément HTML où on veut afficher les données
    let restapi = document.querySelector(".contenu__pays");
    // Le contenu est vidé
    restapi.innerHTML = '';

    // On filtre les données pour ne garder que les articles associés au pays choisi
    let filteredData = data.filter(function (article) {
        if (article.acf && article.acf.pays) {
            let pays = article.acf.pays.split(',');
            return pays.includes(paysChoisi);
        }
        return false;
    });

    // Maintenant, on peut traiter les données comme on veut
    filteredData.forEach(function (article) {
        let titre = article.title.rendered;
        let contenu = article.content.rendered;

        // On affiche le contenu de tous les articles
        contenu = contenu.substring(0, 200) + '...';
        console.log(article.acf);

        let sectionPays = document.querySelector(".contenu__pays");

        let imageUrl = 'https://via.placeholder.com/150'; // Default image URL

        if (article.acf && article.acf.image) {
            imageUrl = article.acf.image;
        } else if (article._embedded && article._embedded['wp:featuredmedia'] && article._embedded['wp:featuredmedia'][0] && article._embedded['wp:featuredmedia'][0].source_url) {
            imageUrl = article._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // On met le tout dans la carte
        sectionPays.innerHTML += `
        <div class="pays__carte">
            <h2>${titre}</h2>
            <p>${contenu}</p><br>
            <img src="${imageUrl}" alt="Image de la destination" style="width: 150px; height: 150px;">
        </div>
        `;
    })
})
}

// Ajout d'un ecouteur d'evenements sur les liens du menu
window.onload = function() {
    document.querySelectorAll('.item-menu').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            let paysChoisi = this.textContent;
            fetchEtAffichePays(paysChoisi);
        });
    });
}