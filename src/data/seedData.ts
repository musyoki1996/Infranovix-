import { Article, Author, Advertisement, Comment, NewsletterSubscriber } from '../types/newspaper';

export const SEED_AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Peter Omondi',
    role: 'Chief Political Editor',
    bio: 'Peter Omondi has reported on parliamentary affairs, constitutional law, and East African diplomacy for over 18 years. He is a recipient of the Continental Media Excellence Award.',
    email: 'p.omondi@kenyanledger.co.ke',
    twitter: '@OmondiLedger',
    articlesCount: 412
  },
  {
    id: 'author-2',
    name: 'Dr. Wangari Karimi',
    role: 'Economics & Public Policy Columnist',
    bio: 'Dr. Wangari Karimi is a development economist, former fellow at the Institute for Economic Affairs Nairobi, and consultant on macroeconomic resilience.',
    email: 'w.karimi@kenyanledger.co.ke',
    twitter: '@WangariEcon',
    articlesCount: 184
  },
  {
    id: 'author-3',
    name: 'Hassan Abdi',
    role: 'Senior National Security Correspondent',
    bio: 'Hassan Abdi covers security, regional peace initiatives, judicial reform, and northern Kenya affairs with over 14 years of frontline newsroom experience.',
    email: 'h.abdi@kenyanledger.co.ke',
    twitter: '@HassanAbdiKE',
    articlesCount: 290
  },
  {
    id: 'author-4',
    name: 'Faith Mwangi',
    role: 'Counties & Devolution Bureau Chief',
    bio: 'Faith Mwangi coordinates coverage across Kenya\'s 47 counties, focusing on devolved health, fiscal accountability, agriculture, and civic infrastructure.',
    email: 'f.mwangi@kenyanledger.co.ke',
    twitter: '@FaithMwangiKE',
    articlesCount: 325
  },
  {
    id: 'author-5',
    name: 'Kipchumba Rono',
    role: 'Sports Bureau Editor (Eldoret)',
    bio: 'Based in the high-altitude athletics cradle of the North Rift, Kipchumba covers athletics, FKF Premier League, Safari Rally, and grassroots sports talent.',
    email: 'k.rono@kenyanledger.co.ke',
    twitter: '@RonoSportsKE',
    articlesCount: 247
  },
  {
    id: 'author-6',
    name: 'Brenda Wanjiru',
    role: 'Technology & Silicon Savannah Editor',
    bio: 'Brenda tracks venture capital, mobile money innovations, AI deployment, digital governance, and renewable energy startups in Nairobi and Kigali.',
    email: 'b.wanjiru@kenyanledger.co.ke',
    twitter: '@BrendaTechKE',
    articlesCount: 198
  }
];

