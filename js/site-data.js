/* ==========================================================================
   SITE PLACEHOLDER CONTENT  -  SINGLE SOURCE OF TRUTH
   --------------------------------------------------------------------------
   Every piece of copy, image, link and number on the page lives here.
   Change a value below and it updates everywhere it appears on the page.
   Nothing in this file needs to keep the same length or word count.

   Keys are referenced from index.html with:
       data-ph="some.key.path"                    -> text content
       data-ph-attr="href:some.key.path"          -> attribute value
       data-ph-attr="src:some.key.path"           -> attribute value
       data-ph-attr="alt:some.key.path"           -> attribute value
   ========================================================================== */

window.SITE = {

    /* ---------------------------------------------------------------- brand */
    agency: {
        name: 'Freelance Studio',
        shortName: 'FREELANCE',
        suffix: 'Studio',
        title: 'Freelance Studio – Creative Digital Agency',
        description: 'A two-person creative digital studio focused on strategy, design and development.',
        tagline: 'Strategy, design and code — end to end.',
        taglineAlt: 'We grab projects and finish them properly.'
    },

    /* ------------------------------------------------------- header / nav */
    nav: [
        { label: 'Home', href: '#home' },
        { label: 'About Us', href: '#about' },
        { label: 'Team', href: '#team' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Features', href: '#features' },
        { label: 'Contact', href: '#contact' }
    ],

    /* ----------------------------------------------------------------- hero */
    hero: {
        slide1: {
            title: 'Creative agency',
            sub: 'Strategy, design and code — end to end.',
            ctaPrimary: 'See our work',
            ctaSecondary: 'Hire us'
        },
        slide2: {
            title: 'Creative studio',
            sub: 'We grab projects and finish them properly.',
            ctaPrimary: 'See our work',
            ctaSecondary: 'Hire us'
        }
    },

    /* ---------------------------------------------------------------- about */
    about: {
        subtitle: 'Digital Products',
        title: 'What we do best',
        intro: 'We create themes, eCommerce projects and creative content that bring culture and commerce together.',
        splitTitle: 'Powerful Studio Options',
        splitText: 'Talk less, do more and you will be rewarded. To make things that people care about. We were founded on this principle and we will always be committed to it.',
        splitCta: 'Discover more',
        splitImage: 'Template/upload/kaleido-1.jpg'
    },

    process: [
        { icon: 'pe-7s-headphones', title: 'Prototyping', text: 'We sketch the whole journey on paper first, so nothing expensive gets built until the idea already works.' },
        { icon: 'pe-7s-plugin', title: 'Design', text: 'Wireframes become real interfaces, hand tuned for typography, spacing and every breakpoint in between.' },
        { icon: 'pe-7s-joy', title: 'Development', text: 'Clean, fast, accessible front-end and back-end code that ships on schedule and stays easy to extend.' },
        { icon: 'pe-7s-mail-open-file', title: 'Awesome project', text: 'Launch, measure, iterate. We stay on the project after release because finishing is the hard part.' }
    ],

    stats: [
        { value: 50, suffix: '+', label: 'Projects delivered' },
        { value: 20, suffix: '+', label: 'Happy clients' },
        { value: 5, suffix: '+', label: 'Experience' }
    ],

    pillarsLabel: 'WHO WE ARE',
    // "|" becomes a <br /> - see data-ph-lines in js/custom.js
    pillarsHeading: 'Awesome international graphic|design and digital advertising|agency based in Australia',

    /* ---------------------------------------------- feature callout (news row) */

    pillars: [
        { icon: 'fa fa-heart', title: 'Unlimited Colors', text: 'We design the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper.', percent: 95 },
        { icon: 'fa fa-star', title: 'High Quality Design', text: 'We design the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper.', percent: 70 },
        { icon: 'fa fa-newspaper-o', title: 'Luxurious Layouts', text: 'We design the experience in 3 steps, each increasing in detail, from the flow to the wireframes and from pen and paper.', percent: 83 }
    ],

    /* ----------------------------------------------------------------- team */
    /* The "Our Team" block inside the About section, rendered with the theme's
       own .mgt-promo-block (photo on top, name, role, bio, button).
       `image` is a document-relative path bound to the card's <img src>; the
       photo box is a fixed height and the picture is fitted inside it at its
       own aspect ratio, so nothing is cropped or stretched. */
    team: {
        subtitle: 'Our Team',
        title: 'The two people behind the work',
        members: [
            {
                image: 'abdullah_4x5.jpg',
                name: 'Abdullah Ahmed',
                role: 'Web Developer & Automation',
                text: 'Web developer across front-end, backend CMS and AI workflows. Builds the automations that take repetitive work off the team, so pages ship faster and stay easy to maintain.',
                cta: 'Say hello',
                linkedin: 'https://www.linkedin.com/in/abdullah-ahmed34/',
                linkedinCta: 'LinkedIn'
            },
            {
                image: 'hassan_4x5.jpg',
                name: 'Mubashir Hassan',
                role: 'Web Designer',
                text: 'Designs interfaces that look sharp and read clearly on any screen. Turns rough ideas into clean, accessible layouts, then hands over builds that are simple to maintain.',
                cta: 'Say hello',
                linkedin: 'https://www.linkedin.com/in/mubashir-hassan-lead-generation-expert/',
                linkedinCta: 'LinkedIn'
            }
        ]
    },

    /* ------------------------------------------------------------ portfolio */
    portfolio: {
        subtitle: 'portfolio',
        title: 'Awesome Portfolio',
        text: 'We create themes, eCommerce projects, creative content that bring culture and commerce together.',
        /* filters drive the MixItUp buttons; the value must match the CSS
           classes used on the items below (e.g. "branding" -> class "branding") */
        filters: [
            { label: 'All', value: 'all' },
            { label: 'Branding', value: '.branding' },
            { label: 'Web Design', value: '.web-design' },
            { label: 'UI-UX', value: '.ui-ux' },
            { label: 'App Design', value: '.app-design' }
        ],
        items: [
            { image: 'imgs/pexels-cadomaestro-1170412_result.webp', cats: 'agency branding web-design', sub: 'Agency / Branding', title: 'Designers Tool Kit', desc: 'Special mockup' },
            { image: 'imgs/pexels-diva-plavalaguna-6937932_result.webp', cats: 'agency web-design ui-ux', sub: 'Agency / Web design / UI&UX', title: 'Stamp', desc: 'Landing page' },
            { image: 'imgs/pexels-divinetechygirl-1181311_result.webp', cats: 'agency ui-ux', sub: 'Agency', title: 'Ease UI Components', desc: 'Mock up components' },
            { image: 'imgs/pexels-feyzayildirimphoto-19876064_result.webp', cats: 'branding app-design ui-ux', sub: 'Branding / App design / UI&UX', title: 'Hero – Mobile Mockup', desc: 'Perfect for mobile' },
            { image: 'imgs/pexels-ketut-subiyanto-4126739_result.webp', cats: 'ui-ux', sub: 'UI&UX', title: 'Jumper Font', desc: 'Exclusive font' },
            { image: 'imgs/pexels-padrinan-2882652_result.webp', cats: 'app-design web-design ui-ux', sub: 'App design / Web design / UI&UX', title: 'Bag MockUp', desc: 'Packaging mockup' },
            { image: 'imgs/pexels-picjumbo-com-55570-196645_result.webp', cats: 'branding app-design', sub: 'Branding / App design', title: 'Colorfull app design', desc: 'Mobile app' },
            { image: 'imgs/pexels-tranmautritam-285814_result.webp', cats: 'agency app-design ui-ux', sub: 'Agency / App design / UI&UX', title: 'Bag design', desc: 'Merchandise' },
            { image: 'imgs/pexels-tranmautritam-326514_result.webp', cats: 'agency web-design', sub: 'Agency / Web design', title: 'Mock up for devices', desc: 'Responsive build' },
            { image: 'imgs/tookapic-office-932926_result.webp', cats: 'branding', sub: 'Branding', title: 'Delightful font', desc: 'Type system' }
        ]
    },

    /* ------------------------------------------------------------- features */
    features: {
        subtitle: 'What we offer',
        title: 'Use it anywhere',
        blocks: [
            {
                image: 'Template/upload/Team-1.jpg',
                title: 'Use it Anywhere',
                text: 'Our goal is simple, to make things that people care about. We were founded on this principle and we will always be committed to it.',
                cta: 'Read more'
            },
            {
                image: 'Template/upload/girl-smoke.jpg',
                title: 'About Company',
                text: 'We only hire great people who strive to push their ideas into fruition by outmuscling and outhustling the competition.',
                cta: 'Read more'
            },
            {
                image: 'Template/upload/workplace-macbook.jpg',
                title: 'What we offer',
                text: 'Talk less, do more and you will be rewarded. To make things that people care about. We were founded on this principle.',
                cta: 'Read more'
            }
        ]
    },

    /* ------------------------------------------------------------- services */

    /* --------------------------------------------------------- testimonials */

    /* ---------------------------------------------------------------- office */


    /* --------------------------------------------------------------- clients */


    /* ------------------------------------------------------------------- cta */
    cta: {
        subtitle: 'GET IN TOUCH',
        title: 'Do you love us yet?',
        text: 'We’re reaching new mile stones and we appreciate the continued support from everyone!',
        submit: 'Send message'
    },

    /* ---------------------------------------------------------------- footer */
    footer: {
        aboutTitle: 'Freelance Studio',
        aboutText: 'Two people, one studio. We design and build websites, and we answer every message ourselves.',
        phone: '+ 1 703 4959 3452',
        email: 'hello@freelancestudio.com',
        /* Separate from `email` so the link text stays clean while the href is
           a real mailto. Binding both to one key produced a relative link to
           "hello@freelancestudio.com", which 404s on click. */
        emailHref: 'mailto:hello@freelancestudio.com',
        menuTitle: 'Navigation',
        /* No `menu` list here: the footer Navigation widget renders SITE.nav, so
           the footer can only ever link to sections that exist on this page. The
           old "About us" legal menu and the "Recent News" widget have been
           removed - every one of their links pointed at pages this site does
           not have. */
        socials: [
            { network: 'facebook', label: 'Facebook', url: 'https://facebook.com/' },
            { network: 'twitter', label: 'Twitter', url: 'https://twitter.com/' },
            { network: 'behance', label: 'Behance', url: 'https://behance.net/' },
            { network: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/' },
            { network: 'pinterest', label: 'Pinterest', url: 'https://pinterest.com/' }
        ],
        copyright: '© 2026 Freelance Studio. All rights reserved.'
        /* `credit` used to render as "All rights reserved. · (2026)" - no ©
           symbol, no company name, and the year in brackets after a separator.
           Folded into `copyright` so the line reads as one sentence. */
    }
};
