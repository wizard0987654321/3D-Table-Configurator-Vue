import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. Verbindung herstellen
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 2. Verbindung testen & prüfen ob die users-Tabelle existiert
pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('❌ FEHLER: Konnte nicht zur Datenbank verbinden:', err.stack);
    }
    console.log('✅ Erfolgreich mit PostgreSQL verbunden.');
    
    try {
        // Prüfen ob die users-Tabelle existiert (wird NICHT erstellt, da sie schon existiert)
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        if (tableCheck.rows[0].exists) {
            console.log('✅ Tabelle "users" gefunden – bereit.');
        } else {
            console.error('❌ Tabelle "users" wurde NICHT gefunden! Bitte in pgAdmin prüfen.');
        }
    } catch (tableErr) {
        console.error('❌ Fehler beim Prüfen der Tabelle:', tableErr);
    } finally {
        release();
    }
});

// LOGIN Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log(`[LOGIN VERSUCH] User: ${username}`);

    try {
        // 1. Prüfen ob der Benutzername in der users-Tabelle existiert
        const userCheck = await pool.query(
            'SELECT id, username, password FROM users WHERE username = $1',
            [username]
        );
        
        if (userCheck.rows.length === 0) {
            console.log('--> Benutzername nicht gefunden');
            return res.status(401).json({ error: "Benutzername nicht gefunden" });
        }

        // 2. Passwort prüfen
        const user = userCheck.rows[0];
        if (user.password !== password) {
            console.log('--> Falsches Passwort');
            return res.status(401).json({ error: "Falsches Passwort" });
        }

        console.log('--> Login erfolgreich');
        res.json({ message: "Erfolg", user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('❌ SERVER FEHLER:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// REGISTER Endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, password]
        );
        console.log(`--> Neuer User registriert: ${username}`);
        res.json({ message: "User erstellt", user: result.rows[0] });
    } catch (err) {
        console.error('❌ REGISTER FEHLER:', err.message);
        res.status(400).json({ error: "Benutzername bereits vergeben" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));