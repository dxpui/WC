"use strict";
const menu = document.querySelector(".menu");
let subMenu;

function menuMain() {
    $(".menu-main").click(function (e) {
        if (e.target.closest(".menu-item-has-children")) {
            const hasChildren = e.target.closest(".menu-item-has-children");
            showSubMenu(hasChildren); // need discussion
        }
    })
}

// Esc functionality
$(document).on('keydown', function (e) {
    if (e.keyCode === 27) { // ESC
        $('.header .menu>ul>li> button').removeAttr('tabindex')
        $('.menu').removeClass('active');
        $('.sub-menu').removeClass('active');
        $(".sub-menu").removeClass("sub-menu-show");
        $(".fa-angle-down").removeClass("rotate-arrow");
    }
    else if (e.keyCode === 13) {//enter
        menuMain();
    }
});

$(".menu-main").click(function () {
    menuMain();
});

function goBack() {
    $(".go-back").on('click', function (e) {
        e.stopPropagation();
        hideSubMenu();
        $('.header .menu>ul>li> button').removeAttr('tabindex')
    })
}

function menuTrigger() {
    $(".mobile-menu-trigger").click(function () {
        toggleMenu();
    })
}

function closeMenu() {
    $(".mobile-menu-close").click(function () {
        toggleMenu();
        $('.header .menu>ul>li> button').removeAttr('tabindex')
    })
}

function menuOverlay() {
    $(".menu-overlay").click(function () {
        toggleMenu();
    })
}
function toggleMenu() {
    $(".menu").toggleClass("active");
    $(".menu-overlay").toggleClass("active");
    $('.search-form').removeClass("active");
    $("#search-icon i").removeClass("fa-times");
}

function showSubMenu(hasChildren) {
    subMenu = hasChildren.querySelector(".sub-menu");
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle = hasChildren.querySelector("i").parentNode.childNodes[0].textContent;
    $(".menu .mobile-menu-head").addClass("active");
    $(".menu .current-menu-title").text(menuTitle);
    if ($(".menu").hasClass("mobile-menu-head")) {
        $('.header .menu>ul>li> button').attr('tabindex', '-1');
    }
}

function hideSubMenu() {
    subMenu.style.animation = "slideRight 0.5s ease forwards";
    setTimeout(() => {
        subMenu.classList.remove("active");
    }, 300);
    $(".mobile-menu-head").removeClass("active");
    $(".menu .current-menu-title").text("");
    $(".menu .mobile-menu-head").removeClass("active");
}

window.onresize = function () {
    if (this.innerWidth > 991) {
        if ($(".menu").hasClass("active")) {
            toggleMenu();
        }
    }
}

function searchIcon() {
    $('#search-icon').click(function () {
        $('#search-icon i').toggleClass("fa-times");
        $('.search-form').toggleClass("active");
        $(".search-form").hasClass("active") ? $("#globalquery").focus() : $("#query").focus();
        $(".menu").removeClass("fa-times");
        $(".menu").removeClass("active");
        $(".menu-overlay").removeClass("active");
        $(".mobile-nav-toggle").removeClass("btn-close close-bars");
    })
    $('.search-icons').keypress(function (event) {
        var id = event.keyCode;
        if (id == 13) {
            $('#search-icon').trigger('click');
        }
    });
}

$(document).ready(function () {
    $('#query').focus();
});

window.onscroll = () => {
    $(".menu").removeClass("fa-times");

}

//********************Main Menu**********************

