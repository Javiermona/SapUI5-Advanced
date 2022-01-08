sap.ui.define([
    "sap/ui/core/mvc/Controller",  
    "sap/ui/model/json/JSONModel"
], 
 
function (Controller, JSONModel) {
   

    return Controller.extend("logaligroup.employees.controller.Main", 
 { 
    onInit: function () { 
     
        let oView = this.getView();
          let oJSONModelEmp = new sap.ui.model.json.JSONModel();
          oJSONModelEmp.loadData("../localService/mockdata/Employee.json", false);
          oView.setModel(oJSONModelEmp, "jsonEmployee");
  
          let oJSONModelCountries = new sap.ui.model.json.JSONModel();
          oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false);
          oView.setModel(oJSONModelCountries, "jsonCountries");
          
    //Layout 
          let oJSONModelLayout = new sap.ui.model.json.JSONModel();
          oJSONModelLayout.loadData("../localService/mockdata/Layout.json", false);
          oView.setModel(oJSONModelLayout, "jsonLayout");

          var oJSONModelConfig = new sap.ui.model.json.JSONModel({
              visibleID: true,
              visbleName: true,
              visbleCountry: true,
              visibleCity: false,
              visibleBtnShowCity: true,
              visibleBtnHideCity: false
          });
          oView.setModel(oJSONModelConfig, "JSONModelConfig");    

          this._bus = sap.ui.getCore().getEventBus();
          this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
  },
            //Funcion
            showEmployeeDetails: function(category, nameEvent, path) {
                var detailView = this.getView().byId("employeeDetailsView");
                detailView.bindElement("jsonEmployee>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");       
            
                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();
            
            } 


});

});  

  