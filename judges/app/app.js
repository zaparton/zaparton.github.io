//app.js
Storage.prototype.setObj = function(key, value) {this.setItem(key, JSON.stringify(value));}
Storage.prototype.getObj = function(key) {var value = this.getItem(key); return value && JSON.parse(value); }

var js = {
    repeat:(s, n)=>{return Array(n+1).join(s);},
    zeros:(n)=>{return js.repeat("0", n)},
    pad_zero:(s, len)=>{var zs = js.zeros(len) + s; return zs.substr(zs.length - len);},
    escapeRegExp: (s)=> {return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');},
    r : (str, s1, s2)=>{return (str+'').replace(new RegExp(js.escapeRegExp(s1),"gi"), s2);},
    is_mobile: ()=>{
        var is_mobile = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) is_mobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return is_mobile;
    },
    urlParam:name=>{
        if (!name) return null;
        var results = new RegExp('[\?&]' + name.toLowerCase() + '=([^&#]*)').exec(window.location.href.toLocaleLowerCase());
        if (!results) return null;
        return decodeURI(results[1]) || 0;
    },
    hebYear:year=>{
        const d = Math.trunc(year /10) % 10;
        const y = Math.trunc(year) % 10;
        const hd = 'סעפצקרשת'[d];
        const hy = (y==0) ? '' : 'אבגדהוזחטי'[y-1];
        return (y==0) ? `תש"${hd}` : `תש${hd}"${hy}`;
    },
    is_valid_email : s=> {
        if (!s) return false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
        return emailReg.test(s);
    },
    is_valid_phone : (s, is_cel) =>{
        if (!s) return false;
        if (s.startsWith('972')) {s = s.substring(3); if ('0123456789'.indexOf(s[0])==-1) s=s.substring(1);}
        if (s.startsWith('+972')) {s = s.substring(4); if ('0123456789'.indexOf(s[0])==-1) s=s.substring(1);}
        if (!s.startsWith('0')) s = '0' + s;
        if (s.length < 9) return false;
        if (s[0] != '0') return false;
        if (is_cel && s[1] != '5') return false;
        var number = '';
        if ('23489'.indexOf(s[1]) >-1) number = s.substring(2); 
        if ('57'.indexOf(s[1]) >-1) number = s.substring(3);
        var idx = 0;
        for(var i=0; i <number.length; i++) {
            if ('0123456789'.indexOf(number[i])>-1) break;
            idx ++;
        }
        var n = number.substring(idx);
        for(var i=0; i <n.length; i++) {    
            if ('0123456789'.indexOf(n[i])==-1) return false;
        }
        if (n.length != 7) return false;
        return true;
    },
    dataURItoBlob:(dataURI)=> {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    },
    extract_file_name:(full_name)=>{
        return (full_name||'').replace(/\.[^\/.]+$/, '');
    },
    extract_file_extension:(full_name)=>{
        return (full_name||'').split('.').pop();
    },
    random_str:(len, set)=>{
        var text = "";
        var set = set || "0123456789";
        var len = len || 5;
        for(var i=0; i < len; i++) text += set.charAt(Math.floor(Math.random() * set.length));
        return text;
    },
    value_if_empty:(value, if_empty)=>{
        if (!value) return if_empty;
        if (('' + value).trim() == '') return if_empty;
        return value;
    },
    datetime_str:(d)=>{
        return [d.getMonth()+1,
            d.getDate(),
            d.getFullYear()].join('/')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
    }
}

const APP_GLOBAL = {
    PIC_STATUS : {
        INITIAL : 0,
        SCREEN_REJECTED: 1,
        SCREEN_ACCEPTED: 2,
        QUALITY_SCREEN_REJECTED: 3,
        QUALITY_SCREEN_ACCEPTED: 4
    }
}

