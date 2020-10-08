Hooks.on("ready", () => {
    game.socket.on('module.pf2e-shapeshifting', (data) => {
        if (data.operation === 'playerLockpick') {
            if (data.actor.permission[game.user._id] >= 3) {
                lockpickDialog(data.neededSuccesses, data.DC, data.actor);
            }
        }
    });

    function lockpickDialog(targetSuccesses, targetDC, actor) {
        let successes = 0;
        let attempts = 0;
        let critfail = false;

        let results = "";
        let content = `<div style="text-align: center"><label for="fastmode">Autopick?</label>
        <input type="checkbox" name="fastmode" id="fastmode"></div>`
        let d = new Dialog({
            title: "Lockpicking",
            content,
            buttons: {
              select: {
                icon: "<i class='fas fa-check'></i>",
                label: "Pick Lock",
                callback: (html) => {

                    // if fastmode is enabled, just keep doing checks until a success or critical
                    // failure is achieved
                    if (html.find("#fastmode")[0].checked) {
                        while (successes < targetSuccesses) {
                            attempts++
                            rollRes = new Roll("1d20 + @mod", {mod: actor.data.skills.thi.totalModifier}).roll()
                            if (rollRes._total >= targetDC) {
                                successes++
                                if (rollRes._total >= targetDC + 10) successes++
                            } else if (rollRes._total <= targetDC - 10) {
                                results += `<span style="color: red; font-weight: bold">Critical Failure!</span> The tools break.<br/>`
                                break;
                            }
                        }
                        if (successes >= targetSuccesses) results += `<span style="color: green; font-weight: bold">Success!</span><br/> The lock is successfully picked!<br/>`
                        results += ` The attempt took ${attempts*6} seconds in total.`
                        generateChat(actor, results)

                    // otherwise, go roll by roll
                    } else {
                        attempts++
                        rollRes = new Roll("1d20 + @mod", {mod: actor.data.skills.thi.totalModifier}).roll()
                        if (rollRes._total >= targetDC) {
                            successes++
                            if (rollRes._total >= targetDC + 10) {
                                successes++
                                results += `<div><span style="color: green; font-weight: bold; text-decoration: underline">Critical Success!</span><br/>`
                            } else results += `<div><span style="color: green; font-weight: bold">Success!</span><br/>`
                        } else if (rollRes._total < targetDC && rollRes._total > targetDC - 10) {
                            results += `<div><span style="font-weight: bold">Failure.</span><br/>`
                        } else {
                            results += `<div><span style="color: red; font-weight: bold">Critical Failure!</span> The tools break.<br/>`
                            critfail = true;
                        }
                        results += ` Your result was ${rollRes._total}.`
                        if (successes < targetSuccesses && !critfail) {
                            results += ` You have attempted to pick this lock for ${attempts*6} seconds.</div>`
                            d.render(true);
                        } else {
                            if (successes >= targetSuccesses) results += ` The lock is successfully picked!`
                            results += ` Your attempt lasted ${attempts*6} seconds.</div>`
                        }
                        generateChat(actor, results)
                    }   
                }
              }
            },
              cancel: {
                icon: "<i class='fas fa-times'></i>",
                label: "Cancel",
              },
            }).render(true);
    }
    
    async function generateChat(actor, output){
        let chatData = { 
            user: game.user._id, 
            speaker: {
                alias: actor.name
            },
            content: output, 
            // whisper: owners, 
        }; 
        console.log(actor.name);
        await ChatMessage.create(chatData, {}); 
    } 
})
