// ==========================================
// 1. DATA LOADING (PURELY EXTERNAL)
// ==========================================

// 1. Load External Variables (with safety checks)
var importedMovies = (typeof moviesData !== 'undefined') ? moviesData : [];
var importedS1 = (typeof season1Data !== 'undefined') ? season1Data : [];
var importedHorizons = (typeof horizonsData !== 'undefined') ? horizonsData : [];
var importedTrending = (typeof trendingList !== 'undefined') ? trendingList : [];

// 2. Combine ALL external data
const defaultDB = [
    ...importedMovies, 
    ...importedS1,
    ...importedHorizons
];

// Load User Favorites (My List) from Storage
let db = JSON.parse(localStorage.getItem('pokeFlixDB')) || defaultDB;
// If the DB is empty (no files loaded), ensure it's an array to prevent crashes
if (!Array.isArray(db)) db = [];

let myList = JSON.parse(localStorage.getItem('pokeFlixList')) || [];
let continueList = JSON.parse(localStorage.getItem('pokeFlixContinue')) || [];
let currentHeroIndex = 0;
let heroInterval;

// ==========================================
// 0. GENERATE LOADER BACKGROUND
// ==========================================
(function generateLoaderBg() {
    // 1. Detect Screen Size
    const isMobile = window.innerWidth < 768;
    
    // 2. Set Step Size based on device
    const stepSize = isMobile ? 50 : 120;
    
    // 3. Generate the Gradient Bands
    let stops = [];
    let pos = 0;
    
    // Loop creates shades from #000000 to approx #242424
    for (let i = 0; i <= 36; i += 2) {
        const hex = i.toString(16).padStart(2, '0');
        const color = `#${hex}${hex}${hex}`; 
        stops.push(`${color} ${pos}px`); // Start
        pos += stepSize;
        stops.push(`${color} ${pos}px`); // End
    }
    
    // 4. Create and Inject CSS
    const cssGradient = `repeating-linear-gradient(135deg, ${stops.join(",")})`;
    const style = document.createElement('style');
    style.innerHTML = ` #appLoader { background: ${cssGradient} !important; } `;
    document.head.appendChild(style);
})();

// ==========================================
// 2. APP STARTUP
// ==========================================
window.onload = () => {
    // Text Of Loading Animation
    const quotes = [
        "Polishing Pokeballs...",
        "Waking up Snorlax...",
        "Charging Pikachu...",
        "Preparing for Battle...",
        "Flying to Pallet Town..."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const loaderText = document.querySelector('#appLoader h3');
    if(loaderText) loaderText.innerText = randomQuote;    

    // Loading Animation
    setTimeout(() => {
        document.getElementById('appLoader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('appLoader').style.display = 'none';
            document.getElementById('appContainer').classList.add('visible');
        }, 600);
    }, 1500);

    initApp();
};

function initApp() {
    renderContent();
    startHeroSlider();
    setupNavbar();
}

// ==========================================
// 3. NAVIGATION & UI
// ==========================================
function setupNavbar() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');
    nav.classList.toggle('open');
    
    if (nav.classList.contains('open')) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (document.getElementById('mobileNav').classList.contains('open')) toggleMobileMenu();
}

function filterHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (document.getElementById('mobileNav').classList.contains('open')) toggleMobileMenu();
}

// ==========================================
// 4. HERO SLIDER
// ==========================================
function startHeroSlider() {
    const items = db.filter(i => i.backdrop); 
    if (items.length === 0) return;
    updateHero(items[0]);
    startInterval(); 
}

function startInterval() {
    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => changeSlide(1), 8000); 
}

function changeSlide(d) {
    const items = db.filter(i => i.backdrop);
    if (items.length === 0) return; 
    currentHeroIndex = (currentHeroIndex + d + items.length) % items.length;
    updateHero(items[currentHeroIndex]);
    startInterval();
}