$(document).ready(function () {
    // Filter Position
    if (localStorage['ScrollPositionX'] !== "null") {
        $(window).scrollTop(localStorage['ScrollPositionX']);
        localStorage['ScrollPositionX'] = "null";
    }

    $(".menu-item-has-children").click(function () {
        if ($(this).children(".sub-menu").hasClass("sub-menu-show")) {
            $(this).children(".sub-menu").removeClass("sub-menu-show");
            $(this).find(".fa-angle-down").removeClass("rotate-arrow");
        }
        else {
            $(".menu-item-has-children .sub-menu").removeClass("sub-menu-show");
            $(this).children(".sub-menu").addClass("sub-menu-show");
            $(".menu-item-has-children .fa-angle-down").removeClass("rotate-arrow");
            $(this).find(".fa-angle-down").addClass("rotate-arrow");
        }
        $(".search-form").removeClass("active");
        $("#search-icon i").removeClass("fa-times");
    });
    $("#search-icon").click(function () {
        $(".menu-item-has-children .sub-menu").removeClass("sub-menu-show");
        $(".menu-item-has-children .fa-angle-down").removeClass("rotate-arrow");
    })

    $(".mobile-menu-trigger").click(function () {
        $(".mobile-nav-toggle").toggleClass("btn-close close-bars");
        $("body").toggleClass("overflow-hidden");
    });

    if ($(".menu-main").length > 0) {
        menuMain()
    }

    if ($(".go-back").length > 0) {
        goBack()
    }

    if ($(".mobile-menu-trigger").length > 0) {
        menuTrigger()
    }

    if ($(".mobile-menu-close").length > 0) {
        closeMenu()
    }

    if ($(".menu-overlay").length > 0) {
        menuOverlay()
    }

    if ($('#search-icon').length > 0) {
        searchIcon()
    }

    if ($('.searchInput').length > 0) {
        lookupTable()
    }

    // escape to hide submenu
    $(document).on('keydown', function (e) {
        if (e.keyCode === 27 && $('.menu').hasClass('active')) { // ESC
            $('.menu').removeClass('active');
            $(".mobile-nav-toggle").toggleClass("btn-close close-bars");
        }
    });
});
//********************Filter and Sorting**********************

function filterPostion() {
    localStorage["ScrollPositionX"] = $(window).scrollTop();
}

function globalSearch() {
    $("#globalSearch").trigger('submit');
}

function searchForm() {
    filterPostion();
    clearAllFilters();
    $("#searchForm").trigger('submit');
}

//********************Back to top**********************

