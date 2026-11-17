const fs = require('fs');

function addWrapper(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Make sure we haven't already wrapped it
    if (content.includes('<div class="services-grid-wrapper">')) return;

    let index = content.indexOf('<div class="services-css-grid">');
    if (index === -1) return;

    // insert before
    content = content.substring(0, index) + '<div class="services-grid-wrapper">\n' + content.substring(index);

    // find the end of services-css-grid
    // Wait, the index of <div class="services-css-grid"> changed because we inserted.
    index = content.indexOf('<div class="services-css-grid">');
    
    let depth = 0;
    let i = index;
    let endIndex = -1;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') {
            depth++;
        } else if (content.substr(i, 5) === '</div') {
            depth--;
            if (depth === 0) {
                endIndex = i + 6;
                break;
            }
        }
        i++;
    }

    if (endIndex !== -1) {
        content = content.substring(0, endIndex) + '\n</div><!-- /.services-grid-wrapper -->' + content.substring(endIndex);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added wrapper to ' + file);
    }
}

addWrapper('index.html');
addWrapper('services.html');
const fs = require('fs');
const file = 'assets/css/easilon.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(/--section-space:\s*\d+px;/g, '--section-space: 40px;');
css = css.replace(/--section-space2:\s*\d+px;/g, '--section-space2: 32px;');

function scaleDown(match, property, value, unit) {
    let num = parseInt(value);
    
    // Ignore small values
    if (num <= 24) return match;
    
    // Keep huge paddings somewhat proportional for Hero (e.g. 370px -> 150px)
    if (num > 200) {
        num = 120;
    }
    else if (num > 100) {
        num = 40; 
    }
    else if (num > 60) {
        num = 32;
    }
    else if (num > 40) {
        num = 24;
    }
    else if (num > 24) {
        num = 20;
    }
    
    return `${property}: ${num}${unit}`;
}

// ONLY replace vertical padding and margin
css = css.replace(/(padding-top|padding-bottom|margin-top|margin-bottom):\s*(\d+)(px|rem|em)/g, scaleDown);

const overrides = `
/* ==========================================================================
   GLOBAL COMPACT OVERRIDES
   ========================================================================== */
section, .section {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
    margin-top: 0 !important;
    margin-bottom: 12px !important; /* 12px gap between sections */
}

/* Let the hero keep its natural height and padding */
section.main-slider-one, 
section.main-slider-two, 
section.main-slider-three,
.main-slider-three__item {
    padding-top: 150px !important;
    padding-bottom: 40px !important;
    margin-bottom: 12px !important;
}

.sec-title {
    margin-bottom: 24px !important;
}

.sec-title__title {
    margin-bottom: 8px !important;
}

.sec-title__text {
    margin-top: 8px !important;
    margin-bottom: 16px !important;
}

.main-footer {
    padding-top: 24px !important;
}

.main-footer__top {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

.main-footer__bottom {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

/* Ensure mobile padding is super compact */
@media (max-width: 767px) {
    section, .section {
        padding-top: 24px !important;
        padding-bottom: 24px !important;
    }
}
`;

if (!css.includes('GLOBAL COMPACT OVERRIDES')) {
    css += overrides;
}

fs.writeFileSync(file, css, 'utf8');
console.log('CSS optimized for compact layout.');
const fs = require('fs');

const oldFooterSearch = `<div class="col-md-6 col-xl-2">
<div class="footer-widget footer-widget--links">
<h2 class="footer-widget__title">Services</h2>`;

