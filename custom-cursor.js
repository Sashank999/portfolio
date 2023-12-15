const cursor = document.querySelector("#cursor");
document.addEventListener("mousemove", (e) => {
	cursor.style.top = e.clientY - 10 + "px";
	cursor.style.left = e.clientX - 10 + "px";
});

document.body.style.cursor = "none";
