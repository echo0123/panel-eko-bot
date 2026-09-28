const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/run-bot', (req, res) => {
    const botData = req.body;
    console.log('[Server] Menerima data payload dari Dashboard:', botData);

    // Menjalankan bot.js sambil membawa data form web
    const botProcess = spawn('node', ['bot.js', JSON.stringify(botData)]);

    botProcess.stdout.on('data', (data) => {
        console.log(`[Bot Output]: ${data}`);
    });

    botProcess.stderr.on('data', (data) => {
        console.error(`[Bot Error]: ${data}`);
    });

    res.json({ status: 'success', message: 'Bot sukses berjalan membawa data form!' });
});

app.listen(3000, () => {
    console.log('--------------------------------------------------');
    console.log('🚀 Server jembatan aktif di: http://localhost:3000');
    console.log('--------------------------------------------------');
});