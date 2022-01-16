sap.ui.define([
    "logaligroup/employees/controller/Base.controller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
    
],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * 
     */
    function (Base, Filter, FilterOperator, JSONModel) {
    "use strict";
    function onInit() { // let i18nBundle = oView.getModel("i18n").getResourceBundle();
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onShowCity() {
        var oJSONModelConfig = this.getView().getModel("JSONModelConfig");
        oJSONModelConfig.setProperty("/visibleCity", true);
        oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
        oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

    };

    function onHideCity() {
        var oJSONModelConfig = this.getView().getModel("JSONModelConfig");
        oJSONModelConfig.setProperty("/visibleCity", false);
        oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
        oJSONModelConfig.setProperty("/visibleBtnHideCity", false);

    };

    function onCloseOrders(){
        this._oDialogOrders.close();
    };

    function showOrders(oEvent) {
        // Creamos la tabla dinamica
        // obtenemos el controlador seleccionado.
        var IconPress = oEvent.getSource();

        // Contecto del modelo
        var oContext = IconPress.getBindingContext("odataNorthwind");
        if (!this._oDialogOrders) {
            this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
            this.getView().addDependent(this._oDialogOrders);
        };

        // Dialog Binding to the context to have access to the data og slected item
        this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
        // open dialig
        this._oDialogOrders.open();
    };

       

   function onFilter() {
        var oJSONCountries = this.getView().getModel("jsonCountries").getData();
        var filters = [];

        if (oJSONCountries.EmployeeId !== "") {
            filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
        }

        if (oJSONCountries.CountryKey !== "") {
            filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
        }
        var oList = this.getView().byId("tableEmployee");
        var oBinding = oList.getBinding("items");
        oBinding.filter(filters);
    };
    function onClearFilter() {
        var oModel = this.getView().getModel("jsonCountries");
        oModel.setProperty("/EmployeeId", "");
        oModel.setProperty("/CountryKey", "");
    };
    
    /*function showEmployee (oEvent) {
        
        var path = oEvent.getSource().getBindingContext("jsonEmployee").getPath();
        this._bus.publish("felexible", "showEmployee", path);
    };*/
    function showEmployee(oEvent) {
    var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
    this._bus.publish("flexible", "showEmployee", path);
    };


    function showPostCode(oEvent) {
        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("odataNorthwind");
        var objectContext = oContext.getObject();
        sap.m.MessageToast.show(objectContext.PostalCode);
    };

/*
    function OrderDetails(oEvent){
  
        let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
        let oRouter = sap.ui.core.UIComponent.getRouterFor(this); // Paso el componente
        oRouter.navTo("RouteOrderDetails",{
            OrderID : orderID 
        });
 
    };
*/


    var Main = Base.extend("logaligroup.employees.controller.MasterEmployee", {});

   

    Main.prototype.onInit = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onClearFilter = onClearFilter;
    Main.prototype.showPostCode = showPostCode;
    Main.prototype.onShowCity = onShowCity;
    Main.prototype.onHideCity = onHideCity;
    Main.prototype.showOrders = showOrders;
    Main.prototype.onCloseOrders = onCloseOrders;
    Main.prototype.showEmployee  = showEmployee; 
    return Main;
});
