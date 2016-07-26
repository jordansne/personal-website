$(document).ready(function() {
    registerScrollEvents();
});

function registerScrollEvents() {
    var page = $('html, body');

    // Events for click links in the nav bar
    $('#top_link').click(function() {
        page.animate({
            scrollTop: 0
        }, 750, function() {
            page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
        });

        page.on("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll", function() {
            page.stop();
        });
    });

    $('#about_link').click(function() {
        page.animate({
            scrollTop: $('#about').offset().top - 145
        }, 750, function() {
            page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
        });

        page.on("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll", function() {
            page.stop();
        });
    });

    $('#projects_link').click(function() {
        page.animate({
            scrollTop: $('#projects').offset().top - 145
        }, 750, function() {
            page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
        });

        page.on("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll", function() {
            page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
        });
    });

    $('#contact_link').click(function() {
        page.animate({
            scrollTop: $('#contact').offset().top - 145
        }, 750, function() {
            page.off("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll");
        });

        page.on("scroll mousedown mousewheel wheel keyup touchmove DOMMouseScroll", function() {
            page.stop();
        });
    });

}
