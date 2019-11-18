document.addEventListener('DOMContentLoaded', function() {
    const fields = document.getElementsByClassName('field');
    Array.prototype.forEach.call(fields, function(field) {
        const input = field.getElementsByTagName('input')[0];
        input.addEventListener('focus', focus);
        input.addEventListener('focusout', focusOut);
    });
    function focus(event) {
        const field = this.parentElement;
        const label = field.getElementsByTagName('label')[0];
        label.classList.add('active');
    }
    function focusOut(event) {
        const field = this.parentElement;
        const label = field.getElementsByTagName('label')[0];
        if (this.value === '') {
            label.classList.remove('active');
        }
    }
});