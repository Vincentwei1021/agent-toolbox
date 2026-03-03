import { Hono } from "hono";

const playgroundRouter = new Hono();

const DEMO_KEY = "atb_playground_585ac168685ec4c3";

const playgroundHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Playground — Agent Toolbox</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#09090b;color:#e0e0e0;font-family:system-ui,-apple-system,sans-serif;min-height:100vh}
a{color:#818cf8;text-decoration:none}
a:hover{text-decoration:underline}

.nav{background:#0f0f13;border-bottom:1px solid #1e1e2e;padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
.nav-brand{font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.nav-links{display:flex;gap:20px;font-size:14px}

.container{max-width:1200px;margin:0 auto;padding:32px 24px}
h1{font-size:28px;font-weight:700;margin-bottom:8px}
.subtitle{color:#a1a1aa;font-size:15px;margin-bottom:32px}

.layout{display:grid;grid-template-columns:320px 1fr;gap:24px;min-height:calc(100vh - 180px)}

/* Sidebar */
.sidebar{display:flex;flex-direction:column;gap:6px}
.endpoint-btn{background:#16162a;border:1px solid #1e1e2e;border-radius:10px;padding:14px 16px;cursor:pointer;text-align:left;transition:all .15s}
.endpoint-btn:hover{border-color:#3730a3}
.endpoint-btn.active{border-color:#6366f1;background:#1a1a3a}
.endpoint-btn .method{font-size:11px;font-weight:700;color:#10b981;font-family:monospace;letter-spacing:0.5px}
.endpoint-btn .path{font-size:14px;font-weight:600;color:#fff;margin-top:3px}
.endpoint-btn .desc{font-size:12px;color:#71717a;margin-top:4px}

/* Main panel */
.panel{display:flex;flex-direction:column;gap:16px}
.panel-section{background:#16162a;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden}
.panel-header{padding:14px 18px;border-bottom:1px solid #1e1e2e;font-size:13px;font-weight:600;color:#a1a1aa;display:flex;align-items:center;justify-content:space-between}

/* Params */
.params{padding:16px 18px;display:flex;flex-direction:column;gap:12px}
.param-row{display:flex;align-items:center;gap:12px}
.param-label{width:120px;font-size:13px;color:#a1a1aa;font-family:monospace}
.param-input{flex:1;background:#0f0f1a;border:1px solid #2a2a4a;border-radius:8px;padding:10px 12px;color:#e0e0e0;font-size:13px;font-family:monospace;outline:none;transition:border .15s}
.param-input:focus{border-color:#6366f1}
.param-input::placeholder{color:#4a4a6a}
.param-hint{font-size:11px;color:#52525b;margin-left:132px;margin-top:-6px}

/* Send button */
.send-row{display:flex;align-items:center;gap:12px;padding:0 18px 16px}
.send-btn{background:#6366f1;color:#fff;border:none;border-radius:8px;padding:10px 28px;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s;display:flex;align-items:center;gap:8px}
.send-btn:hover{background:#4f46e5}
.send-btn:disabled{opacity:0.5;cursor:not-allowed}
.send-btn .spinner{display:none;width:14px;height:14px;border:2px solid #fff4;border-top:2px solid #fff;border-radius:50%;animation:spin .6s linear infinite}
.send-btn.loading .spinner{display:block}
.send-btn.loading .label{display:none}
@keyframes spin{to{transform:rotate(360deg)}}

/* Response */
.response-meta{padding:12px 18px;display:flex;gap:16px;align-items:center;font-size:13px;font-family:monospace;border-bottom:1px solid #1e1e2e}
.status{padding:3px 10px;border-radius:6px;font-weight:700;font-size:12px}
.status.s2xx{background:#10b98120;color:#10b981}
.status.s4xx{background:#f8514920;color:#f85149}
.status.s5xx{background:#f59e0b20;color:#f59e0b}
.latency{color:#71717a}
.response-body{padding:16px 18px;overflow-x:auto;max-height:500px;overflow-y:auto}
.response-body pre{font-family:monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-all}

/* JSON highlight */
.json-key{color:#818cf8}
.json-string{color:#10b981}
.json-number{color:#f59e0b}
.json-bool{color:#f472b6}
.json-null{color:#71717a}

/* Key bar */
.key-bar{background:#16162a;border:1px solid #1e1e2e;border-radius:10px;padding:12px 18px;display:flex;align-items:center;gap:12px;font-size:13px;margin-bottom:8px}
.key-bar label{color:#71717a;white-space:nowrap}
.key-bar input{flex:1;background:#0f0f1a;border:1px solid #2a2a4a;border-radius:6px;padding:8px 10px;color:#818cf8;font-family:monospace;font-size:13px;outline:none}
.key-bar .badge{background:#6366f120;color:#6366f1;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap}

.empty-state{color:#52525b;font-size:14px;padding:40px;text-align:center}

@media(max-width:768px){
  .layout{grid-template-columns:1fr}
  .sidebar{flex-direction:row;overflow-x:auto;gap:8px;padding-bottom:8px}
  .endpoint-btn{min-width:160px;flex-shrink:0}
}
</style>
</head>
<body>

<nav class="nav">
  <a href="/" class="nav-brand">&#129520; Agent Toolbox</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/v1/docs">API Docs</a>
    <a href="/playground" style="color:#6366f1;font-weight:600">Playground</a>
  </div>
</nav>

<div class="container">
  <h1>API Playground</h1>
  <p class="subtitle">Try every endpoint live — no signup required. Responses are real.</p>

  <div class="key-bar">
    <label>API Key:</label>
    <input type="text" id="apiKey" value="${DEMO_KEY}" />
    <span class="badge">Demo Key · 10 req/min</span>
  </div>

  <div class="layout">
    <div class="sidebar" id="sidebar"></div>
    <div class="panel" id="panel">
      <div class="panel-section"><div class="empty-state">&#8592; Select an endpoint to get started</div></div>
    </div>
  </div>
</div>

<script>
const ENDPOINTS = [
  {
    method: "POST", path: "/v1/search", name: "Web Search",
    desc: "Search the web via DuckDuckGo",
    params: [
      {key:"query",type:"text",placeholder:"AI agent frameworks",required:true},
      {key:"count",type:"number",placeholder:"5",default:"5"},
    ]
  },
  {
    method: "POST", path: "/v1/extract", name: "Content Extract",
    desc: "Extract readable content from a URL",
    params: [
      {key:"url",type:"text",placeholder:"https://example.com",required:true},
      {key:"format",type:"select",options:["markdown","text","json"],default:"markdown"},
    ]
  },
  {
    method: "POST", path: "/v1/screenshot", name: "Screenshot",
    desc: "Capture a web page screenshot",
    params: [
      {key:"url",type:"text",placeholder:"https://example.com",required:true},
      {key:"width",type:"number",placeholder:"1280",default:"1280"},
      {key:"height",type:"number",placeholder:"720",default:"720"},
    ]
  },
  {
    method: "POST", path: "/v1/weather", name: "Weather",
    desc: "Current weather & forecast",
    params: [
      {key:"location",type:"text",placeholder:"Tokyo",required:true},
    ]
  },
  {
    method: "POST", path: "/v1/finance", name: "Finance",
    desc: "Stock quotes & exchange rates",
    params: [
      {key:"symbol",type:"text",placeholder:"AAPL"},
      {key:"type",type:"select",options:["quote","exchange"],default:"quote"},
      {key:"from",type:"text",placeholder:"USD (for exchange)"},
      {key:"to",type:"text",placeholder:"EUR (for exchange)"},
      {key:"amount",type:"number",placeholder:"100"},
    ]
  },
  {
    method: "POST", path: "/v1/validate-email", name: "Email Validation",
    desc: "Validate email (MX + SMTP + disposable)",
    params: [
      {key:"email",type:"text",placeholder:"test@gmail.com",required:true},
    ]
  },
  {
    method: "POST", path: "/v1/translate", name: "Translate",
    desc: "Translate text with auto-detect",
    params: [
      {key:"text",type:"text",placeholder:"Hello, how are you?",required:true},
      {key:"target",type:"text",placeholder:"zh",required:true,hint:"ISO 639-1 code: zh, ja, es, fr, de..."},
      {key:"source",type:"text",placeholder:"auto",default:"auto"},
    ]
  },
];

let activeIdx = -1;

function renderSidebar(){
  const sb = document.getElementById("sidebar");
  sb.innerHTML = ENDPOINTS.map((ep,i) =>
    '<div class="endpoint-btn'+(i===activeIdx?' active':'')+'" onclick="selectEndpoint('+i+')">'+
      '<div class="method">'+ep.method+'</div>'+
      '<div class="path">'+ep.path+'</div>'+
      '<div class="desc">'+ep.desc+'</div>'+
    '</div>'
  ).join("");
}

function selectEndpoint(i){
  activeIdx = i;
  renderSidebar();
  renderPanel();
}

function renderPanel(){
  if(activeIdx<0) return;
  const ep = ENDPOINTS[activeIdx];
  const panel = document.getElementById("panel");

  let paramsHTML = ep.params.map(p => {
    let input;
    if(p.type==="select"){
      input = '<select class="param-input" data-key="'+p.key+'">'+
        p.options.map(o=>'<option value="'+o+'"'+(o===p.default?' selected':'')+'>'+o+'</option>').join("")+
        '</select>';
    } else {
      input = '<input class="param-input" type="'+(p.type||"text")+'" data-key="'+p.key+'" placeholder="'+p.placeholder+'" value="'+(p.default||"")+'" />';
    }
    return '<div class="param-row"><span class="param-label">'+p.key+(p.required?' *':'')+'</span>'+input+'</div>'+
      (p.hint?'<div class="param-hint">'+p.hint+'</div>':'');
  }).join("");

  panel.innerHTML =
    '<div class="panel-section">'+
      '<div class="panel-header"><span>'+ep.method+' '+ep.path+'</span><span style="color:#6366f1">'+ep.name+'</span></div>'+
      '<div class="params">'+paramsHTML+'</div>'+
      '<div class="send-row"><button class="send-btn" onclick="sendRequest()"><span class="spinner"></span><span class="label">Send Request</span></button></div>'+
    '</div>'+
    '<div class="panel-section" id="response-panel" style="display:none">'+
      '<div class="panel-header">Response</div>'+
      '<div class="response-meta" id="response-meta"></div>'+
      '<div class="response-body" id="response-body"></div>'+
    '</div>';
}

function highlightJSON(json){
  if(typeof json !== "string") json = JSON.stringify(json, null, 2);
  return json
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"([^"]+)"\\s*:/g,'<span class="json-key">"$1"</span>:')
    .replace(/:\\s*"([^"]*?)"/g,': <span class="json-string">"$1"</span>')
    .replace(/:\\s*(-?\\d+\\.?\\d*)/g,': <span class="json-number">$1</span>')
    .replace(/:\\s*(true|false)/g,': <span class="json-bool">$1</span>')
    .replace(/:\\s*(null)/g,': <span class="json-null">$1</span>');
}

async function sendRequest(){
  if(activeIdx<0) return;
  const ep = ENDPOINTS[activeIdx];
  const btn = document.querySelector(".send-btn");
  btn.classList.add("loading");
  btn.disabled = true;

  const body = {};
  document.querySelectorAll(".param-input").forEach(el => {
    const key = el.dataset.key;
    let val = el.value.trim();
    if(!val) return;
    const p = ep.params.find(p=>p.key===key);
    if(p && p.type==="number") val = parseFloat(val);
    body[key] = val;
  });

  const apiKey = document.getElementById("apiKey").value.trim();
  const start = performance.now();

  try{
    const resp = await fetch(ep.path, {
      method: ep.method,
      headers: {"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
      body: JSON.stringify(body),
    });
    const latency = Math.round(performance.now() - start);
    const data = await resp.json();

    const rp = document.getElementById("response-panel");
    rp.style.display = "block";

    const statusClass = resp.status < 300 ? "s2xx" : resp.status < 500 ? "s4xx" : "s5xx";
    document.getElementById("response-meta").innerHTML =
      '<span class="status '+statusClass+'">'+resp.status+' '+resp.statusText+'</span>'+
      '<span class="latency">'+latency+'ms</span>';

    document.getElementById("response-body").innerHTML =
      '<pre>'+highlightJSON(JSON.stringify(data, null, 2))+'</pre>';
  } catch(e){
    const rp = document.getElementById("response-panel");
    rp.style.display = "block";
    document.getElementById("response-meta").innerHTML = '<span class="status s5xx">Error</span>';
    document.getElementById("response-body").innerHTML = '<pre style="color:#f85149">'+e.message+'</pre>';
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

renderSidebar();
</script>
</body>
</html>`;

playgroundRouter.get("/playground", (c) => {
  return c.html(playgroundHTML);
});

export { playgroundRouter };
