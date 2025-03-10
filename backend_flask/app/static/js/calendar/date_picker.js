window.onload = function() {
    flatpickr("#dateInput", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        defaultDate: new Date()
    });
};