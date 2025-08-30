module.exports = {
    port: 3004,
    host: '0.0.0.0',
    casPath: '/cas',
    ssl: {
        enabled: false
    },
    serviceRegistry: {
        allowAnyService: true,
    },
    users: [
        {
            username: 'root',
            password: 'toto',
	    attributes: {
                email: 'root@example.com',
                firstName: 'Test',
                lastName: 'User'
            }
        },
        {
            username: 'test',
            password: 'toto',
            attributes: {
                email: 'test@example.com',
                firstName: 'Toto',
                lastName: 'Tamer'
            }
        }
    ]
};
