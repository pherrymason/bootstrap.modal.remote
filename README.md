# bootstrap.modal.remote
Bootstrap 4 Modal extended with ajax capabilities

Extend [bootstrap 4-modal](https://getbootstrap.com/docs/4.1/components/modal/) library with remote content capabilities.

## Install


## Usage
```
var $modal = $('#my-modal');
$modal.modalRemote({
  url: 'http://my-endpoint',
  endpointDataType: 'json',
  params: {query01: 'value', query02: 'value2'},
  callbacks: {
    onContentLoaded: function (json) {
      // Custom modal content injection
    }
  }
});
```
