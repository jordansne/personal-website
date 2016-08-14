/*
 * animations.js
 *
 * @author Jordan Sne
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
                scrollTop: $(self.contentID).offset().top - 145
            }, 750, function() {
                page.off('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll', stopFunction);
                page.trigger('clicklink');
            });

            page.one('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll', stopFunction);
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

        page.on('ready scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll clicklink', function() {
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

        // TODO Adjust for top header offset.
        return (viewTop + 75 < contentBottom && viewBottom - 75 > contentTop);
    }
}

$(document).ready(function() {
    const page = $('html, body');

    // Click header to scroll to top
    $('#top_link').click(function() {
        const stopFunction = function() { page.stop(); };

        page.animate({
            scrollTop: 0
        }, 750, function() {
            page.off('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll', stopFunction);
        });

        page.one('scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll', stopFunction);
    });

    const contactContent = new Content('contact', null);
    const projectsContent = new Content('projects', contactContent);
    const aboutContent = new Content('about', projectsContent);
    const activeContent = new Content('active', aboutContent);

    // Ensure page is at top before starting show animations
    page.animate({
        scrollTop: 0
    }, 300, function() {
        activeContent.readyToShow();
    });
});
