sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/m/MessageBox",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator"

], function (Controller, History, MessageBox,Filter, FilterOperator) {

    function _onObjectMatched(oEvent) {
        this.onClearSignature();


        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameters(arguments).arguments.OrderID + ")",
            // oEvent.getParameters("arguments").OrderID + ")",
            model: "odataNorthwind",
            events: {
                dataReceived: function (oData) {

                    _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
               }
          });
        // Orders(10248)", type: "NorthwindModel.Order"

        const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders(" +
        oEvent.getParameter("arguments").OrderID + ")").getObject();
        if (objContext) {
        _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
        }
        };

        function _readSignature(orderId, employeeId) {
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId
            + "',SapId='" + this.getOwnerComponent().SapId
            + "',EmployeeId='" + employeeId + "')", {
            success: function (data) {
            const signature = this.getView().byId("signature");
            if (data.MediaContent !== "") {
            signature.setSignature("data:image/png;base64," + data.MediaContent);
            }
            }.bind(this),
            error: function (data) {
            }
            });

//Bind Files
this.byId("uploadCollection").bindAggregation("items", {
    path: "incidenceModel>/FilesSet",
    filters: [
    new Filter("OrderId", FilterOperator.EQ, orderId),
    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
    new Filter("EmployeeId", FilterOperator.EQ, employeeId),
    ],
    template: new sap.m.UploadCollectionItem({
        documentId: "{incidenceModel>AttId}",
        visibleEdit: false,
        fileName: "{incidenceModel>FileName}"
        }).attachPress(this.downloadFile)
        });
        };

             


    return Controller.extend("logaligroup.employees.controller.OrderDetails", {


        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        },

        onBack: function (oEvent) {
            let oHistory = History.getInstance();
            let sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) { // Llegó por el inicio.
                window.history.go(-1);
            } else {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }

        },
        onClearSignature: function (oEvent) {
            var signature = this.byId("signature");
            signature.clear();


        },
        onSaveSignatre: function (oEvent) { // obtengo instacia de la firma

             const signature = this.byId("signature");  
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let signaturePng;

            if (!signature.isFill()) {
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            } else {

                signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                let body = {
                    OrderId: objectOrder.OrderID.toString(),
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: objectOrder.EmployeeID.toString(),
                    MimeType: "image/png",
                    MediaContent: signaturePng
                };

                this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                    success: function () {
                        MessageBox.information(oResourceBundle.getText("signatureSaved"));
                    },
                    error: function () {
                        MessageBox.error(oResourceBundle.getText("signatureNotSaved"));
                    }
                });
            };
             
            /*
            const signature = this.byId("signature");
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let signaturePng;

            if (!signature.isFill()) { // Si no tenemos la firma
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            } else {

                signaturePng = signature.getSignature().replace("data:image/png;base64,", "");

           

            let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject(); // Obbtengi el id
            let body = {
                orderID: objectOrder.OrderID.toString(),
                sapId: this.getOwnerComponent().SapId,
                employeeId: objectOrder.EmployeeID.toString(),
                MimeType: "image/png",
                MediaContent: signaturePng // Contenido en binario
            };

            this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                success: function () {
                    MessageBox.information(oResourceBundle.getText("SignatureSave"));
                },
                error: function () {
                    MessageBox.error(oResourceBundle.getText("SignatureError"));
                }

            });
        };
*/
        },

        factoryOrderDetails: function (listId, oContext) {
            let contextObject = oContext.getObject();
            contextObject.Currency = "EUR";

            let UnitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");
            // unidades en stock
            // odataNorthwind>Order_Detail
            if (contextObject.Quantity <= UnitsInStock) {
                let objectListItem = new sap.m.ObjectListItem({
                    title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                    number: "{parts: [{ path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency', formatOptions:{showMeasure: false}}",
                    numberUnit: "{odataNorthwind>Currency}"

                });
                return objectListItem;

            } else {
                let CustomListItem = new sap.m.CustomListItem({
                    content: [new sap.m.Bar(
                            {
                                contentLeft: new sap.m.Label(
                                    {
                                        text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"
                                    }
                                ),
                                contentMiddle: new sap.m.ObjectStatus(
                                    {
                                        text: "{i18n>AvailabelStock} {odataNorthwind>/Prodcuts(" + contextObject.ProductID + ")/UnitsInStock}",
                                        state: "Error"
                                    }
                                ),
                                contentRight: new sap.m.Label(
                                    {text: "{parts: [ { path: 'odataNorthwind>UnitPrice'}, { path: 'odataNorthwind>Currency'}], type: 'sap.ui.model.type.Currency'}"}
                                )
                            }
                        )]

                });
                return CustomListItem;

            }
        },
        onFileBeforeUpload: function (oEvent) {
            let fileName = oEvent.getParameter("fileName");
            let objContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
            name: "slug",
            value: objContext.OrderID + ";" + this.getOwnerComponent().SapId + ";"
            + objContext.EmployeeID
            + ";" + fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        /*  }
              
        onFileBeforeUpload : function(oEvent){
               let filename = oEvent.getParameters("fileName"); 
               let objectContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
               let objectCustomer = new sap.m.UploadColectionParameter({
                    name: "slug",
                    value:  objectContext.OrderID + ";" + this.getOwnerComponent().SapId  +  ";" + objectContext.EmployeeID +  ";"  + filename
               });
               oEvent.getParameters().addHeaderParameter(objectCustomer);

              */

        },

        onFileUploadComplete: function (oEvent) {
            oEvent.getSource().getBinding("items").refresh();
            },
 
            onFileChange: function (oEvent) {
                let oUplodCollection = oEvent.getSource();
                // Header Token CSRF - Cross-site request forgery
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("incidenceModel").getSecurityToken()
                });
                oUplodCollection.addHeaderParameter(oCustomerHeaderToken);
        },
        onFileDeleted: function (oEvent) {
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
            this.getView().getModel("incidenceModel").remove(sPath, {
            success: function () {
            oUploadCollection.getBinding("items").refresh();
            },
            error: function () {
            }
            });
            },

            downloadFile: function(oEvent){
                var sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
                window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");

            }

    });
});