const newFooterHtml = `<div class="col-md-6 col-xl-2">
<div class="footer-widget footer-widget--links">
<h2 class="footer-widget__title">Services</h2>
<ul class="list-unstyled footer-widget__links">
<li><a href="s1.html">Accounting & Bookkeeping</a></li>
<li><a href="s2.html">GST & Taxation</a></li>
<li><a href="s3.html">Payroll</a></li>
<li><a href="s4.html">Financial Statements</a></li>
<li><a href="s5.html">Reconciliation</a></li>
</ul>
</div>
</div>
<div class="col-md-6 col-xl-2">
<div class="footer-widget footer-widget--links">
<h2 class="footer-widget__title">More Services</h2>
<ul class="list-unstyled footer-widget__links">
<li><a href="s6.html">MIS Reporting</a></li>
<li><a href="s7.html">Tally Services</a></li>
<li><a href="s8.html">Audit Support</a></li>
<li><a href="s9.html">Compliance Services</a></li>
<li><a href="s10.html">Loan Services</a></li>
</ul>
</div>
</div>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it has the Services column
    let servicesIndex = content.indexOf(oldFooterSearch);
    if (servicesIndex === -1) {
        // try without newlines exactly as they might be formatted
        servicesIndex = content.indexOf('<h2 class="footer-widget__title">Services</h2>');
        if (servicesIndex === -1) return;
        // Backtrack to the col-md-6 div
        servicesIndex = content.lastIndexOf('<div class="col-md-6 col-xl-2">', servicesIndex);
    }
    
    if (servicesIndex !== -1) {
        // Find the Finance & Loans column after it
        let financeIndex = content.indexOf('<h2 class="footer-widget__title">Finance &amp; Loans</h2>', servicesIndex);
        if (financeIndex !== -1) {
            // Find the end of the Finance & Loans column
            // It ends at the next <div class="col-md-6 col-xl-3"> which is the Contact column
            let contactIndex = content.indexOf('<div class="col-md-6 col-xl-3">', financeIndex);
            
            if (contactIndex !== -1) {
                const before = content.substring(0, servicesIndex);
                const after = content.substring(contactIndex);
                fs.writeFileSync(file, before + newFooterHtml + "\n" + after, 'utf8');
                console.log('Updated footer in ' + file);
            }
        }
    }
});
const fs = require('fs');

const newFooterHtml = `                              <div class="col-md-6 col-xl-2">
                              <div class="footer-widget footer-widget--links">
                                  <h2 class="footer-widget__title">Services</h2>
                                  <ul class="list-unstyled footer-widget__links">
                                      <li><a href="s1.html">Accounting & Bookkeeping</a></li>
                                      <li><a href="s2.html">GST & Taxation</a></li>
                                      <li><a href="s3.html">Payroll</a></li>
                                      <li><a href="s4.html">Financial Statements</a></li>
                                      <li><a href="s5.html">Reconciliation</a></li>
                                  </ul>
                              </div>
                          </div>
                          <div class="col-md-6 col-xl-2">
                              <div class="footer-widget footer-widget--links">
                                  <h2 class="footer-widget__title">More Services</h2>
                                  <ul class="list-unstyled footer-widget__links">
                                      <li><a href="s6.html">MIS Reporting</a></li>
                                      <li><a href="s7.html">Tally Services</a></li>
                                      <li><a href="s8.html">Audit Support</a></li>
                                      <li><a href="s9.html">Compliance Services</a></li>
                                      <li><a href="s10.html">Loan Services</a></li>
                                  </ul>
                              </div>
                          </div>
