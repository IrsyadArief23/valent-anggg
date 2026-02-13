const envelope = document.getElementById("envelope");
const sceneEnvelope = document.getElementById("scene-envelope");
const sceneDialog = document.getElementById("scene-dialog");
const dialogText = document.getElementById("dialogText");
const dialogOptions = document.getElementById("dialogOptions");
const music = document.getElementById("bg-music");
const sfx = document.getElementById("open-sfx");

let opened = false;
let isTyping = false;
let typingInterval = null;
let currentNode = "start";

/* ===============================
   🎭 DIALOG DATA
================================= */
const dialogTree = {
  start: {
    text: "Hai senggg, watchu doin? ❤️",
    options: [
      { text: "BAIKKK🤗", next: "good" },
      { text: "lagi sibuk bangettt😵‍💫", next: "busy" }
    ]
  },

  good: {
    text: "GOODDD, i just wanna tell u somtin'",
    options: [
      { text: "apatuu?🤔", next: "confess" }
    ]
  },

  busy: {
    text: "yahhhh, yauda senggg selamat melanjutkan aktivitasss, eh tapi klik ini dulu deh",
    options: [
      { text: "klik ini seng", next: "good2" }
    ]
  },

  good2: {
    text: "HEYYYYY, i just wanna tell u somtin'",
    options: [
      { text: "apatuu?", next: "confess" }
    ]
  },

  confess: {
    text: "lopyu ehehe, be my Valentine sengg❤️",
    autoNext:"tie"
  },
  tie: {
    text: "mungkin ini ga seberapa sengg(bahkan jelek banget) tapi",
    autoNext: "ejk"
  },
  ejk: {
    text:"Liat ini dulu senggg, tunggu loading bentar yaa..❤️❤️",
    redirect:"https://besdey-fahm.my.canva.site/valenttt"
  }
};

/* ===============================
   📩 OPEN ENVELOPE
================================= */
envelope.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  envelope.classList.add("open"); // 🔥 animasi mulai

  sfx.play().catch(() => {});
  music.volume = 0.6;
  music.play().catch(() => {});

  setTimeout(() => {
    sceneEnvelope.classList.remove("is-active");
    sceneDialog.classList.add("is-active");
    goToNode("start");
  }, 900); // sedikit lebih lama biar animasi terasa
});


/* ===============================
   🔄 PINDAH NODE
================================= */
function goToNode(nodeKey) {
  currentNode = nodeKey;
  const node = dialogTree[nodeKey];

  renderOptions([]);

  typeText(node.text, () => {

    //Redirect
    if (node.redirect) {
  setTimeout(() => {
    window.location.replace(node.redirect);
  }, 1500);
}


    // 🔥 AUTO NEXT
    if (node.autoNext) {
      setTimeout(() => {
        goToNode(node.autoNext);
      }, 1200);
      return;
    }

    // 🔘 kalau tidak autoNext
    renderOptions(node.options);
  });
}


/* ===============================
   ⌨️ TYPEWRITER (CINEMATIC)
================================= */
function typeText(text, onComplete) {
  dialogText.textContent = "";
  isTyping = true;

  let i = 0;
  typingInterval = setInterval(() => {
    dialogText.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(typingInterval);
      isTyping = false;
      onComplete && onComplete();
    }
  }, 30);
}

/* ===============================
   ⚡ SKIP TYPE ON CLICK
================================= */
dialogText.addEventListener("click", () => {
  if (!isTyping) return;

  clearInterval(typingInterval);
  const node = dialogTree[currentNode];
  dialogText.textContent = node.text;
  isTyping = false;
  renderOptions(node.options);
});

/* ===============================
   🔘 OPTIONS
================================= */
function renderOptions(options) {
  dialogOptions.innerHTML = "";

  if (!options || options.length === 0) return;

  options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "dialog-btn";
    btn.textContent = opt.text;

    btn.addEventListener("click", () => {
      if (isTyping) return;
      goToNode(opt.next);
    });

    dialogOptions.appendChild(btn);

    // 🔥 stagger animation
    setTimeout(() => {
      btn.classList.add("show");
    }, 80 * index);
  });
}

