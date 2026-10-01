// ==========================================
// PLUGIN: JOWO POOLS 4D (SELF-INJECTING PLUGIN)
// ==========================================

// 1. HTML UI TEMPLATE (Tampilan yang akan otomatis disuntikkan ke Dashboard)
const uiHtml = `
    <div class="space-y-6">
        <div class="p-6 bg-zinc-900/60 rounded-lg border border-violet-500/30 space-y-5">
            <div class="flex items-center gap-3 border-b border-zinc-800 pb-3">
                <div class="w-10 h-10 bg-cyan-600/20 text-cyan-400 rounded-full flex items-center justify-center font-bold">4D</div>
                <div>
                    <h4 class="text-white font-bold text-sm">Jowo Pools Generate Engine</h4>
                    <p class="text-xs text-zinc-400">Masukkan 7 angka bola (maksimal 2 digit per kotak) untuk generate 4D.</p>
                </div>
            </div>

            <!-- 7 Kotak Input Bola (Maksimal 2 Digit) -->
            <div>
                <label class="block text-xs font-bold text-violet-400 mb-2">Input 7 Angka Bola Result (Maksimal 2 Digit)</label>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 1">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 2">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 3">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 4">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 5">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 6">
                    <input type="number" min="0" max="99" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" class="jw-ball bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm text-white focus:outline-none focus:border-violet-500" placeholder="Bola 7">
                </div>
            </div>

            <div class="flex gap-3 pt-2">
                <button onclick="jalankanPluginJwPools()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition shadow flex items-center gap-2">
                    ▶ JALANKAN GENERATE 4D
                </button>
                <button onclick="document.querySelectorAll('.jw-ball').forEach(i=>i.value=''); document.getElementById('jwResBox').innerText='- - - -';" class="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition">
                    Bersihkan Input
                </button>
            </div>

            <!-- Kolom Hasil Generate 4 Digit Angka -->
            <div class="p-4 bg-black/60 border border-emerald-500/40 rounded-lg space-y-1">
                <label class="block text-xs font-bold text-emerald-400 uppercase tracking-widest">Hasil Generate 4 Digit Angka</label>
                <div id="jwResBox" class="text-2xl font-black text-emerald-400 font-mono tracking-widest">
                    - - - -
                </div>
            </div>
        </div>

        <!-- Tabel History (No, Tanggal, Result 7 Bola, Hasil Generate) & Pencarian Tanggal -->
        <div class="p-6 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-4">
            <div class="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800 pb-3">
                <label class="text-xs font-bold text-cyan-400 uppercase tracking-widest">History Hasil Generate</label>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-zinc-400">Cari Tanggal:</span>
                    <input type="date" id="jwSearchDate" oninput="renderJwHistory()" class="bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                    <button onclick="document.getElementById('jwSearchDate').value=''; renderJwHistory();" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition">Reset</button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                        <tr class="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                            <th class="p-3 text-center w-12">No</th>
                            <th class="p-3">Tanggal</th>
                            <th class="p-3">Result 7 Bola</th>
                            <th class="p-3 text-center">Hasil Generate 4D</th>
                        </tr>
                    </thead>
                    <tbody id="jwHistoryBody">
                        <tr><td colspan="4" class="p-4 text-center text-zinc-500 italic">Belum ada riwayat.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

// 2. LOGIKA FRONTEND (Client-side script plugin)
function clientScript() {
    window.jalankanPluginJwPools = function() {
        let inputs = document.querySelectorAll('.jw-ball');
        let balls = [];
        
        for(let inp of inputs) {
            if(!inp.value) {
                alert('Harap isi ke-7 kotak angka bola terlebih dahulu!');
                return;
            }
            balls.push(Number(inp.value));
        }

        fetch('http://localhost:3000/run-plugin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scriptName: 'jwpools.js', payload: { balls: balls } })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                try {
                    let parsed = JSON.parse(data.output);
                    if(parsed.result4D) {
                        document.getElementById('jwResBox').innerText = parsed.result4D;
                        simpanJwHistory(balls, parsed.result4D);
                    }
                } catch(e) {}
            }
        });
    };

    window.simpanJwHistory = function(balls, res4d) {
        let now = new Date();
        let tanggalIso = now.toISOString().split('T')[0];
        let tanggalFormatted = now.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        
        let history = JSON.parse(localStorage.getItem('jw_history_plugin')) || [];
        history.unshift({
            dateIso: tanggalIso,
            tanggal: tanggalFormatted,
            balls: balls,
            result4d: res4d
        });

        if(history.length > 50) history.pop();
        localStorage.setItem('jw_history_plugin', JSON.stringify(history));
        renderJwHistory();
    };

    window.renderJwHistory = function() {
        let tbody = document.getElementById('jwHistoryBody');
        let searchDate = document.getElementById('jwSearchDate') ? document.getElementById('jwSearchDate').value : '';
        if(!tbody) return;

        let history = JSON.parse(localStorage.getItem('jw_history_plugin')) || [];
        if(searchDate) {
            history = history.filter(item => item.dateIso === searchDate);
        }

        if(history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-zinc-500 italic">Tidak ada riwayat ditemukan.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        history.forEach((h, idx) => {
            tbody.innerHTML += `
                <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                    <td class="p-3 text-center text-zinc-400">${idx + 1}</td>
                    <td class="p-3 text-zinc-300">${h.tanggal}</td>
                    <td class="p-3 text-zinc-200 font-bold">[${h.balls.join(', ')}]</td>
                    <td class="p-3 text-center text-emerald-400 font-bold text-sm">${h.result4d}</td>
                </tr>
            `;
        });
    };

    renderJwHistory();
}

// 3. LOGIKA BACKEND (Perhitungan Rumus Jowo Pools 4D)
function hitungJowoPools(balls) {
    if (!balls || balls.length < 7) {
        throw new Error("Harap masukkan data 7 bola dengan lengkap!");
    }

    const [b1, b2, b3, b4, b5, b6, b7] = balls.map(Number);

    const as = (b1 + b2 + b3 + b4) % 10;
    const kop = (b7 + b6 + b5 + b4) % 10;
    const kepalaEkor = String((((b1 + b2 + b4 + b6) * 10) + b1 + b3 + b5 + b7) % 100).padStart(2, '0');
    const result4D = `${as}${kop}${kepalaEkor}`;

    return {
        success: true,
        inputBalls: [b1, b2, b3, b4, b5, b6, b7],
        result4D: result4D
    };
}

if (require.main === module) {
    const rawArgs = process.argv[2];
    if (rawArgs) {
        try {
            const payload = JSON.parse(rawArgs);
            const hasil = hitungJowoPools(payload.balls);
            console.log(JSON.stringify(hasil, null, 2));
        } catch (e) {
            console.log(JSON.stringify({ success: false, output: e.message }));
        }
    }
}

module.exports = { uiHtml, clientScript, hitungJowoPools };