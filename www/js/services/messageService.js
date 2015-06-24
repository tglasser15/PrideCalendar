// handles all message communication between controllers as well as returns the proper string to avoid mistakes
calendar.factory('messageService', function () {
    return {

        messages: {
            toast: 'toast'
            , navigate: 'navigate'
            , openModal: 'openModal'
            , closeModal: 'closeModal'
            , confirmPopup: 'confirmPopup'
            , popupMsg: 'popupMsg'
            , createCalendar: 'createCalendar'
            , calendarAdd: 'calendarAdd'
            , viewCalendar: 'viewCalendar'
            , viewPdf: 'viewPdf'
        }

        , toast: {
            loginSuccess: function(user) {
                return "Welcome, " + user.get('username');
            }
            , error: function(error) {
                return "Error: " + error.code + " " + error.message;
            }
            , missingFields: 'Please fill out all required fields'
            , calendarSaved: 'You have successfully saved the calendar'
            , calendarRemoved: 'Calendar has been removed, please wait for page to refresh'
        }

        , popup: {

        }
    }
});