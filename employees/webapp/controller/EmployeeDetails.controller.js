sap.ui.define([
    // "sap/ui/core/mvc/Controller", 
    "logaligroup/employees/controller/Base.controller",
    "logaligroup/employees/model/formatter", "sap/m/MessageBox"
],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Base, formatter, MessageBox) {
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
            index: index + 1,
            _validateDate: false,
            enabledSave: false
        });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);

    };
    function onDeleteIncidence(oEvent) {
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("ConfirmDeleteIncidence"), {
            onClose: function (oAction) {
                if (oAction === "OK") {

                    this._bus.publish("incidence", "onDeleteIncidence", {
                        IncidenceId: contextObj.IncidenceId,
                        SapId: contextObj.SapId,
                        EmployeeId: contextObj.EmployeeId
                    });
                }
            }.bind(this)
        });
    };


    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", {
            incidenceRow: incidenceRow.sPath.replace('/', '')
        });
    };

    function updateIncidenceCreationDate(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundel = this.getView().getModel("i18n").getResourceBundle();

        // if (!oEvent.getSource().isValidDate()){
        if (! oEvent.getSource().isValidValue()) {
            contextObj._validateData = false;
            contextObj.CreationDateState = "Error";
            MessageBox.error(oResourceBundel.getText("ErrorCreationDataValue"), {
                title: "Error",
                onClose: null,
                styleClas: "",
                actions: sap.m.MessageBox.Action.Close,
                emphasizedActon: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });
        } else {
            contextObj.CreationDateX = true;
            contextObj._validateDate = true;
            contextObj.CreationDateState = "None";
        };
        if (oEvent.getSource().isValidValue() && context.Reason) {
            contextObj.enabledSave = true;
        } else {
            contextObj.enabledSave = false;
        } context.getModel().refresh();
        // contextObj.CreationDateX = true;
    };
    function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        // contextObj.ReasonX = true;
        if (oEvent.getSource().getValue()) {
            contextObj.CreationReasonState = "None";
        } else {
            contextObj.ReasonX = false;
            contextObj.CreationReasonState = "Error";

        };
        if (contextObj._validateDate && oEvent.getSource().getValue()) {
            contextObj.enabledSave = true;
        } else {
            contextObj.enabledSave = false;
        } context.getModel().refresh();


    };
    function updateIncidenceType(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");

        let contextObj = context.getObject();
        if (contextObj._validateDate && contextObj.Reason) {
            contextObj.enabledSave = true;
        } else {
            contextObj.enabledSave = false;
        } contextObj.TypeX = true;
        context.getModel().refresh();
    };

     

    var EmployeeDetails = Base.extend("logaligroup.employees.controller.EmployeeDetails", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
 
    return EmployeeDetails;

})
