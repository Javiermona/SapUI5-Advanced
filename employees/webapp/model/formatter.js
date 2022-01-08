sap.ui.define([], 
    
    function () {
    function datFormat(date) {
        var timeDay = 24 * 60 * 60 * 1000;
        if (date) {
            var dateNow = new Date();
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy/MM/dd"});
            var dateNowFormat = new Date(dateFormat.format(dateNow));
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (true) { // today
                case date.getTime() === dateNowFormat.getTime():
                    return oResourceBundle.getText("today");
                    // tomorrow
                case date.getTime() === dateNowFormat.getTime() + timeDay: return oResourceBundle.getText("tomorrow");
                    // yesterday
                case date.getTime() === dateNowFormat.getTime() - timeDay: return oResourceBundle.getText("yesterday");
                default :
                return "";

            }

        } else {}


    }
    return {datFormat: datFormat};

})

 