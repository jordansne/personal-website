/*
 * animations.js - jordansne.com
 *
 * Author: Jordan Sne
 * License: MIT
 */

const PAGE_SCROLL_EVENTS = 'scrollend mousedown mousewheel wheel keyup touchmove DOMMouseScroll resize';

class SectionAnimation {

    constructor(contentID) {
        this.contentID = '#' + contentID;
        this.contentLinkID = this.contentID + '_link';

        $(this.contentID).css("opacity", 0);
        this.addScrollEvent();
        this.registerFadeEvent();
    }

    /* Registers navbar buttons to their respective scroll events. */
    addScrollEvent() {
        const page = $('html, body');
        const stopFunction = function() { page.stop(); };

        $(this.contentLinkID).click(() => {
            page.animate({
                scrollTop: $(this.contentID).offset().top - 75
            }, 750, () => {
                page.off(PAGE_SCROLL_EVENTS, stopFunction);
                page.trigger('clicklink');
            });

            page.one(PAGE_SCROLL_EVENTS, stopFunction);
        });
    }

    /* Show content immediately if in view or register to an event handler if not. */
    registerFadeEvent() {
        const page = $('html, body');

        $(this.contentID).one('show', () => {
            $(this.contentID).animate({
                opacity: 1
            }, 400);
        });

        page.on(PAGE_SCROLL_EVENTS + ' clicklink', () => {
            if (this.isInView(this.contentID)) {
                $(this.contentID).trigger('show');
            }
        });
    }

    /* Returns true if div content in view of browser. */
    isInView() {
        const contentTop = $(this.contentID).offset().top;
        const contentBottom = contentTop + $(this.contentID).height();

        const viewTop = $(window).scrollTop();
        const viewBottom = viewTop + $(window).height();

        return (viewTop + 150 < contentBottom && viewBottom - 150 > contentTop);
    }
}

/* Displays email redudantly to avoid spam. */
function setEmail() {
    const domain = "g" + "mail";
    const name = "jordan" + "sne";
    const suffix = ".c" + "om";

    const emailDiv = document.getElementById("email");

    for (let i = 0; i < emailDiv.childNodes.length; i++) {
        const child = emailDiv.childNodes[i];
        if (child.nodeName === 'A') {
            child.setAttribute("href", "mailto:" + name + "@" + domain + suffix);

            for (let j = 0; j < child.childNodes.length; j++) {
                const innerChild = child.childNodes[j];
                if (innerChild.nodeName === 'H3') {
                    innerChild.innerHTML = name + "@" + domain + suffix;
                }
            }
        }
    }
}

$(document).ready(function() {
    setEmail();

    const sectionAnimations = [];

    // Add all sections to the animation array
    const sections = document.getElementsByTagName("section");
    for (let i = 0; i < sections.length; i++) {
        sectionAnimations.push(new SectionAnimation(sections[i].id));
    }

    // Ensure page is at top before starting show animations (in case of refresh)
    $('html, body').animate({
        scrollTop: 0
    }, 300);

    // Fade in "Jordan Sne |", and fade in arrow when finished.
    $('#header_animate, #arrow').css("opacity", 0);
    $('#header_animate').animate({
        opacity: 1
    }, 1750, function() {
        $('#arrow').animate({
            opacity: 1
        }, 1000);
    });

    // Animate in "Software Developer"
    $('#header_sub_animate').css("left", '100px');
    $('#header_sub_animate').css("opacity", 0);
    $('#header_sub_animate').animate({
        left: '0px',
        opacity: 1
    }, 1500);
});
