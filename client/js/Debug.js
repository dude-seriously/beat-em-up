;(function (BeatEmUp, $) {
    var debugEnabled = false;
    var debugGroup = []; // You can limit debug messages to a certain group, empty array means allow all groups

    BeatEmUp.enableDebug = function(state) {
        if (state == undefined || typeof state != 'boolean') {
            state = true;
        }
        debugEnabled = state;
    }

    BeatEmUp.setDebugGroup = function(group) {
        debugGroup = group;
    }

    BeatEmUp.debug = function(msg, group) {
        if (typeof console == "object" && typeof console.log == "function") {
            if (debugEnabled && ($.inArray(group, debugGroup) == 0 || debugGroup.length == 0)) {
                if (group == undefined) group = "Debug";
                console.log("[" + group + "] " + msg);
            }
        }
    }
})(window.BeatEmUp = window.BeatEmup || {}, jQuery);