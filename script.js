const categories = [
  {
    name: "Geografía",
    icon: "GEO",
    color: "#167ec4",
    questions: [
      {q:"¿Cuál es la capital de Australia?",a:["Sídney","Canberra","Melbourne","Perth"],c:1},
      {q:"¿Cuál es el país más grande del mundo por superficie?",a:["Canadá","China","Rusia","Estados Unidos"],c:2},
      {q:"¿En qué continente se encuentra Egipto?",a:["Asia","África","Europa","Oceanía"],c:1},
      {q:"¿Cuál es el océano más grande del planeta?",a:["Atlántico","Índico","Ártico","Pacífico"],c:3},
      {q:"¿Qué país tiene forma de bota?",a:["Grecia","Italia","Portugal","Croacia"],c:1}
    ]
  },
  {
    name: "Ciencia",
    icon: "SCI",
    color: "#168b79",
    questions: [
      {q:"¿Qué planeta es conocido como el planeta rojo?",a:["Venus","Marte","Júpiter","Mercurio"],c:1},
      {q:"¿Qué órgano del cuerpo humano bombea la sangre?",a:["Pulmón","Cerebro","Corazón","Hígado"],c:2},
      {q:"¿Cuál es el símbolo químico del oro?",a:["Ag","Go","Au","Or"],c:2},
      {q:"¿Cuántos huesos tiene aproximadamente un adulto?",a:["106","206","306","406"],c:1},
      {q:"¿Qué gas absorben las plantas durante la fotosíntesis?",a:["Oxígeno","Nitrógeno","Hidrógeno","Dióxido de carbono"],c:3}
    ]
  },
  {
    name: "Historia",
    icon: "HIS",
    color: "#9b623b",
    questions: [
      {q:"¿En qué año llegó Cristóbal Colón a América?",a:["1492","1521","1453","1500"],c:0},
      {q:"¿Qué civilización construyó Machu Picchu?",a:["Maya","Azteca","Inca","Romana"],c:2},
      {q:"¿En qué país comenzó la Revolución francesa?",a:["Italia","Francia","España","Alemania"],c:1},
      {q:"¿Quién fue el primer hombre en pisar la Luna?",a:["Yuri Gagarin","Buzz Aldrin","Neil Armstrong","John Glenn"],c:2},
      {q:"¿En qué año cayó el Muro de Berlín?",a:["1975","1989","1995","2001"],c:1}
    ]
  },
  {
    name: "Entretenimiento",
    icon: "ENT",
    color: "#8254b8",
    questions: [
      {q:"¿Cómo se llama el famoso ratón de Disney?",a:["Donald","Mickey Mouse","Goofy","Jerry"],c:1},
      {q:"¿Qué instrumento musical tiene tradicionalmente 88 teclas?",a:["Guitarra","Violín","Piano","Acordeón"],c:2},
      {q:"¿A qué saga pertenece Darth Vader?",a:["Star Trek","Star Wars","Harry Potter","Dune"],c:1},
      {q:"¿Cómo se llama el reino de Elsa en Frozen?",a:["Corona","Arendelle","Narnia","Eldoria"],c:1},
      {q:"¿En qué videojuego aparece el fontanero Mario?",a:["Sonic","Minecraft","Super Mario Bros.","Donkey Kong"],c:2}
    ]
  },
  {
    name: "Deportes",
    icon: "DEP",
    color: "#b64d65",
    questions: [
      {q:"¿Cuántos jugadores tiene un equipo de fútbol en el campo?",a:["9","10","11","12"],c:2},
      {q:"¿Cada cuántos años se celebran los Juegos Olímpicos de verano?",a:["2 años","3 años","4 años","5 años"],c:2},
      {q:"¿En qué deporte se utilizan raqueta y volante?",a:["Tenis","Bádminton","Squash","Pádel"],c:1},
      {q:"¿Cuántos anillos tiene el símbolo olímpico?",a:["4","5","6","7"],c:1},
      {q:"¿En qué país se originó el taekwondo?",a:["Japón","China","Corea del Sur","Tailandia"],c:2}
    ]
  },
  {
    name: "Arte y cultura",
    icon: "ART",
    color: "#b27a28",
    questions: [
      {q:"¿Quién pintó La Mona Lisa?",a:["Pablo Picasso","Leonardo da Vinci","Claude Monet","Salvador Dalí"],c:1},
      {q:"¿Quién escribió Don Quijote de la Mancha?",a:["Federico García Lorca","Lope de Vega","Miguel de Cervantes","Gabriel García Márquez"],c:2},
      {q:"¿Cuál es el idioma oficial de Brasil?",a:["Español","Portugués","Francés","Italiano"],c:1},
      {q:"¿En qué país se originó el tango?",a:["México","Argentina","Cuba","Chile"],c:1},
      {q:"¿Quién pintó La noche estrellada?",a:["Vincent van Gogh","Rembrandt","Edvard Munch","Goya"],c:0}
    ]
  }
];

