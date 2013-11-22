jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");
    return this;
};

Paulme = function() {
    this.init();
};

$.extend(Paulme.prototype, {
    _variable: null,
    _scrollInit: false,
    _scrollBody: null,
    init: function() {
        var me = this;
        $('#mur h1').hide();
        if (!this._scrollInit) {

            $(".articleContener.fr").mCustomScrollbar({scrollButtons: {
                    scrollSpeed: 1000
                }});
            this._scrollInit = $(".articleContener.uk").mCustomScrollbar({scrollButtons: {
                    scrollSpeed: 1000
                }});
        }

//        $('.frFlag, .enFlag').click(this.languageChange);
//
//        var userLang = navigator.language || navigator.userLanguage;
//        if (userLang == "fr" || userLang == "en") {
//            $('.' + userLang + 'Flag').addClass('selected');
//            if ($('.frFlag.selected')) {
//                $('.frFlag').trigger("click");
//
//            }
//            else {
//
//                $('.enFlag').trigger("click");
//
//            }
//        }


        $('#section > ul li').click(this.imageListClick);

        $("#header > ul").clone(true).hide().appendTo('body');
        $("body > ul").wrap('<div class="menuMobileContener" style="display:none;"></div>');
        $(".menuMobileContener").prepend('<div class="menu2Contener" ><div id="miniLogo"></div><div id="menu2">Menu</div><h2>PAULME <span>d&Eacute;colletage</span></h2></div>');
        $(".menuMobileContener > ul").addClass('mobileNav');


        $('#menuMobile, #menu2').click(this.menuMobileClick);
        $(window).resize(this.windowsResizeEvent);
        this.windowsResizeEvent();


    },
    menuMobileClick: function(event) {
        event.preventDefault()
//        var id = $(this).attr('id');
        $(".menuMobileContener,.menuMobileContener > ul").show();
        $('.menuMobileContener').toggleClass('moveRight');
    },
    windowsResizeEvent: function() {



        if (window.innerWidth < 600) {
//            if ($('#sectionContain').getNiceScroll().length === 1) {
//                $('#sectionContain').getNiceScroll().remove();
//                this._scrollInit = true;
//            }

            $('#contenerDiv').attr('style', ' ');
            $('h1').attr('style', ' ');

            if (!$("#contenerDiv").hasClass('top')) {
                $("#contenerDiv").addClass('top');
            }
            if (!$("body").hasClass("mobile"))
                $("body").addClass("mobile");

            $('.menuMobileContener').show();

        }
        else {

//            if ($('#sectionContain').getNiceScroll().length === 0) {
//                $("#sectionContain").niceScroll({
//                    autohidemode: false,
//                    cursorcolor: "#00336e"
//                }).resize();
//            }
            if ($("#contenerDiv").hasClass('top')) {
                $("#contenerDiv").removeClass('top');
            }
            if ($("body").hasClass("mobile"))
                $("body").removeClass("mobile");

            $('.menuMobileContener').hide();

            $("#contenerDiv").center();
        }
    },
    initPageInterieur: function() {
        $("#contenerDiv").center();

        this.animateElt();
        this.createBG();
        var userLang = navigator.language || navigator.userLanguage;
        if (userLang == "fr" || userLang == "en") {
            $('.' + userLang + 'Flag').addClass('selected');
            if ($('.frFlag.selected')) {
                $('.frFlag').trigger("click");

            }
            else {
                $('.enFlag').trigger("click");

            }
        }
        Galleria.loadTheme('/_js/themes/classic/galleria.classic.min.js');

//        var headerTimer = new (function() {
//            var $galleryImages, // An array of image elements
//                    imageId = 0, // Which image is being shown
//                    incrementTime = 5500,
//                    updateTimer = function() {
//                $galleryImages.eq(imageId).stop(true, true).animate({opacity: 0}, 3000);
//                imageId++;
//                if (imageId >= $galleryImages.length) {
//                    imageId = 0;
//                }
//                $galleryImages.eq(imageId).stop(true, false).animate({opacity: 1}, 3000);
//            },
//                    init = function() {
//                $galleryImages = $('.galleryImages div.fondHeader');
//
//                headerTimer.Timer = $.timer(updateTimer, incrementTime, true).once();
//            };
//
//            this.toggleGallery = function() {
//                if (this.Timer.active) {
//                    this.Timer.pause();
//                }
//                else {
//                    this.Timer.play();
//                }
//            };
//            $(init);
//        });
//        var headerTimer2 = new (function() {
//            var $galleryImages, // An array of image elements
//                    imageId = 0, // Which image is being shown
//                    incrementTime = 5500,
//                    updateTimer = function() {
//                $galleryImages.eq(imageId).stop(true, true).animate({opacity: 0}, 3000);
//                imageId++;
//                if (imageId >= $galleryImages.length) {
//                    imageId = 0;
//                }
//                $galleryImages.eq(imageId).stop(true, false).animate({opacity: 1}, 3000);
//            },
//                    init = function() {
//                $galleryImages = $('div.fondBlockLeft');
//
//                headerTimer2.Timer = $.timer(updateTimer, incrementTime, true).once();
//            };
//
//            this.toggleGallery = function() {
//                if (this.Timer.active) {
//                    this.Timer.pause();
//                }
//                else {
//                    this.Timer.play();
//                }
//            };
//            setTimeout(function() {
//                $(init);
//            }, 1000);
//        });
    },
    animateElt: function() {
//        $("#header").animate({
//            margin: '0'
//        }, 300);
//
//        $("#mur").animate({
//            opacity: 1,
//            left: 0
//        }, 300, "linear", function() {
//            $("#ombre").animate({
//                opacity: 1,
//                left: 0
//            }, 150, "linear", function() {
//                $("#logoImg").animate({
//                    opacity: 1,
//                    height: '85px',
//                    margin: '8px 0 0 20px'
//                }, 500, function() {
//
//                    setTimeout(function() {
//                        $('#mur p').addClass('shadow');
//                    }, 1000);
//                });
//                $('#mur h1').fadeIn();
//            });
//        });

    },
    createBG: function() {
        // on crée les bg de la Header
        var fondHeader = $(".fondHeader");
        $(fondHeader[0]).css('background', 'url("/img/headerDeco1.jpg")');
        $(fondHeader[1]).css('background', 'url("/img/headerDeco2.jpg")');

        // on crée les bg du BlockLeft
//        var blockLeftCls = $(".fondBlockLeft");
//        $(blockLeftCls[0]).css('background', 'url("/img/blockLeft1.jpg")');
//        $(blockLeftCls[1]).css('background', 'url("/img/blockLeft2.jpg")');
    },
    languageChange: function(e) {

//        if ($('.frFlag').length > 0) {
//            e.preventDefault();
//
//            if ($(e.target).hasClass('frFlag')) {
//                $('.uk').hide();
//                $('.uk').css({'display': 'none'});
//                $('.fr').show();
//            }
//            else {
//                $('.uk').show();
//                $('.fr').hide();
//                $('.fr').css({'display': 'none'});
//
//            }
//        } else {
//            $('.uk').hide();
//            $('.uk').css({'display': 'none'});
//            $('.fr').show();
//        }
    },
    imageListClick: function(e) {
        e.preventDefault();

        var target = $(e.target);

        var divIndex = $.inArray(target[0], $('.listeGalleria li'));

        var dim = [1129, 683 + 200], width = (parseInt(dim[0])), height = (parseInt(dim[1]));

        if (width > $('body').width()) {
            width = $('body').width();
            height = width / parseInt(dim[0]) * height;
        }

        if (height > $('body').height()) {

            height = $('body').height();
            width = height / parseInt(dim[1]) * width;

        }

        width = parseInt(width);
        height = parseInt(height);

        var imageBaliseConstr = "";

        $('.listeGalleria li').each(function(index) {
            var bg = $(this).css('background-image');
            bg = bg.replace('url(', '').replace(')', '');

            imageBaliseConstr += "<img src='" + bg + "'/>";


        });

        $('#revealDiv').html('<div id="galleria">' + imageBaliseConstr + '</div>');
        $('#galleria').css({width: (width - 40) + 'px', height: (height - 80) + 'px'});

        var top = 0;//($('body').height() - height) / 2;
        var left = ($('body').width() - width) / 2;

        //adding button close //
        var uploadedContainer = $('#revealDiv');
        var uploadedItem = '<div class="galleria-exitCustom"></div>';
        uploadedContainer.append(uploadedItem);

        //adding Close button callback
        $(".galleria-exitCustom").bind("click", function() {
            $('#galleria').remove();
            $("div#revealDiv.reveal-modal").removeClass('loader').removeClass('gallerie');
            $('#revealDiv').animate(
                    {
                        opacity: "0"
                    },
            {
                queue: false,
                duration: 450
            }

            );

            $(".reveal-modal-bg").fadeOut(450);
            $('#revealDiv').html();
            $('#revealDiv[style]').removeAttr('style');

        });


        Galleria.run('#galleria', {show: divIndex, maxScaleRatio: 1, minScaleRatio: 1});
        $('#revealDiv').addClass('loader').css({width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px'});
        $('#revealDiv').css({opacity: 0}).reveal({closeCallBack: function(modal) {

                $('#galleria').remove();
                modal.removeClass('loader').removeClass('gallerie');

            }});

    },
    contactInit: function() {

        $("input[name^='objet']").attr("readonly", true).attr("placeholder", "........................................");
        var option1 = "Demande de devis";
        var option2 = "Infos sur nos produits"
        $('#contactForm').append('<div id="sekectBoxCadre" style="top:' + $("input[name^='objet']").position().top + 'px;"><span>' + option1 + '</span><span>' + option2 + '</span><span>Autres</span></div>')

        $("input[name^='objet'], #sekectBoxCadre").hover(
                function() {
                    $('#sekectBoxCadre').show();
                },
                function() {
                    $('#sekectBoxCadre').hide();
                }
        );
        $("#sekectBoxCadre span").click(function() {

            $("input[name^='objet']").val($(this).html());
            $('#sekectBoxCadre').hide();

        });




        var html = '<div id="accesPlan"><div data-reveal-id="myModal" >Voir le plan d\'acc&egrave;s</div></div>';
        $('#contactForm').prepend(html);

        $('#accesPlan div').click(function(btn) {

            $('#revealDiv').html('<div class="reveal-modal-bg" ><div id="revealContent"> <a class="close-reveal-modal">&#215;</a></div></div>');
            var embed = '<iframe width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.fr/maps?f=q&amp;source=s_q&amp;hl=fr&amp;geocode=&amp;q=400+avenue+Victor+Hugo+-+74800+La-Roche-sur-Foron&amp;aq=&amp;sll=45.317723,5.43724&amp;sspn=6.928785,16.907959&amp;ie=UTF8&amp;hq=&amp;hnear=400+Avenue+Victor+Hugo,+74800+La+Roche-sur-Foron,+Haute-Savoie,+Rh%C3%B4ne-Alpes&amp;t=m&amp;ll=46.080971,6.314049&amp;spn=0.047629,0.103168&amp;z=13&amp;iwloc=A&amp;output=embed"></iframe><br /><small><a href="https://maps.google.fr/maps?f=q&amp;source=embed&amp;hl=fr&amp;geocode=&amp;q=400+avenue+Victor+Hugo+-+74800+La-Roche-sur-Foron&amp;aq=&amp;sll=45.317723,5.43724&amp;sspn=6.928785,16.907959&amp;ie=UTF8&amp;hq=&amp;hnear=400+Avenue+Victor+Hugo,+74800+La+Roche-sur-Foron,+Haute-Savoie,+Rh%C3%B4ne-Alpes&amp;t=m&amp;ll=46.080971,6.314049&amp;spn=0.047629,0.103168&amp;z=13&amp;iwloc=A" style="color:#0000FF;text-align:left">Agrandir le plan</a></small>';
            $('#revealContent').prepend(embed);
            $('#revealContent small a').attr('target', '_blank');
            $('#revealContent small a').hover(function() {
                $(this).css({'text-decoration': 'underline'});
//                $('#sekectBoxCadre').css({'top' : $("input[name^='objet']").position().top });
            }, function() {
                $(this).css({'text-decoration': 'none'});
//                $('#sekectBoxCadre').css({'top' : $("input[name^='objet']").position().top });
            });
            $('#revealContent small a').css({'color': '#000', 'font-size': '14px', 'font-familly': 'verdana'});
            $('#revealDiv').reveal({
                animation: 'fadeAndPop',
                animationspeed: 300,
                closeonbackgroundclick: false,
                dismissmodalclass: 'close-reveal-modal'
            });
        });


        $('#contactForm')[0].reset();

        this.formValidate = $('#contactForm').validate({
            ignore: "",
            rules: {
                message: {minlength: 15},
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    email: "Cet email est incorrect."
                },
                message: {
                    minlength: 'Votre message doit faire {0} caract&egrave;res minimum !'
                }
            },
            errorPlacement: function(error, element) {
              $(error).tipTip({
                    defaultPosition: 'right',
                    content: function(e) {
                        $(this).html($(error).attr('data-error'));
                    }
                });

                error.insertAfter(element);

            },
            submitHandler: function(form) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: '/ajax',
                    data: $('#contactForm').serialize() + '&apiCall=sendMailContact',
                    success: function(response) {
                        $('#contactForm').slideUp().height(562);
                        var msg = "";
                        if (!response.success)
                            msg += response.error;
                        else
                            msg += "Votre message a bien &eacute;t&eacute; pris en compte et sera trait&eacute; au plus vite, merci !<br />";

                        $('#ajaxWait').hide();
                        $('#reponseCont > p').html(msg);
                        $('#reponseCont').slideDown();
                    }

                });
            }});

        $('#contactForm').valid();

        $("#contactForm input").keyup(function() {
            $('#contactForm').valid();
        });



    }
});


