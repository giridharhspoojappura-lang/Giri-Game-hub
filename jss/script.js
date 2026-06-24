const iris = document.querySelector(".iris");

document.addEventListener("mousemove", e => {

let x =
(e.clientX / window.innerWidth - 0.5) * 40;

let y =
(e.clientY / window.innerHeight - 0.5) * 40;

iris.style.transform =
`translate(${x}px, ${y}px)`;

});