$(document).ready(function () {
    var scrollTrigger = 4 * $(window).height(); // Calculate the scroll trigger based on four screen lengths

    $(window).scroll(function () {
        if ($(this).scrollTop() > scrollTrigger) {
            $('.back-to-top').addClass('show');
        } else {
            $('.back-to-top').removeClass('show');
        }
    });

    $('.back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
});

$(function () {
    $(window).on('load', function () {
        $('[data-src]').each(function () {
            var $this = $(this),
                src = $(this).data('src');
            $this.attr('src', src);
        });
    });
});

$(document).ready(function () {
    $('.breadcrumb li').each(function () {
        var content = $(this).text();
        var maxLength = 10;
        if (content.length > maxLength) {
            $(this).addClass('ellipsis');
        }
    });
});

//********************Decision tree**********************

$(".tree-question").click(function () {
    var elementId = $(this).attr('id');
    var strItems = elementId.split("-");
    var ansItem = "answer-" + strItems[1];

    $('.tree-answer').hide();

    var isNested = $(this).parent().attr('class');
    if (isNested.indexOf('nested') > -1) {
        $('.tree-answer-section').hide();
        for (var i = strItems[1].length; i > 1; i--) {
            var temp = strItems[1].substring(0, i - 1);
            $('#answer-' + temp).show();
        }
    }

    $('#' + ansItem).show();
    $('#' + ansItem + ' .form-check-input').prop('checked', false);
    return;
});

$(".tree-reset").click(function () {
    $('.tree-answer').hide();
    $('.tree-answer-section').hide();
    $('.form-check-input').prop('checked', false);
});

/* PostCode Checker Block */
$(document).ready(function () {

    //to remove the openAccordions sessionstorage only for webchecker
    if ($("#page-webchecker").length > 0) {
        sessionStorage.removeItem('openAccordions');
        $('.accordion').on('hidden.bs.collapse', function (e) {
            sessionStorage.removeItem('openAccordions');
        });
 
        $('.accordion').on('shown.bs.collapse', function (e) {
            sessionStorage.removeItem('openAccordions');
        });
    }
    
    if (localStorage['ScrollPositionX'] !== "null") {
        $(document).scrollTop(localStorage['ScrollPositionX']);
        localStorage['ScrollPositionX'] = "null";
        $(".back-drop-bg").hide();
        $(".loader").hide();
    }

    if ($("#ListAddressVal").val() != null && $("#ListAddressVal").val() != "") {
        $("#divChangeLocation").show();
        $("#PostCodeSubmit").hide();
        $("#postcode-form").hide();
    }
    else if ($("#divNoResultFoudPostCode").is(':visible')) {
        $("#PostCodeSubmit").hide();
        $("#postcode-form").hide();
    }
    else {
        $("#PostCodeSubmit").show();
        $("#postcode-form").show();
    }
    $(".info-card").each(function () {
        var closestRow = $(this).closest(".row");
        closestRow.addClass("extra-margin");
    });
    $(".info-card.news-center").each(function () {
        var closestRow = $(this).closest(".row");
        closestRow.addClass("news-center-spacing");
    });
});

var postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
$("#PostCodeSubmit").click(function () {
    if ($("#PostCode").val() != "") {
        if (postcodeRegex.test($("#PostCode").val())) {
            $(".back-drop-bg").show();
            $(".loader").show();
            $("#postcode-form").removeClass("form-error");
            $("#divChangeLocation").show();
            localStorage["ScrollPositionX"] = $(this).parents('section:first').offset().top;
            $("#divInvalidPostCodeMessage").hide();
            $("#PostCodeSubmit").hide();
            $("#postcode-form").hide();
            if ($("#ListAddressVal").val() != null && $("#ListAddressVal").val() != "") {
                $('#SelectAddressDrpDn').show();
            }
        }
        else {
            $("#divInvalidPostCodeMessage").show();
            $("#postcode-form").addClass("form-error");
            $("#divInvalidPostCodeMessage").text($("#hdnInvalidPostCodeMessage").val());
            return false;
        }
    }
});

$("#ChangeLocation").click(function () {
    $("#PostCodeSubmit").show();
    $("#postcode-form").show();
    $("#divChangeLocation").hide();
    $("#PostCodeLabel").text('');
    $('#SelectAddressDrpDn').empty();
    $('#SelectAddressDrpDn').hide();
    $("#divInitialContent").hide();
    $("#PostCodeTableResult").hide();
    $("#divClosingContent").hide();
    $("#divNoResultFoudPostCode").hide();
    var uri = window.location.href.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
});

$("#SelectAddressDrpDn").change(function () {
    var selectUrn = $('#SelectAddressDrpDn :selected').val();
    var ListAddressVal = JSON.parse($("#ListAddressVal").val());
    if (selectUrn == "0") {
        $("#divInitialContent").hide();
        $("#PostCodeTableResult").hide();
        $("#divClosingContent").hide();
    }

    $(ListAddressVal).each(function (r, k) {
        if (selectUrn == ListAddressVal[r].UPRN) {
            $("#divInitialContent").show();
            $("#PostCodeTableResult").show();
            $("#divClosingContent").show();
            SetPostCodeTableValues(ListAddressVal[r]);
            return;
        }
    });

});

function SetPostCodeTableValues(ListAddressVal) {
    let netSpeedUnit = $("#hdnInternetSpeedUnit").val();
    $("#StandardDownloadVal").text(ListAddressVal.MaxBbPredictedDown > -1 ? ListAddressVal.MaxBbPredictedDown + " " + netSpeedUnit : '- -');
    $("#StandardUploadVal").text(ListAddressVal.MaxBbPredictedUp > -1 ? ListAddressVal.MaxBbPredictedUp + " " + netSpeedUnit : '- -');
    SetValuesForAvailability(ListAddressVal.MaxBbPredictedUp, ListAddressVal.MaxBbPredictedDown, "StandardAvailableVal");
    $("#SuperfastDownloadVal").text(ListAddressVal.MaxSfbbPredictedDown > -1 ? ListAddressVal.MaxSfbbPredictedDown + " " + netSpeedUnit : '- -');
    $("#SuperfastUploadVal").text(ListAddressVal.MaxSfbbPredictedUp > -1 ? ListAddressVal.MaxSfbbPredictedUp + " " + netSpeedUnit : '- -');
    SetValuesForAvailability(ListAddressVal.MaxSfbbPredictedUp, ListAddressVal.MaxSfbbPredictedDown, "SuperfastAvailableVal");
    console.log(ListAddressVal.MaxUfbbPredictedDown)
    $("#UltrafastDownloadVal").text(ListAddressVal.MaxUfbbPredictedDown > -1 ? ListAddressVal.MaxUfbbPredictedDown + " " + netSpeedUnit : '- -');
    $("#UltrafastUploadVal").text(ListAddressVal.MaxUfbbPredictedUp > -1 ? ListAddressVal.MaxUfbbPredictedUp + " " + netSpeedUnit : '- -');
    SetValuesForAvailability(ListAddressVal.MaxUfbbPredictedUp, ListAddressVal.MaxUfbbPredictedDown, "UltrafastAvailableVal");
}

function SetValuesForAvailability(upload, download, id) {
    if (parseFloat(upload) > -1 || parseFloat(download) > -1) {
        $("#" + id).text($("#hdnAvailableText").val());
    }
    else {
        $("#" + id).text($("#hdnUnAvailableText").val());
    }
}

/* End Of Post Code Checker */

// EXTERNAL LINK IN NEW TAB
$(document).ready(function () {
    $(document.links).not(".rich-text-block a").each(function (r, k) {
        if (k.host !== location.host && k.href.indexOf('javascript:void(0)') < 0) {
            k.target = '_blank';
        }
    });
});


// For remove footer top margin
$(document).ready(function () {
    var lastBlock = $("main .block.latestnewsblock:last");
    var allBlocks = $("main .block");

    if (lastBlock.length > 0 && lastBlock.is(":last-child") && lastBlock.hasClass("block")) {
        $("#footer-subscription").removeClass("mtop-5");
    }
});

// To trim the end 'forward slash' in all media file hyperlinks
$(document).ready(function () {
    $("a").each(function () {
        var href = $(this).attr("href");
        if (href && href.length > 1 && (href.indexOf("/globalassets/") > 0 || href.indexOf("/siteassets/") > 0 || href.indexOf("/contentassets/") > 0) && href.endsWith('/')) {
            $(this).attr("href", href.slice(0, -1));
        }
    });
});

// Add aria-expanded on menu

$(document).ready(function () {
    function updateSubMenuShow() {
        $('li').each(function () {
            var anchor = $(this).find('button');
            var submenuDiv = $(this).find('div.sub-menu-show');

            if (submenuDiv.length) {
                anchor.attr('aria-expanded', 'true');
            } else {
                anchor.attr('aria-expanded', 'false');
            }
        });
    }
    updateSubMenuShow();
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateSubMenuShow();
            }
        });
    });
    observer.observe(document.documentElement, {
        attributes: true,
        subtree: true
    });
});

