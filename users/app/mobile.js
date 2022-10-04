app = $.extend(app, {
    nav:{
        current_page:null,
        scroll_inf: {}
    },
    change_tab:(id, dont_change_page)=>{
        if ($(`#tab_${id}`).hasClass("tab_disabled")) return;
        const current_tab_id = $(`#dv_header_tabs>div[page_id]:not(.tab_title_inactive)`).attr("page_num_id");
        const change = ()=>{
            app.pages[id]?.enter?.call();
            $("#tab_indicator").css("width", $(`#tab_${id}`).outerWidth());
            $("#tab_indicator").css("left", $(`#tab_${id}`).position().left);
            $(".tab_title").addClass("tab_title_inactive");
            $(`.tab_title[page_id="${id}"]`).removeClass("tab_title_inactive");
            if (!dont_change_page) app.change_page(id);
        }
        const leave = app.pages[current_tab_id]?.leave;
        if (leave) leave(change); else change();
    },
    change_page:(id)=>{
        if (!app.nav.scroll_inf[id]) app.nav.scroll_inf[id] = {};
        const cpid = app.nav.current_page;
        if (id == cpid) return;
        $('.page').hide();
        $('.page_toolbox').slideUp(100);
        $(`#page_${id}`).fadeIn();
        $(`#page_toolbox_${id}`).slideDown(600);
        $(window).scrollTop(app.nav.scroll_inf[id].last_scroll_top||0);
        app.on_page_changed(app.nav.current_page, id);
        app.nav.current_page = id;
    },
    on_page_changed:(old_id, new_id)=>{
        $("#ico_filter").toggle(new_id == "activity");
        if ($(window).scrollTop()<=80) {
            $("#dv_header").removeClass("head_shrink");
            app.nav.scroll_inf[new_id] = {};
        }
    },
    on_after_signup:()=>{
        $("#user_hours").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", ()=>{
            $("#user_hours").removeClass("ani_pulse");
        });
        $("#user_hours").addClass("ani_pulse");
        app.help_message.show_signup();
    },
    changed:()=>{
        return false;
        // return $("#user_toolbox").is(":visible");
    },
    on_user_toolbox_enabled:(enabled)=>{
        $("#user_toolbox").toggle(enabled);
        $("#ico_up").css("bottom", $("#user_box_head_wrapper").outerHeight()+10);
        $(".page").toggleClass("footer_offset", enabled);
    },
    head_shrink:(st)=>{
        const scroll_inf = app.nav.scroll_inf[app.nav.current_page];
        if (Math.abs(st-(scroll_inf.scroll_switch||0))>80) {
            if (st > scroll_inf.last_scroll_top) $("#dv_header").addClass("head_shrink");
            if (st < scroll_inf.last_scroll_top) $("#dv_header").removeClass("head_shrink");
            scroll_inf.scroll_switch = st;
        }
        scroll_inf.last_scroll_top = st;
    },
    init_buttons:()=>{
        $("#frm_login").submit((e)=>{
            e.preventDefault(e);
            app.login_request();
        });
        $("#frm_login_2").submit((e)=>{
            e.preventDefault(e);
            app.login();
        });
        window.onbeforeunload = function(){
            if (app.changed() && $("#dv_login").is(":hidden"))  return 'אזהרה! השינויים לא נשמרו.';
        };
        $("#ico_menu").click(()=>{
            $("#dv_menu_mask").show();
        });
        $("#dv_menu_mask").click(()=>{
            $("#dv_menu_mask").fadeOut();
        });
        $("#bt_user_exit").click(()=>{
            app.logout();
        });
        $("#bt_refresh").click(()=>{
            window.location.reload();
        });
        $(".checkbox_wrapper").click((e)=>{
            $(e.target).find("input[type=checkbox]").click();
        });
        $("#dv_campaign_menu_mask").click(()=>{
            $("#dv_campaign_menu_mask").fadeOut();
        });
        $("#tab_pics, #tab_profile, #tab_news").click((el)=>{
            const id = $(el.target).attr("page_id");
            app.change_tab(id);
            // app.change_page(id);
        })
        $("#bt_frm_profile_save").click((e)=>{
            app.save_profile();
        });
        $("#ico_filter").click((el)=>{
            $("#dv_header").hide();
            $("#user_box_head_wrapper").hide();
            $("#dv_filter_toolbox").show();
            app.change_page("filter");
        });
        $("#ico_up").click(()=>{
            $(window)[0].scrollTo({top:0, behavior: 'smooth'});
        });
        $(window).scroll(app.on_scroll);
        $(window).on("orientationchange", event => {
            setTimeout(()=>{app.change_tab(app.nav.current_page, true)}, 100);
        });
    },
    set_filter_button_mode: ()=> $("#ico_filter").toggleClass("filter_is_on", $(".filter_box_item input[type='checkbox']:checked").length>0),
    get_news_section_html:(txt,dt)=>{
        return `<div class="frm_section"><div class="frm_section_box frm_info_box"><div class="frm_info_box_date">${dt}</div><div class="frm_info_box_content">${txt}</div></div></div>`;
    },
    on_after_rebuild: ()=> {
        $("#campaign_title").html((app.dat.campaign)?app.dat.campaign.sub_title:'תחרות צילום - הרשמה לתחרות');
        $(".drop_zone p").html("לחץ להעלאת תמונה");
    },
    default_view:()=>{
        $("#tab_pics,#tab_news").toggleClass("tab_disabled", app.is_new_user());
        app.change_tab((app.is_new_user())?"profile":"pics");
    },
    on_scroll:()=>{
        const st = $(window).scrollTop();
        app.head_shrink(st);
        const ico_up_hidden = $("#ico_up").is(":hidden");
        $("#ico_up").toggle(st>200);
        if (st>200 && ico_up_hidden) $("#ico_up").css("bottom", $("#user_box_head_wrapper").outerHeight()+10);
    },
    help_message_txt:{
        welcome: 
            '<div id="help_welcome">' + 
                '<div class="help_paragraph">טקסט הסבר קצר על אופן השימוש.</div>' +
                '<div class="help_nagging"><input id="cb_help_welcome_nagging" type="checkbox" checked="true" /><label for="cb_help_welcome_nagging">הבנתי, אין צורך להציג הודעה זו שוב.</label></div>' +
            '</div>'
    },
    clear_view:()=>{
        $("#user_box_head_name").html('');
        $("#user_box_head_id").html('');
        $(".page").hide();
        app.nav= {
            current_page:null,
            scroll_inf: {}
        }    
    },
    login:(uid, otp, on_connect_error, on_user_not_found)=>{
        $(".dv_login_error_msg").hide();
        app.clear();



        response = {
            "user": [
                "meni.cooper@gmail.com",
                39,
                24809,
                "מני קופפר",
                "2022-09-27",
                "",
                "meni.cooper@gmail.com",
                "0544424749",
                true,
                "YOUTH",
                49824
            ],
            "pics": [
                [
                    "meni.cooper@gmail.com",
                    1,
                    "391.jpg",
                    "IMG_5641.jpg",
                    "ACTIVE",
                    0,
                    "",
                    "2022-10-02T13:39:55.414Z",
                    "",
                    "391_1664717995416",
                    "YOUTH",
                    "{\"Make\":\"Apple\",\"Model\":\"iPhone 13\",\"Orientation\":1,\"XResolution\":72,\"YResolution\":72,\"ResolutionUnit\":2,\"Software\":\"15.6.1\",\"DateTime\":\"2022:10:01 22:16:40\",\"undefined\":41.213973091262766,\"YCbCrPositioning\":1,\"ExifIFDPointer\":252,\"GPSInfoIFDPointer\":2380,\"ExposureTime\":0.030303030303030304,\"FNumber\":2.2,\"ExposureProgram\":\"Normal program\",\"ISOSpeedRatings\":400,\"ExifVersion\":\"0232\",\"DateTimeOriginal\":\"2022:10:01 22:16:40\",\"DateTimeDigitized\":\"2022:10:01 22:16:40\",\"ComponentsConfiguration\":\"YCbCr\",\"ShutterSpeedValue\":5.059230359992907,\"ApertureValue\":2.275007048020513,\"BrightnessValue\":1.1987554019014692,\"ExposureBias\":0,\"MeteringMode\":\"Pattern\",\"Flash\":\"Flash did not fire, compulsory flash mode\",\"FocalLength\":2.71,\"MakerNote\":[65,112,112,108,101,32,105,79,83,0,0,1,77,77,0,38,0,1,0,9,0,0,0,1,0,0,0,14,0,2,0,7,0,0,2,46,0,0,1,220,0,3,0,7,0,0,0,104,0,0,4,10,0,4,0,9,0,0,0,1,0,0,0,1,0,5,0,9,0,0,0,1,0,0,0,220,0,6,0,9,0,0,0,1,0,0,0,213,0,7,0,9,0,0,0,1,0,0,0,1,0,8,0,10,0,0,0,3,0,0,4,114,0,14,0,9,0,0,0,1,0,0,0,0,0,20,0,9,0,0,0,1,0,0,0,12,0,22,0,2,0,0,0,29,0,0,4,138,0,23,0,9,0,0,0,1,66,80,32,0,0,25,0,9,0,0,0,1,0,0,32,0,0,26,0,2,0,0,0,6,0,0,4,168,0,31,0,9,0,0,0,1,0,0,0,0,0,32,0,2,0,0,0,37,0,0,4,174,0,33,0,10,0,0,0,1,0,0,4,212,0,37,0,9,0,0,0,1,0,0,22,142,0,38,0,9,0,0,0,1,0,0,0,2,0,39,0,10,0,0,0,1,0,0,4,220,0,43,0,2,0,0,0,37,0,0,4,228,0,45,0,9,0,0,0,1,0,0,24,213,0,46,0,9,0,0,0,1,0,0,0,0,0,47,0,9,0,0,0,1,0,0,0,0,0,48,0,10,0,0,0,1,0,0,5,10,0,49,0,7,0,0,0,88,0,0,5,18,0,50,0,9,0,0,0,1,2,96,56,48,0,51,0,9,0,0,0,1,0,0,48,0,0,52,0,9,0,0,0,1,0,0,0,5,0,53,0,9,0,0,0,1,0,0,0,4,0,54,0,9,0,0,0,1,0,0,1,77,0,55,0,9,0,0,0,1,0,0,0,0,0,58,0,9,0,0,0,1,0,0,0,139,0,59,0,9,0,0,0,1,0,0,0,1,0,60,0,9,0,0,0,1,0,0,0,1,0,64,0,7,0,0,0,80,0,0,5,106,0,65,0,7,0,0,0,42,0,0,5,186,0,74,0,9,0,0,0,1,0,0,0,5,0,0,0,0,98,112,108,105,115,116,48,48,79,17,2,0,81,3,94,3,126,3,120,3,110,3,97,3,102,3,91,3,90,3,87,3,83,3,87,3,82,3,69,3,43,3,0,3,75,3,95,3,124,3,117,3,106,3,91,3,95,3,89,3,87,3,85,3,80,3,83,3,75,3,56,3,26,3,239,2,65,3,40,3,113,3,110,3,98,3,84,3,88,3,86,3,82,3,78,3,75,3,77,3,64,3,39,3,6,3,219,2,52,3,235,2,1,3,98,3,163,2,65,2,80,3,78,3,71,3,67,3,68,3,68,3,52,3,20,3,237,2,198,2,25,3,16,2,101,0,32,2,105,1,87,0,26,3,35,3,51,3,53,3,58,3,54,3,34,3,254,2,218,2,180,2,239,2,225,0,125,0,161,0,99,1,80,0,155,1,58,2,199,2,18,3,159,1,173,0,222,1,235,2,197,2,162,2,112,2,224,0,63,0,28,0,108,0,26,0,143,0,5,1,229,0,158,2,51,1,249,0,232,0,206,2,175,2,142,2,45,1,115,0,105,0,25,0,31,0,24,0,47,0,208,0,122,0,3,2,224,0,140,0,137,0,49,2,139,2,114,2,127,0,109,0,74,0,129,0,26,0,17,0,48,0,197,0,97,0,5,2,239,0,158,0,144,0,157,1,93,2,80,2,128,0,34,0,25,0,130,0,15,0,108,0,183,0,159,0,97,0,87,1,211,0,121,0,95,0,34,1,114,1,59,1,17,0,15,0,20,0,25,0,17,0,156,1,101,1,255,0,182,1,108,1,100,0,146,0,67,0,43,0,44,0,38,0,27,0,24,0,21,0,18,0,55,1,158,1,250,1,226,1,115,1,68,1,139,0,66,0,34,0,20,0,26,0,29,0,55,0,13,0,13,0,37,0,174,1,175,1,213,1,78,1,128,1,22,1,43,0,123,0,20,0,23,0,29,0,27,0,43,0,17,0,18,0,132,0,71,1,223,1,102,1,126,1,66,1,61,0,27,0,27,0,30,0,49,0,42,0,24,0,19,0,14,0,31,0,238,0,108,2,24,2,174,1,121,1,250,0,35,0,29,0,30,0,31,0,52,0,50,0,39,0,12,0,11,0,113,0,87,1,72,2,201,1,76,1,4,1,79,0,27,0,40,0,44,0,50,0,46,0,47,0,49,0,0,8,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,12,98,112,108,105,115,116,48,48,212,1,2,3,4,5,6,7,8,85,102,108,97,103,115,85,118,97,108,117,101,89,116,105,109,101,115,99,97,108,101,85,101,112,111,99,104,16,1,19,0,8,20,11,101,116,30,54,18,59,154,202,0,16,0,8,17,23,29,39,45,47,56,61,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,63,0,0,108,105,0,0,111,22,0,0,23,59,0,10,53,19,0,0,48,5,0,1,117,219,65,84,75,97,89,106,79,116,106,50,102,103,84,74,66,83,88,68,111,57,74,75,105,103,57,55,116,119,0,0,113,55,53,48,110,0,70,50,50,68,56,50,70,68,45,51,67,54,57,45,52,67,54,49,45,57,66,57,55,45,68,52,49,67,67,70,57,50,68,65,50,50,0,0,0,0,0,1,0,0,0,2,0,1,217,75,0,0,20,72,50,50,66,51,68,65,55,68,45,57,67,53,57,45,52,65,49,70,45,57,49,66,56,45,49,66,55,52,53,68,49,53,66,56,57,54,0,0,0,0,0,214,4,81,241,255,98,112,108,105,115,116,48,48,79,16,44,1,0,0,0,8,0,0,0,176,4,135,63,156,174,159,59,102,127,144,188,208,161,192,187,18,147,134,63,156,25,244,188,13,14,152,187,88,158,52,60,0,0,128,63,8,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,98,112,108,105,115,116,48,48,212,1,2,3,4,5,6,7,8,81,51,81,49,81,50,81,48,16,3,34,191,0,0,0,34,0,0,0,0,16,1,8,17,19,21,23,25,27,32,37,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,98,112,108,105,115,116,48,48,9,8,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9],\"SubsecTimeOriginal\":\"264\",\"SubsecTimeDigitized\":\"264\",\"FlashpixVersion\":\"0100\",\"ColorSpace\":65535,\"PixelXDimension\":4032,\"PixelYDimension\":3024,\"SensingMethod\":\"One-chip color area sensor\",\"SceneType\":\"Directly photographed\",\"ExposureMode\":0,\"WhiteBalance\":\"Auto white balance\",\"FocalLengthIn35mmFilm\":23,\"SceneCaptureType\":\"Standard\",\"GPSLatitudeRef\":\"N\",\"GPSLatitude\":[32,4,33.7],\"GPSLongitudeRef\":\"E\",\"GPSLongitude\":[34,51,23.22],\"GPSAltitudeRef\":0,\"GPSAltitude\":57.584316225693335,\"GPSSpeedRef\":\"K\",\"GPSSpeed\":0,\"GPSImgDirectionRef\":\"T\",\"GPSImgDirection\":42.94024660132785,\"GPSDestBearingRef\":\"T\",\"GPSDestBearing\":222.9402467232074,\"thumbnail\":{}}"
                ],
                [
                    "meni.cooper@gmail.com",
                    2,
                    "392.jpg",
                    "16647077697048896278606884965790.jpg",
                    "ACTIVE",
                    1,
                    "",
                    "2022-10-02T10:50:25.450Z",
                    "2022-10-03T14:47:31.608Z",
                    "392_1664707825450",
                    "YOUTH",
                    "{\"ImageWidth\":4000,\"ImageHeight\":2250,\"Orientation\":1,\"YCbCrPositioning\":1,\"XResolution\":72,\"YResolution\":72,\"ResolutionUnit\":2,\"Make\":\"samsung\",\"Model\":\"SM-A307FN\",\"Software\":\"A307FNXXU2BTE4\",\"DateTime\":\"2022:10:02 13:49:47\",\"ExifIFDPointer\":227,\"ExposureTime\":0.02,\"FNumber\":1.7,\"ExposureProgram\":\"Normal program\",\"ISOSpeedRatings\":64,\"ExifVersion\":\"0220\",\"DateTimeOriginal\":\"2022:10:02 13:49:47\",\"DateTimeDigitized\":\"2022:10:02 13:49:47\",\"ShutterSpeedValue\":5.64,\"ApertureValue\":1.53,\"BrightnessValue\":2.54,\"ExposureBias\":0,\"MaxApertureValue\":1.22,\"MeteringMode\":\"CenterWeightedAverage\",\"Flash\":\"Flash did not fire\",\"FlashpixVersion\":\"0100\",\"ComponentsConfiguration\":\"YCbCr\",\"FocalLength\":3.93,\"SubsecTime\":\"0980\",\"SubsecTimeOriginal\":\"0980\",\"SubsecTimeDigitized\":\"0980\",\"UserComment\":[0,0,0,0,0,0,0,0,0,0,0,0,0],\"ColorSpace\":1,\"PixelXDimension\":4000,\"PixelYDimension\":2250,\"CustomRendered\":\"Normal process\",\"ExposureMode\":0,\"WhiteBalance\":\"Auto white balance\",\"DigitalZoomRation\":null,\"FocalLengthIn35mmFilm\":27,\"SceneCaptureType\":\"Standard\",\"Contrast\":\"Normal\",\"Saturation\":\"Normal\",\"Sharpness\":\"Normal\",\"ImageUniqueID\":\"A25LSMF00MM\",\"InteroperabilityIFDPointer\":817,\"thumbnail\":{\"ImageWidth\":512,\"ImageHeight\":288,\"Compression\":6,\"Orientation\":1,\"JpegIFOffset\":925,\"JpegIFByteCount\":14618,\"blob\":{}}}"
                ]
            ],
            "campaign": [
                1,
                "צפרתון קק\"ל 2022",
                "YOUTH",
                "תחרות צילום - מקצה נוער",
                "פתוח",
                "",
                "",
                "https://chat.whatsapp.com/IZYco0JhgZsABQADsBPcRF",
                "2022-10-11T21:00:00.000Z",
                ""
            ],
            "news": [
                [
                    "תאריך",
                    "חדשות"
                ],
                [
                    "3.10.22",
                    "ברוכים הבאים לתחרות הצילום של צפרתון קק\"ל!\n\nאנחנו שמחים שנרשמת לתחרות, ומצפים כבר לקבל את התמונות שצילמת החל מה-12.10.22 (במשך 48 שעות).\n\nבהצלחה!!!"
                ]
            ]
        }
        $("#dv_header").show();
        app.rebuild(response);
        $(document).ready(app.default_view);
        $("#user_box_head_wrapper").slideDown();
        $("#dv_login").fadeOut();
return;
        




        uid = uid || $("#eb_login").val().trim();
        otp = otp || $("#eb_login_2").val().trim();
        var post_data = {
            act_id: "login",
            uid: uid,
            otp: otp
        };
        if (uid == "") return;
        if (otp == "") return;
        if (uid == "") return;
        app.post(post_data,{
            on_success :(response)=>{
                $("#dv_header").show();
                app.rebuild(response);
                $(document).ready(app.default_view);
                $("#user_box_head_wrapper").slideDown();
                $("#dv_login").fadeOut();
                // app.help_message.show_welcome();
            }, 
            on_error_response: (error)=>{
                if (error.code == 4) {
                    app.pop_err("לא מצאנו משתמש לפי המידע שהוקלד");
                    if (on_user_not_found) on_user_not_found();
                } else app.pop_srv_err(error);
            },
            on_connect_error: on_connect_error
        });
    },
    login_request:(uid)=>{
        $(".dv_login_error_msg").hide();
        app.clear();
        $("#eb_login_2").val('')
        uid = $("#eb_login").val().trim();
        if (uid == "") return;
        var post_data = {
            act_id: "login_request",
            uid: uid
        };


        $("#frm_login").hide();
        $("#frm_login_2").fadeIn();
return;

        app.post(post_data,{
            on_success :(response)=>{
                console.log(response);
                $("#frm_login").hide();
                $("#frm_login_2").fadeIn();
            },
            on_error_response: (error)=>{
                app.pop_err(error.desc || 'השרת מדווח על תקלה בביצוע הפעולה');
            }
        });
    },
    scroll_home:()=>{
        $(window)[0].scrollTo({top:0, behavior: 'smooth'});
    },
    init: ()=>{
        $("#dv_header").hide();
        $("#dv_screen_message").hide();
        $("#user_box_head_wrapper").hide();
        $("#dv_filter_toolbox").hide();
        app.init_buttons();
        app.init_user();
        if (app.dat.user) {
            app.login(app.dat.user.uid, app.dat.user.otp, 
                ()=>{app.show_screen_message("אין תקשורת עם השרת :(")}, 
                ()=>{app.logout();}
            );
        } else {
            $("#dv_login").show();
        }
        $("body").show();
        app.init_drop_zones();
    },
    start_mobile: ()=>{
        if (!js.is_mobile()) {
            // app.show_screen_message("דף זה מיועד למכשירים ניידים");
            if (window.location.href.toLowerCase().indexOf("index.html")<0) {
                const query = window.location.href.split('?')[1]||'';
                window.location.href = "index.html" + ((query == '') ? '' : "?" + query);
            }
        } else {
            app.init();
        }
    }
});

$(app.start_mobile)