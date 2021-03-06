var imported = document.createElement("script");
imported.src = "phantom.js";
document.getElementsByTagName("head")[0].appendChild(imported);

/**
* Returns the host and port (if defined) for building the url
* @returns {String} beginning of the url
*/
function build_execman_path(){
	var url="";
	if(typeof execserver!== 'undefined'){ // Any scope
		if(execserver){
		if(execserver.length>0){
			url=url+"http://"+execserver;
			if(typeof execport!== 'undefined') {// Any scope
				if ((execport) && execport.lenght>0){
					url=url+":"+execport;
	}	}}	}	}
	return url;
}

function exec_logout() {
	sessionStorage.setItem('token', '');
	request_share_session_storage();
// 	checktoken();//already called at the end of request_share_session_storage
	window.location = 'executionmanager.html';
	return false;
}


function exec_load_header(){
	var menu_phantom = document.getElementById("menu_phantom");
	if(menu_phantom){
	var menuhtml="<ul class=\"menuphantom\">";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"exec_list.html\">List of executed APPs</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"exec_new.html\">Register new Execution</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"exec_update.html\">Update an Execution</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"exec_update1.json\">Download JSON example 1</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"exec_update2.json\">Download JSON example 2</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><a href=\"log_list.html\">List of logs</a></li>";
	menuhtml+="	<li class=\"menuphantom\"><input type=\"button\" value=\"Night mode\" onclick=\"switchnightmode()\"></a></li>";
// <!--<li class="menuphantom"><a href="query_metadata.html">Query metadata</a></li> -->
	menuhtml+="	<li class=\"phantomlogo\" style=\"float:right\">";
	menuhtml+="	<img src=\"phantom.gif\" alt=\"PHANTOM\" height=\"32\" style=\"background-color:white;\">";
	menuhtml+="	</li>";
	menuhtml+="	<li class=\"menuphantomR\">";
	menuhtml+="		<p><a onClick=\"app_logout();return false;\" href=\"PleaseEnableJavascript.html\">LogOut</a></p></li>";
	menuhtml+="</ul>";
	menu_phantom.innerHTML = menuhtml;
	}
}


function exec_load_menu_login(){
	var menu_login = document.getElementById("menu_login");
	if(menu_login){
	var menuhtml="<H1 id=\"title_login\" style=\"overflow-wrap:break-word; max-width:80%; word-break:break-all;\"><b>LOGIN into EXECUTION-MANAGER</b></H1>";
	menuhtml+="<form";
	menuhtml+="	id='requestToken'";
	menuhtml+="	method='get'";
	menuhtml+="	name=\"myForm\" autocomplete=\"on\">";
// <!-- 		encType="multipart/form-data"> //for post not for get-->
	menuhtml+="	<div class=\"center\">";
	menuhtml+="		User: <input type=\"text\" name=\"user\" id=\"user\" value=\"\"><br>";
	menuhtml+="		Password: <input type=\"password\" name=\"password\" id=\"password\" value=\"\" autocomplete=\"off\"> <br>";
	menuhtml+="		<input type=\"hidden\" name=\"pretty\" value=\"true\" />";
	menuhtml+="		<input type=\"submit\" onclick=\" exec_login(document.getElementById('user').value, document.getElementById('password').value); return false;\" value=\"LOGIN\" />";
	menuhtml+="	</div>";
	menuhtml+="</form>";
	menu_login.innerHTML = menuhtml;
	return true;
	}else{
		return false;
	}
}


function exec_load_header_footer(){
	exec_load_header();
	exec_load_menu_login();
	load_footer();
	checktoken();
}




function exec_login(user,password){
	var demoreplaceb = document.getElementById("demoreplaceb");
	var debug_phantom = document.getElementById("debug_phantom");
	var url = build_execman_path() +"/login?email="+user+"\&pw="+password+"";//?pretty='true'";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.status == 200) {
			var serverResponse = xhr.responseText;
			savetoken(serverResponse);
			checktoken();
		}else{
			var serverResponse = xhr.responseText;
			if(demoreplaceb) demoreplaceb.innerHTML = "<pre>Error: "+ serverResponse+ "</pre>";
			if(debug_phantom) debug_phantom.style.display = "block";
			exec_logout();
			checktoken();
		}
	};
	xhr.send(null);
	return false;
}



