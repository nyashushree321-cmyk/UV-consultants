import re

with open('s10.html', 'r', encoding='utf-8') as f:
    s10_content = f.read()

loans = [
    ("Unsecured Business Loan", "fa-briefcase", "assets/images/service/unsecured_loan.jpg", "Hassle-free unsecured business loans for immediate working capital needs without the need for collateral."),
    ("Housing Loan", "fa-home", "assets/images/service/housing_loan.jpg", "Get closer to your dream home with high loan-to-value ratios and competitive interest rates."),
    ("Loan Against Property", "fa-building", "assets/images/service/property_loan.jpg", "Leverage your residential or commercial property equity to secure funds for personal or business needs."),
    ("Personal Loan", "fa-user", "assets/images/service/personal_loan.jpg", "Instant access to funds for medical emergencies, weddings, or vacations with no collateral required."),
    ("Over Draft & Cash Credit", "fa-money-bill-wave", "assets/images/service/overdraft_loan.jpg", "Ensure your daily business operations never hit a roadblock with flexible borrowing limits."),
    ("Car Loan & Refinance", "fa-car", "assets/images/service/car_loan.jpg", "Hit the road with easy financing and refinancing solutions, quick approvals, and attractive rates."),
    ("Insurance", "fa-shield-alt", "assets/images/service/insurance.jpg", "Protect yourself, your family, and your business with comprehensive life and property coverage."),
    ("Machinery Loan", "fa-cogs", "assets/images/service/machinery_loan.jpg", "Upgrade your manufacturing capabilities with specialized financing for new and second-hand equipment."),
    ("SME Working Capital", "fa-chart-line", "assets/images/service/sme_loan.jpg", "Keep your small or medium enterprise running smoothly by managing inventory and operational expenses."),
    ("Educational Loan", "fa-user-graduate", "assets/images/service/education_loan.jpg", "Don't let financial constraints hinder your aspirations. Covers tuition fees, accommodation, and more.")
]

cards_css = """
<style>
.loan-cards-grid-v3 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-top: 30px;
    margin-bottom: 60px;
}
.modern-loan-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    background: #ffffff;
    display: flex;
    flex-direction: column;
    height: 300px;
    border: 1px solid #f0f0f0;
}
.modern-loan-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.12);
    border-color: #C81929;
}
.modern-loan-card__img-wrapper {
    width: 100%;
    height: 140px;
    overflow: hidden;
    position: relative;
}
.modern-loan-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}
.modern-loan-card:hover .modern-loan-card__img {
    transform: scale(1.15);
}
.modern-loan-card__content {
    padding: 25px 15px 15px 15px;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.modern-loan-card__icon {
    position: absolute;
    right: 15px;
    top: -22px;
    width: 44px;
    height: 44px;
    background: #C81929;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 10px rgba(200, 25, 41, 0.3);
    border: 3px solid #fff;
    transition: transform 0.4s ease, background 0.4s ease;
    z-index: 10;
}
.modern-loan-card:hover .modern-loan-card__icon {
    transform: rotateY(180deg);
    background: #1a1a3a;
    box-shadow: 0 4px 10px rgba(26, 26, 58, 0.3);
}
.modern-loan-card__title {
    font-size: 16px;
    font-weight: 800;
    color: #1a1a3a;
    margin-bottom: 8px;
    line-height: 1.3;
    transition: color 0.3s ease;
}
.modern-loan-card:hover .modern-loan-card__title {
    color: #C81929;
}
.modern-loan-card__desc {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Responsive Breakpoints */
@media (max-width: 1200px) {
    .loan-cards-grid-v3 { grid-template-columns: repeat(4, 1fr); gap: 15px; }
}
@media (max-width: 991px) {
    .loan-cards-grid-v3 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
    .loan-cards-grid-v3 { grid-template-columns: repeat(2, 1fr); }
    .modern-loan-card { height: 280px; }
}
@media (max-width: 480px) {
    .loan-cards-grid-v3 { grid-template-columns: 1fr; }
    .modern-loan-card { height: 300px; }
}
</style>
"""

cards_html = cards_css + '<h3 class="service-details__title" style="margin-bottom: 25px;">Loan Services</h3>\n'
cards_html += '<div class="loan-cards-grid-v3">\n'

for title, icon, img_src, desc in loans:
    cards_html += f"""
    <a href="#" class="modern-loan-card wow fadeInUp" data-wow-duration="1500ms">
        <div class="modern-loan-card__img-wrapper">
            <img src="{img_src}" class="modern-loan-card__img" alt="{title}" onerror="this.src='assets/images/service/10.jpg'">
        </div>
        <div class="modern-loan-card__content">
            <div class="modern-loan-card__icon">
                <i class="fas {icon}"></i>
            </div>
            <h4 class="modern-loan-card__title">{title}</h4>
            <p class="modern-loan-card__desc">{desc}</p>
        </div>
    </a>
    """

cards_html += '</div>\n'

start_tag = r'<style>\n\.loan-cards-grid-v2'
end_tag = r'<!-- \/\.service-details__text -->'

pattern = re.compile(start_tag + r'.*?' + end_tag, re.DOTALL)
new_s10_content = pattern.sub(cards_html + '<!-- /.service-details__text -->', s10_content)

with open('s10.html', 'w', encoding='utf-8') as f:
    f.write(new_s10_content)
    
print("Updated s10.html to ultra modern perfect 5-col cards.")
