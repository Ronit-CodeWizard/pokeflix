// content-index/movies.js

// CHANGED 'const' TO 'var' TO FIX ERROR
var moviesData = [
    {
        id: 101,
        title: "Pokémon: The First Movie",
        year: 1998,
        desc: "Ash and friends face Mewtwo, a bio-engineered Pokémon created from Mew's DNA, who invites the world's best trainers to a battle.",
        category: "Movies",
        image: "https://i.supaimg.com/4152333b-7367-43e3-a2d7-7399028d72f7.jpg",
        backdrop: "https://images7.alphacoders.com/609/609070.jpg",
        video: "https://www.youtube.com/embed/5KCvXp_Xf7o",
        episodes: []
    },
    
    {
        id: 404, // Special ID for testing
        title: "Mystery Glitch",
        year: 2025,
        desc: "This movie file is corrupted. Do not watch.",
        category: "Movies",
        // Use a static-noise or glitch image
        image: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1ZnF1aGZ2ZzF4YmF6bnh3bHh6bnh3bHh6bnh3bHh6bnh3bHh6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lngj5o7R6N3gI/giphy.gif",
        backdrop: "",
        video: "",
        episodes: []
    }
];