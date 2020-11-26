// Set up socket listener to listen for gm_lockset macro

Hooks.once("ready", () => {
    game.socket.on('module.pf2e-lockpicking', (data) => {
        if (data.operation === 'playerLockpick') {
            if (data.actor.permission[game.user._id] >= 3) {
                lockpick(data.neededSuccesses, data.DC, data.actor, data.mod);
            }
        }
    });
})
import { lockpick } from './scripts.js';
