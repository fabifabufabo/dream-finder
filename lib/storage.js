const fs = require("fs").promises;

async function saveData(fileName, data) {
  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Erro ao salvar o JSON:", err.message);
  }
}

module.exports = { saveData };