`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it hasn't been updated yet (check for "More Services")
    if (content.includes('>More Services<')) return;

    const regex = /<div class="col-md-6 col-xl-2">\s*<div class="footer-widget footer-widget--links">\s*<h2 class="footer-widget__title">Services<\/h2>[\s\S]*?<div class="col-md-6 col-xl-3">/g;

    if (regex.test(content)) {
        content = content.replace(regex, newFooterHtml + '                          <div class="col-md-6 col-xl-3">');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Regex updated footer in ' + file);
    }
});
const fs = require('fs');
const path = require('path');

const services = [
    { num: '01', title: 'Accounting & Bookkeeping', desc: 'Professional accounting and bookkeeping support.', link: 's1.html', img: '1.jpg', icon: 'fa-calculator' },
    { num: '02', title: 'GST & Taxation', desc: 'Comprehensive GST and tax compliance services.', link: 's2.html', img: '2.jpg', icon: 'fa-receipt' },
    { num: '03', title: 'Payroll', desc: 'Efficient payroll processing and management.', link: 's3.html', img: '3.jpg', icon: 'fa-users' },
    { num: '04', title: 'Financial Statements', desc: 'Accurate preparation of financial statements.', link: 's4.html', img: '4.webp', icon: 'fa-chart-pie' },
    { num: '05', title: 'Reconciliation', desc: 'Thorough account reconciliation services.', link: 's5.html', img: '5.jpg', icon: 'fa-sync-alt' },
    { num: '06', title: 'MIS Reporting', desc: 'Detailed MIS reporting for better decisions.', link: 's6.html', img: '6.jpg', icon: 'fa-tachometer-alt' },
    { num: '07', title: 'Tally Services', desc: 'Expert Tally accounting and support services.', link: 's7.html', img: '7.webp', icon: 'fa-book' },
    { num: '08', title: 'Audit Support', desc: 'Reliable support for all your auditing needs.', link: 's8.html', img: '8.webp', icon: 'fa-search-dollar' },
    { num: '09', title: 'Compliance Services', desc: 'Ensuring strict adherence to statutory compliances.', link: 's9.html', img: '9.webp', icon: 'fa-shield-alt' },
    { num: '10', title: 'Loan Services', desc: 'Assistance with business and personal loans.', link: 's10.html', img: '10.png', icon: 'fa-rupee-sign' }
];

const css = `
/* ==========================================================================
   TRUE CSS GRID SERVICE CARDS
   ========================================================================== */

.services-css-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    width: 100%;
    margin-top: 40px;
    margin-bottom: 40px;
}

@media (max-width: 1199px) {
    .services-css-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

@media (max-width: 767px) {
    .services-css-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

.square-service-card {
    display: block;
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 6px;
    overflow: hidden;
    text-decoration: none !important;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    background-color: #1a1a3a;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

@supports not (aspect-ratio: 1 / 1) {
    .square-service-card::before {
        content: "";
        display: block;
        padding-top: 100%;
    }
}

.square-service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border-color: #C81929;
}

.ssc-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transition: transform 0.35s ease;
    opacity: 1 !important; /* Force full visibility */
}

.square-service-card:hover .ssc-bg {
    transform: scale(1.05);
}

.ssc-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Strong dark gradient overlay */
    background: linear-gradient(to bottom, rgba(15, 15, 30, 0.3) 0%, rgba(15, 15, 30, 0.95) 100%);
    z-index: 2;
    transition: background 0.35s ease;
}

.square-service-card:hover .ssc-overlay {
    background: linear-gradient(to bottom, rgba(15, 15, 30, 0.4) 0%, rgba(15, 15, 30, 0.98) 100%);
}

.ssc-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    opacity: 1 !important;
}

.ssc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.ssc-number {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    background: #C81929;
    padding: 4px 10px;
    border-radius: 4px;
    line-height: 1;
    display: inline-block;
}

.ssc-icon {
    font-size: 24px;
    color: #ffffff;
    transition: transform 0.35s ease, color 0.35s ease;
    background: rgba(0,0,0,0.3);
    padding: 8px;
    border-radius: 50%;
}

.square-service-card:hover .ssc-icon {
    transform: scale(1.1);
    color: #C81929;
    background: rgba(255,255,255,0.9);
}

.ssc-bottom {
    position: relative;
    padding-bottom: 20px;
}

.ssc-title {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff !important; /* Force readability */
    margin: 0 0 8px 0;
    line-height: 1.3;
    transition: transform 0.35s ease;
}

.ssc-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9) !important;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: transform 0.35s ease, color 0.35s ease;
}

.ssc-arrow {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 16px;
    color: #C81929;
    opacity: 0.9;
    transform: translateX(0);
    transition: transform 0.35s ease, color 0.35s ease;
}

.square-service-card:hover .ssc-arrow {
    color: #ffffff;
    transform: translateX(5px);
}

.square-service-card:hover .ssc-title {
    transform: translateY(-3px);
}

