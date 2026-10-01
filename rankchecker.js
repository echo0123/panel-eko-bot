// ==========================================
// PLUGIN: CEK RANK 1 - 5 & MULTI-TABS (UNIVERSAL SELECTOR ENGINE)
// ==========================================

const puppeteer = require('puppeteer');

// 1. UI TEMPLATE (Tampilan format rincian Tautan & 4 Views Layout)
const uiHtml = `
    <style>
        @keyframes neonGlow {
            0%, 100% { border-color: rgba(244, 63, 94, 1); box-shadow: 0 0 20px rgba(244, 63, 94, 0.8), inset 0 0 15px rgba(244, 63, 94, 0.4); }
            50% { border-color: rgba(251, 191, 36, 1); box-shadow: 0 0 35px rgba(251, 191, 36, 1), inset 0 0 25px rgba(251, 191, 36, 0.6); }
        }
        @keyframes neonSuccess {
            0%, 100% { border-color: rgba(16, 185, 129, 1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
            50% { border-color: rgba(6, 182, 212, 1); box-shadow: 0 0 35px rgba(6, 182, 212, 1); }
        }
        .neon-warning-box {
            animation: neonGlow 1.2s infinite;
            background: rgba(24, 24, 27, 0.95);
        }
    </style>

    <div class="space-y-6">
        <div class="p-6 bg-zinc-900/60 rounded-lg border border-violet-500/30 space-y-5">
            <div class="flex items-center gap-3 border-b border-zinc-800 pb-3">
                <div class="w-10 h-10 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center font-bold">TOP</div>
                <div>
                    <h4 class="text-white font-bold text-sm">Cek Rank 1 - 5 & Multi-Tabs (Universal Selector Engine)</h4>
                    <p class="text-xs text-zinc-400">Deteksi Rank 1-5 dengan rincian Desktop, Mobile, & Direct serta jeda CAPTCHA 1 menit.</p>
                </div>
            </div>

            <div class="max-w-xl">
                <label class="block text-xs font-bold text-violet-400 mb-1">Keyword / Kata Kunci Pencarian Google</label>
                <input type="text" id="rcKeyword" class="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Cth: dewatogel">
            </div>

            <!-- KOTAK NOTIFIKASI CAPTCHA -->
            <div id="rcCaptchaAlertBox" class="hidden p-4 rounded-lg border-2 neon-warning-box space-y-2">
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold animate-ping text-xs">⚠️</div>
                    <div>
                        <h5 class="text-xs font-black text-rose-400 uppercase tracking-wider">Browser Penyamaran Terbuka!</h5>
                        <p class="text-xs text-zinc-300">Bot memberikan waktu 1 menit. Jika muncul verifikasi/CAPTCHA di browser, segera selesaikan dengan mouse.</p>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 pt-2 items-center">
                <button onclick="jalankanRankChecker()" id="rcBtnSubmit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition shadow flex items-center gap-2">
                    🔍 CEK RANK 1 - 5 & CAPTURE
                </button>
                <button onclick="resetRankChecker()" class="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition">
                    Reset
                </button>
                <span id="rcLoadingText" class="text-xs text-cyan-400 font-mono hidden animate-pulse">⏳ Menunggu penyelesaian CAPTCHA (Jeda 1 menit)...</span>
            </div>

            <!-- Area Tampilan Format List seperti Gambar 1 -->
            <div id="rcTop5Area" class="hidden space-y-4 pt-4 border-t border-zinc-800">
                <div class="flex justify-between items-center">
                    <h5 class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Format Daftar Peringkat & Rincian Tautan</h5>
                    <span id="rcStatusRank" class="px-3 py-1 bg-violet-900/40 border border-violet-700 text-violet-300 text-xs font-bold rounded">Status: Selesai</span>
                </div>
                
                <div id="rcFormattedListContainer" class="space-y-4 bg-black/40 p-4 rounded-lg border border-zinc-800 font-mono text-xs">
                    <!-- Diisi secara dinamis -->
                </div>
            </div>

            <!-- Area Detail Preview Screenshot 4 Views seperti Gambar 2 -->
            <div id="rcResultArea" class="hidden space-y-4 pt-4 border-t border-zinc-800">
                <div class="flex justify-between items-center">
                    <h5 id="rcSelectedRankTitle" class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Detail 4 Views Layout</h5>
                    <span class="text-[10px] text-zinc-400 font-mono">SERP, Desktop, Mobile, & Direct</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- 1. SERP View -->
                    <div class="p-3 bg-zinc-900 rounded border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-zinc-300 block mb-1">1. Tab SERP View</span>
                            <div class="h-32 bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                                <img id="rcImgSerp" src="" alt="SERP Preview" class="w-full h-full object-cover">
                            </div>
                        </div>
                        <button onclick="viewImage('SERP View', document.getElementById('rcImgSerp').src)" class="w-full py-1.5 bg-violet-600/30 hover:bg-violet-600 text-violet-300 rounded text-[10px] font-bold transition text-center">Buka Tab SERP</button>
                    </div>

                    <!-- 2. Desktop View -->
                    <div class="p-3 bg-zinc-900 rounded border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-zinc-300 block mb-1">2. Tab Desktop View</span>
                            <div class="h-32 bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                                <img id="rcImgDesktop" src="" alt="Desktop Preview" class="w-full h-full object-cover">
                            </div>
                        </div>
                        <button onclick="viewImage('Desktop View', document.getElementById('rcImgDesktop').src)" class="w-full py-1.5 bg-violet-600/30 hover:bg-violet-600 text-violet-300 rounded text-[10px] font-bold transition text-center">Buka Tab Desktop</button>
                    </div>

                    <!-- 3. Mobile View -->
                    <div class="p-3 bg-zinc-900 rounded border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-zinc-300 block mb-1">3. Tab Mobile View</span>
                            <div class="h-32 bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                                <img id="rcImgMobile" src="" alt="Mobile Preview" class="w-full h-full object-cover">
                            </div>
                        </div>
                        <button onclick="viewImage('Mobile View', document.getElementById('rcImgMobile').src)" class="w-full py-1.5 bg-violet-600/30 hover:bg-violet-600 text-violet-300 rounded text-[10px] font-bold transition text-center">Buka Tab Mobile</button>
                    </div>

                    <!-- 4. Direct View -->
                    <div class="p-3 bg-zinc-900 rounded border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-bold text-zinc-300 block mb-1">4. Tab Direct View</span>
                            <div class="h-32 bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                                <img id="rcImgDirect" src="" alt="Direct Preview" class="w-full h-full object-cover">
                            </div>
                        </div>
                        <button onclick="viewImage('Direct View', document.getElementById('rcImgDirect').src)" class="w-full py-1.5 bg-violet-600/30 hover:bg-violet-600 text-violet-300 rounded text-[10px] font-bold transition text-center">Buka Tab Direct</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel History -->
        <div class="p-6 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-4">
            <div class="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800 pb-3">
                <label class="text-xs font-bold text-cyan-400 uppercase tracking-widest">History Hasil Pengecekan Keyword</label>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-zinc-400">Cari Tanggal:</span>
                    <input type="date" id="rcSearchDate" oninput="renderRcHistory()" class="bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                    <button onclick="document.getElementById('rcSearchDate').value=''; renderRcHistory();" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition">Reset</button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                        <tr class="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                            <th class="p-3 text-center w-12">No</th>
                            <th class="p-3">Tanggal</th>
                            <th class="p-3">Keyword Pencarian</th>
                            <th class="p-3">Peringkat #1 Terdeteksi</th>
                        </tr>
                    </thead>
                    <tbody id="rcHistoryBody">
                        <tr><td colspan="4" class="p-4 text-center text-zinc-500 italic">Tidak ada riwayat pengecekan.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal View Full Image -->
        <div id="rcModalView" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 items-center justify-center hidden">
            <div class="glass-card w-full max-w-4xl rounded-lg overflow-hidden border border-violet-500 p-4 space-y-3 bg-zinc-900">
                <div class="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <h3 id="rcModalTitle" class="text-sm font-bold text-white">Preview Screenshot</h3>
                    <button onclick="document.getElementById('rcModalView').classList.add('hidden'); document.getElementById('rcModalView').classList.remove('flex');" class="text-zinc-400 hover:text-white text-lg">&times;</button>
                </div>
                <div class="max-h-[75vh] overflow-auto flex justify-center bg-black rounded p-2">
                    <img id="rcModalImg" src="" alt="Full Preview" class="max-w-full object-contain">
                </div>
            </div>
        </div>
    </div>
`;

