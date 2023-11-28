const zoneNom = document.querySelector(".nomUser");
const zoneInputName = document.querySelector("#zoneInputName");
const zoneInfoName = document.querySelector(".username");
const btn0 = document.querySelector("#btn0");
const zoneInputMessages = document.querySelector(".inputZone");
const zoneMessagesFeed = document.querySelector(".messagesFeed");

zoneMessagesFeed.style.visibility = "hidden";
zoneInputMessages.style.visibility = "hidden";

let user = "";
let allMessages = [];

setInterval(() => {
  reset();
}, 1000);

//Permet d'enregistrer un username pour l'utilisateur. S'il est valide le chat et l'inputText est affiché
btn0.addEventListener("click", function () {
  if (zoneInputName.value.length >= 3) {
    zoneMessagesFeed.innerHTML = "";
    reset();
    user = zoneInputName.value;
    console.log(user);
    zoneNom.innerHTML = `Connecté en tant que ${user}`;
    zoneInfoName.style.display = "none";
    zoneMessagesFeed.style.visibility = "visible";
    zoneInputMessages.style.visibility = "visible";
  } else {
    alert("Le champ doit contenir au moins 3 caractères.");
  }
});

// Permet de récupérer les messages en ligne
async function getMessages() {
  try {
    const response = await fetch("http://192.168.1.58:3000/api/messages");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des messages");
    }
    const messages = await response.json();
    return messages;
  } catch (error) {
    alert("Erreur lors de la récupération des messages");
    console.error("Erreur :", error.messages);
    throw error;
  }
}

//Permet d'envoyer les messages + le user associé dans la bdd
async function sendMessages(A, B) {
  try {
    const request = await fetch("http://192.168.1.58:3000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: A, content: B }),
    });
  } catch (error) {
    alert("Erreur lors de l'enregistrement du message");
    console.error("Erreur :", error.messages);
    throw error;
  }
}

//fonction permettant d'afficher un nouveau message sur le front
function newMessage(type, messageUser, messageContent) {
  const newMessage = document.createElement("div");
  newMessage.id = type;
  const name = document.createElement("div");
  name.id = "name";
  name.textContent = `${messageUser} :`;
  const message = document.createElement("div");
  message.id = "message";
  message.textContent = messageContent;
  let color = getRandomColor(messageUser);
  newMessage.style.backgroundColor = color;
  newMessage.appendChild(name);
  newMessage.appendChild(message);
  zoneMessagesFeed.appendChild(newMessage);
  newMessage.scrollIntoView({
    behavior: "auto",
    block: "end",
    inline: "nearest",
  });
}

const btn1 = document.querySelector("#btnEnvoyerMessage");
const inputMessage = document.querySelector("#message");

//Déclenche l'envoi d'un message sur le front et dans la bdd quand l'inputText est rempli.
btn1.addEventListener("click", function () {
  sendMessage();
});

//Déclenche l'envoi d'un message sur le front et dans la bdd quand l'inputText est rempli en appuyant sur entrer
zoneInputMessages.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    sendMessage();
  }
});

//function qui vérifie l'inputMessage pour savoir s'il doit supprimer les messages d'un user ou alors envoyer gérer l'envoie d'un message
function sendMessage() {
  if (inputMessage.value.length === 0) {
    alert("Tapez un message avant d'envoyer");
  } else if (inputMessage.value.includes("delete ")) {
    const name = inputMessage.value.replace("delete ", "");
    remove(name);
  } else {
    newMessage("yourMessage", user, inputMessage.value);
    console.log(inputMessage.value);
    sendMessages(user, inputMessage.value);
    inputMessage.value = "";
  }
}

//fonction de ChatGpt pour avoir une couleur aléatoire avec un seuil de luminosité minimum.
function getRandomColor(seedString, minLuminance = 40) {
  const stringToSeed = (str) => {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed = (seed * 31 + str.charCodeAt(i)) & 0xffffffff;
    }
    return seed;
  };
  const calculateLuminance = (red, green, blue) => {
    return 0.299 * red + 0.587 * green + 0.114 * blue;
  };
  let seed = stringToSeed(seedString);
  const randomComponent = () => Math.floor(Math.sin(seed++) * 10000) % 256;
  let red, green, blue, luminance;
  do {
    red = randomComponent();
    green = randomComponent();
    blue = randomComponent();
    luminance = calculateLuminance(red, green, blue);
  } while (luminance < minLuminance); // Répéter jusqu'à ce que la luminance soit suffisante
  return `rgb(${red}, ${green}, ${blue})`;
}

//Fonction pour vérifier s'il y a de nouveaux messages
function reset() {
  getMessages().then((messages) => {
    zoneMessagesFeed.innerHTML = "";
    allMessages = messages;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].user != user) {
        newMessage("otherMessages", messages[i].user, messages[i].content);
      }
      if (messages[i].user === user) {
        newMessage("yourMessage", messages[i].user, messages[i].content);
      }
    }
  });
}

// fonction pour supprimer les messages d'un user
async function remove(name) {
  try {
    const encodedName = encodeURIComponent(name);
    const request = await fetch(
      `http://localhost:3000/api/messages/${encodedName}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const response = await request.json();
    console.log(response);
  } catch (error) {
    alert("Erreur lors de la suppression");
    console.error("Erreur :", error.messages);
    throw error;
  }
}
