(function ($) {
  $('.js-spanize').each(function () {
    const text = $(this).text();
    const letters = text.split('');

    const spanned = letters
      .map((char, i) => `<span style="--i:${i}">${char}</span>`)
      .join('');

    $(this).html(spanned);
  });
})(jQuery);

