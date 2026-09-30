const puppeteer = require('puppeteer');

let activeBrowsers = [];

// Mendengarkan perintah tutup dari server untuk fitur Close All
process.on('message', async (msg) => {
    if (msg && msg.action === 'close') {
        console.log('[System] Perintah Close All diterima. Menutup semua jendela browser...');
        for (let browser of activeBrowsers) {
            try {
                await browser.close();
            } catch (e) {}
        }
        process.exit(0);
    }
});

(async () => {
    const rawData = process.argv[2];
    if (!rawData) {
        console.error('[Error] Data payload tidak ditemukan!');
        process.exit(1);
    }

    let botData;
    try {
        botData = JSON.parse(rawData);
    } catch (e) {
        console.error('[Error] Format JSON payload tidak valid:', e.message);
        process.exit(1);
    }

    // =========================================================================
    // MODUL TAMBAHAN: ADMIN 21 AUTO LOGIN (HORIZONTAL FIT + PENCATAT BROWSER)
    // =========================================================================
    if (botData.task === 'admin-21') {
        console.log('[System] Menjalankan Bot Auto Login Admin 21 (Screen-Fit Horizontal)...');
        const accounts = botData.accounts || [];
        const mode = botData.mode || 'simultaneous';

        if (accounts.length === 0) {
            console.error('[Error] Tidak ada akun Admin 21 yang dipilih!');
            process.exit(1);
        }

        console.log(`[System] Membuka ${accounts.length} jendela tersusun menyamping agar pas di satu layar...`);

        for (let i = 0; i < accounts.length; i++) {
            const acc = accounts[i];
            const windowWidth = 580;
            const windowHeight = 980;
            
            // Jarak geser horizontal diatur agar 9 jendela muat sempurna dalam satu layar PC/laptop
            const posX = i * 165; 
            const posY = 0;

            try {
                const browser = await puppeteer.launch({
                    headless: false,
                    defaultViewport: null,
                    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    args: [
                        `--window-size=${windowWidth},${windowHeight}`,
                        `--window-position=${posX},${posY}`,
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                });
                
                // Catat instance browser agar bisa ditutup sekaligus via Close All
                activeBrowsers.push(browser);

                const page = await browser.newPage();
                loginAdmin21(page, acc);

                if (mode === 'sequential') {
                    await new Promise(resolve => setTimeout(resolve, 2500));
                } else {
                    await new Promise(resolve => setTimeout(resolve, 400));
                }
            } catch (err) {
                console.error(`[Error Buka Jendela ${acc.username}]:`, err.message);
            }
        }

        console.log('\n[Success] Seluruh 9 jendela Admin 21 berhasil dibuka dan pas di satu layar!');
        await new Promise(() => {});
        return;
    }

    // =========================================================================
    // KODE ASLI 100% UTUH: VALIDASI EKSKLUSIF UNTUK PLATFORM MEZ.INK[cite: 1]
    // =========================================================================
    const targetPlatform = (botData.platform || '').toLowerCase();
    
    console.log('[System] Memeriksa target platform:', botData.platform);

    if (!targetPlatform.includes('mez.ink')) {
        console.error('[Error Pembatasan Bot]: Platform target bukan mez.ink! Bot ini dikunci khusus untuk pendaftaran dan manajemen link Mezink saja.');
        process.exit(1);
    }

    console.log('[System] Platform terverifikasi: Mez.ink. Melanjutkan eksekusi bot khusus...');

    const FILL_DIRECTION = botData.fillDirection || botData.direction || 'top-to-bottom';
    console.log('[System] Memulai pengetikan otomatis untuk akun:', botData.akun);
    console.log('[System] Mode arah pengisian dari Admin:', FILL_DIRECTION);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--window-size=580,1040',
            '--window-position=1340,0',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    activeBrowsers.push(browser);

    try {
        const page = await browser.newPage();

        console.log('[Network] Menuju ke halaman https://mez.ink/sign-up ...');
        await page.goto('https://mez.ink/sign-up', { waitUntil: 'networkidle2', timeout: 30000 });

        // 1. Mengisi kolom Email otomatis
        console.log('[Bot] Mengetik Email:', botData.email);
        await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
        await page.type('input[type="email"], input[name="email"]', botData.email, { delay: 80 });

        // 2. Mengisi kolom Password otomatis
        console.log('[Bot] Mengetik Password...');
        await page.type('input[type="password"]', botData.password, { delay: 80 });

        // 3. Mengisi kolom URL / Username otomatis
        console.log('[Bot] Mengetik URL (Nama Akun):', botData.akun);
        const inputs = await page.$$('input');
        if (inputs.length >= 3) {
            await inputs[2].click();
            await inputs[2].type(botData.akun, { delay: 80 });
        } else {
            await page.type('input[type="text"]', botData.akun, { delay: 80 });
        }

        // Jeda 2 detik sebelum klik Sign Up
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Klik "Sign Up"
        console.log('[Bot] Mengklik tombol Sign Up...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button'));
            let btn = buttons.find(b => b.innerText.includes('Sign Up') || b.type === 'submit');
            if (btn) btn.click();
        });

        // ==========================================
        // RANGKAIAN ALUR KLIK BERTAHAP & JEDA WAKTU
        // ==========================================

        // Tahap 1: Halaman Set up your profile (Klik Next pertama)
        console.log('[Bot] Menunggu 3 detik di halaman Set up your profile...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('[Bot] Mengklik tombol Next (1)...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button'));
            let btn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('next'));
            if (btn) btn.click();
        });

        // Tahap 2: Halaman Pilih Tampilan / Style (Klik Next kedua)
        console.log('[Bot] Menunggu 3 detik di halaman pemilihan style...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('[Bot] Mengklik tombol Next (2)...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button'));
            let btn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('next'));
            if (btn) btn.click();
        });

        // Tahap 3: Halaman Add your social links (Klik Next ketiga)
        console.log('[Bot] Menunggu 3 detik di halaman Add your social links...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('[Bot] Mengklik tombol Next (3)...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button'));
            let btn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('next'));
            if (btn) btn.click();
        });

        // Tahap 4: Halaman Akhir (Klik tombol "Continue building")
        console.log('[Bot] Menunggu 3 detik di halaman akhir...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('[Bot] Mengklik tombol Continue building...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button'));
            let continueBtn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('continue building'));
            if (continueBtn) continueBtn.click();
        });

        // Tahap 5: PINTASAN LANGSUNG KE URL EDITOR
        console.log('[Bot] Menunggu 4 detik proses penyimpanan akun...');
        await new Promise(resolve => setTimeout(resolve, 4000));

        console.log('[Bot] Mengarahkan langsung ke link Editor: https://mez.ink/editor/contents?type=edit&id=0');
        await page.goto('https://mez.ink/editor/contents?type=edit&id=0', { waitUntil: 'networkidle2', timeout: 30000 });

        // Tahap 6: Halaman Editor
        console.log('[Bot] Halaman Editor terbuka sempurna. Menunggu 3 detik...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 1. Klik tombol "Re-send"
        console.log('[Bot] Mengklik tombol Re-send...');
        await page.evaluate(() => {
            let allEls = Array.from(document.querySelectorAll('button, div, span'));
            let resendBtn = allEls.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Re-send');
            if (resendBtn) {
                resendBtn.click();
            } else {
                let btnTarget = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Re-send'));
                if (btnTarget) btnTarget.click();
            }
        });

        // Beri jeda 4 detik
        console.log('[Bot] Menunggu 4 detik setelah Re-send...');
        await new Promise(resolve => setTimeout(resolve, 4000));

        // ==========================================
        // PENGAMBILAN DATA & PENGATURAN ARAH PERULANGAN
        // ==========================================
        let linksArray = [];
        if (Array.isArray(botData)) {
            linksArray = botData;
        } else {
            for (let key in botData) {
                if (Array.isArray(botData[key]) && botData[key].length > 0) {
                    linksArray = botData[key];
                    break;
                }
            }
            if (linksArray.length === 0) {
                linksArray = botData.links || botData.link || botData.list_link || botData.payload || [];
            }
        }

        // Jika admin memilih 'bottom-to-top', balik urutan array-nya
        if (FILL_DIRECTION === 'bottom-to-top') {
            linksArray = [...linksArray].reverse();
        }

        if (linksArray.length > 0) {
            console.log(`[System] Ditemukan ${linksArray.length} tautan. Memproses sesuai mode: ${FILL_DIRECTION}`);

            // MELAKUKAN PERULANGAN UNTUK SETIAP LINK
            for (let i = 0; i < linksArray.length; i++) {
                const currentLink = linksArray[i];
                console.log(`\n--- [Memproses Link ${i + 1} dari ${linksArray.length}] ---`);
                console.log('Title:', currentLink.title);
                console.log('URL:', currentLink.url);

                // Menuju ke halaman form add link
                await page.goto('https://mez.ink/editor/links?type=add&id=53', { waitUntil: 'networkidle2', timeout: 30000 });
                await new Promise(resolve => setTimeout(resolve, 2500));

                // Mengetik Title & URL secara otomatis menggunakan simulasi pengetikan karakter asli
                await page.waitForSelector('input', { timeout: 5000 }).catch(() => {});
                const allInputs = await page.$$('input');

                if (allInputs.length >= 2) {
                    // Ketik Title
                    await allInputs[0].click({ clickCount: 3 });
                    await allInputs[0].press('Backspace');
                    await allInputs[0].type(currentLink.title, { delay: 60 });

                    // Ketik URL
                    await allInputs[1].click({ clickCount: 3 });
                    await allInputs[1].press('Backspace');
                    await allInputs[1].type(currentLink.url, { delay: 60 });
                }

                // Jeda 1.5 detik agar tombol Apply menyala aktif
                await new Promise(resolve => setTimeout(resolve, 1500));

                // KLIK TOMBOL "APPLY" MENGGUNAKAN KOORDINAT PRESISI TINGGI
                console.log('[Bot] Mencari dan mengklik tombol Apply...');
                let applyClicked = await page.evaluate(async () => {
                    let buttons = Array.from(document.querySelectorAll('button, div'));
                    let applyBtn = buttons.find(b => b.innerText && b.innerText.trim() === 'Apply');
                    if (applyBtn) {
                        let rect = applyBtn.getBoundingClientRect();
                        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                    }
                    return null;
                });

                if (applyClicked) {
                    await page.mouse.click(applyClicked.x, applyClicked.y);
                } else {
                    await page.evaluate(() => {
                        let buttons = Array.from(document.querySelectorAll('button, div'));
                        let applyBtn = buttons.find(b => b.innerText && b.innerText.trim() === 'Apply');
                        if (applyBtn) applyBtn.click();
                    });
                }

                // Jeda tunggu 3 detik agar proses penyimpanan link selesai sebelum lanjut ke link berikutnya
                console.log('[Bot] Menunggu 3 detik proses penyimpanan tautan...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            console.log('\n[Success] Seluruh tautan Mezink berhasil diisi dan diterapkan!');
        } else {
            console.error('[Error] Data links kosong atau tidak ditemukan di payload.');
        }

    } catch (error) {
        console.error('[Bot Error Terdeteksi]:', error.message);
    }

    // Menjaga agar browser tetap terbuka stabil
    await new Promise(() => {});
})();

