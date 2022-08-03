const counters = document.querySelectorAll('.value');
const speed = 400;

counters.forEach(counter => {
  const animate = () => {
    const value = +counter.getAttribute('akhi');
    const data = +counter.innerText;

    const time = value / speed;
    if (data < value) {
      counter.innerText = Math.ceil(data + time);
      setTimeout(animate, 1);
    } else {
      counter.innerText = value;
    }

  }

  animate();
});


document.addEventListener('DOMContentLoaded', () => {


  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  if ($navbarBurgers.length > 0) {


    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});

$(document).ready(function () {


  $(".navbar-burger").click(function () {

    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });
});











$(document).ready(function () {
  $(".open").click(function () {
    var container = $(this).parents(".topic");
    var answer = container.find(".answer");
    var trigger = container.find(".faq-t");

    answer.slideToggle(200);

    if (trigger.hasClass("faq-o")) {
      trigger.removeClass("faq-o");
    } else {
      trigger.addClass("faq-o");
    }

    if (container.hasClass("expanded")) {
      container.removeClass("expanded");
    } else {
      container.addClass("expanded");
    }
  });
  $(".question").each(function () {
    $(this).attr(
      "data-search-term",
      $(this).text().toLowerCase() + $(this).find("ptag").text().toLowerCase()
    );
  });

  $(".live-search-box").on("keyup", function () {
    var searchTerm = $(this).val().toLowerCase();

    $(".question").each(function () {
      if (
        $(this).filter("[data-search-term *= " + searchTerm + "]").length > 0 ||
        searchTerm.length < 1
      ) {
        $(this).parent().parent().show();
      } else {
        $(this).parent().parent().hide();
      }
    });
  });
});
window.addEventListener("scroll", reveal);

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowheight = window.innerHeight;
    var revealtop = reveals[i].getBoundingClientRect().top;
    var revealpoint = 150;

    if (revealtop < windowheight - revealpoint) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}
