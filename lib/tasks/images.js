module.exports = resolve;
var debug = require('debug')('inliner');

function resolve(inliner, todo, $) {
  debug('start %s links', todo.length);
  return todo.map(function images(image) {
    var $image = $(image);

    var attr = 'src';
    if ($image.attr('source')) {
      attr = 'source';
    }

    var url = inliner.resolve(inliner.url, $image.attr(attr));

    if (inliner.options.skipAbsoluteUrls &&
        (url.indexOf('//') === 0 || url.indexOf('http') === 0)) {
      debug('skipping remote image');
      inliner.emit('progress', 'skipping remote image');
      return false;
    }

    return inliner.image(url).then(function then(dataURL) {
      $image.attr(attr, dataURL);
    }).then(inliner.jobs.done.images);
  });
}

