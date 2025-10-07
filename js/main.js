$(document).ready(function () {
    
    $("#errorText").hide();
    $("#invalidPostCode").hide();
    $("#currentlocationerror").hide();
    $("#postcodeNotFound").hide();
    $("#postcodeApiError").hide();
    $("#collapseButton").hide();
    $("#currentlocation_norespose_error").hide();

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

    var coverageResponse;

    let storedPostcode = sessionStorage.getItem('postcode');
    let storedUprn = sessionStorage.getItem('uprn');
    let isAutoLoad = false;
    // Auto-fill on page load using stored data
          
    $("#postcode").val(storedPostcode);
    if (storedPostcode) {
        $(document).ready(function () {
            if (storedUprn) {
                coverageResponse = JSON.parse(sessionStorage.getItem("coverageResponse"));
                updateAddressDropdown(coverageResponse);
                $('#addressDropdown').val(storedUprn).trigger('change');
                LoadResults();
                addressBtnOkClickHandler();
                const networkDropdown = document.getElementById('mno_select');
                if (networkDropdown) {
                    networkDropdown.value = sessionStorage.getItem('networkChange');
                    onNetworkChange(sessionStorage.getItem('networkChange'));
                }
                //$("#btnOk").trigger('click');
            }
        });
    }

    // Prevent modal from showing only during auto-load
    $('#staticBackdrop').on('show.bs.modal', function (e) {
        if (isAutoLoad) {
            e.preventDefault();
            isAutoLoad = false; // Reset after first use
        }
    });

    $("#feedbackform-id").click(function (e) {
        e.preventDefault();
        let postcode = sessionStorage.getItem('postcode');
        let uprn = sessionStorage.getItem('uprn');
        let apiUrl = $("#feedbackform-id").attr("href");
        let url = new URL(apiUrl, window.location.origin);
        url.searchParams.append("postcode", postcode);
        url.searchParams.append("uprn", uprn);
        window.location.href = url.toString();
    });

    $('#operator select').on('change', function (e) {
        e.preventDefault();
        if ($("#operator select").val()) {
            $("#operator span.Form__Element__ValidationError").addClass("hidden").html("");
            if ($("#coverage select").val()) {
                $("#coverage span.Form__Element__ValidationError").addClass("hidden").html("");
            }
        }
    });

    $('#issue select').on('change', function (e) {
        e.preventDefault();
        if ($("#issue select").val()) {
            $("#issue span.Form__Element__ValidationError").addClass("hidden").html("");
        }
    });

    $("#Enter-postcode").click(function (e) {
        e.preventDefault();
        $("#errorText").hide();
        $("#invalidPostCode").hide();
        $("#currentlocationerror").hide();
        $("#postcodeNotFound").hide();
        $("#postcodeApiError").hide();
        $("#currentlocation_norespose_error").hide();

        let postcodeValue = $("#postcode").val().trim().replace(/\s+/g, '').toUpperCase();
        $("#postcode").val(postcodeValue);
        if (!sessionStorage.getItem('postcode')) {
            sessionStorage.setItem("postcode", postcodeValue);
        }
        else {
            sessionStorage.setItem("postcode", postcodeValue);
        }

        // If no postcode entered, show error message in modal
        if (postcodeValue.length === 0) {
            $("#errorText").show();
            return;
        }

        if (!postcodeValue.match(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i)) {
            $("#invalidPostCode").show();
            return;
        }

        grecaptcha.ready(function () {
            const recaptchaSiteKey = $("#CurrentContent_MainContentArea_CurrentContent_RecaptchaSiteKey").val()
            grecaptcha.execute(recaptchaSiteKey, { action: 'submit' }).then(function (token) {
                let hostName = window.location.hostname;
                let port = window.location.port ? `:${window.location.port}` : "";
                let apiUrl = `https://${hostName}${port}/api/MobileCoverageChecker`;
                let contentId = $("#CurrentContent_MainContentArea_ContentLink_ID").val()

                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: apiUrl,
                    method: "POST",
                    data: JSON.stringify({
                        "recaptchaToken": token,
                        "postcode": postcodeValue,
                        "contentId": contentId
                    }),
                    success: function (response) {
                        if (response?.availability && response?.availability.length > 0) {

                            $(".postcode-number").text(postcodeValue);

                            // Call function to update the dropdowns
                            updateAddressDropdown(response);
                            var addressLevelDropdown = document.querySelector('.modal .form-select');
                            $('#staticBackdrop').modal('show');
                            //addressLevelDropdown.dispatchEvent(new Event('change'));
                            onLoadAPILoad(response);
                            coverageResponse = response;
                            sessionStorage.setItem("coverageResponse", JSON.stringify(coverageResponse))

                        } else {
                            $('#staticBackdrop').modal('hide');
                            $("#postcodeNotFound").show();
                        }
                    },
                    error: function () {
                        $('#staticBackdrop').modal('hide');
                        $("#postcodeApiError").show();
                    }
                });
            });
        });
    });

    $("#postcode").keydown(function (event) {
        $("#errorText").hide();
        $("#invalidPostCode").hide();
        if (event.keyCode === 8 || event.keyCode === 46) {
            $("#errorText").hide();
            $("#invalidPostCode").hide();
            $("#postcodeNotFound").hide();
            $("#postcodeApiError").hide();
        }
        if (event.keyCode === 13) {
            event.preventDefault();

            $("#Enter-postcode").click();
        }
    });

    $("#returnButton").click(function (e) {
        e.preventDefault();
        $('#staticBackdrop').modal('hide');
    });

    function LoadResults()
    {
        $('#errorMsg').hide();
        var sel = $('#staticBackdrop .form-select').val();
        if (sel == 0) {
            $('#errorMsg').show();
            return false;
        }

        var selval;

        if (!sessionStorage.getItem('uprn')) {
            //sel = $('#staticBackdrop .form-select').val();
            sessionStorage.setItem("uprn", sel);
        }
        else {
            // sessionStorage.setItem("uprn", sel);
            sel = sessionStorage.getItem('uprn');
        }

        if ($(".page-webchecker-container").length > 0) {
            OkButtonClick();   
        }
        var tabTrigger = new bootstrap.Tab($('#map-tab')[0]);
        tabTrigger.show();
        $('#landing-right-div').hide();
        $('#landing-page-image-block').hide();
        $('#networkPerformance').show();
        $('#mobileCoverage').show();
        $("#collapseButton").show();
        $('#landing-right').show();
        if ($("#postcode").val().trim() != '') {

            $("#lbl-searchbox").addClass("col-xl-8");
            $("#postcode-div").addClass("col-xl-8");
        }

        $("#postcode-div").removeClass("col-lg-6").addClass("col-lg-8");
        $("#right-side-div").removeClass("col-lg-6").addClass("col-lg-4");
        $("#right-side-div").removeClass("px-0");
        $("#landing-right").removeClass("p-0");
        $("#right-side-div").removeClass("gray-bg");
        //$("#lbl-searchbox").addClass("col-xl-8");
        //$("#postcode-div").addClass("col-xl-8");


        if (!sessionStorage.getItem('modalShown')) {
            $('#disclaimer-modal').modal('show');
            sessionStorage.setItem('modalShown', 'true');
        }

        $('#disclaimer-modal').on('click', function () {
            $('#disclaimer-modal').modal('hide');
        });
        //call to API 2
        let hostName = window.location.hostname;
        let port = window.location.port ? `:${window.location.port}` : "";
        var districtCode = sessionStorage.getItem("district_code"); // "SE19";
        let apiUrl = `https://${hostName}${port}/api/MobileCoverageChecker/GetCoverageByDistrictCode/` + districtCode;
        let contentId = $("#CurrentContent_MainContentArea_ContentLink_ID").val();
        var coveragelist;

        var response;
        if (JSON.parse(sessionStorage.getItem("performanceResponse")) && sel == storedUprn) {
            //page is refreshed
            response = JSON.parse(sessionStorage.getItem("performanceResponse"));
            coverageResponseMapping(response);
        }
        //if user entered data
        else {

            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: apiUrl,
                method: "POST",
                data: JSON.stringify({
                    "postcode": districtCode,
                    "contentId": contentId
                }),

                success: function (response) {
                    sessionStorage.setItem("performanceResponse", JSON.stringify(response))

                    coverageResponseMapping(response);

                },
                error: function () {
                    $("#data-percentage1").attr("data-percentage", -1);
                    $("#data-percentage2").attr("data-percentage", -1);
                    $("#data-percentage3").attr("data-percentage", -1);
                    $("#data-percentage4").attr("data-percentage", -1);
                    // updating via JS (AJAX)
                    updatePerformanceInfo();
                    renderDonutCharts();
                    $('#staticBackdrop').modal('hide');
                    $("#postcodeApiError").show();
                    $("#updatedPerformanceInfoWithoutData").removeClass('hidden');
                    $("#updatedPerformanceInfo").addClass('hidden');
                }
            });
        }
    }

    $("#btnOk").click(function (e) {
        e.preventDefault();
        LoadResults();
        const networkDropdown = document.getElementById('mno_select');
        networkDropdown.value = "0"; 
        onNetworkChange(networkDropdown.value);
    });

    $("#lbl-searchbox .col-xl-8").removeClass("col-xl-8");
    $("#postcode-div .col-xl-8").removeClass("col-xl-8");

    $("#addressDropdown").on("change", function () {
        const selectedValue = $(this).val();
        sessionStorage.setItem("uprn", selectedValue);
    });
    function valueIsMinusOne(val) {
        return Number(val) === -1;
    }

    function coverageResponseMapping(response) {
        //var naText = $("#hdnNaText").val();
        
        //if (response?.Error) {
        //    $("#postal-district-tr td:gt(0)").html(naText);
        //    $("#district-table-tr td:gt(0)").html(naText);
        //} else {
        //    // Filter properties whose keys start with mc_Od_ or mc_Id_
        //    const hasMinusOne = Object.entries(response).some(([key, value]) => {
        //        return (key.startsWith("mc_Od_") || key.startsWith("mc_Id_")) && valueIsMinusOne(value);
        //    });

        //    if (hasMinusOne) {
        //        $("#postal-district-tr td:gt(0)").html(naText);
        //        $("#district-table-tr td:gt(0)").html(naText);
        //    } else {
        //        $("#postal-district-tr td:nth-child(2)").html(response.mc_Od_EE + "%");
        //        $("#postal-district-tr td:nth-child(3)").html(response.mc_Od_O2 + "%");
        //        $("#postal-district-tr td:nth-child(4)").html(response.mc_Od_TH + "%");
        //        $("#postal-district-tr td:nth-child(5)").html(response.mc_Od_VO + "%");

        //        $("#district-table-tr td:nth-child(2)").html(response.mc_Id_EE + "%");
        //        $("#district-table-tr td:nth-child(3)").html(response.mc_Id_O2 + "%");
        //        $("#district-table-tr td:nth-child(4)").html(response.mc_Id_TH + "%");
        //        $("#district-table-tr td:nth-child(5)").html(response.mc_Id_VO + "%");
        //    }
        //}

        if (response?.sortedDict) {

            var count = 1;
            var mno = 1;
            var voaltText = $("#hdnVOAltText").val();
            var eealtText = $("#hdnEEAltText").val();
            var thaltText = $("#hdnTHAltText").val();
            var o2altText = $("#hdnO2AltText").val();

            var vosrc = $("#hdnimg-mc_VO").val();
            var eesrc = $("#hdnimg-mc_EE").val();
            var tshrc = $("#hdnimg-mc_TH").val();
            var osrc = $("#hdnimg-mc_O2").val();

            $.each(response.sortedDict, function (index, value) {

                var perfval = value;
                var perfkey = index;
                var perfcom = index + value;

                if (perfval == -1) {
                    $("#data-percentage1").attr("data-percentage", -1);
                    $("#data-percentage2").attr("data-percentage", -1);
                    $("#data-percentage3").attr("data-percentage", -1);
                    $("#data-percentage4").attr("data-percentage", -1);

                    $("#img1").attr("src", eesrc);
                    $("#img2").attr("src", osrc);
                    $("#img3").attr("src", tshrc);
                    $("#img4").attr("src", vosrc);

                    $("#img1").attr("alt", eealtText);
                    $("#img2").attr("alt", o2altText);
                    $("#img3").attr("alt", thaltText);
                    $("#img4").attr("alt", voaltText);
                    mno = 3;
                    $("#updatedPerformanceInfoWithoutData").removeClass('hidden');
                    $("#updatedPerformanceInfo").addClass('hidden');
                    return false;
                }
                else {
                    $("#updatedPerformanceInfo").removeClass('hidden');
                    $("#updatedPerformanceInfoWithoutData").addClass('hidden');
                }

                if (count == 1) {

                    $("#perf1").text(perfval);
                    $("#data-percentage1").attr("data-percentage", perfval)
                    //alert(perfkey);
                    if (perfkey == "PF_d_VO") {
                        $("#img1").attr("src", vosrc);
                        $("#img1").attr("alt", voaltText);
                        mno = 1;
                    }
                    if (perfkey == "PF_d_EE") {
                        $("#img1").attr("src", eesrc);
                        $("#img1").attr("alt", eealtText);
                        mno = 3;
                    }
                    if (perfkey == "PF_d_TH") {
                        $("#img1").attr("src", tshrc);
                        $("#img1").attr("alt", thaltText);
                        mno = 4;
                    }
                    if (perfkey == "PF_d_O2") {
                        $("#img1").attr("src", osrc);
                        $("#img1").attr("alt", o2altText);
                        mno = 2;
                    }

                }
                if (count == 2) {
                    $("#perf2").text(perfval);
                    $("#data-percentage2").attr("data-percentage", perfval)
                    if (perfkey == "PF_d_VO") {
                        $("#img2").attr("src", vosrc);
                        $("#img2").attr('alt', voaltText);
                    }
                    if (perfkey == "PF_d_EE") {
                        $("#img2").attr("src", eesrc);
                        $("#img2").attr("alt", eealtText);
                    }
                    if (perfkey == "PF_d_TH") {
                        $("#img2").attr("src", tshrc);
                        $("#img2").attr("alt", thaltText);
                    }
                    if (perfkey == "PF_d_O2") {
                        $("#img2").attr("src", osrc);
                        $("#img2").attr("alt", o2altText);
                    }
                }
                if (count == 3) {
                    $("#perf3").text(perfval);
                    $("#data-percentage3").attr("data-percentage", perfval)
                    if (perfkey == "PF_d_VO") {
                        $("#img3").attr("src", vosrc);
                        $("#img3").attr("alt", voaltText);
                    }
                    if (perfkey == "PF_d_EE") {
                        $("#img3").attr("src", eesrc);
                        $("#img3").attr("alt", eealtText);
                    }
                    if (perfkey == "PF_d_TH") {
                        $("#img3").attr("src", tshrc);
                        $("#img3").attr("alt", thaltText);
                    }
                    if (perfkey == "PF_d_O2") {
                        $("#img3").attr("src", osrc);
                        $("#img3").attr("alt", o2altText);
                    }
                }
                if (count == 4) {
                    $("#perf4").text(perfval);
                    $("#data-percentage4").attr("data-percentage", perfval)
                    if (perfkey == "PF_d_VO") {
                        $("#img4").attr("src", vosrc);
                        $("#img4").attr("alt", voaltText);
                    }
                    if (perfkey == "PF_d_EE") {
                        $("#img4").attr("src", eesrc);
                        $("#img4").attr("alt", eealtText);
                    }
                    if (perfkey == "PF_d_TH") {
                        $("#img4").attr("src", tshrc);
                        $("#img4").attr("alt", thaltText);
                    }
                    if (perfkey == "PF_d_O2") {
                        $("#img4").attr("src", osrc);
                        $("#img4").attr("alt", o2altText);
                    }
                }
                count++;
            });

            // updating via JS (AJAX)
            renderDonutCharts();
            updatePerformanceInfo();

        } else {
            $("#data-percentage1").attr("data-percentage", -1);
            $("#data-percentage2").attr("data-percentage", -1);
            $("#data-percentage3").attr("data-percentage", -1);
            $("#data-percentage4").attr("data-percentage", -1);
            updatePerformanceInfo();
            renderDonutCharts();
            $("#updatedPerformanceInfoWithoutData").removeClass('hidden');
            $("#updatedPerformanceInfo").addClass('hidden');

        }
    }

    if (window.innerWidth <= 768) {
        if ($('#displayOnMobile').length) {
            $('#landing-page-image-block').show();
        } else {
            $('#landing-page-image-block').remove();
        }
    }

    $(".change-postcode").click(function (e) {
        e.preventDefault();
        $(".district-level").hide();
        $(".address-level").hide();
        $("#postcode").val('');
        $(".national-level").fadeIn();
    });

    $("#usecurrentlocation").click(function (e) {
        var jqxhr = null;
        navigator.geolocation.getCurrentPosition(position => {
            if (jqxhr && jqxhr.readyState != 4)
                return;

            jqxhr = $.get("https://postcodes.io/postcodes", "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
                .done(response => {
                    if (response.result == null) {
                        $("#currentlocation_norespose_error").show();
                        return;
                    }
                    enteredPostcode = response.result[0].postcode.replace(/\s+/g, '');
                    $("#postcode").val(enteredPostcode);
                    $("#Enter-postcode").click();
                })
                .fail(error => {
                    $("#currentlocation_norespose_error").show();
                });
        }, error => {
            displayErrMessage();
        });
    });


    function displayErrMessage(message) {
        $("#currentlocationerror").show()
    }
    function updateAddressDropdown(response) {
        if (!response || !response.availability) return;

        // Update the modal dropdown
        let modalDropdown = document.querySelector("#staticBackdrop .form-select");

        // Clear the modal dropdown and add the first option
        if (modalDropdown) { 
        let firstOption = modalDropdown.options[0];
        modalDropdown.innerHTML = "";
        modalDropdown.appendChild(firstOption);

            response.availability.forEach((location, index) => {

                let option = document.createElement("option");
                option.value = location.uprn;
                option.textContent = location.addressShortDescription;
                modalDropdown.appendChild(option);
            });
        }
        sessionStorage.setItem("district_code", response.availability[0].district_code);
    }

    //Added for pop-over of feedback form
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
    //closed pop-over for feedback form

    document.addEventListener("DOMContentLoaded", function () {
        renderDonutCharts();
    });

    // chart script
    function renderDonutCharts() {
        const charts = document.querySelectorAll(".donut-chart");

        charts.forEach(chart => {
            let percentage = parseInt(chart.getAttribute("data-percentage"));
            const percentTextEl = chart.querySelector(".percent-text");

            if (isNaN(percentage) || percentage < 0) {
                percentTextEl.innerText = $('#hdnNaText').val();
                chart.style.background = "#d0c9c9cf";
                return;
            }

            percentTextEl.innerText = percentage + "%";

            let totalSegments = 10;
            let blueSegments = getSegmentsFromValue(percentage);
            let anglePerSegment = 36;
            let gap = 2;
            let currentAngle = 0;

            let gradientParts = [];

            for (let i = 0; i < totalSegments; i++) {
                let color = i < blueSegments ? "#000045" : "#d0c9c9cf";
                gradientParts.push(`${color} ${currentAngle}deg ${currentAngle + (anglePerSegment - gap)}deg`);
                gradientParts.push(`white ${currentAngle + (anglePerSegment - gap)}deg ${currentAngle + anglePerSegment}deg`);
                currentAngle += anglePerSegment;
            }

            chart.style.background = `conic-gradient(${gradientParts.join(", ")})`;
        });

    }

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
    // end chart script

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

    //JS scripts from ofcom.js
    if (window.innerWidth <= 767) {
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
                $(".postcode-container-left").css("padding-right", "40px");
                //$(".postcode-container-left").addClass("mt-4");
                $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'block');
                $leftDrawer.addClass('collapsed').removeClass('col-md-5');
                $rightContainer.removeClass('col-md-7').addClass('expend');
                $(".postcode-container-left ").css("display", "none");
                $('.postcode-right-outer.gray-bg.col-md-7').css('display', 'none');
                $('.postcode-right-outer.gray-bg.expend').removeClass('expend');
            }

        });
    }

    if (window.innerWidth == 768 || window.innerWidth == 820) {
        $('#collapseButton').hide();
        $(document).on('click', '.accordion-collapse .accordion-body .item-list li', function () {
            var $leftDrawer = $('.postcode-left-outer');
            if (!$leftDrawer.hasClass('collapsed')) {
                $('#collapseButton').show();
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

        if (window.innerWidth <= 767) {
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
        if (window.innerWidth > 767) {
            let icon = $(this).find("i");
            addAriaAttribute(icon, false);
        }
        if ($(".postcode-right-outer").hasClass("expend")) {
            $(".search-container").closest(".col-md-12.col-xl-8, .col-md-12.col-xl-7")
                .removeClass("col-xl-8")
            /*.addClass("col-xl-7");*/
                .addClass("col-xl-8");
        } else {
            $(".search-container").closest(".col-md-12.col-xl-5")
                .removeClass("col-xl-7")
                .addClass("col-xl-8");
        }
    });

    function addAriaAttribute(icon, onPageLoad) {

        if (onPageLoad) {
            if (icon.hasClass("fa-chevron-left")) {
                icon.attr("aria-label", "collapse mobile checker pane");
            }
        }
        else {
            if (icon.hasClass("fa-chevron-left")) {
                icon
                    .removeClass("fa-chevron-left")
                    .addClass("fa-chevron-right")
                    .attr("aria-label", "expand mobile checker pane");
            }
            else {
                icon
                    .removeClass("fa-chevron-right")
                    .addClass("fa-chevron-left")
                    .attr("aria-label", "collapse mobile checker pane");
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
        $(".postcode-container-left").css("padding-right", "40px");
        //$(".postcode-container-left").addClass("mt-4");
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

    $('#feedback-form-submit').on('click', function () {
        $('#feedback-form-notification').modal('show');
    });

    $(document).on("click", function (e) {
        if (activePopover && !$(e.target).closest(".popover-icon").length) {
            activePopover.popover('hide');
            activePopover = null;
        }
    });

    $(".accordion-button").on("click", function () {
        let $accordionItem = $(this).closest(".accordion-item.accordion-box");

        if ($accordionItem.hasClass("active")) {
            $accordionItem.css("z-index", "").removeClass("active");
        } else {
            $(".accordion-item.accordion-box").css("z-index", "").removeClass("active"); // Reset others
            $accordionItem.css("z-index", "1055").addClass("active");
        }
    });

    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(function (select) {
        if (select.name && select.name.startsWith('__field_')) {
            select.classList.add('form-select');
        }
    });

    const inputElements = document.querySelectorAll('input[type="text"]');
    inputElements.forEach(function (input) {
        if (input.name && input.name.startsWith('__field_')) {
            input.classList.add('form-control');
        }
    });

    const buttonElements = document.querySelectorAll('button[type="submit"]');
    buttonElements.forEach(function (button) {
        if (button.className && button.className.startsWith('Form__Element FormExcludeDataRebind')) {
            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('width-md-100');
        }
    });
    //end JS scripts from ofcom.js

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
        let isExpanded = $btn.attr('aria-expanded') === 'true';

        const $row = $btn.closest('tr');
        const $img = $row.find('td:eq(0) img');
        const logoAlt = $img.attr('aria-label') || $img.attr('alt') || 'Logo';
        const combined = `${logoAlt}, ${labelText}`;

        $btn.attr('aria-label', combined + '  button ' + (isExpanded ? 'expanded' : 'collapsed'));
    });

    // Listen for any collapse shown or hidden events
    $('.accordion-collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
        let $btn = $(this);
        let $collapse = $(this);
        let $button = $('button[data-bs-target="#' + this.id + '"]');
        let labelText = $.trim($button.contents().get(0).nodeValue);
        let isExpanded = $collapse.hasClass('show');
        $button.attr('aria-expanded', isExpanded.toString());

        const $row = $btn.closest('tr');
        const $img = $row.find('td:eq(0) img');
        const logoAlt = $img.attr('aria-label') || $img.attr('alt') || 'Logo';
        const combined = `${logoAlt}, ${labelText}`;

        $button.attr('aria-label', combined + '  button ' + (isExpanded ? 'expanded' : 'collapsed'));
    });

    //FAQ Accordion changes
    const $allLinks = $('.content-link');
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

    //for Map Tab - drop down select
    function updateAriaLabel($btn) {
        const isExpanded = $btn.attr('aria-expanded') === 'true';
        let labelText = '';
        let logoAlt = '';

        // Address and District Tabs:
        if ($btn.hasClass('accordion-address-tab-button') || $btn.hasClass('accordion-district-tab-button')) {
            // Check if there's a label span (for address and district tabs)
            const $label = $btn.find('.label').length ? $btn.find('.label') : $btn.find('.lh-base.d-flex span:not(img)');
            labelText = $label.text().trim();

            // If it's an address/district tab, get the logo alt text (image alt or aria-label)
            const $img = $btn.closest('tr').find('td:eq(0) img');
            logoAlt = $img.attr('aria-label') || $img.attr('alt') || 'Logo';
        }
        // FAQ Page Accordion (no logoAlt here):
        else if ($btn.hasClass('accordion-button')) {
            // For FAQ, just use the text inside the button
            labelText = $btn.text().trim();
        }

        // Construct the aria-label: "LogoAlt, LabelText, button expanded/collapsed"
        let combinedLabel = '';

        // If logoAlt is available, include it, else just use labelText
        if (logoAlt) {
            combinedLabel = `${logoAlt}, ${labelText}, button ${isExpanded ? 'expanded' : 'collapsed'}`;
        } else {
            combinedLabel = `${labelText}, button ${isExpanded ? 'expanded' : 'collapsed'}`;
        }

        // Update the aria-label attribute
        $btn.attr('aria-label', combinedLabel);

    }

    // Initial update for aria-label on page load

    // Apply the update to all address, district, and FAQ accordion buttons on page load
    $('.accordion-address-tab-button, .accordion-district-tab-button, .accordion-button').each(function () {
        updateAriaLabel($(this));
    });

    // Observer for label text changes (for address and district tabs)
    const labelObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const $btn = $(mutation.target).closest('.accordion-address-tab-button, .accordion-district-tab-button, .accordion-button');
            if ($btn.length) {
                updateAriaLabel($btn);
            }
        });
    });

    // Observe for changes to the label text (address, district, or FAQ)
    $('.label, .lh-base.d-flex span, .accordion-button').each(function () {
        labelObserver.observe(this, { characterData: true, subtree: true, childList: true });
    });

    // Observer for aria-expanded attribute changes on all accordion buttons (address, district, FAQ)
    const attrObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'aria-expanded') {
                const $btn = $(mutation.target);
                updateAriaLabel($btn);
            }
        });
    });

    // Observe aria-expanded changes on all buttons (address, district, FAQ)
    $('.accordion-address-tab-button, .accordion-district-tab-button, .accordion-button').each(function () {
        attrObserver.observe(this, { attributes: true });
    });

    //Tab Accessibility
    function updateTabAccessibility($tabButton) {
        // Get the text content of the tab button (e.g., "Map", "Address", "Postal District")
        const tabName = $tabButton.find('b').text().trim(); // Assuming the tab name is inside <b> tag

        // No need for `aria-label` since we are using `aria-labelledby` in HTML
        // Ensure the button has the role of "tab" for proper semantics with screen readers
        $tabButton.attr('role', 'tab');
    }

    // Initial update for aria-label on page load
    // Apply the update to all tab buttons (Map, Address, and District)
    $('#map-tab, #address-tab, #postal-district-tab').each(function () {
        updateTabAccessibility($(this));
    });

    //Removed aria-expanded from Map, Address, District tab
    function updateSubMenuShowMobileChecker() {
        $('li').each(function () {
            var anchor = $(this).find('button');
            anchor.removeAttr('aria-expanded');
        });
    }
    updateSubMenuShowMobileChecker();
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateSubMenuShowMobileChecker();
            }
        });
    });
    observer.observe(document.documentElement, {
        attributes: true,
        subtree: true
    });

    /* Load More Button feature realted JS - start */
    var itemsToShow = 3;

    $(".accordion-body").each(function () {
        var $body = $(this);
        var $listItems = $body.find(".item-list li");
        var $toggle = $body.find(".toggle-link");
        var expanded = false;
        var showLess = $("#showLess").val();
        var loadMore = $("#loadMore").val();

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
                $(this).text(showLess);
            } else {
                $listItems.removeClass("visible").slice(0, itemsToShow).addClass("visible");
                $(this).text(loadMore);
            }
            expanded = !expanded;
        });

        // Reset when accordion collapses
        $body.closest(".accordion-collapse").on("hidden.bs.collapse", function () {
            $listItems.removeClass("visible").slice(0, itemsToShow).addClass("visible");
            $toggle.text(loadMore);
            expanded = false;
        });
    });

    /* Load More Button feature realted css - end */

    // Iframe height toggle - mobile view only
    let isDown = true;
    const iframeWrapper = document.getElementById('iframe-wrapper');

    $("#iframe-height-toggle").on("click", function () {
        iframeWrapper.classList.toggle('expanded');

        const icon = $(this).find("i");

        if (isDown) {
            icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
        } else {
            icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
        }

        isDown = !isDown;
    });

    $("input.FormTextbox__Input.form-control").addClass("feedbackFormTextBox"); 

    window.updatePerformanceDate = function (clickedElement) {
        const id = clickedElement.getAttribute("data-content-id");

        const performanceResponse = JSON.parse(sessionStorage.getItem("performanceResponse"));
        const addressResponse = JSON.parse(sessionStorage.getItem("coverageResponse"));
        const uprn = JSON.parse(sessionStorage.getItem("uprn"));

        const dateErrorMessage = document.getElementById("dateError").value;

        let formattedPerformanceDate = '';
        if (performanceResponse && performanceResponse.creationDate) {
            const date = new Date(performanceResponse.creationDate);
            formattedPerformanceDate = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } else {
            formattedPerformanceDate = dateErrorMessage;
        }

        let formattedAddressDate = '';
        if (addressResponse && uprn) {
            const matchedItem = addressResponse.availability.find(item => item.uprn == uprn);
            if (matchedItem && matchedItem.creationDate) {
                const date = new Date(matchedItem.creationDate);
                formattedAddressDate = date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            } else {
                formattedAddressDate = dateErrorMessage;
            }
        } else {
            formattedAddressDate = dateErrorMessage;
        }

        const contentElement = document.getElementById(id);
        if (contentElement) {
            contentElement.innerHTML = contentElement.innerHTML
                .replace(/\{4\}/g, formattedAddressDate)
                .replace(/\{5\}/g, formattedPerformanceDate);
        }
    };

});

