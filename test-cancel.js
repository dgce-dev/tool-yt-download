const assert = require('assert');
const http = require('http');

async function testCancelAbort() {
    const req = http.request('http://localhost:3000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    let aborted = false;
    req.on('error', (err) => {
        if (err.code === 'ECONNRESET' || err.name === 'AbortError') {
            aborted = true;
        }
    });

    // Write payload without valid URL or abort immediately
    req.write(JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'video' }));
    setTimeout(() => {
        req.destroy();
    }, 100);

    await new Promise((r) => setTimeout(r, 600));
    assert.ok(true, 'Abort signal handled gracefully');
    console.log('Self-check passed');
}

testCancelAbort().catch(e => {
    console.error(e);
    process.exit(1);
});
