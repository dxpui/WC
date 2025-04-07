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
            }

        });
    }

    $('.content-faq').hide();
    /* Panel Collapse Left-Right*/
    $('.collapse-left').on('click', function () {
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

    $("#collapseButton").click(function () {
        if (window.innerWidth > 768) {
            let icon = $(this).find("i");
            if (icon.hasClass("fa-chevron-left")) {
                icon.removeClass("fa-chevron-left").addClass("fa-chevron-right");
            } else {
                icon.removeClass("fa-chevron-right").addClass("fa-chevron-left");
            }
        }
    });

    /* accordion */
    $('.item-list li').on('click', function () {
        $('.item-list li').removeClass('active');
        $(this).addClass('active');

        let contentId = $(this).data('content-id');
        $('.default-msg').hide();
        $('.content').hide();
        $('#' + contentId).show();
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


    // // popover display on mouse over//
    $('.popover-trigger').popover({
        trigger: 'manual'
    });

    $('.popover-trigger').on('mouseenter', function () {
        $(this).popover('show');
    });

    $('.popover-trigger').on('mouseleave', function () {
        $(this).popover('hide');
    });

});


// chart script
document.addEventListener("DOMContentLoaded", function () {
    const charts = document.querySelectorAll(".donut-chart");

    charts.forEach(chart => {
        let percentage = chart.getAttribute("data-percentage");
        chart.querySelector(".percent-text").innerText = percentage + "%";

        let totalSegments = 10;
        let blueSegments = Math.round((percentage / 100) * totalSegments);
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
});

// end chart script
