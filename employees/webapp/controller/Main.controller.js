sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {


    return Controller.extend("logaligroup.employees.controller.Main", {
        /*  onBeforeRendering: function () {
            this._employeeDetailsView = this.getView().byId("detailEmployeeView");

        },*/
        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("detailEmployeeView");
        },

        onInit: function () {

            let oView = this.getView();
            let oJSONModelEmp = new sap.ui.model.json.JSONModel();
            oJSONModelEmp.loadData("../localService/mockdata/Employee.json", false);
            oView.setModel(oJSONModelEmp, "jsonEmployee");

            let oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            // Layout
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
            /*  this._bus.subscribe("flexible", "showEmployee",    this.showEmployeeDetails, this);
            this._bus.subscribe("incidence", "onSaveIcidence", this.onSaveOdataIcidence, this);*/

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            this._bus.subscribe("incidence", "onDeleteIncidence", function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId + "',SapId='" + data.SapId + "',EmployeeId='" + data.EmployeeId + "')", {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });
            }, this);


        },

    
        showEmployeeDetails: function (category, nameEvent, path) {
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();
            this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        },

        onSaveODataIncidence: function (channelId, eventId, data) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();
            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    Type: incidenceModel[data.incidenceRow].Type
                };                                                  
                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                       // sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            };
        },
        // Leo el odata
        onReadODataIncidence: function (employeeID) {

            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");

                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();
                    for (var incidence in data.results) {
                        data.results[incidence]._validateData = true;
                        data.results[incidence].enabledSave = false;

                        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {}
            });
        }

    });

});