const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    input.addEventListener('input', function () {
        if (this.value !== '') {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
});

$(document).ready(function () {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            $('.menu > ul > li > button, .search-icons').on('focus', function () {
                if ($(this).is(':focus-visible')) {
                    $('.sub-menu-show').removeClass('sub-menu-show');
                    $(".menu-item-has-children .fa-angle-down").removeClass("rotate-arrow");
                }
            });
        }
    });
});

$(document).ready(function () {

    // for info I icon in result page
    var $icon = $('.popover-trigger');
    // Initialize Bootstrap popover
    $icon.popover();
    // Handle keyboard accessibility
    $icon.on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Prevent scroll on Space
            $(this).trigger('click'); // Simulate click to toggle popover
        }
    });

    // Hide popover on blur (when focus is lost)
    $icon.on('blur', function () {
        $icon.popover('hide');
    });

    if (window.innerWidth <= 768) {
        $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'none');
        $('#collapseButton').hide();
        $(document).on('click', '.accordion-collapse .accordion-body .item-list li', function () {
            var $leftDrawer = $('.postcode-left-outer');
            var $rightContainer = $('.postcode-right-outer');

            if ($leftDrawer.hasClass('collapsed')) {
                $leftDrawer.removeClass('collapsed').addClass('col-md-5');
                $rightContainer.addClass('col-md-7').removeClass('expend');
                $(".postcode-container-left ").css("display", "block");

            } else {
                $('#collapseButton').show();
                $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'block');
                $leftDrawer.addClass('collapsed').removeClass('col-md-5');
                $rightContainer.removeClass('col-md-7').addClass('expend');
                $(".postcode-container-left ").css("display", "none");
                $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'none');
                $('.postcode-right-outer.gray-bg.expend').removeClass('expend');
            }

        });
    }

    $('.content-faq').hide();
    $('#collapseButton').hide();
    /* Panel Collapse Left-Right*/
    $('.collapse-left').on('click', function () {
        if ($('.default-msg:visible').length > 0) {
            return false;
        }
        var $leftDrawer = $('.postcode-left-outer');
        var $rightContainer = $('.postcode-right-outer');

        if ($leftDrawer.hasClass('collapsed')) {
            $leftDrawer.removeClass('collapsed').addClass('col-md-5');
            $rightContainer.addClass('col-md-7').removeClass('expend');
            $(".postcode-container-left ").css("display", "block");

        } else {
            $leftDrawer.addClass('collapsed').removeClass('col-md-5');
            $rightContainer.removeClass('col-md-7').addClass('expend');
            $(".postcode-container-left ").css("display", "none");
        }

        if (window.innerWidth <= 768) {
            $('#collapseButton').hide();
            $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'none');
        }
    });

    const button = $("#collapseButton");
    const icon = button.find("i");
    addAriaAttribute(icon, true);

    $("#collapseButton").click(function () {
        if ($('.default-msg:visible').length > 0) {
            return false;
        }
        if (window.innerWidth > 768) {
            let icon = $(this).find("i");
            addAriaAttribute(icon, false);
        }

        if ($(".postcode-right-outer").hasClass("expend")) {
            $(".search-container").closest(".col-md-12.col-xl-8, .col-md-12.col-xl-7")
                .removeClass("col-xl-8")
                .addClass("col-xl-7");
        } else {
            $(".search-container").closest(".col-md-12.col-xl-7, .col-md-12.col-xl-8")
                .removeClass("col-xl-7")
                .addClass("col-xl-8");
        }

    });

    function addAriaAttribute(icon, onPageLoad) {

        if (onPageLoad) {
            if (icon.hasClass("fa-chevron-left")) {
                icon.attr("aria-label", "minimise mobile checker pane");
            }
        } else {
            if (icon.hasClass("fa-chevron-left")) {
                icon
                    .removeClass("fa-chevron-left")
                    .addClass("fa-chevron-right")
                    .attr("aria-label", "expand mobile checker pane");
            } else {
                icon
                    .removeClass("fa-chevron-right")
                    .addClass("fa-chevron-left")
                    .attr("aria-label", "minimise mobile checker pane");
            }
        }
    }

    $('.faq-back-btn-click').on('click', function () {
        $('#collapseButton').hide();
        $('.postcode-left-outer').removeClass('collapsed').addClass('col-md-5');
        $('.postcode-right-outer').addClass('col-md-7').removeClass('expend');
        $(".postcode-container-left ").css("display", "block");
        $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'none');
    });

    /* accordion */
    $('.item-list li').on('click', function () {
        $('.item-list li').removeClass('active');
        $(this).addClass('active');

        let contentId = $(this).data('content-id');
        $('#collapseButton').show();
        $('.default-msg').hide();
        $('.content').hide();
        $('#' + contentId).show();
    });

    $('.item-list').each(function () {
        var $list = $(this);
        var listItems = $list.find('li');

        if (listItems.length > 4) {
            $list.css({
                'max-height': '200px',
                'overflow-y': 'auto',
                'margin-right': '4px'
            });
        }
    });

    setTimeout(function () {
        $("#loader").addClass("hidden");
    }, 500);

    $("#toggleLoader").click(function () {
        $("#loader").toggleClass("hidden");
    });


    if (!sessionStorage.getItem('modalShown')) {
        $('#language-notification').modal('show');
        sessionStorage.setItem('modalShown', 'true');
    }

    $('#language-notification').on('click', function () {
        $('#language-notification').modal('hide');
    });

    $('#feedback-form-submit').on('click', function () {
        $('#feedback-form-notification').modal('show');
    });

    $('#Enter-postcode').on('click', function () {
        $('#staticBackdrop').modal('show');
    });

    let activePopover = null;
    $(".popover-icon").click(function () {
        if (activePopover) {
            activePopover.popover('hide');
        }
        activePopover = $(this);
        $(this).popover('show');
    });

    $(document).on("click", function (e) {
        if (activePopover && !$(e.target).closest(".popover-icon").length) {
            activePopover.popover('hide');
            activePopover = null;
        }
    });

    $(".accordion-button").on("click", function () {
        //
        let $accordionItem = $(this).closest(".accordion-item.accordion-box");

        if ($accordionItem.hasClass("active")) {
            $accordionItem.css("z-index", "").removeClass("active");
        } else {
            $(".accordion-item.accordion-box").css("z-index", "").removeClass("active"); // Reset others
            $accordionItem.css("z-index", "1055").addClass("active");
        }
    });

    if (window.innerWidth <= 768) {
        if ($('#displayOnMobile').length) {
            $('#landing-page-image-block').show();
        } else {
            $('#landing-page-image-block').remove();
        }
    }
});


