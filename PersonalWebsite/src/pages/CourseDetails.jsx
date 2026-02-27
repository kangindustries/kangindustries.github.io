import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import { useScrollObserver } from "../hooks/useScrollObserver.js";

const MODULES = [
    { id: "ethical-hacking", title: "Ethical Hacking & Intrusion Prevention" },
    { id: "forensics-digital", title: "Forensics in Digital Security" },
    { id: "server-admin", title: "Server Administration & Security" },
    { id: "enterprise-networking", title: "Enterprise Networking" },
    { id: "secure-web", title: "Secure Web Applications" },
    { id: "incident-response", title: "Incident Response & Management" },
    { id: "network-security", title: "Network Security" },
    { id: "it-audit", title: "IT Security Management & Audit" },
];

function SplitTitle({ children }) {
    const titleRef = useRef(null);

    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                [...node.textContent].forEach((ch) => {
                    const span = document.createElement("span");
                    span.className = "char";
                    span.textContent = ch === " " ? "\u00a0" : ch;
                    frag.appendChild(span);
                });
                return frag;
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                node.childNodes.forEach((child) => clone.appendChild(processNode(child)));
                return clone;
            }
            return node.cloneNode(true);
        }

        const frag = document.createDocumentFragment();
        title.childNodes.forEach((child) => frag.appendChild(processNode(child)));
        title.innerHTML = "";
        title.appendChild(frag);

        const isWS = (v) => !v || v.replace(/\u00a0/g, " ").trim() === "";
        let chars = title.querySelectorAll(".char");
        while (chars[0] && isWS(chars[0].textContent)) {
            chars[0].remove();
            chars = title.querySelectorAll(".char");
        }
        chars = title.querySelectorAll(".char");
        while (chars[chars.length - 1] && isWS(chars[chars.length - 1].textContent)) {
            chars[chars.length - 1].remove();
            chars = title.querySelectorAll(".char");
        }

        title.querySelectorAll(".char").forEach((s, i) => {
            s.style.animationDelay = `${0.05 + i * 0.045}s`;
        });
    }, []);

    return (
        <h1 className="title title--sm" ref={titleRef}>
            {children}
        </h1>
    );
}

export default function CourseDetails() {
    useScrollObserver();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <ScrollProgress />
            <Navbar />

            <main id="main" className="page-enter">
                <section className="section">
                    <div className="container">
                        {/* Header */}
                        <div className="section__head">
                            <div>
                                <span className="section__label page-title-reveal">// COURSE DETAILS LOADING...</span>
                                <SplitTitle>Course Details</SplitTitle>

                                <p className="lead lead--sm page-desc-reveal">
                                    Throughout my studies, I completed modules across key areas of cybersecurity and IT. Each module involved
                                    practical labs, assignments, and projects that strengthened my technical skills. This page documents the work
                                    I carried out and the competencies I developed.
                                </p>

                                <div className="actions" style={{ marginTop: "18px" }}>
                                    <Link className="btn btn--secondary" to="/#about">← Back to About</Link>
                                    <Link className="btn" to="/projects">View Projects</Link>
                                </div>
                            </div>
                        </div>

                        {/* Layout: TOC + article */}
                        <div className="article-layout">
                            <article className="article">
                                {MODULES.map((m) => (
                                    <section key={m.id} id={m.id} className="article-section">
                                        <header className="article-section__head">
                                            <h2 className="article-h2">{m.title}</h2>
                                            <div className="article-section__sub">
                                                Placeholder subheading: key outcomes, labs, or assessment style for this module.
                                            </div>
                                        </header>

                                        <div className="article-grid">
                                            <div className="article-block">
                                                <h3 className="article-h3">Overview</h3>
                                                <p>
                                                    Placeholder text. Explain what this module covered at a high level. Mention the scope
                                                    (tools, techniques, concepts), and what kinds of tasks you performed (labs, write-ups,
                                                    investigations, configurations, etc.).
                                                </p>

                                                <h3 className="article-h3">What I did</h3>
                                                <ul className="article-bullets">
                                                    <li>Placeholder: Lab / exercise 1 summary.</li>
                                                    <li>Placeholder: Lab / exercise 2 summary.</li>
                                                    <li>Placeholder: Report / deliverable summary.</li>
                                                </ul>

                                                <h3 className="article-h3">Key takeaways</h3>
                                                <p>
                                                    Placeholder text. Summarize what changed in your understanding. If relevant, include
                                                    mistakes you made and how you fixed them — it’s a strong signal of learning.
                                                </p>
                                            </div>

                                            <div className="article-block">
                                                <h3 className="article-h3">Evidence / screenshots</h3>

                                                {/* Replace these with real <img src={...} /> later */}
                                                <div className="figure">
                                                    <div className="figure__img" aria-hidden="true"></div>
                                                    <div className="figure__cap">
                                                        Placeholder caption: “Screenshot of lab setup / output / report excerpt.”
                                                    </div>
                                                </div>

                                                <div className="figure">
                                                    <div className="figure__img" aria-hidden="true"></div>
                                                    <div className="figure__cap">
                                                        Placeholder caption: “Second image (diagram, configuration, Wireshark capture, etc.).”
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="article-divider"></div>
                                    </section>
                                ))}
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}