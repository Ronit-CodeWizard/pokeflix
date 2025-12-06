// ==========================================
// 1. DATABASE
// ==========================================
const defaultDB = [
    { id: 101, title: "Pokémon: The First Movie", year: 1998, desc: "Ash and friends face Mewtwo.", category: "Movies", image: "https://m.media-amazon.com/images/M/MV5BMjI2MjM2OTYwNl5BMl5BanBnXkFtZTgwNTU0NjQzMzE@._V1_FMjpg_UX1000_.jpg", backdrop: "https://images7.alphacoders.com/609/609070.jpg", video: "https://www.youtube.com/embed/5KCvXp_Xf7o", episodes: [] },
    { id: 102, title: "Detective Pikachu", year: 2019, desc: "A boy and Pikachu solve a mystery.", category: "Movies", image: "https://m.media-amazon.com/images/M/MV5BNDU4Mzc3NzE5Nl5BMl5BanBnXkFtZTgwMzE1NzI1NzM@._V1_.jpg", backdrop: "https://images6.alphacoders.com/101/1012879.jpg", video: "https://www.youtube.com/embed/1roy4o4tqQM", episodes: [] },
    { id: 201, title: "Indigo League", year: 1997, desc: "Ash starts his journey.", category: "Series", image: "https://i.supaimg.com/aade1484-5a34-4ac3-9263-8b9a8c3a26e7.jpg", backdrop: "https://images.alphacoders.com/654/654637.jpg", episodes: [{ title: "I Choose You!", time: "22m", url: "https://www.youtube.com/embed/D_trkiE4eW8" }, { title: "Pokémon Emergency", time: "22m", url: "https://www.youtube.com/embed/uBYORdr_TY8" }] },
    { id: 301, title: "Pokémon Horizons", year: 2023, desc: "A new adventure with Liko.", category: "Horizons", image: "https://pbs.twimg.com/media/F_tY3j_XoAA2d9u.jpg:large", backdrop: "https://images.alphacoders.com/133/1330957.png", episodes: [{ title: "The Pendant", time: "24m", url: "https://www.youtube.com/embed/uBYORdr_TY8" }] }
];

let db = JSON.parse(localStorage.getItem('pokeFlixDB')) || defaultDB;
let myList = JSON.parse(localStorage.getItem('pokeFlixList')) || [];
let currentHeroIndex = 0;
let heroInterval;

window.onload = () => {
    setTimeout(() => { document.getElementById('appLoader').style.opacity = '0'; setTimeout(() => { document.getElementById('appLoader').style.display = 'none'; document.getElementById('appContainer').classList.add('visible'); }, 600); }, 1500);
    initApp();
};

function initApp() { renderContent(); startHeroSlider(); setupNavbar(); }

// Nav
function setupNavbar() { window.addEventListener('scroll', () => { document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50); }); }
function toggleMobileMenu() { const nav = document.getElementById('mobileNav'); nav.classList.toggle('open'); document.getElementById('mobileOverlay').style.display = nav.classList.contains('open') ? 'block' : 'none'; }
function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' }); if(document.getElementById('mobileNav').classList.contains('open')) toggleMobileMenu(); }
function filterHome() { window.scrollTo({ top: 0, behavior: 'smooth' }); if(document.getElementById('mobileNav').classList.contains('open')) toggleMobileMenu(); }

// Hero
function startHeroSlider() { const items = db.filter(i => i.backdrop); if(items.length > 0) { updateHero(items[0]); startInterval(); } }
function startInterval() { if(heroInterval) clearInterval(heroInterval); heroInterval = setInterval(() => changeSlide(1), 8000); }
function changeSlide(d) { const items = db.filter(i => i.backdrop); currentHeroIndex = (currentHeroIndex + d + items.length) % items.length; updateHero(items[currentHeroIndex]); startInterval(); }
function updateHero(item) {
    const bg = document.getElementById('heroBg'); bg.style.opacity = 0; document.getElementById('heroTitle').classList.remove('slide-up');
    setTimeout(() => {
        bg.style.backgroundImage = `url('${item.backdrop}')`; bg.style.opacity = 1;
        document.getElementById('heroTitle').innerText = item.title; document.getElementById('heroTitle').classList.add('slide-up');
        document.getElementById('heroDesc').innerText = item.desc;
        document.getElementById('heroTags').innerHTML = `<span class="tag">${item.category}</span>`;
        document.getElementById('heroPlayBtn').onclick = () => item.category === 'Movies' ? openVideo(item.video, item.title) : openDetails(item.id);
    }, 400);
}

