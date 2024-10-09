function dismissAlertTimer() {
	document.querySelector("#welcome-alert").click();
}
window.addEventListener("DOMContentLoaded", () => {
	setTimeout(dismissAlertTimer, 1000);
});
