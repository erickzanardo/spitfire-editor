// This widget is accessible only byt the SpitfireManager, so it's include directly on the editor.html page
function Modal($body, manager){
    this._$body = $body;
    this._manager = manager;
    this._element = $(
        '<div class="modal fade">' +
        '  <div class="modal-dialog">' +
        '    <div class="modal-content">' +
        '      <div class="modal-header">' +
        '        <h4 class="modal-title"></h4>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '      </div>' +
        '      <div class="modal-footer">' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>');
}

Modal.prototype = {
    title: function(title) {
        this._element.find('.modal-title').text(title);
    },
    body: function(element) {
        this._element.find('.modal-body').append(element);
    },
    addButton: function(label, type, callback) {
        var button = $('<button class="btn"></button>');
        button.text(label);
        button.addClass(type);
        this._element.find('.modal-footer').append(button);
        button.click(callback);
    },
    addDefaultButton: function(label, callback) {
        this.addButton(label, 'btn-default', callback);
    },
    addPrimaryButton: function(label, callback) {
        this.addButton(label, 'btn-primary', callback);
    },
    show: function() {
        this._manager.currentModal(this);
        this._$body.append(this._element);
        this._element.modal('show');
    },
    close: function() {
        this._manager.currentModal(null);
        this._element.modal('hide');
        this._element.remove();
    },
    element: function() {
      return this._element;
    }
};