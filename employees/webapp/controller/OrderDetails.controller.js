sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"

], function (Controller, History, MessageBox) {

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


        },
        onSaveSignatre: function(oEvent){
        //obtengo instacia de la firma
            const signature = this.byId("signature");
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let signaturePng;

            if(!signature.isFull()) {//Si no tenemos la firma
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            }else {

                signaturePng = signature.getSignature().replace("data:image/png;base64","");

            };

            let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject(); //Obbtengi el id
            let body = {
                            orderID : objectOrder.OrderID.toString(),
                            sapId: this.getOwnerComponent().SapId,
                            employeeId: objectOrder.EmployeeID.toString(),
                            MimeType : "image/png",
                            MediaContent: signaturePng  //Contenido en binario
            };

            this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                success: function(){ 
                        MessageBox.information(oResourceBundle.getText("SignatureSave"));                          
                },
                error: function(){ 
                     MessageBox.error(oResourceBundle.getText("SignatureError"));
            },

            });




        },

        factoryOrderDetails: function(listId, oContext) {
            let contextObject = oContext.getObject();
            contextObject.Currency = "EUR";

            let UnitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock" ); //unidades en stock
           // odataNorthwind>Order_Detail
            if ( contextObject.Quantity <= UnitsInStock){
                let objectListItem = new sap.m.ObjectListItem({
                    title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                    number: "{parts: [{ path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency', formatOptions:{showMeasure: false}}",
                    numberUnit: "{odataNorthwind>Currency}"

                });
                return objectListItem;

            }else{
                let CustomListItem = new sap.m.CustomListItem({
                        content: [
                                new sap.m.Bar({
                                    contentLeft:   new sap.m.Label({text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"}) ,
                                    contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>AvailabelStock} {odataNorthwind>/Prodcuts(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error" }),
                                    contentRight:  new sap.m.Label({text: "{parts: [ { path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency'}"})
                                })

                        ]

                });
                return CustomListItem;

            }
        }

    });
});