export const SEED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'treasury-unveils-ksh-3-9-trillion-budget-plan-infrastructure',
    title: 'Treasury Unveils KSh 3.9 Trillion Budget Plan: Critical Investments In Rail, Green Energy, And Digital Infrastructure',
    subhead: 'National Treasury cabinet secretary signals fiscal tightening while preserving key devolved healthcare and agricultural subsidies.',
    excerpt: 'The National Treasury has formally submitted its medium-term budget framework to the National Assembly, projecting revenue growth through broadened digital tax compliance while prioritizing climate-resilient transport corridors.',
    content: `The National Treasury has presented its KSh 3.9 trillion national expenditure estimates for the upcoming fiscal cycle, striking a delicate balance between fiscal consolidation and capital expenditure required to spur double-digit economic expansion.

Appearing before the parliamentary Budget and Appropriations Committee in Nairobi, senior Treasury officials outlined a framework anchored on domestic resource mobilization, debt re-profiling, and targeted investments in renewable energy infrastructure.

"Our macroeconomic baseline remains robust despite global geopolitical headwinds," the presentation noted. "By rationalizing recurrent administrative outlays and channeling capital toward high-multiplier public assets—notably standard gauge rail extensions and county irrigation infrastructure—we ensure long-term sustainability."

### Priority Allocations and Devolved Functions

Under the revised allocations, county governments are set to receive an equitable revenue share exceeding KSh 415 billion, ending months of protracted standoff between the Council of Governors and national fiscal planners. The healthcare revitalization fund and primary school digital learning programmes also received ring-fenced budgetary allocations.

Public sector debt service obligations, which previously constrained discretionary spending, are projected to decrease as a percentage of total revenue as concessionary financing replaces high-yield commercial liabilities.

### Parliamentary Scrutiny

Lawmakers from both sides of the aisle indicated they would conduct line-by-line public participation sessions across all 47 counties before the appropriations bill is put to a formal vote. Civil society groups and business lobbies have welcomed the pledge to refrain from introducing new consumer levies on staple foodstuffs.`,
    categoryId: 'national',
    county: 'Nairobi City',
    tags: ['Treasury', 'Economy', 'Budget 2026', 'Infrastructure', 'Parliament'],
    authorId: 'author-1',
    authorName: 'Peter Omondi',
    authorRole: 'Chief Political Editor',
    featuredImage: '/src/assets/images/hero_nairobi_infrastructure_1793527266254.jpg',
    imageCaption: 'The Nairobi skyline and modern expressway interchange photographed at sunrise as national planners finalize the fiscal policy roadmap.',
    imageCredit: 'The Kenyan Ledger / Photojournalism Bureau',
    readingTimeMinutes: 5,
    publishedAt: '2026-11-01T08:30:00Z',
    updatedAt: '2026-11-01T09:15:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: true,
    isTopStory: true,
    isTrending: true,
    viewsCount: 14820,
    sharesCount: 1240,
    commentsCount: 38
  },
  {
    id: 'art-2',
    slug: 'national-assembly-adopts-landmark-devolution-funding-bill',
    title: 'National Assembly Adopts Landmark Devolution Funding Bill After Bipartisan Senate Consensus',
    subhead: 'New statutory formula guarantees predictable quarterly disbursements to regional administrations, eliminating salary delays.',
    excerpt: 'Following intensive negotiations in the bicameral mediation committee, legislators in Nairobi have passed the County Allocation of Revenue Amendment, guaranteeing predictable quarterly cash transfers.',
    content: `In a rare display of cross-party alignment, the National Assembly on Thursday approved the County Allocation of Revenue Amendment Bill, effectively resolving recurring disbursement bottlenecks that have historically paralyzed county operations.

The statutory instrument introduces automated exchequer release timelines, mandating the Central Bank of Kenya and National Treasury to remit devolved shares within 14 days of each quarter's commencement.

### Safeguarding County Essential Services

County governors had previously voiced alarm over prolonged cash freezes that left public hospitals under-supplied and devolved staff unpaid for consecutive months. Under the newly enacted provisions:

- County treasuries will receive guaranteed baseline funding directly tied to verified performance indices.
- Emergency health response units in arid and semi-arid counties will maintain access to a rapid liquidity buffer.
- Audits by the Office of the Auditor General will be digitized to fast-track reconciliation.

Senate Majority Leader praised the bicameral compromise, calling it a milestone for constitutional devolution under Article 202.`,
    categoryId: 'politics',
    county: 'Nairobi City',
    tags: ['Politics', 'Parliament', 'Devolution', 'Counties', 'Senate'],
    authorId: 'author-1',
    authorName: 'Peter Omondi',
    authorRole: 'Chief Political Editor',
    featuredImage: '/src/assets/images/politics_kenya_parliament_1793527267313.jpg',
    imageCaption: 'Members of Parliament assemble at the parliamentary grounds in Nairobi following the historic passage of the Devolution Funding Act.',
    imageCredit: 'Press Pool / The Kenyan Ledger',
    readingTimeMinutes: 4,
    publishedAt: '2026-11-01T07:45:00Z',
    status: 'published',
    isBreaking: true,
    isLeadStory: false,
    isTopStory: true,
    isTrending: true,
    viewsCount: 11240,
    sharesCount: 890,
    commentsCount: 24
  },
  {
    id: 'art-3',
    slug: 'nairobi-securities-exchange-crosses-2-year-high-agribusiness-rally',
    title: 'Nairobi Securities Exchange Crosses 2-Year High As Diaspora Inflows And Agribusiness Rally',
    subhead: 'NSE 20 Share Index climbs 2.4% in morning trading propelled by commercial banking results and tea export receipts.',
    excerpt: 'Investor sentiment across the Nairobi Securities Exchange surged this week as foreign portfolio inflows combined with robust diaspora remittances drove major equity counters to multi-year highs.',
    content: `Trading at the Nairobi Securities Exchange (NSE) reached its highest valuation in over twenty-four months on Friday, with market capitalization expanding by over KSh 64 billion across consecutive sessions.

Blue-chip financial institutions led the rally following the publication of third-quarter earnings reports demonstrating reduced non-performing loan ratios and strong regional balance sheets in Uganda, Tanzania, and Rwanda.

### Agribusiness & Manufacturing Gains

Agricultural counters, led by major tea and avocado packaging exporters in Murang'a and Kericho, benefited from favorable international auction prices in Mombasa and London.

"We are witnessing a structural return of institutional foreign investors who recognize East Africa's macroeconomic stability," explained a senior portfolio strategist at an investment bank headquartered in Upper Hill, Nairobi.

The Kenyan Shilling likewise maintained steady ground against major international currencies, trading comfortably at 128.40 per US Dollar supported by agricultural export receipts and record tourist arrivals on the Kenyan coast.`,
    categoryId: 'business',
    county: 'Nairobi City',
    tags: ['NSE', 'Business', 'Banking', 'Agribusiness', 'Economy', 'Kenya Shilling'],
    authorId: 'author-2',
    authorName: 'Dr. Wangari Karimi',
    authorRole: 'Economics Columnist',
    featuredImage: '/src/assets/images/business_nairobi_exchange_1793527267719.jpg',
    imageCaption: 'Financial analysts and investment executives track market indicators and company earnings in a Nairobi CBD trading suite.',
    imageCredit: 'Ledger Business Desk',
    readingTimeMinutes: 4,
    publishedAt: '2026-11-01T06:15:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: true,
    isTrending: true,
    viewsCount: 9400,
    sharesCount: 650,
    commentsCount: 16
  },
  {
    id: 'art-4',
    slug: 'road-to-world-championships-team-kenya-begins-trials-iten',
    title: 'Road To World Championships: Team Kenya Begins High-Altitude Trials At Iten Training Camp',
    subhead: 'Over 120 elite distance runners, steeplechase champions, and marathoners converge on Elgeyo Marakwet ahead of global tour.',
    excerpt: 'Kenya\'s celebrated athletics contingent has officially convened in the legendary high-altitude town of Iten for national championship trials, with head coaches praising squad fitness and tactical readiness.',
    content: `The crisp, thin air of Iten in Elgeyo Marakwet County echoed with synchronized footsteps this morning as Athletics Kenya commenced the preliminary selection camp for the upcoming World Athletics Championships.

Over one hundred and twenty competitors—ranging from reigning Olympic medalists to promising teenage sensations from Kapsabet, Nyahururu, and Eldoret—took to the red dirt tracks and winding forest trails overlooking the Great Rift Valley.

### Tactical Focus on Steeplechase and Distance Duels

Coaching staff emphasized rigorous tactical pacing and closing-lap acceleration, particularly in the men's and women's 3,000-metre steeplechase and 10,000-metre events.

"Our athletes understand the expectations of the nation," said head coach David Letting during a trackside press briefing. "The discipline, scientific nutrition, and mental resilience demonstrated in this camp prove that Kenya remains the undisputed home of endurance running."

A capacity crowd of local enthusiasts and international running aficionados gathered along the perimeter to witness the morning time trials, underscoring the deep athletic heritage of the North Rift region.`,
    categoryId: 'sports',
    county: 'Elgeyo Marakwet',
    tags: ['Athletics', 'Sports', 'Iten', 'Elgeyo Marakwet', 'Marathon', 'Team Kenya'],
    authorId: 'author-5',
    authorName: 'Kipchumba Rono',
    authorRole: 'Sports Bureau Editor',
    featuredImage: '/src/assets/images/sports_kenya_athletics_1793527268972.jpg',
    imageCaption: 'Kenyan long-distance runners push the pace during grueling high-altitude time trials in the Rift Valley.',
    imageCredit: 'Sports Desk / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-11-01T05:50:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: true,
    isTrending: false,
    viewsCount: 7850,
    sharesCount: 920,
    commentsCount: 19
  },
  {
    id: 'art-5',
    slug: 'silicon-savannah-how-nairobi-tech-hubs-power-ai-farm-logistics',
    title: 'Silicon Savannah: How Nairobi Tech Hubs Are Powering AI-Driven Farm Logistics Across East Africa',
    subhead: 'Homegrown engineering talent in Kilimani and Westlands develops predictive supply-chain software reducing post-harvest waste by 40%.',
    excerpt: 'Local software startups are deploying localized machine learning models to connect smallholder farmers with urban wholesale markets, significantly curbing food waste and boosting rural family incomes.',
    content: `Across Nairobi's vibrant innovation corridor—from open-plan co-working spaces along Ngong Road to high-tech incubator labs in Westlands—Kenyan software developers are solving one of the continent's most persistent challenges: agricultural post-harvest loss.

By combining offline-first mobile applications with real-time satellite weather data and predictive demand modeling, new logistics platforms enable rural cooperatives in Meru, Nakuru, and Makueni to dispatch produce precisely when urban supermarket prices peak.

### Offline-First Architecture for Rural Connectivity

"Too many imported tech solutions assume uninterrupted high-speed broadband," said Wangui Njeri, chief technology officer of a Nairobi-based agritech venture that recently closed a $12M Series A funding round. "We engineered our system to communicate over SMS and lightweight USSD protocols while running edge caching on solar-powered aggregation depots."

The platform has already onboarded over 65,000 horticultural growers, directly reducing vegetable spoilage rates from 38% to under 9% across pilot supply corridors.

International venture funds are increasingly taking note, with Nairobi capturing nearly 35% of all early-stage technology investment across sub-Saharan Africa this year.`,
    categoryId: 'technology',
    county: 'Nairobi City',
    tags: ['Tech', 'Silicon Savannah', 'AI', 'Startups', 'Agritech', 'Nairobi'],
    authorId: 'author-6',
    authorName: 'Brenda Wanjiru',
    authorRole: 'Technology Editor',
    featuredImage: '/src/assets/images/tech_silicon_savannah_1793527376692.jpg',
    imageCaption: 'Software engineers collaborate in a sunlit tech innovation workspace in Nairobi overlooking the city.',
    imageCredit: 'Tech Desk / The Kenyan Ledger',
    readingTimeMinutes: 4,
    publishedAt: '2026-11-01T05:20:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: true,
    isTrending: true,
    viewsCount: 8640,
    sharesCount: 1100,
    commentsCount: 14
  },
  {
    id: 'art-6',
    slug: 'mombasa-port-records-container-volume-milestone-after-automation',
    title: 'Mombasa Port Records Container Volume Milestone Following Deep-Water Berthing Automation',
    subhead: 'Kenya Ports Authority turnaround times improve to 1.8 days per vessel, outperforming regional maritime competitors.',
    excerpt: 'The Port of Mombasa has handled a record 1.95 million twenty-foot equivalent units (TEUs) in ten months following the commissioning of modernized ship-to-shore gantry cranes.',
    content: `The Kenya Ports Authority (KPA) has announced a record cargo throughput at the Port of Mombasa, solidifying the coastal facility's position as the primary maritime gateway for the Northern Corridor nations of Uganda, South Sudan, Rwanda, and eastern Democratic Republic of Congo.

The installation of automated container handling systems and extended 24-hour customs clearance operations at the Kilindini Harbour terminal has slashed ship turnaround time from 3.6 days to 1.8 days.

County Governor of Mombasa commended the collaborative efforts between port management, clearing agents, and maritime security agencies, emphasizing that the efficiency gains have revived local trucking, warehousing, and coastal hospitality industries.`,
    categoryId: 'counties',
    county: 'Mombasa',
    tags: ['Mombasa', 'Port', 'Maritime', 'Trade', 'Coast', 'Counties'],
    authorId: 'author-4',
    authorName: 'Faith Mwangi',
    authorRole: 'Counties Bureau Chief',
    featuredImage: '/src/assets/images/hero_nairobi_infrastructure_1793527266254.jpg',
    imageCaption: 'Vessels berth at the deep-water Kilindini channel in Mombasa with automated container gantry cranes.',
    imageCredit: 'Coast Bureau / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-11-01T04:40:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: false,
    viewsCount: 5210,
    sharesCount: 340,
    commentsCount: 8
  },
  {
    id: 'art-7',
    slug: 'machakos-agro-industrial-park-expands-cold-storage-fruit-growers',
    title: 'Machakos Agro-Industrial Park Expands Cold Storage Capacity For Local Mango & Avocado Growers',
    subhead: 'County government partnership with European buyers guarantees minimum farm-gate pricing for 12,000 smallholders.',
    excerpt: 'Fruit growers across Machakos and neighboring Kitui County are celebrating the inauguration of a solar-powered 5,000-tonne cold storage facility along the Kangundo corridor.',
    content: `Small-scale horticulture farmers in Machakos County have received a major economic boost with the commissioning of a new 5,000-tonne cold-chain preservation facility at the Machakos Agro-Industrial Park.

Mango and avocado producers in the region have historically lost up to half their harvest during seasonal gluts when middlemen offered exploitative prices. With the modern climate-controlled facility now operational, produce can be preserved at optimal temperatures for up to 45 days, allowing farmers to ship directly to European and Gulf retailers.

"This is devolution delivering tangible dignity to our mothers and youth who tend the orchards," said the County Executive Committee Member for Agriculture during the ribbon-cutting event.`,
    categoryId: 'counties',
    county: 'Machakos',
    tags: ['Machakos', 'Agriculture', 'Counties', 'Horticulture', 'Eastern Kenya'],
    authorId: 'author-4',
    authorName: 'Faith Mwangi',
    authorRole: 'Counties Bureau Chief',
    featuredImage: '/src/assets/images/business_nairobi_exchange_1793527267719.jpg',
    imageCaption: 'Freshly harvested produce sorted and pre-cooled inside the new Machakos agro-processing facility.',
    imageCredit: 'Eastern Bureau / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-10-31T18:20:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: false,
    viewsCount: 4180,
    sharesCount: 290,
    commentsCount: 6
  },
  {
    id: 'art-8',
    slug: 'the-ledger-editorial-guarding-independence-constitutional-commissions',
    title: 'The Ledger Editorial: Guarding The Independence Of Kenya\'s Constitutional Commissions',
    subhead: 'Institutional integrity and statutory autonomy under Chapter 15 of the Constitution must never be subjected to executive convenience.',
    excerpt: 'The Kenyan Ledger editorial board reflects on constitutional safeguards and the non-negotiable duty of oversight bodies to operate without political interference.',
    content: `When Kenyans overwhelmingly promulgated the 2010 Constitution, the primary architecture of statecraft was intentionally redesigned to prevent the concentration of arbitrary power in the executive.

At the core of this institutional shield sit the independent commissions and independent offices established under Chapter 15: the Judiciary, the Office of the Auditor-General, the Controller of Budget, the Independent Electoral and Boundaries Commission, and the Kenya National Commission on Human Rights.

Recent attempts by various political actors to question budgetary independence or exert subtle influence over tenure security represent a dangerous regression that all citizens of goodwill must reject.

### Constitutional Fidelity

Autonomy is not an ornament of governance; it is the vital oxygen that permits an auditor to flag unauthorized expenditures, allows a judge to rule without fear, and enables the budget controller to halt reckless borrowing.

As Kenya\'s independent digital newsroom, *The Kenyan Ledger* will continue to shine an unsparing journalistic spotlight wherever public trust is placed in jeopardy. We stand unreservedly with the institutions that guard our democracy.`,
    categoryId: 'opinion',
    tags: ['Editorial', 'Constitution', 'Judiciary', 'Democracy', 'Human Rights'],
    authorId: 'author-1',
    authorName: 'Peter Omondi',
    authorRole: 'Chief Political Editor',
    featuredImage: '/src/assets/images/politics_kenya_parliament_1793527267313.jpg',
    imageCaption: 'The Kenyan Coat of Arms and Parliament Building: symbols of constitutional governance and sovereignty.',
    imageCredit: 'Editorial Board / The Kenyan Ledger',
    readingTimeMinutes: 4,
    publishedAt: '2026-10-31T16:00:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: true,
    viewsCount: 13900,
    sharesCount: 1540,
    commentsCount: 42
  },
  {
    id: 'art-9',
    slug: 'east-african-community-leaders-unify-cross-border-trade-protocols',
    title: 'East African Community Leaders Conclude Arusha Summit With Unified Cross-Border Trade Protocols',
    subhead: 'Elimination of non-tariff barriers and harmonized digital customs declarations set to double regional commerce by 2028.',
    excerpt: 'Heads of state and trade ministers from Kenya, Uganda, Tanzania, Rwanda, Burundi, DRC, and Somalia have ratified the One-Stop Border Post modernization accord.',
    content: `Meeting in Arusha, Tanzania, heads of state of the East African Community (EAC) have concluded the 24th Ordinary Summit by formally signing a comprehensive protocol harmonizing sanitary, customs, and vehicle axle-load standards across all transit corridors.

The landmark agreement resolves long-standing non-tariff disputes that frequently stranded cargo trucks at border crossings such as Malaba, Namanga, and Busia.

The EAC Secretariat projected that seamless digital cargo tracking will lower shipping costs by approximately 18% over the next two years, cementing East Africa\'s status as the most economically integrated regional economic bloc on the continent.`,
    categoryId: 'world',
    tags: ['East Africa', 'EAC', 'Trade', 'Arusha', 'Diplomacy', 'AfCFTA'],
    authorId: 'author-3',
    authorName: 'Hassan Abdi',
    authorRole: 'Senior Foreign Correspondent',
    featuredImage: '/src/assets/images/hero_nairobi_infrastructure_1793527266254.jpg',
    imageCaption: 'EAC flags flutter in the wind during the ministerial plenary session in Arusha.',
    imageCredit: 'Diplomatic Pool / The Kenyan Ledger',
    readingTimeMinutes: 4,
    publishedAt: '2026-10-31T14:10:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: false,
    viewsCount: 4890,
    sharesCount: 310,
    commentsCount: 7
  },
  {
    id: 'art-10',
    slug: 'nairobi-international-film-festival-2026-celebrates-kenyan-cinema',
    title: 'Nairobi International Film Festival 2026 Celebrates Kenyan Storytellers On The Global Stage',
    subhead: 'Sold-out premiere screenings at Kenya National Theatre showcase poignant narratives in Swahili and Sheng.',
    excerpt: 'The capital\'s premier cinematic showcase has opened with an unprecedented lineup of authentic East African feature films, documentaries, and animation shorts.',
    content: `The red carpet unfurled outside the historic Kenya National Theatre in central Nairobi as the 2026 Nairobi International Film Festival officially commenced.

A distinguished gathering of filmmakers, actors, sound designers, and international distributors arrived to celebrate thirty-four curated productions exploring modern African identity, historical resilience, and urban life.

Critics universally lauded the opening feature—a gripping drama filmed in Kibera and Machakos highlighting grassroots environmental activism. Global streaming platforms were on ground actively securing distribution rights, confirming that Kenyan cinematic storytelling has reached a definitive global tipping point.`,
    categoryId: 'entertainment',
    county: 'Nairobi City',
    tags: ['Film', 'Cinema', 'Arts', 'Culture', 'Nairobi', 'Entertainment'],
    authorId: 'author-6',
    authorName: 'Brenda Wanjiru',
    authorRole: 'Culture & Arts Correspondent',
    featuredImage: '/src/assets/images/tech_silicon_savannah_1793527376692.jpg',
    imageCaption: 'Filmmakers and actors celebrate during the opening gala of the Nairobi International Film Festival.',
    imageCredit: 'Culture Desk / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-10-31T11:30:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: false,
    viewsCount: 3670,
    sharesCount: 220,
    commentsCount: 5
  },
  {
    id: 'art-11',
    slug: 'fkf-premier-league-gor-mahia-afc-leopards-mashemeji-derby-preview',
    title: 'FKF Premier League: Tactical Breakdown Ahead Of The 96th Mashemeji Derby At Nyayo Stadium',
    subhead: 'Title race intensifies as traditional rivals clash before an expected 30,000 passionate football supporters.',
    excerpt: 'Kenyan football enthusiasts are preparing for the storied Mashemeji Derby, with both Gor Mahia and AFC Leopards fielding potent attacking formations in a match that could define the league title.',
    content: `Kenyan football\'s most iconic rivalry writes its 96th chapter this weekend as Gor Mahia face AFC Leopards at a sold-out Nyayo National Stadium.

Both managers appeared before media corps on Friday expressing unwavering confidence. Gor Mahia hold a slender two-point advantage at the summit of the Football Kenya Federation (FKF) Premier League table, but Leopards have assembled an eight-match unbeaten sequence anchored by their resolute central defensive pairing.

Security chiefs have coordinated with transport authorities to ensure orderly fan transit, while broadcasters promise high-definition multi-camera coverage beamed live across fifteen African nations.`,
    categoryId: 'sports',
    county: 'Nairobi City',
    tags: ['Football', 'Mashemeji Derby', 'Gor Mahia', 'AFC Leopards', 'FKF', 'Nyayo'],
    authorId: 'author-5',
    authorName: 'Kipchumba Rono',
    authorRole: 'Sports Bureau Editor',
    featuredImage: '/src/assets/images/sports_kenya_athletics_1793527268972.jpg',
    imageCaption: 'Supporters create a vibrant spectacle during a high-stakes Kenyan premier league encounter.',
    imageCredit: 'Sports Desk / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-10-31T09:15:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: true,
    viewsCount: 8940,
    sharesCount: 780,
    commentsCount: 31
  },
  {
    id: 'art-12',
    slug: 'from-farm-to-table-indigenous-grains-reshape-urban-kenyan-menus',
    title: 'From Farm To Table: How Traditional Sorghum And Finger Millet Are Reshaping Urban Kenyan Menus',
    subhead: 'Culinary resurgence driven by health consciousness and climate resilience breathes new life into ancestral gastronomy.',
    excerpt: 'Fine dining restaurants in Nairobi and Mombasa are championing indigenous grains like finger millet, amaranth, and sorghum, transforming traditional culinary staples into gourmet experiences.',
    content: `In prominent dining rooms across Nairobi\'s Westlands, Karen, and Lavington, top chefs are rewriting modern Kenyan cuisine by drawing directly from centuries-old culinary heritage.

Dishes incorporating finger millet (*wimbi*), sorghum, amaranth, and drought-tolerant pulses like cowpeas and pigeon peas have transitioned from humble rural staples into celebrated culinary centerpieces.

Nutritionists praise the movement for promoting low-glycemic, fiber-rich diets that combat non-communicable lifestyle ailments, while agronomists note that cultivating climate-hardy indigenous crops provides vital economic insurance for smallholder farmers during erratic rainfall seasons.`,
    categoryId: 'lifestyle',
    tags: ['Food', 'Gastronomy', 'Health', 'Indigenous Grains', 'Lifestyle', 'Culture'],
    authorId: 'author-4',
    authorName: 'Faith Mwangi',
    authorRole: 'Counties Bureau Chief',
    featuredImage: '/src/assets/images/business_nairobi_exchange_1793527267719.jpg',
    imageCaption: 'Heirloom Kenyan grains and fresh organic ingredients prepared by a culinary artisan in Nairobi.',
    imageCredit: 'Lifestyle Desk / The Kenyan Ledger',
    readingTimeMinutes: 3,
    publishedAt: '2026-10-30T15:20:00Z',
    status: 'published',
    isBreaking: false,
    isLeadStory: false,
    isTopStory: false,
    isTrending: false,
    viewsCount: 3820,
    sharesCount: 260,
    commentsCount: 9
  }
];

