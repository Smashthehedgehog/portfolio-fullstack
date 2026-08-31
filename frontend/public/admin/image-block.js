// Registers a custom "Image (resizable)" toolbar block for the article
// body editor. It serializes to a single, self-contained <img> tag (styled
// by the .cms-image* classes in ArticleDetail.css / preview.css) so the
// existing react-markdown + rehype-raw pipeline on the public site renders
// it with zero changes there.
;(function () {
  // Only needs to round-trip this component's own toBlock() output below,
  // not parse arbitrary HTML. A hand-edited tag that no longer matches this
  // pattern just falls back to inert raw text in the editor -- it doesn't
  // crash, it's just no longer re-editable as a form.
  var IMAGE_BLOCK_PATTERN =
    /^<img src="([^"]*)" alt="([^"]*)" class="cms-image cms-image-(left|right|center|none)" style="width:\s*(\d{1,3}%);?\s*" \/>$/;

  function escapeAttr(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  CMS.registerEditorComponent({
    id: 'image-block',
    label: 'Image (resizable)',
    fields: [
      { name: 'src', label: 'Image', widget: 'image' },
      { name: 'alt', label: 'Alt text', widget: 'string', required: false, default: '' },
      {
        name: 'width',
        label: 'Size',
        widget: 'select',
        options: ['25%', '50%', '75%', '100%'],
        default: '50%',
      },
      {
        name: 'align',
        label: 'Alignment',
        widget: 'select',
        options: [
          { label: 'Left (text wraps to the right)', value: 'left' },
          { label: 'Right (text wraps to the left)', value: 'right' },
          { label: 'Center (no text wrap)', value: 'center' },
          { label: 'None (block, no wrap)', value: 'none' },
        ],
        default: 'left',
      },
    ],
    pattern: IMAGE_BLOCK_PATTERN,
    fromBlock: function (match) {
      return { src: match[1], alt: match[2], align: match[3], width: match[4] };
    },
    toBlock: function (data) {
      var src = data.src || '';
      var alt = escapeAttr(data.alt);
      var align = data.align || 'none';
      var width = data.width || '100%';
      return '<img src="' + src + '" alt="' + alt + '" class="cms-image cms-image-' +
        align + '" style="width: ' + width + ';" />';
    },
    toPreview: function (data) {
      var align = data.align || 'none';
      var width = data.width || '100%';
      return h('img', {
        src: data.src,
        alt: data.alt,
        className: 'cms-image cms-image-' + align,
        style: { width: width },
      });
    },
  });
})();
