export default function webflowEvents() {
  // Capture all events triggered specifically with the "wf-event-trigger" name
  document.addEventListener("wf-event-trigger", e => {
    const eventName = e.detail.label, // the label contains a string like click:identifier
      split = eventName.split(":"),
      type = split[0], // event type
      trigger = split[1]; // event trigger or identifier

    // trigger the event (e.g. "click") on any html element that has a data attribute
    // with the name [wfe-trigger-{IDENTIFIER}]
    const el = document.querySelector(`[wfe-trigger-${trigger}]`);
    if (!el) return;

    if (type === "click") {
      el.click();
    }
  });
}
