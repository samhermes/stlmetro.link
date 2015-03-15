$('#direction-select').hide();
$('#train-schedule').hide();
var now = new Date();
var type = "";
var hour = now.getHours();
var day = now.getDay();
if (day == 0) {
	if (hour <= 2) {
		type = "weekday";
	}
	else {
		type = "weekend";
	}
} else if (day == 1) {
	if (hour <= 2) {
		type = "weekend";
	}
	else {
		type="weekday";
	}
} else if (day == 6) {
	type = "weekend";
} else {
	type = "weekday";
}
$("#type").text(type);

var station = "";
var stationname = "";
var direction = "";
var directionname = "";
var directionday = "";

$('#station-select ul li').click(function() {
	station = $(this).attr("id");
	stationname = $(this).text();
	$('#station-select').fadeOut('fast', function() {
		$('#direction-select').fadeIn('fast');
	});
});

$('#direction-select div').click(function() {
	direction = $(this).attr("id");
	directionname = $(this).text();
	directionday = direction + type;
	$.getJSON( "json/" + station + ".json", function( data ) {
		if(directionday == "eastboundweekday") {
            $.each(data.eastboundweekday[0], function(i,v) {
                $('#data-output ul').append($("<li />").addClass(v).text(i));
            });
        }
        else if(directionday == "eastboundweekend") {
            $.each(data.eastboundweekend[0], function(i,v) {
                $('#data-output ul').append($("<li />").addClass(v).text(i));
            });
        }
        else if(directionday == "westboundweekday") {
			$.each(data.westboundweekday[0], function(i,v) {
                $('#data-output ul').append($("<li />").addClass(v).text(i));
            });
        }
        else if(directionday == "westboundweekend") {
        	$.each(data.westboundweekend[0], function(i,v) {
                $('#data-output ul').append($("<li />").addClass(v).text(i));
            });
        }
	});
	$('#name-direction').text(stationname + " " + directionname);
	$('#direction-select').fadeOut('fast', function() {
		$('#train-schedule').fadeIn('fast');
	});
});
$('#start-over').click(function() {
	$('#train-schedule').fadeOut('fast', function () {
		$('#station-select').fadeIn('fast');
		$('#data-output ul').empty();
	});
});