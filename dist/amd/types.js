"use strict";

define(["require", "exports"], function (require, exports) {
    "use strict";

    (function (BodyType) {
        BodyType[BodyType["Blob"] = 0] = "Blob";
        BodyType[BodyType["Text"] = 1] = "Text";
        BodyType[BodyType["FormData"] = 2] = "FormData";
        BodyType[BodyType["Stream"] = 3] = "Stream";
        BodyType[BodyType["None"] = 4] = "None";
    })(exports.BodyType || (exports.BodyType = {}));
    var BodyType = exports.BodyType;
    ;
});