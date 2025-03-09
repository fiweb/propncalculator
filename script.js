document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculate");
  const resetButton = document.getElementById("reset");
  const aInput = document.getElementById("a");
  const bInput = document.getElementById("b");
  const cInput = document.getElementById("c");
  const dInput = document.getElementById("d");

  calculateButton.addEventListener("click", function () {
    const a = aInput.value;
    const b = bInput.value;
    const c = cInput.value;
    const d = dInput.value;

    if (a === "x" || a === "X") {
      aInput.value = ((b * c) / d).toFixed(1);
    } else if (b === "x" || b === "X") {
      bInput.value = ((a * d) / c).toFixed(1);
    } else if (c === "x" || c === "X") {
      cInput.value = ((a * d) / b).toFixed(1);
    } else if (d === "x" || d === "X") {
      dInput.value = ((b * c) / a).toFixed(1);
    }
  });

  resetButton.addEventListener("click", function () {
    aInput.value = "";
    bInput.value = "";
    cInput.value = "";
    dInput.value = "";
  });

  const themeToggleButton = document.getElementById("theme-toggle-button");
  const body = document.body;
  const themeIconContainer = themeToggleButton.querySelector(
    ".theme-icon-container"
  );
  const storedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  function setThemeIcon(theme) {
    if (theme === "dark") {
      themeIconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" data-replit-metadata="client/src/components/ui/theme-toggle.tsx:18:10" data-component-name="Sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
    } else {
      themeIconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" data-replit-metadata="client/src/components/ui/theme-toggle.tsx:19:10" data-component-name="Moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
    }
  }

  if (storedTheme) {
    body.classList.add(storedTheme);
    setThemeIcon(storedTheme);
  }

  themeToggleButton.addEventListener("click", function () {
    body.classList.toggle("dark");
    let theme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    setThemeIcon(theme);
  });

  const calculatorToggleButton = document.getElementById(
    "calculator-toggle-button"
  );
  const calculatorContainer = document.querySelector(".calculator-container");

  const isCalcOpen = localStorage.getItem("calculatorOpen") === "true";

  if (isCalcOpen && window.innerWidth <= 768) {
    calculatorContainer.classList.add("active");
  }

  calculatorToggleButton.addEventListener("click", function () {
    calculatorContainer.classList.toggle("active");
    localStorage.setItem(
      "calculatorOpen",
      calculatorContainer.classList.contains("active")
    );
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      calculatorContainer.style.display = "block";
    } else if (!calculatorContainer.classList.contains("active")) {
      calculatorContainer.style.display = "none";
    }
  });

  const calculatorInput = document.getElementById("calculator-input");
  const calcButtons = document.querySelectorAll(".calc-btn");
  const clearButton = document.getElementById("calc-clear");
  const equalsButton = document.getElementById("calc-equals");
  const backspaceButton = document.getElementById("calc-backspace");

  let currentValue = "";
  let currentOperation = null;
  let previousValue = "";
  let shouldResetInput = false;

  calculatorInput.value = "0";

  calcButtons.forEach((button) => {
    if (
      button.id !== "calc-clear" &&
      button.id !== "calc-equals" &&
      button.id !== "calc-backspace"
    ) {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");

        if (button.classList.contains("operator")) {
          handleOperator(value);
        } else {
          appendNumber(value);
        }
      });
    }
  });

  clearButton.addEventListener("click", () => {
    clear();
  });

  equalsButton.addEventListener("click", () => {
    calculate();
  });

  backspaceButton.addEventListener("click", () => {
    backspace();
  });

  function appendNumber(number) {
    if (calculatorInput.value === "0" || shouldResetInput) {
      calculatorInput.value = "";
      shouldResetInput = false;
    }

    if (number === "." && calculatorInput.value.includes(".")) {
      return;
    }

    calculatorInput.value += number;
  }

  function handleOperator(operator) {
    if (currentOperation !== null) {
      calculate();
    }

    previousValue = calculatorInput.value;
    currentOperation = operator;
    shouldResetInput = true;
  }

  function calculate() {
    if (currentOperation === null || shouldResetInput) {
      return;
    }

    const prev = parseFloat(previousValue);
    const current = parseFloat(calculatorInput.value);
    let result;

    switch (currentOperation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
        return;
    }

    if (!isFinite(result)) {
      calculatorInput.value = "Error";
    } else {
      result = parseFloat(result.toFixed(8));
      calculatorInput.value = result;
    }

    currentOperation = null;
    shouldResetInput = true;
  }

  function clear() {
    calculatorInput.value = "0";
    currentOperation = null;
    previousValue = "";
    shouldResetInput = false;
  }

  function backspace() {
    if (shouldResetInput || calculatorInput.value === "Error") {
      calculatorInput.value = "0";
      shouldResetInput = false;
      return;
    }

    if (calculatorInput.value.length > 1) {
      calculatorInput.value = calculatorInput.value.slice(0, -1);
    } else {
      calculatorInput.value = "0";
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key >= "0" && event.key <= "9") {
      appendNumber(event.key);
    } else if (event.key === ".") {
      appendNumber(".");
    } else if (
      event.key === "+" ||
      event.key === "-" ||
      event.key === "*" ||
      event.key === "/"
    ) {
      handleOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      calculate();
    } else if (
      event.key === "Escape" ||
      event.key === "c" ||
      event.key === "C"
    ) {
      clear();
    } else if (event.key === "Backspace") {
      backspace();
    }
  });
});
