/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable linebreak-style */

$("#customShortcutDialog").append(editPanel);
$("#customShortcutDialog").append(heading);
$("#customShortcutDialog").append(markUp);

$("#customShortcut").click(() => {
    closeEdit(); // if edit is showing, close it
    $("#customShortcutDialog").dialog({
        resizable: false,
        buttons: [
            {
                text: "Reset to default",
                click: () => setDefault(),
                id: "resetDefault",
            },
            {
                text: "Save",
                click: () => {
                    submit();
                    $("#customShortcutDialog").dialog("close");
                },
                id: "submitBtn",
            },
        ],
    });
});

let targetPref = null;
$("#preference").click((e) => {
    $("#pressedKeys").text("");
    $("#warning").text("");
    $("#edit").css("border", "none");
    $("#edit").css("display", "block");
    $($("#edit")).focus();
    [, targetPref] = e.target.closest("div").children;
});

// Modifiers restriction enabled here
$("#edit").keydown((e) => {
    e.stopPropagation();
    e.preventDefault();
    let modifiers = ["CTRL", "ALT", "SHIFT", "META"];
    $("#edit").css("animation", "none");
    $("#warning").text("");
    if (e.keyCode === 27) closeEdit();
    if (e.keyCode === 13) {
        if ($("#pressedKeys").text() === "") {
            $("#warning").text("Please enter some key(s)");
            $("#edit").css("animation", "shake .3s linear");
            return;
        }
        if (!checkRestricted($("#pressedKeys").text())) {
            override($("#pressedKeys").text());
            targetPref.innerText = $("#pressedKeys").text();
            $("#pressedKeys").text("");
            $("#edit").css("display", "none");
        } else {
            $("#warning").text("Please enter different key(s).");
            $("#edit").css("animation", "shake .3s linear");
        }
    }
    const currentKey = keyCodes[e.keyCode].toUpperCase();
    if (
        $("#pressedKeys").text().split(" + ").length === 2 &&
        !modifiers.includes(currentKey) &&
        modifiers.includes($("#pressedKeys").text().split(" + ")[1])
    ) {
        $("#pressedKeys").append(` + ${currentKey}`);
    } else if (modifiers.includes($("#pressedKeys").text())) {
        modifiers = modifiers.filter((mod) => mod === $("#pressedKeys").text());
        if (!modifiers.includes(currentKey)) {
            $("#pressedKeys").append(` + ${currentKey}`);
        }
    } else {
        $("#pressedKeys").text("");
        $("#pressedKeys").text(currentKey);
    }
    if (!$("#pressedKeys").text()) {
        $("#pressedKeys").text(currentKey);
    }
    if (
        ($("#pressedKeys").text().split(" + ").length === 2 &&
            ["CTRL", "META"].includes(
                $("#pressedKeys").text().split(" + ")[1]
            )) ||
        ($("#pressedKeys").text().split(" + ")[0] === "ALT" &&
            $("#pressedKeys").text().split(" + ")[1] === "SHIFT")
    ) {
        $("#pressedKeys").text(
            $("#pressedKeys").text().split(" + ").reverse().join(" + ")
        );
    }
    warnOverride($("#pressedKeys").text());
    if (checkRestricted($("#pressedKeys").text())) {
        $("#warning").text("The above key(s) cannot be set.");
    }
});

//  IFFE
(() => {
    setDefault();
    if (localStorage.userKeys) addKeys("user");
})();
