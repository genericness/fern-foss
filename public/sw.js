/*global UVServiceWorker,__uv$config*/
/*
 * Service worker supporting both Ultraviolet and Scramjet modes.
 */

importScripts('/vu/fern.bundle.js')
importScripts('/vu/fern.config.js')
importScripts(__uv$config.sw || '/vu/fern.sw.js')

importScripts("/scramjet/scramjet.all.js")

const uv = new UVServiceWorker()

let scramjet = null
let scramjetInitialized = false

async function getScramjet() {
	if (!scramjet) {
		const { ScramjetServiceWorker } = $scramjetLoadWorker()
		scramjet = new ScramjetServiceWorker()
	}
	return scramjet
}

async function handleRequest(event) {
	const url = new URL(event.request.url)
	if (url.pathname.startsWith('/scrammy/')) {
		try {
			const s = await getScramjet()
			if (!scramjetInitialized) {
				try {
					await s.loadConfig()
					scramjetInitialized = true
				} catch (e) {
					return new Response(`
						<!DOCTYPE html>
						<html>
						<head>
							<meta http-equiv="refresh" content="0.5">
							<style>
								body { font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #1a1a1a; color: #fff; }
								.loader { text-align: center; }
								.spinner { border: 3px solid #333; border-top: 3px solid #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
								@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
							</style>
						</head>
						<body>
							<div class="loader">
								<div class="spinner"></div>
							<p>Initializing content handler...</p>
							</div>
						</body>
						</html>
					`, { 
						status: 200,
						headers: { 'Content-Type': 'text/html' }
					})
				}
			}
			if (s.route(event)) {
				return await s.fetch(event)
			}
		} catch (e) {
			return new Response('Request handler error: ' + e.message, { status: 500 })
		}
	}
	
	if (uv.route(event)) {
		return await uv.fetch(event)
	}

	return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event))
})
