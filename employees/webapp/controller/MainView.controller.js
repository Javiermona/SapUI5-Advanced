sap.ui.define(["sap/ui/core/mvc/Controller",
               "sap/ui/model/Filter",
               "sap/ui/model/FilterOperator"

],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator ) {
    "use strict";
    function onInit() {
        let oJSONModel = new sap.ui.model.json.JSONModel();
        let oView = this.getView();
        let i18nBundle = oView.getModel("i18n").getResourceBundle();
        
       oJSONModel.loadData("../localService/mockdata/Employee.json",false );
       // oJSONModel.attachRequestCompleted( function (oEventModel) {
       // console.log(JSON.stringify(oJSONModel.getData()));
       //  });  
       oView.setModel(oJSONModel);  
    };

function onFilter() {   
var oJSON = this.getView().getModel().getData();
var filters = [];

    if  (oJSON.EmployeeId !== "" ) {
        filters.push(new Filter("EmployeeID", FilterOperator.EQ,oJSON.EmployeeId));
    }

    if  (oJSON.CountryKey !== "" ) {
        filters.push(new Filter("Country", FilterOperator.EQ,oJSON.CountryKey));
    }
        var oList = this.getView().byId("tableEmployee");
        var oBinding = oList.getBinding("items"); 
        oBinding.filter(filters);
} ;
function  onClearFilter() { 
    var oModel = this.getView().getModel();
    oModel.setProperty("/EmployeeId", "");
    oModel.setProperty("/CountryKey", "");
} ;

function  showPostCode(oEvent) {  
var itemPressed = oEvent.getSource();
var oContext = itemPressed.getBindingContext();
var objectContext = oContext.getObject();
sap.m.MessageToast.show(objectContext.PostalCode);
} 

    var Main = Controller.extend("logaligroup.employees.controller.MainView", {});


    Main.prototype.onValidate = function () {
        let inputEmployee = this.byId("inputEmployee");
        let valueEmployee = inputEmployee.getValue();

        if (valueEmployee.length === 6) { // inputEmployee.setDescription("OK");
            this.getView().byId("labelCountry").setVisible(true);
            this.getView().byId("slCountry").setVisible(true);
        } else { // inputEmployee.setDescription("NOT OK");
            this.getView().byId("labelCountry").setVisible(false);
            this.getView().byId("slCountry").setVisible(false);
        }
    };
    Main.prototype.onInit   = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onClearFilter = onClearFilter;
    Main.prototype.showPostCode  = showPostCode;
    return Main;
});