// chart script
document.addEventListener("DOMContentLoaded", function () {
    const charts = document.querySelectorAll(".donut-chart");
    charts.forEach(chart => {
        let percentage = chart.getAttribute("data-percentage");
        chart.querySelector(".percent-text").innerText = percentage + "%";

        let totalSegments = 10;
        let value = parseInt(chart.getAttribute("data-percentage")); // Still using data attribute
        let blueSegments = getSegmentsFromValue(value);
        let anglePerSegment = 36; // Each segment is 36 degrees
        let gap = 2;
        let currentAngle = 0;

        let gradientParts = [];

        for (let i = 0; i < totalSegments; i++) {
            let color = i < blueSegments ? "#000045" : "gray";
            gradientParts.push(`${color} ${currentAngle}deg ${currentAngle + (anglePerSegment - gap)}deg`);
            gradientParts.push(`white ${currentAngle + (anglePerSegment - gap)}deg ${currentAngle + anglePerSegment}deg`);
            currentAngle += anglePerSegment;
        }

        chart.style.background = `conic-gradient(${gradientParts.join(", ")})`;
    });

    function getSegmentsFromValue(value) {
        if (value <= 9) return 0;
        if (value <= 19) return 1;
        if (value <= 29) return 2;
        if (value <= 39) return 3;
        if (value <= 49) return 4;
        if (value <= 59) return 5;
        if (value <= 69) return 6;
        if (value <= 79) return 7;
        if (value <= 89) return 8;
        if (value <= 99) return 9;
        return 10;
    }

    const $panels = $('.tab-pane');
    const $tabs = $('.nav-tabs .nav-link');
    $panels.each(function (i) {
        const $focusables = $(this).find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const $last = $focusables.last();
        $last.on('keydown', function (e) {
            if (e.key === 'Tab' && !e.shiftKey && i + 1 < $tabs.length) {
                e.preventDefault();
                activateTab(i + 1);
            }
        });
    });

    $('#afterMapIframe').on('focus', function () {
        activateTab(1); // move to Address tab, index 1
    });

    function activateTab(index) {
        const $targetTab = $tabs.eq(index);
        $targetTab.tab('show');
        $targetTab.focus();
    }

});
// end chart script

