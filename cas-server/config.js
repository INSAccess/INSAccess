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
            username: 'test',
            password: 'test',
            attributes: {
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User'
            }
        }
    ]
};