var app = {
    dat:{
        srv_url: 'https://script.google.com/macros/s/AKfycbwMGsMJED0mc1xaJResbTz__WyC11EC2kAJbkZ0qaMbUu4SFZhpOVPDSLojk_YNrmXDtw/exec',
        server_load_response: null,
        user:null,
        pics:{
            to_screen:null,
            to_quality_screen:null,
            to_score:null
        },
        uploads_in_progress:{},
        idx:{
            campaign_by_id:{}
        }
    },
    is_mobile: false,
    please_wait:(visible)=>{
        $('#mask_div').toggle(Boolean(visible));
        $('#mask_div').off("click").on("click", ()=>{$('#mask_div').animate({opacity:1},10,()=>{$('#mask_div').animate({opacity:0.5},500)})});
    },
    pop_err:(msg, is_html)=>{
        swal($.extend({type:"error", title:"בעיה :(", confirmButtonText: "סגור"}, (is_html)?{html:msg}:{text:msg}));
        if (!is_html) console.log(msg);
    },
    pop_success:(msg, timer)=>{
        swal({type:'success',html:msg||'הצליח :)', timer:timer});
    },
    pop_js_err:(err)=>{
        var s_stack = String(err.stack);
        s_stack = js.r(s_stack, "\n", "<br>");
        var mail = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent("An error has occurred at " + new Date() + "\n" + err.stack)}&to=zaparton.pics@gmail.com`;
        app.pop_err(`תקלה בביצוע הפעולה<div class="error_code">${s_stack}}<div><a href="${mail}" target="_blank">Send</a></div></div>`, true);
    },
    pop_srv_err:(srv_err)=>{
        const msg = `message from server:\ncode: ${srv_err.code}\nmessage: ${srv_err.desc}`;
        const mtml_msg = js.r(msg, "\n", "<br>");
        var mail = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent("An error has occurred at " + new Date() + "\n" + msg)}&to=zaparton.pics@gmail.com`;
        app.pop_err(`תקלה בביצוע הפעולה<div class="error_code">${mtml_msg}<div><a href="${mail}" target="_blank">Send</a></div></div>`, true);
    },
    clean_google_sheet_array:(array, remove_header_row, null_empty_strings)=>{
        if (remove_header_row) array.shift();
        if (null_empty_strings) {
            $.each(array, (i, item)=>{
                $.each(item, (ii, field)=>{
                    if ("" === (""+field).trim()) array[i][ii] = null;
                })
            });
        }
    },
    post: (postdata, callback, no_animation)=>{
        please_wait = callback.please_wait || app.please_wait;
        if (!no_animation) please_wait(true);
        const ex_postdata = {is_mobile:js.is_mobile()};
        try{
            $.ajax({
                type: 'POST',
                url: app.dat.srv_url,
                accept: 'application/json',
                contentType: 'text/plain',
                async:true,
                //timeout: 10000,
                cache: false,
                data: JSON.stringify($.extend(postdata, ex_postdata)),
                success:(response)=>{
                    if (!no_animation) please_wait(false);
                    if (response?.error?.code && response?.error?.code != 0){
                        console.error("app.post.success", `act_id="${postdata.act_id}"`, response.error);
                        if (callback?.on_error_response) callback.on_error_response(response.error);
                    } else {
                        if (callback?.on_success) callback.on_success(response);
                    }
                },
                error: (jqXHR, textStatus, errorThrown)=> {
                    if (!no_animation) please_wait(false);
                    console.error("app.post.error", `act_id="${postdata.act_id}"`, jqXHR, textStatus, errorThrown);
                    if (callback?.on_connect_error) callback.on_connect_error({code:-1, desc:"app.post connection error"});
                    else app.pop_err((errorThrown && errorThrown != '')?errorThrown:"בעית תקשורת" + ": " + postdata.act_id||"unknown act");
                }
            });
        } catch(error) {
            if (!no_animation) please_wait(false);
            console.error("app.post.catch", `act_id="${postdata.act_id}"`, error);
            if (callback?.on_js_error) callback.on_js_error({code:-2, desc:"client side error"});
            else app.pop_js_err(error);
        }
    },
    pages:{
        results:{
            load:()=>{
                $("#page_results").html("");
                var post_data = {
                    act_id: "load_scoring",
                    uid: app.dat.user.uid,
                    otp: app.dat.user.otp,
                    campaign_sub_id: app.dat.campaign.sub_id
                };
                app.post(post_data, {
                    on_success :(response)=>{
                        console.log(response);
                        app.build_scoring_pics(response);
                    }
                });
            }
        }
    },
    build_user_info:(response)=>{
        app.dat.user = {
            uid: response.user[0],
            otp: (js.is_mobile()) ? response.user[7] : response.user[1],
            name: response.user[2],
            permision: {
                screening: js.value_if_empty(response.user[3], 'NONE'),
                quality_screening: js.value_if_empty(response.user[4], 'NONE'),
                scoring: js.value_if_empty(response.user[5], 'NONE'),
                results: Boolean(response.user[6] == "TRUE") || response.user[6]===true
            }
        }
        window.localStorage.setObj("zaparton-judge", app.dat.user);
        $("#user_box_head_name").html(app.dat.user.name);
        $("#user_box_head_id").html(app.dat.user.uid);
        if (app.dat.user.permision.screening == 'NONE') $("#tab_screening").addClass("tab_disabled");
        if (app.dat.user.permision.quality_screening == 'NONE') $("#tab_quality_screening").addClass("tab_disabled");
        if (app.dat.user.permision.scoring == 'NONE') $("#tab_scoring").addClass("tab_disabled");
        if (!app.dat.user.permision.results) $("#tab_results").addClass("tab_disabled");
        $("#page_screening").attr("permision", app.dat.user.permision.screening);
        $("#page_quality_screening").attr("permision", app.dat.user.permision.quality_screening);
        $("#page_scoring").attr("permision", app.dat.user.permision.scoring);
    },
    build_campaign:(response)=>{
        // app.dat.campaign = window.localStorage.getObj("zaparton-judge-campaign") || response.campaign_list[0];
        app.dat.campaign = app.dat.idx.campaign_by_id[response.campaign_sub_id];
        window.localStorage.setObj("zaparton-judge-campaign", app.dat.campaign);
        $("#campaign_title").html(app.dat.campaign.sub_title);
        app.build_theme();
    },
    build_theme:()=>{
        document.documentElement.style.setProperty('--campaign-color', app.dat.campaign.color);
    },
    build_campaign_list:(response)=>{
        app.dat.campaign_list = response.campaign_list;
        app.dat.active_campaign_count = 0;
        $.each(response.campaign_list, (i, campaign)=>{
            app.dat.idx.campaign_by_id[campaign.sub_id] = campaign;
        });
    },
    change_campaign:(campaign)=>{
        app.dat.campaign = campaign;
        window.localStorage.setObj("zaparton-judge-campaign", app.dat.campaign);
        window.location.reload();
    },
    build_campaign_menu:()=>{
        var html = ''
        $.each(app.dat.campaign_list, (i, campaign)=>{
            html += `<div id="bt_campaign_${campaign.sub_id}" class="bt_campaign"><div></div>${campaign.sub_title}</div>`;
        });
        $("#dv_campaign_menu_mask>div").html(html);
        $.each(app.dat.campaign_list, (i, campaign)=>{
            $("#bt_campaign_" + campaign.sub_id + ">div").css("background-color", campaign.color);
            $("#bt_campaign_" + campaign.sub_id).click(()=>{app.change_campaign(campaign)});
        });
    },
    reshow_error_pic:($pic_wrapper, err_class)=>{
        $pic_wrapper.find(".pic_error").hide();
        $pic_wrapper.find(err_class).show();
        const last = $pic_wrapper.parent().children(".pic_wrapper:last");
        if (last.length>0) $pic_wrapper.insertAfter(last);
        $pic_wrapper.slideDown();
    },
    screening:($pic_wrapper, screen_act)=>{
        var post_data = {
            act_id: "screening",
            screen_act: screen_act,
            uid: app.dat.user.uid,
            otp: app.dat.user.otp,
            campaign_sub_id: app.dat.campaign.sub_id,
            pid: $pic_wrapper.attr('pid'),
            echo_idx: $pic_wrapper.attr('echo_idx'),
            file_name: $pic_wrapper.attr('file_name')
        };
        $pic_wrapper.slideUp();
        app.post(post_data,{
            on_success :(response)=>{
                console.log(response);
                app.build_pics(response);
            },
            on_error_response: (error)=>{app.reshow_error_pic($pic_wrapper, '.pic_srv_error')},
            on_connect_error:(error)=>{app.reshow_error_pic($pic_wrapper, '.pic_con_error')},
            on_js_error:(error)=>{app.reshow_error_pic($pic_wrapper, '.pic_js_error')}
        }, true);
    },
    scoring_save:($pic_wrapper)=>{
        var post_data = {
            act_id: "scoring_save",
            uid: app.dat.user.uid,
            otp: app.dat.user.otp,
            campaign_sub_id: app.dat.campaign.sub_id,
            pid: $pic_wrapper.attr('pid'),
            file_name: $pic_wrapper.attr('file_name'),
            echo_idx: $pic_wrapper.attr('echo_idx'),
            score: $pic_wrapper.attr('score')
        };
        $pic_wrapper.slideUp();
        app.post(post_data,{
            on_success :(response)=>{
                console.log(response);
                app.build_pics(response);
            },
            on_error_response: (error)=>{
                app.reshow_error_pic($pic_wrapper, '.pic_srv_error')
            },
            on_connect_error:(error)=>{app.reshow_error_pic($pic_wrapper, '.pic_con_error')},
            on_js_error:(error)=>{app.reshow_error_pic($pic_wrapper, '.pic_js_error')}
        }, true);
    },

    build_pics:(response)=>{
        if (response.campaign_sub_id != app.dat.campaign.sub_id) return;
        app.dat.pics.to_screen = [];
        app.dat.pics.to_quality_screen = [];
        app.dat.pics.to_score = [];
        const push_pic = (target, pic_arr)=>{
            const pic = {
                file_name:pic_arr[2],
                pid:pic_arr[9],
                status: pic_arr[5],
                level: pic_arr[10],
                exif: pic_arr[11],
                echo_idx : pic_arr[0],
                user_info : response.user_info[pic_arr[12]]
            }
            const $pic_exists = $(`.pic_wrapper[pid="${pic.pid}"]`);
            const diff_status = ($pic_exists.length>0 && $pic_exists.attr("status") != pic.status);
            if (diff_status) $pic_exists.remove();
            if ($pic_exists.length == 0 || diff_status) target.push(pic);
        }
        $.each(response.pics.for_screening, (i, pic_arr)=>{push_pic(app.dat.pics.to_screen, pic_arr)});
        $.each(response.pics.for_quality_screening, (i, pic_arr)=>{push_pic(app.dat.pics.to_quality_screen, pic_arr)});
        $.each(response.pics.for_scoring, (i, pic_arr)=>{push_pic(app.dat.pics.to_score, pic_arr)});
     
        var html = ''
        $.each(app.dat.pics.to_screen, (i, pic)=>{ 
            $("#json").html('');
            var exif_html = '<div style="text-align:center">⚠️ No EXIF Attached</div>';
            if (pic.exif != '') {
                var jsonViewer = new JSONViewer();
                document.querySelector("#json").appendChild(jsonViewer.getContainer());
                var json = JSON.parse(pic.exif);
                jsonViewer.showJSON(json, -1, 1);
                exif_html = $("#json").html();
                $("#json").html('');
            }
            exif_html = js.r(exif_html, "DateTimeOriginal", '<span class="exif_highlight">DateTimeOriginal</span>')
            html += 
                `<div class="pic_wrapper" file_name="${pic.file_name}" pid="${pic.pid}" status="${pic.status}" echo_idx="${pic.echo_idx}">` + 
                    `<div class="pic_mask"></div>` + 
                    `<img class="pic" src="${app.dat.server_load_response.aws.s3_bucket_url}/tn/${js.extract_file_name(pic.file_name)}.jpg?rnd=${js.random_str(4)}" />` +
                    `<div class="user_info_box"><div>${pic.user_info.name}</div><div>${pic.user_info.phone}</div><div><a href="mailto:${pic.user_info.email}">${pic.user_info.email}</a></div></div>` +
                    `<div class="exif_box">${exif_html}</div>` +
                    `<div class="pic_toolbox">` + 
                        `<input type="button" class="bt_pic_toolbox bt_accept" value="">` +
                        `<input type="button" class="bt_pic_toolbox bt_reject" value="">` +
                    `</div>` + 
                    `<div class="pic_error pic_js_error">⚠️ הפעולה נכשלה (1)</div>` +
                    `<div class="pic_error pic_srv_error">⚠️ הפעולה נכשלה (2)</div>` +
                    `<div class="pic_error pic_con_error">⚠️ הפעולה נכשלה (בעיית תקשורת)</div>` +
                `</div>`;
        });
        $(html).appendTo($("#page_screening"));
        $("#page_screening .pic").off('click').click((ev)=>{window.open(`${app.dat.server_load_response.aws.s3_bucket_url}/pics/${$(ev.target).closest(".pic_wrapper").attr("file_name")}?rnd=${js.random_str(4)}`)});
        $("#page_screening .bt_accept").off('click').click((ev)=>{app.screening($(ev.target).closest(".pic_wrapper"), APP_GLOBAL.PIC_STATUS.SCREEN_ACCEPTED)});
        $("#page_screening .bt_reject").off('click').click((ev)=>{app.screening($(ev.target).closest(".pic_wrapper"), APP_GLOBAL.PIC_STATUS.SCREEN_REJECTED)});

        var html = ''
        $.each(app.dat.pics.to_quality_screen, (i, pic)=>{ 
            html += 
                `<div class="pic_wrapper" file_name="${pic.file_name}" pid="${pic.pid}" status="${pic.status}"  echo_idx="${pic.echo_idx}">` + 
                    `<div class="pic_mask"></div>` + 
                    `<img class="pic" src="${app.dat.server_load_response.aws.s3_bucket_url}/tn/${js.extract_file_name(pic.file_name)}.jpg" />` +
                    `<div class="pic_toolbox">` + 
                        `<input type="button" class="bt_pic_toolbox bt_accept" value="">` +
                        `<input type="button" class="bt_pic_toolbox bt_reject" value="">` +
                    `</div>` + 
                    `<div class="pic_error pic_js_error">⚠️ הפעולה נכשלה (1)</div>` +
                    `<div class="pic_error pic_srv_error">⚠️ הפעולה נכשלה (2)</div>` +
                    `<div class="pic_error pic_con_error">⚠️ הפעולה נכשלה (בעיית תקשורת)</div>` +
                `</div>`;
        });
        $(html).appendTo($("#page_quality_screening"));
        $("#page_quality_screening .pic").off('click').click((ev)=>{window.open(`${app.dat.server_load_response.aws.s3_bucket_url}/pics/${$(ev.target).closest(".pic_wrapper").attr("file_name")}`)});
        $("#page_quality_screening .bt_accept").off('click').click((ev)=>{app.screening($(ev.target).closest(".pic_wrapper"), APP_GLOBAL.PIC_STATUS.QUALITY_SCREEN_ACCEPTED)});
        $("#page_quality_screening .bt_reject").off('click').click((ev)=>{app.screening($(ev.target).closest(".pic_wrapper"), APP_GLOBAL.PIC_STATUS.QUALITY_SCREEN_REJECTED)});

        var html = ''
        $.each(app.dat.pics.to_score, (i, pic)=>{ 
            html += 
                `<div class="pic_wrapper" file_name="${pic.file_name}" pid="${pic.pid}"  status="${pic.status}"  echo_idx="${pic.echo_idx}">` + 
                    `<div class="pic_mask"></div>` + 
                    `<img class="pic" src="${app.dat.server_load_response.aws.s3_bucket_url}/tn/${js.extract_file_name(pic.file_name)}.jpg" />` +
                    `<div class="pic_toolbox">` + 
                        `<input disabled type="button" class="bt_pic_toolbox bt_save_score" value="">` +
                        `<input type="button" class="bt_star" score="5" value="5">` +
                        `<input type="button" class="bt_star" score="4" value="4">` +
                        `<input type="button" class="bt_star" score="3" value="3">` +
                        `<input type="button" class="bt_star" score="2" value="2">` +
                        `<input type="button" class="bt_star" score="1" value="1">` +
                    `</div>` + 
                    `<div class="pic_error pic_js_error">⚠️ הפעולה נכשלה (1)</div>` +
                    `<div class="pic_error pic_srv_error">⚠️ הפעולה נכשלה (2)</div>` +
                    `<div class="pic_error pic_con_error">⚠️ הפעולה נכשלה (בעיית תקשורת)</div>` +
                `</div>`;
        });
        $(html).appendTo($("#page_scoring"));
        $("#page_scoring .pic").off('click').click((ev)=>{window.open(`${app.dat.server_load_response.aws.s3_bucket_url}/pics/${$(ev.target).closest(".pic_wrapper").attr("file_name")}`)});
        $("#page_scoring .bt_star").off('click').click((ev)=>{
            const score = $(ev.target).attr("score");
            const $pic_wrapper = $(ev.target).closest(".pic_wrapper");
            $pic_wrapper.attr("score", score);
            $pic_wrapper.find('.bt_save_score').prop("disabled", score == 0);
        });
        $("#page_scoring .bt_save_score").off('click').click((ev)=>{app.scoring_save($(ev.target).closest(".pic_wrapper"))});

    },
    build_scoring_pics:(response)=>{
        if (response.campaign_sub_id != app.dat.campaign.sub_id) return;
        const judges = response.judges;
        const pobj = {};
        $.each(response.scoring, (i, pic_arr)=>{
            var pic = pobj[pic_arr[1]];
            if (!pic) {
                pic = {
                    pid : pic_arr[1],
                    file_name : pic_arr[4],
                    echo_idx: pic_arr[5],
                    scoring : [],
                    score : 0
                }
                pobj[pic.pid] = pic;
            }
            if (pic_arr[5] != '') pic.echo_idx = pic_arr[5];
            pic.scoring.push({
                judge: judges[pic_arr[0]],
                score: parseInt(pic_arr[2])
            });
        });
        const pics = [];
        $.each(pobj, (pid, pic)=>{
            var total = 0;
            $.each(pic.scoring, (uid, item)=>{total += item.score});
            pic.score = total / pic.scoring.length;
            pics.push(pic);
        });
        pics.sort((a, b) => b.score - a.score);
        var html = ''
        $.each(pics, (i, pic)=>{ 
            var score_tooltip = '';
            $.each(pic.scoring, (uid, item)=>score_tooltip+=`<div>${item.judge.name}:&nbsp;<b>${item.score}</b></div>`);
            score_tooltip = `<div class="score_tooltip">${score_tooltip}</div>`
            html += 
                `<div class="pic_wrapper" file_name="${pic.file_name}" pid="${pic.pid}"  score="${pic.score}" echo_idx="${pic.echo_idx}">` + 
                    `<img class="pic" src="${app.dat.server_load_response.aws.s3_bucket_url}/tn/${js.extract_file_name(pic.file_name)}.jpg" />` +
                    `<div class="pic_toolbox scoring_info">` + 
                        `<div><div class="scoring_info_title">ניקוד:</div><div class="scoring_info_value">${pic.score}</div></div>` + 
                        `<div class="tooltip"><div class="scoring_info_title">שופטים:</div><div class="scoring_info_value">${pic.scoring.length}</div><span class="tooltiptext">${score_tooltip}</span></div>` + 
                        `<div><input title="מידע נוסף" type="button" class="bt_pic_toolbox bt_info" value=""></div>` + 
                     `</div>` +
                 `</div>`;
        });
        $("#page_results").html(html);
        $(".bt_pic_toolbox.bt_info").click(ev=>app.load_pic_info($(ev.target).closest(".pic_wrapper")));
    },
    load_pic_info:($pic_wrapper)=>{
        var post_data = {
            act_id: "load_pic_info",
            uid: app.dat.user.uid,
            otp: app.dat.user.otp,
            campaign_sub_id: app.dat.campaign.sub_id,
            pid : $pic_wrapper.attr("pid"),
            echo_idx : $pic_wrapper.attr("echo_idx"),
        };
        console.log(post_data);
        app.post(post_data, {
            on_success :(response)=>{
                swal({
                    html: 
                    `<div class="pic_info_line"><div class="pic_info_title">צולם ע"י:</div><div class="pic_info_value">${response.user[3]}</div></div>` +
                    `<div class="pic_info_line"><div class="pic_info_title">עלה לאתר ב:</div><div class="pic_info_value" style="direction:ltr">${js.datetime_str(new Date(response.pic[7]))}</div></div>` 
                    ,
                    showCancelButton: false, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'סגור',
                });
                console.log(response);
            }
        });
},
    rebuild:(response)=>{
        app.dat.server_load_response = JSON.parse(JSON.stringify(response));
        app.build_user_info(response);
        app.build_campaign_list(response);
        app.build_campaign_menu();
        app.build_campaign(response);
        app.build_pics(response);
        app.scroll_home();
        app.on_after_rebuild?.call();
    },
    scroll_home:()=>{
        $("#main_box")[0].scrollTo({top: 0, behavior: 'smooth'});
    },
    clear:()=>{
        $("#user_box_head_name").html('');
        $("#user_box_head_id").html('');
        app.dat.user = null;
        app.dat.pics = {
            to_screen:null,
            to_quality_screen:null,
            to_score:null
        };
        app.dat.campaign = null;
    },
    clear_storage:()=>{
        window.localStorage.setObj("zaparton-judge", null);
    },
    changed:()=>{
        return false;
        // return $(".user_toolbox_enabled").length > 0;
    },
    show_login_page:()=>{
        $("#eb_login").val("");
        $("#eb_login_2").val("");
        $("#frm_login").show();
        $("#frm_login_2").hide();
        $("#dv_login").fadeIn();
    },
    logout:()=>{
        app.clear_storage();
        window.location.reload();
    },
    help_message_txt:{
        welcome: 
            '<div id="help_welcome">' + 
            '<div class="help_paragraph">טקסט הסבר קצר על אופן השימוש.</div>' +
            '<div class="help_nagging"><input id="cb_help_welcome_nagging" type="checkbox" checked="true" /><label for="cb_help_welcome_nagging">הבנתי, אין צורך להציג הודעה זו שוב.</label></div>' +
            '</div>'
    },
    help_message:{
        show_welcome: ()=>{
            const nag_status = window.localStorage.getObj('zaparton-help_message-nag_status') || {};
            if (!nag_status.welcome) swal({
                title: `${app.dat.user.name}, ברוכים הבאים :)`,
                html: app.help_message_txt.welcome,
                showCancelButton: false, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'סגור',
            }).then(function(result){
                nag_status.welcome = $('#help_welcome .help_nagging>input[type="checkbox"]').is(":checked");
                window.localStorage.setObj("zaparton-help_message-nag_status", nag_status);
            });
        },
        show_signup: ()=>{
            const nag_status = window.localStorage.getObj('zaparton-help_message-nag_status') || {};
            if (!nag_status?.signup) swal({
                title: 'אחלה :)',
                html: app.help_message_txt.signup,
                showCancelButton: false, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'סגור',
            }).then(function(result){
                nag_status.signup = $('#help_signup .help_nagging>input[type="checkbox"]').is(":checked");
                window.localStorage.setObj("zaparton-help_message-nag_status", nag_status);
            });
        },
    },
    login:(uid, otp, on_connect_error, on_user_not_found)=>{
        $(".dv_login_error_msg").hide();
        app.clear();
        uid = uid || $("#eb_login").val().trim();
        otp = otp || $("#eb_login_2").val().trim();
        var post_data = {
            act_id: "login",
            user_type: "judge",
            campaign_sub_id: window.localStorage.getObj("zaparton-judge-campaign")?.sub_id,
            uid: uid,
            otp: otp
        };
        if (uid == "") return;
        if (otp == "") return;
        app.post(post_data,{
            on_success :(response)=>{
                app.rebuild(response);
                $("#dv_login").fadeOut();
                $("#user").fadeIn();
                app.default_view();
                // app.help_message.show_welcome();
             }, 
            on_error_response: (error)=>{
                if (error.code == 4) {
                    if (on_user_not_found) on_user_not_found();
                    else app.pop_err("המערכת לא זיהתה את הקוד שהוקלד");
                } else app.pop_err('השרת מדווח על תקלה בביצוע הפעולה');
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
            act_id: "login_judge_request",
            user_type: "judge",
            uid: uid
        };
        app.post(post_data,{
            on_success :(response)=>{
                console.log(response);
                if (response.user_exists) {
                    $("#frm_login").hide();
                    $("#frm_login_2").fadeIn();
                } else {
                    app.pop_err("משתמש לא נמצא");
                }
            },
            on_error_response: (error)=>{
                app.pop_err('השרת מדווח על תקלה בביצוע הפעולה');
            }
        });
    },
    toggle_menu:()=>{
        const ratio = $("#header").width() / $("#header_title_1>span").width();
        const shrink = Boolean(ratio>2.15);
        $("#head_toolbox").toggle(shrink);
        $("#head_toolbox_ico").toggle(!shrink);
    },
    init_scroll:()=>{
        $("#user_box").on("scroll", ()=>{
            var st = $("#user_box")[0].scrollTop;
            var hc = $("#user_box").hasClass("head_shrink");
            if (st>250 && !hc) $("#user_box").addClass("head_shrink");
            if (st<50 && hc) $("#user_box").removeClass("head_shrink");
        });
        $("#main_box").on("scroll", ()=>{
            var st = $("#main_box")[0].scrollTop;
            var hc = $("#main_box").hasClass("head_shrink");
            if (st>120 && !hc) $("#main_box").addClass("head_shrink");
            if (st<50 && hc) $("#main_box").removeClass("head_shrink");
        });
    },
    change_tab(tab_id){
        if ($(`#side_menu>div[tab_id=${tab_id}].selected`).length>0) return;
        if ($(`#side_menu>div[tab_id=${tab_id}].disabled`).length>0) return;
        $("#main_box div[tab_id]").hide();
        $(`#main_box div[tab_id=${tab_id}]`).fadeIn();
        $("#side_menu>div[tab_id]").removeClass("selected");
        $(`#side_menu>div[tab_id=${tab_id}]`).addClass("selected");
    },
    init_buttons: ()=>{
        $(".dv_login_logo").click(()=>{
            console.log('boo');
            var pr = new Pic(3);
            pr.greet();
            pr.logit();
            pr.log_3();
            // var pic = new Pic(22);
            // pic.log_4();
            // pic.log_1();
            // pic.log_2();
            // pic.log_3();
        });
        $("#bt_home").click(app.scroll_home);
        $("#frm_login").submit((e)=>{
            e.preventDefault(e);
            app.login_request();
        });
        $("#frm_login_2").submit((e)=>{
            e.preventDefault(e);
            app.login();
        });
        $("#head_bt_exit").click(()=>{
            app.logout();
        });
        $("#head_bt_contact").click(()=>{
            window.open("https://chat.whatsapp.com/Bq5DjkU7uBL9ntJuuDcuCp");
        });
        $("#head_bt_feedback").click(()=>{
            window.open("https://forms.gle/GsKDPFPszqFMJjsHA");
        });
        $("#head_toolbox_ico").click(()=>{
            $("#head_toolbox").show();
        });
        $(".abort_upload").click((e)=>{
            app.abort_upload($(e.target).closest(".pic_band"));
        });
        $("#side_menu>div").click((e)=>{
            app.change_tab($(e.target).closest("div[tab_id]").attr("tab_id"));
        });
        $(".checkbox_wrapper").click((e)=>{
            $(e.target).find("input[type=checkbox]").click();
        });
        $("#bt_frm_profile_save").click((e)=>{
            app.save_profile();
        });
    },
    init_user: ()=>{
        app.dat.user = window.localStorage.getObj("zaparton-judge");
        console.log("app.init_user", app.dat.user);
    },
    show_screen_message: msg=>{
        $("#dv_screen_message").fadeIn();
        $("#dv_screen_message_txt").html(msg);
    },
    init_mode: ()=> {
        app.dat.mode = js.urlParam("mode");
        console.log("mode=", app.dat.mode);
        $("body").addClass("mode_" + app.dat.mode);
        if (app.dat.mode) $("#ttl_mode").html(app.dat.mode).show();
    },
    init_resize: ()=>{
        new ResizeObserver(app.toggle_menu).observe($("#header")[0]);
        $("#head_toolbox").mouseleave(app.toggle_menu);
    },
    update_status_stages:{
        UPLOAD: [10, 10, 20, 50, 10],
        DELETE: [0, 100]
    },
    update_upload_status:($band, text, stages, stage, stage_progress_percent)=>{
        const start_with = (stage==1)?0:stages.slice(0, stage-1).reduce((a,b)=>a+b);
        const step = (stages[stage-1]*stage_progress_percent)/100;
        const $progress = $band.find(".upload_progress");
        const overall_percent = Math.trunc(start_with + step);
        $progress.css('background', `linear-gradient(to left, #ffffff ${100-overall_percent}%, blue 0%)`);
        $progress.attr("progress", overall_percent + "%");
        $band.find(".upload_status").html(text + '...');
    },
    init_drop_zone:(drop_zone)=>{
        const inputElement = $(drop_zone).find("input[type='file']")[0];
        const img = $(drop_zone).find("img")[0];
        const p = $(drop_zone).find("p")[0];
        const $thumb_loader = $(drop_zone).find(".img_thumb_loader");
        const load_file = (file)=>{
            if (!file) return;
            $thumb_loader.fadeIn(()=>{
                const $band = $(drop_zone).closest('.pic_band');
                app.update_upload_status($band, 'מעבד צלמית', app.update_status_stages.UPLOAD, 1, 0);
                const $progress = $band.find(".upload_progress");
                const slot_idx = $band.attr("slot_idx");
                const uniqueFileName = ('' + app.dat.user.number + slot_idx + '.' + file.name.split('.').pop()).toLowerCase(); 
                img.style = "display:block;";
                p.style = 'display: none';
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    const result = reader.result;
                    let src = this.result;
                    // img.src = src;
                    // img.alt = file.name
                    tmp_img = new Image();
                    tmp_img.src = src;
                    tmp_img.addEventListener("load", function () {
                        app.show_pic_mask(slot_idx);
                        EXIF.getData(tmp_img, function() {
                            // console.log(EXIF.getTag(this, "Make"));
                            // console.log(EXIF.getTag(this, "Model"));
                            // console.log(EXIF.getTag(this, "DateTimeOriginal"));
                            // console.log(EXIF.getTag(this, "GPSInfo"));
                        });
                        var thumbnailImage = app.createThumbnail(tmp_img);
                        img.src = thumbnailImage;
                        img.alt = file.name;
                        $thumb_loader.fadeOut();
                        app.update_upload_status($band, 'מעבד צלמית', app.update_status_stages.UPLOAD, 1, 100);
                        
                        const file_inf = {
                            slot: slot_idx,
                            file_name: uniqueFileName,
                            org_file_name: file.name,
                            $band: $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot_idx}]`),
                            $pic_status: $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot_idx}] .frm_section_row[pic_status]`),
                            thumbnail_file_name: js.extract_file_name(uniqueFileName) + '.jpg',
                            thumbnail: thumbnailImage,
                            file:file
                        }
                        app.update_pic_upload_status(file_inf.slot, 'uploading');
                        // file_inf.$pic_status.attr('pic_status', 'uploading')
                        app.pic_mngr.clear_pic_space(file_inf, ()=>{
                            app.dat.pics[file_inf.slot-1] = null;
                            app.pic_mngr.upload_thumbnail(file_inf, ()=>{
                                app.pic_mngr.upload_pic(file_inf, ()=>{
                                    app.pic_mngr.save_pic(file_inf, (new_pic)=>{
                                        app.dat.pics[slot_idx-1] = new_pic;
                                        app.build_pic(slot_idx, new_pic);
                                        // app.update_pic_upload_status(file_inf.slot, 'ok');
                                        // app.show_pic_mask(slot_idx, file_inf.file_name, true);
                                        // app.set_pic_status(slot_idx, 0);
                                        // file_inf.$pic_status.attr('pic_status', 'ok')
                                    })
                                })
                            })
                        });
                    });
                }

            });
        }
        inputElement.addEventListener('change', (e)=> {
            load_file(inputElement.files[0]);
        })
        drop_zone.addEventListener('click', () => inputElement.click());
        drop_zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        drop_zone.addEventListener('drop', (e) => {
            e.preventDefault();
            load_file(e.dataTransfer.files[0]);
        });
    },
    init_drop_zones:()=>{
        $(".drop_zone").each((i, drop_zone)=>{app.init_drop_zone(drop_zone)});
    },
    init: ()=>{
        console.log("app.init")
        $("#user").hide();
        $("#dv_login").hide();
        $("#dv_screen_message").hide();
        app.init_scroll();
        app.init_buttons();
        app.init_resize();
        app.init_user();
        app.init_mode();
        if (app.dat.user) {
            app.login(app.dat.user.uid, app.dat.user.otp, 
                ()=>{app.show_screen_message("אין תקשורת עם השרת :(")}, 
                ()=>{app.logout();}
            );
        } else {
            app.show_login_page();
        }
        $("body").show();
        app.init_drop_zones();
    },
    start: ()=>{
        if (js.is_mobile()) {
            if (window.location.href.toLowerCase().indexOf("mobile.html")<0) {
                const query = window.location.href.split('?')[1]||'';
                window.location.href = "mobile.html" + ((query == '') ? '' : "?" + query);
            }
        } else {
            app.init();
        }
    }
}

$(app.start)
