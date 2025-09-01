const express = require('express');
const app = express();
const PORT = 3004;

// Stockage des tickets en mémoire
const tickets = new Map();
const users = {
  'test': { password: 'test', email: 'test@test.com', firstName: 'Test', lastName: 'User' },
  'admin': { password: 'admin', email: 'admin@test.com', firstName: 'Admin', lastName: 'User' },
  'root': { password: 'toto1234', email: 'root@toto.com', firstName: 'root', lastName: 'root' },
  'toto': { password: 'toto', email: 'root@toto.com', firstName: 'root', lastName: 'root' },
  'jules': { password: 'toto', email: 'root@toto.com', firstName: 'root', lastName: 'root' },
  'tim': { password: 'tim', email: 'root@toto.com', firstName: 'root', lastName: 'root' },
  'iris': { password: 'iris', email: 'root@toto.com', firstName: 'root', lastName: 'root' },
  'coucou': { password: 'coucou', email: 'root@toto.com', firstName: 'root', lastName: 'root' }

};

app.use(express.urlencoded({ extended: true }));

// Page de login
app.get('/cas/login', (req, res) => {
  const service = req.query.service;

  if (!service) {
    return res.status(400).send('Service parameter required');
  }

  res.send(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CAS Login</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg1: #0f172a;
      --bg2: #0b1220;
      --card: rgba(255,255,255,0.06);
      --glass: rgba(255,255,255,0.06);
      --accent: linear-gradient(135deg,#7c3aed 0%, #06b6d4 100%);
      --muted: rgba(255,255,255,0.6);
      --glass-border: rgba(255,255,255,0.08);
      font-family: 'Inter',system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      background: radial-gradient(1000px 600px at 10% 10%, rgba(99,102,241,0.08), transparent),
                  radial-gradient(900px 500px at 90% 90%, rgba(6,182,212,0.06), transparent),
                  linear-gradient(180deg,var(--bg1),var(--bg2));
      color: #e6eef8;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
    }
    .container{
      width:100%;
      max-width:440px;
      display:flex;
      gap:32px;
      align-items:center;
      justify-content:center;
    }

    .card{
      width:100%;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
      border: 1px solid var(--glass-border);
      padding:28px;
      border-radius:16px;
      box-shadow: 0 10px 30px rgba(2,6,23,0.6);
      backdrop-filter: blur(8px) saturate(120%);
    }

    form h2{margin:0 0 3px 0;font-size:18px}
    .hint{font-size:13px;color:var(--muted);margin-bottom:16px}

    .field{margin-bottom:14px}
    label{display:block;font-size:13px;color:var(--muted);margin-bottom:8px}
    input[type="text"], input[type="password"]{
      width:100%;
      padding:12px 14px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.02);
      color:inherit;
      outline:none;
      transition:all .18s ease;
      font-size:15px;
    }
    input::placeholder{color:rgba(230,238,248,0.45)}
    input:focus{box-shadow:0 6px 20px rgba(2,6,23,0.6); transform:translateY(-1px); border-color: rgba(124,58,237,0.8)}

    .controls{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
    .link{font-size:13px;color:#c7d2fe;text-decoration:none}
    .link:hover{text-decoration:underline}

    button[type="submit"]{
      width:100%;padding:12px 14px;border-radius:12px;border:0;
      background:var(--accent);color:white;font-weight:600;font-size:15px;cursor:pointer;
      box-shadow: 0 8px 30px rgba(99,102,241,0.18), inset 0 -2px 0 rgba(0,0,0,0.08);
      transition:transform .12s ease, box-shadow .12s ease;
    }
    button[type="submit"]:active{transform:translateY(1px)}

    .alt{display:flex;gap:8px;align-items:center;justify-content:center;margin-top:14px;font-size:13px;color:var(--muted)}

    /* small screens */
    @media (max-width:520px){
      .container{max-width:360px;padding:12px}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card" aria-labelledby="cas-heading">
      <div class="logo-wrap">
        <div>
          <h2 id="cas-heading">Temporary CAS Login</h2>
          <div class="hint">Sign in with the temporary credentials raphael gave you</div>
        </div>
      </div>

      <form method="post" action="/cas/login" novalidate>
        <!-- server-side: replace ${service} with the real service URL -->
        <input type="hidden" name="service" value="${service}" />

        <div class="field">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" inputmode="text" autocomplete="username" placeholder="e.g. jdoe" />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <div style="position:relative">
            <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Your password" />
            <button type="button" aria-label="Toggle password visibility" onclick="(function(){const p=document.getElementById('password'); p.type = p.type==='password' ? 'text' : 'password';})()" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;color:rgba(230,238,248,0.6);cursor:pointer;font-size:14px">Show</button>
          </div>
        </div>

        <div style="margin-top:18px">
          <button type="submit">Sign in</button>
        </div>

        <div class="alt" style="display:none">By signing in you agree to the institution's terms of use.</div>
      </form>
    </div>
  </div>

  <script>
    // small enhancement: prevent form submit on empty required fields and show native message
    (function(){
      const form = document.querySelector('form');
      form.addEventListener('submit', (e)=>{
        if (!form.checkValidity()){
          e.preventDefault();
          form.reportValidity();
        }
      });
    })();
  </script>
</body>
</html>

  `);
});

// Traitement du login
app.post('/cas/login', (req, res) => {
  const { username, password, service } = req.body;

  if (users[username] && users[username].password === password) {
    // Générer un ticket
    const ticket = `ST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    tickets.set(ticket, { username, service, timestamp: Date.now() });

    // Rediriger avec le ticket
    const redirectUrl = `${service}${service.includes('?') ? '&' : '?'}ticket=${ticket}`;
    res.redirect(redirectUrl);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Validation du ticket
app.get(['/cas/serviceValidate', '/cas/p3/serviceValidate'], (req, res) => {
  const { service, ticket } = req.query;

  console.log(`Validating ticket: ${ticket} for service: ${service}`);

  if (!ticket || !service) {
    return res.status(400).send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_REQUEST">
          Missing required parameters
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  const ticketData = tickets.get(ticket);

  if (!ticketData) {
    return res.send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_TICKET">
          Ticket ${ticket} not recognized
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  // Vérifier que le service correspond
  if (ticketData.service !== service) {
    return res.send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_SERVICE">
          Service mismatch
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  // Supprimer le ticket (usage unique)
  tickets.delete(ticket);

  const user = users[ticketData.username];

  // Réponse de succès
  res.set('Content-Type', 'application/xml');
  res.send(`
    <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
      <cas:authenticationSuccess>
        <cas:user>${ticketData.username}</cas:user>
        <cas:attributes>
          <cas:email>${user.email}</cas:email>
          <cas:firstName>${user.firstName}</cas:firstName>
          <cas:lastName>${user.lastName}</cas:lastName>
        </cas:attributes>
      </cas:authenticationSuccess>
    </cas:serviceResponse>
  `);
});

// Logout
app.get('/cas/logout', (req, res) => {
  res.send('<h2>Logged out successfully</h2>');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CAS Server running on http://0.0.0.0:${PORT}`);
});
