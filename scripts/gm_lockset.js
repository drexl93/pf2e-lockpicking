// Macro for the GM to run to set the DC and number of successes for the lock
// Can pick from the set of published locks or create a custom one

if (!token) {
  ui.notifications.error("Please select a token.")
  return;
}

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

content2 += `<form id="pf2e-lockpicking-gm_lockset-content2"><p><label for="customDC">DC: </label>
<input type="text" id="customDC" name="customDC"></p>

<p><label for="successes">Required Successes: </label>
<input type="text" id="successes" name="successes"></p></form>`

let dialog = new Dialog({
  title: "Lockpicking",
  content: content,
  buttons: {
    pick: {
      icon: "<i class='fas fa-check'></i>",
      label: "Select",
      callback: (html) => {
          let lock = (html.find('#preset')[0].value)
          if (lock === "custom") {
              customLock.options.width = 125
              customLock.position.width = 125
              customLock.render(true);
          } else {
              game.socket.emit('module.pf2e-lockpicking', {
                  operation: 'playerLockpick',
                  actor,
                  neededSuccesses: locks[lock].successes,
                  DC: locks[lock].DC 
              });
          }
      }
    },
  }
})
dialog.options.width = 125
dialog.position.width = 125
dialog.render(true);

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
          game.socket.emit('module.pf2e-lockpicking', {
              operation: 'playerLockpick',
              actor,
              neededSuccesses,
              DC
          });
      }
    },
  }
})