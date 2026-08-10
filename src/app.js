const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const Sentry = require('@sentry/node');
const env = require('./config/env');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const requestId = require('./middlewares/requestId');
const sanitizeInput = require('./middlewares/sanitizeInput');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const parentRoutes = require('./routes/parentRoutes');
const adminSubscriptionRoutes = require('./routes/adminSubscriptionRoutes');
const blogRoutes = require('./routes/blogRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0.1
  });
  if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
    app.use(Sentry.Handlers.requestHandler());
  }
}

app.use(requestId);
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://www.googletagmanager.com", 
        "https://checkout.razorpay.com", 
        "https://cdnjs.cloudflare.com",
        "https://cdn.tailwindcss.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://www.google-analytics.com", "https://*.razorpay.com", "https://razorpay.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://*.analytics.google.com", "https://*.razorpay.com", "wss:"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      mediaSrc: ["'self'", "data:", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  xssFilter: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(function(req, res, next) {
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
const allowedOrigins = env.CORS_ORIGINS 
  ? env.CORS_ORIGINS.split(',').map(o => o.trim()) 
  : ['http://localhost:3000', 'http://localhost:1234', 'https://digitaltwinvrs.com', 'https://www.digitaltwinvrs.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Blocked: ' + origin));
    }
  },
  credentials: true
}));
app.use(compression());
app.use(sanitizeInput);
app.use('/api', generalLimiter);

const { authenticateOptional } = require('./middlewares/auth');
const { requirePremium } = require('./middlewares/subscription');

if (env.FILE_STORAGE === 'local') {
  // Use authenticateOptional to identify user, then requirePremium restricts access
  app.use('/uploads', authenticateOptional, requirePremium, express.static(path.join(process.cwd(), env.UPLOAD_DIR)));
}

// Lightweight ping endpoint for external cron jobs to prevent "output too large" errors
app.get('/ping', function(req, res) {
  // CRITICAL: Prevent Render CDN/Edge from caching this response, which would let the server sleep
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.status(200).send('OK');
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/genesis', require('./routes/genesisRoutes'));
app.use('/api', aiRoutes);
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1', routes);
app.use('/api/offer-letters', require('./routes/offerLetterRoutes'));

// Simple admin dashboard to browse DB
app.use('/dashboard', dashboardRoutes);

const publicDir = path.join(__dirname, '..', 'public');
const parentUiDir = path.join(__dirname, '..', 'parent-ui', 'dist');

// Pillar Landing Page Route: Career Guidance After 12th
app.get(['/career-guidance-after-12th', '/career-guidance-after-12th/'], (req, res) => {
  const pillarPath = path.join(publicDir, 'career-guidance-after-12th', 'index.html');
  if (require('fs').existsSync(pillarPath)) {
    res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return res.sendFile(pillarPath);
  }
  res.sendFile(path.join(publicDir, 'career-guidance-after-12th.html'));
});

// Flagship Onboarding Route: Genesis
app.get(['/genesis', '/genesis/'], (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.sendFile('genesis/index.html', { root: publicDir }, (err) => {
    if (err) {
      res.sendFile('genesis.html', { root: publicDir });
    }
  });
});

// Dedicated Problem Topic Pages Route
app.get(['/problem/:topic', '/problem/:topic/'], (req, res) => {
  const problemTopic = req.params.topic;
  const probPath = path.join(publicDir, 'problem', problemTopic, 'index.html');
  if (require('fs').existsSync(probPath)) {
    res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return res.sendFile(probPath);
  }
  res.redirect('/');
});


// Leaderboard API
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/version', (req, res) => {
  try {
    const versionPath = path.join(__dirname, '..', 'build-version.json');
    if (require('fs').existsSync(versionPath)) {
      const versionData = require(versionPath);
      return res.json({ version: versionData.version });
    }
  } catch (e) {}
  res.json({ version: 'dev' });
});

app.use('/api', function(_req, res) {
  res.status(404).json({ error: 'API route not found.' });
});

// Self-healing fallback for React app asset requests (login.html, wheel.html)
// Serves the latest hashed JS/CSS file when old cached hash is requested
app.use('/assets', function(req, res, next) {
  const fs = require('fs');
  const assetsDir = path.join(publicDir, 'assets');
  const requestedPath = path.join(assetsDir, req.path);

  // Exact file exists — serve it normally
  if (fs.existsSync(requestedPath)) return next();

  try {
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const ext = path.extname(req.path); // .js or .css
      const latestAsset = files.find(f => f.endsWith(ext));
      if (latestAsset) {
        console.log(`[Auto-Heal /assets] ${req.path} → serving latest ${latestAsset}`);
        if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
        if (ext === '.css') res.setHeader('Content-Type', 'text/css');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.sendFile(path.join(assetsDir, latestAsset));
      }
    }
  } catch (e) {
    console.error('[Auto-Heal /assets] Error:', e.message);
  }
  next();
});

