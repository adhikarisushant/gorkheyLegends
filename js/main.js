$(document).ready(function () {
  // $('.owl-carousel').owlCarousel({
  //     loop: true,
  //     margin: 0,
  //     nav: false,
  //     pagination: false,
  //     autoplay: 0,
  //     animateOut: 'fadeOut',
  //     responsive: {
  //         0: {
  //             items: 1
  //         },
  //         600: {
  //             items: 1
  //         },
  //         1000: {
  //             items: 1
  //         }
  //     }
  // })

  $("#fullpage").fullpage({
    autoScrolling: true,
    fixedElement: ".navbar, .footer-section",
    anchors: [
      "hero-section",
      "collections",
      "about-us",
      "club-gorkhey",
      "blogs",
      "contact-us",
    ],
  });

  // nav item hover effect ..
  $(".nav-item").hover(
    function () {
      $(this).find(".dropdown-menu").show(500);
    },
    function () {
      $(this).find(".dropdown-menu").hide(200);
    }
  );
});