const $ = id => document.getElementById(id);

const screens = [
  "homeScreen",
  "setupScreen",
  "wheelScreen",
  "questionScreen",
  "roundEndScreen",
  "winnerScreen"
];

let teams = [];
let currentTeam = 0;
let teamCount = 2;
let categoryIndex = 0;
let questionIndex = 0;

let timer = null;
let timeLeft = 30;
let locked = false;
let spinning = false;
let wheelAngle = 0;

let roundCorrect = 0;
let attemptedTeams = new Set();
let answeringTeam = 0;

const letters = ["A", "B", "C", "D"];

function showScreen(id) {
  screens.forEach(s => {
    $(s).classList.toggle("active", s === id);
  });

  $("roundLabel").textContent = ({
    homeScreen: "PREPÁRATE PARA JUGAR",
    setupScreen: "CONFIGURA TUS EQUIPOS",
    wheelScreen: "RULETA DE CATEGORÍAS",
    questionScreen: "RONDA EN JUEGO",
    roundEndScreen: "TURNO COMPLETADO",
    winnerScreen: "RESULTADOS FINALES"
  })[id];

  window.scrollTo({top: 0, behavior: "smooth"});
}

function renderTeamInputs() {
  $("teamCount").textContent = teamCount;
  $("teamInputs").innerHTML = "";

  for (let i = 0; i < teamCount; i++) {
    const field = document.createElement("div");
    field.className = "team-field";

    field.innerHTML = `
      <label for="team${i}">EQUIPO ${i + 1}</label>
      <input
        id="team${i}"
        maxlength="22"
        value="${teams[i]?.name || `Equipo ${i + 1}`}"
        placeholder="Nombre del equipo"
      >
    `;

    $("teamInputs").appendChild(field);
  }
}

function collectTeams() {
  const next = [];

  for (let i = 0; i < teamCount; i++) {
    next.push({
      name: $(`team${i}`).value.trim() || `Equipo ${i + 1}`,
      score: 0
    });
  }

  teams = next;
}