// Logo Animation
function triggerCatchAnimation() {
    const icon = document.getElementById('pokeIcon'); const container = document.getElementById('starsContainer');
    if(icon.classList.contains('catching')) return;
    icon.classList.add('catching');
    setTimeout(() => {
        icon.classList.remove('catching'); icon.classList.add('success');
        container.innerHTML = '';
        for(let i=0; i<3; i++) {
            const s = document.createElement('i'); s.className = `fas fa-star catch-star ${i==0?'star-left':i==1?'star-mid':'star-right'}`;
            container.appendChild(s);
        }
        setTimeout(() => { icon.classList.remove('success'); container.innerHTML = ''; }, 1500);
    }, 1500);
}

// Render
function renderContent() {
    ['moviesRow', 'seriesRow', 'horizonsRow', 'trendingRow', 'myListRow'].forEach(id => document.getElementById(id).innerHTML = '');
    db.forEach(item => {
        createCard(item, 'trendingRow');
        if(item.category === 'Movies') createCard(item, 'moviesRow');
        if(item.category === 'Series') createCard(item, 'seriesRow');
        if(item.category === 'Horizons') createCard(item, 'horizonsRow');
        if(myList.includes(item.id)) createCard(item, 'myListRow');
    });
    document.getElementById('myListSection').classList.toggle('hidden', myList.length === 0);
}
function createCard(item, rowId) {
    const row = document.getElementById(rowId);
    const card = document.createElement('div'); card.className = 'card'; card.onclick = () => openDetails(item.id);
    card.innerHTML = `<img src="${item.image}"><div class="card-overlay"><div class="card-title">${item.title}</div></div>`;
    row.appendChild(card);
}

// Details
function openDetails(id) {
    const item = db.find(i => i.id === id); if(!item) return;
    document.getElementById('detailBackdrop').src = item.backdrop || item.image;
    document.getElementById('detailTitle').innerText = item.title;
    document.getElementById('detailDesc').innerText = item.desc;
    document.getElementById('detailYear').innerText = item.year;
    document.getElementById('detailCat').innerText = item.category;
    const epList = document.getElementById('episodeList'); epList.innerHTML = '';
    if(item.episodes.length > 0) {
        document.getElementById('episodesContainer').style.display = 'block'; document.getElementById('epCount').innerText = `${item.episodes.length} Eps`;
        item.episodes.forEach((ep, idx) => {
            const d = document.createElement('div'); d.className = 'ep-row';
            d.innerHTML = `<span class="ep-num">${idx+1}</span><span style="flex:1;font-weight:600">${ep.title}</span><i class="fas fa-play"></i>`;
            d.onclick = () => openVideo(ep.url, `${item.title}: ${ep.title}`); epList.appendChild(d);
        });
    } else { document.getElementById('episodesContainer').style.display = 'none'; }
    document.getElementById('detailPlayMain').onclick = () => item.episodes.length > 0 ? openVideo(item.episodes[0].url, item.title) : openVideo(item.video, item.title);
    updateListBtn(item.id); document.getElementById('detailsModal').style.display = 'block'; document.getElementById('searchResults').classList.add('hidden');
}
function closeDetailsModal() { document.getElementById('detailsModal').style.display = 'none'; }

// List
function updateListBtn(id) {
    const btn = document.getElementById('detailListBtn');
    if(myList.includes(id)) { btn.innerHTML = '<i class="fas fa-check"></i>'; btn.onclick = () => { myList = myList.filter(x=>x!==id); saveList(); updateListBtn(id); renderContent(); }; }
    else { btn.innerHTML = '<i class="fas fa-plus"></i>'; btn.onclick = () => { myList.push(id); saveList(); updateListBtn(id); renderContent(); }; }
}
function saveList() { localStorage.setItem('pokeFlixList', JSON.stringify(myList)); }

// Video Player Logic (Hybrid: Iframe or Custom)
const videoPlayer = document.getElementById('mainVideo');
const videoIframe = document.getElementById('videoIframe');
const customPlayer = document.getElementById('customPlayer');

function openVideo(url, title) {
    if(!url) return;
    document.getElementById('playingTitle').innerText = title;
    document.getElementById('videoModal').style.display = 'flex';
    closeDetailsModal();

    // Check if YouTube
    if(url.includes('youtube') || url.includes('youtu.be')) {
        let embedUrl = url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url;
        if(!embedUrl.includes('autoplay')) embedUrl += "?autoplay=1";
        videoIframe.src = embedUrl;
        videoIframe.classList.remove('hidden');
        customPlayer.classList.add('hidden');
        videoPlayer.pause();
    } else {
        // Direct Video File (MP4/WebM) -> Use Custom Player
        videoIframe.classList.add('hidden');
        videoIframe.src = "";
        customPlayer.classList.remove('hidden');
        videoPlayer.src = url;
        videoPlayer.play();
        updatePlayIcon();
    }
}

function closeVideo() {
    videoPlayer.pause();
    videoPlayer.src = "";
    videoIframe.src = "";
    document.getElementById('videoModal').style.display = 'none';
}

