const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { fork, exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const presetDir = path.join(__dirname, 'presets');
const modulesDir = path.join(__dirname, 'modules');

if (!fs.existsSync(presetDir)) fs.mkdirSync(presetDir);
if (!fs.existsSync(modulesDir)) fs.mkdirSync(modulesDir);

let activeBotProcess = null;

// Endpoint untuk menjalankan bot Puppeteer bawaan (Admin 21 & Mez.ink)
app.post('/run-bot', (req, res) => {
    const botData = req.body;
    const payload = JSON.stringify(botData);
    
    if (activeBotProcess) {
        try {
            activeBotProcess.send({ action: 'close' });
            activeBotProcess.kill();
        } catch(e) {}
        activeBotProcess = null;
    }

    activeBotProcess = fork(path.join(__dirname, 'bot.js'), [payload]);

    activeBotProcess.on('exit', () => {
        activeBotProcess = null;
    });
    
    res.json({ success: true, message: 'Bot otomatis berhasil dijalankan!' });
});

// Endpoint untuk menutup semua jendela bot aktif (Close All)
app.post('/close-admin-21', (req, res) => {
    if (activeBotProcess) {
        try {
            activeBotProcess.send({ action: 'close' });
            activeBotProcess.kill();
        } catch(e) {}
        activeBotProcess = null;
        res.json({ success: true, message: 'Semua jendela berhasil ditutup!' });
    } else {
        res.json({ success: true, message: 'Tidak ada jendela bot yang aktif.' });
    }
});

// === TRUE PLUG-AND-PLAY: INSTALL MODULE & UI PARSER ===
app.post('/install-module', (req, res) => {
    const { filename, code, name, desc } = req.body;
    if (!filename || !code) {
        return res.status(400).json({ success: false, message: 'File skrip tidak boleh kosong!' });
    }
    
    const safeName = filename.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
    const filePath = path.join(modulesDir, safeName);
    
    fs.writeFile(filePath, code, (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        
        res.json({ 
            success: true, 
            message: `Plugin ${safeName} berhasil diinstal otomatis!`,
            pluginInfo: {
                id: 'plugin_' + Date.now(),
                name: name || safeName.replace('.js', ''),
                desc: desc || 'Plugin kustom terinstal otomatis.',
                script: safeName,
                allowedUsers: []
            }
        });
    });
});

// Endpoint untuk mengambil UI & Skrip kustom dari file plugin (.js)
app.get('/get-plugin-ui/:scriptName', (req, res) => {
    try {
        const scriptPath = path.join(modulesDir, req.params.scriptName);
        if (!fs.existsSync(scriptPath)) {
            return res.status(404).json({ success: false, message: 'File plugin tidak ditemukan.' });
        }
        delete require.cache[require.resolve(scriptPath)];
        const pluginModule = require(scriptPath);
        res.json({
            success: true,
            uiHtml: pluginModule.uiHtml || '<p class="text-zinc-500">Tidak ada UI kustom.</p>',
            clientScript: pluginModule.clientScript ? pluginModule.clientScript.toString() : ''
        });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Endpoint Universal: Menjalankan file plugin (.js) apa pun secara dinamis
app.post('/run-plugin', (req, res) => {
    const { scriptName, payload } = req.body;
    const scriptPath = path.join(modulesDir, scriptName);

    if (!fs.existsSync(scriptPath)) {
        return res.status(404).json({ success: false, output: 'File skrip plugin tidak ditemukan di server.' });
    }

    const safePayload = JSON.stringify(payload || {}).replace(/"/g, '\\"');
    
    exec(`node "${scriptPath}" "${safePayload}"`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: false, output: stderr || error.message });
        }
        res.json({ success: true, output: stdout });
    });
});
// ======================================================

// Endpoint Manajemen Preset
app.post('/save-preset', (req, res) => {
    const { name, data } = req.body;
    if (!name || !data) return res.status(400).json({ success: false, message: 'Data kosong!' });
    
    const safeName = name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    fs.writeFile(path.join(presetDir, `${safeName}.json`), JSON.stringify(data, null, 2), (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Preset tersimpan!' });
    });
});

app.get('/get-presets', (req, res) => {
    fs.readdir(presetDir, (err, files) => {
        if (err) return res.status(500).json({ success: false, files: [] });
        res.json({ success: true, files: files.filter(f => f.endsWith('.json')) });
    });
});

app.get('/load-preset/:filename', (req, res) => {
    const filePath = path.join(presetDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, data: JSON.parse(data) });
        });
    } else {
        res.status(404).json({ success: false, message: 'File tidak ditemukan' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[Server] Berjalan di http://localhost:${PORT}`);
});