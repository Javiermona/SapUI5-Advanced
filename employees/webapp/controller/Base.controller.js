sap.ui.define([
    "sap/ui/core/mvc/Controller" 
], function (Controller ) {


    return Controller.extend("logaligroup.employees.controller.Base", {  
 

        onInit: function () { },

        OrderDetails: function  (oEvent) {
            let OrderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this); // Paso el componente
            oRouter.navTo("RouteOrderDetails", {
                OrderID: OrderID
            });
             
        }

    });
});