function updateHero(item) {
    if (!item) return;
    const bg = document.getElementById('heroBg');
    const title = document.getElementById('heroTitle');
    const desc = document.getElementById('heroDesc');
    const tags = document.getElementById('heroTags');
    
    bg.style.opacity = 0;
    title.classList.remove('slide-up');
    desc.classList.remove('slide-up');
    void title.offsetWidth; 
    
    setTimeout(() => {
        bg.style.backgroundImage = `url('${item.image}')`; 
        bg.style.opacity = 1;
        
        document.getElementById('heroTitle').innerText = item.title;
        document.getElementById('heroTitle').classList.add('slide-up');
        document.getElementById('heroDesc').innerText = item.desc;
        document.getElementById('heroDesc').classList.add('slide-up');
        document.getElementById('heroTags').innerHTML = `<span class="tag">${item.category}</span><span class="tag">${item.year}</span>`;
        
        document.getElementById('heroPlayBtn').onclick = () => {
            if (item.category === 'Movies') openVideo(item.video, item.title, item.id);
            else openDetails(item.id);
        };
        document.getElementById('heroInfoBtn').onclick = () => openDetails(item.id);
    }, 400);
}

// ==========================================
// 5. POKEBALL LOGO ANIMATION
// ==========================================
function triggerCatchAnimation() {
    const icon = document.getElementById('pokeIcon');
    const container = document.getElementById('starsContainer');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (icon.classList.contains('catching')) return;
    icon.classList.add('catching');

    setTimeout(() => {
        icon.classList.remove('catching');
        icon.classList.add('success');
        container.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const s = document.createElement('i');
            s.className = `fas fa-star catch-star ${i == 0 ? 'star-left' : i == 1 ? 'star-mid' : 'star-right'}`;
            container.appendChild(s);
        }
        setTimeout(() => {
            icon.classList.remove('success');
            container.innerHTML = '';
        }, 1500);
    }, 1500);
}

// ==========================================
// 6. CONTENT RENDERING
// ==========================================
function renderContent() {
    ['continueRow', 'moviesRow', 'seriesRow', 'horizonsRow', 'trendingRow', 'myListRow'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = '';
    });

    // 1. Render Continue Watching
    if (continueList.length > 0) {
        document.getElementById('continueSection').classList.remove('hidden');
        continueList.forEach(historyItem => {
            const item = db.find(x => x.id === historyItem.id);
            if (item) {
                createCard(item, 'continueRow', historyItem.progress);
            }
        });
    } else {
        document.getElementById('continueSection').classList.add('hidden');
    }

    if (db.length === 0) return; 
    
    if (importedTrending.length > 0) {
        importedTrending.forEach(trendingId => {
            const item = db.find(x => x.id === trendingId);
            if (item) createCard(item, 'trendingRow');
        });
    }

    db.forEach(item => {
        if (item.category === 'Movies') createCard(item, 'moviesRow');
        if (item.category === 'Series') createCard(item, 'seriesRow');
        if (item.category === 'Horizons') createCard(item, 'horizonsRow');
        if (myList.includes(item.id)) createCard(item, 'myListRow');
    });

    document.getElementById('myListSection').classList.toggle('hidden', myList.length === 0);
}

function createCard(item, rowId, progress = 0) {
    const row = document.getElementById(rowId);
    if(!row) return;
    
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openDetails(item.id);
    
    const imgUrl = item.image ? item.image : "https://via.placeholder.com/200x300?text=No+Image";
    
    let progressHTML = '';
    if(progress > 0) {
        progressHTML = `
            <div class="progress-track">
                <div class="progress-filled" style="width: ${progress}%"></div>
            </div>
        `;
    }
    
    card.innerHTML = `
        <img src="${imgUrl}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Broken+Link'">
        <div class="card-overlay"><div class="card-title">${item.title}</div></div>
        ${progressHTML}
    `;
    row.appendChild(card);
}

