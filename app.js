$(function() {
    FastClick.attach(document.body);
});

$('#station-select ul li').after('<div class="direction-select"><div id="eastbound">Eastbound</div><div id="westbound">Westbound</div></div>');
$('.direction-select').hide();
$('#train-schedule').hide();
$('.filter-options').hide();
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
	$(this).next('.direction-select').slideToggle(100, 'easeInOutQuint');

});

$(document).on('click', '.direction-select div', function() {
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
	$('#station-select').fadeOut(100, function() {
		window.scrollTo(0,0);
		$('#train-schedule').fadeIn(100);
	});
});
$('#filter').click(function() {
	$('.filter-options').slideToggle(100, 'easeInOutQuint');
});
$('#red').click(function() {
	if(!this.checked) {
		$('.red').hide();
	} else {
		$('.red').show();
	}
});
$('#blue').click(function() {
	if(!this.checked) {
		$('.blue').hide();
	} else {
		$('.blue').show();
	}
});
$('#start-over').click(function() {
	$('.direction-select').hide();
	$('#train-schedule').fadeOut(100, function () {
		$('#station-select').fadeIn(100);
		$('#data-output ul').empty();
	});
});