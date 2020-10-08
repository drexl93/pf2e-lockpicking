// Just roll a certain number of times until you get x number of successes, but stop if you get a critical failure

let locks = {
    poor: {DC: 15, successes: 2},
    simple: {DC: 20, successes: 3},
    average: {DC: 25, successes: 4},
    good: {DC: 30, successes: 5},
    superior: {DC: 40, successes: 6}
  }

let content = "";
let content2 = "";

content += `<p><label for="preset">Pick a preset: </label>
<select name="preset" id="preset">
    <option value="custom">Custom</option>
    <option value="poor">Poor</option>
    <option value="simple">Simple</option>
    <option value="average">Average</option>
    <option value="good">Good</option>
    <option value="superior">Superior</option>
</select>`

content2 += `<form style="text-align: center"><p><label for="customDC">DC: </label>
<input type="text" id="customDC" name="customDC" style="width: 30px"></p>

<p><label for="successes">Required Successes: </label>
<input type="text" id="successes" name="successes" style="width: 30px"></p></form>`

new Dialog({
    title: "Lockpicking",
    content: content,
    buttons: {
      pick: {
        icon: "<i class='fas fa-check'></i>",
        label: "Pick",
        callback: (html) => {
            let lock = (html.find('#preset')[0].value)
            if (lock === "custom") {
                customLock.render(true);
            } else {
                // Emit a socket event
                game.socket.emit('module.pf2e-shapeshifting', {
                    operation: 'playerLockpick',
                    actor,
                    neededSuccesses: locks[lock].successes,
                    DC: locks[lock].DC 
                });
                // lockpick(lock)
            }
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel",
      },
    }
}).render(true);

let customLock = new Dialog({
    title: "Custom Lock",
    content: content2,
    buttons: {
      select: {
        icon: "<i class='fas fa-check'></i>",
        label: "Select",
        callback: (html) => {
            let neededSuccesses = parseInt(html.find('#successes')[0].value)
            let DC = parseInt(html.find('#customDC')[0].value)
            // Emit a socket event
            game.socket.emit('module.pf2e-shapeshifting', {
                operation: 'playerLockpick',
                actor,
                neededSuccesses,
                DC
            });
            // lockpick("custom", targetSuccesses, targetDC)
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel",
      },
    }
})