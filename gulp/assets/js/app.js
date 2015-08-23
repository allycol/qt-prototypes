// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation({
    equalizer : {
        equalize_on_stack: false
    },
    accordion: {
        callback : function (accordion) {
            $(document).foundation('reflow');
        }
    }
});

$(document).ready(function(){

  var offCanvasPanel = $('#scotch-panel').scotchPanel({
    containerSelector: 'body', // Make this appear on the entire screen
    direction: 'left', // Make it toggle in from the left
    duration: 300, // Speed in ms how fast you want it to be
    transition: 'ease', // CSS3 transition type: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(P1x,P1y,P2x,P2y)
    clickSelector: '.toggle-panel', // Enables toggling when clicking elements of this class
    distanceX: '87%', // Size fo the toggle
    enableEscapeKey: true, // Clicking Esc will close the panel
    beforePanelOpen: panelIsOpen,
    beforePanelClose: panelIsClosed
  });

  function panelIsOpen() {
    $('body').addClass('scotch-opened');
  }

  function panelIsClosed() {
    $('body').removeClass('scotch-opened');
  }

  $('.overlay').click(function() {
    offCanvasPanel.close();
  });

  $('.navigate ul li a').each(function(){
    if($(this).next('ul').length) {
      $(this).addClass('hasSubnav');
    }
  });

  var sublevelmenu = $('.navigate > ul > li a').bind('click', function(e){

    e.preventDefault;

    var $link = $(this);
    var $parent = $link.parent().parent(); // Parent <ul>
    var $siblings = $link.parent().siblings(); // <li>
    var $nextMenu = $link.next('ul'); // Nested <ul>

    var actionsHeight = $('.actions').height();

    var linkOffset = $link.offset();
    $('.showpos').text(linkOffset.top);

    var $hasSubnav = $nextMenu.length;

    if($hasSubnav) {
      $parent.addClass('push-left'); // Adds transform style
      $nextMenu.addClass('active-menu'); // Show relevant menu
      //$siblings.hide();
      // $('#scotch-panel').scrollTop(linkOffset.top);

      // Can we do this only if next menu is longer??
      $('#scotch-panel').scrollTop(actionsHeight);
    }

  });

  $('.backone').bind('click', function(e) {
    e.preventDefault;
    $(this).parent().parent().parent().parent().removeClass('push-left'); // Parent menu
    $(this).parent().parent().removeClass('active-menu'); // Hide itself
    $(this).parent().parent().parent().siblings().show(); // Show <li>'s of parent menu
  });

  // $('#scotch-panel').scroll(function(e){
  //   var scrollPos = $('.navigate').offset();
  //   $('.showpos').text("top: " + scrollPos.top);
  //
  //   if(scrollPos.top <= 0) {
  //     e.stopPropagation();
  //     $('.subnav li:first-child').addClass('fixit');
  //     console.log('Get fixed');
  //   } else {
  //     $('.subnav li:first-child').removeClass('fixit');
  //   }
  // });

  // var subLevelPanel;
  //
  // $('.toggle-inside-panel').bind('click', function(){
  //
  //    $openLink = $(this);
  //    $thisPanel = $openLink.next('.subLevel');
  //    $theParent = $openLink.parent('.navigate')
  //
  //
  //
  // });


  // FORM STUFF

  // $('.qt-calendar-wrap input').each(function(){
  //   // $(this).attr('autocapitalize', 'false');
  //   $(this).addClass('pants');
  // });

  // Toggle options on Flight search form
  $('.toggle-form-options').on('change', function(){
    var $option = $(this).attr('id');
    // console.log($option);
    if($option == 'oneway') {
        $('.return-date').fadeOut();
        $('.qt-date-selection').removeClass('both-ways');
    } else if($option == 'return') {
      $('.return-date').fadeIn();
      $('.qt-date-selection').addClass('both-ways');
    } else if($option == 'multicity') {

    }
  });

  // Number incrementor - used for people value
  $('.qt-input-incrementor .qt-input-icon-right').click(function( event ) {
      event.preventDefault();
      var oldval = parseInt($(this).parent().find("input").val());
      var newval = parseInt($(this).parent().find("input").val())+1;
      $(this).parent().find("input").val(newval);
  });

  $('.qt-input-incrementor .qt-input-icon-left').click(function( event ) {
      event.preventDefault();
      var oldval = parseInt($(this).parent().find("input").val());
      if(oldval != 0){
          var newval = parseInt($(this).parent().find("input").val())-1;
          $(this).parent().find("input").val(newval);
      }
  });

  // Fancy looking select dropdown and used for auto-complete
  $('.qt-dropdown').click(function(event){
    event.stopPropagation();
  });
  $('.qt-dropdown').click(function() {
      $(this).find('.qt-dropdown-content').css("visibility","visible");
      $(this).addClass('open');
  });
  $('.qt-dropdown-content').find('a').bind('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    var inputValue = $(this).text();
    $(this).parents('.qt-dropdown').find('input').attr('value', inputValue);
    $(this).parents('.qt-dropdown-content').css("visibility","hidden").parent().removeClass('open');;
  });
  $(document).bind('click', function() {
    $('.qt-dropdown-content').css("visibility","hidden");
    $('.qt-dropdown').removeClass('open');
  });

  $('.qt-datepicker').pikaday({
    format: 'D MMM YYYY',
    numberOfMonths: 2,
    onSelect: function() {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
  });

});

// RESPONSIVE TABLES

$(document).ready(function() {
  var switched = false;
  var updateTables = function() {
    if (($(window).width() < 767) && !switched ){
      switched = true;
      $("table.responsive").each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && ($(window).width() > 767)) {
      switched = false;
      $("table.responsive").each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };

  $(window).load(updateTables);
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", updateTables);


	function splitTable(original)
	{
		original.wrap("<div class='table-wrapper' />");

		var copy = original.clone();
		copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
		copy.removeClass("responsive");

		original.closest(".table-wrapper").append(copy);
		copy.wrap("<div class='pinned' />");
		original.wrap("<div class='scrollable' />");

    setCellHeights(original, copy);
	}

	function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
	}

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });

    });

    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  }

});
