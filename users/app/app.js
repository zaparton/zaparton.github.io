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
    calculateAge:(s_birthday)=> {
        var now = new Date();
        var past = new Date(s_birthday);
        var nowYear = now.getFullYear();
        var pastYear = past.getFullYear();
        var age = nowYear - pastYear;
        return age;
    },
    null_if_empty:(s)=>{
        if (s) {
            s = '' + s;
            if (s.trim() == '') return null;
        }
        return s;
    },
    date_html_input_format:(date)=>{
        const dt = date || new Date();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var y = dt.getFullYear();
        if(m < 10) m = '0' + m.toString();
        if(d < 10) d = '0' + d.toString();
        return `${y}-${m}-${d}`;
    }
}

const APP_GLOBAL = {
    PAGES:{
        PROFILE : 1,
        PICS : 2,
        NEWS : 3
    },
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
        pics:[],
        uploads_in_progress:{}
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
        return array;
    },
    post: (postdata, callback, no_animation)=>{
        please_wait = callback.please_wait || app.please_wait;
        if (!no_animation) please_wait(true);
        const ex_postdata = {
            is_mobile:js.is_mobile(),
            echo_idx:window.localStorage.getObj('zaparton-echo-idx'),
            client_ver:2023092400
        };
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
    createThumbnail: (image)=> {
        var originalFileDataUrl = "";
        var thumbnailMaxWidth = 600;
        var thumbnailMaxHeight = 450;
                var canvas, ctx, thumbnail, thumbnailScale, thumbnailWidth, thumbnailHeight;
        // create an off-screen canvas
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    
        //Calculate the size of the thumbnail, to best fit within max/width (cropspadding)
        thumbnailScale = (image.width / image.height) > (thumbnailMaxWidth / thumbnailMaxHeight) ?
            thumbnailMaxWidth / image.width :
            thumbnailMaxHeight / image.height;
        thumbnailWidth = image.width * thumbnailScale;
        thumbnailHeight = image.height * thumbnailScale;
    
        // set its dimension to target size
        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;
    
        // draw source image into the off-screen canvas:
        ctx.drawImage(image, 0, 0, thumbnailWidth, thumbnailHeight);
    
        //Draw border (optional)
        ctx.rect(0, 0, thumbnailWidth, thumbnailHeight - 1);
        ctx.strokeStyle = "#555555";
        ctx.stroke();
        return canvas.toDataURL('image/jpeg', 1);
    
        // encode image to data-uri with base64 version of compressed image
        thumbnail = new Image();
        thumbnail.src = canvas.toDataURL('image/jpeg', 70);
        return thumbnail;
    },
    abort_upload:($band)=>{
        const slot_idx = $band.attr("slot_idx");
        // console.log(app.dat.uploads_in_progress[slot_idx]);
        app.dat.uploads_in_progress[slot_idx].abort();
    },
    pic_mngr : {
        on_error_level_1:(slot, error, msg)=>{
            $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row.pic_contest_status`).hide();
            $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row.pic_actions`).hide();
            $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row[pic_status]`).hide();
            const msg_code = (error?.code) ? `&nbsp;#${error?.code}` : '';
            $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_error`).html(msg || 'תקלה בביצוע הפעולה :(' + msg_code);
            $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_error`).show();
            app.disable_pic_mask(slot);
            console.log(`on_error_level_1: slot:${slot}, code:${error?.code}, desc:${error?.desc}`);
        },
        on_error_level_2:(slot, text)=>{
            console.log(`on_error_level_2: slot:${slot}, text:${text}`);
        },
        restore_pic_click:(e)=>{
            const slot = $(e.target).closest('.pic_band').attr("slot_idx");
            app.build_pic(slot, app.dat.pics[slot-1]);
        },
        delete_pic:(file_inf, next)=>{
            app.update_pic_upload_status(file_inf.slot, 'uploading');
            app.update_upload_status(file_inf.$band, 'מוחק תמונה...', app.update_status_stages.DELETE, 2, 0);
            var post_data = {
                act_id: "delete_pic",
                uid: app.dat.user.uid,
                otp: app.dat.user.otp,
                slot: file_inf.slot
            };
            const callback = {
                on_error_response: (error)=>{ 
                    if (error?.code == 7 || error?.code == 8 || error?.code == 13) app.pic_mngr.on_error_level_1(file_inf.slot, error, error.desc); 
                    else app.pic_mngr.on_error_level_1(file_inf.slot, error); 
                },
                on_connect_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_js_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_success : (response)=>{
                    window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
                    app.animate_upload_status(file_inf.$band, 'מוחק תמונה...', app.update_status_stages.DELETE, 2, 10, 100, ()=>{
                        app.dat.pics[file_inf.slot-1] = null;
                        next();
                    });
                    /*
                    app.update_upload_status(file_inf.$band, 'מוחק תמונה...', app.update_status_stages.DELETE, 2, 100);
                    app.dat.pics[file_inf.slot-1] = null;
                    next();
                    */
                }
            }
            app.post(post_data, callback, true);
        },
        clear_pic_space:(file_inf, next)=>{
            app.update_upload_status(file_inf.$band, 'בודק הרשאות...', app.update_status_stages.UPLOAD, 2, 0);
            var post_data = {
                act_id: "delete_pic",
                uid: app.dat.user.uid,
                otp: app.dat.user.otp,
                slot: file_inf.slot,
                file_name: file_inf.file_name,
                thumbnail_file_name: file_inf.thumbnail_file_name
            };
            const callback = {
                on_error_response: (error)=>{ 
                    if (error?.code == 7 || error?.code == 8 || error?.code == 13) app.pic_mngr.on_error_level_1(file_inf.slot, error, error.desc); 
                    else app.pic_mngr.on_error_level_1(file_inf.slot, error); 
                },
                on_connect_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_js_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_success : (response)=>{
                    window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
                    app.update_upload_status(file_inf.$band, 'בודק הרשאות...', app.update_status_stages.UPLOAD, 2, 100);
                    next(response);
                }
            }
            app.post(post_data, callback, true);
        },
        /*
        upload_thumbnail:(file_inf, next)=>{
            const bucket = new AWS.S3(app.dat.server_load_response.aws.s3_bucket_cred);
            var blobData = js.dataURItoBlob(file_inf.thumbnail);
            var data = {
                Bucket: "zaparton",
                Key: 'tn/' + file_inf.thumbnail_file_name, 
                Body: blobData,
                ContentType: 'image/jpeg'
            };
            app.update_upload_status(file_inf.$band, 'מעלה צלמית', app.update_status_stages.UPLOAD, 3, 0);
            app.dat.uploads_in_progress[file_inf.slot] = bucket.upload(data, function(err, data){
                if (err) app.pic_mngr.on_error_level_1(file_inf.slot, err)
                else next()
            }).on('httpUploadProgress', (progress)=> {
                app.update_upload_status(file_inf.$band, 'מעלה צלמית', app.update_status_stages.UPLOAD, 3, Math.round(progress.loaded / progress.total * 100));
            });
        },
        upload_pic:(file_inf, next)=>{
            const bucket = new AWS.S3(app.dat.server_load_response.aws.s3_bucket_cred);
            var data = {
                Bucket: "zaparton",
                Key: 'pics/' + file_inf.file_name, 
                Body: file_inf.file,
                ContentType: file_inf.file.type
            };
            app.update_upload_status(file_inf.$band, 'מעלה תמונה', app.update_status_stages.UPLOAD, 4, 0);
            app.dat.uploads_in_progress[file_inf.slot] = bucket.upload(data, function(err, data){
                if (err) app.pic_mngr.on_error_level_1(file_inf.slot, err)
                else next()
            }).on('httpUploadProgress', (progress)=> {
                app.update_upload_status(file_inf.$band, 'מעלה תמונה', app.update_status_stages.UPLOAD, 4, Math.round(progress.loaded / progress.total * 100));
            });
        },
        */
        upload_file: opt =>{
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', opt.pre_signed_url, true);
            xhr.onload = ()=> {
              if (xhr.status === 200) opt.on_complete();
              else opt.on_error(xhr.statusText);
            }
            xhr.onerror = ()=> opt.on_error(xhr.statusText);
            xhr.upload.onprogress = event => {
              if (event.lengthComputable) opt.on_progress(Math.round(event.loaded / event.total * 100));
            };
            xhr.setRequestHeader('Content-Type', opt.file.type);
            xhr.send(opt.file);
            return xhr;
        },
        upload_thumbnail:(file_inf, next)=>{
            const opt = {
                pre_signed_url: file_inf.pre_signed_urls.thumbnail,
                file: js.dataURItoBlob(file_inf.thumbnail),
                on_progress: progress => app.update_upload_status(file_inf.$band, 'מעלה צלמית', app.update_status_stages.UPLOAD, 3, progress),
                on_complete: next,
                on_error: err => app.pic_mngr.on_error_level_1(file_inf.slot, err)
            }
            app.update_upload_status(file_inf.$band, 'מעלה צלמית', app.update_status_stages.UPLOAD, 3, 0);
            app.dat.uploads_in_progress[file_inf.slot] = app.pic_mngr.upload_file(opt);
        },
        upload_pic:(file_inf, next)=>{
            const opt = {
                pre_signed_url: file_inf.pre_signed_urls.pic,
                file: file_inf.file,
                on_progress: progress => app.update_upload_status(file_inf.$band, 'מעלה תמונה', app.update_status_stages.UPLOAD, 4, progress),
                on_complete: next,
                on_error: err => app.pic_mngr.on_error_level_1(file_inf.slot, err)
            }
            app.update_upload_status(file_inf.$band, 'מעלה תמונה', app.update_status_stages.UPLOAD, 4, 0);
            app.dat.uploads_in_progress[file_inf.slot] = app.pic_mngr.upload_file(opt);
        },
        save_pic:(file_inf, next)=>{
            app.update_upload_status(file_inf.$band, 'שומר שינויים', app.update_status_stages.UPLOAD, 5, 0);
            var post_data = {
                act_id: "save_pic",
                uid: app.dat.user.uid,
                otp: app.dat.user.otp,
                slot: file_inf.slot,
                file_name: file_inf.file_name,
                org_file_name: file_inf.org_file_name,
                exif:JSON.stringify(file_inf.exif)
            };
            const callback = {
                on_error_response: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_connect_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_js_error: (error)=>{ app.pic_mngr.on_error_level_1(file_inf.slot, error); },
                on_success : (response)=>{
                    window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
                    app.animate_upload_status(file_inf.$band, 'שומר שינויים', app.update_status_stages.UPLOAD, 5, 10, 100, ()=>{
                        next(response.new_pic);
                    });
                    /*
                    app.update_upload_status(file_inf.$band, 'שומר שינויים', app.update_status_stages.UPLOAD, 5, 100);
                    next(response.new_pic);
                    */
                }
            }
            app.post(post_data, callback, true);
        },
    },
    update_pic_upload_status(slot, status){
        $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row.pic_contest_status`).hide();
        $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row.pic_actions`).hide();
        app.set_pic_status_idle_button(slot, status);
        const $pic_status = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row[pic_status]`);
        $pic_status.hide();
        $pic_status.attr('pic_status', status);
        $pic_status.slideDown();
    },
    set_pic_status_idle_button(slot, status){
        const $pic_status = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row[pic_status]`);
        $pic_status.attr('pic_status', status);
        const $dropzone = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .drop_zone`);
        if (status == 'idle') $pic_status.click(()=>{$dropzone.click()});
        else $pic_status.unbind('click');
    },
    set_pic_status(slot, status_code){
        const $pic_score_status = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .frm_section_row[pic_contest_status]`);
        const contest_status = 
            (status_code == 1) ? 'filter_rejected' : 
            (status_code == 2) ? 'filter_quality_idle' : 
            (status_code == 3) ? 'filter_quality_rejected' : 
            (status_code == 4) ? 'filter_score_idle' : 'filter_idle'; 
        $pic_score_status.attr('pic_contest_status', contest_status);
        $pic_score_status.css('display', 'flex');
        const $pic_score_actions = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_actions`);
        if (contest_status == 'filter_idle') 
            $pic_score_actions.css('display', 'flex');
            else $pic_score_actions.css('display', 'none');
        $bt_delete = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_actions .bt_pic_delete`);
        $bt_delete.click((e)=>{
            swal({
                title: 'מחיקת תמונה',
                html: "רגע... רגע...<br>למחוק את התמונה?",
                showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'כן', cancelButtonText: 'לא',
                onAfterClose:()=>{if (swal.ok) do_logout();}
            }).then(function(result){
                if (result.dismiss) return;
                const file_inf = {
                    slot: slot,
                    $band: $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}]`)
                }
                app.pic_mngr.delete_pic(file_inf, ()=>{
                    app.build_pic(slot);
                });
            });
        });
    },
    disable_pic_mask(slot){
        const $pic_box_mask = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_box_mask`);
        $pic_box_mask.removeClass('pic_box_mask_link');
        $pic_box_mask.off('click').click((ev)=>{
            $pic_box_mask.unbind('click');
            app.pic_mngr.restore_pic_click(ev);
        });
        $pic_box_mask.addClass('mask_disabled');
    },
    show_pic_mask(slot, fname, as_link){
        const $pic_box_mask = $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_box_mask`);
        if (as_link) {
            $pic_box_mask.addClass('pic_box_mask_link');
            $pic_box_mask.click(()=>{window.open(`${app.dat.server_load_response.aws.s3_bucket_url}/pic/${fname}?rnd=${js.random_str(4)}`)});
        } else {
            $pic_box_mask.removeClass('pic_box_mask_link');
            $pic_box_mask.unbind('click');
        }
        $pic_box_mask.show();
    },
    build_pic(slot, file_item){
        $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}]`).html($("template#pic-band").html());
        $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_box_title`).html(`תמונה מס' ${slot}`)
        app.init_drop_zone($(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .drop_zone`)[0]);
        $(`#pic_boxes_wrapper .pic_band[slot_idx=${slot}] .pic_error`).off("click").click(app.pic_mngr.restore_pic_click);
        app.set_pic_status_idle_button(slot, 'idle');
        if (file_item) {
            const fname = js.extract_file_name(file_item[2]);
            const img = $(`#pic_boxes_wrapper div[slot_idx=${file_item[1]}] img`);
            img.attr('src', `${app.dat.server_load_response.aws.s3_bucket_url}/tn/${fname}.jpg?rnd=${js.random_str(4)}`);
            img.attr('alt', `${app.dat.server_load_response.aws.s3_bucket_url}/pic/${file_item[3]}?rnd=${js.random_str(4)}`);
            img.attr('title', `${app.dat.server_load_response.aws.s3_bucket_url}/pic/${file_item[3]}?rnd=${js.random_str(4)}`);
            $(`#pic_boxes_wrapper div[slot_idx=${file_item[1]}] p`).hide();
            app.set_pic_status_idle_button(file_item[1], 'ok');
            img.fadeIn();
            app.set_pic_status(file_item[1], file_item[5]);
            app.show_pic_mask(file_item[1], file_item[2], true);
            if (file_item[5] != '0') $("#sl_level").prop("disabled", true);
        }
    },
    build_pics:(response)=>{
        app.dat.pics = response.pics;
        for (let i = 1; i <= 3; i++) {app.build_pic(i);};
        $.each(app.dat.pics, (i, item)=>{if (item) app.build_pic(item[1], item)});
    },
    get_news_section_html:(txt,dt)=>{
        return `<div class="frm_section"><div class="frm_section_box frm_info_box"><div class="frm_info_box_content">${txt}</div><div class="frm_info_box_date">${dt}</div></div></div>`;
    },
    build_news:(response)=>{
        app.dat.news = app.clean_google_sheet_array(response.news, true);
        var html = '';
        $.each(app.dat.news.reverse(), (i, item)=>{
            var txt = js.r(item[1], '\n', '<br>');
            var dt = item[0];
            html += app.get_news_section_html(txt, dt);
        });
        $("#log_wrapper").html(html);
    },
    get_notice_section_html:(txt)=>{
        return `<div class="frm_section"><div class="frm_section_box frm_info_box">${txt}</div></div>`;
    },
    build_notice:(response)=>{
        var html = '';
        $.each(app.dat.news, (i, item)=>{
            if (!item[2] || item[2] == '') return true;
            var txt = '<p>' + js.r(item[2], '\n', '</p><p>') + '</p>';
            html += app.get_notice_section_html(txt);
        });
        $("#notice_wrapper").html(html);
    },
    build_user_info:(response)=>{
        app.dat.user = {
            uid: response.user[0],
            number: response.user[1],
            otp: (js.is_mobile()) ? response.user[10] : response.user[2],
            name: response.user[3],
            birth: response.user[4],
            gender : response.user[5],
            email : response.user[6],
            phone : response.user[7],
            kkl_mail : response.user[8],
            level : response.user[9]
        }
        app.dat.campaign = (response.campaign) ? {
            id: response.campaign[0],
            title: response.campaign[1],
            sub_id: response.campaign[2],
            sub_title: response.campaign[3],
            status: response.campaign[4],
            feedback_url: response.campaign[6],
            support_url: response.campaign[7],
            start_date: js.null_if_empty(response.campaign[8]),
            end_date: js.null_if_empty(response.campaign[9])
        } : null;
        window.localStorage.setObj("zaparton-user", app.dat.user);
        window.localStorage.setObj("zaparton-campaign", app.dat.campaign);
        $("#head_bt_contact,#bt_user_contact").off("click").click(()=>{
            var url = app.dat.campaign?.support_url;
            if (!url) {
                var selected_campaign = $('#sl_level').val();
                swal({
                    title: '',
                    html: "<div class='dlg_support_level'><div>נא לבחור את הקבוצה המתאימה</div><div>מקצה: <select name='dlg_sl_level' id='dlg_sl_level'></div></div>" ,
                    showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'המשך', cancelButtonText: 'ביטול',
                    onBeforeOpen:()=>{
                        $('#dlg_sl_level').html($('#sl_level').html());
                        $('#dlg_sl_level').val(selected_campaign);
                    },
                    preConfirm:()=>{
                        selected_campaign = $("#dlg_sl_level").val();
                        if (selected_campaign == '') swal.showValidationMessage('נא לבחור ערך מהרשימה');
                        else $.each(response.campaign_list, (i, campaign)=>{
                            if (campaign.sub_id == selected_campaign) {
                                url = campaign.support_url;
                                return false;
                            }
                        })
                    }
                }).then(function(result){
                    if (result.dismiss) return;
                    // $('#sl_level').val(selected_campaign);
                    if (url) window.open(url);
                });
            } else window.open(url);
        });
        $("#head_bt_feedback").off("click").click(()=>{
            window.open(app.dat.campaign.feedback_url);
        });
        $("#user_box_head_name").html(app.dat.user.name);
        $("#user_box_head_id").html(app.dat.user.uid);
        $("#eb_profile_name").val(app.dat.user.name);
        $("#eb_profile_email").val(app.dat.user.email);
        $("#eb_profile_birth").val(app.dat.user.birth);
        // $("#eb_profile_birth").attr('max', js.date_html_input_format());        
        $("#sl_gender").val(app.dat.user.gender);
        $("#eb_profile_phone").val(app.dat.user.phone);
        $("#sl_level").val(app.dat.user.level);
        $("#cb_kkl_mail").prop("checked", (app.is_new_user())?true:app.dat.user.kkl_mail);
        $("#header_title_1").html(app.dat.campaign?.title);
        $("#header_title_2").html(app.dat.campaign?.sub_title);
        $("#frm_profile_legal_section").toggle(app.is_new_user());
        app.pages[APP_GLOBAL.PAGES.PROFILE].update_obj();
    },
    rebuild:(response)=>{
        app.dat.server_load_response = JSON.parse(JSON.stringify(response));
        app.build_user_info(response);
        app.build_pics(response);
        app.build_news(response);
        app.build_notice(response);
        app.scroll_home();
        app.on_after_rebuild?.call();
    },
    scroll_home:()=>{
        $("#main_box")[0].scrollTo({top: 0, behavior: 'smooth'});
    },
    clear_data:()=>{
        app.dat.user = null;
        app.dat.pics = {
            to_screen:null,
            to_quality_screen:null,
            to_score:null
        };
        app.dat.campaign = null;
    },
    clear_view:()=>{
        $("#user_box_head_name").html('');
        $("#user_box_head_id").html('');
    },
    clear:()=>{
        app.clear_data();
        app.clear_view();
    },
    clear_storage:()=>{
        window.localStorage.setObj("zaparton-user", null);
    },
    changed:()=>{
        return $(".user_toolbox_enabled").length > 0;
    },
    show_login_page:()=>{
        $("#eb_login").val("");
        $("#eb_login_2").val("");
        $("#frm_login").show();
        $("#frm_login_2").hide();
        $("#dv_login").fadeIn();
    },
    logout:(force)=>{
        const do_logout = ()=>{
            app.clear();
            app.clear_storage();
            window.location.reload();
        };
        swal.ok = false;
        if (force || !app.changed()) do_logout();
        else swal({
            title: 'יציאה',
            html: "רגע... רגע...<br>לצאת ולאבד את כל השינויים?",
            showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'כן', cancelButtonText: 'לא',
            onAfterClose:()=>{if (swal.ok) do_logout();}
        }).then(function(result){
            if (result.dismiss) return;
            swal.ok = true;
        });
    },
    help_message_txt:{
        welcome: 
            '<div id="help_welcome">' + 
                '<div class="help_paragraph">ברוכים הבאים לממשק ההרשמה למעורבות ההורים בכרמים. מוזמנים להירשם לפעילויות בהן תרצו להשתלב. שימו לב, ההרשמה הינה לרבעון הקרוב והיא משותפת לזוג ההורים.</div>' +
                '<div class="help_paragraph">מצאו פעילויות ולחצו על הכפתור "הצטרפ/י".<br>הפעילויות אליהן הצטרפתם נאספות ומופיעות בצדו השמאלי של המסך.</div>' +
                '<div class="help_paragraph">העזרו באפשרויות הסינון שבראש הדף כדי למצוא פעילויות לרוחכם.</div>' +
                '<div class="help_nagging"><input id="cb_help_welcome_nagging" type="checkbox" checked="true" /><label for="cb_help_welcome_nagging">הבנתי, אין צורך להציג הודעה זו שוב.</label></div>' +
            '</div>',
        signup:'<div id="help_signup">' + 
            '<div class="help_paragraph">המשיכו לחפש ולהצטרף לפעילויות נוספות, ולסיום לחצו "שמירה".</div>' +
                '<div class="help_paragraph">בכל שלב (גם לאחר השמירה) ניתן להסיר ההצטרפות ע"י לחיצה על צלמית הפח, המופיעה במעבר העכבר, מעל כל פעילות ברשימה שלכם בצד שמאל.</div>' + 
                '<div class="help_nagging"><input id="cb_help_signup_nagging" type="checkbox" checked="true" /><label for="cb_help_signup_nagging">הבנתי, אין צורך להציג הודעה זו שוב.</label></div>' +
            '</div'
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
    is_new_user:()=>{
        return (!app.dat.user || app.dat.user.name == '');
    },
    default_view:()=>{
        $(`#side_menu>div[tab_id=2]`).toggleClass('disabled', app.is_new_user());
        $(`#side_menu>div[tab_id=3]`).toggleClass('disabled', app.is_new_user());
        app.change_tab((app.is_new_user())?1:2);
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
        app.post(post_data,{
            on_success :(response)=>{
                window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
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
            act_id: "login_request",
            uid: uid
        };
        app.post(post_data,{
            on_success :(response)=>{
                window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
                $("#frm_login").hide();
                $("#frm_login_2").fadeIn(e=>$("#eb_login_2").focus());
            },
            on_error_response: (error)=>{
                app.pop_err('השרת מדווח על תקלה בביצוע הפעולה');
            }
        });
    },
    save_profile:()=>{
        const page = app.pages[APP_GLOBAL.PAGES.PROFILE]; 
        page.clear_validate_msg();
        const profile = {
            name: $("#eb_profile_name").val().trim(),
            email: $("#eb_profile_email").val().trim(),
            birth_date: $("#eb_profile_birth").val().trim(),
            gender: $("#sl_gender").val(),
            phone: $("#eb_profile_phone").val().trim(),
            level: $("#sl_level").val(),
            kkl_mail: $("#cb_kkl_mail").is(":checked")
        }
        page.validate(profile);
        if ($("#profile_wrapper .frm_error_msg[valid=false]").length>0) {
            app.scroll_home();
            $("#validation_note").show();
            setTimeout(() => {
                $("#profile_wrapper .frm_error_msg[valid=false]").slideDown();
            }, 200);
        } else {
            var post_data = {
                act_id: "save_profile",
                uid: app.dat.user.uid,
                otp: app.dat.user.otp,
                profile : profile
            };
            app.post(post_data,{
                on_success :(response)=>{
                    window.localStorage.setObj('zaparton-echo-idx', response.user_idx);
                    const is_new_user = app.is_new_user();
                    app.rebuild(response);
                    if (is_new_user) app.default_view();
                    else app.pop_success('המידע נשמר בהצלחה');
                },
                on_error_response: (error)=>{
                    app.pop_err('השרת מדווח על תקלה בביצוע הפעולה');
                }
            });
            }
    },
    toggle_menu:()=>{
        const shrink = $("#header").width() < ($("#head_title").width() + $("#head_toolbox").width());
        $("#head_toolbox").toggle(!shrink);
        $("#head_toolbox_ico").toggle(shrink);
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
    pages:{
        1:{ //APP_GLOBAL.PAGES.PROFILE
            obj:null,
            clear_validate_msg:()=>{
                $("#validation_note").hide();
                $("#profile_wrapper").find(".frm_error_msg")
                    .html('')
                    .attr("valid",true)
                    .attr("error_level", 0);
                $("#profile_wrapper .frm_error_msg").hide();
            },
            set_validate_msg:(selector, msg, error_level, $holder)=>{
                ($holder || $(selector).closest(".frm_section_row_content").find(".frm_error_msg"))
                    .html(msg)
                    .attr("valid",false)
                    .attr("error_level", error_level||1);
            },
            validate:(profile)=>{
                const page = app.pages[APP_GLOBAL.PAGES.PROFILE];
                if (profile.name == '') page.set_validate_msg("#eb_profile_name", 'שדה חובה');
                if (profile.email == '') page.set_validate_msg("#eb_profile_email", 'שדה חובה');
                    else if (!js.is_valid_email(profile.email)) page.set_validate_msg("#eb_profile_email", 'לא הצלחנו להבין את הכתובת הזאת', 2);
                if (profile.birth_date == '') page.set_validate_msg("#eb_profile_birth", 'שדה חובה');
                    else if (profile.birth_date < 1902 || profile.birth_date > 2023) page.set_validate_msg("#eb_profile_birth", 'שדה חובה');
        
                if (profile.phone == '') page.set_validate_msg("#eb_profile_phone", 'שדה חובה');
                    else if (!js.is_valid_phone(profile.phone)) page.set_validate_msg("#eb_profile_phone", 'לא הצלחנו להבין את המספר הזה', 2);
                if (profile.level == '') page.set_validate_msg("#sl_level", 'שדה חובה');
                if (profile.level == 'YOUTH' && parseInt(profile.birth_date) < 2006) page.set_validate_msg("#sl_level", 'מקצה נוער מיועד לבני 16 ומטה');
        
                if (app.is_new_user() && !$("#cb_kkl_terms").is(":checked")) page.set_validate_msg("#cb_kkl_terms", 'חובה לקרוא את התקנון ולהסכים לתנאיו', 1, $('#kkl_terms_error'));
            },
            update_obj:()=>{
                const page = app.pages[APP_GLOBAL.PAGES.PROFILE];
                page.obj = page.get_obj();
            },
            get_obj:()=>{
                return {
                    name: $("#eb_profile_name").val().trim(),
                    email: $("#eb_profile_email").val().trim(),
                    birth_date: $("#eb_profile_birth").val().trim(),
                    gender: $("#sl_gender").val(),
                    phone: $("#eb_profile_phone").val().trim(),
                    level: $("#sl_level").val()
                };
            },
            restore:()=>{
                const obj = app.pages[APP_GLOBAL.PAGES.PROFILE].obj;
                $("#eb_profile_name").val(obj.name);
                $("#eb_profile_email").val(obj.email);
                $("#eb_profile_birth").val(obj.birth_date);
                $("#sl_gender").val(obj.gender);
                $("#eb_profile_phone").val(obj.phone);
                $("#sl_level").val(obj.level);
            },
            enter:()=>{
                app.pages[APP_GLOBAL.PAGES.PROFILE].update_obj();
            },
            leave:(proceed)=>{
                const page = app.pages[APP_GLOBAL.PAGES.PROFILE];
                if (JSON.stringify(page.get_obj()) == JSON.stringify(page.obj)) proceed();
                else swal({
                    title: 'בדיקה',
                    html: "לצאת מבלי לשמור את השינויים?",
                    showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'כן', cancelButtonText: 'לא'
                }).then(function(result){
                    if (result.dismiss) return;
                    page.restore();
                    page.clear_validate_msg();
                    proceed();
                });
            }
        }
    },
    change_tab(tab_id){
        if ($(`#side_menu>div[tab_id=${tab_id}].selected`).length>0) return;
        if ($(`#side_menu>div[tab_id=${tab_id}].disabled`).length>0) return;
        const current_tab_id = $(`#side_menu>div[tab_id].selected`).attr("tab_id");
        const change = ()=>{
            app.pages[tab_id]?.enter?.call();
            $("#main_box div[tab_id]").hide();
            $(`#main_box div[tab_id=${tab_id}]`).fadeIn();
            $("#side_menu>div[tab_id]").removeClass("selected");
            $(`#side_menu>div[tab_id=${tab_id}]`).addClass("selected");
        }
        const leave = app.pages[current_tab_id]?.leave;
        if (leave) leave(change); else change();
    },
    init_buttons: ()=>{
        $("#bt_home").click(app.scroll_home);
        $("#frm_login").submit((e)=>{
            e.preventDefault(e);
            app.login_request();
        });
        $("#frm_login_2").submit((e)=>{
            e.preventDefault(e);
            app.login();
        });
        $("#login2_help").click(app.show_login_page);
        $("#head_bt_exit").click(()=>{
            app.logout();
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
        app.dat.user = window.localStorage.getObj("zaparton-user");
        // console.log("app.init_user", app.dat.user);
    },
    show_screen_message: msg=>{
        $("#dv_screen_message").fadeIn();
        $("#dv_screen_message_txt").html(msg);
    },
    init_mode: ()=> {
        app.dat.mode = js.urlParam("mode");
        // console.log("mode=", app.dat.mode);
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
    animate_upload_status:($band, text, stages, stage, progress, end, on_complete)=>{
        app.update_upload_status($band, text, stages, stage, Math.min(progress, end));
        const proc = (end <= progress) ? ()=>{
            setTimeout(() => {
                on_complete();
            }, 400);
        } 
            : ()=>{
            setTimeout(() => {
                app.animate_upload_status($band, text, stages, stage, progress + 10, end, on_complete);                
            }, 100);
        }
        proc();
    },
    init_drop_zone:(drop_zone)=>{
        const inputElement = $(drop_zone).find("input[type='file']")[0];
        const img = $(drop_zone).find("img")[0];
        const p = $(drop_zone).find("p")[0];
        const $thumb_loader = $(drop_zone).find(".img_thumb_loader");
        const load_file = (file)=>{

            // app.uploadFileToS3('https://zapartonpics.s3.eu-central-1.amazonaws.com/pics/photo03.jpg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA56O6T2RPLXPCPZ3A%2F20230923%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230923T144134Z&X-Amz-Expires=3600&X-Amz-Signature=ac164133a453e00319113a0159bbafeb0ae30efb38cdf4810e24dced7618fcb3&X-Amz-SignedHeaders=host', file);
            //3
// return;
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
                    tmp_img.addEventListener("load", function () {
                        app.show_pic_mask(slot_idx);
                        EXIF.getData(tmp_img, function() {
                            // console.log(EXIF.getAllTags(this));
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
                                exif: EXIF.getAllTags(this),
                                file:file
                            }
                            app.update_pic_upload_status(file_inf.slot, 'uploading');
                            // file_inf.$pic_status.attr('pic_status', 'uploading')
                            app.pic_mngr.clear_pic_space(file_inf, (clear_response) => {
                                file_inf.pre_signed_urls = clear_response.pre_signed_urls;
                                app.dat.pics[file_inf.slot-1] = null;
                                app.pic_mngr.upload_thumbnail(file_inf, ()=>{
                                    app.pic_mngr.upload_pic(file_inf, ()=>{
                                        app.pic_mngr.save_pic(file_inf, (new_pic)=>{
                                            app.dat.pics[slot_idx-1] = new_pic;
                                            app.build_pic(slot_idx, new_pic);
                                        })
                                    })
                                })
                            });
                        });
                    });
                    tmp_img.addEventListener("error", function () {
                        app.show_pic_mask(slot_idx);
                        $thumb_loader.fadeOut();
                        app.pic_mngr.on_error_level_1(slot_idx, null, 'קובץ בפורמט לא ידוע');
                    });
                    tmp_img.src = src;
                }

            });
        }
        const load_file_after_warning = (file)=>{
            const sig_dont_nag = window.localStorage.getObj("zaparton-stop-sig-nagging");
            if (sig_dont_nag) {
                load_file(file);
                return;
            }
            // moved to server side !!
            // let today = new Date(); 
            // let yesterday = new Date();
            // yesterday.setDate(yesterday.getDate() -1);
            // if (app.dat.campaign.start_date && today < new Date(app.dat.campaign.start_date)) {
            //     app.pop_err('התחרות עדיין לא התחילה');
            //     return;
            // }
            // if (app.dat.campaign.end_date && yesterday > new Date(app.dat.campaign.end_date)) {
            //     app.pop_err('התחרות הסתיימה');
            //     return;
            // }
            swal({
                title: 'לידיעתך',
                html: 
                    '<div>יש להמנע מהוספת חתימת צלם על התמונה.</div>' +
                    '<div>תמונה הנושאת חתימה לא תתקבל לתחרות!</div>' +
                    '<br>' +
                    '<div>האם להמשיך?</div>' +
                    '<div class="help_nagging"><input id="cb_sig_nagging" type="checkbox"/><label for="cb_sig_nagging">הבנתי, אין צורך להציג הודעה זו שוב.</label></div>',
                showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'כן', cancelButtonText: 'לא',
                // onAfterClose:()=>{if (swal.ok) do_logout();}
            }).then(function(result){
                if ($('#cb_sig_nagging').is(":checked")) window.localStorage.setObj("zaparton-stop-sig-nagging", true);
                if (result.dismiss) return;
                load_file(file);
            });
        }
        
        inputElement.onclick = ()=> {
            inputElement.value = null;
        }

        inputElement.addEventListener('change', (e)=> {
            // load_file(inputElement.files[0]);
            load_file_after_warning(inputElement.files[0]);
        })
        drop_zone.addEventListener('click', () => inputElement.click());
        drop_zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        drop_zone.addEventListener('drop', (e) => {
            e.preventDefault();
            // load_file(e.dataTransfer.files[0]);
            load_file_after_warning(e.dataTransfer.files[0]);
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
            app.show_screen_message("הדף עדיין לא מתאים למכשירים ניידים");
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
