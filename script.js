const TASK_COUNT = 50;
const MIN = 100;
const MAX = 999;

const tasksContainer = document.getElementById("tasks");
const resultContainer = document.getElementById("result");
const checkBtn = document.getElementById("check-btn");
const generateBtn = document.getElementById("generate-btn");

let tasks = [];

function randomEvenThreeDigit() {
  const random = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  return random % 2 === 0 ? random : random + 1;
}

function createTasks() {
  const unique = new Set();

  while (unique.size < TASK_COUNT) {
    unique.add(randomEvenThreeDigit());
  }

  return [...unique].map((value, index) => ({
    id: index + 1,
    value,
    answer: value / 2,
  }));
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  tasks.forEach((task, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "task";
    wrapper.style.animationDelay = `${Math.min(i * 12, 360)}ms`;

    const label = document.createElement("label");
    const inputId = `ans-${task.id}`;
    label.setAttribute("for", inputId);
    label.textContent = `${task.value} : 2 =`;

    const input = document.createElement("input");
    input.type = "number";
    input.id = inputId;
    input.dataset.id = String(task.id);
    input.placeholder = "?";
    input.inputMode = "numeric";

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    tasksContainer.appendChild(wrapper);
  });
}

function resetResult() {
  resultContainer.className = "panel result";
  resultContainer.innerHTML = "";
}

function readInputValue(taskId) {
  const input = document.querySelector(`input[data-id='${taskId}']`);

  if (!input || input.value.trim() === "") {
    return null;
  }

  return Number(input.value);
}

function checkAnswers() {
  const mistakes = [];

  tasks.forEach((task) => {
    const input = document.querySelector(`input[data-id='${task.id}']`);
    const userValue = readInputValue(task.id);

    if (!input) {
      return;
    }

    input.classList.remove("ok", "bad");

    if (userValue === task.answer) {
      input.classList.add("ok");
      return;
    }

    input.classList.add("bad");
    mistakes.push({
      value: task.value,
      userValue,
      correct: task.answer,
    });
  });

  resultContainer.classList.add("show");

  if (mistakes.length === 0) {
    resultContainer.classList.add("good");
    resultContainer.classList.remove("bad");
    resultContainer.innerHTML = "<strong>Браво!</strong> Всички решения са верни.";
    return;
  }

  const items = mistakes
    .map((m) => {
      const userText = m.userValue === null ? "(няма отговор)" : m.userValue;
      return `<li>${m.value} : 2 = <strong>${m.correct}</strong>, твоят отговор: ${userText}</li>`;
    })
    .join("");

  resultContainer.classList.add("bad");
  resultContainer.classList.remove("good");
  resultContainer.innerHTML = `
    <strong>Има ${mistakes.length} грешки.</strong>
    <ul>${items}</ul>
  `;
}

function setup() {
  tasks = createTasks();
  renderTasks();
  resetResult();
}

checkBtn.addEventListener("click", checkAnswers);
generateBtn.addEventListener("click", setup);

setup();
