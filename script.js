document.addEventListener("DOMContentLoaded", () => {
    // === APARTADO 1: ANIMACIÓN DE CÓDIGO DE FONDO (CANVAS) ===
    const canvas = document.getElementById("code-bg");
    const ctx = canvas.getContext("2d");

    let fontSize = 14;
    let columns = 0;
    let drops = [];

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
        const heroSection = canvas.parentElement;
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;

        columns = Math.floor(canvas.width / 140); 
        drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -60; 
        }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function draw() {
        const isLightMode = document.documentElement.classList.contains("light-mode");
        
        ctx.fillStyle = isLightMode ? "rgba(248, 250, 252, 0.08)" : "rgba(5, 5, 5, 0.06)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `600 ${fontSize}px 'Courier New', Courier, monospace`;
        ctx.fillStyle = isLightMode ? "rgba(37, 99, 235, 0.18)" : "rgba(0, 255, 102, 0.75)"; 

        for (let i = 0; i < columns; i++) {
            const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            const x = i * 150; 
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.4; 
        }
    }

    setInterval(draw, 35);


    // === APARTADO 2: CONMUTADOR DE MODO CLARO / OSCURO ===
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
        
        if (document.documentElement.classList.contains("light-mode")) {
            localStorage.setItem("portfolio-theme", "light");
            themeToggleBtn.textContent = "☀️";
        } else {
            localStorage.setItem("portfolio-theme", "dark");
            themeToggleBtn.textContent = "🌙";
        }
    });


    // === APARTADO 3: MENÚ HAMBURGUESA DINÁMICO RESPONSIVO ===
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const navMenu = document.getElementById("nav-menu");

    // Abrir y cerrar menú al dar clic en ☰
    menuToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("mobile-open");
        menuToggleBtn.textContent = navMenu.classList.contains("mobile-open") ? "✕" : "☰";
    });

    // Cerrar el menú automáticamente al dar clic en cualquier enlace interno
    const navLinksList = navMenu.querySelectorAll("a");
    navLinksList.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("mobile-open");
            menuToggleBtn.textContent = "☰";
        });
    });

    // Cerrar el menú al dar clic fuera del navbar por usabilidad móvil
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && e.target !== menuToggleBtn) {
            navMenu.classList.remove("mobile-open");
            menuToggleBtn.textContent = "☰";
        }
    });
});