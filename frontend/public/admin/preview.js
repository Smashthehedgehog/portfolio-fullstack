// Registers a live preview pane for the "articles" collection that mirrors
// the structure ArticleDetail.js actually renders on the public site
// (title / date+author / divider / body), styled by preview.css so authors
// see something close to the real published look before saving.
;(function () {
  function formatDate(dateString) {
    if (!dateString) return '';
    var d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }

  var ArticlePreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var title = entry.getIn(['data', 'title']) || '';
      var date = entry.getIn(['data', 'date']) || '';
      var author = entry.getIn(['data', 'author']) || '';

      return h('div', { className: 'App-content-stuff d-flex flex-column' },
        h('div', { className: 'blog-container d-flex flex-column mb-2 p-4' },
          h('div', { className: 'd-flex justify-content-center mb-2' },
            h('h1', { className: 'newspaper-title text-center mb-3' }, title)
          ),
          h('div', { className: 'd-flex justify-content-between' },
            h('p', { className: 'newspaper-legal' }, formatDate(date)),
            h('p', { className: 'newspaper-legal' }, author)
          ),
          h('div', { className: 'horizontal-line-grey mt-3 mb-3' }),
          h('div', { className: 'newspaper-body' }, this.props.widgetFor('body'))
        )
      );
    },
  });

  CMS.registerPreviewStyle('/admin/preview.css');
  CMS.registerPreviewTemplate('articles', ArticlePreview);
})();
