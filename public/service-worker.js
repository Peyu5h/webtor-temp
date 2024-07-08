// public/service-worker.js
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Check if the request URL matches common patterns of ad-related URLs
  if (
    url.hostname.includes("ads") ||
    url.pathname.includes("/ad/") ||
    url.search.includes("ad=true")
  ) {
    console.log(`Blocked ad request: ${event.request.url}`);
    event.respondWith(new Response("", { status: 204 })); // Block the request
  } else {
    event.respondWith(fetch(event.request)); // Allow the request
  }
});
