const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 确保目录存在
['uploads', 'data'].forEach(d => {
  const p = path.join(__dirname, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// 文件上传配置
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

// 中间件
app.use(express.json({ limit: '200mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ========== API ==========

// 获取配置（所有设备共享）
app.get('/api/config', (req, res) => {
  try {
    const p = path.join(__dirname, 'data', 'config.json');
    if (fs.existsSync(p)) {
      const config = JSON.parse(fs.readFileSync(p, 'utf8'));
      res.json(config);
    } else {
      res.json(null);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 保存配置（所有设备共享）
app.post('/api/config', (req, res) => {
  try {
    const p = path.join(__dirname, 'data', 'config.json');
    fs.writeFileSync(p, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 上传文件（图片/视频）→ 返回 URL，所有设备可访问
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  const url = '/uploads/' + req.file.filename;
  res.json({ url, filename: req.file.filename, size: req.file.size });
});

// 删除文件
app.delete('/api/file/:name', (req, res) => {
  const p = path.join(__dirname, 'uploads', req.params.name);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'not found' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
