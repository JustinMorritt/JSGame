prison.input = (function () {
    var inputHandlers,
        gpStates,
        gpPoller;

    var keys = {
        37: "KEY_LEFT",
        38: "KEY_UP",
        39: "KEY_RIGHT",
        40: "KEY_DOWN",
        13: "KEY_ENTER",
        32: "KEY_SPACE",
        65: "KEY_A",
        66: "KEY_B",
        67: "KEY_C",
        /* ... alpha keys 68 - 87 ... */
        88: "KEY_X",
        89: "KEY_Y",
        90: "KEY_Z"
    };

    function initialize() {
        var dom = prison.dom,
            $ = dom.$,
            controls = prison.settings.controls,
            map = $("#game-screen .game-map")[0];

        inputHandlers = {};
        dom.bind(map, "mousedown", function (event) {
            //console.log("CLICKED");
            handleClick(event, "CLICK", event);
        });
        dom.bind(map, "touchstart", function (event) {
            handleClick(event, "TOUCH", event.targetTouches[0]);
        });
        dom.bind(document, "keydown", function (event) {
            var keyName = keys[event.keyCode];
            if (keyName && controls[keyName]) {
                event.preventDefault();
                trigger(controls[keyName]);
            }
        });
        if (hasGamepads()) {
            gpStates = [];
            if (!gpPoller) {
                gpPoller = setInterval(pollGamepads, 1000 / 60);
                // workaround to make Firefox register gamepads
                window.addEventListener("gamepadconnected", function () { }, false);
            }
        }
        console.log("----INPUT FULLY INITIALIZED----");
    }

    function handleClick(event, control, click) {
        // is any action bound to this input control?
        var settings = prison.settings,
            action = settings.controls[control];
        if (!action) {
            return;
        }

        var map = prison.dom.$("#game-screen .game-map")[0],
            rect = map.getBoundingClientRect(),
            relX, relY,
            prisonX, prisonY;

        // click position relative to map
        relX = click.clientX - rect.left;
        relY = click.clientY - rect.top;
        // prison coordinates
        prisonX = Math.floor(relX /  settings.cols);
        prisonY = Math.floor(relY /  settings.rows);
        // trigger functions bound to action
        console.log("The prison Clicked --> X: " + prisonX + " Y: " + prisonY);
        trigger(action, prisonX, prisonY);
        // prevent default click behavior
        event.preventDefault();
    }

    function hasGamepads() {
        return !!getGamepads();
    }

    function getGamepads() {
        if (navigator.gamepads) {
            return navigator.gamepads;
        } else if (navigator.getGamepads) {
            return navigator.getGamepads();
        } else if (navigator.webkitGetGamepads) {
            return navigator.webkitGetGamepads();
        }
    }

    function pollGamepads() {
        var gamepads = getGamepads(),
            i, gamepad, idx;
        for (i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepad = gamepads[i];
                idx = gamepad.index;
                if (gpStates[idx]) {
                    if (gpStates[idx].gamepad != gamepad) {
                        gamepadDisconnected(gpStates[idx]);
                        gamepadConnected(gamepad);
                    }
                } else {
                    gamepadConnected(gamepad);
                }
                updateGamepadState(gamepad);
            }
        }
    }

    function gamepadConnected(gamepad) {
        gpStates[gamepad.index] = {
            gamepad: gamepad,
            buttons: gamepad.buttons,
            axes: gamepad.axes
        };
        console.log("Gamepad[" + gamepad.index + "] connected");
    }

    function gamepadDisconnected(gamepad) {
        console.log("Gamepad[" + gamepad.index + "] disconnected");
        delete gpStates[gamepad.index];
    }

    function updateGamepadState(gamepad) {
        var state = gpStates[gamepad.index],
            i;
        for (i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i] != state.buttons[i]) {
                state.buttons[i] = gamepad.buttons[i];
                if (state.buttons[i]) {
                    gamepadButtonDown(gamepad, i);
                }
            }
        }
        for (i = 0; i < gamepad.axes.length; i++) {
            if (gamepad.axes[i] != state.axes[i]) {
                state.axes[i] = gamepad.axes[i];
                gamepadAxisChange(gamepad, i, state.axes[i]);
            }
        }
    }

    function gamepadButtonDown(gamepad, buttonIndex) {
        var gpButtons = {
            0: "BUTTON_A"
        },
            controls = prison.settings.controls,
            button = gpButtons[buttonIndex];
        if (button && controls[button]) {
            trigger(controls[button]);
        }
    }

    function gamepadAxisChange(gamepad, axisIndex, axisValue) {
        var controls = prison.settings.controls,
            controlName;
        if (axisIndex === 0 && axisValue === -1) {
            controlName = "LEFT_STICK_LEFT";
        } else if (axisIndex === 0 && axisValue === 1) {
            controlName = "LEFT_STICK_RIGHT";
        } else if (axisIndex === 1 && axisValue === -1) {
            controlName = "LEFT_STICK_UP";
        } else if (axisIndex === 1 && axisValue === 1) {
            controlName = "LEFT_STICK_DOWN";
        }
        if (controlName && controls[controlName]) {
            trigger(controls[controlName]);
        }
    }

    function bind(action, handler) {
        if (!inputHandlers[action]) {
            inputHandlers[action] = [];
        }
        inputHandlers[action].push(handler);
    }

    function trigger(action) {
        var handlers = inputHandlers[action],
            args = Array.prototype.slice.call(arguments, 1);
        //console.log("Game action: " + action);
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(null, args);
            }
        }
    }

    return {
        initialize: initialize,
        bind: bind
    };
})();