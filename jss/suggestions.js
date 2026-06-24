import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyAVY9ZhHeqq0-HzWOpYontjK2c_NF-YCGs",

authDomain: "gghub-6684c.firebaseapp.com",

projectId: "gghub-6684c",

storageBucket: "gghub-6684c.firebasestorage.app",

messagingSenderId: "628956050201",

appId: "1:628956050201:web:f31c424744caeca5e88b88"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function addSuggestion(){
 console.log("adsug called", Date.now());

const name =
document.getElementById("name").value.trim();

const suggestion =
document.getElementById("suggestion").value.trim();

if(name === "" || suggestion === ""){

alert("Please fill all fields");

return;
}

try{



document.getElementById("name").value = "";
document.getElementById("suggestion").value = "";

loadSuggestions();

}
catch(error){

console.error(error);

alert("Failed to submit suggestion");

}

await addDoc(collection(db, "suggestions"), {
    name,
    suggestion,
    createdAt: serverTimestamp()
});


document.getElementById("successMessage").style.display = "block";

setTimeout(() => {
    document.getElementById("successMessage").style.display = "none";
}, 5000);

alert("🎮 Thank you for your suggestion!\n\nWe will try our best to develop and add it to Giri's Game Hub in future updates.");

document.getElementById("name").value = "";
document.getElementById("suggestion").value = "";

}

async function loadSuggestions(){

const list =
document.getElementById("suggestionList");

list.innerHTML = "";

const snapshot =
await getDocs(
collection(db,"suggestions")
);

let count = 0;

snapshot.forEach(doc => {

count++;

const data = doc.data();

list.innerHTML += `

<div class="suggestion-card">

<h3>${data.name}</h3>

<p>${data.suggestion}</p>

</div>

`;

});

document.getElementById("count").innerText =
count;

}



loadSuggestions();

document
.getElementById("submitBtn")
.addEventListener("click", addSuggestion);

