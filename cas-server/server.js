// cas-server/server.js
const express = require('express');
const app = express();
const PORT = 3004;

// Stockage des tickets en mémoire
const tickets = new Map();
const users = {
  'test': { password: 'test', email: 'test@test.com', firstName: 'Test', lastName: 'User' },
  'admin': { password: 'admin', email: 'admin@test.com', firstName: 'Admin', lastName: 'User' }
};

app.use(express.urlencoded({ extended: true }));

// Page de login
app.get('/cas/login', (req, res) => {
  const service = req.query.service;
  
  if (!service) {
    return res.status(400).send('Service parameter required');
  }
  
  res.send(`
    <html>
      <body>
        <h2>CAS Login</h2>
        <form method="post" action="/cas/login">
          <input type="hidden" name="service" value="${service}" />
          <label>Username: <input type="text" name="username" value="test" /></label><br/>
          <label>Password: <input type="password" name="password" value="test" /></label><br/>
          <button type="submit">Login</button>
        </form>
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
app.get('/cas/serviceValidate', (req, res) => {
  const { service, ticket } = req.query;
  
  console.log(`Validating ticket: ${ticket} for service: ${service}`);
  
  if (!ticket || !service) {
    return res.status(400).send(`
      <cas:serviceResponse>
        <cas:authenticationFailure code="INVALID_REQUEST">
          Missing required parameters
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }
  
  const ticketData = tickets.get(ticket);
  
  if (!ticketData) {
    return res.send(`
      <cas:serviceResponse>
        <cas:authenticationFailure code="INVALID_TICKET">
          Ticket ${ticket} not recognized
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }
  
  // Vérifier que le service correspond
  if (ticketData.service !== service) {
    return res.send(`
      <cas:serviceResponse>
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
    <cas:serviceResponse>
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