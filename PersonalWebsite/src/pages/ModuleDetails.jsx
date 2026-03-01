import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import { useScrollObserver } from "../hooks/useScrollObserver.js";

/**
 * ✅ Edit content per module here.
 * Each module renders its own Overview / What I did / Key takeaways / Evidence captions.
 */
const MODULES = [
  {
    id: "ethical-hacking",
    title: "Ethical Hacking & Intrusion Prevention",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Explain what this module covered at a high level. Mention the scope (tools, techniques, concepts) and the kind of work you performed (labs, write-ups, etc.).",
    whatIDid: [
      "Placeholder: Lab / exercise 1 summary.",
      "Placeholder: Lab / exercise 2 summary.",
      "Placeholder: Report / deliverable summary.",
    ],
    takeaways:
      "Placeholder text. Summarize what changed in your understanding. Mention mistakes you made and how you fixed them.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of lab setup / output / report excerpt.",
      "Placeholder caption: Second image (diagram, configuration, Wireshark capture, etc.).",
    ],
  },
  {
    id: "forensics-digital",
    title: "Forensics in Digital Security",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Explain what this module covered at a high level. Mention the scope (filesystems, artifacts, tools) and the kind of investigations you performed.",
    whatIDid: [
      "Placeholder: Lab / exercise 1 summary.",
      "Placeholder: Lab / exercise 2 summary.",
      "Placeholder: Report / deliverable summary.",
    ],
    takeaways:
      "Placeholder text. Summarize what changed in your forensic thinking, reporting, and evidence handling.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of recovered artifacts / timeline / evidence notes.",
      "Placeholder caption: Screenshot of tool output / report excerpt / analysis step.",
    ],
  },
  {
    id: "server-admin",
    title: "Server Administration & Security",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Describe server hardening concepts, service configuration, access controls, and what you practiced.",
    whatIDid: [
      "Placeholder: Configured users/permissions and hardened common services.",
      "Placeholder: Implemented logging/monitoring basics for a server environment.",
      "Placeholder: Documented changes and validated with checks/tests.",
    ],
    takeaways:
      "Placeholder text. Summarize how your understanding of secure server configuration improved.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of config/hardening checklist or terminal output.",
      "Placeholder caption: Screenshot of service configuration or security verification.",
    ],
  },
  {
    id: "enterprise-networking",
    title: "Enterprise Networking",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Describe routing/switching concepts, enterprise services (DNS/SSH/FTP), and what your labs involved.",
    whatIDid: [
      "Placeholder: Built a network topology and configured routing.",
      "Placeholder: Configured network services (DNS/SSH/FTP) and validated connectivity.",
      "Placeholder: Troubleshot issues using structured methodology.",
    ],
    takeaways:
      "Placeholder text. Summarize what you learned about network design and troubleshooting.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of Packet Tracer/GNS3 topology and configs.",
      "Placeholder caption: Screenshot of verification (ping/traceroute/service checks).",
    ],
  },
  {
    id: "secure-web",
    title: "Secure Web Applications",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Describe authentication, input validation, encryption basics, and common web risks.",
    whatIDid: [
      "Placeholder: Implemented secure input handling and validation.",
      "Placeholder: Practiced authentication/authorization concepts in a web flow.",
      "Placeholder: Tested security controls and wrote up findings.",
    ],
    takeaways:
      "Placeholder text. Summarize how your secure coding mindset improved (threats → controls).",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of secure flow / validation / auth result.",
      "Placeholder caption: Screenshot of testing results or report excerpt.",
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response & Management",
    subheading: "Placeholder: key outcomes, labs, or assessment style for this module.",
    overview:
      "Placeholder text. Describe traffic analysis, SIEM concepts, detection workflow, and response steps.",
    whatIDid: [
      "Placeholder: Analyzed traffic captures and identified suspicious behavior.",
      "Placeholder: Wrote alerts/queries or tuned detection logic.",
      "Placeholder: Created an incident report with timeline and recommendations.",
    ],
    takeaways:
      "Placeholder text. Summarize what you learned about triage, prioritization, and reporting.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of Wireshark analysis or SIEM dashboard output.",
      "Placeholder caption: Screenshot of incident timeline / report excerpt.",
    ],
  },
  {
    id: "network-security",
    title: "Network Security",
    subheading: "Module taken during Year 2 Semester 2 (October 2025 to February 2026).",
    overview:
      "This module covered a wide range of network security concepts, such as Firewalls, VPN services, Cryptography and ACLs. The tool used for this module is Cisco Packet Tracer to simulate real-world networks.",
    whatIDid: [
      `I was tasked with configuring my assigned network topology with the correct IP addresses, hardening routers and switches, and configuring the routing protocols throughout the network topology.
      Online tools such as SolarWinds Free Subnet Calculator was used to efficiently and accurately. By doing so, I limited any wastage of IP addresses and improved network performance by ensuring that address blocks were allocated according to the hosts required.
      The OSPF routing protocol was configured on layer 3 switches and routers to determine the best path to a destination in the network. Additionally, MD5 authentication was enabled to prevent rogue routers from forming adjacencies.`,
      "Placeholder: Configured firewall rules and tested allowed/blocked traffic.",
      "Placeholder: Set up a VPN scenario and verified secure connectivity.",
    ],
    takeaways:
      "Placeholder text. Summarize how your understanding of network controls and verification improved.",
    evidenceCaptions: [
      "Placeholder caption: Screenshot of firewall rules or diagram of segmentation.",
      "Placeholder caption: Screenshot of VPN connection and verification tests.",
    ],
  },
  {
    id: "it-audit",
    title: "IT Security Management & Audit",
    subheading: "Module taken during Year 2 Semester 2 (October 2025 to February 2026).",
    overview:
      "This module taught the basic fundamentals of auditing, such as the types of audits, the goal of auditing and the aspects of being a good auditor. I also learnt how to audit machines in accordance to benchmarks and bash scripting to automate tasks and assist in auditing.",
    whatIDid: [
      "At the beginning of this module, I was relatively weak at bash scripting. After practicing the fundamentals such as how to use variables, quotes and passing arguments, I became more proficient at bash scripting which was useful for one of the assignments where I had to write an automated script.",
      `My groupmates and I produced an auditing playbook for HIPAA, which is a U.S law that protects patient health information. My responsibility for the project was to conduct research into how the rise of AI affects HIPAA auditing.
       My research encompassed the emerging risks of AI, including cybersecurity threats such as spear-phishing and automated attacks.
       Additionally, I dove into how AI can be used to provide data protection through continuous monitoring, how it enhances traditional access controls and detect anomalies.
       However, the integration of AI into healthcare systems also pose privacy and bias risks. I provided steps, recommendations and advice for organisations who are considering implementing AI systems.`,
      `As part of a project, I audited a Virtual Machine in accordance to the CIS benchmark, and explained the importance for certain configurations.`
    ],
    takeaways:
      `Firstly, I learnt the importance of IT auditing, which is to independently verify data security within organisations and ensure regulatory compliance.
      I also grasped technical knowledge in bash scripting and how it can be used to enhance the efficiency and accuracy of auditing.
      I am able to conduct extensive research accurately and efficiently, as I had to write a reflection on the sources I used for my playbook research and how they were accurate.
      It is crucial to use information from reliable authoritative sources, such as reputable news outlets, government websites, large companies. And most importantly, cross-verify with multiple sources.`,
    evidenceCaptions: [
      "Placeholder caption: Screenshot of audit checklist findings (redacted).",
      "Placeholder caption: Screenshot of report summary / remediation plan.",
    ],
  },
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

