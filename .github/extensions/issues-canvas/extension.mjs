// Extension: issues-canvas
// Canvas showing GitHub issues with "Create Subsession" buttons

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";

const servers = new Map();

function fetchIssues(cwd) {
    return new Promise((resolve, reject) => {
        execFile(
            "gh",
            ["issue", "list", "--json", "number,title,labels,state,assignees,url,createdAt,author", "--limit", "50"],
            { cwd },
            (err, stdout) => {
                if (err) return reject(err);
                try { resolve(JSON.parse(stdout)); }
                catch (e) { reject(e); }
            }
        );
    });
}

function renderHtml(issues) {
    const issueRows = issues.map(issue => {
        const labels = (issue.labels || [])
            .map(l => `<span class="label" style="background:${l.color ? '#' + l.color : '#555'}">${escHtml(l.name)}</span>`)
            .join(" ");
        const assignees = (issue.assignees || []).map(a => a.login).join(", ") || "—";
        const author = issue.author?.login || "unknown";
        return `
        <tr>
          <td class="num">#${issue.number}</td>
          <td>
            <a href="${escHtml(issue.url)}" target="_blank">${escHtml(issue.title)}</a>
            <div class="meta">${labels}</div>
          </td>
          <td class="author">${escHtml(author)}</td>
          <td class="assignees">${escHtml(assignees)}</td>
          <td>
            <button class="btn" onclick="createSubsession(${issue.number}, ${escAttr(JSON.stringify(issue.title))})">
              ▶ Create Subsession
            </button>
          </td>
        </tr>`;
    }).join("\n");

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>GitHub Issues</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #0d1117; color: #e6edf3; padding: 16px;
  }
  h1 { font-size: 20px; margin-bottom: 12px; color: #f0f6fc; }
  .count { color: #7d8590; font-size: 14px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 8px 12px; border-bottom: 1px solid #30363d;
       color: #7d8590; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 10px 12px; border-bottom: 1px solid #21262d; vertical-align: middle; }
  tr:hover { background: #161b22; }
  .num { color: #7d8590; white-space: nowrap; font-variant-numeric: tabular-nums; }
  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .meta { margin-top: 4px; }
  .label {
    display: inline-block; font-size: 11px; padding: 2px 6px; border-radius: 12px;
    color: #fff; margin-right: 4px; font-weight: 500;
  }
  .author, .assignees { color: #7d8590; font-size: 13px; }
  .btn {
    background: #238636; color: #fff; border: none; padding: 6px 14px;
    border-radius: 6px; cursor: pointer; font-size: 13px; white-space: nowrap;
    transition: background 0.15s;
  }
  .btn:hover { background: #2ea043; }
  .btn:active { background: #1a7f37; }
  .btn:disabled { opacity: 0.5; cursor: wait; }
  .empty { text-align: center; padding: 40px; color: #7d8590; }
</style>
</head>
<body>
  <h1>📋 Open Issues</h1>
  <p class="count">${issues.length} issue${issues.length !== 1 ? 's' : ''}</p>
  ${issues.length === 0
    ? '<div class="empty">No open issues found.</div>'
    : `<table>
    <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Assignees</th><th></th></tr></thead>
    <tbody>${issueRows}</tbody>
  </table>`}
  <script>
    function createSubsession(number, title) {
      const btn = event.target;
      btn.disabled = true;
      btn.textContent = "⏳ Creating…";
      fetch("/action/create_subsession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, title })
      }).then(r => r.json()).then(res => {
        btn.textContent = "✅ Created";
      }).catch(() => {
        btn.textContent = "❌ Failed";
        btn.disabled = false;
      });
    }
  </script>
</body>
</html>`;
}

function escHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function escAttr(s) {
    return escHtml(s);
}

async function startServer(instanceId, cwd) {
    let issues = [];
    try { issues = await fetchIssues(cwd); } catch (e) { /* will show empty */ }

    const pendingActions = new Map();

    const server = createServer(async (req, res) => {
        if (req.method === "POST" && req.url === "/action/create_subsession") {
            let body = "";
            for await (const chunk of req) body += chunk;
            try {
                const data = JSON.parse(body);
                const id = `action-${Date.now()}`;
                const promise = new Promise((resolve) => pendingActions.set(id, resolve));
                // Store action data so the canvas action handler can pick it up
                server.__pendingAction = { id, data };
                // Trigger the agent via session.send
                if (server.__session) {
                    await server.__session.send({
                        prompt: `The user clicked "Create Subsession" for issue #${data.number} ("${data.title}") in the issues canvas. Please use the open_issue_session tool to open a session for issue #${data.number} in repo octodemo/fourth-coffee.`,
                    });
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: String(e) }));
            }
            return;
        }
        if (req.url === "/refresh") {
            try { issues = await fetchIssues(cwd); } catch (e) { /* keep old */ }
        }
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(renderHtml(issues));
    });

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    return { server, url: `http://127.0.0.1:${port}/` };
}

const session = await joinSession({
    canvases: [
        createCanvas({
            id: "issues-canvas",
            displayName: "GitHub Issues",
            description: "Shows all open GitHub issues with a button to create a subsession for each issue",
            actions: [
                {
                    name: "refresh_issues",
                    description: "Refresh the issues list in the canvas",
                    handler: async (ctx) => {
                        const entry = servers.get(ctx.instanceId);
                        if (entry) {
                            try {
                                const cwd = ctx.session?.workingDirectory || process.cwd();
                                const issues = await fetchIssues(cwd);
                                return { ok: true, count: issues.length };
                            } catch (e) {
                                return { ok: false, error: String(e) };
                            }
                        }
                        return { ok: false, error: "No server found for instance" };
                    },
                },
            ],
            open: async (ctx) => {
                let entry = servers.get(ctx.instanceId);
                const cwd = ctx.session?.workingDirectory || process.cwd();
                if (!entry) {
                    entry = await startServer(ctx.instanceId, cwd);
                    entry.server.__session = session;
                    servers.set(ctx.instanceId, entry);
                }
                return {
                    title: "GitHub Issues — octodemo/fourth-coffee",
                    url: entry.url,
                };
            },
            onClose: async (ctx) => {
                const entry = servers.get(ctx.instanceId);
                if (entry) {
                    servers.delete(ctx.instanceId);
                    await new Promise((resolve) => entry.server.close(() => resolve()));
                }
            },
        }),
    ],
});
