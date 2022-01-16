sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"

], function (Controller, History) {

    function _onObjectMatched(oEvent){
        this.getView().bindElement({    
            path: "/Orders(" + oEvent.getParameters(arguments).arguments.OrderID + ")",
            // oEvent.getParameters("arguments").OrderID + ")",
            model: "odataNorthwind"
        });
        //Orders(10248)", type: "NorthwindModel.Order"
    }

    return Controller.extend("logaligroup.employees.controller.OrderDetails", {  
 

        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        },

        onBack: function (oEvent) {
            let oHistory = History.getInstance();
            let sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined ) {
                //Llegó por el inicio.
                window.history.go(-1);
            } else {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true );
            }

        }, 
            onClearSignature: function (oEvent) {
                var signature = this.byId("signature");
                signature.clear();


        }

    });
});