// ==========================================
// 7. DETAILS MODAL
// ==========================================
function openDetails(id) {
    const item = db.find(i => i.id === id);
    if (!item) return;

    document.getElementById('detailBackdrop').src = item.backdrop || item.image;
    document.getElementById('detailTitle').innerText = item.title;
    document.getElementById('detailDesc').innerText = item.desc;
    document.getElementById('detailYear').innerText = item.year;
    document.getElementById('detailCat').innerText = item.category;

    const epList = document.getElementById('episodeList');
    epList.innerHTML = '';

    if (item.episodes && item.episodes.length > 0) {
        document.getElementById('episodesContainer').style.display = 'block';
        document.getElementById('epCount').innerText = `${item.episodes.length} Episodes`;
        item.episodes.forEach((ep, idx) => {
            const d = document.createElement('div');
            d.className = 'ep-row';
            d.innerHTML = `<span class="ep-num">${idx + 1}</span><span style="flex:1;font-weight:600">${ep.title}</span><i class="fas fa-play-circle" style="color:white; margin-left:auto;"></i>`;
            
            // Passing 'idx' to openVideo for Next Episode logic
            d.onclick = () => openVideo(ep.url, `${item.title}: ${ep.title}`, item.id, idx);
            
            epList.appendChild(d);
        });
    } else {
        document.getElementById('episodesContainer').style.display = 'none';
    }

    document.getElementById('detailPlayMain').onclick = () => {
        if (item.episodes.length > 0) openVideo(item.episodes[0].url, item.title, item.id, 0); // Play Index 0
        else openVideo(item.video, item.title, item.id, -1); // Movie (Index -1)
    };

    updateListBtn(item.id);
    document.getElementById('detailsModal').style.display = 'block';
    document.getElementById('searchResults').classList.add('hidden');
}

function closeDetailsModal() { document.getElementById('detailsModal').style.display = 'none'; }

// ==========================================
// 8. WATCHLIST LOGIC
// ==========================================
function updateListBtn(id) {
    const btn = document.getElementById('detailListBtn');
    if (myList.includes(id)) {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.onclick = () => { myList = myList.filter(x => x !== id); saveList(); updateListBtn(id); renderContent(); };
    } else {
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.onclick = () => { myList.push(id); saveList(); updateListBtn(id); renderContent(); };
    }
}
function saveList() { localStorage.setItem('pokeFlixList', JSON.stringify(myList)); }

// ==========================================
// 9. VIDEO PLAYER & HISTORY
// ==========================================
const videoPlayer = document.getElementById('mainVideo');
const videoIframe = document.getElementById('videoIframe');
const customPlayer = document.getElementById('customPlayer');
let currentPlayingId = null; 
let currentEpisodeIndex = -1;

function openVideo(url, title, id, epIndex = -1) {
    if (!url) return;
    
    currentPlayingId = id;
    currentEpisodeIndex = epIndex;
    
    // Check if next button should show
    if(typeof checkNextEpisode === 'function') checkNextEpisode(id, epIndex);

    // 1. Detect if it's YouTube or Google Drive
    const isYouTube = url.includes('youtube') || url.includes('youtu.be');
    const isDrive = url.includes('drive.google.com');
    const useIframe = isYouTube || isDrive;

    // 2. Add to History (Standardized time for iframes)
    if(typeof addToContinueWatching === 'function') {
        addToContinueWatching(id, useIframe ? 15 : 0);
    }

    // 3. Open Modal
    document.getElementById('playingTitle').innerText = title;
    document.getElementById('videoModal').style.display = 'flex';
    if(typeof closeDetailsModal === 'function') closeDetailsModal();

    const vIframe = document.getElementById('videoIframe');
    const cPlayer = document.getElementById('customPlayer');
    const vTag = document.getElementById('mainVideo');

    // 4. SWITCH PLAYERS
    if (useIframe) {
        // --- IFRAME LOGIC ---
        let embedUrl = url;

        // Only format URL if it is YouTube
        if (isYouTube) {
            embedUrl = url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url;
            if (!embedUrl.includes('autoplay')) embedUrl += "?autoplay=1";
        }
        
        vIframe.src = embedUrl;
        vIframe.classList.remove('hidden');
        cPlayer.classList.add('hidden'); 
        vTag.pause(); // Pause custom video
        
    } else {
        // --- CUSTOM PLAYER LOGIC (MP4) ---
        vIframe.classList.add('hidden');
        vIframe.src = ""; 
        cPlayer.classList.remove('hidden');
        
        vTag.src = url;
        
        // Restore timestamp if available
        if(typeof continueList !== 'undefined') {
            const savedItem = continueList.find(x => x.id === id);
            if(savedItem && savedItem.timestamp) {
                vTag.currentTime = savedItem.timestamp;
            }
        }
        vTag.play();
    }
}

// Check if "Next Episode" button should show
function checkNextEpisode(id, currentIndex) {
    const btn = document.getElementById('nextEpBtn');
    const item = db.find(x => x.id === id);

    // If it's a Series AND not the last episode
    if (item && item.category !== 'Movies' && currentIndex > -1 && currentIndex < item.episodes.length - 1) {
        btn.style.display = 'flex'; // Show button
    } else {
        btn.style.display = 'none'; // Hide button (Movies or Last Ep)
    }
}