// Fungsi pendukung login otomatis Admin 21
async function loginAdmin21(page, acc) {
    try {
        console.log(`[Network] Membuka ${acc.url} untuk akun: ${acc.username}`);
        await page.goto(acc.url, { waitUntil: 'networkidle2', timeout: 30000 });

        console.log(`[Bot] Mengetik Username: ${acc.username}`);
        await page.waitForSelector('input[type="text"], input[name="username"], input[name="user"]', { timeout: 15000 });
        
        // Mengisi input username
        await page.evaluate((uname) => {
            let inputs = Array.from(document.querySelectorAll('input[type="text"], input[name="username"], input[name="user"], input:not([type])'));
            if (inputs.length > 0) {
                inputs[0].value = uname;
                inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, acc.username);

        console.log('[Bot] Mengetik Password...');
        await page.evaluate((pass) => {
            let pInput = document.querySelector('input[type="password"]');
            if (pInput) {
                pInput.value = pass;
                pInput.dispatchEvent(new Event('input', { bubbles: true }));
                pInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, acc.password);

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('[Bot] Mengklik tombol Login...');
        await page.evaluate(() => {
            let buttons = Array.from(document.querySelectorAll('button, input[type="submit"], button[type="submit"]'));
            let btn = buttons.find(b => {
                let text = (b.innerText || b.value || '').toLowerCase();
                return text.includes('login') || text.includes('masuk') || text.includes('sign in') || b.type === 'submit';
            });
            if (btn) btn.click();
            else {
                let form = document.querySelector('form');
                if (form) form.submit();
            }
        });

        console.log(`[Success] Tab akun ${acc.username} berhasil diproses.`);
    } catch (err) {
        console.error(`[Error Login ${acc.username}]:`, err.message);
    }
}