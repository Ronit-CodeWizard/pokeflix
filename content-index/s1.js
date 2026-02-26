// 1. How many episodes total?
var totalEpisodes = 82; // <--- CHANGE THIS NUMBER to add more episodes automatically

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

// ==========================================
// DATA OBJECT
// ==========================================
var season1Data = [
    {
        id: 201,
        title: "Indigo League",
        year: 1997,
        desc: "Ash Ketchum finally turns 10 years old and can start his journey to become a Pokémon Master. He oversleeps and ends up with Pikachu.",
        category: "Series",
        
        // 1. IMAGE: Grid/Container (Vertical)
        image: "https://i.supaimg.com/aade1484-5a34-4ac3-9263-8b9a8c3a26e7.jpg",
        
        // 2. BACKDROP: Hero Carousel (Horizontal)
        backdrop: "https://i.supaimg.com/5a070ee5-cf57-4d40-a660-1a032e7e1fd9.jpg",
        
        // 3. EPISODES: Automatically generated from settings above
        episodes: generateEpisodeList(totalEpisodes)
    }
];