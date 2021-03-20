/*
 * animations.js - jordansne.com
 * Author: Jordan Sne
 */

const $ = require('jquery');

$(document).ready(() => {
    document.getElementById('copyright_year').innerText = new Date().getFullYear();

    const page = $('html, body');

    // Ensure page is at top before starting show animations (in case of refresh)
    if (page.scrollTop() !== 0) {
        page.animate({
            scrollTop: 0
        }, 300, () => {
            loadAnimations();
        });
    } else {
        loadAnimations();
    }
});

function loadAnimations() {
    const page = $('html, body');

    // Add all sections to the animation array
    for (const section of document.getElementsByTagName("section")) {
        const selector = `#${section.id}`;

        // Register scroll link
        $(`${selector}_link`).click(() => {
            page.animate({
                scrollTop: $(selector).offset().top - 75
            }, 750);
        });

        // Set initial opacity
        $(selector).css('opacity', '0');

        // Register fade in animation
        $(window).scroll(() => {
            const contentPosTop = $(selector).offset().top;
            const contentPosBottom = contentPosTop + $(selector).height();

            const viewPosTop = $(window).scrollTop();
            const viewPosBottom = viewPosTop + $(window).height();

            if (viewPosBottom > contentPosTop + 200 && viewPosTop < contentPosBottom - 200) {
                $(selector).animate({ opacity: 1 }, 400);
            }
        });
    }

    // Fade in "Jordan Sne |", and fade in arrow when finished.
    $('.header_animate, #arrow').css("opacity", 0);
    $('.header_animate').animate({
        opacity: 1
    }, 1750, () => {
        $('#arrow').animate({
            opacity: 1
        }, 1000);
    });

    // Animate in "Software Developer"
    $('#header_sub_animate').css("left", '100px');
    $('#header_sub_animate').css("opacity", 0);
    $('#header_sub_animate').animate({
        left: 0,
        opacity: 1
    }, 1500);
}
