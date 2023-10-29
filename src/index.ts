

Bun.serve({
  fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/github') {
      return githubHook(req, url)
    }


    return new Response('Hello World')
  },
})

// route matching
async function githubHook(req: Request, u: URL) {

  if (req.method !== 'POST') {
    return new Response('', { status: 405 })
  }

  const sig = req.headers.get('X-Hub-Signature')
  const event = req.headers.get('X-GitHub-Event')
  const id = req.headers.get('X-GitHub-Delivery')
  const isJson = req.headers.get('content-type') == 'application/json'

  if (!sig || !event || !id || !isJson) {
    return new Response('', { status: 401 })
  }

  try {
    const body = await req.text()
    const payload = JSON.parse(body)

    const repo = payload.repository.full_name

    console.log(payload)

    if (repo != 'ariaandika/dev-serve') {
      throw undefined
    }

    return new Response('', { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
    return new Response('', { status: 400 })
  }
}

