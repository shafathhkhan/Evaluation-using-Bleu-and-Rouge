// Show/hide translation language fields based on task selection
document.getElementById("task").addEventListener("change", function () {
    const task = this.value;
    document.getElementById("translationFields").style.display = task === "translation" ? "block" : "none";
});

// Function to generate reference text using the AI model
document.getElementById("generateReference").addEventListener("click", async function () {
    const task = document.getElementById("task").value;
    let inputText = document.getElementById("inputText").value;

    if (!inputText) {
        alert("Please enter input text!");
        return;
    }

    let requestData = { task, text: inputText };

    if (task === "translation") {
        requestData.sourceLang = document.getElementById("sourceLang").value;
        requestData.targetLang = document.getElementById("targetLang").value;
        if (!requestData.sourceLang || !requestData.targetLang) {
            alert("Please enter source and target languages!");
            return;
        }
    }

    const response = await fetch("/generate_reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    });

    const data = await response.json();

    if (data.error) {
        alert(`Error: ${data.error}`);
        return;
    }

    document.getElementById("referenceText").textContent = data.reference;
});

// Function to evaluate the user's generated output
document.getElementById("aiForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    evaluateOutput();
});

async function evaluateOutput() {
    const referenceText = document.getElementById("referenceText").textContent.trim();
    const userOutput = document.getElementById("userOutput").value.trim();

    if (!referenceText) {
        alert("Please generate the reference output first!");
        return;
    }
    if (!userOutput) {
        alert("Please enter your generated text!");
        return;
    }

    const response = await fetch("/evaluate_output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: referenceText, user_output: userOutput })
    });

    const data = await response.json();

    if (data.error) {
        alert(`Error: ${data.error}`);
        return;
    }

    // Displaying ROUGE, BLEU-1, and BLEU-2 Scores
    document.getElementById("rougeScore").textContent = `${data.rouge_score.toFixed(4)}`;
    document.getElementById("bleu1Score").textContent = `${data.bleu1_score.toFixed(4)}`;
}
