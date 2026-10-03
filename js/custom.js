/* ==========================================================================
   ONE-PAGE BEHAVIOUR FOR THE B-AGENT REPLICA
   --------------------------------------------------------------------------
   The theme already ships every visual component and its own reveal /
   progress-bar / slider machinery (Template/js/plugins/template.js and
   js_composer_front.min.js). This file does NOT re-implement any of them.

   It only owns the parts a single page has to provide itself:

     1. Placeholder binding  - fills every data-ph* hook from js/site-data.js
     2. Footer lists         - the reference's footer widgets are empty <ul>s
     3. Header state         - fixed bar turns solid once scrolled
     4. Scroll spy           - marks the current section in the nav
     5. Smooth scrolling     - rAF, offset by the live header height
     6. Counters             - About stats
     7. Portfolio filter     - buttons for the theme's own MixItUp instance
     8. Lightbox             - portfolio preview (the export ships none)
     9. Mobile fullscreen menu
    10. Contact form         - client side validation only, no backend
    11. Reveal safety net
   ========================================================================== */

(function (window, document) {
    "use strict";

    var docEl = document.documentElement;
    var body = document.body;
    var SITE = window.SITE || {};
    var $ = window.jQuery;

    var prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var $window = $(window);
    var $document = $(document);

    /* ======================================================================
       1. PLACEHOLDER BINDING
       ----------------------------------------------------------------------
       index.html carries the hooks, js/site-data.js carries the copy:

         data-ph="a.b.c"                    -> textContent
         data-ph-attr="href:a.b.c"          -> any attribute ("value:cta.submit")
         data-ph-class="process.0.icon"     -> className (icon fonts)
         data-ph-pct="pillars.0.percent"    -> "95%" label + vc_progress_bar value
         data-ph-lines="pillarsHeading"     -> innerHTML, "|" becomes <br />

       A key that is missing from site-data.js leaves the markup's own default
       text untouched, so the page never goes blank because of a typo.
       ====================================================================== */

    function get(path) {
        var parts = String(path).split(".");
        var node = SITE;
        var i;

        for (i = 0; i < parts.length; i++) {
            if (node === null || typeof node === "undefined") {
                return undefined;
            }
            node = node[parts[i]];
        }

        return node;
    }

    function bindPlaceholders() {
        $("[data-ph]").each(function () {
            var value = get($(this).attr("data-ph"));

            if (typeof value !== "undefined" && value !== null) {
                $(this).text(String(value));
            }
        });

        $("[data-ph-attr]").each(function () {
            var spec = String($(this).attr("data-ph-attr") || "").split(":");
            var value;

            if (spec.length < 2) {
                return;
            }

            value = get(spec.slice(1).join(":"));

            if (typeof value !== "undefined" && value !== null) {
                $(this).attr(spec[0], String(value));
            }
        });

        $("[data-ph-lines]").each(function () {
            var value = get($(this).attr("data-ph-lines"));

            if (typeof value !== "undefined" && value !== null) {
                // "line one|line two" -> "line one<br />line two"
                $(this).html(
                    String(value)
                        .split("|")
                        .map(function (line) {
                            return $("<span></span>").text(line.trim()).html();
                        })
                        .join("<br />")
                );
            }
        });

        $("[data-ph-class]").each(function () {
            var $el = $(this);
            var value = get($el.attr("data-ph-class"));

            if (typeof value === "undefined" || value === null) {
                return;
            }

            // Appended, not replaced: the theme's own class (mgt-font-icon) is
            // what carries the glyph size inside .mgt-icon-box-icon, so it has
            // to survive binding.
            String(value).split(/\s+/).forEach(function (name) {
                if (name) {
                    $el.addClass(name);
                }
            });
        });

        $("[data-ph-pct]").each(function () {
            var $el = $(this);
            var value = get($el.attr("data-ph-pct"));
            var $bar;

            if (typeof value === "undefined" || value === null) {
                return;
            }

            $el.text(String(value) + "%");
            $bar = $el.closest(".vc_single_bar").find(".vc_bar");

            if ($bar.length) {
                $bar.attr("data-percentage-value", String(value));
                $bar.attr("data-value", String(value));
            }
        });

        if (SITE.agency && SITE.agency.title) {
            document.title = SITE.agency.title;
        }

        if (SITE.agency && SITE.agency.description) {
            $('meta[name="description"]').attr("content", SITE.agency.description);
        }
    }

    /* ======================================================================
       2. FOOTER LISTS + SOCIAL ICONS
       ====================================================================== */

    function ensureArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function escapeHtml(value) {
        return String(value === null || typeof value === "undefined" ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    /* Items are either a plain string - rendered as hrefPrefix + label, which is
       how the theme's own placeholder menus worked - or { label, href } for a
       real in-page anchor. The footer Navigation widget uses the object form so
       it can only link to sections that exist on the page. */
    function renderMenu(targetSelector, items, hrefPrefix) {
        var $target = $(targetSelector);
        var list = ensureArray(items);
        var html = "";
        var i;
        var item;
        var label;
        var href;

        if (!$target.length || !list.length) {
            return;
        }

        for (i = 0; i < list.length; i++) {
            item = list[i];

            if (item && typeof item === "object") {
                label = item.label === undefined ? "" : item.label;
                href = item.href === undefined ? "#" : item.href;
            } else {
                label = item;
                href = (hrefPrefix || "#") + item;
            }

            html +=
                '<li class="menu-item"><a href="' +
                escapeHtml(href) +
                '">' +
                escapeHtml(label) +
                "</a></li>";
        }

        $target.html(html);
    }

    /* The theme draws its social icons with Font Awesome brand glyphs. That
       webfont is not present in this export, so the glyphs are inlined as SVG -
       crisp, colourable and with no extra request. */
    var SOCIAL_SVG = {
        facebook:
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.1 23.7v-8H6.63v-3.67h2.47v-1.58c0-4.08 1.85-5.97 5.86-5.97.4 0 .95.04 1.47.1.37.05.76.13 1.14.2v3.32c-.22-.05-.5-.12-.84-.18-.34-.06-.7-.09-1.08-.09-.7 0-1.26.1-1.67.31-.27.13-.49.33-.68.62-.26.42-.37 1-.37 1.75v1.3h3.92l-.39 2.1-.29 1.57H9.1v8.24zM2 12.04C2 5.42 7.37 0 12 0c4.64 0 8.4 5.42 8.4 12.04 0 3.29-1.32 6.28-3.45 8.47-1.02 1.05-2.17 1.83-3.44 2.37v-3.5c.9-.31 1.73-.78 2.48-1.4 1.51-1.26 2.44-2.98 2.78-5.16.06-.4.09-.83.09-1.28 0-1.06-.22-2.02-.66-2.89a4.4 4.4 0 00-1.74-1.84 5 5 0 00-2.38-.58c-.83 0-1.58.2-2.25.58a4.4 4.4 0 00-1.74 1.84c-.44.87-.66 1.83-.66 2.89v3.47H7.5V12c0-2.2.92-4.16 2.77-5.86A9.1 9.1 0 0112 4.53c1.27 0 2.4.33 3.36.99v2.4a7.6 7.6 0 00-1.62-.53 5.6 5.6 0 00-1.74.28c-.53.17-.94.44-1.24.82-.3.37-.44.89-.44 1.56v1.14h4.02l-.39 2.1-.29 1.57H10.52v8.24c-.35.1-.7.19-1.06.27A11.85 11.85 0 012 12.04z"/></svg>',
        twitter:
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.95 4.57a10 10 0 01-2.82.78 4.93 4.93 0 002.16-2.72c-.95.56-2 .97-3.13 1.19a4.92 4.92 0 00-8.38 4.48A13.97 13.97 0 011.64 3.16a4.92 4.92 0 001.52 6.57 4.9 4.9 0 01-2.23-.62v.06a4.92 4.92 0 003.95 4.83 4.96 4.96 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.87 9.87 0 011 19.54a13.94 13.94 0 007.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.43-.01-.64a10 10 0 002.46-2.55z"/></svg>',
        behance:
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.44 5.35c.16-.34.36-.64.6-.9.24-.25.55-.44.9-.55.34-.11.75-.17 1.18-.17.28 0 .56.02.83.06.28.04.52.09.72.15v2.39c-.13-.06-.32-.12-.57-.18a4.1 4.1 0 00-.68-.14c-.25 0-.5.01-.73.05-.23.05-.42.1-.59.19-.17.09-.31.19-.42.31-.11.13-.19.27-.25.44-.06.17-.09.37-.09.61v.68c0 .15.03.28.08.41.05.14.14.25.26.35.12.11.28.19.46.26.18.07.4.11.65.11.29 0 .57-.05.84-.14.27-.09.5-.21.7-.36l2.11 2.07c-.32.29-.67.53-1.05.72-.38.19-.78.34-1.21.44-.43.1-.87.16-1.33.16-.55 0-1.06-.09-1.53-.24-.47-.16-.87-.4-1.2-.72-.33-.32-.59-.72-.78-1.2-.19-.48-.29-1.04-.29-1.7v-3.19c0-.61.1-1.17.29-1.68zm1.87-1.2c.13-.31.35-.55.66-.71.3-.16.68-.24 1.13-.24.26 0 .5.04.72.12.22.08.44.18.66.32l1.5-1.87c-.3-.27-.67-.5-1.11-.69-.44-.19-.93-.28-1.47-.28-.72 0-1.35.15-1.89.46-.54.3-.96.73-1.26 1.27-.3.55-.44 1.22-.44 2.02v3.66c0 .8.14 1.46.43 2 .29.53.72.96 1.29 1.28.57.32 1.27.48 2.1.48.5 0 .98-.08 1.44-.23.46-.15.88-.38 1.26-.68v-2.43c-.35.24-.73.43-1.13.57-.4.14-.83.21-1.28.21-.38 0-.72-.07-1.01-.2-.29-.13-.52-.33-.69-.58-.17-.25-.29-.57-.36-.94l-.02-.27v-.67c0-.32.05-.6.16-.84zm6.26 1.05c.34 0 .66.06.95.17.29.11.53.28.72.51.19.22.33.51.41.85.08.34.12.73.12 1.17v.79h-3.83v-.7c0-.6.1-1.06.28-1.37.18-.31.5-.47.95-.47zm-1.32-1.5c-.36 0-.67.08-.91.24-.24.16-.43.38-.56.66-.13.28-.21.64-.24 1.07h3.36c-.01-.44-.08-.8-.2-1.07-.12-.27-.32-.49-.59-.65-.27-.16-.57-.25-.86-.25zM16.3 9.4h2.6v1.53h-2.6V9.4zm1.97-2.44c.32 0 .62.04.89.13.27.08.5.2.68.34.18.15.31.33.4.53.08.21.13.45.13.72v1.4h-2.73V8.1c0-.25-.06-.44-.17-.57-.11-.14-.3-.2-.55-.2-.22 0-.42.04-.6.12-.18.08-.31.21-.4.38-.08.17-.13.39-.13.66v2.42h-2.4V7.95c0-.51.09-.96.27-1.34.18-.38.45-.68.79-.89.35-.21.79-.32 1.31-.32z"/></svg>',
        dribbble:
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0a12 12 0 00-4.3 23.9c.1-1 .2-2.1 0-3A24.4 24.4 0 0112 0zM0 12a12 12 0 0119.7 9.4C17.6 22 14 22.4 10.4 22.4c-2.6 0-5-.4-7.2-1.1A12 12 0 010 12zm12-12c2.6 0 5 1 6.8 2.7-1.5 1.7-3.6 3-5.9 3.9A40 40 0 0110.3 0c.6 0 1.1 0 1.7 0zM8.1 1.3a45 45 0 013.8 6.6C8.5 9 5.2 9 1.7 8.9A10 10 0 018.1 1.3zM.8 10.2c4 .1 7.5-.2 10.7-1.2 1.2 2.1 2 4.5 2.5 6.9A12 12 0 01.4 12c0-1.3.2-2.5.4-3.7zm14 1.7c-1.9 0-3.7.2-5.5.5 1.1 2 2 4.2 2.4 6.4a10 10 0 006.9-5.4c-1.2.3-2.5.5-3.8.5zM15 20.4c-.4-1.9-1.2-3.9-2.2-5.8 1.6-.3 3.3-.3 4.9 0 .3.7.5 1.4.7 2.2a10 10 0 01-3.4 3.6z"/></svg>',
        pinterest:
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0a12 12 0 00-4.6 23.1c-.1-1 0-2.2.3-3.3l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.4-2 3.4-4.9 0-2.6-1.9-4.4-4.5-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.3 1.9.8 2.5 0 .1-.1.4-.1.7 0 .3-.2.5-.5.7-.2.1-.4.1-.4-.2 0-.6.4-1.4.5-2.2.2-.8.1-1.6-.6-1.6-1.1 0-1.9 1.1-1.9 2.6 0 1 .3 1.6.3 1.6L5.3 15.2c-.3 1.3-.1 3.2-.1 4.2 0 .1 0 .2.1.2A12 12 0 0012 0z"/></svg>'
    };

    function renderSocials() {
        var $list = $("#fs-footer-socials");
        var items = ensureArray(SITE.footer && SITE.footer.socials);
        var html = "";
        var i;

        if (!$list.length || !items.length) {
            return;
        }

        for (i = 0; i < items.length; i++) {
            html +=
                '<li><a href="' +
                escapeHtml(items[i].url) +
                '" aria-label="' +
                escapeHtml(items[i].label) +
                '" rel="noopener" target="_blank">' +
                (SOCIAL_SVG[items[i].network] || "") +
                "</a></li>";
        }

        /* #fs-footer-socials is itself the icon list (it carries the
           social-icons-wrapper / fs-socials classes in index.html), so only the
           <li> items are injected. Wrapping them in a second <ul> would put a
           list inside a list, which is invalid and left the anchors 25x27. */
        $list.html(html);
    }

    function renderFooter() {
        /* The footer Navigation widget reuses SITE.nav rather than a second
           hand-kept list, so a footer link can never drift from the sections the
           page actually has. */
        renderMenu("#fs-footer-nav-1", SITE.nav, "");
        renderSocials();
    }

    /* ======================================================================
       3. HEADER STATE + SCROLL SPY
       ====================================================================== */

    function headerOffset() {
        var $header = $("header.main-header");

        /* Measured, not hardcoded: the bar is 110px above 1024px and a compact
           92px below it (see the max-width:1024px block in custom.css). */
        return $header.length ? $header[0].offsetHeight : 110;
    }

    function initHeader() {
        var $header = $("header.main-header");
        var ticking = false;

        if (!$header.length) {
            return;
        }

        function apply() {
            var solid = ($window.scrollTop() || docEl.scrollTop) > 40;

            $header.toggleClass("fs-header-solid", solid);
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(apply);
            }
        }

        $window.on("scroll", onScroll);
        $window.on("resize", onScroll);
        apply();
    }

    function initScrollSpy() {
        var nav = ensureArray(SITE.nav);
        var $links = $("#menu-main-menu .menu-item > a, #menu-offcanvas .menu-item > a");
        var sections = [];
        var i;

        // Only sections that actually appear in the menu take part, otherwise
        // the decorative sections in between would blank the active state.
        for (i = 0; i < nav.length; i++) {
            var node = document.querySelector(nav[i].href);

            if (node) {
                sections.push(node);
            }
        }

        if (!sections.length || !$links.length) {
            return;
        }

        function setActive(id) {
            $links.each(function () {
                var $item = $(this).parent();

                $item.toggleClass("current-menu-item", $(this).attr("href") === "#" + id);
            });
        }

        if (!window.IntersectionObserver) {
            setActive("home");
            return;
        }

        /* #team is a short row INSIDE #about, which an IntersectionObserver band
           cannot see: a band only reports a target while that target spans it,
           and a 90px header row sits above the band rather than across it.
           It also never fires for an instant jump that skips the band entirely
           - exactly what clicking a nav link does. So this is a plain
           scroll-driven spy instead.

           The rule is geometric: the active item is the LAST target whose top
           edge has passed the reading line just above the middle of the
           viewport. Nested targets fall out correctly, because #team comes
           after #about in nav order - Team takes over the moment its own top
           crosses the line, and About takes back over above that. When no
           target has reached the line the current highlight is left alone,
           as before. */
        var ticking = false;
        var active = null;

        function update() {
            var line = window.innerHeight * 0.475;
            var current = null;
            var k;

            ticking = false;

            for (k = 0; k < sections.length; k++) {
                if (sections[k].getBoundingClientRect().top <= line) {
                    current = sections[k].id;
                }
            }

            if (current && current !== active) {
                active = current;
                setActive(current);
            }
        }

        function schedule() {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);

        // run once now, then again once late-loading content has settled,
        // so the initial highlight matches the finished layout
        update();
        window.addEventListener("load", schedule);
    }

    /* ======================================================================
       4. SMOOTH SCROLLING
       ====================================================================== */

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /* Handle for the in-flight scroll tween, so a second click or a manual
       gesture cancels it instead of running two loops against each other. */
    var scrollAnim = null;

    function stopScrollAnim() {
        if (scrollAnim !== null) {
            window.cancelAnimationFrame(scrollAnim);
            scrollAnim = null;
        }
    }

    function scrollToElement(target) {
        stopScrollAnim();

        var start = $window.scrollTop() || docEl.scrollTop;
        var max = Math.max(0, docEl.scrollHeight - window.innerHeight);
        var destination = target.getBoundingClientRect().top + start - headerOffset() + 1;
        var distance;
        var started = null;
        var duration;

        destination = Math.min(Math.max(0, destination), max);

        if (prefersReducedMotion) {
            window.scrollTo(0, destination);
            return;
        }

        distance = destination - start;

        if (Math.abs(distance) < 2) {
            return;
        }

        /* Duration scales with distance. A single fixed 800ms feels lazy on a
           short hop to the next section and rushed on a jump to the footer. */
        duration = Math.min(1100, Math.max(420, Math.round(Math.abs(distance) * 0.55)));

        function step(timestamp) {
            var progress;

            if (started === null) {
                started = timestamp;
            }

            progress = Math.min((timestamp - started) / duration, 1);
            window.scrollTo(0, start + distance * easeInOutCubic(progress));

            if (progress < 1) {
                scrollAnim = window.requestAnimationFrame(step);
            } else {
                scrollAnim = null;
            }
        }

        scrollAnim = window.requestAnimationFrame(step);
    }

    function initSmoothScroll() {
        $document.on("click", 'a[href^="#"]', function (event) {
            var hash = this.getAttribute("href");
            var target;

            if (
                !hash ||
                hash === "#" ||
                $(this).hasClass("fs-menu-toggle") ||
                $(this).hasClass("fs-menu-close") ||
                $(this).hasClass("filter") ||
                this.hasAttribute("data-fs-lightbox")
            ) {
                return;
            }

            target = document.querySelector(hash);

            if (!target) {
                return;
            }

            event.preventDefault();
            closeMobileMenu();
            scrollToElement(target);
        });

        /* Hand control back to the user the moment they touch the page - a
           wheel or touch gesture mid-tween otherwise fights the animation and
           reads as stutter. */
        $window.on("wheel touchstart pointerdown", function () {
            stopScrollAnim();
        }, { passive: true });
    }

    /* ======================================================================
       5. COUNTERS
       ====================================================================== */

    function animateCounter(node) {
        var target = parseFloat(node.getAttribute("data-fs-counter")) || 0;
        var started = null;
        var duration = 1800;

        function step(timestamp) {
            var progress;

            if (started === null) {
                started = timestamp;
            }

            progress = Math.min((timestamp - started) / duration, 1);
            node.textContent = Math.round(target * easeInOutCubic(progress)).toString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                node.textContent = target.toString();
            }
        }

        if (prefersReducedMotion) {
            node.textContent = target.toString();
            return;
        }

        window.requestAnimationFrame(step);
    }

    function initCounters() {
        var counters = document.querySelectorAll("[data-fs-counter]");

        if (!counters.length) {
            return;
        }

        if (!window.IntersectionObserver || prefersReducedMotion) {
            Array.prototype.forEach.call(counters, function (node) {
                node.textContent = (node.getAttribute("data-fs-counter") || "0").toString();
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        Array.prototype.forEach.call(counters, function (node) {
            observer.observe(node);
        });
    }

    /* ======================================================================
       6. PORTFOLIO FILTER + LIGHTBOX
       ----------------------------------------------------------------------
       The theme initialises MixItUp on #portfolio-list-29972074 with
       effects ["fade","scale"] / easing "snap" and the markup carries the
       "mix" category classes. Its own control binding is dead code in the
       reference (there is no filter UI), so the instance is configured once
       here with controls disabled and the buttons are wired by hand.
       ====================================================================== */

    function initPortfolioFilter() {
        var $grid = $("#portfolio-list-29972074");
        var $bar = $("#fs-portfolio-filter");

        if (!$grid.length || !$bar.length || !$.fn.mixItUp) {
            return;
        }

        $grid.mixItUp({
            effects: ["fade", "scale"],
            easing: "snap",
            controls: { enable: false },
            load: { filter: "all" }
        });

        $bar.on("click", "a[data-filter]", function (event) {
            var filter = $(this).attr("data-filter") || "all";

            event.preventDefault();

            $bar.find("a[data-filter]").removeClass("active");
            $(this).addClass("active");

            $grid.mixItUp("filter", filter);
        });
    }

    function initLightbox() {
        var $lightbox = $("#fs-lightbox");
        var $grid = $("#portfolio-list-29972074");
        var $image = $("#fs-lightbox-img");
        var $caption = $("#fs-lightbox-caption");
        var items = ensureArray(SITE.portfolio && SITE.portfolio.items);
        var visible = [];
        var current = 0;
        var lastFocused = null;

        if (!$lightbox.length || !$image.length || !$grid.length || !items.length) {
            return;
        }

        // MixItUp hides filtered-out tiles with display:none, so the lightbox
        // rebuilds its index from whatever is currently on screen.
        function syncVisible() {
            visible = [];
            $grid.find("[data-fs-lightbox]").each(function () {
                if (this.offsetParent !== null) {
                    visible.push(parseInt(this.getAttribute("data-fs-lightbox"), 10) || 0);
                }
            });
        }

        function show(position) {
            var index;
            var item;

            if (!visible.length) {
                syncVisible();
            }

            if (!visible.length) {
                return;
            }

            index = ((position % visible.length) + visible.length) % visible.length;
            item = items[visible[index]];

            if (!item) {
                return;
            }

            current = position;
            $image.removeClass("is-loaded");

            $image.one("load", function () {
                $image.addClass("is-loaded");
            });

            $image.attr({ src: item.image, alt: item.title });
            $caption.text(item.title);

            $lightbox.addClass("is-active");
            body.classList.add("fs-lightbox-open");
            lastFocused = document.activeElement;
        }

        function hide() {
            $lightbox.removeClass("is-active");
            body.classList.remove("fs-lightbox-open");

            if (lastFocused && lastFocused.focus) {
                lastFocused.focus();
            }
        }

        $grid.on("click", "[data-fs-lightbox]", function (event) {
            var target = this;
            var position = 0;

            event.preventDefault();
            syncVisible();

            $grid.find("[data-fs-lightbox]").each(function () {
                if (this === target) {
                    position = visible.indexOf(parseInt(this.getAttribute("data-fs-lightbox"), 10) || 0);
                }
            });

            show(position < 0 ? 0 : position);
        });

        $lightbox.on("click", function (event) {
            if (event.target === $lightbox[0]) {
                hide();
            }
        });

        $lightbox.find(".fs-lightbox-close").on("click", hide);
        $lightbox.find(".fs-lightbox-prev").on("click", function () {
            show(current - 1);
        });
        $lightbox.find(".fs-lightbox-next").on("click", function () {
            show(current + 1);
        });

        $document.on("keydown", function (event) {
            if (!$lightbox.hasClass("is-active")) {
                return;
            }

            if (event.key === "Escape") {
                hide();
            } else if (event.key === "ArrowLeft") {
                show(current - 1);
            } else if (event.key === "ArrowRight") {
                show(current + 1);
            }
        });
    }

    /* ======================================================================
       7. MOBILE FULLSCREEN MENU
       ====================================================================== */

    function isMobileNav() {
        return window.innerWidth < 768;
    }

    function closeMobileMenu() {
        body.classList.remove("fs-menu-open");
        $(".fs-menu-toggle").attr("aria-expanded", "false");
    }

    function initMobileMenu() {
        var $toggles = $(".fs-menu-toggle");
        var $offcanvas = $("#menu-offcanvas");

        if (!$toggles.length) {
            return;
        }

        function open() {
            body.classList.add("fs-menu-open");
            $toggles.attr("aria-expanded", "true");
        }

        $toggles.on("click", function (event) {
            event.preventDefault();

            // contains(), not has() - has() is an alias that is missing from
            // DOMTokenList.prototype in some Chromium builds.
            if (body.classList.contains("fs-menu-open")) {
                closeMobileMenu();
            } else {
                open();
            }
        });

        $(".fs-menu-close").on("click", function (event) {
            event.preventDefault();
            closeMobileMenu();
        });

        // Close after choosing a destination, but only where the overlay menu
        // is the actual navigation.
        $offcanvas.on("click", "a", function () {
            if (isMobileNav()) {
                closeMobileMenu();
            }
        });

        $document.on("keydown", function (event) {
            if (event.key === "Escape" && body.classList.contains("fs-menu-open")) {
                closeMobileMenu();
            }
        });

        $window.on("resize", function () {
            if (!isMobileNav()) {
                closeMobileMenu();
            }
        });
    }

    /* ======================================================================
       8. CONTACT FORM  (client side only - this demo has no backend)
       ====================================================================== */

    function initContactForm() {
        var $form = $("#fs-contact-form");
        var $message = $("#fs-form-msg");

        if (!$form.length || !$message.length) {
            return;
        }

        var rules = {
            name: function (value) {
                return value.trim().length >= 2 ? "" : "Please tell us your name.";
            },
            email: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
                    ? ""
                    : "Please enter a valid email address.";
            },
            subject: function (value) {
                return value.trim().length >= 2 ? "" : "Please add a subject.";
            },
            message: function (value) {
                return value.trim().length >= 10 ? "" : "Please add a little more detail.";
            }
        };

        function setFieldState(field, valid) {
            field.classList.toggle("fs-input-error", !valid);
            field.setAttribute("aria-invalid", valid ? "false" : "true");
        }

        function showMessage(type, text) {
            $message.text(text).attr("class", "wpcf7-response-output fs-form-msg is-visible is-" + type);
        }

        function hideMessage() {
            $message.text("").attr("class", "wpcf7-response-output fs-form-msg");
        }

        $form.on("submit", function (event) {
            var valid = true;
            var firstInvalid = null;
            var name = $form.find('[data-fs-field="name"]');

            event.preventDefault();
            hideMessage();

            $form.find("[data-fs-field]").each(function () {
                var check = rules[this.getAttribute("data-fs-field")];
                var error;

                if (!check) {
                    return;
                }

                error = check(this.value);
                setFieldState(this, error === "");

                if (error !== "") {
                    valid = false;

                    if (!firstInvalid) {
                        firstInvalid = this;
                    }
                }
            });

            if (!valid) {
                showMessage("error", "Please fix the highlighted fields and try again.");

                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            showMessage(
                "success",
                "Thanks " +
                (name.length ? name.val().trim().split(" ")[0] : "") +
                "! Your message is ready to send. This demo form has no backend yet."
            );

            $form[0].reset();
        });

        // Clear the error state as soon as the user starts fixing a field.
        $form.on("input", "[data-fs-field]", function () {
            if (this.classList.contains("fs-input-error")) {
                setFieldState(this, true);
            }
        });
    }

    /* ======================================================================
       9. REVEAL SAFETY NET
       ----------------------------------------------------------------------
       The theme's own reveal system drives every wpb_fadeIn* element:
         .wpb_animate_when_almost_visible            { opacity: 0 }
         .wpb_start_animation                        { opacity: 1 }
       and vc_waypoints() adds .wpb_start_animation .animated at 85% scroll
       depth, which starts the animate.css keyframes. If waypoints never binds
       (missing library, JS error) those elements would stay invisible, so the
       body is flagged and css/custom.css forces them back to opacity 1.
       ====================================================================== */

    function initRevealGuard() {
        if (!$.fn.waypoint) {
            body.classList.add("fs-no-waypoints");
        }
    }

    /* ======================================================================
       10. BOOT
       ----------------------------------------------------------------------
       Placeholders are bound synchronously: js/site-data.js and js/custom.js
       are the last two scripts in <body>, so the DOM is already parsed and the
       copy lands before Revolution Slider reads its caption layers on ready.
       ====================================================================== */

    bindPlaceholders();
    renderFooter();

    function init() {
        initRevealGuard();
        initHeader();
        initScrollSpy();
        initSmoothScroll();
        initCounters();
        initPortfolioFilter();
        initLightbox();
        initMobileMenu();
        initContactForm();

        docEl.classList.add("fs-ready");
    }

    if ($(document).readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})(window, document);