/* Tab - Navigation Logic - Start*/

$(document).ready(function () {
    const $tabs = $('.nav-tabs .nav-link');
    const $panels = $('.tab-pane');

    function activateTab(index) {
        const $targetTab = $tabs.eq(index);
        const targetSelector = $targetTab.attr('data-bs-target');
        $tabs.removeClass('active').attr('aria-selected', 'false').attr('tabindex', '-1');
        $panels.removeClass('active show');
        $targetTab.addClass('active').attr('aria-selected', 'true').removeAttr('tabindex');
        $(targetSelector).addClass('active show');
        $targetTab.focus();
    }

    // Handle arrow key navigation
    $tabs.on('keydown', function (e) {
        const index = $tabs.index(this);
        let newIndex = index;
        if (e.key === 'ArrowRight') {
            newIndex = (index + 1) % $tabs.length;
            activateTab(newIndex);
        } else if (e.key === 'ArrowLeft') {
            newIndex = (index - 1 + $tabs.length) % $tabs.length;
            activateTab(newIndex);
        } else if (e.key === 'Tab' && e.shiftKey && index > 0) {
            newIndex = (index - 1 + $tabs.length) % $tabs.length;
            activateTab(newIndex);
        } else {
            return; // Do nothing for other keys
        }
        e.preventDefault();
    });

    // Handle click activation
    $tabs.on('click', function (e) {
        e.preventDefault();
        activateTab($tabs.index(this));
    });

    $('#afterMapIframe').on('focus', function () {
        activateTab(1); // move to Address tab, index 1
    });

    // Handle tabbing out of the last element in a panel
    $panels.each(function (i) {
        const $focusables = $(this).find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const $last = $focusables.last();
        $last.on('keydown', function (e) {
            if (e.key === 'Tab' && !e.shiftKey && i + 1 < $tabs.length) {
                e.preventDefault();
                activateTab(i + 1);
            }
        });
    });
});
/* Tab - Navigation Logic  - End*/

