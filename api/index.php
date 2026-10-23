<?php
/**
 * API skor mini game — PHP 7.4+ dengan SQLite (ekstensi pdo_sqlite).
 * Letakkan folder api/ di hosting yang mendukung PHP. File data dibuat otomatis di api/data/.
 *
 * Endpoint:
 *   GET  ?action=ping
 *   POST ?action=register     {username}              -> {ok, username, token}
 *   POST ?action=submit       {token, game, score}    -> {ok, best, newBest}
 *   GET  ?action=leaderboard&game=survei|memori|jalur|kuis|total
 *   GET  ?action=visitors
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const GAMES = ['survei', 'memori', 'jalur', 'kuis'];
// Batas skor maksimum yang masuk akal per game (anti-curang sederhana)
const MAX_SCORE = ['survei' => 3000, 'memori' => 3000, 'jalur' => 3000, 'kuis' => 2000];
const MIN_SECONDS_BETWEEN_SUBMITS = 10;

function out($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function db() {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        // Cegah akses langsung ke file database (Apache)
        file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    }
    $pdo = new PDO('sqlite:' . $dir . '/scores.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA journal_mode=WAL');
    $pdo->exec('CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        token_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_submit INTEGER NOT NULL DEFAULT 0
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        game TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at INTEGER NOT NULL
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game, score DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_scores_player ON scores(player_id)');
    return $pdo;
}

function body() {
    $raw = file_get_contents('php://input');
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

function rate_limit($key, $max, $window) {
    // Pembatas sederhana berbasis file per IP
    $f = sys_get_temp_dir() . '/pf_rl_' . md5($key);
    $now = time();
    $hits = [];
    if (is_file($f)) $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($f))), fn($t) => $t > $now - $window);
    if (count($hits) >= $max) out(['ok' => false, 'error' => 'Terlalu banyak permintaan. Coba sebentar lagi.'], 429);
    $hits[] = $now;
    @file_put_contents($f, implode(',', $hits));
}

$action = $_GET['action'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';

try {
    switch ($action) {
        case 'ping':
            db();
            out(['ok' => true]);

        case 'register':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['ok' => false, 'error' => 'Metode salah'], 405);
            rate_limit('reg_' . $ip, 5, 3600);
            $u = trim((string)(body()['username'] ?? ''));
            if (!preg_match('/^[A-Za-z0-9_]{3,16}$/', $u)) {
                out(['ok' => false, 'error' => 'Username 3–16 karakter: huruf, angka, atau garis bawah (_).']);
            }
            $token = bin2hex(random_bytes(24));
            try {
                $st = db()->prepare('INSERT INTO players (username, token_hash, created_at) VALUES (?, ?, ?)');
                $st->execute([$u, hash('sha256', $token), time()]);
            } catch (PDOException $e) {
                out(['ok' => false, 'error' => 'Username sudah dipakai. Pilih yang lain.']);
            }
            out(['ok' => true, 'username' => $u, 'token' => $token]);

        case 'submit':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['ok' => false, 'error' => 'Metode salah'], 405);
            $b = body();
            $game = (string)($b['game'] ?? '');
            $score = (int)($b['score'] ?? -1);
            $token = (string)($b['token'] ?? '');
            if (!in_array($game, GAMES, true) || $score < 0) out(['ok' => false, 'error' => 'Data tidak valid'], 400);
            if ($score > MAX_SCORE[$game]) out(['ok' => false, 'error' => 'Skor tidak valid'], 400);
            $pdo = db();
            $st = $pdo->prepare('SELECT id, last_submit FROM players WHERE token_hash = ?');
            $st->execute([hash('sha256', $token)]);
            $p = $st->fetch(PDO::FETCH_ASSOC);
            if (!$p) out(['ok' => false, 'error' => 'Sesi tidak dikenal. Daftar ulang.'], 401);
            if (time() - (int)$p['last_submit'] < MIN_SECONDS_BETWEEN_SUBMITS) {
                out(['ok' => false, 'error' => 'Terlalu cepat mengirim skor.'], 429);
            }
            $pdo->prepare('INSERT INTO scores (player_id, game, score, created_at) VALUES (?, ?, ?, ?)')
                ->execute([$p['id'], $game, $score, time()]);
            $pdo->prepare('UPDATE players SET last_submit = ? WHERE id = ?')->execute([time(), $p['id']]);
            $st = $pdo->prepare('SELECT MAX(score) FROM scores WHERE player_id = ? AND game = ?');
            $st->execute([$p['id'], $game]);
            $best = (int)$st->fetchColumn();
            out(['ok' => true, 'best' => $best, 'newBest' => $score >= $best]);

        case 'leaderboard':
            $game = (string)($_GET['game'] ?? 'total');
            $pdo = db();
            if ($game === 'total') {
                $sql = 'SELECT username, SUM(b) AS score FROM (
                            SELECT p.username, MAX(s.score) AS b FROM scores s
                            JOIN players p ON p.id = s.player_id GROUP BY s.player_id, s.game
                        ) GROUP BY username ORDER BY score DESC LIMIT 10';
                $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            } elseif (in_array($game, GAMES, true)) {
                $st = $pdo->prepare('SELECT p.username, MAX(s.score) AS score FROM scores s
                    JOIN players p ON p.id = s.player_id WHERE s.game = ?
                    GROUP BY s.player_id ORDER BY score DESC LIMIT 10');
                $st->execute([$game]);
                $rows = $st->fetchAll(PDO::FETCH_ASSOC);
            } else out(['ok' => false, 'error' => 'Game tidak dikenal'], 400);
            foreach ($rows as &$r) $r['score'] = (int)$r['score'];
            out(['ok' => true, 'rows' => $rows]);

        case 'visitors':
            $sql = 'SELECT username, SUM(b) AS total, COUNT(*) AS games, SUM(plays) AS plays, MAX(last) AS last FROM (
                        SELECT p.username, s.game, MAX(s.score) AS b, COUNT(*) AS plays, MAX(s.created_at) AS last
                        FROM scores s JOIN players p ON p.id = s.player_id GROUP BY s.player_id, s.game
                    ) GROUP BY username ORDER BY last DESC LIMIT 50';
            $rows = db()->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as &$r) { $r['total'] = (int)$r['total']; $r['games'] = (int)$r['games']; $r['plays'] = (int)$r['plays']; $r['last'] = (int)$r['last']; }
            out(['ok' => true, 'rows' => $rows]);

        default:
            out(['ok' => false, 'error' => 'Aksi tidak dikenal'], 400);
    }
} catch (Throwable $e) {
    out(['ok' => false, 'error' => 'Kesalahan server'], 500);
}
