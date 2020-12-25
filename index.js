$(document).ready(function(){
    $(".work-filter-list").isotope();

	$(".work-filter li").on('click', function(){
	    var selector = $(this).attr('data-filter');
	    $(".work-filter-list").isotope({
	        filter:selector
	    });
	});
})