.square-service-card:hover .ssc-desc {
    color: #ffffff !important;
    transform: translateY(-3px);
}

@media (max-width: 767px) {
    .ssc-content { padding: 20px; }
    .ssc-title { font-size: 18px; }
    .ssc-desc { font-size: 13px; }
}
`;

function generateGridHtml() {
    let gridHtml = '<div class="services-css-grid">\n';
    services.forEach(s => {
        gridHtml += `    <!-- CARD ${s.num} -->
    <a href="${s.link}" class="square-service-card">
        <img src="assets/images/services/${s.img}" class="ssc-bg" alt="${s.title}">
        <div class="ssc-overlay"></div>
        <div class="ssc-content">
            <div class="ssc-top">
                <span class="ssc-number">${s.num}</span>
                <span class="ssc-icon"><i class="fas ${s.icon}"></i></span>
            </div>
            <div class="ssc-bottom">
                <h3 class="ssc-title">${s.title}</h3>
                <p class="ssc-desc">${s.desc}</p>
                <span class="ssc-arrow"><i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    </a>\n`;
    });
    gridHtml += '</div>\n';
    return gridHtml;
}

// Replace in .services-three (both index.html and services.html)
function replaceServicesThree(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    const sectionStart = content.indexOf('<section class="services-three');
    if (sectionStart === -1) return;

    const rowStart = content.indexOf('<div class="row gutter-y-30">', sectionStart);
    if (rowStart === -1) {
        // If it's already a grid from previous run
        const gridStart = content.indexOf('<div class="services-css-grid">', sectionStart);
        if (gridStart !== -1) {
            let depth = 0;
            let i = gridStart;
            while (i < content.length) {
                if (content.substr(i, 4) === '<div') depth++;
                else if (content.substr(i, 5) === '</div') {
                    depth--;
                    if (depth === 0) {
                        const before = content.substring(0, gridStart);
                        const after = content.substring(i + 6);
                        fs.writeFileSync(file, before + generateGridHtml() + after, 'utf8');
                        console.log('Updated grid in ' + file);
                        return;
                    }
                }
                i++;
            }
        }
        return;
    }

    let depth = 0;
    let i = rowStart;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') {
            depth++;
        } else if (content.substr(i, 5) === '</div') {
            depth--;
            if (depth === 0) {
                const before = content.substring(0, rowStart);
                const after = content.substring(i + 6);
                fs.writeFileSync(file, before + generateGridHtml() + after, 'utf8');
                console.log('Updated services-three grid in ' + file);
                return;
            }
        }
        i++;
    }
}

// Replace in .services-two (carousel section in index.html)
function replaceServicesTwoCarousel(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // The previous structure was <div class="container-fluid"><div class="services-two__carousel...
    // We will replace the entire container-fluid with container + css grid
    const carouselStart = content.indexOf('<div class="container-fluid"');
    if (carouselStart === -1) return;
    
    // To make sure it's the right one, check if services-two__carousel is right after it
    if (content.substring(carouselStart, carouselStart + 1000).indexOf('services-two__carousel') === -1) {
        // It might be already changed, or we can't find it.
        return;
    }

    let depth = 0;
    let i = carouselStart;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') {
            depth++;
        } else if (content.substr(i, 5) === '</div') {
            depth--;
            if (depth === 0) {
                const before = content.substring(0, carouselStart);
                const after = content.substring(i + 6);
                // Wrap in container so it aligns properly, and output the grid
                const newSection = '<div class="container">\\n' + generateGridHtml() + '</div>\\n';
                fs.writeFileSync(file, before + newSection + after, 'utf8');
                console.log('Updated services-two grid in ' + file);
                return;
            }
        }
        i++;
    }
}

replaceServicesThree('index.html');
replaceServicesThree('services.html');
replaceServicesTwoCarousel('index.html');

const cssPath = path.join('assets', 'css', 'easilon.css');
if (fs.existsSync(cssPath)) {
    fs.appendFileSync(cssPath, "\\n" + css);
    console.log('Appended final CSS to easilon.css');
}
