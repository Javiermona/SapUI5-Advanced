sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"

],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
    "use strict";
    function onInit() { // let i18nBundle = oView.getModel("i18n").getResourceBundle();
        let oView = this.getView();
        let oJSONModelEmp = new sap.ui.model.json.JSONModel();
        oJSONModelEmp.loadData("../localService/mockdata/Employee.json", false);
        oView.setModel(oJSONModelEmp, "jsonEmployee");

        let oJSONModelCountries = new sap.ui.model.json.JSONModel();
        oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false);
        oView.setModel(oJSONModelCountries, "jsonCountries");

        var oJSONModelConfig = new sap.ui.model.json.JSONModel({
            visibleID: true,
            visbleName: true,
            visbleCountry: true,
            visibleCity: false,
            visibleBtnShowCity: true,
            visibleBtnHideCity: false
        });
        oView.setModel(oJSONModelConfig, "JSONModelConfig");

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
        var oContext = IconPress.getBindingContext("jsonEmployee");
        if (!this._oDialogOrders) {
            this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
            this.getView().addDependent(this._oDialogOrders);
        };

        // Dialog Binding to the context to have access to the data og slected item
        this._oDialogOrders.bindElement("jsonEmployee>" + oContext.getPath());
        // open dialig
        this._oDialogOrders.open();
    };

        /*  //Eliminamos todo.
     
     var ordersTable = this.getView().byId("OrdersTables");
        ordersTable.destroyItems();

        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("jsonEmployee");
        var objectContext = oContext.getObject();
        var orders = objectContext.Orders; // Pedidos del empleado pulsado
        var ordersItems = [];

        for (var i in orders) { // Columnas
            ordersItems.push(new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Label(
                        {text: orders[i].OrderID}
                    ),
                    new sap.m.Label(
                        {text: orders[i].Freight}
                    ),
                    new sap.m.Label(
                        {text: orders[i].ShipAddress}
                    )
                ]
            }));
        }
        // ETIQUETAS
        var newTable = new sap.m.Table({
            width: "auto",
            columns: [
                new sap.m.Column(
                    {
                        header: new sap.m.Label(
                            {text: "{i18n>orderID}"}
                        )
                    }
                ),
                new sap.m.Column(
                    {
                        header: new sap.m.Label(
                            {text: "{i18n>freight}"}
                        )
                    }
                ),
                new sap.m.Column(
                    {
                        header: new sap.m.Label(
                            {text: "{i18n>shipAddress}"}
                        )
                    }
                )
            ],
            items: ordersItems
        }).addStyleClass("sapUiSmallMargin");
        ordersTable.addItem(newTable);

        //Nueva tabla.
        var newTableJSON = new sap.m.Table();
        newTableJSON.setWidth("auto");
        newTableJSON.addStyleClass("sapUiSmallMargin");
        var columnOrderID = new sap.m.Column();
        var labelOrderID = new sap.m.Label();
        labelOrderID.bindProperty("text", "i18n>orderID");
        columnOrderID.setHeader(labelOrderID);
        newTableJSON.addColumn(columnOrderID);
        var columnFreight = new sap.m.Column();
        var labelFreight = new sap.m.Label();
        labelFreight.bindProperty("text", "i18n>freight");
        columnFreight.setHeader(labelFreight);
        newTableJSON.addColumn(columnFreight);
        var columnShipAddress = new sap.m.Column();
        var labelShipAddress = new sap.m.Label();
        labelShipAddress.bindProperty("text", "i18n>shipAddress");
        columnShipAddress.setHeader(labelShipAddress);
        newTableJSON.addColumn(columnShipAddress);
        var columnListItem = new sap.m.ColumnListItem();
        var cellOrderID = new sap.m.Label();
        cellOrderID.bindProperty("text", "jsonEmployee>OrderID");
        columnListItem.addCell(cellOrderID);
        var cellFreight = new sap.m.Label();
        cellFreight.bindProperty("text", "jsonEmployee>Freight");
        columnListItem.addCell(cellFreight);
        var cellShipAddress = new sap.m.Label();
        cellShipAddress.bindProperty("text", "jsonEmployee>ShipAddress");
        columnListItem.addCell(cellShipAddress);
        var oBindingInfo = {
            model: "jsonEmployee",
            path: "Orders",
            template: columnListItem
        };
        newTableJSON.bindAggregation("items", oBindingInfo);
        newTableJSON.bindElement("jsonEmployee>" + oContext.getPath());
        ordersTable.addItem(newTableJSON);
    };
*/

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

    function showPostCode(oEvent) {
        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("jsonEmployee");
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
    Main.prototype.onInit = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onClearFilter = onClearFilter;
    Main.prototype.showPostCode = showPostCode;
    Main.prototype.onShowCity = onShowCity;
    Main.prototype.onHideCity = onHideCity;
    Main.prototype.showOrders = showOrders;
    Main.prototype.onCloseOrders = onCloseOrders;
    return Main;
});