// Function to Play Next
function playNextEpisode() {
    const item = db.find(x => x.id === currentPlayingId);
    if (item && currentEpisodeIndex > -1) {
        const nextIdx = currentEpisodeIndex + 1;
        // Double check bounds
        if (nextIdx < item.episodes.length) {
            const nextEp = item.episodes[nextIdx];
            // Load the next video
            openVideo(nextEp.url, `${item.title}: ${nextEp.title}`, item.id, nextIdx);
        }
    }
}

function addToContinueWatching(id, progress, timestamp = 0) {
    if(!id) return;
    continueList = continueList.filter(item => item.id !== id);
    continueList.unshift({ id: id, progress: progress, timestamp: timestamp });
    if(continueList.length > 10) continueList.pop();
    
    localStorage.setItem('pokeFlixContinue', JSON.stringify(continueList));
    renderContent(); 
}

function closeVideo() {
    videoPlayer.pause();
    videoPlayer.src = "";
    videoIframe.src = "";
    currentPlayingId = null;
    document.getElementById('videoModal').style.display = 'none';
}

function togglePlay() {
    if (videoPlayer.paused) videoPlayer.play();
    else videoPlayer.pause();
}

function skip(sec) {
    videoPlayer.currentTime += sec;
}

function seek(e) {
    const r = e.target.closest('.progress-area').getBoundingClientRect();
    videoPlayer.currentTime = ((e.clientX - r.left) / r.width) * videoPlayer.duration;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) document.getElementById('customPlayer').requestFullscreen();
    else document.exitFullscreen();
}

videoPlayer.ontimeupdate = () => {
    const pct = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    document.getElementById('progressFill').style.width = `${pct}%`;
    let cur = Math.floor(videoPlayer.currentTime), dur = Math.floor(videoPlayer.duration || 0);
    document.getElementById('timeDisplay').innerText = `${Math.floor(cur / 60)}:${cur % 60 < 10 ? '0' : ''}${cur % 60} / ${Math.floor(dur / 60)}:${dur % 60 < 10 ? '0' : ''}${dur % 60}`;

    if(currentPlayingId && pct > 1) {
        addToContinueWatching(currentPlayingId, Math.floor(pct), videoPlayer.currentTime);
    }
};

// ==========================================
// 10. SEARCH POPUP
// ==========================================
function handleSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const ov = document.getElementById('searchResults');
    const gr = document.getElementById('searchGrid');
    
    if (q.length < 1) { ov.classList.add('hidden'); return; }
    
    ov.classList.remove('hidden');
    gr.innerHTML = '';
    
    const res = db.filter(i => i.title.toLowerCase().includes(q));
    
    if (res.length > 0) {
        res.forEach(i => {
            const c = document.createElement('div');
            c.className = 'card';
            c.onclick = () => { openDetails(i.id); closeSearch(); };
            c.innerHTML = `<img src="${i.image}"><div class="card-overlay"><div class="card-title">${i.title}</div></div>`;
            gr.appendChild(c);
        });
    } else {
        gr.innerHTML = '<p style="color:#888;margin:10px">No Pokémon found.</p>';
    }
}

function closeSearch() {
    document.getElementById('searchResults').classList.add('hidden');
    document.getElementById('searchInput').value = '';
}

// ==========================================
// 11. EVENT LISTENERS
// ==========================================
window.onclick = function(e) {
    if (e.target == document.getElementById('creditsModal')) toggleCredits();
    if (e.target == document.getElementById('detailsModal')) closeDetailsModal();
    if (e.target == document.getElementById('videoModal')) closeVideo();
    const so = document.getElementById('searchResults');
    if (!so.classList.contains('hidden') && !so.contains(e.target) && e.target !== document.getElementById('searchInput')) {
        so.classList.add('hidden');
    }
};

window.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        if (document.getElementById('videoModal').style.display === 'flex') closeVideo();
        else if (document.getElementById('detailsModal').style.display === 'block') closeDetailsModal();
        else if (!document.getElementById('searchResults').classList.contains('hidden')) closeSearch();
        else if (document.getElementById('mobileNav').classList.contains('open')) toggleMobileMenu();
    }
});

function toggleCredits() {
    const modal = document.getElementById('creditsModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}   