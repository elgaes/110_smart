
//The functions withing This script file must be called from within the jquery doc-ready tages in other filrs in order for jquery to work



// function fnMakeIndexTable(){
//     $("#tbl_stk tbody").html("");
//     $.get("api.php?act=get_system", function(sys, status){
//         sys = JSON.parse(sys);
//         fnRowMaker(sys)
//         fnSetMenu(sys)
//     })
// }


function fnDo(api, nextFn, sL){
    fns(sL,"Calling API:"+api)
    $.get("api.php?act="+api, function(data, status){
        
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

function fnMakeIndexTable(sys){
    $("#tbl_stk tbody").html("");
    let stks = sys["stks"]
    for (let stk in stks){
        btnArchive = "<button type='button' class='btn btn-sm btn-outline-dark float-right btnArchive' value='"+stks[stk]["stkm_id"]+"'>Archive</button>"
        btnExport = "<a class='btn btn-sm btn-outline-dark float-right' href='05_action.php?act=get_export_stk&stkm_id=$stkm_id'>Export</a>"
        btnExcel = "<a class='btn btn-sm btn-outline-dark float-right' href='05_action.php?act=get_excel&stkm_id=$stkm_id'>Excel</a>"
        let row = eval("fnRB_"+stks[stk]["stk_type"]+"(stks[stk], sys)");
        $("#tbl_stk tbody").append(row);
    }
}

function fnLoadTemplates(templateData){
    for (let template in templateData){
        console.log(templateData[template])
        $("#dropdown_adds").append("<button type='button' class='dropdown-item btn btnInitTemplate' data-toggle='modal' data-target='#modal_initiate_template' value='"+templateData[template]["ass_id"]+"'>"+templateData[template]["res_AssetDesc1"]+"</button>")
    }
}


function fnSetMenu(sys){
    let system_stk_type = sys["system_stk_type"]

    btnFF               = "<a class='dropdown-item text-primary' href='12_ff.php'>Add First Found</a>"
    btnImages           = "<a class='dropdown-item' href='05_action.php?act=sys_open_image_folder'>Image folder</a>"
    btnArchives         = "<a class='dropdown-item' href='06_admin.php'>Archived Stocktakes</a>"
    btnReset            = "<button type='button' class='dropdown-item btn btn-danger' data-toggle='modal' data-target='#modal_confirm_reset'>Reset all data</button>"
    btnInverColor       = "<a class='dropdown-item' href='05_action.php?act=save_invertcolors'>Invert Colour Scheme</a>"
    btnCreateTemplate   = "<a class='dropdown-item' href='05_action.php?act=save_createtemplatefile'>Create template file</a>"
    // <?=$area_rr?>

    console.log(sys)
    helpContents=btnArchives+btnReset+btnInverColor

    // Has two states:
    // Update available
    // Check for updates
    // if (sys["sett"][0]["versionLocal"]==sys["sett"][0]["versionRemote"]){
    btnVAction  = "<div id='areaVersionAction'><button type='button' class='dropdown-item btn' id='btnCheckForUpdates'>Check for updates</button></div>"
    // }else 
    styleUpdateAvailable =""
    if (sys["sett"][0]["versionLocal"]<sys["sett"][0]["versionRemote"]){
        btnVAction  = "<button type='button' class='dropdown-item btn text-danger' data-toggle='modal' data-target='#modal_confirm_update'>Update available</button>"
        styleUpdateAvailable = " text-danger "
    }
    menuUpdate  = "<div class='dropdown-divider'></div><h6 class='dropdown-header'>Software version<span class='float-right'>v"+sys["sett"][0]["versionLocal"]+"</span></h6>"+btnVAction
    menuAdd = ""
    $("#menuSearch").hide();
    if(system_stk_type=="stocktake"){
        $(".initiateBTN").html("<a href='10_stk.php' class='nav-link text-success' >Stocktake</a>");
        $("#menuSearch").show();
        helpContents += btnImages+btnCreateTemplate
        menuAdd = "<a class='nav-link dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>First found</a><div class='dropdown-menu' aria-labelledby='dropdown01' id='dropdown_adds'>"+btnFF+"<div class='dropdown-divider'></div><h6 class='dropdown-header'>Templates</h6></div>"
    }else if(system_stk_type=="impairment"){
        $(".initiateBTN").html("<a href='10_stk.php' class='nav-link text-success' >Impairment</a>");
    }else{
        $(".initiateBTN").html("");
    }

    

    menuHelp    = "<a class='nav-link dropdown-toggle "+styleUpdateAvailable+"' href='#'data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='headingHelp'>Help</a><div class='dropdown-menu' aria-labelledby='dropdown01' id='dropdownHelp' >"+helpContents+menuUpdate+"</div>"
    menuVersion = ""
    $("#menuHelp").html(menuHelp);
    $("#menuAdd").html(menuAdd);
    $("#menuVersion").html(menuVersion);
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
    let btnToggle = fnMakeToggleButton(stk_arr, system_stk_type);
    let row = "<tr id='row"+stk_arr['stkm_id']+"'>"
    row += "<td>"+btnToggle+"</td>"
    row += "<td>"+stk_arr['stkm_id']+"</td>"
    row += "<td>"+stk_arr['stk_type']+"</td>"
    row += "<td>"+stk_arr['stk_id']+"</td>"
    row += "<td>"+stk_arr['stk_name']+"</td>"
    row += "<td align='right'>"+stk_arr['rowcount_original']+"</td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td></td>"
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
    let row = "<tr id='row"+stk_arr['stkm_id']+"'>"
    row += "<td>"+btnToggle+"</td>"
    row += "<td>"+stk_arr['stkm_id']+"</td>"
    row += "<td>"+stk_arr['stk_type']+"</td>"
    row += "<td>"+stk_arr['stk_id']+"</td>"
    row += "<td>"+stk_arr['stk_name']+"</td>"
    row += "<td align='right'>"+stk_arr['rowcount_original']+"</td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td></td>"
    row += "<td></td>"
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
    row += "<td align='right'>"+stk_arr['rowcount_original']+"</td>"
    row += "<td></td>"
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
        btnToggle = "<button type='button' class='btn btn-sm btn-outline-dark btnToggle'>NA</button>"
    }else{
        btnToggle = "<button type='button' class='btn btn-sm btn-outline-dark btnToggle toggleBTN"+stk_arr["stkm_id"]+"' value='"+stk_arr["stkm_id"]+"'>Avaliable</button>"
    }
    return btnToggle; 
}