// Custom Player Controls
function togglePlay() {
    if(videoPlayer.paused) videoPlayer.play(); else videoPlayer.pause();
    updatePlayIcon();
}
function updatePlayIcon() {
    const icon = document.querySelector('#playPauseBtn i');
    icon.className = videoPlayer.paused ? 'fas fa-play' : 'fas fa-pause';
}
function skip(sec) { videoPlayer.currentTime += sec; }
function seek(e) {
    const rect = e.target.closest('.progress-area').getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoPlayer.currentTime = percent * videoPlayer.duration;
}
function toggleFullscreen() {
    if(!document.fullscreenElement) document.getElementById('customPlayer').requestFullscreen();
    else document.exitFullscreen();
}
videoPlayer.ontimeupdate = () => {
    const pct = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    document.getElementById('progressFill').style.width = `${pct}%`;
    let cur = Math.floor(videoPlayer.currentTime), dur = Math.floor(videoPlayer.duration || 0);
    document.getElementById('timeDisplay').innerText = `${formatTime(cur)} / ${formatTime(dur)}`;
};
function formatTime(s) {
    let m = Math.floor(s/60), sec = s%60;
    return `${m}:${sec<10?'0':''}${sec}`;
}

// Search
function handleSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const ov = document.getElementById('searchResults');
    const gr = document.getElementById('searchGrid');
    if(q.length < 1) { ov.classList.add('hidden'); return; }
    ov.classList.remove('hidden'); gr.innerHTML = '';
    const res = db.filter(i => i.title.toLowerCase().includes(q));
    if(res.length > 0) res.forEach(i => {
        const c = document.createElement('div'); c.className = 'card'; c.onclick = () => { openDetails(i.id); closeSearch(); };
        c.innerHTML = `<img src="${i.image}"><div class="card-overlay"><div class="card-title">${i.title}</div></div>`;
        gr.appendChild(c);
    }); else gr.innerHTML = '<p style="color:#888;margin:10px">No Pokémon found.</p>';
}
function closeSearch() { document.getElementById('searchResults').classList.add('hidden'); document.getElementById('searchInput').value = ''; }

// Admin
function toggleAdminPanel() {
    const modal = document.getElementById('adminModal'); modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    if(localStorage.getItem('adminUnlocked') === 'true') { document.getElementById('adminAuth').classList.add('hidden'); document.getElementById('adminContent').classList.remove('hidden'); populateAdminSelect(); }
}
function checkAdmin() {
    // UPDATED PASSWORD CHECK
    if(document.getElementById('adminPass').value === 'ronny1639') {
        localStorage.setItem('adminUnlocked', 'true'); document.getElementById('adminAuth').classList.add('hidden'); document.getElementById('adminContent').classList.remove('hidden'); populateAdminSelect();
    } else { alert('Access Denied'); }
}
function setAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    if(tab === 'add') { document.getElementById('tabAdd').classList.remove('hidden'); event.target.classList.add('active'); }
    else if(tab === 'ep') { document.getElementById('tabEp').classList.remove('hidden'); event.target.classList.add('active'); }
}
function addNewContent() {
    const title = document.getElementById('newTitle').value; const img = document.getElementById('newImg').value;
    if(!title || !img) { alert('Info missing'); return; }
    db.unshift({ id: Date.now(), title, category: document.getElementById('newCategory').value, year: document.getElementById('newYear').value, image: img, backdrop: document.getElementById('newBackdrop').value, desc: document.getElementById('newDesc').value, video: document.getElementById('newVideo').value, episodes: [] });
    localStorage.setItem('pokeFlixDB', JSON.stringify(db)); renderContent(); alert('Added!'); toggleAdminPanel();
}
function populateAdminSelect() {
    const sel = document.getElementById('seasonSelect'); sel.innerHTML = '';
    db.filter(i => i.category !== 'Movies').forEach(i => { const opt = document.createElement('option'); opt.value = i.id; opt.innerText = i.title; sel.appendChild(opt); });
}
function addEpisode() {
    const p = db.find(i => i.id === parseInt(document.getElementById('seasonSelect').value));
    if(p) { p.episodes.push({ title: document.getElementById('epTitle').value, url: document.getElementById('epVideo').value }); localStorage.setItem('pokeFlixDB', JSON.stringify(db)); alert('Added!'); }
}
function resetData() { if(confirm('Reset all?')) { localStorage.clear(); location.reload(); } }

window.onclick = function(e) { 
    if(e.target == document.getElementById('adminModal')) toggleAdminPanel();
    if(e.target == document.getElementById('detailsModal')) closeDetailsModal();
    if(e.target == document.getElementById('videoModal')) closeVideo();
    const so = document.getElementById('searchResults');
    if(!so.classList.contains('hidden') && !so.contains(e.target) && e.target !== document.getElementById('searchInput')) so.classList.add('hidden');
};
