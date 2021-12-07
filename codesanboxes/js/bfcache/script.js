function appendEvent(name) {
    var logs = document.getElementById("eventLogs");
    var message = "event: " + name + " at " + new Date() + "<br/>";
    logs.innerHTML += message;
    console.log(message);
  }


window.addEventListener("pagehide", (event) => {
    appendEvent("pagehide, event.persisted="+event.persisted);
});


window.addEventListener("pageshow", (event) => {
    appendEvent("pageshow, event.persisted="+event.persisted);
});

document.addEventListener("visibilitychange", () => {
    appendEvent("visibilitychange state=" + document.visibilityState);
});