function renderScores(targetId = "scoreList") {
  const list = $(targetId);
  list.innerHTML = "";

  teams.forEach((t, i) => {
    const el = document.createElement("div");

    el.className = "score-item" + (i === currentTeam ? " current" : "");

    el.innerHTML = `
      <span class="team-name">${escapeHTML(t.name)}</span>
      <span class="team-points">${t.score}</span>
    `;

    list.appendChild(el);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function startGame() {
  collectTeams();
  currentTeam = 0;

  teams.forEach(t => t.score = 0);

  renderScores();
  drawWheel();
  showScreen("wheelScreen");
  updateTurnLabels();
}

function updateTurnLabels() {
  $("currentTeamWheel").textContent = teams[currentTeam].name;
  renderScores();
}

function drawWheel() {
  const canvas = $("wheelCanvas");
  const ctx = canvas.getContext("2d");

  const cx = 260;
  const cy = 260;
  const r = 250;

  const slice = Math.PI * 2 / categories.length;

  ctx.clearRect(0, 0, 520, 520);

  categories.forEach((cat, i) => {
    const start = wheelAngle + i * slice - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + slice);
    ctx.closePath();

    ctx.fillStyle = cat.color;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#f7d77d";
    ctx.stroke();

    ctx.save();

    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";

    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#061027";
    ctx.shadowBlur = 5;

    ctx.font = "900 24px Nunito";
    ctx.fillText(cat.icon, r - 23, 8);

    ctx.font = "900 15px Nunito";
    ctx.fillText(cat.name.toUpperCase(), r - 58, 31);

    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffe29a";
  ctx.lineWidth = 7;
  ctx.stroke();
}

function chooseCategory(index) {
  categoryIndex = index;
  questionIndex = 0;
  roundCorrect = 0;

  $("wheelResult").textContent =
    `CATEGORÍA: ${categories[index].name.toUpperCase()}`;

  setTimeout(startQuestion, 500);
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  $("spinBtn").disabled = true;
  $("wheelResult").textContent = "¡LA RULETA ESTÁ GIRANDO!";

  const start = wheelAngle;
  const extra =
    (Math.PI * 2) * (5 + Math.random() * 3) +
    Math.random() * Math.PI * 2;

  const duration = 3600;
  const begin = performance.now();

  function animate(now) {
    const t = Math.min(1, (now - begin) / duration);
    const ease = 1 - Math.pow(1 - t, 4);

    wheelAngle = start + extra * ease;
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
      return;
    }

    spinning = false;
    $("spinBtn").disabled = false;

    const slice = Math.PI * 2 / categories.length;

    const normalized =
      ((-wheelAngle) % (Math.PI * 2) + Math.PI * 2) %
      (Math.PI * 2);

    chooseCategory(
      Math.floor(normalized / slice) % categories.length
    );
  }

  requestAnimationFrame(animate);
}

function startQuestion() {
  const cat = categories[categoryIndex];
  const q = cat.questions[questionIndex];

  locked = false;
  attemptedTeams = new Set();
  answeringTeam = currentTeam;
  timeLeft = 30;

  $("currentTeamQuestion").textContent = teams[currentTeam].name;
  $("questionIcon").textContent = cat.icon;
  $("questionCategory").textContent = cat.name.toUpperCase();

  $("questionProgress").textContent =
    `PREGUNTA ${questionIndex + 1} DE 5`;

  $("questionNumber").textContent =
    String(questionIndex + 1).padStart(2, "0");

  $("questionText").textContent = q.q;

  renderAnsweringTeams();

  $("teamQuestionScore").textContent =
    teams[answeringTeam].score;

  const grid = $("answerGrid");
  grid.innerHTML = "";

  q.a.forEach((answer, i) => {
    const btn = document.createElement("button");

    btn.className = "answer-btn";

    btn.innerHTML = `
      <span class="answer-letter">${letters[i]}</span>
      <span>${escapeHTML(answer)}</span>
    `;

    btn.addEventListener("click", () => answerQuestion(i));

    grid.appendChild(btn);
  });

  updateTimer();
  showScreen("questionScreen");
  startTimer();
}

function renderAnsweringTeams() {
  const wrap = $("answeringTeams");
  wrap.innerHTML = "";

  teams.forEach((team, i) => {
    const b = document.createElement("button");

    b.type = "button";

    b.className =
      "team-select" + (i === answeringTeam ? " selected" : "");

    b.textContent =
      team.name + (attemptedTeams.has(i) ? " · YA INTENTÓ" : "");

    b.disabled = attemptedTeams.has(i) || locked;

    b.addEventListener("click", () => selectAnsweringTeam(i));

    wrap.appendChild(b);
  });

  $("currentTeamQuestion").textContent = teams[answeringTeam].name;
  $("teamQuestionScore").textContent = teams[answeringTeam].score;
}

function selectAnsweringTeam(i) {
  if (locked || attemptedTeams.has(i)) return;

  answeringTeam = i;
  timeLeft = 30;

  renderAnsweringTeams();
  updateTimer();
  startTimer();
}

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (!locked) {
        passAfterAttempt(true);
      }
    }
  }, 1000);
}

function updateTimer() {
  $("timerNumber").textContent = timeLeft;

  const pct = (timeLeft / 30) * 100;

  $("timerRing").style.background =
    `conic-gradient(${timeLeft <= 7 ? "#ff5575" : "#20c7f7"} ${pct}%,#2c3d60 0)`;

  $("timerRing").classList.toggle("warning", timeLeft <= 7);
}

function answerQuestion(index) {
  if (locked || attemptedTeams.has(answeringTeam)) return;

  const q = categories[categoryIndex].questions[questionIndex];
  const selectedButton = $("answerGrid").children[index];

  attemptedTeams.add(answeringTeam);
  clearInterval(timer);

  const correct = index === q.c;

  if (correct) {
    locked = true;
    selectedButton.classList.add("correct");

    teams[answeringTeam].score += 100;
    renderScores();

    $("teamQuestionScore").textContent =
      teams[answeringTeam].score;

    showFeedback(
      true,
      `¡${teams[answeringTeam].name} gana 100 puntos!`
    );

    return;
  }

  // Respuesta incorrecta: mostrar en rojo
  locked = true;
  selectedButton.classList.add("wrong");

  // Bloquear las demás opciones durante la transición
  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.disabled = true;
  });

  $("operatorHint").textContent =
    `¡Respuesta incorrecta! ${teams[answeringTeam].name} perdió su turno.`;

  // Dar tiempo para que la clase vea el error
  setTimeout(() => {
    locked = false;
    passAfterAttempt(false);
  }, 1200);
}

