/*
 * animations.js - jordansne.com
 *
 * Author: Jordan Sne
 * License: MIT
 */

/* jshint esversion: 6 */

class Content {

    constructor(contentID, nextContent) {
        this.contentID = '#' + contentID;
        this.contentLinkID = this.contentID + '_link';
        this.nextContent = nextContent;

        $(this.contentID).css("opacity", 0);
        this.addScrollEvent();
    }

    /* Registers navbar buttons to their respective scroll events. */
    addScrollEvent() {
        const self = this;
        const page = $('html, body');

        const stopFunction = function() { page.stop(); };

        $(self.contentLinkID).click(function() {
            page.animate({
                scrollTop: $(self.contentID).offset().top - 50
            }, 750, function() {
                page.off('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll resize', stopFunction);
                page.trigger('clicklink');
            });

            page.one('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll resize', stopFunction);
        });
    }

    /* Show content immediately if in view or register to an event handler if not. */
    readyToShow() {
        const self = this;
        const page = $('html, body');

        const animate = function() {
            $(self.contentID).animate({
                opacity: 1
            }, 400, function() {
                if (self.nextContent !== null) {
                    self.nextContent.readyToShow();
                }
            });
        };

        if (self.isInView(self.contentID)) {
            animate();
        } else {
            $(self.contentID).one('show', animate);
            self.addShowEvent();
        }
    }

    /* Adds event handler for scrolling to check for in-view content. */
    addShowEvent() {
        const self = this;
        const page = $('html, body');

        page.on('ready scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll resize clicklink', function() {
            if (self.isInView(self.contentID)) {
                $(self.contentID).trigger('show');
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

$(document).ready(function() {
    const page = $('html, body');

    const contactContent = new Content('contact', null);
    const projectsContent = new Content('projects', contactContent);
    const aboutContent = new Content('about', projectsContent);

    // Ensure page is at top before starting show animations
    page.animate({
        scrollTop: 0
    }, 300, function() {
        aboutContent.readyToShow();
    });

    // Fade in "Jordan Sne |"
    $('#header_animate').css("opacity", 0);
    $('#header_animate').animate({
        opacity: 1
    }, 1750);

    // Animate in "Software Developer"
    $('#header_sub_animate').css("left", '100px');
    $('#header_sub_animate').css("opacity", 0);
    $('#header_sub_animate').animate({
        left: '0px',
        opacity: 1
    }, 1500);
});
