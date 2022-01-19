sap.ui.define(["sap/ui/core/Control"], function (Control) {
    "use strict";

    return Control.extend("logaligroup.employees.control.Signature", {
        metadata: {
            properties: {
                "width": {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "400px"
                },
                "height": {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100px"
                },
                "bgcolor": {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "white"
                }
            }
        },

        onInit: function () {},
        renderer: function (oRm, oControl) {
            oRm.write("<div");
                    oRm.addStyle("width", oControl.getProperty("width"));
                    oRm.addStyle("height", oControl.getProperty("height"));
                    oRm.addStyle("background-color", oControl.getProperty("bgcolor"));
                    oRm.addStyle("border", "1px solid black");
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write("<canvas width='" + oControl.getProperty("width") + "' " + "height='" + oControl.getProperty("height") + "'");
                    oRm.write("></canvas>");
                    oRm.write("</div>");
        },

        onAfterRendering: function () {
            var canvas = document.querySelector("canvas");
        try {
            // @ts-ignore
                this.signaturePad = new SignaturePad(canvas);
                this.signaturePad.fill = false;
                canvas.addEventListener("mousedown", function(){
                    this.signaturePad.fill = true;

                }.bind(this));

            } catch (e) {
                console.error(e);
            }
        },
        clear: function () {
            this.signaturePad.clear();
            this.signaturePad.fill = false;
        },

        isFill: function () {
        return this.signaturePad.fill;

        },
        getSignature: function() {
            return this.signaturePad.toDataURL();

        },

        setSignature: function(signature){

      this.signaturePad.fromDataURL(signature);

        }



    });

});
