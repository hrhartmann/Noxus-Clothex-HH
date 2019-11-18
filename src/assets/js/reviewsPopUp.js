document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.getElementsByClassName("showreview");
    Array.prototype.forEach.call(buttons, (button => {
        button.addEventListener('click', openModal);
        
    }))
    function openModal(event){
        const id = this.id;
        const modal = document.getElementById(`form-${id}`);
        modal.style.display = 'block';
    }
});
  