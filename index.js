// パッケージの読み込み
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// Expressアプリケーションの初期化
const app = express();
app.use(cors()); // すべてのオリジンからのアクセスを許可（開発用）
app.use(express.json()); // JSONボディをパースするため

// MySQL接続プールの作成
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ルーティング
// ルートURLへのGETリクエスト
app.get('/', (req, res) => {
  res.send('Prograroom API is running!');
});

// /usersへのGETリクエストで全ユーザー情報を取得
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// サーバーの起動
const port = process.env.API_PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