function passAfterAttempt(timeout) {
  clearInterval(timer);

  const lastTeam = answeringTeam;

  if (timeout) {
    attemptedTeams.add(answeringTeam);
  }

  const remaining = teams
    .map((_, i) => i)
    .filter(i => !attemptedTeams.has(i))
    .sort((a, b) =>
      ((a - lastTeam + teams.length) % teams.length) -
      ((b - lastTeam + teams.length) % teams.length)
    );

  if (remaining.length) {
    answeringTeam = remaining[0];
    timeLeft = 30;

    renderAnsweringTeams();
    updateTimer();

    const msg = timeout
      ? `Se agotó el tiempo de ${teams[lastTeam].name}.`
      : `Respuesta incorrecta. Ahora puede responder ${teams[answeringTeam].name}.`;

    $("operatorHint").textContent =
      msg + " Selecciona el equipo y marca su respuesta.";

    startTimer();
    return;
  }

  locked = true;

  const q = categories[categoryIndex].questions[questionIndex];

  showFeedback(
    false,
    `Ningún equipo acertó. La respuesta correcta era: ${q.a[q.c]}.`
  );
}

function showFeedback(correct, message) {
  const card =
    $("feedbackOverlay").querySelector(".feedback-card");

  card.classList.toggle("incorrect", !correct);

  $("feedbackSymbol").textContent = correct ? "✓" : "✕";

  $("feedbackTitle").textContent = correct
    ? "¡RESPUESTA CORRECTA!"
    : "¡PREGUNTA CERRADA!";

  $("feedbackText").textContent = message;

  $("nextQuestionBtn").textContent =
    questionIndex === 4
      ? "FINALIZAR TURNO ➜"
      : "SIGUIENTE PREGUNTA ➜";

  $("feedbackOverlay").classList.add("show");
}

function nextQuestion() {
  $("feedbackOverlay").classList.remove("show");

  $("operatorHint").textContent =
    "Selecciona qué equipo está respondiendo y luego marca su respuesta en la pantalla.";

  if (questionIndex < 4) {
    questionIndex++;
    startQuestion();
  } else {
    finishTurn();
  }
}

function finishTurn() {
  $("roundEndTeam").textContent = teams[currentTeam].name;

  $("roundEndMessage").textContent =
    `Has completado las cinco preguntas de tu turno. El marcador incluye los puntos ganados por todos los equipos.`;

  $("roundEndScore").textContent = teams[currentTeam].score;

  $("nextTeamBtn").textContent =
    currentTeam === teams.length - 1
      ? "VER RESULTADOS FINALES ➜"
      : "SIGUIENTE EQUIPO ➜";

  showScreen("roundEndScreen");
}

function nextTeam() {
  if (currentTeam < teams.length - 1) {
    currentTeam++;

    updateTurnLabels();

    $("wheelResult").textContent = "";
    $("spinBtn").disabled = false;

    showScreen("wheelScreen");
  } else {
    showWinner();
  }
}

function showWinner() {
  const max = Math.max(...teams.map(t => t.score));

  const winners = teams.filter(t => t.score === max);

  $("winnerName").textContent =
    winners.length > 1 ? "¡EMPATE!" : winners[0].name;

  $("finalScores").innerHTML = "";

  [...teams]
    .sort((a, b) => b.score - a.score)
    .forEach(t => {
      const item = document.createElement("div");

      item.className = "final-score";

      item.innerHTML = `
        <small>${escapeHTML(t.name)}</small>
        <b>${t.score} PTS</b>
      `;

      $("finalScores").appendChild(item);
    });

  showScreen("winnerScreen");
}

function resetToSetup() {
  clearInterval(timer);

  teams = [];
  teamCount = 2;
  currentTeam = 0;

  renderTeamInputs();
  showScreen("setupScreen");
}

// EVENTOS

$("startSetupBtn").addEventListener("click", () => {
  teamCount = 2;
  teams = [];

  renderTeamInputs();
  showScreen("setupScreen");
});

$("backHomeBtn").addEventListener("click", () => {
  showScreen("homeScreen");
});

$("minusTeams").addEventListener("click", () => {
  if (teamCount > 2) {
    teamCount--;
    renderTeamInputs();
  }
});

$("plusTeams").addEventListener("click", () => {
  if (teamCount < 6) {
    teamCount++;
    renderTeamInputs();
  }
});

$("beginBtn").addEventListener("click", startGame);

$("spinBtn").addEventListener("click", spinWheel);

$("skipSpinBtn").addEventListener("click", () => {
  if (!spinning) {
    chooseCategory(Math.floor(Math.random() * categories.length));
  }
});

$("nextQuestionBtn").addEventListener("click", nextQuestion);
$("nextTeamBtn").addEventListener("click", nextTeam);
$("playAgainBtn").addEventListener("click", resetToSetup);

$("brandHome").addEventListener("click", e => {
  e.preventDefault();

  if (confirm("¿Volver al inicio? Se perderá la partida actual.")) {
    clearInterval(timer);
    showScreen("homeScreen");
  }
});

// INICIALIZACIÓN

renderTeamInputs();
drawWheel();