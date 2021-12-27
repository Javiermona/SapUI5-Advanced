sap.ui.define(["sap/ui/core/mvc/Controller"],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
    "use strict";

   var Main = Controller.extend("logaligroup.employees.controller.MainView", {});
      

        Main.prototype.onValidate =   function() {
            let inputEmployee = this.byId("inputEmployee");
            let valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
               // inputEmployee.setDescription("OK");
               this.getView().byId("labelCountry").setVisible(true);
               this.getView().byId("slCountry").setVisible(true);
            } else {
               //  inputEmployee.setDescription("NOT OK");
               this.getView().byId("labelCountry").setVisible(false);
               this.getView().byId("slCountry").setVisible(false);
            }
        };
        return Main;
    
});