$(document).ready(function () {
    function updateIcons() {
        $('.accordion-address-tab-button').each(function () {
            var target = $($(this).attr('data-bs-target'));
            var icon = $(this).find('.plus-minus-icon');

            if (target.hasClass('show')) {
                icon.text('+');
            } else {
                icon.text('_');
            }
        });
    }

    updateIcons();

    $('.accordion-collapse').on('shown.bs.collapse', function () {
        var icon = $(this).prev().find('.plus-minus-icon');
        icon.text('−');
    });

    // On hide: set icon to plus
    $('.accordion-collapse').on('hidden.bs.collapse', function () {
        var icon = $(this).prev().find('.plus-minus-icon');
        icon.text('+');
    });


    let lastFocusedElement;

    $('#staticBackdrop').on('show.bs.modal', function () {
        // Store the element that triggered the modal
        lastFocusedElement = document.activeElement;
    });

    $('#staticBackdrop').on('hidden.bs.modal', function () {
        // Return focus to the triggering element
        if (lastFocusedElement) {
            $(lastFocusedElement).focus();
        }
    });

    // Set initial ARIA label based on expanded state
    $('.accordion-address-tab-button').each(function () {
        let $btn = $(this);
        let labelText = $.trim($btn.contents().get(0).nodeValue);
        // let labelText = $btn.find('.label').text().trim(); // for backend
        let isExpanded = $btn.attr('aria-expanded') === 'true';

        const $row = $btn.closest('tr');
        const logoAlt = $row.find('td:eq(0) img').attr('aria-label') || '';
        const combined = `${logoAlt}, ${labelText}`;

        $btn.attr('aria-label', combined + ' button ' + (isExpanded ? 'expanded' : 'collapsed'));
    });

    // Listen for any collapse shown or hidden events
    $('.accordion-collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
        let $btn = $(this);
        let $collapse = $(this);
        let $button = $('button[data-bs-target="#' + this.id + '"]');
        let labelText = $.trim($button.contents().get(0).nodeValue);
        // let labelText = $btn.find('.label').text().trim();  // for backend
        let isExpanded = $collapse.hasClass('show');
        $button.attr('aria-expanded', isExpanded.toString());

        const $row = $btn.closest('tr');
        const logoAlt = $row.find('td:eq(0) img').attr('aria-label') || '';
        const combined = `${logoAlt}, ${labelText}`;

        $button.attr('aria-label', combined + ' button ' + (isExpanded ? 'expanded' : 'collapsed'));
    });

    //for Map Tab - drop down select
    const $select = $('.form-select');

    // Update aria-label on change
    $select.on('change', function () {
        const selectedText = $(this).find('option:selected').text();
        $(this).attr('aria-label', `Selected network: ${selectedText}`);
    });

    // Handle expanded/collapsed state (for custom dropdown UI use)
    $select.on('focus', function () {
        $(this).attr('aria-expanded', 'true');
    });

    $select.on('blur', function () {
        $(this).attr('aria-expanded', 'false');
    });

    // Initial label set on page load
    const initialText = $select.find('option:selected').text();
    $select.attr('aria-label', `Selected network: ${initialText}`);
    $select.attr('aria-expanded', 'false'); // default collapsed

    function updateAriaLabel($button) {
        const isExpanded = $button.attr('aria-expanded') === 'true';
        const labelText = $.trim($button.text());
        $button.attr('aria-label', labelText + ' button ' + (isExpanded ? 'expanded' : 'collapsed'));
    }

    // Function to observe changes to aria-expanded
    function observeButton($button) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'aria-expanded') {
                    updateAriaLabel($button);
                }
            });
        });

        observer.observe($button[0], {
            attributes: true,
            attributeFilter: ['aria-expanded']
        });

        // Initialize label on load
        updateAriaLabel($button);
    }

    // Apply observer to each accordion-map-tab-button
    $('.accordion-button.accordion-map-tab-button').each(function () {
        observeButton($(this));
    });

    $('.accordion-collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
        const targetId = $(this).attr('id');
        const $button = $(`button[data-bs-target="#${targetId}"]`);
        updateAriaLabel($button); // Call your existing function
    });

});