app.use('/dist', (req, res, next) => {
  const fs = require('fs');
  const path = require('path');
  const distDir = path.join(publicDir, 'dist');
  
  const requestedPath = path.join(distDir, req.path);
  if (fs.existsSync(requestedPath)) return next();

  try {
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      const baseMatch = req.path.match(/^\/(app|ux-engine|main|careers)\.[0-9a-f]+\.(js|css)$/);
      if (baseMatch) {
        const prefix = baseMatch[1] + '.';
        const ext = '.' + baseMatch[2];
        const latestFile = files.find(f => f.startsWith(prefix) && f.endsWith(ext));
        if (latestFile) {
          // Serve latest file, prevent caching so they eventually get the right one
          res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          return res.sendFile(path.join(distDir, latestFile));
        }
      }
    }
  } catch (e) { /* ignore */ }
  next();
});

app.get('/sitemap.xml', (req, res, next) => {
  try {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    if (!require('fs').existsSync(sitemapPath)) return next();
    let sitemap = require('fs').readFileSync(sitemapPath, 'utf-8');
    const blogsPath = path.join(__dirname, 'data', 'blogs.json');
    if (require('fs').existsSync(blogsPath)) {
      const blogs = JSON.parse(require('fs').readFileSync(blogsPath, 'utf-8'));
      let blogEntries = '';
      blogs.forEach(b => {
        blogEntries += `\n  <url>\n    <loc>https://digitaltwinvrs.com/blog/${b.slug}</loc>\n    <lastmod>${b.publishedDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      });
      // Add /blog index too
      blogEntries += `\n  <url>\n    <loc>https://digitaltwinvrs.com/blog</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
      blogEntries += `\n  <url>\n    <loc>https://digitaltwinvrs.com/career-guidance-after-12th</loc>\n    <lastmod>2026-08-02</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`;
      sitemap = sitemap.replace('</urlset>', blogEntries + '\n</urlset>');
    }
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    next();
  }
});

app.use(express.static(publicDir, {
  index: false, // Handle index.html manually for strict caching
  setHeaders: (res, filePath) => {
    if (filePath.includes('/dist/') || filePath.match(/\.[0-9a-f]{8}\.(js|css)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Serve parent portal static files with strict caching headers
app.use('/parent', express.static(parentUiDir, {
  setHeaders: (res, filePath) => {
    if (filePath.includes('/assets/') || filePath.match(/\.[0-9a-zA-Z]+\.(js|css)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    } else {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Auto-healing middleware for cached asset requests in Parent Portal
app.use('/parent/assets', function(req, res, next) {
  const fs = require('fs');
  const assetPath = path.join(parentUiDir, 'assets', req.path);
  if (fs.existsSync(assetPath)) {
    return res.sendFile(assetPath);
  }
  // If exact hashed file doesn't exist (e.g., cached index.html requesting old hash),
  // find the latest .js or .css file in parent-ui/dist/assets and serve it!
  try {
    const assetsDir = path.join(parentUiDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const ext = path.extname(req.path); // .js or .css
      const latestAsset = files.find(f => f.endsWith(ext));
      if (latestAsset) {
        console.log(`Auto-healing asset request: ${req.path} -> serving latest ${latestAsset}`);
        if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
        if (ext === '.css') res.setHeader('Content-Type', 'text/css');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.sendFile(path.join(assetsDir, latestAsset));
      }
    }
  } catch (err) {
    console.error('Auto-healing asset error:', err);
  }
  res.status(404).send('Asset not found');
});

app.use(function(req, res, next) {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  if (req.path.startsWith('/parent')) {
    console.log('Serving SPA fallback for Parent Portal.');
    return res.sendFile('index.html', { root: parentUiDir }, (err) => {
      if (err) {
        console.error('sendFile error for Parent SPA:', err);
        next(err);
      }
    });
  }

  console.log('Serving SPA fallback for root.');
  res.sendFile('index.html', { root: publicDir }, (err) => {
    if (err) {
      console.error('sendFile error for SPA:', err);
      next(err);
    }
  });
});

if (env.SENTRY_DSN && Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
