const API_URL = "https://backend-inven-fab24.onrender.com/api/v1"

function getInventary() {
    return fetch(`${API_URL}`)
        .then((response) => response.json())
}

function hasSavedEntry(code) {
    return fetch(`${API_URL}/check/${code}`) // /${code}
        .then((response) => response.json())
}

function sendEmail(jsonData) {
    return fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .catch(error => {
      throw error;
    });
}

export const apiService = {
    getInventary,
    sendEmail,
    hasSavedEntry,
}