export default function ModuleDetails() {
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
                <span className="section__label page-title-reveal">
                  // MODULE DETAILS LOADING...
                </span>
                <SplitTitle>Module Details</SplitTitle>

                <p className="lead lead--sm page-desc-reveal">
                  Throughout my studies, I completed modules pertaining to different areas of Cybersecurity and IT.
                  Each module involved practical labs, tests, and assignments which strengthened my technical skills
                  and knowledge. This page outlines the work I completed and the competencies I developed.
                </p>

                <div className="actions" style={{ marginTop: "18px" }}>
                  <Link className="btn btn--secondary" to="/#about">
                    ← Back to Home
                  </Link>
                  <Link className="btn" to="/projects">
                    View Personal Projects
                  </Link>
                </div>
              </div>
            </div>

            {/* Article */}
            <div className="article-layout">
              <article className="article">
                {MODULES.map((m) => (
                  <section key={m.id} id={m.id} className="article-section">
                    <header className="article-section__head">
                      <h2 className="article-h2">{m.title}</h2>
                      <div className="article-section__sub">{m.subheading}</div>
                    </header>

                    <div className="article-grid">
                      <div className="article-block">
                        <h3 className="article-h3">Overview</h3>
                        <p>{m.overview}</p>

                        <h3 className="article-h3">What I did</h3>
                        <ul className="article-bullets">
                          {m.whatIDid.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>

                        <h3 className="article-h3">Key takeaways</h3>
                        <p>{m.takeaways}</p>
                      </div>

                      <div className="article-block">
                        <h3 className="article-h3">Evidence / screenshots</h3>

                        {/* Replace with real <img src={...} /> later */}
                        <div className="figure">
                          <div className="figure__img" aria-hidden="true"></div>
                          <div className="figure__cap">{m.evidenceCaptions?.[0] ?? "Placeholder caption."}</div>
                        </div>

                        <div className="figure">
                          <div className="figure__img" aria-hidden="true"></div>
                          <div className="figure__cap">{m.evidenceCaptions?.[1] ?? "Placeholder caption."}</div>
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