$(document).ready(function () {
    const $allContentBoxes = $('.scrollable-content');
    const $leftContainer = $('.postcode-container-left'); // container with left links
    let $currentLink = null;

    function getFocusableElements($container) {
      return $container
        .find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
        .filter(':visible:not([disabled])');
    }

    function showContent(contentId) {
      $allContentBoxes.hide();
      const $target = $('#' + contentId);
      $target.show();
      $target.attr('tabindex', '-1').focus();

      const focusables = getFocusableElements($target);

      // Remove previous listeners
      $target.off('keydown');
      focusables.off('keydown');

      if (focusables.length > 0) {
        const $first = $(focusables[0]);
        const $last = $(focusables[focusables.length - 1]);

        // Shift+Tab on first focusable = back to sidebar link
        $first.on('keydown', function (e) {
          if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            $currentLink?.focus();
          }
        });

        // Tab on last focusable = go to next focusable on left side
        $last.on('keydown', function (e) {
          if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            focusNextFocusableOnLeft();
          }
        });

      } else {
        // No focusables – handle Tab on container itself
        $target.on('keydown', function (e) {
          if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
              $currentLink?.focus();
            } else {
              focusNextFocusableOnLeft();
            }
          }
        });
      }
    }

    function focusNextFocusableOnLeft() {
      // Get all focusable elements on the left container
      const focusables = getFocusableElements($leftContainer);

      // Find index of current link in that list
      const currentIndex = focusables.index($currentLink);

      // Focus next focusable after current index
      const $nextFocusable = focusables.eq(currentIndex + 1);

      if ($nextFocusable.length) {
        // If next focusable is inside collapsed accordion, expand it
        const $parentCollapse = $nextFocusable.closest('.accordion-collapse');
        if ($parentCollapse.length && !$parentCollapse.hasClass('show')) {
          const collapseId = $parentCollapse.attr('id');
          const $accordionButton = $(`.accordion-button[data-bs-target="#${collapseId}"]`);
          $accordionButton[0]?.click();
          // Wait for expand animation before focus
          setTimeout(() => {
            $nextFocusable[0]?.focus();
            $currentLink = $nextFocusable;
          }, 100);
        } else {
          $nextFocusable[0]?.focus();
          $currentLink = $nextFocusable;
        }
      } else {
        // No more focusable left, optionally blur or do nothing
        $currentLink?.blur();
      }
    }

    $('.content-link').on('click', function (e) {
      e.preventDefault();
      $currentLink = $(this);
      const contentId = $currentLink.parent().data('content-id');
      if (contentId) {
        showContent(contentId);
      }
    });
  });

//   $(document).ready(function () {
//   var $listItems = $(".item-list li");
//   var itemsToShow = 3;
//   var expanded = false;
//   console.log($listItems.length)
//   $listItems.slice(0, itemsToShow).addClass("visible");

//   $(".toggle-link").on("click", function () {
//     if (!expanded) {
//       $listItems.addClass("visible");
//       $(this).text("Show less");
//     } else {
//       $listItems.removeClass("visible").slice(0, itemsToShow).addClass("visible");
//       $(this).text("Load more");
//     }
//     expanded = !expanded;
//   });
// });

/* Load More Button feature realted JS - start */
var itemsToShow = 3;

$(".accordion-body").each(function () {
  var $body = $(this);
  var $listItems = $body.find(".item-list li");
  var $toggle = $body.find(".toggle-link");
  var expanded = false;

   // If more than itemsToShow, hide extra items initially
  if ($listItems.length > itemsToShow) {
    $listItems.slice(0, itemsToShow).addClass("visible");
  } else {
    $listItems.addClass("visible"); // Show all
    $toggle.hide(); // Hide "Load more"
  }

  $toggle.on("click", function (e) {
    e.preventDefault();
    if (!expanded) {
      $listItems.addClass("visible");
      $(this).text("Show less");
    } else {
      $listItems.removeClass("visible").slice(0, itemsToShow).addClass("visible");
      $(this).text("Load more");
    }
    expanded = !expanded;
  });

  // Reset when accordion collapses
  $body.closest(".accordion-collapse").on("hidden.bs.collapse", function () {
    $listItems.removeClass("visible").slice(0, itemsToShow).addClass("visible");
    $toggle.text("Load more");
    expanded = false;
  });
});

/* Load More Button feature realted css - end */
