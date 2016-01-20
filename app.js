$('#station-select ul li').after('<div class="direction-select"><div id="westbound">Westbound</div><div id="eastbound">Eastbound</div></div>');
$('.direction-select').hide();
$('#train-schedule').hide();
$('.filter-options').hide();
var now = new Date();
var type = "";
var hour = (now.getHours()<10?'0':'') + now.getHours();
var minutes = (now.getMinutes()<10?'0':'') + now.getMinutes()
var milTime = hour + ":" + minutes;
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

function getStandardtime(i, v) {
	var time = i;
	var two = "02:00";
	if (milTime > two) {
		if (time < milTime && time > two) {
			v += " grayedout";
		}
	} else {
		if (time < milTime || time > two) {
			v += " grayedout";
		}
	}
	var time = time.split(':');
	var hours = Number(time[0]);
	var minutes = Number(time[1]);
	var timeValue = "";
	if(hours > 12) {
		timeValue += hours - 12;
	} else if (hours == 00) {
		timeValue += 12;
	} else {
		timeValue += hours;
	}
	timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
	timeValue += (hours >= 12) ? "p" : "a";
	var thingresult = "<li class='" + v + "'>" + timeValue + "</li>";
	return thingresult;
}

$(document).on('click', '.direction-select div', function() {
	direction = $(this).attr("id");
	directionname = $(this).text();
	directionday = direction + type;
	$.getJSON( "json/" + station + ".json", function( data ) {
		if(directionday == "eastboundweekday") {
            $.each(data.eastboundweekday[0], function(i,v) {
                $('#data-output ul').append(getStandardtime(i, v));
            });
            $('#data-output ul li').not('.grayedout').slice( 0, 9 ).clone().appendTo('#quick-list ul');
        }
        else if(directionday == "eastboundweekend") {
            $.each(data.eastboundweekend[0], function(i,v) {
                $('#data-output ul').append(getStandardtime(i, v));
            });
            $('#data-output ul li').not('.grayedout').slice( 0, 9 ).clone().appendTo('#quick-list ul');
        }
        else if(directionday == "westboundweekday") {
			$.each(data.westboundweekday[0], function(i,v) {
                $('#data-output ul').append(getStandardtime(i, v));
            });
            $('#data-output ul li').not('.grayedout').slice( 0, 9 ).clone().appendTo('#quick-list ul');
        }
        else if(directionday == "westboundweekend") {
        	$.each(data.westboundweekend[0], function(i,v) {
                $('#data-output ul').append(getStandardtime(i, v));
            });
            $('#data-output ul li').not('.grayedout').slice( 0, 9 ).clone().appendTo('#quick-list ul');
        }
	});
	$('#name-direction').text(stationname + " " + directionname);
	$('#station-select').fadeOut(100, function() {
		window.scroll(0,0);
		$('#train-schedule').fadeIn(100);
	});
});
$('#filter').click(function() {
	$('#filter').toggleClass('active');
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
		$('#quick-list ul').empty();
	});
});



var INITIAL_Y = 0; // Tracks initial Y position, needed to kill Safari bounce effect

function kill_safari_bounce() {
    $( document ).on( 'touchstart', function( e ){
        INITIAL_Y = e.originalEvent.touches[0].clientY;
    });

    $( document ).on( 'touchmove', function( e ) {
        // Get scrollable ancestor if one exists
        var scrollable_ancestor = $( e.target ).closest( '.station-scroll' )[0];

        // Nothing scrollable? Block move.
        if ( !scrollable_ancestor ) {
            e.preventDefault();
            return;
        }

        // If here, prevent move if at scrollable boundaries.
        var scroll_delta = INITIAL_Y - e.originalEvent.touches[0].clientY;
        var scroll_pos = scrollable_ancestor.scrollTop;         
        var at_bottom = (scroll_pos + $(scrollable_ancestor).height()) == scrollable_ancestor.scrollHeight;

        if ( (scroll_delta < 0 && scroll_pos == 0) ||
             (scroll_delta > 0 && at_bottom) ){
            e.preventDefault();
        }    
    });
}