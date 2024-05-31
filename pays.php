<?php
/*
Plugin Name: Pays
Author: Xavier Arbour
Description: Affiche les posts par pays dans la REST-API
Version: 1.0
Plugin URI: https://github.com/IshtarFolo
Author URI: https://referenced.ca
 */
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: http://localhost:8085");
}
add_action('send_headers', 'add_cors_http_header');


// Evalution des versions 
function enqueue_style_script_pays()
{
    $version_css = filemtime(plugin_dir_path(__FILE__) . "style.css");
    $version_js = filemtime(plugin_dir_path(__FILE__) . "js/pays.js");

    /*
        version http (link) de la feuille de style avec nouveau nom unique a chaque
        mod du fichier pcq date de creation change
    */
    wp_enqueue_style(
        'em_plugin_pays_css',
        plugin_dir_url(__FILE__) . "style.css",
        array(),
        $version_css
    );

    /*
        Meme chose ici avec pays.js, on s'assure aussi que script est ajoute
        a la fin de la page
    */
    wp_enqueue_script(
        'em_plugin_pays_js',
        plugin_dir_url(__FILE__) . "js/pays.js",
        array(),
        $version_js,
        true
    );
}

// Genere le code html du carrousel
function genere_Menu()
{
    // Création du menu avec les choix de "pays" du champs ACF 
    $args = array(
        'posts_per_page' => -1,
    );
    $posts = get_posts($args);
    
    // Creation of an empty array for "pays"
    $pays_values = array();
    
    // Loop through the posts to find "pays"
    foreach ($posts as $post) {
        $pays = get_field('pays', $post->ID); 
    
        // If "pays" exists and it's not in the array yet, put it in the array
        if ($pays && !in_array($pays, $pays_values)) {
            $pays_values[] = $pays; 
        }
    }
    
    // Création du menu
    $menu = '<div class="menu__pays">';
    
    // Le lien dans le menu pour chaque pays
    foreach ($pays_values as $pays) {
        $menu .= "<a class='item-menu' >$pays</a>";
    }
    // La fermeture du menu
    $menu .= '</div>';
    // Contenu de la requete pour obtenir les destinations par pays
    $contenu = '<div class="contenu__pays"></div>';

    echo $menu . $contenu;
}

// Ajout a la page avec le bon string --> pays ici
add_shortcode('pays', 'genere_Menu');

// Ajout des scripts js et css dans le header/ footer
add_action('wp_enqueue_scripts', 'enqueue_style_script_pays');