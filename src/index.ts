const FgRed = "\x1b[31m"

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/github') {
      return githubHook(req, url)
    }

    if (req.method === 'POST') {
      return Response.json({ data: await req.text() })
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
    const body = await req.json()

    console.log(body)

    return new Response('', { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    } else {
      console.log(FgRed + '%s\x1b[0m', "[ERROR]");
      console.error(error)
      console.log(FgRed + '%s\x1b[0m', "[/ERROR]");
    }
    return new Response('', { status: 400 })
  }
}

process.on('SIGINT',() => {
  server.stop()
})