// 2. LOGIKA FRONTEND
function clientScript() {
    window.rcGlobalData = [];

    window.playAlarmSound = function() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                }, i * 350);
            }
        } catch(e) {}
    };

    window.jalankanRankChecker = function() {
        let keyword = document.getElementById('rcKeyword').value.trim();
        let btn = document.getElementById('rcBtnSubmit');
        let loading = document.getElementById('rcLoadingText');
        let alertBox = document.getElementById('rcCaptchaAlertBox');

        if(!keyword) {
            alert('Harap isi Keyword / Kata Kunci terlebih dahulu!');
            return;
        }

        btn.disabled = true;
        loading.classList.remove('hidden');
        alertBox.classList.remove('hidden');

        let currentScript = typeof activePluginScript !== 'undefined' ? activePluginScript : 'rankchecker.js';
        window.playAlarmSound();

        fetch('http://localhost:3000/run-plugin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scriptName: currentScript, payload: { keyword } })
        })
        .then(async res => {
            let text = await res.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error("Respon server bukan format JSON: " + text.substring(0, 100));
            }
        })
        .then(data => {
            btn.disabled = false;
            loading.classList.add('hidden');
            alertBox.classList.add('hidden');

            if(data.success) {
                try {
                    let parsed = JSON.parse(data.output);
                    if(parsed.success) {
                        window.rcGlobalData = parsed.ranksData || [];

                        let container = document.getElementById('rcFormattedListContainer');
                        container.innerHTML = '';

                        if(window.rcGlobalData.length > 0) {
                            let htmlContent = `<div class="text-emerald-400 font-bold uppercase tracking-widest pb-2 border-b border-zinc-800">${keyword.toUpperCase()}</div>`;

                            window.rcGlobalData.forEach((item, index) => {
                                htmlContent += `
                                    <div class="space-y-1 py-2 border-b border-zinc-800/40">
                                        <div class="text-violet-300 font-bold">RANK ${item.rank}- ${item.title.toUpperCase()}</div>
                                        <div class="text-zinc-300 pl-3">DEKSTOP- <a href="${item.url}" target="_blank" class="text-cyan-400 hover:underline">${item.url}</a></div>
                                        <div class="text-zinc-300 pl-3">MOBILE- <a href="${item.url}" target="_blank" class="text-cyan-400 hover:underline">${item.url}</a></div>
                                        <div class="text-zinc-300 pl-3">DIRECT- <a href="${item.url}" target="_blank" class="text-cyan-400 hover:underline">${item.url}</a></div>
                                        <div class="pt-1 pl-3">
                                            <button onclick="pilihRankDetail(${index})" class="px-3 py-1 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 rounded text-[10px] font-bold transition">🔍 Lihat 4 Views Preview</button>
                                        </div>
                                    </div>
                                `;
                            });
                            container.innerHTML = htmlContent;
                            pilihRankDetail(0);
                        } else {
                            container.innerHTML = `<div class="p-4 text-center text-zinc-500 italic">Tidak ada data rank ditemukan.</div>`;
                        }

                        document.getElementById('rcTop5Area').classList.remove('hidden');
                        document.getElementById('rcResultArea').classList.remove('hidden');

                        let rank1Title = window.rcGlobalData.length > 0 ? window.rcGlobalData[0].title : 'Tidak ada';
                        simpanRcHistory(keyword, rank1Title);
                        alert('Pengecekan Rank 1 s/d 5 Berhasil Diselesaikan!');
                    } else {
                        alert('Gagal mengambil data rank: ' + (parsed.output || 'Terjadi kesalahan.'));
                    }
                } catch(e) {
                    alert('Gagal memproses data output server.');
                }
            } else {
                alert('Gagal menjalankan plugin: ' + data.output);
            }
        })
        .catch(err => {
            btn.disabled = false;
            loading.classList.add('hidden');
            alertBox.classList.add('hidden');
            alert('Error: ' + err.message);
        });
    };

    window.pilihRankDetail = function(index) {
        let data = window.rcGlobalData[index];
        if(!data) return;

        document.getElementById('rcSelectedRankTitle').innerText = `Detail 4 Views Layout: Rank #${data.rank} (${data.title})`;
        document.getElementById('rcImgSerp').src = data.images.serp;
        document.getElementById('rcImgDesktop').src = data.images.desktop;
        document.getElementById('rcImgMobile').src = data.images.mobile;
        document.getElementById('rcImgDirect').src = data.images.direct;
    };

    window.resetRankChecker = function() {
        document.getElementById('rcKeyword').value = '';
        document.getElementById('rcTop5Area').classList.add('hidden');
        document.getElementById('rcResultArea').classList.add('hidden');
        document.getElementById('rcCaptchaAlertBox').classList.add('hidden');
    };

    window.viewImage = function(title, imgSrc) {
        document.getElementById('rcModalTitle').innerText = title;
        document.getElementById('rcModalImg').src = imgSrc;
        let modal = document.getElementById('rcModalView');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.simpanRcHistory = function(kw, rank1) {
        let now = new Date();
        let tanggalIso = now.toISOString().split('T')[0];
        let tanggalFormatted = now.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        
        let history = JSON.parse(localStorage.getItem('rc_history_plugin')) || [];
        history.unshift({
            dateIso: tanggalIso,
            tanggal: tanggalFormatted,
            keyword: kw,
            rank1: rank1
        });

        if(history.length > 50) history.pop();
        localStorage.setItem('rc_history_plugin', JSON.stringify(history));
        renderRcHistory();
    };

    window.renderRcHistory = function() {
        let tbody = document.getElementById('rcHistoryBody');
        let searchDate = document.getElementById('rcSearchDate') ? document.getElementById('rcSearchDate').value : '';
        if(!tbody) return;

        let history = JSON.parse(localStorage.getItem('rc_history_plugin')) || [];
        if(searchDate) {
            history = history.filter(item => item.dateIso === searchDate);
        }

        if(history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-zinc-500 italic">Tidak ada riwayat pengecekan.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        history.forEach((h, idx) => {
            tbody.innerHTML += `
                <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                    <td class="p-3 text-center text-zinc-400">${idx + 1}</td>
                    <td class="p-3 text-zinc-300">${h.tanggal}</td>
                    <td class="p-3 text-zinc-200 font-bold">${h.keyword}</td>
                    <td class="p-3 text-cyan-400 truncate max-w-xs">${h.rank1}</td>
                </tr>
            `;
        });
    };

    renderRcHistory();
}

