sap.ui.define([
    "sap/ui/core/mvc/Controller", "logaligroup/employees/model/formatter"
],


/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, formatter) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({
            index: index + 1
        });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
        /*
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({
            index: index + 1
        });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);*/


    };
    function onSaveIcidence(oEvent) { /*
        var Incidence = oEvent.getSource().getParent().getParent();
        var rowIncidence = Incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIcidence", {incidenceRow}) */
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", {
            incidenceRow: incidenceRow.sPath.replace('/', '')
        });

    };
    function onDeleteIncidence(oEvent) {
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        this._bus.publish("incidence", "onDeleteIncidence", {
            IncidenceId: contextObj.IncidenceId,
            SapId: contextObj.SapId,
            EmployeeId: contextObj.EmployeeId
        });

        /*   var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncidence = oEvent.getSource().getParent().getParent();
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObj = rowIncidence.getBindingContext("incidenceModel");
        odata.splice(contextObj.index - 1, 1);
        for (var i in odata) {
            odata[i].index = parseInt(i) + 1;
        };
        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncidence);
        for (var j in tableIncidence.getContent()) {
            tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
        }
*/
    };
    var EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});


    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.onSaveIcidence = onSaveIcidence;
    return EmployeeDetails;

})
