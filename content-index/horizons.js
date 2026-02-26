// content-index/horizons.js
var totalEpisodes = 45; // <--- CHANGE THIS NUMBER to add more episodes automatically

// 2. Specific Links for specific episodes
// Format: episodeNumber: "URL"
var customLinks = {
    1: "https://drive.google.com/file/d/1gKPg21RndFw5_l-B_iGGh5ndmat38iqk/preview",
    2: "https://www.youtube.com/embed/uBYORdr_TY8",
    3: "https://www.youtube.com/embed/1roy4o4tqQM",
    4: "https://www.youtube.com/embed/5KCvXp_Xf7o"
    // Add more here like: 5: "url...",
};

// ==========================================
// AUTOMATIC GENERATOR (Do not touch)
// ==========================================
function generateEpisodeList(count) {
    var list = [];
    for (var i = 1; i <= count; i++) {
        
        var epNumber = i;
        list.push({
            title: "EPISODE " + epNumber,
            time: "22m",
            // If a link exists in customLinks, use it. Otherwise use empty string.
            url: customLinks[i] || "" 
        });
    }
    return list;
}



var horizonsData = [
    {
        id: 301, 
        title: "Pokémon Horizons S1", 
        year: 2023, 
        desc: "A new adventure begins! Liko and Roy set off on a journey across the Pokémon world with the Rising Volt Tacklers.", 
        category: "Horizons", 
        image: "https://i.supaimg.com/0323dee6-a2cc-4cad-b93a-e9488b620680.jpg", 
        backdrop: "https://images.alphacoders.com/133/1330957.png", 
        episodes: generateEpisodeList(totalEpisodes)
    }
];