export const SEED_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'Safaricom M-PESA Global Business Solutions',
    placement: 'header_leaderboard',
    type: 'direct',
    destinationUrl: 'https://www.safaricom.co.ke/business',
    clientName: 'Safaricom PLC',
    active: true,
    impressions: 48920,
    clicks: 1420,
    dimensions: '728x90 / Responsive Leaderboard'
  },
  {
    id: 'ad-2',
    title: 'Equity Bank Diaspora Banking & Investment Portal',
    placement: 'sidebar_mpu',
    type: 'direct',
    destinationUrl: 'https://equitygroupholdings.com',
    clientName: 'Equity Group Holdings',
    active: true,
    impressions: 31200,
    clicks: 980,
    dimensions: '300x250 Medium Rectangle'
  },
  {
    id: 'ad-3',
    title: 'Kenya Airways - Direct Flights Across Africa & Beyond',
    placement: 'between_sections',
    type: 'direct',
    destinationUrl: 'https://www.kenya-airways.com',
    clientName: 'Kenya Airways',
    active: true,
    impressions: 25400,
    clicks: 810,
    dimensions: '970x250 Billboard / Responsive'
  },
  {
    id: 'ad-4',
    title: 'Google AdSense Partner Placement (Automated)',
    placement: 'in_article',
    type: 'adsense',
    clientName: 'Google AdSense Network',
    active: true,
    impressions: 19800,
    clicks: 430,
    dimensions: 'Responsive In-Article Display'
  },
  {
    id: 'ad-5',
    title: 'NSE Investor Education Hub',
    placement: 'footer_leaderboard',
    type: 'sponsored',
    destinationUrl: 'https://www.nse.co.ke',
    clientName: 'Nairobi Securities Exchange',
    active: true,
    impressions: 14200,
    clicks: 340,
    dimensions: '728x90 Leaderboard'
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    articleTitle: 'Treasury Unveils KSh 3.9 Trillion Budget Plan',
    authorName: 'Duncan Kamau',
    authorEmail: 'dkamau@example.co.ke',
    content: 'Clear and balanced analysis by The Kenyan Ledger. Ring-fencing the KSh 415B devolved health allocation is crucial for our county hospitals in Kiambu and Murang\'a.',
    createdAt: '2026-11-01T09:30:00Z',
    status: 'approved',
    likesCount: 14
  },
  {
    id: 'comm-2',
    articleId: 'art-1',
    articleTitle: 'Treasury Unveils KSh 3.9 Trillion Budget Plan',
    authorName: 'Amina Abdi',
    authorEmail: 'amina.abdi@example.com',
    content: 'The key question will be expenditure discipline. Parliament must rigorously verify capital project delivery in line with public procurement rules.',
    createdAt: '2026-11-01T10:05:00Z',
    status: 'approved',
    likesCount: 9
  },
  {
    id: 'comm-3',
    articleId: 'art-2',
    articleTitle: 'National Assembly Adopts Landmark Devolution Funding Bill',
    authorName: 'Kiprop Kiprono',
    authorEmail: 'kiprop.k@eldoret.org',
    content: 'A huge step forward for the 47 counties! Delayed exchequer releases were stalling contractors and medical staff salaries for months.',
    createdAt: '2026-11-01T08:20:00Z',
    status: 'approved',
    likesCount: 11
  },
  {
    id: 'comm-4',
    articleId: 'art-5',
    articleTitle: 'Silicon Savannah: How Nairobi Tech Hubs Are Powering AI-Driven Farm Logistics',
    authorName: 'Grace Otieno',
    authorEmail: 'grace@techinafrica.io',
    content: 'Proud of our homegrown Kenyan engineers! Building solutions tailored to African supply chains is the true promise of Silicon Savannah.',
    createdAt: '2026-11-01T06:40:00Z',
    status: 'approved',
    likesCount: 18
  }
];

export const SEED_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'editor.choice@africamedia.com', subscribedAt: '2026-10-25T10:00:00Z', status: 'active', edition: 'Daily Morning Brief' },
  { id: 'sub-2', email: 'investor.nairobi@holdings.co.ke', subscribedAt: '2026-10-26T14:30:00Z', status: 'active', edition: 'Business & NSE Weekly' },
  { id: 'sub-3', email: 'civic.leader@machakos.gov.ke', subscribedAt: '2026-10-28T09:15:00Z', status: 'active', edition: 'County Devolution Digest' },
];
