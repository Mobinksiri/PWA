if ("serviceWorker" in navigator) {
   navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Workers registered!", reg))
      .catch((err) => console.log("Service Workers not registered!!", err));
}
