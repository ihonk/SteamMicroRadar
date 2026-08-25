import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Get Games List
app.get("/api/games", (req, res) => {
  try {
    const staticJsonPath = path.join(process.cwd(), "src", "staticGames.json");
    
    // Check if static pre-generated json exists for instant response
    if (fs.existsSync(staticJsonPath) && req.query.refresh !== "true") {
      try {
        const cached = JSON.parse(fs.readFileSync(staticJsonPath, "utf-8"));
        if (Array.isArray(cached) && cached.length > 0) {
          return res.json({ success: true, games: cached });
        }
      } catch (e) {
        // proceed to python exec
      }
    }

    // Run python fetcher or read cached db/json
    exec("python3 main.py --json", (error, stdout, stderr) => {
      if (!error && stdout) {
        try {
          const data = JSON.parse(stdout);
          if (Array.isArray(data) && data.length > 0) {
            fs.writeFileSync(staticJsonPath, JSON.stringify(data, null, 2), "utf-8");
            return res.json({ success: true, games: data });
          }
        } catch (e) {
          // fallback
        }
      }

      // Fallback 1: check static json again
      if (fs.existsSync(staticJsonPath)) {
        try {
          const fallback = JSON.parse(fs.readFileSync(staticJsonPath, "utf-8"));
          return res.json({ success: true, games: fallback });
        } catch (e) {}
      }

      // Fallback 2: check exported dashboard html
      const fallbackFile = path.join(process.cwd(), "steam_micro_indies_dashboard.html");
      if (fs.existsSync(fallbackFile)) {
        const content = fs.readFileSync(fallbackFile, "utf-8");
        const match = content.match(/const rawGamesData = (\[.*?\]);/s);
        if (match) {
          return res.json({ success: true, games: JSON.parse(match[1]) });
        }
      }

      res.status(500).json({ error: "Failed to fetch games data" });
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Analyze custom AppID
app.get("/api/analyze-appid", (req, res) => {
  const appid = req.query.appid;
  if (!appid) {
    return res.status(400).json({ error: "Missing appid parameter" });
  }

  exec(`python3 main.py --appid ${appid}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || "AppID analysis failed" });
    }
    res.json({ success: true, output: stdout });
  });
});

// API: Analyze text directly
app.post("/api/analyze-text", (req, res) => {
  const { developers = "", publishers = "", description = "" } = req.body;

  // Run quick Python analyzer script
  const script = `
import json
from team_analyzer import TeamAnalyzer
res = TeamAnalyzer.analyze(developers=${JSON.stringify(developers)}, publishers=${JSON.stringify(publishers)}, description=${JSON.stringify(description)})
print(json.dumps(res.to_dict(), ensure_ascii=False))
`;

  const child = exec("python3 -c " + JSON.stringify(script), (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || "Text analysis failed" });
    }
    try {
      const parsed = JSON.parse(stdout.trim());
      res.json({ success: true, result: parsed });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to parse analysis result: " + stdout });
    }
  });
});

// API: Python Source Files
app.get("/api/python-files", (req, res) => {
  try {
    const files = [
      { name: "fetcher.py", description: "Module 1: Steam API & SQLite 数据拉取与过滤", content: fs.readFileSync(path.join(process.cwd(), "fetcher.py"), "utf-8") },
      { name: "team_analyzer.py", description: "Module 2: 正则挖掘与创作者知识库团队分析器", content: fs.readFileSync(path.join(process.cwd(), "team_analyzer.py"), "utf-8") },
      { name: "html_exporter.py", description: "Module 3: 零依赖单文件交互式 HTML 看板生成器", content: fs.readFileSync(path.join(process.cwd(), "html_exporter.py"), "utf-8") },
      { name: "main.py", description: "主程序 CLI 入口 (命令行调度流水线)", content: fs.readFileSync(path.join(process.cwd(), "main.py"), "utf-8") },
      { name: "requirements.txt", description: "Python 依赖清单文件", content: fs.readFileSync(path.join(process.cwd(), "requirements.txt"), "utf-8") },
      { name: "README.md", description: "项目完整技术文档与使用手册", content: fs.readFileSync(path.join(process.cwd(), "README.md"), "utf-8") },
    ];
    res.json({ success: true, files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Serve or download the standalone HTML dashboard
app.get("/api/download-dashboard", (req, res) => {
  const filePath = path.join(process.cwd(), "steam_micro_indies_dashboard.html");
  if (!fs.existsSync(filePath)) {
    // Generate it first
    exec("python3 main.py", (err) => {
      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Disposition", 'attachment; filename="steam_micro_indies_dashboard.html"');
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.sendFile(filePath);
      } else {
        res.status(500).send("Dashboard generation failed");
      }
    });
  } else {
    res.setHeader("Content-Disposition", 'attachment; filename="steam_micro_indies_dashboard.html"');
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(filePath);
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Steam Micro-Indie Radar server running on http://localhost:${PORT}`);
  });
}

startServer();