// 3. LOGIKA BACKEND (Universal Selector & 1 Minute Pause Engine)
async function hitungRankChecker(payload) {
    const { keyword } = payload;
    if (!keyword) {
        throw new Error("Keyword / Kata Kunci wajib diisi!");
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--window-size=1366,768',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--incognito'
        ],
        ignoreDefaultArgs: ['--enable-automation']
    });

    try {
        const pages = await browser.pages();
        const serpPage = pages.length > 0 ? pages[0] : await browser.newPage();

        await serpPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await serpPage.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        const searchUrl = `https://www.google.co.id/search?q=${encodeURIComponent(keyword)}`;
        await serpPage.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Jeda waktu aman 60 detik (1 menit) bagi pengguna untuk menyelesaikan CAPTCHA manual di browser
        await new Promise(resolve => setTimeout(resolve, 60000));

        const serpBuffer = await serpPage.screenshot({ encoding: 'base64', fullPage: false });
        const serpImg = `data:image/png;base64,${serpBuffer}`;

        // Ekstraksi Top 1 s/d Top 5 menggunakan Universal Selector (menangkap h3 di area hasil pencarian utama)
        const top5Results = await serpPage.evaluate(() => {
            const results = [];
            const h3Elements = document.querySelectorAll('#rso h3, #search h3, main h3');
            
            for (let h3 of h3Elements) {
                let aTag = h3.closest('a');
                if (!aTag && h3.parentElement) {
                    aTag = h3.parentElement.closest('a');
                }
                
                if (aTag && aTag.href && aTag.href.startsWith('http')) {
                    const url = aTag.href;
                    const title = h3.innerText.trim();
                    
                    if (title && url && 
                        !url.includes('google.com') && 
                        !url.includes('google.co.id') && 
                        !url.includes('youtube.com') &&
                        !url.includes('support.google.com')) {
                        
                        if (!results.some(r => r.url === url)) {
                            results.push({
                                rank: results.length + 1,
                                title: title,
                                url: url
                            });
                            if (results.length >= 5) break;
                        }
                    }
                }
            }
            return results;
        });

        const ranksData = [];

        for (let item of top5Results) {
            const targetUrl = item.url;
            let desktopImg = serpImg;
            let mobileImg = serpImg;
            let directImg = serpImg;

            // 1. Desktop Screenshot
            try {
                const desktopPage = await browser.newPage();
                await desktopPage.setViewport({ width: 1366, height: 768 });
                await desktopPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => {});
                await new Promise(resolve => setTimeout(resolve, 1500));
                const deskBuf = await desktopPage.screenshot({ encoding: 'base64' });
                if (deskBuf) desktopImg = `data:image/png;base64,${deskBuf}`;
                await desktopPage.close();
            } catch (e) {}

            // 2. Mobile Screenshot
            try {
                const mobilePage = await browser.newPage();
                await mobilePage.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
                await mobilePage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.58 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
                await mobilePage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => {});
                await new Promise(resolve => setTimeout(resolve, 1500));
                const mobBuf = await mobilePage.screenshot({ encoding: 'base64' });
                if (mobBuf) mobileImg = `data:image/png;base64,${mobBuf}`;
                await mobilePage.close();
            } catch (e) {}

            // 3. Direct Screenshot
            try {
                const directPage = await browser.newPage();
                await directPage.setViewport({ width: 1440, height: 900, isMobile: false });
                await directPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => {});
                await new Promise(resolve => setTimeout(resolve, 1500));
                const directBuf = await directPage.screenshot({ encoding: 'base64' });
                if (directBuf) directImg = `data:image/png;base64,${directBuf}`;
                await directPage.close();
            } catch (e) {}

            ranksData.push({
                rank: item.rank,
                title: item.title,
                url: item.url,
                images: {
                    serp: serpImg,
                    desktop: desktopImg,
                    mobile: mobileImg,
                    direct: directImg
                }
            });
        }

        await browser.close();

        return {
            success: true,
            ranksData: ranksData
        };

    } catch (err) {
        try { await browser.close(); } catch(e) {}
        throw err;
    }
}

if (require.main === module) {
    const rawArgs = process.argv[2];
    if (rawArgs) {
        (async () => {
            try {
                const payload = JSON.parse(rawArgs);
                const hasil = await hitungRankChecker(payload);
                console.log(JSON.stringify(hasil, null, 2));
            } catch (e) {
                console.log(JSON.stringify({ success: false, output: e.message }));
            }
        })();
    }
}

module.exports = { uiHtml, clientScript, hitungRankChecker };