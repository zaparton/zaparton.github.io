app = $.extend(app, {
    nav:{
        current_page:null,
        scroll_inf: {}
    },
    change_tab:(id)=>{
        $("#tab_indicator").css("width", $(`#tab_${id}`).outerWidth());
        $("#tab_indicator").css("left", $(`#tab_${id}`).position().left);
        $(".tab_title").addClass("tab_title_inactive");
        $(`.tab_title[page_id="${id}"]`).removeClass("tab_title_inactive");
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
        $("#bt_user_abort").click(()=>{
            app.abort();
        });
        $("#bt_user_save").click(()=>{
            app.change_tab("screening");
            app.change_page("screening");
            app.save();
        });
        $("#ico_menu").click(()=>{
            $("#dv_menu_mask").show();
        });
        $("#dv_menu_mask").click(()=>{
            $("#dv_menu_mask").fadeOut();
        });
        $("#bt_user_exit").click(()=>{
            app.logout();
        });
        $("#bt_user_contact").click(()=>{
            window.open("https://chat.whatsapp.com/Bq5DjkU7uBL9ntJuuDcuCp");
        });
        $("#bt_user_feedback").click(()=>{
            window.open("https://forms.gle/GsKDPFPszqFMJjsHA");
        });
        $("#bt_change_campaign").click(()=>{
            $("#dv_campaign_menu_mask").show();
        });
        $("#bt_refresh").click(()=>{
            window.location.reload();
        });
        $("#dv_campaign_menu_mask").click(()=>{
            $("#dv_campaign_menu_mask").fadeOut();
        });
        $("#tab_pics, #tab_profile, #tab_news").click((el)=>{
            const id = $(el.target).attr("page_id");
            app.change_tab(id);
            app.change_page(id);
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
        $(".filter_box_item").click((ev)=>{
            if (ev.target.tagName.toLowerCase() == "input") return;
            $(ev.target).closest(".filter_box_item").find("input").click();
        });
        // $("#filter_box_wrapper input[type='checkbox']").change(app.filter);
        $("#bt_apply_filter").click(()=>{
            $("#dv_header").show();
            $("#user_box_head_wrapper").show();
            $("#dv_filter_toolbox").hide();
            app.filter();
            app.change_page("scoring");
            app.change_tab("scoring");
            $("#ico_filter").toggleClass("filter_is_on", $(".filter_box_item input[type='checkbox']:checked").length>0);
            app.nav.scroll_inf["activuty"] = {};
            $("#dv_header").removeClass("head_shrink");
            $(window)[0].scrollTo({top:0});
        });
        $("#bt_clear_filter").click(()=>{
            $("#filter_box_wrapper input[type='checkbox']").prop("checked", false);
            app.set_filter_button_mode();
            $("#bt_apply_filter").click();
        });
        $(window).scroll(app.on_scroll);
        $(window).on("orientationchange", event => {
            setTimeout(()=>{app.change_tab(app.nav.current_page)}, 100);
        });
        /* disabled sep 1 2022
        $("#login_register_link").click(()=>{
            app.set_login_mode((app.dat.login_mode == "LOGIN")?"REGISTER":"LOGIN");
        });
        */
    },
    set_filter_button_mode: ()=> $("#ico_filter").toggleClass("filter_is_on", $(".filter_box_item input[type='checkbox']:checked").length>0),
    on_after_rebuild: ()=> {
        $("#campaign_title").html((app.dat.campaign)?app.dat.campaign.sub_title:'תחרות צילום - הרשמה לתחרות');
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
    login:(uid, otp, on_connect_error, on_user_not_found)=>{
        $(".dv_login_error_msg").hide();
        app.clear();
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
                $(document).ready(()=>{
                    app.change_tab("profile");
                    app.change_page("profile");
                });
                app.rebuild(response);
                $("#user_box_head_wrapper").slideDown();
                $("#dv_login").fadeOut();
                app.help_message.show_welcome();
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