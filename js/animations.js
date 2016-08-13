class Content {

    constructor(contentID) {
        this.contentID = '#' + contentID;
        this.contentLinkID = this.contentID + '_link';
    }

    registerScroll() {
        const page = $('html, body');
        const self = this;

        $(self.contentLinkID).click(function() {
            page.animate({
                scrollTop: $(self.contentID).offset().top - 145
            }, 750, function() {
                page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
            });

            page.on("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll", function() {
                page.stop();
            });
        });
    }

}

$(document).ready(function() {
    const headerContent = new Content('top')
    const aboutContent = new Content('about')
    const projectsContent = new Content('projects');
    const contactContent = new Content('contact');

    headerContent.registerScroll();
    aboutContent.registerScroll();
    projectsContent.registerScroll();
    contactContent.registerScroll();
});
