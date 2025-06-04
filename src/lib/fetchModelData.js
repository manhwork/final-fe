/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       Promise that resolves to the response data
 */
async function fetchModel(url, options = {}) {
    try {
        // const baseUrl = "https://qhx7mt-8081.csb.app";
        const baseUrl = "http://localhost:8081";
        const response = await fetch(`${baseUrl}${url}`, {
            ...options,
            credentials: "include",
        });

        if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Unauthorized");
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export default fetchModel;