//_filter_workflow_taskid_experimentid
function jsontotable_exec_brief(myjson,count,first,level,lastwascoma,mtitle,filtered_fields){
	var html ="";
	var i;
	var counter=1;
// 	if(first==true){ html ="{"; }
	var mainc=mtitle;
	if(mtitle==true){
		html += "<div><table style='border:1px solid black'>\n";// style='width:100%'>";
		html += "<td>#</td><td align=\"center\"><a onclick=\"return list_execs(801,document.getElementById('appname').value)\" class=\"under-logs\">Execution id</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(802,document.getElementById('appname').value)\" class=\"under-logs\">Req status&nbsp;</a></td>\n";
		html += "<td align=\"center\"><a onclick=\"return list_execs(803,document.getElementById('appname').value)\" class=\"under-logs\">Project</a></td>\n";
		html += "<td align=\"center\"><a onclick=\"return list_execs(804,document.getElementById('appname').value)\" class=\"under-logs\">Map</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(805,document.getElementById('appname').value)\" class=\"under-logs\">Requested-by&nbsp;</a></td>\n";
		html += "<td align=\"center\"><a onclick=\"return list_execs(806,document.getElementById('appname').value)\" class=\"under-logs\">Input</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(5,document.getElementById('appname').value)\" class=\"under-logs\">Request date</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(807,document.getElementById('appname').value)\" class=\"under-logs\">Start timestamp&nbsp;</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(808,document.getElementById('appname').value)\" class=\"under-logs\">End timestamp&nbsp;</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(809,document.getElementById('appname').value)\" class=\"under-logs\">total time ns&nbsp;</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(810,document.getElementById('appname').value)\" class=\"under-logs\">CPU power consumption&nbsp;</a></td>\n";
		html += "<td align=\"center\">&nbsp;<a onclick=\"return list_execs(811,document.getElementById('appname').value)\" class=\"under-logs\">MEM power consumption&nbsp;</a></td>\n";
// 		io_power_consumption
		count++;
	}

	var countseries=0;
	myjson.forEach(function(val) {
// 		if (count != 1 && lastwascoma==false) {
// 			if(countseries==0) {
// 				html += ",<br>";
// 			}else{
// 				html += "<br>},{<br>";
// 			}
// 		};//this is not the first element
		lastwascoma=true;
		var keys = Object.keys(val);
		keys.forEach(function(key) {
			if (getType(val[key]) == "string" || getType(val[key]) == "other" ){
				var tobefiltered=false;
				for (i=0;i< filtered_fields.length;i++){
					if (key.endsWith(filtered_fields[i], key.length)== true) {
						tobefiltered=true;
					}
				}
				if (tobefiltered== false) {//it is stored the length of the strings, not need to show
// 					if (count != 1 && lastwascoma==false) html += ',<br>';
// 					for (i = 0; i < level; i++) {
// 						if (count != 1) html += '&emsp;';
// 					}
					if(mtitle==true){
						if(count>1){
							html += "</tr>\n<tr>";
// 							html += "</table></div></td><br>\n";
// 							html += "<div><table style='border:1px solid black'>\n";// style='width:100%'>";
						}
						html += "<td>"+counter+"</td><th> " + val['execution_id'] +" </th>\n";
						counter++;
						if(val['req_status']=="pending"){ //yellow
							html += "<td bgcolor=\"#f3ff3a\"";
						}else if(val['req_status']=="completed"){//green
							html += "<td bgcolor=\"#00FF00\"";
						}else if(val['req_status']=="cancelled"){//red
							html += "<td bgcolor=\"#ff3e29\"";
						}else if(val['req_status']=="started"){//green
							html += "<td bgcolor=\"#00FF00\"";
						}else{
							html += "<td bgcolor=\"#f3ff3a\"";
						}
						html += " align=\"center\"><font color=\"black\">";
						
						if (val['req_status']!=undefined){
							html += val['req_status'];
						}
						html += "&nbsp;</td>\n";

						html += "<td align=\"center\">&nbsp;" + val['project'] +"&nbsp;</td>\n";
						html += "<td align=\"center\">&nbsp;" + val['map'] +"&nbsp;</td>\n";
						html += "<td align=\"center\">&nbsp;" + val['requested-by'] +"&nbsp;</td>\n";
						html += "<td>";
						if (val['input']!=undefined){
							html += val['input'];
						}
						html += "&nbsp;</td>\n<td>" + val['req_date'] +"</td>\n";
						if (val['start_timestamp']!=undefined){
							html += "<td>" + val['start_timestamp'];
						}
						html += "&nbsp;</td>\n";

						html += "<td align=\"right\">" ;
						if (val['end_timestamp']!=undefined){
							html += val['end_timestamp'];
						}
						html += "&nbsp;</td>\n";

						html += "<td align=\"right\">" ;
						if (val['total_time_ns']!=undefined){
							html += Math.round(val['total_time_ns']);
						}
						html += "&nbsp;</td>\n";

						html += "<td align=\"right\">" ;
						if (val['cpu_power_consumption']!=undefined){
							html += val['cpu_power_consumption'];
						}
						html += "&nbsp;</td>\n";

						html += "<td align=\"right\">" ;
						if (val['mem_power_consumption']!=undefined){
							html += val['mem_power_consumption'];
						}
						html += "&nbsp;</td>\n";

						mtitle=false;
						count++;
						lastwascoma=false;
					}
					if((key=="rejection_reason")){
						if(val['req_status']=="rejected"){
							html += "<td><strong>\"" + key +"\"</strong>: \"" + val[key] +"\"</td>\n";
							count++;
							lastwascoma=false;
						}
					}else if((key!="req_status")&&(key!="energy")
						&&(key!="execution_id")&&(key!="app")&&(key!="device")
						&&(key!="project")
						&&(key!="map")
						&&(key!="requested-by")
						&&(key!="input")
						&&(key!="req_date")
						&&(key!="start_timestamp")
						&&(key!="total_time_ns")
						&&(key!="cpu_power_consumption")
						&&(key!="io_power_consumption")
						&&(key!="mem_power_consumption")
						&&(key!="net_power_consumption")
						&&(key!="num_of_processes")
						&&(key!="totaltid")
						&&(key!="num_of_threads")
						&&(key!="end_timestamp")){
						html += "<td><strong>\"" + key +"\"</strong>: \"" + val[key] +"\"</td>\n";
						count++;
						lastwascoma=false;
					}
				}
			}else if (getType(val[key]) == "array" || getType(val[key]) == "object" ) {
				if(key!= "component_stats"){
// 					if (count != 1) html += ',<br>';
// 					for (i = 0; i < level; i++) {
// 						if (count != 1) html += '&emsp;';
// 					}
					if(mtitle==true){
						if(count>1){
							html += "</table></div></td><br>\n";
							html += "<div><table style='border:1px solid black'>\n";// style='width:100%'>";
						}
						html += "<tr><th><strong>\"" + key + "\"</strong>: </th>\n";
						mtitle=false;
					}else{
						html += "<tr><td><strong>\"" + key + "\"</strong>: </td>\n";
					}
					count++;
					lastwascoma=false;
					html += "<td><div><table style='width:100%; border:0px solid black'>\n";// style='width:100%'>";
					html += jsontotable( ([ val[key] ]), count, true, level+1 ,lastwascoma,mtitle,filtered_fields);
					html += "</table></div></td>\n";
				}
// 			}else if (getType(val[key]) == "object" ) {
// 				html += jsontotable( ([ val[key] ]), count, false, level+1,lastwascoma,mtitle,filtered_fields);
			};
		});
		mtitle=true;
		countseries++;
	});
// 	if(first==true){ html += "<br>}"; }
	if(mainc==true)
		html += "</table></div>\n";
	return html;
}//jsontotable_exec_brief



function upload_exec_with_token( UploadJSON ) {
	var url = build_execman_path() +"/register_new_exec";
	upload_with_token( UploadJSON ,url);
	return false;
}

function update_exec_with_token( UploadJSON ) {
	var url = build_execman_path() +"/update_exec";
	upload_with_token( UploadJSON ,url);
	return false;
}

function list_exec_logs(mytype,execid){
	var url = build_execman_path() + "/get_log_list?sorttype="+mytype+"&pretty='true'";
	list_results(mytype,url,["host"],["_length","_index","_type","_score","sort"]);
	return false;
}

function list_execs(mytype,execname){
	var url = build_execman_path() +"/get_exec_list?sorttype="+mytype+"&app=\""+execname+"\"";
	list_results(mytype,url,["host"],["_length","start_timestamp_ns","end_timestamp_ns"]);
	return false;
}
