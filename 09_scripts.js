//The functions withing This script file must be called from within the jquery doc-ready tages in other filrs in order for jquery to work

function fnapi(data){
    payload_res = $.ajax({
        type: "POST",
        url: "api.php",
        dataType: "json",
        data,
        async:false,
    }).responseText;
    payload_res = IsJsonString(payload_res) ? JSON.parse(payload_res) : "Non-valid json was returned"+payload_res;
    return payload_res;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function fnratr(nosub, notot){//Make a percentage rate
    res = nosub / notot
    return res;
}

// function fnMakeIndexTable(){
//     $("#tbl_stk tbody").html("");
//     $.get("05_action.php?act=get_system", function(sys, status){
//         sys = JSON.parse(sys);
//         fnRowMaker(sys)
//         fnSetMenu(sys)
//     })
// }

function fnDo(api, nextFn, sL){
    fns(sL,"Calling API:"+api)
    $.get("05_action.php?act="+api, function(data, status){
        
        fns(sL,"Data returned:")
        fns(sL,data)
        data = JSON.parse(data);
        fns(sL,"Converted data:")
        fns(sL,data)

        fns(sL,"Calling function: fn"+nextFn)
        eval("fn"+nextFn+"(data)");
    })
}
function fns(showLog, contentToLog){
    if (showLog){console.log(contentToLog)}    
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function fnMakeIndexTable(sys){
    $("#tbl_stk tbody").html("");
    let stks = sys["stks"]
    for (let stk in stks){
        btnArchive = "<button type='button' class='btn btn-sm btn-outline-dark float-right btnArchive' value='"+stks[stk]["stkm_id"]+"'>Archive</button>"
        btnExport = "<a class='btn btn-sm btn-outline-dark float-right' href='05_action.php?act=get_export_stk&stkm_id="+stks[stk]["stkm_id"]+"'>Export</a>"
        btnExcel = "<a class='btn btn-sm btn-outline-dark float-right' href='05_action.php?act=get_excel&stkm_id="+stks[stk]["stkm_id"]+"'>Excel</a>"

        let row = eval("fnRB_"+stks[stk]["stk_type"]+"(stks[stk], sys)");
        $("#tbl_stk tbody").append(row);
    }
}

function fnLoadTemplates(templateData){
    let templateList="";
    for (let template in templateData){
        templateList += "<button type='button' class='dropdown-item btn btnInitTemplate' data-toggle='modal' data-target='#modal_initiate_template' value='"+templateData[template]["ass_id"]+"'>"+templateData[template]["res_AssetDesc1"]+"</button>"
    }
    $("#areaTemplates").html(templateList);
}




function fnCheckUpdates(data){
    if(data["test_results"]=="Check performed"){
        if(data["versionLocal"]<data["versionRemote"]){
            newButton  = "<button type='button' class='dropdown-item btn text-danger' data-toggle='modal' data-target='#modal_confirm_update'>Update available</button>"
            $("#headingHelp").addClass("text-danger")
        }else{
            newButton  = "<span class='dropdown-item text-primary'>You are up to date</span>"
        }
    }else{
        newButton  = "<span class='dropdown-item text-primary'>Please connect to the internet and try again</span><button type='button' class='dropdown-item btn' id='btnCheckForUpdates'>Check for updates</button>"
    }
    $('#areaVersionAction').html(newButton);
}


function fnRB_stocktake(stk_arr, sys){
    let system_stk_type = sys["system_stk_type"]
    let btnToggle       = fnMakeToggleButton(stk_arr, system_stk_type);
    let rc_orig         = stk_arr['rc_orig'] ? stk_arr['rc_orig'] : 0;
    let rc_orig_complete= stk_arr['rc_orig_complete'] ? stk_arr['rc_orig_complete'] : 0;
    let rc_extras       = stk_arr['rc_extras'] ? stk_arr['rc_extras'] : 0;
    let rc_perc         = rc_orig ? Math.round((rc_orig_complete/rc_orig)*100,2) : 0

    console.log(stk_arr)
    btnDeconflictMerge = "<a href='22_merge.php?stkm_id="+stk_arr['stkm_id']+"' class='btn btn-sm btn-outline-dark'>Continue merge</a>";
    btnToggle = (stk_arr['merge_lock']==1) ? btnDeconflictMerge : btnToggle; 
    btnExport = (stk_arr['merge_lock']==1) ? "" : btnExport; 

    let row = "<tr id='row"+stk_arr['stkm_id']+"'>"
    row += "<td>"+btnToggle+"</td>"
    row += "<td>"+stk_arr['stkm_id']+"</td>"
    row += "<td>"+stk_arr['stk_type']+"</td>"
    row += "<td>"+stk_arr['stk_id']+"</td>"
    row += "<td>"+stk_arr['stk_name']+"</td>"
    row += "<td align='right'>"+rc_orig+"</td>"
    row += "<td align='right'>"+rc_orig_complete+"</td>"
    row += "<td align='right'>"+rc_extras+"</td>"
    row += "<td align='right'>"+rc_perc+"%</td>"
    row += "<td align='right'>"+btnArchive+"</td>"
    row += "<td align='right'>"+btnExcel+"</td>"
    row += "<td align='right'>"+btnExport+"</td>"
    row += "<td align='right'>"+btnToggle+"</td>"
    row += "</tr>"
    return row
}
function fnRB_impairment(stk_arr, sys){
    let system_stk_type = sys["system_stk_type"]
    let btnToggle = fnMakeToggleButton(stk_arr, system_stk_type);
    let rc_orig         = stk_arr['rc_orig'] ? stk_arr['rc_orig'] : 0;
    let rc_orig_complete= stk_arr['rc_orig_complete'] ? stk_arr['rc_orig_complete'] : 0;
    let rc_extras       = stk_arr['rc_extras'] ? stk_arr['rc_extras'] : 0;
    let rc_perc         = rc_orig ? Math.round((rc_orig_complete/rc_orig)*100,2) : 0

    console.log(stk_arr)
    btnDeconflictMerge = "<a href='20_merge.php?stkm_id="+stk_arr['stkm_id']+"' class='btn btn-sm btn-outline-dark'>Continue merge</a>";
    btnToggle = (stk_arr['merge_lock']==1) ? btnDeconflictMerge : btnToggle; 
    btnExport = (stk_arr['merge_lock']==1) ? "" : btnExport; 
    
    let row = "<tr id='row"+stk_arr['stkm_id']+"'>"
    row += "<td>"+btnToggle+"</td>"
    row += "<td>"+stk_arr['stkm_id']+"</td>"
    row += "<td>Impairment/B2R</td>"
    row += "<td>"+stk_arr['stk_id']+"</td>"
    row += "<td>"+stk_arr['stk_name']+"</td>"
    row += "<td align='right'>"+rc_orig+"</td>"
    row += "<td align='right'>"+rc_orig_complete+"</td>"
    row += "<td align='right'>"+rc_extras+"</td>"
    row += "<td align='right'>"+rc_perc+"%</td>"
    row += "<td align='right'>"+btnArchive+"</td>"
    row += "<td align='right'>"+btnExcel+"</td>"
    row += "<td align='right'>"+btnExport+"</td>"
    row += "<td align='right'>"+btnToggle+"</td>"
    row += "</tr>"
    
    return row
}
function fnRB_template(stk_arr, sys){
    let btnViewL = "<a href='' class='btn btn-sm btn-outline-dark'>Edit</a>"
    let btnViewR = "<a href='' class='btn btn-sm btn-outline-dark float-right'>Edit</a>"
    let row = "<tr>"
    row += "<td>"+btnViewL+"</td>"
    row += "<td>"+stk_arr['stkm_id']+"</td>"
    row += "<td>Template</td>"
    row += "<td></td>"
    row += "<td>"+stk_arr['stk_name']+"</td>"
    row += "<td align='right'>"+stk_arr['rc_orig']+"</td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td align='right'>"+btnArchive+"</td>"
    row += "<td align='right'></td>"
    row += "<td align='right'>"+btnExport+"</td>"
    row += "<td align='right'>"+btnViewR+"</td>"
    row += "</tr>"
    return row    
}


function fnMakeToggleButton(stk_arr, system_stk_type){
    stkm_id     = stk_arr["stkm_id"];
    stk_type    = stk_arr["stk_type"];
    stk_include = stk_arr["stk_include"];
    if(stk_include==1){// Included
        btnToggle = "<button type='button' class='btn btn-sm btn-success btnToggle toggleBTN"+stk_arr["stkm_id"]+"' value='"+stk_arr["stkm_id"]+"'>Included</button>";
    }else if(stk_include!=1&&system_stk_type!="notset"&&system_stk_type!=stk_type){// not included and system set no matches
        btnToggle = "<button type='button' class='btn btn-sm btn-outline-dark'>NA</button>"
    }else{
        btnToggle = "<button type='button' class='btn btn-sm btn-outline-dark btnToggle toggleBTN"+stk_arr["stkm_id"]+"' value='"+stk_arr["stkm_id"]+"'>Avaliable</button>"
    }
    return btnToggle; 
}

// ##################################################################
// ########################### VALIDATION ###########################
// ##################################################################

function fnValidate(fieldValue, fieldType, fieldMaxLen, fieldMaxNum){
    let validity    = [];
    let msg         = "";
   let valid        = true;
     

    if (fieldType=="string"&&valid){
        valid   = /([a-zA-Z0-9 \s\-/.,&])$/.test(fieldValue) ? valid : false
        msg     = valid ? msg : "That isn't valid text"
    }
    if (fieldType=="number"&&valid){
        valid   = !isNaN(parseFloat(fieldValue)) && isFinite(fieldValue)  ? valid : false
        msg     = valid ? msg : "That isn't a valid number"
    }
    if (fieldType=="date"&&valid){
        valid   = valid
        msg     = valid ? msg : "That isn't a valid date"
    }
    if (fieldType=="text"&&valid){
        valid   = /([a-zA-Z0-9 \s\-/.,&])$/.test(fieldValue) ? valid : false
        msg     = valid ? msg : "That isn't valid text"
    }
    // if (fieldType=="number"&&valid){//This doesn't work
    //     // valid   = fieldValue<fieldMaxNum;
    //     // msg     = valid ? msg : "That number must be less than "+fieldMaxNum
    // }
    if (fieldMaxLen&&valid){
        valid   = fieldValue.length<fieldMaxLen ? valid : false
        msg     = valid ? msg : "Must be less than "+fieldMaxLen+" characters";
    }
    if (fieldValue.length==0){
        valid   =  true;
        msg     =  ""
    }
    
    validity["result"]  = valid;
    validity["msg"]     = msg
    return validity
}


function fnCleanDate(valOne){
    return valOne ? valOne.substring(0,10) : valOne;
}

function fnCompare(valOne, valTwo, expectedType){
    let log="expectedType: "+expectedType+"\n\nPre-treatment\nvalOne: "+valOne+"\nvalTwo: "+valTwo+"\nvalOne type: "+ typeof valOne+"\nvalTwo type: "+ typeof valTwo
    // Treatments go here - they clean both values in order to make a comparison
    if (expectedType=="date"){// test for date
        valOne = valOne ? valOne.substring(0,10) : false;
        valTwo = valTwo ? valTwo.substring(0,10) : false;
    }
    if (expectedType=="number"){
        valOne = parseFloat(valOne) 
        valTwo = parseFloat(valTwo) 
    }
    //Test for every combination of both being null/empty
    valOne = valOne ? valOne : null;
    valTwo = valTwo ? valTwo : null;

    comparison =  (valOne==valTwo)
    log+="\n\nPost-treatment \nvalOne: "+valOne+"\nvalTwo: "+valTwo+"\nvalOne type: "+ typeof valOne+"\nvalTwo type: "+ typeof valTwo+"\n\ncomparison: "+comparison
    // console.log(log)
    return comparison
}