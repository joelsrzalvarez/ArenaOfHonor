export const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ' ': { pressed: false }
};

export function setupKeyboardControls(player) {
    window.addEventListener('keydown', (event) => {
        if (event.key in keys) {
            keys[event.key].pressed = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key in keys) {
            keys[event.key].pressed = false;
        }
    });
}

export default keys;
