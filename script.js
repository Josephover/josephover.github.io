document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================================
       BOOT SCREEN
       ====================================================================== */
    const bootScreen = document.getElementById("boot-screen");
    const bootLog = document.getElementById("boot-log");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bootLines = [
        "[  OK  ] jas-os kernel 6.6.0 booting...",
        "[  OK  ] montando /home/guest ...",
        "[  OK  ] iniciando gestor de ventanas ...",
        "[  OK  ] cargando about.md, experience.log, skills.conf ...",
        "[  OK  ] cargando projects/ ...",
        "[  OK  ] terminal lista en /dev/tty1",
        "bienvenido — jas-os v2026.1"
    ];

    function hideBoot() {
        bootScreen.classList.add("hidden");
        setTimeout(() => bootScreen.remove(), 550);
    }

    if (reducedMotion) {
        hideBoot();
    } else {
        bootLines.forEach((line, i) => {
            const span = document.createElement("span");
            span.textContent = line;
            span.style.animationDelay = `${i * 0.16}s`;
            bootLog.appendChild(span);
        });
        const bootTimer = setTimeout(hideBoot, bootLines.length * 160 + 500);
        bootScreen.addEventListener("click", () => {
            clearTimeout(bootTimer);
            hideBoot();
        });
    }

    /* ======================================================================
       CLOCK
       ====================================================================== */
    const clockEl = document.getElementById("tb-clock");
    function tickClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        clockEl.textContent = `${h}:${m}`;
    }
    tickClock();
    setInterval(tickClock, 15000);

    /* ======================================================================
       THEME TOGGLE
       ====================================================================== */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.documentElement.classList.add("light-mode");
        themeToggleBtn.textContent = "☀️";
    } else {
        themeToggleBtn.textContent = "🌙";
    }

    themeToggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("light-mode");
        const isLight = document.documentElement.classList.contains("light-mode");
        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
    });

    /* ======================================================================
       CODE-RAIN WALLPAPER
       ====================================================================== */
    const canvas = document.getElementById("code-bg");
    const ctx = canvas.getContext("2d");
    let columns = 0;
    let drops = [];
    const fontSize = 13;

    const codeSnippets = [
        "const express = require('express');",
        "app.use(jwt.verifyToken);",
        "import React, { useState } from 'react';",
        "router.get('/api/v1/projects', getProjects);",
        "const db = await mongoose.connect(URI);",
        "return res.status(200).json({ success: true });",
        "@RestController('/api/mantenimiento')",
        "public class ParadaController { }",
        "SELECT * FROM Users WHERE role = 'admin';",
        "const token = jwt.sign({ id }, process.env.SECRET);",
        "export const Button = ({ children }) => {",
        "useEffect(() => { fetchData(); }, []);",
        "docker run -d -p 3306:3306 mysql",
        "const [user, setUser] = useState(null);"
    ];

    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        columns = Math.max(1, Math.floor(canvas.width / 150));
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -60;
        }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function draw() {
        const isLight = document.documentElement.classList.contains("light-mode");
        ctx.fillStyle = isLight ? "rgba(238, 241, 247, 0.10)" : "rgba(11, 13, 20, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isLight ? "rgba(47, 95, 216, 0.14)" : "rgba(138, 180, 255, 0.28)";

        for (let i = 0; i < columns; i++) {
            const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            const x = i * 150;
            const y = drops[i] * fontSize;
            ctx.fillText(text, x, y);
            if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.35;
        }
    }
    if (!reducedMotion) setInterval(draw, 45);

    /* ======================================================================
       WINDOW MANAGER
       ====================================================================== */
    const windowIds = ["about", "experience", "skills", "projects", "contact", "terminal"];
    const windows = {};
    let zCounter = 10;

    windowIds.forEach(id => {
        const el = document.getElementById(`win-${id}`);
        windows[id] = {
            el,
            open: false,
            minimized: false,
            maximized: false,
            prevRect: null
        };
    });

    const isMobile = () => window.matchMedia("(max-width: 860px)").matches;

    function refreshChrome() {
        document.querySelectorAll(".dock-item[data-open]").forEach(btn => {
            const id = btn.dataset.open;
            const w = windows[id];
            btn.classList.toggle("open", !!(w && w.open));
        });
        document.querySelectorAll(".ws-btn[data-open]").forEach(btn => {
            const id = btn.dataset.open;
            const w = windows[id];
            btn.classList.toggle("active", !!(w && w.open && !w.minimized));
        });
    }

    function focusWindow(id) {
        const w = windows[id];
        if (!w) return;
        zCounter += 1;
        w.el.style.zIndex = zCounter;
        Object.values(windows).forEach(o => o.el.classList.remove("focused"));
        w.el.classList.add("focused");
    }

    function openWindow(id) {
        const w = windows[id];
        if (!w) return;
        w.el.classList.add("open");
        w.open = true;
        w.minimized = false;
        focusWindow(id);
        refreshChrome();
        if (id === "terminal") {
            const input = document.getElementById("term-input");
            setTimeout(() => input && input.focus(), 60);
        }
    }

    function closeWindow(id) {
        const w = windows[id];
        if (!w) return;
        w.el.classList.remove("open");
        w.open = false;
        w.minimized = false;
        refreshChrome();
    }

    function minimizeWindow(id) {
        const w = windows[id];
        if (!w) return;
        w.el.classList.remove("open");
        w.minimized = true;
        refreshChrome();
    }

    function toggleMaximize(id) {
        const w = windows[id];
        if (!w) return;
        w.maximized = !w.maximized;
        w.el.classList.toggle("maximized", w.maximized);
        focusWindow(id);
    }

    function handleLauncher(id) {
        const w = windows[id];
        if (!w) return;
        if (w.open && w.el.classList.contains("focused")) {
            minimizeWindow(id);
        } else {
            openWindow(id);
        }
    }

    document.querySelectorAll("[data-open]").forEach(btn => {
        btn.addEventListener("click", () => {
            handleLauncher(btn.dataset.open);
            closeStartMenu();
        });
    });

    document.querySelectorAll(".window").forEach(winEl => {
        winEl.addEventListener("mousedown", () => focusWindow(winEl.dataset.win));
        winEl.addEventListener("touchstart", () => focusWindow(winEl.dataset.win), { passive: true });

        const dots = winEl.querySelectorAll(".win-dots i");
        dots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = winEl.dataset.win;
                const act = dot.dataset.act;
                if (act === "close") closeWindow(id);
                else if (act === "min") minimizeWindow(id);
                else if (act === "max") toggleMaximize(id);
            });
        });
    });

    /* ---- dragging ---- */
    document.querySelectorAll(".win-titlebar").forEach(titlebar => {
        let dragging = false;
        let offsetX = 0, offsetY = 0;
        const winEl = titlebar.closest(".window");
        const id = winEl.dataset.win;

        titlebar.addEventListener("pointerdown", (e) => {
            if (isMobile() || e.target.closest(".win-dots") || winEl.classList.contains("maximized")) return;
            dragging = true;
            const rect = winEl.getBoundingClientRect();
            const parentRect = winEl.parentElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            winEl.style.left = `${rect.left - parentRect.left}px`;
            winEl.style.top = `${rect.top - parentRect.top}px`;
            focusWindow(id);
            titlebar.setPointerCapture(e.pointerId);
        });

        titlebar.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            const parentRect = winEl.parentElement.getBoundingClientRect();
            let newLeft = e.clientX - parentRect.left - offsetX;
            let newTop = e.clientY - parentRect.top - offsetY;
            newLeft = Math.max(-40, Math.min(newLeft, parentRect.width - 60));
            newTop = Math.max(0, Math.min(newTop, parentRect.height - 40));
            winEl.style.left = `${newLeft}px`;
            winEl.style.top = `${newTop}px`;
        });

        function stopDrag(e) {
            if (dragging) {
                dragging = false;
                try { titlebar.releasePointerCapture(e.pointerId); } catch (err) {}
            }
        }
        titlebar.addEventListener("pointerup", stopDrag);
        titlebar.addEventListener("pointercancel", stopDrag);
    });

    /* ======================================================================
       START MENU
       ====================================================================== */
    const startBtn = document.getElementById("start-btn");
    const startMenu = document.getElementById("start-menu");

    function closeStartMenu() {
        startMenu.hidden = true;
        startBtn.setAttribute("aria-expanded", "false");
    }

    startBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = startMenu.hidden;
        startMenu.hidden = !willOpen;
        startBtn.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (e) => {
        if (!startMenu.hidden && !startMenu.contains(e.target) && e.target !== startBtn) {
            closeStartMenu();
        }
    });

    /* ======================================================================
       TERMINAL
       ====================================================================== */
    const termOutput = document.getElementById("term-output");
    const termInput = document.getElementById("term-input");

    function printLine(text, cls) {
        const div = document.createElement("div");
        if (cls) div.className = cls;
        div.textContent = text;
        termOutput.appendChild(div);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    function printEcho(cmdText) {
        const div = document.createElement("div");
        div.className = "term-line-cmd";
        div.textContent = cmdText;
        termOutput.appendChild(div);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    const helpText = [
        "comandos disponibles:",
        "  help                 muestra esta ayuda",
        "  whoami               quién soy",
        "  ls                   lista los archivos del portafolio",
        "  cat <archivo>        abre about.md / experience.log / skills.conf / contact.sh",
        "  open <sección>       abre about | experience | skills | projects | contact",
        "  neofetch             info del sistema",
        "  github               abre mi GitHub",
        "  clear                limpia la terminal"
    ];

    const sectionAliases = {
        "about": "about", "about.md": "about",
        "experience": "experience", "experience.log": "experience",
        "skills": "skills", "skills.conf": "skills",
        "projects": "projects", "projects/": "projects",
        "contact": "contact", "contact.sh": "contact",
        "terminal": "terminal"
    };

    function runCommand(raw) {
        const trimmed = raw.trim();
        printEcho(trimmed || " ");
        if (!trimmed) return;

        const tokens = trimmed.split(/\s+/);
        const cmd = tokens[0].toLowerCase();
        const arg = tokens.slice(1).join(" ").toLowerCase();

        switch (cmd) {
            case "help":
                helpText.forEach(l => printLine(l));
                break;
            case "whoami":
                printLine("Joseph André Sánchez — Full Stack Developer", "term-line-accent");
                printLine("Backend & Frontend Specialist. APIs RESTful, JWT, bases de datos.");
                break;
            case "ls":
                printLine("about.md   experience.log   skills.conf   projects/   contact.sh");
                break;
            case "cat": {
                const target = sectionAliases[arg];
                if (target) { printLine(`abriendo ${arg}...`); openWindow(target); }
                else printLine(`cat: ${arg || "?"}: archivo no encontrado`, "term-line-err");
                break;
            }
            case "cd":
            case "open": {
                const target = sectionAliases[arg];
                if (target) { printLine(`abriendo ${target}...`); openWindow(target); }
                else printLine(`open: sección desconocida "${arg}". prueba: about, experience, skills, projects, contact`, "term-line-err");
                break;
            }
            case "neofetch":
                printLine("jas-os v2026.1", "term-line-accent");
                printLine("--------------------------------");
                printLine("OS:        JAS-OS (basado en experiencia real)");
                printLine("Kernel:    Node.js + Express");
                printLine("Shell:     React.js");
                printLine("DB:        PostgreSQL / MongoDB / MySQL");
                printLine("Uptime:    9+ meses como dev autónomo");
                printLine("Packages:  JWT, RBAC, Docker, Socket.IO");
                break;
            case "github":
                printLine("abriendo https://github.com/Josephover ...");
                window.open("https://github.com/Josephover", "_blank", "noopener");
                break;
            case "sudo":
                printLine("Permission denied: aquí el único root eres tú 😉 — revisa 'open projects'", "term-line-err");
                break;
            case "clear":
                termOutput.innerHTML = "";
                break;
            default:
                printLine(`comando no encontrado: ${cmd} — escribe 'help' para ver comandos disponibles`, "term-line-err");
        }
    }

    printLine("jas-os terminal v2026.1 — escribe 'help' para empezar.", "term-line-accent");

    termInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = termInput.value;
            termInput.value = "";
            runCommand(val);
        }
    });

    /* Open About by default once boot finishes */
    setTimeout(() => openWindow("about"), reducedMotion ? 50 : 1400);
});
