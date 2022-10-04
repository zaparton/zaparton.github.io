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
        if (!app.nav.current_page) return;
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