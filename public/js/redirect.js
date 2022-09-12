window.onload = () => {
	const countdownDisplay = document.getElementById("countdown");
	const countdownLengthSeconds = 5;

	countdownDisplay.innerText = countdownLengthSeconds;

	for (let i = 1; i <= countdownLengthSeconds; i++) {
		setTimeout(() => {
			countdownDisplay.innerText = countdownLengthSeconds - i;
		}, i * 1000);
	}

	setTimeout(() => {
		window.location.pathname = "/user/secret";
	}, countdownLengthSeconds * 1000 + 100);
};
